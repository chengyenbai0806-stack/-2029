import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";

const app = new Hono().basePath('/make-server-810daab7');

// 處理 CORS，這能解決連線逾時問題
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'apikey'],
}));

// 獲取清單
app.get("/listings", async (c) => {
  try {
    const data = await kv.getByPrefix("listing:");
    return c.json({ listings: data || [] });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 新增清單
app.post("/listings", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `listing:${Date.now()}`;
    const item = { ...body, id };
    await kv.set(id, item);
    return c.json({ listing: item }, 201);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);