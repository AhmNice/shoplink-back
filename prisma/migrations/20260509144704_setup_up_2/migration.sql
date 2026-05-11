-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "deliveryFee" INTEGER,
ADD COLUMN     "deliveryTime" TEXT DEFAULT '',
ADD COLUMN     "minOrder" INTEGER;
