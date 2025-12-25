"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reserveDevice = reserveDevice;
const functions_1 = require("@azure/functions");
const productRepository_1 = require("../infra/productRepository");
const loanRepository_1 = require("../infra/loanRepository");
const EventGridPublisher_1 = require("../infra/EventGridPublisher");
const errors_1 = require("../shared/errors");
const crypto_1 = __importDefault(require("crypto"));
// -------- 仓储初始化 --------
const productRepo = new productRepository_1.ProductRepository();
const loanRepo = new loanRepository_1.LoanRepository();
const eventPublisher = new EventGridPublisher_1.EventGridPublisher();
// =============================================================
//  POST /reserve  —— 主处理逻辑
// =============================================================
async function reserveDevice(req, context) {
    context.log("POST /reserve called");
    // ---------- 读取 body ----------
    const body = (await req.json().catch(() => null)) || {};
    const userId = body.userId;
    const productId = body.productId;
    // ---------- 输入校验 ----------
    if (!userId || !productId) {
        throw new errors_1.ValidationError("userId and productId are required.");
    }
    try {
        // ---------- 步骤 1：减少库存（自动处理 waitlist / 并发冲突） ----------
        const product = await productRepo.decreaseStock(productId, userId);
        // 若库存耗尽，同时用户在 waitlist → 返回提示
        if (product.quantityAvailable <= 0 && product.waitlist.includes(userId)) {
            return {
                status: 200,
                jsonBody: {
                    message: "No stock available. You are added to waitlist.",
                    waitlist: product.waitlist.length
                }
            };
        }
        // ---------- 步骤 2：创建 Loan ----------
        const loanId = crypto_1.default.randomUUID();
        const createdAt = new Date();
        const dueAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000); // 标准 2 天
        const loan = {
            id: loanId,
            userId,
            productId,
            createdAt: createdAt.toISOString(),
            dueAt: dueAt.toISOString(),
            status: "reserved"
        };
        await loanRepo.createLoan(loan);
        // ---------- 步骤 3：发布 Event Grid 事件 ----------
        await eventPublisher.publish("loan.created", `loan/${loanId}`, loan);
        // ---------- 返回成功 ----------
        return {
            status: 200,
            jsonBody: {
                message: "Device reserved successfully",
                loan
            }
        };
    }
    catch (err) {
        context.error("reserveDevice error: ", err);
        // Cosmos DB 乐观并发冲突
        if (err.code === 412) {
            return {
                status: 409,
                jsonBody: { error: "Concurrency conflict. Try again." }
            };
        }
        if (err instanceof errors_1.ResourceNotFoundError) {
            return { status: 404, jsonBody: { error: err.message } };
        }
        if (err instanceof errors_1.ValidationError) {
            return { status: 400, jsonBody: { error: err.message } };
        }
        return {
            status: 500,
            jsonBody: { error: "Internal server error" }
        };
    }
}
// =============================================================
//  Azure Function 触发器配置
// =============================================================
functions_1.app.http("reserve", {
    methods: ["POST"],
    route: "reserve",
    authLevel: "anonymous",
    handler: reserveDevice
});
