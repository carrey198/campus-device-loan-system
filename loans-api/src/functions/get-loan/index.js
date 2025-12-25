"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const cosmos_loan_repo_1 = require("../infra/cosmos-loan-repo");
functions_1.app.http("get-loan", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "loans/{id}",
    handler: async (req, context) => {
        const id = req.params.id;
        // ⭐ 日志：记录查询 id
        context.log("GetLoan called", { id });
        const repo = new cosmos_loan_repo_1.CosmosLoanRepo();
        const loan = await repo.getLoan(id);
        if (!loan) {
            // ⭐ 日志：未找到
            context.log("Loan not found", { id });
            return { status: 404, jsonBody: { message: "Loan not found" } };
        }
        // ⭐ 日志：找到 loan
        context.log("Loan found", { loan });
        return { status: 200, jsonBody: loan };
    }
});
