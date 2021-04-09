/* eslint-disable import/first */

require("dotenv").config();

import * as express from "express";
import * as morgan from "morgan";

import { Config } from "./config";
import { execute, list } from "./controllers/controller";

import { connect } from "./data/mongo";

const app = express();
const routes = express.Router();

interface Result { success: boolean, error?: string, data?: {} }

async function preset () {
  const url = Config.MONGO_DB_URL;
  await connect(url);

  createLoggerMiddleware();
  createRouteMiddleware();
}

function createLoggerMiddleware () {
  app.use(morgan("dev"));
}

function createRouteMiddleware () {
  configRoutes();

  app.use("/", routes);
}

function configRoutes () {
  routes.get("/data/list/", async (_request: express.Request, response: express.Response) => setResponse(await list(), response));
  routes.post("/data/insert/", async (_request: express.Request, response: express.Response) => setResponse(await execute(Config), response));

  return routes;
}

function setResponse (result: Result, response: express.Response<any, Record<string, any>>) {
  if (!result.success) {
    response.statusCode = 400;
  }

  response.json(result);
}

(async () => {
  await preset();

  const port = Config.PORT;

  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
})();
