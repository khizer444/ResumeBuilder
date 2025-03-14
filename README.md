# Resume Builder App

## Overview

This is a Vue.js-based resume builder application that allows users to create, edit, and preview their resumes in real-time. Users can input their personal details, employment history, education, and past projects. The app also provides different resume templates and supports exporting resumes as PDF files.

## Features

- Interactive form for entering resume details
- Collapsible sections for Employment, Education, and Projects
- Multiple resume templates (Classic, Modern, Minimalist)
- Live preview of the resume as a PDF
- Save resume as JSON for later use
- Load JSON to restore a previously saved resume
- Export resume as a downloadable PDF

## Technologies Used

- **Vue.js 3** - Frontend framework
- **jsPDF** - PDF generation library
- **Tailwind CSS** - Styling and UI components

## Installation

To run this project locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder

# Install dependencies
npm install

# Run the development server
npm run dev
```
```

The application will be available at `http://localhost:8030/` (or another available port).

## Usage

### 1. Enter Resume Details

- Fill in your **profile summary**, **personal information**, **employment history**, **education**, and **projects**.
- Click on sections to expand/collapse for better organization.
- Use the `+ Add` buttons to add multiple jobs, education records, or projects.

### 2. Choose a Resume Template

- Select from `Classic`, `Modern`, or `Minimalist` styles.

### 3. Preview Resume

- Click **Preview Resume** to generate a live preview in the right panel.

### 4. Export as PDF

- Click **Download PDF** to save your resume.

### 5. Save & Load

- Save your resume as a JSON file for later editing.
- Load a saved JSON file to restore your resume.

## File Structure

```sh
resume-builder/
│── src/
│   ├── components/
│   │   ├── ResumeForm.vue   # Resume input form component
│   │   ├── PdfPreview.vue   # PDF preview component
│   ├── App.vue              # Main Vue component
│   ├── main.js              # Vue app entry point
│── public/
│── package.json
│── README.md
```


## Author

Khizer Anis
```

