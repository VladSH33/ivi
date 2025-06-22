import { Model } from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import { UserType } from "@/entities/User";
import { MovieType } from "@/entities/Movie";
import { FilterItem } from "@/entities/Filter";

const UserModel: ModelDefinition<UserType> = Model.extend({});
const MovieModel: ModelDefinition<MovieType> = Model.extend({});
const FilterModel: ModelDefinition<FilterItem> = Model.extend({});

export const models = {
  user: UserModel,
  movie: MovieModel,
  filter: FilterModel,
  supportChat: Model,
  supportMessage: Model,
};
