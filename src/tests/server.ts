import { setupServer } from "msw/node";
import restHandler from "./restHandlers";

export const server = setupServer(...restHandler);