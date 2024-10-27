import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

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
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const users = await prisma.user.findMany();
  return c.html(
    <html>
      <body>
        <div>{await getCount()}</div>
        <div>{JSON.stringify(users)}</div>
      </body>
    </html>
  );
});

export default app;
