import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// 1. 啟用日誌 (方便在後台 Logs 查看問題)
app.use('*', logger(console.log));

// 2. 【核心修正】強效 CORS 處理
// 手動攔截所有 OPTIONS 請求並立即回覆，防止 546 Timeout
app.all("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  await next();
});

// 保留基本的 CORS 中間件處理一般請求
app.use(
  "*",
  cors({
    origin: "*", 
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
  }),
);

// --- 路由邏輯 ---

// 提供 Google Maps API Key
app.get("/maps-key", (c) => {
  try {
    // 優先從環境變數讀取
    const googleKey = Deno.env.get("GOOGLE_MAPS_API_KEY") || Deno.env.get("googleAPI");
    
    if (!googleKey) {
      console.error("後台 Secrets 未設定 GOOGLE_MAPS_API_KEY");
      return c.json({ error: "伺服器未設定 API Key" }, 500);
    }
    
    return c.json({ apiKey: googleKey });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// 取得所有列表
app.get("/listings", async (c) => {
  try {
    const listings = await kv.getByPrefix("listing:");
    return c.json({ listings: listings || [] });
  } catch (error) {
    return c.json({ error: `Failed to fetch: ${(error as Error).message}` }, 500);
  }
});

// 新增列表
app.post("/listings", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `listing:${Date.now()}`;
    const listingData = { ...body, id };
    await kv.set(id, listingData);
    return c.json({ listing: listingData }, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// 建立新訂單
app.post("/appointments", async (c) => {
  try {
    const appointment = await c.req.json();
    const id = `appointment:${Date.now()}`;
    const appointmentData = { ...appointment, id, createdAt: new Date().toISOString() };
    await kv.set(id, appointmentData);
    return c.json({ appointment: appointmentData }, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// 取得所有預約
app.get("/appointments", async (c) => {
  try {
    const appointments = await kv.getByPrefix("appointment:");
    return c.json({ appointments: appointments || [] });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// 健康檢查
app.get("/health", (c) => c.json({ status: "ok" }));

Deno.serve(app.fetch);