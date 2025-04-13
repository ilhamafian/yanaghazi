export type SearchField = {
  field: string;
  operator:
    | ">"
    | "<"
    | "="
    | ">="
    | "<="
    | "!="
    | "regex"
    | "has_field"
    | "no_field"
    | "filters.daterange?.from"
    | "filters.daterange?.to";
  value: string | number | boolean | Date;
};
