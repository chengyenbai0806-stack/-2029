import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono().basePath('/make-server-810daab7');
app.use('*', cors({ origin: '*' }));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

app.get("/listings", async (c) => {
  const { data, error } = await supabase
    .from('fruit')
    .select('*');

  if (error) return c.json({ error: error.message }, 500);

  // 重點：把中文欄位轉換成前端認識的英文
  const formattedData = data.map(item => ({
    id: item.id,
    title: item.名稱,      // 把「名稱」轉成 title
    originalPrice: item.原價, // 把「原價」轉成 originalPrice
    price: item.折扣後,     // 把「折扣後」轉成 price
    stock: item.庫存,      // 把「庫存」轉成 stock
    location: item.商家名稱, // 把「商家名稱」轉成 location
    image: item.image || "https://placehold.co/600x400?text=Food" // 預防圖片缺失
  }));

  return c.json({ listings: formattedData });
});

Deno.serve(app.fetch);