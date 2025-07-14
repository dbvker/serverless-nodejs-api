export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type SchemaBodyType<REQ, RES> = {
  Request: REQ;
  Response: RES;
};

export type SchemaType<REQ = Record<string, any>, RES = Record<string, any>> = {
  get?: SchemaBodyType<REQ, RES>;
  post?: SchemaBodyType<REQ, RES>;
  put?: SchemaBodyType<REQ, RES>;
  delete?: SchemaBodyType<REQ, RES>;
};

export abstract class BaseHandler {
  schema: SchemaType = {};
  get?(query: any): ApiResponse<any> | Promise<ApiResponse<any>>;
  post?(body: any): ApiResponse<any> | Promise<ApiResponse<any>>;
  put?(body: any): ApiResponse<any> | Promise<ApiResponse<any>>;
  delete?(params: any): ApiResponse<any> | Promise<ApiResponse<any>>;
}