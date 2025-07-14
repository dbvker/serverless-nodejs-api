// TODO: env might not be working properly
// TODO: Only 1 lambda function is being created. I don't this this is correct
const serverless = require("serverless-http");
const express = require("express");
const AWS = require("aws-sdk");
const { neon } = require("@neondatabase/serverless");
import type { Request, Response, NextFunction } from "express";
import { RouteRegistrar } from "./routes";

const app = express();
const ssm = new AWS.SSM({ region: process.env.AWS_REGION ?? "us-east-2" });
const registrar = new RouteRegistrar(app);

async function dbClient() {
  const paramStoreData = await ssm
    .getParameter({
      Name: process.env.DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    })
    .promise();

  return neon(paramStoreData.Parameter.Value ?? "");
}

registrar.registerAll();

app.get("/", async ({ req, res, next }: ApiParamsType) => {
  const sql = await dbClient();
  const [results] = await sql`select now()`;
  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
  });
});

app.get("/routes", ({ req, res }: ApiParamsType) => {
  const routes: string[] = [];

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // routes registered directly on the app
      const methods = Object.keys(middleware.route.methods)
        .join(", ")
        .toUpperCase();
      routes.push(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach((handler: any) => {
        const route = handler.route;
        if (route) {
          const methods = Object.keys(route.methods).join(", ").toUpperCase();
          routes.push(`${methods} ${route.path}`);
        }
      });
    }
  });

  res.json({ routes });
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
