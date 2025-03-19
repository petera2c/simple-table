import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import { formatDate, formatCurrency } from "../../utils/formatters";
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
    const launchDate = `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`;
    const budget = (Math.random() * 10).toFixed(1);
    const missionCostPerKg = (Math.random() * 10000).toFixed(2);
    const [launchYear, launchMonth, launchDay] = launchDate.split("-");

    return {
      rowMeta: { rowId: rowId++, isExpanded: true },
      rowData: {
        agency,
        missionName: `${agency} ${type} ${Math.floor(Math.random() * 1000)}`,
        launchDate: `${parseInt(launchMonth)}/${parseInt(launchDay)}/${launchYear}`,
        destination,
        status: Math.random() > 0.2 ? "Completed" : "Active",
        crewSize: type === "Crewed" ? Math.floor(Math.random() * 10) + 1 : 0,
        budget: `$${parseFloat(budget).toLocaleString("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}B`,
        duration: type === "Active" ? "Ongoing" : `${Math.floor(Math.random() * 10) + 1}y`,
        payloadWeight: `${Math.floor(Math.random() * 10000)}kg`,
        launchSite: launchSites[Math.floor(Math.random() * launchSites.length)],
        missionCostPerKg: `$${parseFloat(missionCostPerKg).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}/kg`,
        successRate: `${Math.floor(Math.random() * 100)}%`,
        scientificYield: `${Math.floor(Math.random() * 1000)}TB`,
      },
    };
  });
};

export const SPACE_HEADERS: HeaderObject[] = [
  { accessor: "agency", label: "Agency", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "missionName", label: "Mission Name", width: 250, isSortable: true, isEditable: true, align: "left" },
  { accessor: "launchDate", label: "Launch Date", width: 150, isSortable: true, isEditable: true, align: "left" },
  { accessor: "destination", label: "Destination", width: 150, isSortable: true, isEditable: true, align: "left" },
  { accessor: "status", label: "Status", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "crewSize", label: "Crew Size", width: 120, isSortable: true, isEditable: true, align: "right" },
  { accessor: "budget", label: "Budget", width: 150, isSortable: true, isEditable: true, align: "right" },
  { accessor: "duration", label: "Duration", width: 150, isSortable: true, isEditable: true, align: "right" },
  {
    accessor: "payloadWeight",
    label: "Payload Weight",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "launchSite", label: "Launch Site", width: 180, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "missionCostPerKg",
    label: "Cost per Kg",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "successRate", label: "Success Rate", width: 150, isSortable: true, isEditable: true, align: "right" },
  {
    accessor: "scientificYield",
    label: "Scientific Yield",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
];
