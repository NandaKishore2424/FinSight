# FinSight - Personal Finance Visualizer

## Project Overview

FinSight is a modern personal finance tracking application built with Next.js and MongoDB. It allows users to track, visualize, and manage their financial transactions through an intuitive and elegant dashboard interface with dark mode support.

## Tech Stack

- **Frontend:**
  - Next.js with TypeScript
  - Tailwind CSS for responsive styling
  - Recharts for financial data visualization
  - React Hook Form for form validation and submission
  - Context API for theme management (dark/light mode)
  - Lucide React for icons

- **Backend:**
  - Next.js API routes
  - MongoDB with Mongoose for data persistence
  - RESTful API architecture

- **Features:**
  - Transaction management (add, edit, delete)
  - Category-based transaction organization
  - Budget setting and tracking
  - Financial analytics with interactive charts
  - Responsive design for all devices
  - Dark/light mode toggle
  - INR currency formatting

## Folder Structure

```bash
personal-finance-visualizer/
├── components/               # UI components
│   ├── ui/                   # Base UI components (buttons, inputs, etc.)
│   ├── TransactionForm.tsx   # Form for adding/editing transactions
│   ├── TransactionList.tsx   # List of transactions with actions
│   ├── ExpensesChart.tsx     # Monthly expenses visualization
│   ├── CategoryPieChart.tsx  # Category-based spending visualization
│   ├── DashboardSummary.tsx  # Financial overview cards
│   ├── BudgetForm.tsx        # Form for setting category budgets
│   ├── BudgetComparisonChart.tsx # Budget vs actual comparison
│   └── BudgetInsights.tsx    # Spending insights and recommendations
├── context/                  # React Context providers
│   └── ThemeContext.tsx      # Dark/light mode management
├── lib/                      # Utility libraries
│   └── mongodb.ts            # MongoDB connection management
├── models/                   # Data models
│   ├── Transaction.ts        # Transaction schema and model
│   └── Budget.ts             # Budget schema and model
├── pages/                    # Next.js pages
│   ├── api/                  # API routes
│   │   ├── transactions/     # Transaction-related endpoints
│   │   └── budgets/          # Budget-related endpoints
│   ├── _app.tsx              # App wrapper with providers
│   ├── _document.tsx         # Document customization
│   └── index.tsx             # Main dashboard page
├── styles/                   # Global styles
│   └── globals.css           # Global CSS with Tailwind directives
├── .env.local                # Environment variables (not in repo)
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Getting Started

To get started with FinSight, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/fin-sight.git
   ```

2. Navigate to the project directory:

   ```bash
   cd fin-sight
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables:

   - Rename `.env.example` to `.env`
   - Update the values in the `.env` file with your MongoDB connection string and other settings

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and go to `http://localhost:3000` to see the app in action.

## Features

### Transaction Management

- Add new financial transactions
- Edit existing transactions
- Delete transactions
- Categorize transactions

### Financial Dashboard

- Summary cards showing total income, expenses, and balance
- Monthly expense trends chart
- Category distribution pie chart
- Transaction history table with sorting

### Budgeting

- Set monthly budgets for each spending category
- Compare actual spending against budgets
- View budget vs actual comparison charts
- Receive spending insights and recommendations
- Switch between different months for budget planning

### User Experience

- Responsive design that works on mobile, tablet, and desktop
- Dark and light mode themes
- Form validation for transaction inputs
- Interactive UI elements with smooth transitions

### API Endpoints

- GET /api/transactions - Retrieve all transactions
- POST /api/transactions - Create a new transaction
- GET /api/transactions/:id - Retrieve a specific transaction
- PUT /api/transactions/:id - Update a transaction
- DELETE /api/transactions/:id - Delete a transaction
- GET /api/budgets - Retrieve all budgets
- POST /api/budgets - Create a new budget
- PUT /api/budgets/:id - Update a budget
- DELETE /api/budgets/:id - Delete a budget


## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [MongoDB](https://www.mongodb.com/) - The NoSQL database for modern applications
- [Vercel](https://vercel.com/) - The platform for frontend frameworks and static sites
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs
- [Recharts](https://recharts.org/) - A composable charting library for React
- [React Hook Form](https://react-hook-form.com/) - A performant, flexible, and extensible form library for React
- [Lucide React](https://lucide.dev/) - A beautiful and open-source icon set for React

---

FinSight is built with by [Nanda Kishore R](https://github.com/NandaKishore242)
