// Copyright (c) 2025, Khizer Anis
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions, and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions, and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
// 3. Neither the name of the copyright holder nor the names of its contributors
//    may be used to endorse or promote products derived from this software
//    without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM,
// OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



<template>
    <div class="container">
      <!-- Left Side: Resume Input Form -->
      <div class="left-panel">
            <h2 class="text-lg font-semibold mb-4">Resume Details</h2>

            <!-- Profile Section -->
            <h3 class="text-md font-semibold mt-4">Profile Summary</h3>
            <textarea v-model="form.profile" placeholder="Write a brief profile summary" class="input-field h-24"></textarea>
    
            <input v-model="form.name" placeholder="Full Name" class="input-field" />
            <input v-model="form.email" placeholder="Email" class="input-field" />
            <input v-model="form.phone" placeholder="Phone" class="input-field" />
    



            <!-- Employment History Section -->
            <h3 class="text-md font-semibold mt-4">Employment History</h3>

            <div v-for="(job, index) in form.jobs" :key="index" class="border p-2 rounded-md mb-2">
            <!-- Job Title (Collapsible Header) -->
            <h4 class="cursor-pointer font-semibold text-lg" @click="toggleJob(index)">
                {{ job.title || "Untitled Job" }} at {{ job.company || "Unknown Company" }} 
                <span>{{ job.expanded ? "▼" : "▶" }}</span>
            </h4>

            <!-- Collapsible Content -->
            <div v-if="job.expanded">
                <input v-model="job.title" placeholder="Job Title" class="input-field" />
                <input v-model="job.company" placeholder="Company" class="input-field" />
                <input type="date" v-model="job.startDate" class="input-field" />
                <input type="date" v-model="job.endDate" class="input-field" />
                <textarea v-model="job.description" placeholder="Job Description" class="input-field h-20"></textarea>
                <button @click="removeJob(index)" class="remove-btn">Remove</button>
            </div>
            </div>

            <button @click="addJob" class="add-btn">+ Add Employment</button>





            <!-- Education Section -->
            <h3 class="text-md font-semibold mt-4">Education</h3>

            <div v-for="(edu, index) in form.education" :key="index" class="border p-2 rounded-md mb-2">
            <!-- Education Title (Collapsible Header) -->
            <h4 class="cursor-pointer font-semibold text-lg" @click="toggleEducation(index)">
                {{ edu.school || "Untitled Education" }} <span>{{ edu.expanded ? "▼" : "▶" }}</span>
            </h4>

            <!-- Collapsible Content -->
            <div v-if="edu.expanded">
                <input v-model="edu.school" placeholder="School" class="input-field" />
                <input v-model="edu.degree" placeholder="Degree" class="input-field" />
                <input type="date" v-model="edu.startDate" class="input-field" />
                <input type="date" v-model="edu.endDate" class="input-field" />
                <button @click="removeEducation(index)" class="remove-btn">Remove</button>
            </div>
            </div>

            <button @click="addEducation" class="add-btn">+ Add Education</button>







            <!-- Past Projects Section -->
            <h3 class="text-md font-semibold mt-4">Past Projects</h3>

            <div v-for="(project, index) in form.projects" :key="index" class="border p-2 rounded-md mb-2">
            <!-- Project Title (Collapsible Header) -->
            <h4 class="cursor-pointer font-semibold text-lg" @click="toggleProject(index)">
                {{ project.title || "Untitled Project" }} <span>{{ project.expanded ? "▼" : "▶" }}</span>
            </h4>

            <!-- Collapsible Content -->
            <div v-if="project.expanded">
                <input v-model="project.title" placeholder="Project Title" class="input-field" />
                <input type="date" v-model="project.date" class="input-field" />
                <textarea v-model="project.description" placeholder="Project Description" class="input-field h-20"></textarea>
                <button @click="removeProject(index)" class="remove-btn">Remove</button>
            </div>
            </div>

            <button @click="addProject" class="add-btn">+ Add Project</button>
    





            <!-- Template Selection -->
            <h3 class="text-md font-semibold mt-4">Choose a Resume Template</h3>
            <div class="flex gap-4">
                <button 
                    v-for="(template, index) in templates" 
                    :key="index" 
                    @click="selectedTemplate = template.id" 
                    :class="{'active-template': selectedTemplate === template.id}"
                    class="template-btn">
                    {{ template.name }}
                </button>
            </div>
            <button @click="generatePDF" class="btn mt-4">Preview Resume</button>

            <!-- Save & Load Section -->
            <h3 class="text-md font-semibold mt-4">Save & Load Resume</h3>
            <div class="flex gap-4">
            <button @click="saveAsJSON" class="btn">Save as JSON</button>
            <button @click="triggerFileUpload" class="btn">Load JSON</button>
            </div>
            <!-- Hidden file input -->
            <input type="file" ref="fileInput" @change="loadFromJSON" accept=".json" class="hidden" />

        </div>

        <!-- Right Side: PDF Viewer -->
        <div class="right-panel flex items-center justify-center">
            <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-full border"></iframe>
            <p v-else class="text-gray-500">Preview will appear here</p>
        </div>
    </div>

</template>
  


  <script setup>

    import { ref } from "vue";
    import jsPDF from "jspdf";

    // PDF Preview URL vars
    const pdfUrl = ref(null);
    const fileInput = ref(null);


  // Form Data
    const form = ref({
        name: "",
        email: "",
        phone: "",
        profile: "",
        jobs: [],
        education: [],
        projects: [],
    });
  
    // Template Selection
    const selectedTemplate = ref("classic");
    const templates = ref([
        { id: "classic", name: "Classic Resume" },
        { id: "modern", name: "Modern Resume" },
        { id: "minimalist", name: "Minimalist Resume" }
    ]);
  

  // Add/Remove Jobs
    const toggleJob = (index) => {
        form.value.jobs[index].expanded = !form.value.jobs[index].expanded;
    };
    const addJob = () => {
        form.value.jobs.push({
            title: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
        });
    };
    const removeJob = (index) => {
        form.value.jobs.splice(index, 1);
    };


  
  // Add/Remove Education
    const toggleEducation = (index) => {
        form.value.education[index].expanded = !form.value.education[index].expanded;
    };

    const addEducation = () => {
        form.value.education.push({
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
        });
    };
    const removeEducation = (index) => {
        form.value.education.splice(index, 1);
    };







    const generateClassicResumePDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageHeight = 297; // A4 height in mm
    const marginBottom = 20;
    let y = 20; // Start position

    const addTextWithWrap = (text, x, y, fontSize = 12) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, 170);
        lines.forEach(line => {
            if (y + 10 > pageHeight - marginBottom) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, x, y);
            y += 6;
        });
        return y;
    };

    // **Profile Section**
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26); // Main Title
    doc.text(form.value.name, 105, y, { align: "center" });
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(form.value.email, 105, y, { align: "center" });
    y += 6;
    doc.text(form.value.phone, 105, y, { align: "center" });
    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18); // Section Headers
    doc.text("PROFILE", 20, y);
    y += 8;
    y = addTextWithWrap(form.value.profile || "No profile description provided.", 20, y, 12) + 5;

    // **Employment History**
    if (form.value.jobs.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("EMPLOYMENT HISTORY", 20, y);
        y += 8;
        
        form.value.jobs.forEach((job) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            y = addTextWithWrap(`${job.title} at ${job.company}`, 20, y);

            doc.setFont("helvetica", "italic");
            doc.setFontSize(12);
            y = addTextWithWrap(`${job.startDate} - ${job.endDate}`, 20, y);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            y = addTextWithWrap(job.description, 20, y) + 5;
        });
    }

    // **Education**
    if (form.value.education.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("EDUCATION", 20, y);
        y += 8;

        form.value.education.forEach((edu) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            y = addTextWithWrap(`${edu.degree} at ${edu.school}`, 20, y);

            doc.setFont("helvetica", "italic");
            doc.setFontSize(12);
            y = addTextWithWrap(`${edu.startDate} - ${edu.endDate}`, 20, y) + 5;
        });
    }

    // **Past Projects**
    if (form.value.projects.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("PAST PROJECTS", 20, y);
        y += 8;

        form.value.projects.forEach((project) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            y = addTextWithWrap(project.title, 20, y);

            doc.setFont("helvetica", "italic");
            doc.setFontSize(12);
            y = addTextWithWrap(project.date, 20, y);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            y = addTextWithWrap(project.description, 20, y) + 5;
        });
    }

    // **Generate Preview**
    const pdfBlob = doc.output("blob");
    pdfUrl.value = URL.createObjectURL(pdfBlob);
};






    const generatePDF = () => {
        if (selectedTemplate.value === "classic") {
            generateClassicResumePDF();
        } else {
            console.error("Template not implemented yet.");
        }
    };


    // Save/Load
    const saveAsJSON = () => {
        const jsonBlob = new Blob([JSON.stringify(form.value, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(jsonBlob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const triggerFileUpload = () => {
        fileInput.value.click();
    };


    // Load resume data from a JSON file
    const loadFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
            const jsonData = JSON.parse(e.target.result);
            form.value = jsonData; // Replace current form data with loaded JSON
            } catch (error) {
            console.error("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    }; 

    //Past Projects

    const toggleProject = (index) => {
        form.value.projects[index].expanded = !form.value.projects[index].expanded;
    };
    const addProject = () => {
        form.value.projects.push({
            title: "",
            date: "",
            description: "",
        });
    };

    const removeProject = (index) => {
        form.value.projects.splice(index, 1);
    };

  </script>
  




  <style scoped>
    .input-field {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .btn, .add-btn, .remove-btn {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        text-align: center;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .btn {
        background-color: blue;
        color: white;
    }
    .add-btn {
        background-color: green;
        color: white;
    }
    .remove-btn {
        background-color: red;
        color: white;
    }
    
    .container {
        display: flex;
        height: 100vh; /* Full viewport height */
    }
    
    .left-panel {
        flex: 1; /* Takes up 1 part of the available space */
        padding: 20px;
        border-right: 1px solid #ccc; /* Optional: adds a right border */
        overflow-y: auto; /* Allows vertical scrolling if content overflows */
    }
    
    .right-panel {
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Ensures it takes full screen height */
    }
    
    .right-panel iframe {
        width: 100%;
        height: 95%; /* Expands inside the container */
    }
    
    .resume-template {
        width: 800px;
        padding: 20px;
        background: white !important; /* Ensure white background */
        font-family: Arial, sans-serif;
        color: black;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    
    .resume-template h1 {
        font-size: 24px;
        text-align: center;
    }
    
    .resume-template h2 {
        font-size: 18px;
        border-bottom: 2px solid #007bff;
        padding-bottom: 5px;
    }
    
    .template-btn {
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        background-color: #e0e0e0;
    }
    
    .active-template {
        background-color: #007bff;
        color: white;
    }
    
    .file-input {
        display: block;
        margin-top: 10px;
    }

    .hidden {
        display: none;
    }
  </style>