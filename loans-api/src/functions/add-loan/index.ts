import { app } from "@azure/functions";

app.http("add-loan", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "loans",
  handler: async (req) => {
    if (req.method === "OPTIONS") return cors();
    const body = await req.json();
    return json({
      message: "Loan created (demo)",
      loan: body,
    });
  },
});

const cors = () => ({ status: 204, headers: corsHeaders });
const json = (body: any) => ({ status: 200, headers: corsHeaders, jsonBody: body });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
