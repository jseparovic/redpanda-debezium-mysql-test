import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import winston from 'winston';
const { combine, splat, timestamp, printf, colorize, align} = winston.format;
const colorizer = colorize();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        splat(),
        align(),
        printf((msg) => {
            const message= `${msg.timestamp} <${msg.level}> ${msg.message}`;
            return colorizer.colorize(msg.level, message);
        })
    ),
    transports: [new winston.transports.Console()],
});

const stringify = (obj: any) => {
    return JSON.stringify(obj, null, 4)
}

const LOOP_TIMEOUT = 15_000;

const CONNECTORS = 'connectors';

const PUBSUB_KAFKA = process.env['PUBSUB_KAFKA'];
const PUBSUB_CONNECT = process.env['PUBSUB_CONNECT'];
const MYSQL_HOST = process.env['MYSQL_HOST'];
const MYSQL_USER = process.env['MYSQL_USER'];
const MYSQL_PASS = process.env['MYSQL_PASS'];
const MYSQL_PORT = process.env['MYSQL_PORT'];

const defaultTopicConfig = {
    "topic.creation.default.replication.factor": 1,
    "topic.creation.default.partitions": 10,
    "topic.creation.default.cleanup.policy": 'compact',
    "topic.creation.default.retention.ms": 604800000,
    "topic.creation.default.segment.ms": 604800000,
    "topic.creation.default.segment.bytes": 10485760,
    "topic.creation.default.min.cleanable.dirty.ratio": 0.01,
    "topic.creation.default.compression.type": 'uncompressed',
}

const mysqlConfig = {
    "database.hostname": MYSQL_HOST,
    "database.port": MYSQL_PORT,
    "database.user": MYSQL_USER,
    "database.password": MYSQL_PASS,
}

const timeUtil = {
    sleep: async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};

const CORE_SOURCE_DB = "core-source-db";

export class PubSubConnect {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            validateStatus: (status) => {
                return status >= 200 && status <= 503;
            },
        });
    }
    
    async doRequest(requestConfig: AxiosRequestConfig, throw404?: boolean) {
        const response = await this.axios.request(requestConfig)
        const {status, statusText, config, request} = response;
        logger.debug("Response: %s", response);
        if(response?.status >= 200 && response?.status < 300) {
            return response;
        }
        if(!throw404 && response?.status === 404) {
            // Not found
            return undefined;
        }
        throw new AxiosError(
            "Request failed with status code " + status,
            statusText,
            config,
            request,
            response,
        )
    }

    async connectorExists (connectorName: string) {
        return this.doRequest({
            method: "GET",
            url: `${PUBSUB_CONNECT}/${CONNECTORS}/${connectorName}`,
        })
    }

    async setupConnector (connectorName: string, connectorDefinition: any) {
        let setup = false;
        while(!setup) {
            try {
                const connector = await this.connectorExists(connectorName);
                if (!connector?.data) {
                    const response = await this.doRequest({
                        method: "POST",
                        url: `${PUBSUB_CONNECT}/${CONNECTORS}`,
                        data: connectorDefinition,
                    }, true)
                    setup = true;
                    logger.info("Connector %s is setup:\n%s", connectorName, stringify(response?.data));
                }
            }
            catch (e) {
                const err = e as AxiosError;
                logger.warn("Error setting up %s. Retrying shortly...\n%s", connectorName, stringify(err));
            }
            finally {
                await timeUtil.sleep(LOOP_TIMEOUT);
            }
        }
    }

    getCorePolicySource(connectorName: string) {
        return {
            "name": connectorName,
            "config": {
                "database.server.id": 1,
                "connector.class": "io.debezium.connector.mysql.MySqlConnector",
                "name": connectorName,
                "tasks.max": "1",
                "column.propagate.source.type": ".+",
                "table.include.list": "core.Test",
                "topic.prefix": `connectTest`,
                "sanitize.field.names": true,
                "schema.history.internal.kafka.bootstrap.servers": PUBSUB_KAFKA,
                "schema.history.internal.kafka.topic": `connect-test.core.history`,
                ...mysqlConfig,
                ...defaultTopicConfig,
            }
        }
    }
    
    async main() {
        await this.setupConnector(
            CORE_SOURCE_DB, 
            this.getCorePolicySource(CORE_SOURCE_DB)
        );
        const done = false;
        while(!done) {
            try {
                // Main loop
            }
            catch(e) {
                logger.error("Error in main loop\n%s", e);
            }
            finally {
                await timeUtil.sleep(LOOP_TIMEOUT);
            }
        }
    }
}

new PubSubConnect().main();
