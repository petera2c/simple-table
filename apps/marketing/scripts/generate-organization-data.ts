// ES Module version of the organization hierarchy data generator (Project Management)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

interface Task {
  id: string;
  type: "task";
  name: string;
  assignee: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  hoursEstimated: number;
  hoursActual: number;
  completionPercentage: number;
}

interface Milestone {
  id: string;
  type: "milestone";
  name: string;
  status: string;
  startDate: string;
  dueDate: string;
  tasks: Task[];
}

interface Project {
  id: string;
  type: "project";
  name: string;
  client: string;
  status: string;
  startDate: string;
  dueDate: string;
  lead: string;
  budget: string;
  location: string;
  milestones: Milestone[];
}

// Project names and clients for SEO diversity
const PROJECT_NAMES = [
  "Website Redesign Initiative",
  "Mobile App Development",
  "Cloud Migration Project",
  "CRM System Implementation",
  "Data Analytics Platform",
  "E-commerce Platform Launch",
  "Security Audit and Compliance",
  "API Integration Framework",
  "Marketing Automation System",
  "Customer Portal Upgrade",
  "Infrastructure Modernization",
  "Digital Transformation Program",
];

const CLIENTS = [
  "Acme Corporation",
  "Global Tech Solutions",
  "Innovation Labs Inc",
  "Enterprise Dynamics",
  "Digital Ventures Group",
  "Strategic Partners LLC",
  "Future Systems Co",
  "Advanced Solutions Inc",
  "Tech Innovators Ltd",
  "Digital First Corp",
  "NextGen Enterprises",
  "Modern Business Group",
];

const PROJECT_LEADS = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "Jessica Williams",
  "Robert Martinez",
  "Amanda Thompson",
  "Christopher Lee",
  "Lauren Davis",
  "Daniel Brown",
  "Sophia Anderson",
  "James Wilson",
];

const TASK_ASSIGNEES = [
  "Alex Turner",
  "Jordan Smith",
  "Taylor Morgan",
  "Casey Anderson",
  "Riley Cooper",
  "Morgan Bailey",
  "Jamie Parker",
  "Drew Mitchell",
  "Blake Foster",
  "Quinn Russell",
  "Avery Hayes",
  "Cameron Powell",
  "Dakota Reed",
  "Kendall Gray",
  "Phoenix Brooks",
];

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Denver, CO",
  "Chicago, IL",
  "Los Angeles, CA",
  "Portland, OR",
  "Miami, FL",
  "Atlanta, GA",
  "Phoenix, AZ",
];

const STATUSES = ["Active", "On Hold", "Completed", "Planning"];
const STATUS_PROBS = [0.5, 0.1, 0.3, 0.1];

const MILESTONE_NAMES = [
  [
    "Discovery & Planning",
    "Design Phase",
    "Development Sprint 1",
    "Development Sprint 2",
    "Testing & QA",
    "Deployment",
  ],
  [
    "Requirements Gathering",
    "Architecture Design",
    "Core Development",
    "Integration",
    "User Acceptance Testing",
    "Launch",
  ],
  [
    "Research Phase",
    "Prototype Development",
    "Implementation",
    "Validation",
    "Release Preparation",
    "Go Live",
  ],
  [
    "Planning & Scoping",
    "Initial Build",
    "Feature Development",
    "Quality Assurance",
    "Deployment Prep",
    "Production Launch",
  ],
];

const TASK_TEMPLATES = [
  "Create wireframes and mockups",
  "Develop user authentication system",
  "Set up database schema",
  "Implement API endpoints",
  "Design user interface components",
  "Write unit tests",
  "Configure CI/CD pipeline",
  "Conduct code review",
  "Update documentation",
  "Perform security audit",
  "Optimize database queries",
  "Integrate third-party services",
  "Create user documentation",
  "Set up monitoring and alerts",
  "Implement data validation",
  "Design responsive layouts",
  "Build admin dashboard",
  "Configure load balancing",
  "Implement caching strategy",
  "Create backup procedures",
];

const TASK_STATUSES = ["Not Started", "In Progress", "In Review", "Completed", "Blocked"];
const TASK_STATUS_PROBS = [0.15, 0.35, 0.15, 0.3, 0.05];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const PRIORITY_PROBS = [0.2, 0.4, 0.3, 0.1];

// Generate tasks for a milestone
const generateTasks = (
  milestoneStartDate: Date,
  milestoneDueDate: Date,
  taskIdOffset: number
): Task[] => {
  const taskCount = randomBetween(3, 7);
  const tasks: Task[] = [];

  for (let i = 0; i < taskCount; i++) {
    const taskStart = randomDate(milestoneStartDate, milestoneDueDate);
    const taskDuration = randomBetween(2, 14); // 2-14 days
    const taskDue = new Date(taskStart);
    taskDue.setDate(taskDue.getDate() + taskDuration);

    // Determine status
    let status = "Not Started";
    let statusRoll = Math.random();
    let cumProb = 0;
    for (let j = 0; j < TASK_STATUSES.length; j++) {
      cumProb += TASK_STATUS_PROBS[j];
      if (statusRoll <= cumProb) {
        status = TASK_STATUSES[j];
        break;
      }
    }

    // Determine priority
    let priority = "Medium";
    let priorityRoll = Math.random();
    cumProb = 0;
    for (let j = 0; j < PRIORITIES.length; j++) {
      cumProb += PRIORITY_PROBS[j];
      if (priorityRoll <= cumProb) {
        priority = PRIORITIES[j];
        break;
      }
    }

    const hoursEstimated = randomBetween(4, 40);
    let completionPercentage = 0;
    let hoursActual = 0;

    if (status === "Completed") {
      completionPercentage = 100;
      hoursActual = Math.round(hoursEstimated * (0.8 + Math.random() * 0.4)); // 80-120% of estimate
    } else if (status === "In Review") {
      completionPercentage = randomBetween(85, 95);
      hoursActual = Math.round((hoursEstimated * completionPercentage) / 100);
    } else if (status === "In Progress") {
      completionPercentage = randomBetween(20, 80);
      hoursActual = Math.round((hoursEstimated * completionPercentage) / 100);
    } else if (status === "Blocked") {
      completionPercentage = randomBetween(10, 50);
      hoursActual = Math.round((hoursEstimated * completionPercentage) / 100);
    }

    tasks.push({
      id: `TASK-${taskIdOffset + i}`,
      type: "task",
      name: randomChoice(TASK_TEMPLATES),
      assignee: randomChoice(TASK_ASSIGNEES),
      status,
      priority,
      startDate: taskStart.toISOString().split("T")[0],
      dueDate: taskDue.toISOString().split("T")[0],
      hoursEstimated,
      hoursActual,
      completionPercentage,
    });
  }

  return tasks;
};

// Generate milestones for a project
const generateMilestones = (
  projectStartDate: Date,
  projectDueDate: Date,
  milestoneIdOffset: number,
  taskIdOffset: number
): { milestones: Milestone[]; taskCount: number } => {
  const milestoneTemplate = randomChoice(MILESTONE_NAMES);
  const milestones: Milestone[] = [];
  let totalTasks = 0;

  const projectDuration = projectDueDate.getTime() - projectStartDate.getTime();
  const milestoneDuration = projectDuration / milestoneTemplate.length;

  for (let i = 0; i < milestoneTemplate.length; i++) {
    const milestoneStart = new Date(projectStartDate.getTime() + milestoneDuration * i);
    const milestoneDue = new Date(projectStartDate.getTime() + milestoneDuration * (i + 1));

    // Determine milestone status based on dates and progress
    let status = "Planning";
    const now = new Date();
    if (milestoneDue < now) {
      status = "Completed";
    } else if (milestoneStart < now) {
      status = "Active";
    }

    const tasks = generateTasks(milestoneStart, milestoneDue, taskIdOffset + totalTasks);
    totalTasks += tasks.length;

    milestones.push({
      id: `MILESTONE-${milestoneIdOffset + i}`,
      type: "milestone",
      name: milestoneTemplate[i],
      status,
      startDate: milestoneStart.toISOString().split("T")[0],
      dueDate: milestoneDue.toISOString().split("T")[0],
      tasks,
    });
  }

  return { milestones, taskCount: totalTasks };
};

// Generate project data
const generateProjectData = (): Project[] => {
  const projects: Project[] = [];
  let milestoneIdOffset = 0;
  let taskIdOffset = 0;

  // Generate 12 projects
  for (let i = 0; i < 12; i++) {
    const projectStart = randomDate(new Date("2024-01-01"), new Date("2024-06-01"));
    const projectDuration = randomBetween(90, 180); // 3-6 months
    const projectDue = new Date(projectStart);
    projectDue.setDate(projectDue.getDate() + projectDuration);

    // Determine project status
    let status = "Active";
    const statusRoll = Math.random();
    let cumProb = 0;
    for (let j = 0; j < STATUSES.length; j++) {
      cumProb += STATUS_PROBS[j];
      if (statusRoll <= cumProb) {
        status = STATUSES[j];
        break;
      }
    }

    const { milestones, taskCount } = generateMilestones(
      projectStart,
      projectDue,
      milestoneIdOffset,
      taskIdOffset
    );
    milestoneIdOffset += milestones.length;
    taskIdOffset += taskCount;

    // Calculate budget based on task hours
    const totalHoursEstimated = milestones.reduce(
      (sum, m) => sum + m.tasks.reduce((tSum, t) => tSum + t.hoursEstimated, 0),
      0
    );
    const budget = `$${(totalHoursEstimated * randomBetween(100, 200)).toLocaleString()}`;

    projects.push({
      id: `PROJECT-${i + 1}`,
      type: "project",
      name: PROJECT_NAMES[i],
      client: CLIENTS[i],
      status,
      startDate: projectStart.toISOString().split("T")[0],
      dueDate: projectDue.toISOString().split("T")[0],
      lead: PROJECT_LEADS[i],
      budget,
      location: LOCATIONS[i],
      milestones,
    });
  }

  // Sort by status (Active first, then Planning, then On Hold, then Completed)
  const statusOrder: Record<string, number> = {
    Active: 0,
    Planning: 1,
    "On Hold": 2,
    Completed: 3,
  };
  projects.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return projects;
};

// Run the generation and save to a file
async function saveDataToFile(): Promise<void> {
  console.log("Generating project management hierarchy dataset...");
  const data = generateProjectData();

  let totalMilestones = 0;
  let totalTasks = 0;

  data.forEach((project) => {
    totalMilestones += project.milestones.length;
    project.milestones.forEach((milestone) => {
      totalTasks += milestone.tasks.length;
    });
  });

  console.log(
    `Generated ${data.length} projects with ${totalMilestones} milestones and ${totalTasks} tasks`
  );
  console.log("\nProject breakdown:");
  data.forEach((project) => {
    const taskCount = project.milestones.reduce((sum, m) => sum + m.tasks.length, 0);
    console.log(
      `  ${project.name}: ${project.milestones.length} milestones, ${taskCount} tasks (${project.status}) - ${project.client}`
    );
  });

  const filePath = path.join(__dirname, "../public/data/organization-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`\nData saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
