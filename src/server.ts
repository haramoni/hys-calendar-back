import "dotenv/config";
import cors from "@fastify/cors";
import { buildApp } from "./app";

async function start() {
  const app = await buildApp();
  const port = Number(process.env.PORT || 3333);

  const allowedOrigins = [
    "http://localhost:5173",
    "http://hys-expor-stands.com.br/",
    "https://www.seudominio.com",
  ];

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }

      cb(new Error("Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  try {
    await app.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
