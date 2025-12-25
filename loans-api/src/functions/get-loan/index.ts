import { app } from "@azure/functions";

app.http("get-loan", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "loans/{id}",
  handler: async (req) => {
    if (req.method === "OPTIONS") return cors();
    return json({
      id: req.params.id,
      device: "MacBook Pro",
      user: "Alice",
      status: "active",
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
