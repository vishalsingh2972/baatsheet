import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { httpStatus } from "./shared/http-status";

import config from "./config";

const app: Application = express();

const configuredOrigins = (config.client_url || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (like mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // In non-production, allow all
      if (config.env !== "production") {
        return callback(null, true);
      }

      // Check allowed origins list, wildcard, or Vercel preview domains
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes("*") ||
        normalizedOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Increase JSON and URL-encoded body limits for image uploads (25MB)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// API Routes mounting
app.use("/api/v1", routes);
app.use("/api", routes); // backwards compatibility for /api

// Root welcome route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to Google Form Clone API!",
    version: "1.0.0",
    health: "/health",
    api: "/api/v1",
  });
});

// Healthcheck route
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    message: "Google Form Backend is running",
    timestamp: new Date(),
  });
});

// Handle Not Found Routes (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Endpoint Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Endpoint Not Found",
      },
    ],
  });
});

// Global Error Handler (Must be placed after all routes and handlers)
app.use(globalErrorHandler);

export default app;
