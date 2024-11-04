const TableColumnEditorPopout = ({
  open,
  position,
  setOpen,
}: {
  open: boolean;
  position: "left" | "right";
  setOpen: (open: boolean) => void;
}) => {
  const positionClass = position === "left" ? "left" : "";

  return (
    <div
      className={`st-column-editor-popout ${
        open ? "open" : ""
      } ${positionClass}`}
    >
      <div className="st-column-editor-popout-content">
        TableColumnEditorPopout
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
