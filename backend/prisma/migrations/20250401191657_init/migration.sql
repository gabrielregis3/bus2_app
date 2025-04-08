CREATE TABLE `Line` (
    `id` INTEGER NOT NULL,
    `code` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Line_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Trip` (
    `id` INTEGER NOT NULL,
    `line_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Stop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stop_id` INTEGER NOT NULL,
    `trip_id` INTEGER NOT NULL,
    `sequence` INTEGER NOT NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `stop_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Trip` ADD CONSTRAINT `Trip_line_id_fkey` FOREIGN KEY (`line_id`) REFERENCES `Line`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Stop` ADD CONSTRAINT `Stop_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
