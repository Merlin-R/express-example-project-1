import { ComparisonFilter, Filter, FilterOperator, LogicalNotFilter, LogicalSetFilter, TextFilter } from "@propero/easy-filter";
import { FindConditions } from "typeorm";

const tryParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const visitorMap: Partial<Record<FilterOperator, unknown>> = {
  eq({ field, value }: ComparisonFilter) {
    return { [field]: { $eq: tryParse(value) } };
  },
  ne({ field, value }: ComparisonFilter) {
    return { [field]: { $ne: tryParse(value) } };
  },
  match({ field, value, ci }: TextFilter) {
    if (ci) return { [field]: { $regex: value, $options: "i" } };
    return { [field]: { $regex: tryParse(value) } };
  },
  and({ filters }: LogicalSetFilter) {
    return { $and: filters.map(toMongoFilter) };
  },
  or({ filters }: LogicalSetFilter) {
    return { $or: filters.map(toMongoFilter) };
  },
};

export function toMongoFilter(filter: Filter): FindConditions<unknown> {
  const transformer = visitorMap[filter.op as FilterOperator];
  if (!transformer) throw new RangeError(`Unsupported Filter Type: ${filter.op}`);
  return (transformer as any)(filter);
}
