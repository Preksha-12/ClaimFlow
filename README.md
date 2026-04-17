# 🛡️ ClaimFlow — Insurance Claim Processing System

A role-based, full-stack Insurance Claim Processing System built as an Object-Oriented Analysis & Design (OOAD) mini project. The system digitises the end-to-end lifecycle of insurance claims — from policy creation and claim submission to survey inspection and final approval.

---

## 👥 Team Members

| Name | Module |
|------|--------|
| Preksha | Authentication & User Management |
| Prathama P.B | Policy Management |
| Piyush K | Claim Submission & Tracking |
| Pranav Manoj | Survey & Report Module |

---

## 📐 Architecture Overview

The project strictly follows the **MVC (Model-View-Controller)** pattern:

- **Model** — Java classes (`User`, `Claim`, `Policy`, `SurveyReport`) represent data; DAOs (`UserDAO`, `ClaimDAO`) handle all database interactions.
- **View** — React pages (`Login.jsx`, `Dashboard.jsx`, `SubmitClaim.jsx`, `TrackClaims.jsx`, `UploadReport.jsx`) form the presentation layer with no business logic.
- **Controller** — `ClaimController.java` and `LoginController.java` coordinate between the HTTP layer and the DAOs. `ClaimHttpServer.java` routes all incoming HTTP requests to the appropriate handler.

---

## 🧩 Design Patterns & GRASP Principles

### GRASP Principles

| Member | Principle | Where Applied |
|--------|-----------|---------------|
| Preksha | Information Expert | `UserDAO.java` — owns all responsibility for user lookups since it has complete knowledge of the `users` table |
| Prathama P.B | Creator | `PolicyFactory.java` — creates `Policy` objects because it aggregates all initialization data |
| Piyush K | Controller | `ClaimController.java` — system controller for claim events, sits between HTTP layer and DAO |
| Pranav Manoj | Low Coupling | `SurveyReport.java` — has no dependency on `ClaimDAO` or `ClaimController`, only holds data fields |

### Design Patterns

| Member | Pattern | Where Applied |
|--------|---------|---------------|
| Preksha | **Singleton** | `DBConnection.java` — a single static `Connection` instance shared across all DAOs |
| Prathama P.B | **Factory Method** | `PolicyFactory.createPolicy()` — centralises `Policy` object creation; new policy types can be added without changing the handler |
| Piyush K | **Observer** | `ClaimStatusObserver` (interface) + `ClaimStatusLogger` (concrete) + `ClaimController` (subject) — observers notified automatically on `updateStatus()` |
| Pranav Manoj | **Strategy** | `DamageAssessmentStrategy` (interface) + `StandardDamageStrategy` (concrete) — damage evaluation algorithm is interchangeable |

---

## 🗂️ Project Structure

```
ClaimFlow-Final/
├── Backend/
│   └── src/
│       ├── App.java
│       ├── ClaimHttpServer.java          # HTTP server & request routing
│       ├── controller/
│       │   ├── ClaimController.java      # Claim events controller (Observer subject)
│       │   └── LoginController.java      # Authentication controller
│       ├── dao/
│       │   ├── ClaimDAO.java             # Claim database access
│       │   └── UserDAO.java              # User database access (Information Expert)
│       ├── model/
│       │   ├── Claim.java
│       │   ├── ClaimStatusLogger.java    # Observer (concrete)
│       │   ├── ClaimStatusObserver.java  # Observer (interface)
│       │   ├── DamageAssessmentStrategy.java  # Strategy (interface)
│       │   ├── Policy.java
│       │   ├── PolicyFactory.java        # Factory Method + Creator
│       │   ├── StandardDamageStrategy.java    # Strategy (concrete)
│       │   ├── SurveyReport.java         # Low Coupling model
│       │   └── User.java
│       └── util/
│           └── DBConnection.java         # Singleton DB connection
│
└── Frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                        # React Router setup
        ├── index.js
        ├── components/
        │   ├── Navbar.jsx / .css
        │   ├── ProtectedRoute.jsx
        │   └── Toast.jsx / .css
        ├── pages/
        │   ├── Login.jsx / .css
        │   ├── Signup.jsx / .css
        │   ├── Dashboard.jsx / .css
        │   ├── SubmitClaim.jsx / .css
        │   ├── TrackClaims.jsx / .css
        │   ├── CreatePolicy.jsx / .css
        │   ├── PolicyHolders.jsx / .css
        │   └── UploadReport.jsx / .css
        ├── services/
        │   └── api.js                    # Centralised API layer
        └── styles/
            └── global.css
```

---

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| **PolicyHolder** | Self-register, view assigned policies, submit claims, track claim status |
| **InsuranceAgent** | Create and assign policies to registered holders, monitor all claims |
| **Surveyor** | View all submitted claims, file damage inspection reports with estimated loss |
| **ClaimOfficer** | Review survey reports inline, approve or reject claims |

---

## 🌐 API Endpoints

The backend runs a plain Java HTTP server on `http://localhost:8080`.

| Method | Endpoint | Description | Module |
|--------|----------|-------------|--------|
| `POST` | `/login` | Authenticate a user | Preksha |
| `POST` | `/signup` | Register a new PolicyHolder | Preksha |
| `GET` | `/policyholders` | Fetch all PolicyHolder accounts | Prathama |
| `POST` | `/create-policy` | Create a new policy (uses PolicyFactory) | Prathama |
| `GET` | `/policies?userId=X` | Fetch policies (all or by user) | Prathama |
| `POST` | `/submit-claim` | Submit a new insurance claim | Piyush |
| `POST` | `/update-status` | Update claim status (triggers Observer) | Piyush |
| `GET` | `/claims?userId=X&role=Y` | Fetch claims (filtered by role) | Piyush |
| `POST` | `/submit-report` | Submit a survey report (uses Strategy) | Pranav |
| `GET` | `/reports?claimId=X` | Fetch survey reports | Pranav |

---

## 🔄 Claim Lifecycle

```
Submitted → Under Verification → Approved / Rejected
```

1. PolicyHolder submits a claim against an active policy.
2. Surveyor inspects and files a damage report — claim moves to **Under Verification**.
3. ClaimOfficer reviews the survey report and sets the final status to **Approved** or **Rejected**.
4. Every status change triggers the **Observer** pattern, notifying `ClaimStatusLogger`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 (functional components + hooks), React Router v6, CSS |
| **Backend** | Java  |
| **Database** | MySQL 8 — relational DB accessed via JDBC |
| **API Style** | REST — JSON over HTTP, CORS-enabled for `localhost:3000` |

---

## ⚙️ Setup & Running

### Prerequisites

- Java 11+
- MySQL 8+
- Node.js 16+ and npm
- MySQL JDBC driver JAR placed in `Backend/lib/`

### 1. Database Setup

Create a MySQL database and run your schema. The required tables are:

```
users, policy_holder, policy, claim, survey_report
```

### 2. Configure DB Credentials

Edit `Backend/src/util/DBConnection.java`:

```java
private static final String URL = "jdbc:mysql://localhost:3306/your_db_name";
private static final String USER = "your_mysql_user";
private static final String PASSWORD = "your_mysql_password";
```

### 3. Run the Backend

From the `Backend/` folder:

```bash
javac -cp "lib/*" -d bin src\util\DBConnection.java src\model\*.java src\dao\*.java src\controller\*.java src\ClaimHttpServer.java src\App.java
java -cp "bin;lib/*" App
```

> Server starts at **http://localhost:8080**

### 4. Run the Frontend

From the `Frontend/` folder:

```bash
npm install
npm start
```

> App opens at **http://localhost:3000**

---

📝 Created by - Preksha , Prathama P B , Peeyush K , Pranav Manoj !!
