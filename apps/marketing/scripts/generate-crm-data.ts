// ES Module version of the CRM data generator
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CRM record interface
interface CRMRecord {
  id: string;
  name: string;
  title: string;
  company: string;
  signal: string;
  aiScore: number;
  emailStatus: string;
  timeAgo: string;
  list: string;
  linkedin: boolean;
}

// Sample data for generating realistic leads
const FIRST_NAMES = [
  "Glenn",
  "Gloria",
  "Vishal",
  "Cyril",
  "Richard",
  "Doug",
  "Alan",
  "Ray",
  "Sarah",
  "Michael",
  "Jennifer",
  "David",
  "Emily",
  "James",
  "Lisa",
  "Robert",
  "Jessica",
  "William",
  "Amanda",
  "Christopher",
  "Melissa",
  "Daniel",
  "Rebecca",
  "Matthew",
  "Laura",
  "Anthony",
  "Stephanie",
  "Mark",
  "Michelle",
  "Donald",
  "Nancy",
  "Steven",
  "Dorothy",
  "Paul",
  "Sandra",
  "Andrew",
  "Ashley",
  "Joshua",
  "Kimberly",
  "Kenneth",
  "Donna",
  "Kevin",
  "Carol",
  "Brian",
  "Ruth",
  "George",
  "Sharon",
  "Edward",
  "Margaret",
  "Ronald",
  "Lisa",
  "Timothy",
  "Betty",
  "Jason",
];

const LAST_NAMES = [
  "Lindley",
  "Oppong",
  "Bhalla",
  "Delattre",
  "Webb",
  "Newell",
  "Pendleton",
  "Naeini",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
];

const TITLES = [
  "Founder and CTO (Chief Taco Officer)",
  "Co-founder & CEO",
  "CEO & Co-Founder",
  "Chief Executive Officer & Founder",
  "Founder & CEO",
  "CEO, Chairman",
  "CEO and Founder",
  "VP of Engineering",
  "VP of Sales",
  "VP of Marketing",
  "Head of Product",
  "Head of Engineering",
  "Director of Sales",
  "Director of Marketing",
  "Chief Technology Officer",
  "Chief Marketing Officer",
  "Chief Revenue Officer",
  "Chief Product Officer",
  "VP of Business Development",
  "Head of Growth",
  "Senior Director of Engineering",
  "Senior Director of Sales",
  "VP of Customer Success",
  "Head of Operations",
  "Director of Product Management",
];

const COMPANIES = [
  "Talent IP (In Person)",
  "Cleanster",
  "AnalytAIX",
  "Mosala",
  "24-7 Press AI Solutions",
  "Swarmalytics",
  "ArenaCX",
  "OmniSource, Inc.",
  "TechFlow Solutions",
  "DataDrive AI",
  "CloudScale Systems",
  "NextGen Analytics",
  "InnovateLabs",
  "VelocityTech",
  "Quantum Solutions",
  "PrimeData Corp",
  "FusionWorks",
  "CoreStack Technologies",
  "AgileOps Inc",
  "StreamlineAI",
  "OptimalFlow",
  "SynthTech",
  "NexusCloud",
  "Breakthrough Software",
  "SmartScale Inc",
  "EvolveTech",
  "PinnacleData",
  "TransformAI",
  "CatalystLabs",
  "HorizonTech",
];

const SIGNALS = [
  "Top 5% most active in your ICP (LinkedIn)",
  "Recently changed job title",
  "Engaged with your content 3x this week",
  "Mentioned competitor in recent post",
  "Hiring for relevant positions",
  "Recently raised funding ($2M Series A)",
  "Attending industry conference next week",
  "Downloaded whitepaper on your topic",
  "Viewed your LinkedIn profile 2x",
  "Shared article about your industry",
  "Connected with 3 of your customers",
  "Posted about pain point you solve",
  "Joined relevant LinkedIn group",
  "Recently promoted to decision-maker role",
  "Company expanding to new market",
  "Interacted with competitor's content",
  "Mentioned budget availability in post",
  "Engaged with demo video",
  "Asked question in industry forum",
  "Following your company page",
];

const EMAIL_STATUSES = ["Enrich", "Verified", "Pending", "Bounced"];

const LISTS = ["Leads", "Hot Leads", "Warm Leads", "Cold Leads", "Enterprise", "SMB", "Nurture"];

// Generate a realistic CRM record
function generateCRMRecord(rowId: number): CRMRecord {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;

  const title = TITLES[Math.floor(Math.random() * TITLES.length)];
  const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
  const signal = SIGNALS[Math.floor(Math.random() * SIGNALS.length)];

  // AI Score (1-3, where 3 is best - represented by fire emojis)
  const aiScore = Math.floor(Math.random() * 3) + 1;

  const emailStatus = EMAIL_STATUSES[Math.floor(Math.random() * EMAIL_STATUSES.length)];

  // Generate time ago (in hours)
  const hoursAgo = Math.floor(Math.random() * 72) + 1;
  let timeAgo: string;
  if (hoursAgo < 24) {
    timeAgo = `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else {
    const daysAgo = Math.floor(hoursAgo / 24);
    timeAgo = `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  }

  const list = LISTS[Math.floor(Math.random() * LISTS.length)];

  // 80% chance of having LinkedIn
  const linkedin = Math.random() < 0.8;

  return {
    id: `LEAD-${String(rowId).padStart(5, "0")}`,
    name,
    title,
    company,
    signal,
    aiScore,
    emailStatus,
    timeAgo,
    list,
    linkedin,
  };
}

// Generate realistic dataset
function generateCRMDataset(numRecords: number = 800): CRMRecord[] {
  const data: CRMRecord[] = [];

  for (let i = 0; i < numRecords; i++) {
    const crmData = generateCRMRecord(i);
    data.push(crmData);
  }

  return data;
}

// Run the generation and save to a file
async function saveDataToFile(): Promise<void> {
  console.log("Generating realistic CRM dataset...");
  const data = generateCRMDataset();
  console.log(`Generated ${data.length} CRM records`);

  const filePath = path.join(__dirname, "../public/data/crm-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
