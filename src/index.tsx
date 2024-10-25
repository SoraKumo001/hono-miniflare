import { Hono } from "hono";

const app = new Hono();

const getCount = async () => {
  const cache = await caches.open("hono-ssr-react-miniflare");
  const url = new URL("/count", "http://localhost");
  const cachedResponse = await cache.match(url);
  const count = cachedResponse ? parseInt(await cachedResponse.text()) : 1;
  await cache.put(
    url,
    new Response((count + 1).toString(), {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "max-age=31536000",
      },
    })
  );
  return count;
};

app.get("*", async (c) => {
  return c.html(
    <html>
      <body>{await getCount()}</body>
    </html>
  );
});

export default app;
