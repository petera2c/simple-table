import path from "path";
import type { Row } from "@simple-table/react";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate HR employee data
const generateHRData = (): Row[] => {
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "HR",
    "Operations",
    "Customer Support",
  ];
  const positions = [
    "Manager",
    "Senior",
    "Junior",
    "Lead",
    "Associate",
    "Head",
    "Coordinator",
    "Analyst",
    "Director",
    "Specialist",
    "Assistant",
    "Executive",
    "Intern",
  ];
  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Elizabeth",
    "William",
    "Linda",
    "David",
    "Barbara",
    "Sarah",
    "Susan",
    "Karen",
    "Jessica",
    "Lisa",
    "Nancy",
    "Betty",
    "Margaret",
    "Sandra",
    "Ashley",
    "Kimberly",
    "Emily",
    "Donna",
    "Michelle",
    "Carol",
    "Amanda",
    "Melissa",
    "Deborah",
    "Stephanie",
    "Dorothy",
    "Rebecca",
    "Sharon",
    "Laura",
    "Cynthia",
    "Amy",
    "Kathleen",
    "Angela",
    "Shirley",
    "Anna",
    "Ruth",
    "Brenda",
    "Pamela",
    "Nicole",
    "Katherine",
    "Samantha",
    "Christine",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Rodriguez",
    "Lewis",
    "Lee",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "Hernandez",
    "King",
    "Wright",
    "Lopez",
    "Hill",
    "Scott",
    "Green",
    "Adams",
    "Baker",
    "Gonzalez",
    "Nelson",
    "Carter",
    "Mitchell",
    "Perez",
    "Roberts",
    "Turner",
    "Phillips",
    "Campbell",
    "Parker",
    "Evans",
  ];
  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "San Francisco",
    "Austin",
    "Boston",
    "Seattle",
    "Remote",
  ];
  const statuses = ["Active", "On Leave", "Probation", "Contract", "Terminated"];

  let rowId = 0;
  const rows: Row[] = [];

  // Generate a flat list of 10,000 employees
  const totalEmployees = 10000;

  for (let i = 0; i < totalEmployees; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];

    // Calculate random metrics
    const performanceScore = Math.floor(Math.random() * 41) + 60; // 60-100
    const salaryBase = Math.floor(Math.random() * 50) + 50; // $50k - $100k base
    const salaryMultiplier =
      position.includes("Senior") || position.includes("Lead")
        ? 1.5
        : position.includes("Manager") || position.includes("Director")
        ? 2
        : position.includes("Head") || position.includes("Executive")
        ? 2.5
        : position.includes("Intern")
        ? 0.5
        : 1;
    const salary = Math.floor(salaryBase * salaryMultiplier) * 1000;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate hire date (within last 10 years)
    const currentYear = new Date().getFullYear();
    const hireYear = currentYear - Math.floor(Math.random() * 10);
    const hireMonth = Math.floor(Math.random() * 12) + 1;
    const hireDay = Math.floor(Math.random() * 28) + 1;
    const hireDate = `${hireYear}-${hireMonth.toString().padStart(2, "0")}-${hireDay
      .toString()
      .padStart(2, "0")}`;

    // Calculate years of service based on hire date
    const yearsOfService =
      Math.round(
        ((new Date().getTime() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) * 10
      ) / 10;

    // Generate random email
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;

    // Random location
    const location = locations[Math.floor(Math.random() * locations.length)];

    // Determine if remote eligible (more likely if in engineering or marketing)
    const isRemoteEligible =
      Math.random() < (department === "Engineering" || department === "Marketing" ? 0.8 : 0.4);

    rows.push({
      id: Math.floor(Math.random() * 10000) + 1000,
      department,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      position: `${position} ${
        department.includes("Engineering")
          ? "Engineer"
          : department.includes("Marketing")
          ? "Marketer"
          : department.includes("Sales")
          ? "Representative"
          : department.includes("Finance")
          ? "Analyst"
          : department.includes("HR")
          ? "Specialist"
          : department.includes("Operations")
          ? "Manager"
          : "Agent"
      }`,
      email,
      hireDate,
      yearsOfService,
      salary,
      performanceScore,
      location,
      status,
      isRemoteEligible,
    });
  }

  return rows;
};

// Run the generation and save to a file
function saveDataToFile() {
  console.log("Generating HR dataset...");
  const data = generateHRData();
  console.log(`Generated ${data.length} HR records`);

  const filePath = path.join(__dirname, "../public/data/hr-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
