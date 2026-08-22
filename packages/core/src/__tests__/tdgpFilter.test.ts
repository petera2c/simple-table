import { describe, expect, it } from "vitest";
import { tableFiltersToTdgpFilter } from "../tdgp/tableFiltersToTdgpFilter";
import { tableFilterConditions, type TableFilterState } from "../types/FilterTypes";

describe("tableFiltersToTdgpFilter", () => {
  it("returns undefined when there are no filters", () => {
    expect(tableFiltersToTdgpFilter(undefined)).toBeUndefined();
    expect(tableFiltersToTdgpFilter({})).toBeUndefined();
  });

  it("lists each column filter as a FilterCondition", () => {
    const filters: TableFilterState = {
      age: { accessor: "age", operator: "greaterThan", value: 30 },
    };
    expect(tableFilterConditions(filters)).toEqual([
      { accessor: "age", operator: "greaterThan", value: 30 },
    ]);
    expect(tableFilterConditions(undefined)).toEqual([]);
  });

  it("maps a number comparison to a single predicate", () => {
    const filters: TableFilterState = {
      age: { accessor: "age", operator: "greaterThan", value: 30 },
    };
    expect(tableFiltersToTdgpFilter(filters)).toEqual({
      kind: "predicate",
      field: "age",
      operator: "GT",
      args: [30],
    });
  });

  it("wraps notContains in a not node", () => {
    const filters: TableFilterState = {
      name: { accessor: "name", operator: "notContains", value: "tmp" },
    };
    expect(tableFiltersToTdgpFilter(filters)).toEqual({
      kind: "not",
      child: {
        kind: "predicate",
        field: "name",
        operator: "CONTAINS",
        args: ["tmp"],
      },
    });
  });

  it("maps between onto BETWEEN args", () => {
    const filters: TableFilterState = {
      salary: { accessor: "salary", operator: "between", values: [50000, 120000] },
    };
    expect(tableFiltersToTdgpFilter(filters)).toEqual({
      kind: "predicate",
      field: "salary",
      operator: "BETWEEN",
      args: [50000, 120000],
    });
  });

  it("maps isEmpty without args", () => {
    const filters: TableFilterState = {
      city: { accessor: "city", operator: "isEmpty" },
    };
    expect(tableFiltersToTdgpFilter(filters)).toEqual({
      kind: "predicate",
      field: "city",
      operator: "IS_BLANK",
    });
  });

  it("skips a contains filter with no value", () => {
    const filters: TableFilterState = {
      name: { accessor: "name", operator: "contains", value: "" },
    };
    expect(tableFiltersToTdgpFilter(filters)).toBeUndefined();
  });

  it("combines several column filters with AND", () => {
    const filters: TableFilterState = {
      country: { accessor: "country", operator: "equals", value: "France" },
      age: { accessor: "age", operator: "greaterThan", value: 30 },
    };
    expect(tableFiltersToTdgpFilter(filters)).toEqual({
      kind: "group",
      combinator: "AND",
      children: [
        { kind: "predicate", field: "country", operator: "EQ", args: ["France"] },
        { kind: "predicate", field: "age", operator: "GT", args: [30] },
      ],
    });
  });
});
