import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateAthletesData = (): Row[] => {
  const countries = ["USA", "China", "Russia", "UK", "Brazil", "Australia", "Japan"];
  const firstNames = ["Alex", "Jordan", "Taylor", "Sam", "Chris", "Lee", "Pat"];
  const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Clark"];
  const sponsors = ["Nike", "Adidas", "Puma", "Under Armour", "Asics"];
  const sports = ["Swimming", "Track", "Gymnastics", "Cycling", "Boxing"];
  let rowId = 0;

  return Array.from({ length: 200 }, () => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const personalBest = parseFloat((Math.random() * 60).toFixed(2));
    const height = parseFloat((Math.random() * 0.5 + 1.5).toFixed(2));
    const weight = Math.floor(Math.random() * 50) + 50;
    const lastCompeted = 2016 + Math.floor(Math.random() * 10);

    return {
      rowMeta: { rowId: rowId++, isExpanded: true },
      rowData: {
        country,
        athleteName: `${first} ${last}`,
        medals: Math.floor(Math.random() * 30) + 1,
        gold: Math.floor(Math.random() * 10),
        event: `${Math.floor(Math.random() * 100) + 100}m ${sport}`,
        personalBest,
        lastCompeted,
        age: Math.floor(Math.random() * 20) + 18,
        height,
        weight,
        team: `${country} ${sport} Team`,
        sponsor: sponsors[Math.floor(Math.random() * sponsors.length)],
      },
    };
  });
};

export const ATHLETES_HEADERS: HeaderObject[] = [
  { accessor: "country", label: "Country", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "athleteName", label: "Athlete Name", width: 200, isSortable: true, isEditable: true, align: "left" },
  { accessor: "medals", label: "Total Medals", width: 150, isSortable: true, isEditable: true, align: "right" },
  { accessor: "gold", label: "Gold Medals", width: 150, isSortable: true, isEditable: true, align: "right" },
  { accessor: "event", label: "Event", width: 180, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "personalBest",
    label: "Personal Best",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${(row.rowData.personalBest as number).toFixed(2)}`,
  },
  {
    accessor: "lastCompeted",
    label: "Last Competed",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => `${row.rowData.lastCompeted}`,
  },
  { accessor: "age", label: "Age", width: 80, isSortable: true, isEditable: true, align: "right" },
  {
    accessor: "height",
    label: "Height",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${(row.rowData.height as number).toFixed(2)}m`,
  },
  {
    accessor: "weight",
    label: "Weight",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${row.rowData.weight}kg`,
  },
  { accessor: "team", label: "Team", width: 250, isSortable: true, isEditable: true, align: "left" },
  { accessor: "sponsor", label: "Sponsor", width: 150, isSortable: true, isEditable: true, align: "left" },
];
