

CREATE DATABASE IF NOT EXISTS core;
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'mysql';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

use core;
    
CREATE TABLE Test (
           PRIMARY KEY(id),
           `id` VARCHAR(256) NOT NULL,
           `systemId` int AUTO_INCREMENT UNIQUE NOT NULL,
           `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
           `createdBy` VARCHAR(256),
           `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
           `updatedBy` VARCHAR(256),
           `readOnly` boolean DEFAULT 0,
           `name` VARCHAR(256) UNIQUE,
           `description` text,
           `status` VARCHAR(256) DEFAULT 'New',
           `inputData` longtext,
           `outputData` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO Test (id, createdBy, updatedBy, name, description) values (uuid(), 'test', 'test', 'Test', 'This is a Test');
