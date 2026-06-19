# goodWill 🩸

## Overview
**goodWill** started with a simple goal—to make finding blood donors quick and hassle-free during emergencies. Our platform connects patients in urgent need of blood with registered donors, nearby blood banks, and hospitals through a real-time, location-based search system. Patients can enter their blood type and details to find matching resources quickly. Donors register their information, view a list of patients, and choose to donate. Upon donation, they receive confirmation and earn 15 reward points. Once they accumulate 100 points, they unlock perks like free health check-ups, encouraging regular participation. The solution creates an efficient, secure, and incentivized ecosystem that bridges the gap between donors and those in need, ensuring faster and more reliable access to life-saving blood.

## 🚀 Features

- View a list of hospitals and their current blood stock by blood type
- Donate blood and update hospital records
- Sort hospitals by blood type availability
- Seed and populate hospital data for testing and development
- Fast and responsive UI

## 🏗️ How We Built It

We developed goodWill with the goal of simplifying blood donation by connecting donors with hospitals in real time.

### 🔍 Our Approach
- Identified key features: viewing hospital blood availability, sorting by blood type need, and updating inventory post-donation.

- Chose the MERN stack for rapid full-stack development.

- Designed a clean, responsive UI using React + TypeScript + Tailwind CSS.

- Created a backend with Express.js and MongoDB including RESTful APIs.

### 🧠 Challenges & Solutions
- State management issues: Resolved with proper component structuring and prop handling.

  API errors: Fixed via Express middleware and response validation.

- Database schema complexity: Refined our Mongoose models for clarity and flexibility.

## 🛠️ Tech Stack

**Frontend**
- React (with Vite)
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose

## 📁 Project Structure

```
goodWill-main/
│
├── src/                  # Frontend React source files
├── init/                 # Express backend with models, routes, and seeders
├── public/               # Static assets
├── components.json       # UI components definition
├── index.html            # Entry HTML
├── tailwind.config.ts    # Tailwind configuration
├── vite.config.ts        # Vite config for frontend
└── README.md             # This file
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/goodWill.git
cd GOODWILLFINAL12-main
```

---

### 2. Backend Setup (Express + MongoDB)

```bash
cd init
npm install
```

> Make sure MongoDB is running locally on `mongodb://localhost:27017`

To seed hospital data:
```bash
node seed-hospital.js
```

To start the server:
```bash
node server.js
```

---

### 3. Frontend Setup (React + Vite)

```bash
cd ..
npm install
npm run dev
```

Visit the app in your browser at: `http://localhost:5173`

---

## 📦 API Overview

- `GET /hospital/available`: Fetches hospitals sorted by blood type availability
- `POST /hospital/update`: Updates hospital blood inventory upon donation

---

## 🧪 Seed Data

You can prepopulate the database using:

```bash
cd init
node seed-hospital.js
```

This creates mock hospital records with varying blood inventories.

## 🧠 What We Learned

Participating in the IEEE Project of the Month program, we gained hands-on experience with full-stack web development using the MERN stack. We improved our skills in building REST APIs, designing intuitive user interfaces, and managing real-time data using MongoDB. We also learned how to work effectively as a team using Git and GitHub, and apply clean code principles throughout the project.

## 👨‍💻 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.

## 💖 Contributors

Thanks to all the amazing people who contribute to **goodWill** 🚀

<p align="center">
  <a href="https://github.com/aanya-srivastava/goodWill/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=aanya-srivastava/goodWill" alt="Contributors"/>
  </a>
</p>

## ⭐ Project Support

<p align="center">
  <a href="https://github.com/aanya-srivastava/goodWill/stargazers">
    <img src="https://img.shields.io/github/stars/aanya-srivastava/goodWill?style=social" alt="Stars">
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/aanya-srivastava/goodWill/network/members">
    <img src="https://img.shields.io/github/forks/aanya-srivastava/goodWill?style=social" alt="Forks">
  </a>
</p>

##

Made with ❤️ by the goodWill team.

## ?? Running Frontend Tests

The frontend uses [Vitest](https://vitest.dev/) with React Testing Library.

### Run all tests once:
```bash
npm run test:run
```

### Run in watch mode (re-runs on file change):
```bash
npm run test
```

### Test files are located in `src/tests/` and cover:
- `Header` � logo, navigation, points display
- `HospitalList` � list rendering, hospital detail view, back navigation
- `DonationConfirmation` � OTP input, form submission, cancel/close actions
- `DonorList` � donor rendering, localStorage integration, hospital navigation

