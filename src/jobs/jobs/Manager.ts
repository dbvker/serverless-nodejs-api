import { ApiResponse, BaseHandler } from "../../core/BaseHandler.js";
import { JobsExternal } from "./types.js";

export class JobsManager extends BaseHandler {
  get(qs: { search?: string }): ApiResponse<JobsExternal> {
    console.log("QS: ", qs);
    return {
      data: {
        id: "id",
        name: "Name",
        message: "GET Jobs",
      },
    };
  }

  post(body: { jobName: string }) {
    return {
      data: {
        message: `POST Jobs with name ${body.jobName}`,
      },
    };
  }
}
