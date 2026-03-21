const fs = require('fs');

const cleanReport = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90vh; text-align: center; font-family: sans-serif; background-color: white; color: black;">
    <h1 style="font-size: 48px; margin-bottom: 20px; color: #000000; font-weight: bold;">College Event Portal</h1>
    <h2 style="font-size: 32px; color: #000000; margin-bottom: 80px;">(EventHub)</h2>
    <h3 style="font-size: 24px; font-weight: bold; color: #000000; margin-bottom: 20px;">A Minor Project Report</h3>
    <p style="font-size: 18px; color: #333333; max-width: 600px;">Submitted in partial fulfillment of the requirements for the successful completion of the academic program.</p>
    <div style="margin-top: 120px; font-size: 22px; color: #000000;">
        <p style="margin-bottom: 10px;"><strong>Submitted by:</strong></p>
        <p>Student Name</p>
        <p style="font-size: 18px; color: #333333;">(Registration Number)</p>
    </div>
</div>

<div class="page-break"></div>

## 1. Abstract
The "College Event Portal" (EventHub) is a comprehensive web-based application designed to streamline the administration and registration processes for college-level events, technical fests, and workshops. With the increasing number of student activities, manual registration and physical record-keeping have become inefficient and error-prone. This project presents a centralized, digital platform where students can seamlessly browse event details, register for competitions (e.g., Hackathons, RoboWars), and submit feedback. Concurrently, administrators are provided with a secure, authenticated dashboard to track real-time registration statistics, manage pending approvals, and view user feedback. The system is built using a modern technology stack comprising a responsive Vanilla HTML/CSS/JS frontend featuring glassmorphism design principles, and a robust Node.js/Express backend integrated with an SQLite relational database.

This project significantly reduces administrative overhead by eliminating paper-based forms and redundant data entry workflows. It ensures high data integrity, dynamic UI updates without page reloads (SPA behavior), and strict access control mechanisms using bcrypt password hashing algorithms. Ultimately, EventHub serves as a scalable foundation that educational institutions can deploy to effectively modernize their extracurricular event management.

<div class="page-break"></div>

## 2. Introduction
In modern educational institutions, organizing technical and cultural events requires immense coordination between multiple departments, student chapters, and faculty groups. Traditional methods of event management often involve rudimentary setups such as Google Forms, physical paper registrations, or fragmented Excel spreadsheets. These methods inherently lead to disjointed data, delayed communication, administrative bottlenecks, and significant margin for human error during data collation.

The College Event Portal aims to solve these pervasive challenges by providing a dedicated, fully-automated software application. The primary objectives of this project are:
- **Optimization of Workflows:** To provide a visually appealing, responsive, and highly user-friendly interface for students to register for events instantly from any device.
- **Data Centralization:** To eliminate manual data entry and reduce administrative overhead by consolidating all applicant data into a single, structured SQL database.
- **Real-Time Monitoring:** To offer an exclusive, authenticated Administrator Dashboard for real-time monitoring of registration counts, attendee pending statuses, and granular student feedback analytics.
- **Security & Privacy:** To handle student data securely using modern backend architecture (Node.js) and industry-standard password hashing (Bcrypt) for administrative access.

By addressing the root causes of event management inefficiencies, this system acts as a reliable intermediary between the student body and college administration.

<div class="page-break"></div>

## 3. System (Existing + Proposed)

### Existing System
The existing system for managing college events typically relies on disparate tools such as physical form submissions, manual Excel spreadsheets, and isolated email chains. When a student registers, their data is often manually transcribed by coordinators, which introduces high latency.
**Drawbacks of the Existing System:**
- **Data Redundancy:** Multiple copies of the same student details across different departments and databases.
- **Time-Consuming:** Manual verification of student branches, semesters, and contact details is required.
- **Lack of Transparency:** Students cannot easily confirm their registration status, and administrators lack a real-time, birds-eye overview of overall event capacities.
- **Poor Feedback Loop:** Collecting post-event feedback is tedious and the data is rarely evaluated effectively due to poor structuring.

### Proposed System
The proposed "EventHub" system digitizes the entire lifecycle of event registration natively in a single, cohesive web application. It acts as a modern Single Page Application (SPA) on the client side, interfacing with a centralized REST API on the server side.
**Advantages of the Proposed System:**
- **Centralized Database:** All registrations, users, and feedback are securely stored in a centralized SQLite database, ensuring ACID compliance and instant data retrieval.
- **Real-time Analytics:** The Admin Dashboard automatically calculates total registrations, pending reviews, and total feedback received dynamically.
- **Secure Access Control:** The backend enforces session-based authentication to ensure only authorized personnel can view or modify registration data.
- **Modern UI/UX:** The application utilizes a dynamic Glassmorphism aesthetic, ensuring high user engagement and exceptional mobile responsiveness without horizontal scrolling issues.

<div class="page-break"></div>

## 4. Software Requirements Specification (SRS)

### 4.1 Functional Requirements
- **User Registration Module:** Students must be able to securely submit their personal details (Name, Email, Branch, Semester, Phone) to register for specific events (e.g. Hackathon, RoboWar).
- **Feedback Mechanism:** Users must be able to submit qualitative and quantitative data (opinions, complaints, or technical issues) through a dedicated feedback form.
- **Admin Authentication:** Administrators must be able to log in using a secure username and password to gain an HTTP session.
- **Dashboard Analytics:** The system must conditionally render aggregated statistics (Total Registrations, Pending Reviews, Total Feedbacks) visible only to logged-in administrators.
- **Data Management Capabilities:** Administrators must have the active ability to toggle the status of a registration (Pending/Confirmed) and permanently delete malicious or invalid entries via the dashboard UI.

### 4.2 Non-Functional Requirements
- **Performance:** The platform must load efficiently. The backend API requests must be processed within 50-100 milliseconds utilizing the Node.js asynchronous event-driven architecture.
- **Security:** Administrator passwords must be hashed using a salt round of 10 via \`bcrypt\` before database storage. API routes must be protected against malicious payloads, and protected routes must categorically reject unauthenticated session cookies.
- **Usability:** The interface must be intuitively navigable. It must achieve 100% responsiveness, ensuring accessibility across desktop monitors, tablets, and mobile devices by dynamically shifting from CSS Grid to Flexbox column wraps.
- **Maintainability:** The codebase must be highly modular, separating concerns between DOM manipulation (frontend), routing (Express), and schema definitions (SQLite).

<div class="page-break"></div>

## 5. Design

### 5.1 Flowchart

\`\`\`mermaid
graph TD
    A[Student Accesses Portal] --> B{Select Action}
    B -->|Register| C[Fill Registration Form]
    C --> D[Submit via Express API]
    D --> E[(SQLite Database)]
    E --> F[Show Success Alert]
    
    B -->|Feedback| G[Fill Feedback Form]
    G --> H[Submit via Express API]
    H --> E
    
    B -->|Admin Login| I[Enter Credentials]
    I --> J{Valid?}
    J -->|No| K[Show Error]
    J -->|Yes| L[Access Admin Dashboard]
    L --> M[Fetch Analytics & Data]
    M --> N[Manage Registrations & Feedback]
\`\`\`

<div class="page-break"></div>

### 5.2 Entity-Relationship (ER) Diagram

\`\`\`mermaid
erDiagram
    USERS {
        int id PK
        string username
        string password "Hashed"
    }
    
    REGISTRATIONS {
        int id PK
        string full_name
        string email
        string branch
        string semester
        string phone
        string event_id
        string status "Pending / Confirmed"
        datetime created_at
    }
    
    FEEDBACK {
        int id PK
        string type
        string subject
        string details
        datetime created_at
    }

    USERS ||--o{ REGISTRATIONS : manages_state
    USERS ||--o{ FEEDBACK : reviews_metrics
\`\`\`

<div class="page-break"></div>

## 6. Output Screenshots

### 6.1 Admin Dashboard Overview
Displays real-time pending approvals and total registration metrics.

<div class="screenshot-box">Screenshot: Admin Dashboard overview</div>

<div class="page-break"></div>

### 6.2 Event Registration Form
Displays the primary student-facing form utilizing modern glassmorphism aesthetics.

<div class="screenshot-box">Screenshot: Responsive Registration Form</div>

<div class="page-break"></div>

### 6.3 Admin Security Modal
Presents the secure Authentication challenge when accessing protected dashboard boundaries.

<div class="screenshot-box">Screenshot: Admin Login Modal</div>

<div class="page-break"></div>

### 6.4 Venue and Contact System
Provides physical logistics and coordinates for the event footprint.

<div class="screenshot-box">Screenshot: Complete Contact Page</div>

<div class="page-break"></div>

### 6.5 Feedback Intake Loop
Highlights the digital collection form for abstract user metrics post-event.

<div class="screenshot-box">Screenshot: Dynamic Feedback System</div>

<div class="page-break"></div>

## 7. Conclusion
The College Event Portal (EventHub) successfully fulfills all initial requirements by delivering a fast, responsive, and highly secure platform for managing institutional events. By migrating from rudimentary manual processes to a fully automated Node.js and SQLite architecture, the system guarantees data integrity, rapid data retrieval, and streamlined administrative workflows. 

The modular codebase enables the institution to completely bypass older legacy systems (such as local XAMPP and PHP instances) in favor of portable modern microservices. Furthermore, this approach allows for future vertical and horizontal scalability, enabling stakeholders to easily add features such as automated email confirmations, SMS gateways, payment integration structures, and comprehensive CSV export systems. EventHub effectively acts as the vanguard for modern, paperless college administration.

<div class="page-break"></div>

***
*Begin Appendix.* 
`;

const filesToAppend = [
    { title: 'Appendix A: index.html', lang: 'html', file: 'index.html' },
    { title: 'Appendix B: style.css', lang: 'css', file: 'style.css' },
    { title: 'Appendix C: script.js', lang: 'javascript', file: 'script.js' },
    { title: 'Appendix D: server.js', lang: 'javascript', file: 'server.js' },
    { title: 'Appendix E: db.js', lang: 'javascript', file: 'db.js' }
];

let paddingText = '\n## 8. Complete Source Code Appendices\n';

filesToAppend.forEach(item => {
    try {
        const content = fs.readFileSync(item.file, 'utf-8');
        paddingText += '\n### ' + item.title + '\n```' + item.lang + '\n' + content + '\n```\n<br>\n';
    } catch (e) {
        console.error('Failed to read ' + item.file);
    }
});

fs.writeFileSync('report.md', cleanReport + paddingText);

const cssStyles = '<style>\n' +
'/* Forcing page breaks and CSS background rendering in PDFs */\n' +
'html, body {\n' +
'    -webkit-print-color-adjust: exact !important;\n' +
'    color-adjust: exact !important;\n' +
'    print-color-adjust: exact !important;\n' +
'}\n' +
'.page-break {\n' +
'    page-break-after: always !important;\n' +
'    break-after: page !important;\n' +
'    display: block;\n' +
'    height: 1px;\n' +
'    margin: 0; padding: 0;\n' +
'}\n' +
'.screenshot-box {\n' +
'    width: 100%;\n' +
'    min-height: 400px;\n' +
'    background-color: #cbd5e1 !important;\n' +
'    color: #0f172a !important;\n' +
'    border: 3px dashed #475569 !important;\n' +
'    display: flex;\n' +
'    align-items: center;\n' +
'    justify-content: center;\n' +
'    font-size: 28px;\n' +
'    font-family: sans-serif;\n' +
'    font-weight: bold;\n' +
'    margin: 20px 0;\n' +
'    box-shadow: inset 0 0 100px rgba(0,0,0,0.1);\n' +
'}\n' +
'@media print {\n' +
'    .page-break {\n' +
'        page-break-after: always !important;\n' +
'        break-after: page !important;\n' +
'    }\n' +
'    .screenshot-box {\n' +
'        -webkit-print-color-adjust: exact !important;\n' +
'        print-color-adjust: exact !important;\n' +
'        background-color: #cbd5e1 !important;\n' +
'        background: #cbd5e1 !important;\n' +
'        color: #0f172a !important;\n' +
'    }\n' +
'}\n' +
'</style>';

fs.writeFileSync('inject_css.js', 'const fs = require("fs");\nlet finalHtml = fs.readFileSync("final_report.html", "utf-8");\nfinalHtml = finalHtml.replace("</head>", `' + cssStyles.replace(/\n/g, '\\n') + '` + "</head>");\nfs.writeFileSync("final_report.html", finalHtml);\nconsole.log("Injected custom PDF print styles cleanly.");');
console.log('Built report.md and clean css injector script.');

