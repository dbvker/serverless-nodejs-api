import { Express } from "express";
import { BaseHandler } from "./BaseHandler";

export class RouterManager {
  constructor(
    private app: Express,
    private resources: Record<string, BaseHandler>
  ) {}

  public registerRoutes() {
    for (const [path, controller] of Object.entries(this.resources)) {
      const basePath = `/${path}`;

      if (controller.get) {
        this.app.get(basePath, (req, res) => {
          const result = controller.get!(req.query);
          res.json(result);
        });
      }

      if (controller.post) {
        this.app.post(basePath, (req, res) => {
          const result = controller.post!(req.body);
          res.json(result);
        });
      }

      if (controller.put) {
        this.app.put(basePath, (req, res) => {
          const result = controller.put!(req.body);
          res.json(result);
        });
      }

      if (controller.delete) {
        this.app.delete(basePath, (req, res) => {
          const result = controller.delete!(req.body);
          res.json(result);
        });
      }
    }
  }
}
