export interface ManufacturingRow {
  id: string;
  productLine: string;
  station: string;
  machineType: string;
  status: string;
  outputRate: number;
  cycletime: number;
  efficiency: number;
  defectRate: number;
  defectCount: number;
  downtime: number;
  utilization: number;
  energy: number;
  maintenanceDate: string;
  stations?: ManufacturingRow[];
}
