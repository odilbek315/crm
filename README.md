# B2B CRM

A premium, modern Customer Relationship Management (CRM) platform designed to streamline business operations, automate workflows, and provide real-time analytical insights.

## Features

- **Dashboard Layout:** Rich statistics, activity overview, and system status metrics.
- **Customer & Lead Management:** Comprehensive database of customers, deals pipeline, and action-oriented detail pages.
- **AI-Powered Insights:** Interactive Decision Engine, Executive Copilot, and process mining tools.
- **Workflow & Automation:** Visual ecosystem builder and process workflow automation system.
- **Security & Observability:** Real-time system monitoring, audit logs, and security center.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Prisma](https://www.prisma.io/) database setup

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/odilbek315/crm.git
   cd crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

4. Initialize the Prisma database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be running locally at `http://localhost:3000`.
