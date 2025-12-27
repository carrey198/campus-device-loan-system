import { app } from "@azure/functions";

import { getDevicesHandler } from "./functions/get-devices";
import { listLoansHandler } from "./functions/list-loans";
import { loanCreatedHandler } from "./functions/loan-created-handler";

// ===== HTTP FUNCTIONS =====

app.http("get-devices", {
  route: "devices",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: getDevicesHandler,
});

app.http("list-loans", {
  route: "loans",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: listLoansHandler,
});

// ===== EVENT GRID =====

app.eventGrid("loan-created-handler", {
  handler: loanCreatedHandler,
});

console.log("✅ Azure Functions app started");
