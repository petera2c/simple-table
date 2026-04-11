export const UI_STRINGS = {
  common: {
    liveDemo: "See the Magic ✨",
    getStarted: "Let's Build Something Amazing",
    download: "Download",
    settings: "Settings",
    preview: "Preview",
    theme: "Theme",
  },
  home: {
    hero: {
      title: "Simple Table",
      subtitle: "The table of your dreams (yes, we know you dream about tables)",
    },
    features: {
      highlyCustomizable: {
        title: "Highly Customizable",
        description: "More customizable than your coffee order at that fancy café",
      },
      cellEditing: {
        title: "Cell Editing",
        description: "Edit cells faster than your manager can say 'spreadsheet'",
      },
      columnManagement: {
        title: "Column Management",
        description: "Drag, drop, and organize like a data Marie Kondo",
      },
      pagination: {
        title: "Pagination",
        description: "Navigate through data smoother than your social media feed",
      },
      infiniteScroll: {
        title: "Infinite Scroll",
        description: "Like TikTok, but for your business data (and actually productive)",
      },
      performanceOptimized: {
        title: "Performance Optimized",
        description: "Faster than your coworker's excuse for missing the deadline",
      },
    },
    funFacts: {
      title: "Why Simple Table?",
      facts: [
        "Built by developers who actually use tables (shocking, we know)",
        "Zero table flipping incidents reported",
        "Makes Excel users question their life choices",
        "More reliable than your project estimates",
      ],
    },
  },
  docs: {
    title: "Simple Table",
    cssSetup: {
      title: "CSS Styles Setup",
      description:
        "For Simple Table to function correctly, you need to import the package's CSS styles in your application (don't worry, it's easier than assembling IKEA furniture):",
      note: "This import provides all the necessary styling for the table components. Copy-paste this and you're halfway to impressing your boss!",
    },
    discord: {
      text: "Got questions? Want to share your table success story? Join us on Discord",
      link: "https://discord.gg/RvKHCfg3PC",
    },
    buttons: {
      npmPackage: "NPM Package (It's Free! 🎉)",
      joinDiscord: "Join the Table Talk",
      github: "Star Us on GitHub ⭐",
    },
    sections: {
      installation: "Quick Start (No PhD Required)",
      props: "Props (The Good Stuff)",
      styles: "Make It Pretty",
      license: "The Legal Bits",
    },
  },
  themeBuilder: {
    title: "Theme Builder",
    subtitle: "Customize the appearance of your table",
    sections: {
      settings: "Theme Controls",
      livePreview: "Live Preview",
    },
    categories: {
      colors: "Colors",
      spacing: "Layout & Spacing",
      effects: "Shadows",
    },
    subcategories: {
      tableStructure: "Borders & Separators",
      button: "Button Styles",
      cell: "Cell Appearance",
      selection: "Selection Styling",
      checkbox: "Checkbox Controls",
      editor: "Editor Appearance",
      interactiveElements: "Drag & Resize Controls",
      background: "Background Colors",
    },
  },
  notFound: {
    title: "404 - Table Not Found",
    subtitle: "Looks like this table went on vacation",
    messages: [
      "This table is so lost, it makes a GPS look like a genius",
      "Even our table couldn't find this page, and it's really good at finding things",
      "This page is like a meeting without an agenda - it doesn't exist",
      "We checked all our tables, but this one's playing hide and seek",
      "This page is more elusive than a bug that only appears in production",
      "Our table tried to find this page but got distracted by some interesting data",
      "This page is like a database query that returns null - it's just not there",
      "Even our infinite scroll couldn't find this page",
      "This page is more missing than my motivation on Monday mornings",
      "Our table looked everywhere, even in the backup of the backup",
    ],
    cta: {
      text: "Let's get you back on track",
      buttonText: "Back to Homepage",
    },
  },
} as const;
