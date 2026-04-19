import "dotenv/config";
import cors from "@fastify/cors";
import { buildApp } from "./app";

async function start() {
  const app = await buildApp();
  const port = Number(process.env.PORT || 3333);

  await app.register(cors, {
    origin: ["https://hys-expor-stands.com.br"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  try {
    await app.listen({
      port,
      host: "0.0.0.0",
    });
  } catch (error) {
    process.exit(1);
  }
}

start();
