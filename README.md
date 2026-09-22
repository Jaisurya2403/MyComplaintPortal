# 🏛️ MyComplaintPortal — AI-Driven Civic Grievance Tracking & Redressal System

> **A Next-Generation Municipal Governance & Public Grievance Management Platform**  
> Powered by Spring Boot Microservices, React 18, Oracle Database, MongoDB Atlas GridFS, Rule-Based AI Engine, and Groq Vision AI (Llama 3.2 Vision).

---

## 📋 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [The Solution & Core Innovations](#2-the-solution--core-innovations)
3. [PPT Presentation Blueprint (Slide-by-Slide Guide)](#3-ppt-presentation-blueprint-slide-by-slide-guide)
4. [System Architecture & Technology Stack](#4-system-architecture--technology-stack)
5. [User Roles, Authorities & Access Control Matrix](#5-user-roles-authorities--access-control-matrix)
6. [Complete Feature Breakdown & Step-by-Step Workflows](#6-complete-feature-breakdown--step-by-step-workflows)
   - [A. Public / Guest Workflows](#a-public--guest-workflows)
   - [B. Authentication & Password Recovery Workflows](#b-authentication--password-recovery-workflows)
   - [C. Citizen Member Workflows](#c-citizen-member-workflows)
   - [D. Department Admin Workflows](#d-department-admin-workflows)
   - [E. Super Admin Workflows](#e-super-admin-workflows)
7. [AI & Intelligent Automation Engines](#7-ai--intelligent-automation-engines)
8. [Database Schema & Analytics Views](#8-database-schema--analytics-views)
9. [Automated Email Notification System](#9-automated-email-notification-system)
10. [Local Development & Setup Guide](#10-local-development--setup-guide)
11. [Social Impact & Community Vision](#11-social-impact--community-vision)

---

## 1. Executive Summary & Problem Statement

### 🔴 The Civic Infrastructure Problem
In modern urban municipalities, citizens encounter daily public service and infrastructure failures:
- **Roads & Transport**: Dangerous potholes, peeling tar roads, broken footpaths, dark streetlights, and malfunctioning traffic signals.
- **Water Supply & Drainage**: Pipe bursts, low drinking water pressure, contaminated water supply, open drains, and sewer overflows.
- **Sanitation & Environment**: Overflowing garbage dustbins, foul odor, uncollected waste dumps, illegal plastic burning, and lake pollution.
- **Electricity & Power**: Dangling high-voltage wires, transformer sparks, power cuts, and damaged electric poles.
- **Public Health & Town Planning**: Dengue mosquito breeding, illegal building encroachments, stray animal threats, and hospital hygiene issues.

### 🛑 Why Traditional Municipal Systems Fail
1. **Manual & Bureaucratic Hurdles**: Citizens must physically travel to municipal corporation offices, wait in long queues, and fill paper forms with zero digital record.
2. **Black Hole Submission (Zero Tracking)**: Once submitted, complaints disappear into a black hole. Citizens receive no tracking ID, have no idea which department or officer is assigned, and cannot verify if action is being taken.
3. **Wasted Duplicate Submissions**: Traditional complaint systems keep records private. Multiple neighbors living on the same street independently report the exact same water burst or pothole, creating massive duplicate backlogs that overload municipal staff.
4. **Delayed Manual Routing**: Administrative clerks take days or weeks manually reading complaint letters and routing them between offices. Misrouted complaints are frequently ignored or lost.
5. **Lack of Verified Resolution Proof**: Field officers mark grievances as "Completed" on paper logs without providing photographic evidence. Citizens have no way to verify if the work was actually performed on site.

---

## 2. The Solution & Core Innovations

**MyComplaintPortal** transforms civic grievance redressal into a real-time, transparent, and AI-driven digital ecosystem.

```
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐    ┌───────────────────┐
│ Citizen Files   │ ──►│ AI Auto-Detects      │ ──►│ Multi-Modal AI       │ ──►│ Real-Time         │
│ Complaint       │    │ Dept & Geo-Pincode    │    │ Duplicate Check      │    │ 4-Stage Pipeline  │
└─────────────────┘    └──────────────────────┘    └──────────────────────┘    └───────────────────┘
                                                                                         │
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐              │
│ Resolution      │ ◄──│ Mandatory On-Site    │ ◄──│ Automated Admin      │ ◄───────────┘
│ Public Feedback │    │ Photo Proof Upload   │    │ SMTP Email Alerts    │
└─────────────────┘    └──────────────────────┘    └──────────────────────┘
```

### ✨ Key Innovations
- **60-Second Digital Registration**: File grievances online with location address, compulsory 6-digit Indian PIN code, problem description, 1–5 compulsory photo evidence images, and optional video clips (up to 20MB).
- **Rule-Based AI Auto-Routing**: Real-time natural language processing scans description text against 100+ keywords and instantly maps complaints to the correct municipal department (*Roads, Water, Electricity, Sanitation, Health, Parks, Town Planning, etc.*).
- **Multi-Modal AI Duplicate Prevention**: Cross-checks active unresolved grievances in the same Pincode & Department. Citizens can upvote or repost existing community issues instead of filing duplicates.
- **Pincode-Based Local Feed Ordering**: Public and citizen feeds automatically order complaints by location pincode (*local unresolved top, local resolved second, followed by upvotes and reposts*).
- **Transparent 4-Stage Resolution Pipeline**: Every complaint tracks through `REGISTERED` ➔ `VISITED` ➔ `ACTION_IN_PROGRESS` ➔ `RESOLVED`. Officers MUST upload an on-site photo proof of completion before resolving.
- **Automated Admin Email Alerts**: When any user reports an inappropriate or duplicate post, automated real-time SMTP emails are instantly dispatched to all registered municipal admins and Super Admin.
- **Resolution Feedback & Rating**: Post owners rate completed work (1 to 5 stars + comments) which is stored in the Oracle DB and rendered publicly on the post.

---

## 3. PPT Presentation Blueprint (Slide-by-Slide Guide)

If you are creating a PowerPoint presentation for judges, evaluators, or project teams, use this 10-slide structure:

| Slide # | Slide Title | Core Content & Key Talking Points |
| :--- | :--- | :--- |
| **Slide 1** | **Title & Team Intro** | Project Name: *MyComplaintPortal — AI-Driven Civic Grievance System*.<br>Team Roles: Frontend Developer, Backend Microservices Specialist, AI/Systems Specialist. |
| **Slide 2** | **Problem Statement** | Describe traditional civic issues (potholes, garbage, water leaks), manual paper forms, lack of tracking, delayed manual routing, and zero resolution proof. |
| **Slide 3** | **Proposed Solution** | Introduce MyComplaintPortal: 60-second digital registration, real-time tracking, AI auto-routing, pincode priority feed, and mandatory photo proof. |
| **Slide 4** | **System Architecture** | Microservices Architecture (Spring Boot 3.2.3 + Eureka), React 18 SPA, Oracle Database, MongoDB Atlas GridFS, and Groq Vision AI. |
| **Slide 5** | **Citizen Workflow** | Step-by-step citizen journey: Sign Up ➔ Email OTP ➔ Dashboard ➔ AI Auto-Department Detection ➔ Duplicate Check ➔ 4-Stage Live Tracking ➔ Feedback. |
| **Slide 6** | **AI & Smart Automation** | Explain Rule Engine (100+ keywords), Groq Vision AI (Llama 3.2 Vision), Pincode Geo-Verification, and 24/7 Groq AI Chatbot Assistant. |
| **Slide 7** | **Admin & Officer Operations** | Dual-tier Admin Hierarchy (Super Admin vs Department Admin), Executive Analytics Dashboard (`VW_COMPLAINT_STATS`), Mandatory Resolution Proof Upload. |
| **Slide 8** | **Automated Email Alert System** | Automated SMTP email dispatches to all database admins when a post is reported, containing Complaint ID, date, reason, direct URL, and post owner email. |
| **Slide 9** | **Database & Data Integrity** | Oracle relational schema (`COMPLAINTS`, `USERS`, `DEPARTMENTS`, `ADMIN_ACCOUNTS`), database view aggregation, and GridFS binary image storage. |
| **Slide 10** | **Conclusion & Social Impact** | Public transparency empowers Citizens, Press/Media, Political Leaders, and Social Activists to advocate for faster infrastructure resolution. |

---

## 4. System Architecture & Technology Stack

```
                        ┌─────────────────────────────────────────┐
                        │        React 18 Single Page App         │
                        │    (Vite, Tailwind CSS, Lucide Icons)   │
                        └────────────────────┬────────────────────┘
                                             │ HTTP / REST
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │     Spring Cloud Eureka Registry        │
                        │           (Port 8761)                   │
                        └─────┬──────────────┬──────────────┬─────┘
                              │              │              │
           ┌──────────────────┴──┐  ┌────────┴─────────┐  ┌─┴──────────────────┐
           │ Auth & User Service │  │ Complaint Service│  │ Dept Admin Service │
           │   (Port 8080/8081)  │  │   (Port 8083)    │  │   (Port 8084)      │
           └──────────┬──────────┘  └────────┬─────────┘  └─────────┬──────────┘
                      │                      │                      │
                      ▼                      ▼                      ▼
           ┌──────────────────────────────────────────────────────────────────┐
           │                     Oracle Database 11g / 19c                    │
           │      (COMPLAINTS, USERS, DEPARTMENTS, ADMINS, VW_STATS)          │
           └─────────────────────────────────┬────────────────────────────────┘
                                             │
                                             ▼
           ┌──────────────────────────────────────────────────────────────────┐
           │              MongoDB Atlas GridFS (Photo Evidence)               │
           └──────────────────────────────────────────────────────────────────┘
```

### 🛠️ Technology Stack Components
- **Frontend Framework**: React 18, Vite, Tailwind CSS (Custom Civic Glassmorphism Theme), Lucide React Icons, Canvas Confetti.
- **Microservices Framework**: Java 17, Spring Boot 3.2.3, Spring Cloud Netflix Eureka (Service Discovery), Spring Data JPA, Java Mail Sender (SMTP).
- **Database & Storage**:
  - **Oracle Database 11g/19c**: Relational tables (`COMPLAINTS`, `USERS`, `DEPARTMENTS`, `ADMIN_ACCOUNTS`, `COMPLAINT_UPVOTES`, `COMPLAINT_REPOSTS`, `COMPLAINT_REPORTS`, `COMPLAINT_ATTACHMENTS`) and live analytics view (`VW_COMPLAINT_STATS`).
  - **MongoDB Atlas GridFS**: Scalable binary file storage for multi-photo evidence uploads.
  - **H2 Database**: Runtime fallback for test environments.
- **AI Inspection Engines**:
  - **Rule-Based AI Engine**: Instant regex/keyword matcher scanning 100+ civic terms.
  - **Groq Vision AI (Llama 3.2 Vision)**: Multimodal visual inspection API evaluating photo-description alignment.
  - **Dynamic Model Discovery**: Queries live Groq vision models with static fallbacks.
  - **Pincode Geo-Verification**: Validates 6-digit Indian PIN codes against address descriptions.

---

## 5. User Roles, Authorities & Access Control Matrix

| Role | Access Rights & Dashboard Capabilities | Permitted Routes & Tools |
| :--- | :--- | :--- |
| **Unauthenticated Guest** | Browse public landing page, explore public feed, search by 6-digit pincode, track individual complaint via token, view municipal helplines. | `/`, `/posts`, `/track/:token`, `/about`, `/login`, `/signup`, `/forgot-password`, `/verify-email` |
| **Citizen User** (`ROLE_CITIZEN`) | Authenticated Pincode-ordered feed, register complaints, upload photos/videos, AI duplicate review, track 4-stage pipeline, submit resolution feedback & rating, report posts, upvote/repost, manage profile & password, interact with 24/7 Groq AI Chatbot. | `/home`, `/complaints/new`, `/user/ai-check`, `/dashboard/complaints`, `/dashboard/reposts`, `/dashboard/profile`, `/settings`, `/change-password` |
| **Department Admin** (`ROLE_DEPARTMENT_ADMIN`) | Department Executive Control Center, real-time analytics cards, status filtering, manage assigned department complaints, update 4-stage pipeline, upload mandatory on-site resolution proof photo, write officer notes, redirect complaints, receive automated admin email alerts. | `/home`, `/admin/analytics`, `/admin/posts`, `/admin/redirects` |
| **Super Admin** (`ROLE_SUPER_ADMIN`) | Global authority across all municipal departments, analytics database views (`VW_COMPLAINT_STATS`), user account management, department creation, admin staff appointment. | All routes + `/admin/users`, `/admin/departments`, `/admin/departments/new`, `/admin/admins`, `/admin/admins/new` |

---

## 6. Complete Feature Breakdown & Step-by-Step Workflows

### A. Public / Guest Workflows
1. **Landing Page (`/`)**: Hero banner, municipal statistics, overview of services, emergency helplines, direct links to Sign In or Register.
2. **Public Civic Feed (`/posts`)**: Explore public grievances across the city. Visitors enter any 6-digit Pincode to view complaints registered in that area.
3. **Public Officer & Tracking Page (`/track/:token`)**: Anyone with a unique tracking token can open the page to see live complaint details and status without logging in.
4. **About Us Page (`/about`)**: Lists municipal department helpline numbers, operational guidelines, and direct contact to the Portal Administrator (`jaisurya7482@gmail.com`).

---

### B. Authentication & Password Recovery Workflows

```
[Sign Up] ──► [6-Digit Email OTP Dispatched] ──► [Verify OTP (/verify-email)] ──► [Account Activated] ──► [Sign In (/login)]
```

1. **Sign Up (`/signup`)**: Citizens register by providing Full Name, Email, Password, Primary Location, and compulsory 6-digit Pincode.
2. **6-Digit Email OTP Verification (`/verify-email`)**:
   - Backend generates a 6-digit random OTP and dispatches an HTML email via SMTP.
   - User enters the 6-digit OTP on the verification page. Upon verification, the account status becomes active.
3. **Sign In (`/login`)**: Citizens and officers sign in securely using Email and Password. Upon validation, a JWT token is returned and stored in `localStorage`.
4. **Forgot Password (`/forgot-password`)**:
   - Step 1: User enters registered Email and clicks "Send OTP".
   - Step 2: System dispatches 6-digit OTP to email.
   - Step 3: User enters and verifies 6-digit OTP.
   - Step 4: Once verified, user enters New Password and updates credentials.

---

### C. Citizen Member Workflows

```
[Dashboard (/home)] ──► [Register (/complaints/new)] ──► [AI Check (/user/ai-check)] ──► [Live Tracking (/dashboard/complaints)] ──► [Resolution Feedback]
```

1. **Authenticated Home Dashboard (`/home`)**:
   - Renders a personalized civic feed tailored to the citizen's location pincode.
   - **Sorting Order**:
     1. Unresolved complaints matching citizen's pincode (Top priority).
     2. Resolved complaints matching citizen's pincode.
     3. Complaints from other pincodes.
     4. Sorted by upvotes and reposts count.

2. **Registering a Complaint (`/complaints/new`)**:
   - **Step 1 (Location & PIN)**: Enter location address and 6-digit Pincode.
   - **Step 2 (Description & AI Auto-Routing)**: Citizen types description (e.g., *"potholes in road in my area"*). The Rule-Based AI engine scans keywords in real-time and auto-selects the correct Department (*Roads & Transport*).
   - **Step 3 (Compulsory Photo Evidence)**: Upload 1 to 5 compulsory photos stored in MongoDB Atlas GridFS.
   - **Step 4 (Optional Video)**: Attach an optional video clip (up to 20MB).

3. **Multi-Modal AI Check & Review Page (`/user/ai-check` / `/complaints/new/review`)**:
   - Scans active unresolved complaints in the same Pincode & Department.
   - If matching issues are found, displays candidate grievances and lets the citizen upvote/repost instead of duplicating.
   - If no duplicate exists or user wants to proceed, clicking **"Register My Complaint 🚀"** completes submission.

4. **Real-Time Status Tracking (`/dashboard/complaints`)**:
   - Displays all registered grievances with live progress badges:
     - `REGISTERED`: Recorded in system & assigned to officer.
     - `VISITED`: Officer opened tracking link.
     - `ACTION_IN_PROGRESS`: Repair crew working on site.
     - `RESOLVED`: Work complete with uploaded proof photo!

5. **Post-Resolution Feedback & Star Rating**:
   - Once marked `RESOLVED`, the post owner unlocks an interactive feedback form (1 to 5 stars + comments).
   - Saved in Oracle DB and displayed publicly on the post for all users.

6. **Additional Citizen Tools**:
   - **My Reposts (`/dashboard/reposts`)**: View grievances upvoted/reposted by the user.
   - **My Profile (`/dashboard/profile`)**: Manage personal details and location.
   - **Settings (`/settings`) & Change Password (`/change-password`)**: Theme toggle (Dark/Light), notification settings, and password updates.
   - **Groq AI Municipal Assistant (Chatbot FAB)**: Floating 24/7 AI chatbot on every page providing portal assistance, helpline info, and complaint drafting help.

---

### D. Department Admin Workflows

1. **Executive Operations Control Center (`/home` & `/admin/analytics`)**:
   - Displays real-time executive analytics cards computed live from database view `VW_COMPLAINT_STATS`:
     - Total Submitted, Total Reposts, Active Users, Today's Posts, Resolved Count, Redirected Count, Resolution Efficiency %.
   - **Status Filter Dropdown**: Filter assigned grievances by `ALL`, `REGISTERED`, `VISITED`, `ACTION_IN_PROGRESS`, `RESOLVED`, `REDIRECTED`.

2. **Complaint Resolution Workflow (`/admin/posts`)**:
   - Officers inspect grievances assigned to their department.
   - Update pipeline status from `REGISTERED` ➔ `VISITED` ➔ `ACTION_IN_PROGRESS` ➔ `RESOLVED`.
   - **Mandatory Resolution Photo**: Setting status to `RESOLVED` REQUIRES uploading an on-site resolution proof photo and writing official officer notes.
   - **Department Redirection**: If misallocated, officers can redirect complaints to another department while tracking historical transfer records.

3. **Automated Admin Email Alerts for Reported Posts**:
   - When any citizen reports an inappropriate or duplicate post, an automated real-time SMTP email alert is instantly dispatched to all registered municipal admins and Super Admin (containing Complaint ID, report date, reason, direct link, post owner email).

---

### E. Super Admin Workflows

Super Admin (`jaisurya7482@gmail.com`) holds global authority across all municipal departments:
1. **User Management (`/admin/users`)**: Inspect registered citizens, view activity stats, and manage user roles.
2. **Department Management (`/admin/departments`, `/admin/departments/new`)**: Add new municipal departments, configure emergency helplines, and set official emails.
3. **Admin Staff Roster Management (`/admin/admins`, `/admin/admins/new`)**: Appoint new department officers and manage administrative credentials.

---

## 7. AI & Intelligent Automation Engines

```
                                  ┌───────────────────────────┐
                                  │   User Description Text   │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │   Rule-Based AI Engine    │
                                  │   (100+ Keyword Rules)    │
                                  └─────────────┬─────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       │                                                 │
                       ▼                                                 ▼
        ┌─────────────────────────────┐                   ┌─────────────────────────────┐
        │ Department Auto-Selected    │                   │ Groq Vision AI Inspection   │
        │ (Roads, Water, Elec, etc.)  │                   │ (Llama 3.2 Vision Model)    │
        └─────────────────────────────┘                   └─────────────────────────────┘
```

### 1. Real-Time Rule-Based AI Engine (`ruleEngineAiService.js`)
- Scans complaint descriptions against 100+ weighted keyword rules across 10 municipal categories:
  - **Water Supply & Sewerage (`dept-water`)**: pipe, leak, drainage, sewage, tap, overflow, dirty water.
  - **Roads & Transport (`dept-roads`)**: pothole, tar, asphalt, broken road, streetlight, traffic signal, footpath.
  - **Electricity & Lighting (`dept-elec`)**: power cut, transformer, wire, voltage, pole, spark, light.
  - **Sanitation & Waste (`dept-sanitation`)**: garbage, dustbin, trash, odor, waste, sweeping, dump.
  - **Public Health (`dept-health`)**: mosquito, fogging, hospital, stray dog, hygiene, medical waste.
  - **Parks & Recreation (`dept-parks`)**: park bench, tree branch, playground, garden, overgrown.
  - **Town Planning (`dept-building`)**: illegal construction, encroachment, building permit, flex.

### 2. Groq Vision AI Engine (`groqAiService.js`)
- Utilizes Groq Vision multimodal models (`llama-3.2-11b-vision-preview`, `llama-3.2-90b-vision-preview`) to perform visual image inspection.
- Evaluates photo evidence against text descriptions to detect photo-description mismatches or invalid uploads.

### 3. Multi-Modal Duplicate Detection Engine
- Cross-checks new submissions against active unresolved complaints in the same Pincode & Department.
- Prompts citizens to upvote or repost existing issues instead of creating duplicate records.

---

## 8. Database Schema & Analytics Views

### Key Oracle Database Tables & Schema Structure

#### `COMPLAINTS` Table
```sql
CREATE TABLE COMPLAINTS (
    COMPLAINT_ID VARCHAR2(50) PRIMARY KEY,
    TITLE VARCHAR2(255),
    DESCRIPTION CLOB,
    PINCODE VARCHAR2(10),
    LOCATION_NAME VARCHAR2(255),
    DEPT_ID VARCHAR2(50),
    DEPT_NAME VARCHAR2(100),
    OFFICER_EMAIL VARCHAR2(100),
    STATUS VARCHAR2(30) DEFAULT 'REGISTERED',
    UPVOTES NUMBER DEFAULT 0,
    REPOSTS NUMBER DEFAULT 0,
    IS_REPORTED NUMBER(1) DEFAULT 0,
    REPORT_COUNT NUMBER DEFAULT 0,
    USER_ID VARCHAR2(50),
    USER_NAME VARCHAR2(100),
    USER_EMAIL VARCHAR2(100),
    TRACKING_TOKEN VARCHAR2(100),
    PROOF_IMAGE_ID VARCHAR2(100),
    OFFICER_NOTES CLOB,
    WAS_REDIRECTED NUMBER(1) DEFAULT 0,
    REDIRECTED_FROM_DEPT VARCHAR2(100),
    FEEDBACK_RATING NUMBER,
    FEEDBACK_COMMENT CLOB,
    FEEDBACK_DATE TIMESTAMP,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RESOLVED_AT TIMESTAMP
);
```

#### `VW_COMPLAINT_STATS` Analytics View
```sql
CREATE OR REPLACE VIEW VW_COMPLAINT_STATS AS
SELECT 
    COUNT(*) AS TOTAL_SUBMITTED,
    SUM(CASE WHEN STATUS = 'RESOLVED' THEN 1 ELSE 0 END) AS TOTAL_RESOLVED,
    SUM(CASE WHEN STATUS = 'REGISTERED' THEN 1 ELSE 0 END) AS TOTAL_REGISTERED,
    SUM(CASE WHEN STATUS = 'VISITED' THEN 1 ELSE 0 END) AS TOTAL_VISITED,
    SUM(CASE WHEN STATUS = 'ACTION_IN_PROGRESS' THEN 1 ELSE 0 END) AS TOTAL_IN_PROGRESS,
    SUM(WAS_REDIRECTED) AS TOTAL_REDIRECTED,
    SUM(REPOSTS) AS TOTAL_REPOSTS
FROM COMPLAINTS;
```

---

## 9. Automated Email Notification System

The `notification-service` and `complaint-service` integrate Java Mail Sender (SMTP) to handle automated real-time email dispatchers:

```
[Citizen Reports Post] ──► [Query Admin DB Roster] ──► [Async CompletableFuture] ──► [SMTP Dispatch to All Admins]
```

### Email Alert Types
1. **Account Verification OTP**: Dispatches a 6-digit OTP email upon registration.
2. **Password Reset OTP**: Dispatches a 6-digit OTP email for password reset requests.
3. **Reported Post Admin Alert**: Dispatches an HTML email alert to all database admins whenever a post is reported, containing:
   - **Complaint ID**: `#CMP-2026-c...`
   - **Report Date & Time**: `dd/MM/yyyy hh:mm a`
   - **Report Reason**: Detailed text supplied by reporting citizen.
   - **Direct Post Link**: `http://localhost:5173/posts/{complaintId}`
   - **Post Owner Email**: Registered email of original post creator.

---

## 10. Local Development & Setup Guide

### Prerequisites
- Java JDK 17 or higher
- Node.js v18+ & npm
- Maven 3.8+
- Oracle Database (or H2 embedded fallback)
- MongoDB Atlas account (or local MongoDB)

### Quick Start Commands

#### 1. Clone Repository & Setup Frontend
```bash
git clone https://github.com/Jaisurya2403/MyComplaintPortal.git
cd MyComplaintPortal/frontend
npm install
npm run dev
```

#### 2. Start Eureka Discovery Server
```bash
cd backend/eureka-server
mvn spring-boot:run
```

#### 3. Start Core Microservices
```bash
# Start Auth Service (Port 8080)
cd backend/auth-service && mvn spring-boot:run

# Start User Service (Port 8081)
cd backend/user-service && mvn spring-boot:run

# Start Complaint Service (Port 8083)
cd backend/complaint-service && mvn spring-boot:run

# Start Department Admin Service (Port 8084)
cd backend/department-admin-service && mvn spring-boot:run
```

---

## 11. Social Impact & Community Vision

**MyComplaintPortal** is designed to create lasting social impact across all civic stakeholders:

- **Empowering Citizens**: Transforms passive residents into active community leaders who can monitor local problems, upvote shared issues, and demand accountability.
- **Supporting Press & Journalists**: Provides investigative journalists with empirical data on high-density grievance pincodes, enabling data-backed reporting on municipal failures.
- **Guiding Political Representatives**: Enables ward councillors and MLAs to inspect prioritized community issues in their constituencies and allocate public funds efficiently.
- **Assisting NGOs & Social Activists**: Offers transparent resolution tracking to ensure municipal repairs are actually completed on site in underprivileged neighborhoods.

---

<p align="center">
  <b>Built with ❤️ by the MyComplaintPortal Engineering Team</b><br>
  <i>Making cities cleaner, safer, more responsive, and truly accountable.</i>
</p>
