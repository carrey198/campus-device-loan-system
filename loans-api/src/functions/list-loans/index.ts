// src/functions/list-loans/index.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// 👇 演示用的假数据（你可以自己改几条更贴近你系统的）
const MOCK_LOANS = [
  {
    id: "loan-001",
    userId: "test-user",
    deviceId: "dev-001",
    deviceName: "MacBook Pro",
    status: "active",
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "loan-002",
    userId: "test-user",
    deviceId: "dev-002",
    deviceName: "Dell XPS",
    status: "returned",
    createdAt: "2025-01-02T11:00:00Z",
  },
];

// 为了和 get-devices 保持一致，封一个统一的 CORS 头
function withCors(body: any, status: number = 200): HttpResponseInit {
  return {
    status,
    headers: {
      // 允许前端 http://localhost:5173 访问
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    jsonBody: body,
  };
}

export async function listLoansHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("GET /loans (DEMO MODE)");

  // 简单处理一下 userId 查询参数，方便以后扩展
  const userId = req.query.get("userId");

  if (!userId) {
    // 前端没传 userId 的话，给个错误信息
    return withCors(
      { error: "Query parameter 'userId' is required." },
      400
    );
  }

  // 根据 userId 过滤一下假数据（真正连 Cosmos 时换成查询）
  const loansForUser = MOCK_LOANS.filter((loan) => loan.userId === userId);

  return withCors(loansForUser, 200);
}

// 👇 重点：只注册 GET，route 是 "loans"
//    这样：
//      - GET  /api/loans?userId=xxx  -> list-loans
//      - POST /api/loans            -> add-loan
app.http("list-loans", {
  methods: ["GET"],      // ✅ 只保留 GET，千万不要加 OPTIONS / POST
  authLevel: "anonymous",
  route: "loans",
  handler: listLoansHandler,
});
