# CareerHub Portal  Root Guide

This is a MERN-stack application containing two separate directories:
1. **`careerhub-backend`**: Node.js + Express API server (runs on port `5001` and connects to MongoDB Atlas).
2. **`careerhub`**: React + Vite + Tailwind CSS frontend application (runs on port `5173`).

---

## Important note on command execution
The root directory `projectLPU` is just a container folder and **does not contain a `package.json` file**. 
Running `npm run dev` or `npm install` directly in this root directory will result in an `npm error ENOENT`. 

You must always navigate (`cd`) into either the `careerhub` or `careerhub-backend` directory before running your scripts.

---

## How to Run the Project (Quick Start)

### 1. Start the Backend API Server
Open a terminal window and run:
```bash
cd careerhub-backend
npm run dev
```
- Server will listen on **[http://localhost:5001](http://localhost:5001)**.
- It connects to your remote MongoDB Atlas cluster database automatically using the URI stored in your `.env`.

### 2. Start the Frontend React App
Open a **second** terminal window and run:
```bash
cd careerhub
npm run dev
```
- Server will serve the website on **[http://localhost:5173](http://localhost:5173)**.
- It will automatically connect to the backend server.

---

## 💾 Database Seeding & Mock Data
Since we are connected to your fresh cloud MongoDB Atlas cluster, the database starts empty. We have created a seed script to populate it with realistic mock data:

### Seed Sample Data (Employers, Candidates, Jobs):
If you want to reload/reset the sample data in MongoDB Atlas:
```bash
cd careerhub-backend
node scripts/seedData.js
```
*(This creates 6 employers, 5 candidates, and 6 jobs matching the layout statistics).*

### Seed Admin Only:
To seed only the system administrator account:
```bash
cd careerhub-backend
npm run seed:admin
```

---

## Login Credentials

### System Administrator:
- **URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Email**: `admin@careerhub.example`
- **Password**: `Admin@1234`

### Sample Employer:
- **Email**: `hr@nimbus.example`
- **Password**: `Employer@123`

### Sample Candidate:
- **Email**: `ritika@example.com`
- **Password**: `Candidate@123`
