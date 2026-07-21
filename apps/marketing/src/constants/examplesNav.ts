import {
  faChartLine,
  faChartPie,
  faIndustry,
  faUsers,
  faFileInvoiceDollar,
  faServer,
  faMusic,
  faUserTie,
  faBitcoinSign,
  faFutbol,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface ExampleNavItem {
  id: string;
  label: string;
  path: string;
  icon: IconDefinition;
}

/** Canonical list of live example demos — keep footer + ExampleControls in sync. */
export const EXAMPLE_NAV_ITEMS: ExampleNavItem[] = [
  { id: "crypto", label: "Crypto", path: "/examples/crypto", icon: faBitcoinSign },
  { id: "soccer", label: "Sports", path: "/examples/soccer", icon: faFutbol },
  { id: "crm", label: "CRM", path: "/examples/crm", icon: faUserTie },
  {
    id: "infrastructure",
    label: "Infrastructure",
    path: "/examples/infrastructure",
    icon: faServer,
  },
  { id: "music", label: "Music", path: "/examples/music", icon: faMusic },
  {
    id: "billing",
    label: "Billing",
    path: "/examples/billing",
    icon: faFileInvoiceDollar,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    path: "/examples/manufacturing",
    icon: faIndustry,
  },
  { id: "hr", label: "HR", path: "/examples/hr", icon: faUsers },
  { id: "sales", label: "Sales", path: "/examples/sales", icon: faChartLine },
  { id: "analytics", label: "Analytics", path: "/examples/analytics", icon: faChartPie },
];
