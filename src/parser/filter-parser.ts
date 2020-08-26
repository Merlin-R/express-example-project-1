import { Filter, FilterParser } from "@propero/easy-filter";
import { toMongoFilter } from "src/util";
import { FindConditions } from "typeorm";

const parser = new FilterParser();
export const parseFilter = (value?: string): undefined | Filter => (value ? parser.parse(value) : undefined);

export const parseMongoFilter = (value?: string): undefined | FindConditions<unknown> => {
  if (!value) return undefined;
  const parsed = parser.parse(value);
  return toMongoFilter(parsed);
};
