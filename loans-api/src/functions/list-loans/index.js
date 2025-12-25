"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLoans = listLoans;
const functions_1 = require("@azure/functions");
const loanRepository_1 = require("../infra/loanRepository");
const errors_1 = require("../shared/errors");
// 初始化仓储
const loanRepo = new loanRepository_1.LoanRepository();
// =============================================================
//   GET /loans?userId=xxx
// =============================================================
async function listLoans(req, context) {
    context.log("GET /loans called");
    const userId = req.query.get("userId");
    if (!userId) {
        throw new errors_1.ValidationError("Query parameter 'userId' is required.");
    }
    try {
        // Cosmos DB 查询用户所有借用记录
        const query = {
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [{ name: "@userId", value: userId }]
        };
        const { resources } = await loanRepo.container.items
            .query(query)
            .fetchAll();
        return {
            status: 200,
            jsonBody: {
                count: resources.length,
                loans: resources
            }
        };
    }
    catch (err) {
        context.error("listLoans error:", err);
        if (err instanceof errors_1.ValidationError) {
            return { status: 400, jsonBody: { error: err.message } };
        }
        return {
            status: 500,
            jsonBody: { error: "Internal server error" }
        };
    }
}
// Azure Function Trigger
functions_1.app.http("list-loans", {
    methods: ["GET"],
    route: "loans",
    authLevel: "anonymous",
    handler: listLoans
});
