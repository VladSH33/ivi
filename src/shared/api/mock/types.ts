import { Registry } from "miragejs";
import Schema from "miragejs/orm/schema";

import { models } from "./models";

type AppRegistry = Registry<typeof models, {}>;
export type AppSchema = Schema<AppRegistry>;
