import { app } from "@azure/functions";

import "./functions/get-devices";
import "./functions/list-loans";
import "./functions/get-loan";
import "./functions/add-loan";
import "./functions/reserve";
import "./functions/return";

console.log("✅ Azure Functions app started (DEMO MODE)");
