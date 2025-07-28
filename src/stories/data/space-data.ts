import HeaderObject from "../../types/HeaderObject";

export type SpaceData = {
  id: number;
  agency: string;
  missionName: string;
  launchDate: string;
  destination: string;
  status: string;
  crewSize: number;
  budget: number;
  duration: string;
  payloadWeight: number;
  launchSite: string;
  missionCostPerKg: number;
  successRate: number;
  scientificYield: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
};

export const generateSpaceData = () => {
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
    const launchDate = `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`;
    const missionCostPerKg = parseFloat((Math.random() * 10000).toFixed(2));
    const successRate = Math.floor(Math.random() * 100);
    const payloadWeight = Math.floor(Math.random() * 10000);
    const scientificYield = Math.floor(Math.random() * 1000);
    const duration = type === "Active" ? "Ongoing" : Math.floor(Math.random() * 10) + 1;

    return {
      id: rowId++,
      q1: Math.floor(Math.random() * 100),
      q2: Math.floor(Math.random() * 100),
      q3: Math.floor(Math.random() * 100),
      q4: Math.floor(Math.random() * 100),
      agency,
      missionName: `${agency} ${type} ${Math.floor(Math.random() * 1000)}`,
      launchDate,
      destination,
      status: Math.random() > 0.2 ? "Completed" : "Active",
      crewSize: type === "Crewed" ? Math.floor(Math.random() * 10) + 1 : 0,
      duration,
      payloadWeight,
      launchSite: launchSites[Math.floor(Math.random() * launchSites.length)],
      missionCostPerKg,
      successRate,
      scientificYield,
    };
  });
};

export const SPACE_HEADERS: HeaderObject<SpaceData>[] = [
  {
    accessor: "agency",
    label: "Agency",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
  {
    accessor: "missionName",
    label: "Mission Name",
    width: 250,
    isSortable: true,
    isEditable: true,
    align: "left",
    hide: true,
  },
  {
    accessor: "launchDate",
    label: "Launch Date",
    type: "date",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }: { row: SpaceData }) => {
      const date = new Date(row.launchDate as string);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessor: "destination",
    label: "Destination",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    type: "enum",
    enumOptions: [
      { label: "Moon", value: "Moon" },
      { label: "Mars", value: "Mars" },
      { label: "Venus", value: "Venus" },
      { label: "Jupiter", value: "Jupiter" },
      { label: "Asteroid Belt", value: "Asteroid Belt" },
      { label: "Saturn", value: "Saturn" },
    ],
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
  {
    accessor: "crewSize",
    label: "Crew Size",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "budget",
    label: "Budget",
    width: 150,
    isSortable: true,
    isEditable: true,
    children: [
      {
        accessor: "q1",
        label: "Q1",
        width: 150,
        isSortable: true,
        isEditable: true,
        align: "right",
      },
      {
        accessor: "q2",
        label: "Q2",
        width: 150,
        isSortable: true,
        isEditable: true,
        align: "right",
      },
      {
        accessor: "q3",
        label: "Q3",
        width: 150,
        isSortable: true,
        isEditable: true,
      },
      {
        accessor: "q4",
        label: "Q4",
        width: 150,
        isSortable: true,
        isEditable: true,
      },
    ],
  },
  {
    accessor: "duration",
    label: "Duration",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }: { row: SpaceData }) => {
      if (row.duration === "Ongoing") return "Ongoing";
      return `${row.duration}y`;
    },
  },
  {
    accessor: "payloadWeight",
    label: "Payload Weight",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }: { row: SpaceData }) => `${row.payloadWeight as number}kg`,
  },
  {
    accessor: "launchSite",
    label: "Launch Site",
    width: 180,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
  {
    accessor: "missionCostPerKg",
    label: "Cost per Kg",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }: { row: SpaceData }) => {
      return `$${(row.missionCostPerKg as number).toLocaleString("en-US", {
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
    cellRenderer: ({ row }: { row: SpaceData }) => `${row.successRate}%`,
  },
  {
    accessor: "scientificYield",
    label: "Scientific Yield",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }: { row: SpaceData }) => `${row.scientificYield}TB`,
  },
];
