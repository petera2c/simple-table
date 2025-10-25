import { LEADS_HEADERS } from "./leads-headers";
import { useState, useEffect } from "react";
import "simple-table-core/styles.css";
import "./CustomTheme.css";
import Theme from "../../../types/Theme";
import Row from "../../../types/Row";
import CellChangeProps from "../../../types/CellChangeProps";
import SimpleTable from "../../../components/simple-table/SimpleTable";

export const leadsExampleDefaults = {
  height: "400px",
};

// Backup data (first 20 rows from leads-data.json)
const BACKUP_LEADS_DATA = [
  {
    id: "LEAD-00000",
    name: "Glenn Lindley",
    title: "Founder and CTO (Chief Taco Officer)",
    company: "Talent IP (In Person)",
    signal: "Top 5% most active in your ICP (LinkedIn)",
    aiScore: 2,
    emailStatus: "Enrich",
    timeAgo: "8 hours ago",
    list: "Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00001",
    name: "Gloria Oppong",
    title: "Co-founder & CEO",
    company: "Cleanster",
    signal: "Recently changed job title",
    aiScore: 3,
    emailStatus: "Verified",
    timeAgo: "12 hours ago",
    list: "Hot Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00002",
    name: "Vishal Bhalla",
    title: "CEO & Co-Founder",
    company: "AnalytAIX",
    signal: "Engaged with your content 3x this week",
    aiScore: 3,
    emailStatus: "Verified",
    timeAgo: "1 day ago",
    list: "Hot Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00003",
    name: "Cyril Delattre",
    title: "Co-founder, CEO",
    company: "Mosala",
    signal: "Recently raised funding ($2M Series A)",
    aiScore: 2,
    emailStatus: "Pending",
    timeAgo: "1 day ago",
    list: "Warm Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00004",
    name: "Richard Webb",
    title: "Chief Executive Officer & Founder",
    company: "24-7 Press AI Solutions",
    signal: "Mentioned competitor in recent post",
    aiScore: 2,
    emailStatus: "Enrich",
    timeAgo: "2 days ago",
    list: "Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00005",
    name: "Doug Newell",
    title: "Founder & CEO",
    company: "Swarmalytics",
    signal: "Hiring for relevant positions",
    aiScore: 1,
    emailStatus: "Verified",
    timeAgo: "3 days ago",
    list: "Enterprise",
    linkedin: true,
  },
  {
    id: "LEAD-00006",
    name: "Alan Pendleton",
    title: "CEO and Founder",
    company: "ArenaCX",
    signal: "Downloaded whitepaper on your topic",
    aiScore: 2,
    emailStatus: "Verified",
    timeAgo: "4 hours ago",
    list: "Warm Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00007",
    name: "Ray Naeini",
    title: "CEO, Chairman",
    company: "OmniSource, Inc.",
    signal: "Viewed your LinkedIn profile 2x",
    aiScore: 3,
    emailStatus: "Enrich",
    timeAgo: "5 hours ago",
    list: "Hot Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00008",
    name: "Sarah Johnson",
    title: "VP of Engineering",
    company: "TechFlow Solutions",
    signal: "Connected with 3 of your customers",
    aiScore: 2,
    emailStatus: "Verified",
    timeAgo: "6 hours ago",
    list: "Leads",
    linkedin: false,
  },
  {
    id: "LEAD-00009",
    name: "Michael Williams",
    title: "VP of Sales",
    company: "DataDrive AI",
    signal: "Posted about pain point you solve",
    aiScore: 1,
    emailStatus: "Pending",
    timeAgo: "7 hours ago",
    list: "Cold Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00010",
    name: "Jennifer Brown",
    title: "VP of Marketing",
    company: "CloudScale Systems",
    signal: "Joined relevant LinkedIn group",
    aiScore: 1,
    emailStatus: "Bounced",
    timeAgo: "9 hours ago",
    list: "Cold Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00011",
    name: "David Jones",
    title: "Head of Product",
    company: "NextGen Analytics",
    signal: "Recently promoted to decision-maker role",
    aiScore: 3,
    emailStatus: "Verified",
    timeAgo: "10 hours ago",
    list: "Enterprise",
    linkedin: true,
  },
  {
    id: "LEAD-00012",
    name: "Emily Garcia",
    title: "Head of Engineering",
    company: "InnovateLabs",
    signal: "Company expanding to new market",
    aiScore: 2,
    emailStatus: "Enrich",
    timeAgo: "11 hours ago",
    list: "Warm Leads",
    linkedin: false,
  },
  {
    id: "LEAD-00013",
    name: "James Miller",
    title: "Director of Sales",
    company: "VelocityTech",
    signal: "Attending industry conference next week",
    aiScore: 2,
    emailStatus: "Verified",
    timeAgo: "13 hours ago",
    list: "Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00014",
    name: "Lisa Davis",
    title: "Director of Marketing",
    company: "Quantum Solutions",
    signal: "Engaged with demo video",
    aiScore: 3,
    emailStatus: "Verified",
    timeAgo: "14 hours ago",
    list: "Hot Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00015",
    name: "Robert Rodriguez",
    title: "Chief Technology Officer",
    company: "PrimeData Corp",
    signal: "Mentioned budget availability in post",
    aiScore: 3,
    emailStatus: "Verified",
    timeAgo: "15 hours ago",
    list: "Hot Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00016",
    name: "Jessica Martinez",
    title: "Chief Marketing Officer",
    company: "FusionWorks",
    signal: "Asked question in industry forum",
    aiScore: 1,
    emailStatus: "Pending",
    timeAgo: "16 hours ago",
    list: "SMB",
    linkedin: true,
  },
  {
    id: "LEAD-00017",
    name: "William Hernandez",
    title: "Chief Revenue Officer",
    company: "CoreStack Technologies",
    signal: "Following your company page",
    aiScore: 1,
    emailStatus: "Enrich",
    timeAgo: "17 hours ago",
    list: "Nurture",
    linkedin: false,
  },
  {
    id: "LEAD-00018",
    name: "Amanda Lopez",
    title: "Chief Product Officer",
    company: "AgileOps Inc",
    signal: "Interacted with competitor's content",
    aiScore: 2,
    emailStatus: "Verified",
    timeAgo: "18 hours ago",
    list: "Warm Leads",
    linkedin: true,
  },
  {
    id: "LEAD-00019",
    name: "Christopher Gonzalez",
    title: "VP of Business Development",
    company: "StreamlineAI",
    signal: "Shared article about your industry",
    aiScore: 2,
    emailStatus: "Verified",
    timeAgo: "19 hours ago",
    list: "Leads",
    linkedin: true,
  },
];

const LeadsExampleComponent = ({
  onGridReady,
  theme,
  rowCount = 50,
}: {
  onGridReady?: () => void;
  theme?: Theme;
  rowCount?: number;
}) => {
  const [data, setData] = useState<Row[]>(BACKUP_LEADS_DATA);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            [accessor]: newValue,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="custom-theme-container">
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={LEADS_HEADERS}
        enableRowSelection
        onGridReady={onGridReady}
        rowIdAccessor="id"
        rows={data}
        rowHeight={92}
        theme="custom"
        selectableCells
        onCellEdit={handleCellEdit}
        height={"70dvh"}
      />
    </div>
  );
};

export default LeadsExampleComponent;
