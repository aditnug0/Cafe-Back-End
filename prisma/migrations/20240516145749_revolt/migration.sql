/*
  Warnings:

  - You are about to drop the column `customer_name` on the `order_list` table. All the data in the column will be lost.
  - You are about to drop the column `table_number` on the `order_list` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order_list` DROP COLUMN `customer_name`,
    DROP COLUMN `table_number`,
    ADD COLUMN `cust_id` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `order_list` ADD CONSTRAINT `order_list_cust_id_fkey` FOREIGN KEY (`cust_id`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
