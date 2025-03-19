import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateSpaceData = (): Row[] => {
  const agencies = ["NASA", "ESA", "SpaceX", "Roscosmos", "ISRO"];
  const destinations = [
    "Moon",
    "Mars",
    "Venus",
    "Jupiter",
    "Asteroid Belt",
    "Saturn",
  ];
  const missionTypes = ["Orbiter", "Rover", "Lander", "Crewed", "Probe"];
  const launchSites = [
    "Cape Canaveral",
    "Baikonur",
    "Kourou",
    "Sriharikota",
    "Kennedy",
  ];
  let rowId = 0;

  return Array.from({ length: 200 }, () => {
    const agency = agencies[Math.floor(Math.random() * agencies.length)];
    const destination =
      destinations[Math.floor(Math.random() * destinations.length)];
    const type = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    const year = 2000 + Math.floor(Math.random() * 25);
    return {
      rowMeta: { rowId: rowId++ },
      rowData: {
        agency,
        missionName: `${agency} ${type} ${Math.floor(Math.random() * 1000)}`,
        launchDate: `${year}-${Math.floor(Math.random() * 12) + 1}-${
          Math.floor(Math.random() * 28) + 1
        }`,
        destination,
        status: Math.random() > 0.2 ? "Completed" : "Active",
        crewSize: type === "Crewed" ? Math.floor(Math.random() * 10) + 1 : 0,
        budget: `${(Math.random() * 10).toFixed(1)}B`,
        duration:
          type === "Active"
            ? "Ongoing"
            : `${Math.floor(Math.random() * 10) + 1}y`,
        payloadWeight: `${Math.floor(Math.random() * 10000)}kg`,
        launchSite: launchSites[Math.floor(Math.random() * launchSites.length)],
        missionCostPerKg: `${(Math.random() * 10000).toFixed(2)}$/kg`,
        successRate: `${Math.floor(Math.random() * 100)}%`,
        scientificYield: `${Math.floor(Math.random() * 1000)}TB`,
      },
    };
  });
};

export const SPACE_HEADERS: HeaderObject[] = [
  {
    accessor: "agency",
    label: "Agency",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "missionName",
    label: "Mission Name",
    width: 180,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "launchDate",
    label: "Launch Date",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "destination",
    label: "Destination",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    isSortable: true,
    isEditable: true,
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
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "duration",
    label: "Duration",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "payloadWeight",
    label: "Payload Weight",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "launchSite",
    label: "Launch Site",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "missionCostPerKg",
    label: "Cost per Kg",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "successRate",
    label: "Success Rate",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "scientificYield",
    label: "Scientific Yield",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
];
