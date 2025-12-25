"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const cosmosClient_1 = require("./cosmosClient");
const errors_1 = require("../shared/errors");
class ProductRepository {
    constructor() {
        this.container = (0, cosmosClient_1.getProductsContainer)();
    }
    async getById(id) {
        try {
            const { resource } = await this.container.item(id, id).read();
            if (!resource)
                throw new errors_1.ResourceNotFoundError("Product not found");
            return resource;
        }
        catch (err) {
            if (err.code === 404) {
                throw new errors_1.ResourceNotFoundError("Product not found");
            }
            throw err;
        }
    }
    // 减少库存并返回更新后的产品，使用 ETag 防止并发冲突
    async decreaseStock(id, userId) {
        const { resource: product, etag } = await this.container.item(id, id).read();
        if (!product) {
            throw new errors_1.ResourceNotFoundError("Product not found");
        }
        // 库存不足 → 加等待队列
        if (product.quantityAvailable <= 0) {
            product.waitlist = product.waitlist || [];
            product.waitlist.push(userId);
            await this.container
                .item(id, id)
                .replace(product, {
                accessCondition: { type: "IfMatch", condition: etag }
            });
            return product;
        }
        // 库存足够 → 减一
        product.quantityAvailable -= 1;
        const updateResult = await this.container
            .item(id, id)
            .replace(product, {
            accessCondition: { type: "IfMatch", condition: etag }
        });
        return updateResult.resource;
    }
    // 用于归还设备：库存 +1
    async increaseStock(id) {
        const { resource: product, etag } = await this.container.item(id, id).read();
        if (!product)
            throw new errors_1.ResourceNotFoundError("Product not found");
        product.quantityAvailable += 1;
        const updateResult = await this.container
            .item(id, id)
            .replace(product, {
            accessCondition: { type: "IfMatch", condition: etag }
        });
        return updateResult.resource;
    }
}
exports.ProductRepository = ProductRepository;
