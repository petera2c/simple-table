/**
 * Docs & Examples / Examples – product-style demos (domain datasets).
 * Stories are listed alphabetically.
 */
import type { Meta, StoryObj } from "@storybook/html";
import {
  renderBillingExample,
  billingExampleDefaults,
} from "../examples/billing-example/BillingExample";
import { renderClayExample, clayExampleDefaults } from "../examples/ClayExample";
import {
  renderFinanceExample,
  financeExampleDefaults,
} from "../examples/finance-example/FinancialExample";
import {
  renderInfrastructureExample,
  infrastructureExampleDefaults,
} from "../examples/infrastructure/InfrastructureExample";
import { renderLeadsExample, leadsExampleDefaults } from "../examples/leads/LeadsExample";
import {
  renderManufacturingExample,
  manufacturingExampleDefaults,
} from "../examples/manufacturing/ManufacturingExample";
import { renderMusicExample, musicExampleDefaults } from "../examples/music/MusicExample";
import {
  renderMusicWindowScrollExample,
  musicWindowScrollExampleDefaults,
} from "../examples/music/MusicWindowScrollExample";
import {
  renderRadioStationsExample,
  radioStationsExampleDefaults,
} from "../examples/RadioStationsExample";
import { renderSalesExample, salesExampleDefaults } from "../examples/sales-example/SalesExample";
import { storyArgs } from "./storyArgs";

const meta: Meta = {
  title: "Docs & Examples/Examples",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Billing: StoryObj = {
  ...storyArgs(billingExampleDefaults),
  render: (args) => renderBillingExample(args),
  parameters: {
    docs: { description: { story: "Billing/invoice table with formatted amounts and status." } },
  },
};

export const Clay: StoryObj = {
  ...storyArgs(clayExampleDefaults),
  render: (args) => renderClayExample(args),
  parameters: {
    docs: { description: { story: "Clay design system styling example for the table." } },
  },
};

export const Finance: StoryObj = {
  ...storyArgs(financeExampleDefaults),
  render: (args) => renderFinanceExample(args),
  parameters: {
    docs: { description: { story: "Financial data table with currency and number formatting." } },
  },
};

export const Infrastructure: StoryObj = {
  ...storyArgs(infrastructureExampleDefaults),
  render: (args) => renderInfrastructureExample(args),
  parameters: {
    docs: { description: { story: "Infrastructure/assets table with status and metrics." } },
  },
};

export const Leads: StoryObj = {
  ...storyArgs(leadsExampleDefaults),
  render: (args) => renderLeadsExample(args),
  parameters: {
    docs: { description: { story: "Leads/CRM table with contact and pipeline data." } },
  },
};

export const Manufacturing: StoryObj = {
  ...storyArgs(manufacturingExampleDefaults),
  render: (args) => renderManufacturingExample(args),
  parameters: {
    docs: { description: { story: "Manufacturing/inventory table with production metrics." } },
  },
};

export const Music: StoryObj = {
  ...storyArgs(musicExampleDefaults),
  render: (args) => renderMusicExample(args),
  parameters: { docs: { description: { story: "Music/catalog table with albums and artists." } } },
};

export const MusicWindowScroll: StoryObj = {
  ...storyArgs(musicWindowScrollExampleDefaults),
  render: (args) => renderMusicWindowScrollExample(args),
  parameters: {
    docs: {
      description: {
        story:
          "Wide (~60 column) artist-analytics grid in window/external scroll mode: no height/maxHeight, so the outer container drives row virtualization while the sticky header pins to the viewport. Every data column uses a custom DOM cellRenderer.",
      },
    },
  },
};

export const RadioStations: StoryObj = {
  ...storyArgs(radioStationsExampleDefaults),
  render: (args) => renderRadioStationsExample(args),
  parameters: {
    docs: {
      description: {
        story:
          "Client-style radio stations grid: window/external scroll (no table height), top footer, five left-pinned identity columns, two equal metric columns, ~3235 rows at 65px.",
      },
    },
  },
};

export const Sales: StoryObj = {
  ...storyArgs(salesExampleDefaults),
  render: (args) => renderSalesExample(args),
  parameters: {
    docs: { description: { story: "Sales/orders table with revenue and product data." } },
  },
};
