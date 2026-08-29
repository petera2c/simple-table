import type { AngularColumnDef } from "@simple-table/angular";

export type PersonStatus = "active" | "away" | "offline";

export type DirectoryPerson = {
  id: number;
  name: string;
  role: string;
  team: string;
  status: PersonStatus;
};

export const DIRECTORY_SEED: DirectoryPerson[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", team: "Platform", status: "active" },
  { id: 2, name: "Grace Hopper", role: "Engineer", team: "Runtime", status: "active" },
  { id: 3, name: "Alan Turing", role: "Research", team: "Labs", status: "away" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", team: "Data", status: "active" },
  { id: 5, name: "Margaret Hamilton", role: "Engineer", team: "Apollo", status: "offline" },
  { id: 6, name: "Donald Knuth", role: "Research", team: "Labs", status: "away" },
  { id: 7, name: "Barbara Liskov", role: "Engineer", team: "Platform", status: "active" },
  { id: 8, name: "Edsger Dijkstra", role: "Research", team: "Labs", status: "offline" },
];

export const directoryColumns: AngularColumnDef<DirectoryPerson>[] = [
  { accessor: "name", label: "Name", width: 180, type: "string", sortable: true },
  { accessor: "role", label: "Role", width: 140, type: "string", sortable: true },
  { accessor: "team", label: "Team", width: 130, type: "string", sortable: true },
  { accessor: "status", label: "Status", width: 140, type: "string" },
];
