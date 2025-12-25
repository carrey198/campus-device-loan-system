"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDevice = collectDevice;
const functions_1 = require("@azure/functions");
const loanRepository_1 = require("../infra/loanRepository");
const EventGridPublisher_1 = require("../infra/EventGridPublisher");
const errors_1 = require("../shared/errors");
const loanRepo = new loanRepository_1.LoanRepository();
const eventPublisher = new EventGridPublisher_1.EventGridPublisher();
// =======================================
// POST /collect   { loanId }
// =======================================
async function collectDevice(req, context) {
    context.log("POST /collect called");
    // ---- Parse request body safely ----
    const body = (await req.json().catch(() => null)) || {};
    const loanId = body.loanId;
    if (!loanId) {
        throw new errors_1.ValidationError("loanId is required.");
    }
    try {
        // ---- 1. Read loan record ----
        const loan = await loanRepo.getLoan(loanId);
        if (!loan)
            throw new errors_1.ResourceNotFoundError("Loan not found.");
        // ---- 2. Validate loan status ----
        if (loan.status === "collected") {
            return {
                status: 200,
                jsonBody: {
                    message: "Loan already collected.",
                    loan
                }
            };
        }
        if (loan.status !== "reserved") {
            return {
                status: 400,
                jsonBody: {
                    error: `Loan cannot be collected when status is '${loan.status}'.`
                }
            };
        }
        // ---- 3. Update loan status ----
        loan.status = "collected";
        loan.collectedAt = new Date().toISOString();
        await loanRepo.updateLoan(loan);
        // ---- 4. Publish EventGrid event ----
        await eventPublisher.publish("loan.collected", `loan/${loanId}`, loan);
        return {
            status: 200,
            jsonBody: {
                message: "Device collected successfully.",
                loan
            }
        };
    }
    catch (err) {
        context.error("collect error:", err);
        if (err instanceof errors_1.ValidationError || err instanceof errors_1.ResourceNotFoundError) {
            return {
                status: 400,
                jsonBody: { error: err.message }
            };
        }
        return {
            status: 500,
            jsonBody: { error: "Internal server error" }
        };
    }
}
// Azure Function binding
functions_1.app.http("collect", {
    methods: ["POST"],
    route: "collect",
    authLevel: "anonymous",
    handler: collectDevice
});
