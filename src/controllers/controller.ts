import { Config } from "../config";
import { Result } from "../prototypes/result";
import { execute as executePuppeter } from "../puppeteer/executor";
import { list as listRepositoryMongo } from "../data/repository-mongo";

export async function execute (config: typeof Config): Promise<Result> {
  const result: Result = { success: true };

  try {
    const insertedCount = await executePuppeter(config);
    result.data = {
      insertedCount
    };
  } catch (error) {
    result.success = false;
    result.error = error.message;
  }

  return result;
}

export async function list (): Promise<Result> {
  const result: Result = { success: true, data: {} };

  try {
    result.data = await listRepositoryMongo();
  } catch (error) {
    result.success = false;
    result.error = error.message;
  }

  return result;
}
