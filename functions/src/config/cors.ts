import * as Express from "express";

export default function cors(req: Express.Request, res: Express.Response, next: Express.NextFunction): Express.Response | void {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-request-id",
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET");
    return res.status(200).send();
  }

  return next();
}
