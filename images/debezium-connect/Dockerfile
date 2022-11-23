FROM quay.io/debezium/connect:2.0
ENV KAFKA_CONNECT_PLUGINS_DIR=/kafka/connect
ENV KAFKA_CONNECT_CUSTOM=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-custom

ADD debezium-connector-mysql/* /kafka/libs

# Install connector libs for debezium
ADD kafka-connect-avro-converter-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-avro-serializer-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-schema-registry-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-schema-registry-client-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD common-config-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD common-utils-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-streams-avro-serde-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-schema-serializer-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD guava-31.1-jre.jar $KAFKA_CONNECT_CUSTOM/
ADD avro-1.11.1.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-connect-avro-data-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD kafka-schema-converter-7.3.0.jar $KAFKA_CONNECT_CUSTOM/
ADD failureaccess-1.0.1.jar $KAFKA_CONNECT_CUSTOM/
