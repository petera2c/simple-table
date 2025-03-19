const TableRowSeparator = ({ lastGroupRow }: { lastGroupRow?: boolean }) => {
  return <div className={`st-row-separator ${lastGroupRow ? "st-last-group-row" : ""}`} />;
};

export default TableRowSeparator;
