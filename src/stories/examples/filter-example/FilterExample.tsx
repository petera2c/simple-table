"use client";

import { PRODUCT_HEADERS } from "./filter-headers";
import data from "./filter-data.json";
import { SimpleTable, Theme } from "../../..";
import { useState } from "react";

const shouldPaginate = false;
const howManyRowsCanFit = 12;

const THEME_OPTIONS: Theme[] = ["sky", "funky", "neutral", "light", "dark"];

export const FilterExampleComponent = () => {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <div style={{ padding: "2rem" }}>
      {" "}
      <div style={{ display: "flex", overflow: "auto" }}>
        {THEME_OPTIONS.map((theme) => {
          return (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              style={{
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                margin: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
                fontFamily: "Nunito",
              }}
            >
              {theme}
            </button>
          );
        })}
      </div>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={PRODUCT_HEADERS}
        rows={data}
        theme={theme}
        selectableCells
        {...(shouldPaginate
          ? { rowsPerPage: howManyRowsCanFit, shouldPaginate }
          : {
              height: "75dvh",
            })}
      />
    </div>
  );
};
