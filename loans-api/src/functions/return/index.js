"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnLoan = returnLoan;
const cosmos_1 = require("@azure/cosmos");
const devices_client_1 = require("../shared/devices-client");
const client = new cosmos_1.CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
});
const dbName = process.env.COSMOS_DB;
const loansContainer = "loans";
async function returnLoan(req, context) {
    const loanId = req.params.loanId;
    if (!loanId) {
        return { status: 400, jsonBody: { error: "loanId required" } };
    }
    const loans = client.database(dbName).container(loansContainer);
    // 1️⃣ 读取 Loan
    const { resource: loan } = await loans.item(loanId, loanId).read();
    if (!loan) {
        return { status: 404, jsonBody: { error: "Loan not found" } };
    }
    if (loan.status === "returned") {
        return { status: 400, jsonBody: { error: "Loan already returned" } };
    }
    // 2️⃣ 调用 devices-api 释放库存
    const devicesClient = new devices_client_1.DevicesClient();
    await devicesClient.releaseDevice(loan.productId);
    // 3️⃣ 更新 Loan 状态
    loan.status = "returned";
    loan.returnedAt = new Date().toISOString();
    await loans.items.upsert(loan);
    return {
        status: 200,
        jsonBody: {
            message: "Loan returned successfully",
            loan
        }
    };
}
