import { Express } from "express";
import { BaseHandler, RouterManager } from "./core/index";
import { JobsManager } from "./jobs/jobs/Manager";

export class RouteRegistrar {
  private app: Express;
  private routes: Record<string, BaseHandler>;

  constructor(app: Express) {
    this.app = app;

    // Instantiate your managers here (alphabetical order)
    const jobsManager = new JobsManager();

    // Map route paths to manager instances
    this.routes = {
      jobs: jobsManager,
    };
  }

  public registerAll() {
    const routerManager = new RouterManager(this.app, this.routes);
    routerManager.registerRoutes();
  }
}
