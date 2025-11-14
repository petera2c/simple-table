import HeaderObject from "../../../types/HeaderObject";
import { useState } from "react";

// Custom Email Enrich component
const EmailEnrich = ({ rowId }: { rowId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const generateRandomEmail = () => {
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
    const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    return `${randomName}${randomNumber}@${randomDomain}`;
  };

  const handleClick = () => {
    if (isLoading || email) return;

    setIsLoading(true);
    setTimeout(() => {
      setEmail(generateRandomEmail());
      setIsLoading(false);
    }, 2000);
  };

  if (email) {
    return (
      <span
        style={{
          marginRight: "8px",
          display: "inline-flex",
          cursor: "default",
          alignItems: "center",
          columnGap: "6px",
          borderRadius: "9999px",
          backgroundColor: "oklch(96.7% .003 264.542)",
          paddingInline: "8px",
          paddingBlock: "4px",
          fontSize: "12px",
          fontWeight: 500,
          color: "oklch(21% .034 264.665)",
        }}
      >
        {email}
      </span>
    );
  }

  if (isLoading) {
    return (
      <span
        style={{
          marginRight: "8px",
          display: "inline-flex",
          cursor: "default",
          alignItems: "center",
          columnGap: "6px",
          borderRadius: "9999px",
          backgroundColor: "oklch(96.7% .003 264.542)",
          paddingInline: "8px",
          paddingBlock: "4px",
          fontSize: "12px",
          fontWeight: 500,
          color: "oklch(21% .034 264.665)",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            border: "2px solid oklch(87.2% .01 258.338)",
            borderTop: "2px solid oklch(64.6% .222 41.116)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        Enriching...
      </span>
    );
  }

  return (
    <span
      onClick={handleClick}
      style={{
        cursor: "pointer",
        alignItems: "center",
        columnGap: "6px",
        borderRadius: "9999px",
        backgroundColor: "color-mix(in oklab, oklch(62.3% .214 259.815) 10%, transparent)",
        paddingInline: "8px",
        paddingBlock: "4px",
        fontSize: "12px",
        fontWeight: 500,
        color: "oklch(21% .034 264.665)",
      }}
    >
      Enrich
    </span>
  );
};

// Custom Fit Buttons component
const FitButtons = ({ rowId }: { rowId: string }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const buttonStyle = {
    flex: 1,
    padding: "4px 8px",
    fontSize: "0.75rem",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    color: "oklch(70.7% .022 261.325)",
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        onClick={() => setSelected(selected === "fit" ? null : "fit")}
        style={{
          ...buttonStyle,
          backgroundColor:
            selected === "fit" ? "oklch(87.1% .15 154.449)" : "oklch(92.5% .084 155.995)",
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: "6px",
        }}
      >
        ✓
      </button>
      <button
        onClick={() => setSelected(selected === "partial" ? null : "partial")}
        style={{
          ...buttonStyle,
          backgroundColor:
            selected === "partial" ? "oklch(87.2% .01 258.338)" : "oklch(92.8% .006 264.531)",
        }}
      >
        ?
      </button>
      <button
        onClick={() => setSelected(selected === "no" ? null : "no")}
        style={{
          ...buttonStyle,
          backgroundColor:
            selected === "no" ? "oklch(83.7% .128 66.29)" : "oklch(90.1% .076 70.697)",
          borderTopRightRadius: "6px",
          borderBottomRightRadius: "6px",
        }}
      >
        X
      </button>
    </div>
  );
};

export const LEADS_HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "CONTACT",
    width: 290,
    minWidth: 290,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: ({ row }) => {
      const initials = (row.name as string)
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background:
                "linear-gradient(to right, oklch(75% .183 55.934), oklch(70.4% .191 22.216))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "600",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "oklch(64.6% .222 41.116)",
                }}
              >
                {row.name as string}
              </span>
              {row.linkedin && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="#0077b5"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              )}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "oklch(44.6% .03 256.802)",
              }}
            >
              {row.title as string}
            </div>
            <div style={{ fontSize: "12px", color: "oklch(44.6% .03 256.802)" }}>
              <span style={{ fontSize: "12px", color: "oklch(87.2% .01 258.338)" }}>@</span>{" "}
              {row.company as string}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessor: "signal",
    label: "SIGNAL",
    width: 340,
    minWidth: 340,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: ({ row }) => {
      return (
        <div>
          <div
            style={{ color: "oklch(44.6% .03 256.802)", marginBottom: "4px", fontSize: "0.875rem" }}
          >
            🧠 Just engaged with a{" "}
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0077b5", textDecoration: "underline !important" }}
            >
              post
            </a>
          </div>
          <div style={{ fontSize: "12px", color: "oklch(55.1% .027 264.364)" }}>
            <span style={{ fontWeight: "600" }}>Keyword:</span> {row.signal as string}
          </div>
        </div>
      );
    },
  },
  {
    accessor: "aiScore",
    label: "AI SCORE",
    width: 100,
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "number",
    cellRenderer: ({ row }) => {
      const score = row.aiScore as number;
      const fireEmojis = "🔥".repeat(score);

      return <div style={{ fontSize: "0.875rem" }}>{fireEmojis}</div>;
    },
  },
  {
    accessor: "emailStatus",
    label: "EMAIL",
    width: 210,
    minWidth: 210,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Enrich", value: "Enrich" },
      { label: "Verified", value: "Verified" },
      { label: "Pending", value: "Pending" },
      { label: "Bounced", value: "Bounced" },
    ],
    cellRenderer: ({ row }) => {
      return <EmailEnrich rowId={row.id as string} />;
    },
  },
  {
    accessor: "timeAgo",
    label: "IMPORT",
    width: 100,
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "string",
    cellRenderer: ({ row }) => {
      return (
        <div style={{ fontSize: "13px", color: "oklch(44.6% .03 256.802)" }}>
          {row.timeAgo as string}
        </div>
      );
    },
  },
  {
    accessor: "list",
    label: "LIST",
    width: 160,
    minWidth: 160,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Leads", value: "Leads" },
      { label: "Hot Leads", value: "Hot Leads" },
      { label: "Warm Leads", value: "Warm Leads" },
      { label: "Cold Leads", value: "Cold Leads" },
      { label: "Enterprise", value: "Enterprise" },
      { label: "SMB", value: "SMB" },
      { label: "Nurture", value: "Nurture" },
    ],
    cellRenderer: ({ row }) => {
      const listName = row.list as string;

      return (
        <button
          onClick={(e) => e.preventDefault()}
          style={{
            cursor: "pointer",
            fontSize: "0.875rem",
            color: "oklch(64.6% .222 41.116)",
            textDecoration: "none",
            fontWeight: "600",
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          {listName}
        </button>
      );
    },
  },
  {
    accessor: "_fit",
    label: "Fit",
    width: 120,
    minWidth: 120,
    cellRenderer: ({ row }) => {
      return <FitButtons rowId={row.id as string} />;
    },
  },
  {
    accessor: "_contactNow",
    label: "",
    width: 160,
    minWidth: 160,
    cellRenderer: () => {
      return (
        <button
          onClick={(e) => e.preventDefault()}
          style={{
            cursor: "pointer",
            fontSize: "0.875rem",
            color: "oklch(64.6% .222 41.116)",
            textDecoration: "none",
            fontWeight: "600",
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          Contact Now
        </button>
      );
    },
  },
];
