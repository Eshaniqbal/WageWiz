# **App Name**: WageWiz

## Core Features:

- Record Entry: Add new worker salary records, capturing Name, Worker ID, Department, Joining Date, and monthly Basic Salary. It should handle gracefully the case where Google Sheets sync fails, saving data in the local storage.
- Ledger View: Display all salary records in a paginated, filterable table, allowing sorting and filtering by worker name or salary month. Includes a local storage mechanism to display entries offline in case Google Sheets data isn't available.
- Record Modification: Enable administrators to update or delete existing salary records using intuitive form inputs within the table view. All new and updated entries are synced with the Google Sheet in real-time.
- Salary Slip Generation: Generate downloadable PDF salary slips for each worker record using html2pdf.js with basic but professional styling.
- Google Sheets Sync: Synchronize new and updated records with a connected Google Sheet using the Google Sheets API, acting as a tool for the synchronization of data using Google OAuth and Apps Script Web App.

## Style Guidelines:

- Primary color: Teal (#008080) for a professional and calm feel.
- Secondary color: Light gray (#F5F5F5) for backgrounds and neutral elements.
- Accent: Green (#4CAF50) for action buttons and confirmations.
- Clean, sans-serif fonts for all text elements, ensuring readability.
- Use simple, outlined icons from a library like Font Awesome for actions and navigation.
- Employ a responsive, grid-based layout with Tailwind CSS to adapt to different screen sizes.
- Subtle transitions and animations for UI interactions to improve user experience.