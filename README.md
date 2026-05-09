# DevPricer — Freelance Project Pricing Calculator

DevPricer is a modern React application for estimating freelance web development projects.

It helps freelancers and agencies quickly calculate project pricing based on:

* Hourly rate derived from salary targets
* Project modules and estimated hours
* Complexity multipliers
* Scope/risk buffers
* Suggested payment schedules
* Printable client-ready estimates

The app is designed to make pricing conversations faster, clearer, and more professional.

---

## Features

### Rate Calculation

Define your target monthly salary and freelancer multiplier to automatically calculate:

* Full-time hourly rate
* Freelance hourly rate
* Suggested day rate

This helps convert salaried compensation expectations into sustainable freelance pricing.

---

### Modular Project Estimation

Select from predefined project modules such as:

* Authentication & user management
* Dashboard & analytics
* API integration
* CRUD/data tables
* UI/design systems
* Forms & validation
* Payments
* Roles & permissions
* Notifications
* Deployment & CI

Each module includes editable estimated hours.

You can also:

* Add custom modules
* Remove custom modules
* Select all modules
* Clear all selections

---

### Complexity-Based Pricing

Projects can be adjusted using predefined complexity levels:

| Level      | Description                                              |
| ---------- | -------------------------------------------------------- |
| Simple     | Basic MVPs, landing pages, internal tools                |
| Standard   | Typical client applications with integrations            |
| Complex    | Real-time systems, evolving requirements, advanced logic |
| Enterprise | Large-scale SaaS, compliance-heavy, multi-team projects  |

Each level applies a pricing multiplier and includes practical payment advice.

---

### Scope Buffering

Add a configurable percentage buffer to account for:

* Scope creep
* Revisions
* Communication overhead
* Unknown technical complexity
* Client delays

This helps produce more realistic and profitable estimates.

---

### Estimate Breakdown

The application generates a complete pricing summary including:

* Total active project hours
* Raw hourly cost
* Complexity-adjusted pricing
* Buffer amount
* Final project total
* Suggested pricing range

---

### Payment Schedule Suggestions

DevPricer automatically suggests a structured payment plan:

* Deposit
* Milestone payment
* Final delivery payment

Each phase includes:

* Percentage allocation
* Calculated amount
* Recommended payment guidance

---

### Printable Proposal View

The app includes a print-optimized export view designed for:

* Client proposals
* PDF exports
* Pricing documentation
* Internal estimation reviews

The print layout includes:

* Project modules
* Cost breakdown
* Payment schedule
* Complexity notes
* Clean A4 formatting

---

## Tech Stack

* React 19
* CSS Modules
* Custom React Hooks
* Create React App

Additional libraries:

* `html2canvas`
* `jspdf`

---

## Project Structure

```txt
src/
├── components/
│   ├── Header.jsx
│   ├── RateSection.jsx
│   ├── ModulesSection.jsx
│   ├── ComplexitySection.jsx
│   ├── EstimateSection.jsx
│   ├── PaymentSection.jsx
│   └── PrintView.jsx
│
├── hooks/
│   └── usePricing.js
│
├── utils.js
├── App.jsx
├── index.js
└── index.css
```

---

## Core Pricing Logic

The estimate calculation follows this formula:

```txt
Total Hours
× Freelance Hourly Rate
× Complexity Multiplier
+ Scope Buffer
= Final Project Price
```

Freelance hourly rate is derived from:

```txt
(monthly salary / 160 working hours) × freelancer multiplier
```

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

The app will run at:

```txt
http://localhost:3000
```

---

## Build for Production

```bash
npm run build
```

---

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm start`     | Start development server |
| `npm run build` | Create production build  |
| `npm test`      | Run tests                |
| `npm run eject` | Eject CRA configuration  |

---

## Use Cases

DevPricer is useful for:

* Freelance developers
* Software consultants
* Small agencies
* Technical project scoping
* Proposal preparation
* Discovery calls
* Internal budgeting

---

## Future Improvements

Potential enhancements include:

* PDF generation
* Saved estimates/projects
* Multiple currencies
* Tax calculations
* Client branding
* Dark/light themes
* Shareable proposal links
* Team-based estimation
* Time tracking integration

---

## License

This project is private and intended for educational or internal
