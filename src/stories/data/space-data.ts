import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateSpaceData = (): Row[] => {
  const agencies = ["NASA", "ESA", "SpaceX", "Roscosmos", "ISRO"];
  const destinations = ["Moon", "Mars", "Venus", "Jupiter", "Asteroid Belt", "Saturn"];
  const missionTypes = ["Orbiter", "Rover", "Lander", "Crewed", "Probe"];
  const launchSites = ["Cape Canaveral", "Baikonur", "Kourou", "Sriharikota", "Kennedy"];
  let rowId = 0;

  return Array.from({ length: 200 }, () => {
    const agency = agencies[Math.floor(Math.random() * agencies.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    const type = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    const year = 2000 + Math.floor(Math.random() * 25);
    const launchDate = `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(
      Math.floor(Math.random() * 28) + 1
    ).padStart(2, "0")}`;
    const budget = parseFloat((Math.random() * 10).toFixed(1));
    const missionCostPerKg = parseFloat((Math.random() * 10000).toFixed(2));
    const successRate = Math.floor(Math.random() * 100);
    const payloadWeight = Math.floor(Math.random() * 10000);
    const scientificYield = Math.floor(Math.random() * 1000);
    const duration = type === "Active" ? "Ongoing" : Math.floor(Math.random() * 10) + 1;

    return {
      rowMeta: { rowId: rowId++, isExpanded: true },
      rowData: {
        agency,
        missionName: `${agency} ${type} ${Math.floor(Math.random() * 1000)}`,
        launchDate,
        destination,
        status: Math.random() > 0.2 ? "Completed" : "Active",
        crewSize: type === "Crewed" ? Math.floor(Math.random() * 10) + 1 : 0,
        budget,
        duration,
        payloadWeight,
        launchSite: launchSites[Math.floor(Math.random() * launchSites.length)],
        missionCostPerKg,
        successRate,
        scientificYield,
      },
    };
  });
};

export const SPACE_HEADERS: HeaderObject[] = [
  { accessor: "agency", label: "Agency", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "missionName", label: "Mission Name", width: 250, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "launchDate",
    label: "Launch Date",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => {
      const date = new Date(row.rowData.launchDate as string);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  { accessor: "destination", label: "Destination", width: 150, isSortable: true, isEditable: true, align: "left" },
  { accessor: "status", label: "Status", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "crewSize", label: "Crew Size", width: 120, isSortable: true, isEditable: true, align: "right" },
  {
    accessor: "budget",
    label: "Budget",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => {
      return `$${(row.rowData.budget as number).toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}B`;
    },
  },
  {
    accessor: "duration",
    label: "Duration",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.duration === "Ongoing") return "Ongoing";
      return `${row.rowData.duration}y`;
    },
  },
  {
    accessor: "payloadWeight",
    label: "Payload Weight",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${row.rowData.payloadWeight as number}kg`,
  },
  { accessor: "launchSite", label: "Launch Site", width: 180, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "missionCostPerKg",
    label: "Cost per Kg",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => {
      return `$${(row.rowData.missionCostPerKg as number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}/kg`;
    },
  },
  {
    accessor: "successRate",
    label: "Success Rate",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${row.rowData.successRate}%`,
  },
  {
    accessor: "scientificYield",
    label: "Scientific Yield",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${row.rowData.scientificYield}TB`,
  },
];
