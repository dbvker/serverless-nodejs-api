const serverless = require("serverless-http");
const { neon } = require("@neondatabase/serverless");
const express = require("express");
import type { Request, Response, NextFunction } from "express";

const app = express();

async function dbClient() {
  return neon(process.env.DATABASE_URL ?? "");
}

app.get("/", async ({ req, res, next }: ApiParamsType) => {
  const sql = await dbClient();
  const [results] = await sql`select now()`;
  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
  });
});

app.get("/hello", ({ req, res, next }: ApiParamsType) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use(({ req, res, next }: ApiParamsType) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);

// Types
type ApiParamsType = {
  req: Request;
  res: Response;
  next?: NextFunction;
};
