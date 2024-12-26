// import React, { useState } from "react";
// import { Box, Typography, TextField, MenuItem } from "@mui/material";
// import { useStyles } from "./styles";

// const Fresher = () => {
//   const classes = useStyles();
//   const currentYear = new Date().getFullYear();
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   // Generate array of years (from current year back to 100 years ago)
//   const years = Array.from(new Array(100), (val, index) => currentYear - index);

//   return (
//     <div>
//       <Box className={classes.resumemain}>
//         <Typography variant="h4" color="initial" className={classes.title}>
//           Fresher
//         </Typography>
//         <Box className={classes.resumebox}>
//           <Box className={classes.resumecontent}>
//             <Box
//               component="form"
//               sx={{
//                 margin: "20px",
//                 "& .MuiTextField-root": {
//                   m: 1,
//                   width: "33ch",
//                   margin: "20px 10px",
//                 },
//               }}
//               noValidate
//               autoComplete="off"
//             >
//               <div>
//                 <Typography
//                   variant="h6"
//                   color="initial"
//                   className={classes.section1head}
//                 >
//                   Personal Info
//                 </Typography>
//                 <TextField
//                   required
//                   id="Target_role"
//                   label="Role"
//                   defaultValue="Role"
//                 />
//                 <TextField id="FullName" label="FullName" />
//                 <TextField fullWidth label="@yourmail.com" id="fullWidth" />
//                 <TextField
//                   id="outlined-number"
//                   label="Number"
//                   type="number"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//                 <TextField id="Github" label="Github" />
//                 <TextField id="Linkedin" label="Linkedin" />
//               </div>
//               <div>
//                 <Typography
//                   variant="h6"
//                   color="initial"
//                   className={classes.section1head}
//                 >
//                   Educational info
//                 </Typography>

//                 <TextField id="Degree" label="Degree" />
//                 <TextField id="Specialization" label="Specialization" />
//                 <TextField fullWidth label="Institution" id="Institution" />

//                 <TextField
//                   select
//                   label="Graduation year"
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   sx={{ width: "33ch", margin: "20px 10px" }}
//                 >
//                   {years.map((year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </div>
//               <div>
//                 <Typography
//                   variant="h6"
//                   color="initial"
//                   className={classes.section1head}
//                 >
//                   Work Experience
//                 </Typography>
//                 <TextField required id="Position" label="Position" />
//                 <TextField required id="Company-name" label="Company Name" />
//               </div>
//               <div>
//                 <Typography
//                   variant="h6"
//                   color="initial"
//                   className={classes.section1head}
//                 >
//                   Academic Projects
//                 </Typography>
//                 <TextField required id="Name" label="Name" />
//                 <TextField required id="Skills_used" label="Skills Used" />
//               </div>
//               <div>
//                 <Typography
//                   variant="h6"
//                   color="initial"
//                   className={classes.section1head}
//                 >
//                   Certifications
//                 </Typography>
//                 <TextField
//                   required
//                   id="Certificate"
//                   label="Certificate"
//                   fullWidth
//                   sx={{
//                     margin: "20px 10px",
//                     width: "calc(100% - 20px)" // Accounting for margins
//                   }}
//                 />
//               </div>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//           <Box className={classes.resumepreview}></Box>
//     </div>
//   );
// };

// export default Fresher;




// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   IconButton,
//   Stack,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import html2pdf from "html2pdf.js";

// const Fresher = () => {
//   const currentYear = new Date().getFullYear();
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [skills, setSkills] = useState([""]);
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       targetRole: "",
//       fullName: "",
//       email: "",
//       phone: "",
//       github: "",
//       linkedin: "",
//     },
//     education: {
//       degree: "",
//       specialization: "",
//       institution: "",
//       graduationYear: currentYear,
//     },
//     workExperience: {
//       position: "",
//       companyName: "",
//       startMonth: "",
//       startYear: currentYear,
//       endMonth: "",
//       endYear: currentYear,
//     },
//     academicProjects: [
//       {
//         name: "",
//         skillsUsed: "",
//       },
//     ],
//     certifications: [
//       {
//         name: "",
//       },
//     ],
//   });

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const years = Array.from(new Array(100), (val, index) => currentYear - index);

//   const handleAddSkill = () => {
//     setSkills([...skills, ""]);
//   };

//   const handleSkillChange = (index, value) => {
//     const newSkills = [...skills];
//     newSkills[index] = value;
//     setSkills(newSkills);
//   };

//   const handleRemoveSkill = (index) => {
//     const newSkills = skills.filter((_, i) => i !== index);
//     setSkills(newSkills);
//   };

//   const handleAddProject = () => {
//     setFormData((prev) => ({
//       ...prev,
//       academicProjects: [
//         ...prev.academicProjects,
//         { name: "", skillsUsed: "" },
//       ],
//     }));
//   };

//   const handleRemoveProject = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       academicProjects: prev.academicProjects.filter((_, i) => i !== index),
//     }));
//   };

//   const handleAddCertification = () => {
//     setFormData((prev) => ({
//       ...prev,
//       certifications: [...prev.certifications, { name: "" }],
//     }));
//   };

//   const handleRemoveCertification = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       certifications: prev.certifications.filter((_, i) => i !== index),
//     }));
//   };

//   const handleInputChange = (section, field, value, index = null) => {
//     if (index !== null) {
//       setFormData((prev) => ({
//         ...prev,
//         [section]: prev[section].map((item, i) =>
//           i === index ? { ...item, [field]: value } : item
//         ),
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [section]: {
//           ...prev[section],
//           [field]: value,
//         },
//       }));
//     }
//   };

//   const generatePDF = () => {
//     const resumeContent = document.createElement("div");
//     resumeContent.innerHTML = `
//       <div id="resume-container" style="max-width: 800px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
//         <div style="text-align: center; margin-bottom: 30px;">
//           <div style="color: #0066cc; font-size: 24px; font-weight: bold; margin-bottom: 5px;">
//             ${formData.personalInfo.fullName}
//           </div>
//           <div style="color: #666; font-size: 14px;">
//             ${formData.personalInfo.email} | ${formData.personalInfo.phone}
//           </div>
//         </div>
        
//         <!-- Skills Section -->
//         <div style="margin-bottom: 25px;">
//           <div style="color: #0066cc; font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">
//             SKILLS
//           </div>
//           <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
//             <ul>
//               ${skills.map((skill) => `<li>${skill}</li>`).join("")}
//             </ul>
//           </div>
//         </div>
        
//         <!-- Work Experience -->
//         <div style="margin-bottom: 25px;">
//           <div style="color: #0066cc; font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">
//             WORK EXPERIENCE
//           </div>
//           <div style="margin-bottom: 20px;">
//             <div style="font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
//               <span>${formData.workExperience.position} | ${
//       formData.workExperience.companyName
//     }</span>
//               <span style="color: #666; font-size: 14px;">
//                 ${formData.workExperience.startMonth} ${
//       formData.workExperience.startYear
//     } - 
//                 ${formData.workExperience.endMonth} ${
//       formData.workExperience.endYear
//     }
//               </span>
//             </div>
//           </div>
//         </div>
        
//         <div style="margin-bottom: 25px;">
//           <div style="color: #0066cc; font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">
//             ACADEMIC PROJECTS
//           </div>
//           ${formData.academicProjects
//             .map(
//               (project) => `
//             <div style="margin-bottom: 15px;">
//               <div style="font-weight: bold;">${project.name}</div>
//               <div>Skills Used: ${project.skillsUsed}</div>
//             </div>
//           `
//             )
//             .join("")}
//         </div>

//         <!-- Certifications Section -->
//         <div style="margin-bottom: 25px;">
//           <div style="color: #0066cc; font-size: 16px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">
//             CERTIFICATIONS
//           </div>
//           <ul>
//             ${formData.certifications
//               .map(
//                 (cert) => `
//               <li>${cert.name}</li>
//             `
//               )
//               .join("")}
//           </ul>
//         </div>
//       </div>
//     `;

//     const opt = {
//       margin: 1,
//       filename: "resume.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };

//     html2pdf().set(opt).from(resumeContent).save();
//   };

//   return (
//     <div style={{ display: "flex", gap: "20px" }}>
//       <Box sx={{ flex: 1, padding: "20px" }}>
//         <Typography variant="h4" sx={{ marginBottom: "20px" }}>
//           Resume Builder
//         </Typography>

//         <Box
//           component="form"
//           sx={{ "& .MuiTextField-root": { m: 1, width: "33ch" } }}
//         >
//           {/* Personal Info Section */}
//           <div>
//             <Typography variant="h6" sx={{ margin: "20px 0 10px" }}>
//               Personal Info
//             </Typography>
//             <TextField
//               required
//               label="Role"
//               value={formData.personalInfo.targetRole}
//               onChange={(e) =>
//                 handleInputChange("personalInfo", "targetRole", e.target.value)
//               }
//             />
//             <TextField
//               label="Full Name"
//               value={formData.personalInfo.fullName}
//               onChange={(e) =>
//                 handleInputChange("personalInfo", "fullName", e.target.value)
//               }
//             />
//             <TextField
//               label="Email"
//               value={formData.personalInfo.email}
//               onChange={(e) =>
//                 handleInputChange("personalInfo", "email", e.target.value)
//               }
//             />
//             <TextField
//               label="Phone"
//               type="number"
//               value={formData.personalInfo.phone}
//               onChange={(e) =>
//                 handleInputChange("personalInfo", "phone", e.target.value)
//               }
//             />
//             <TextField
//               label="Github"
//               value={formData.personalInfo.github}
//               onChange={(e) =>
//                 handleInputChange("personalInfo", "github", e.target.value)
//               }
//             />
//             <TextField
//               label="LinkedIn"
//               value={formData.personalInfo.linkedin}
//               onChange={(e) =>
//                 handleInputChange("personalInfo", "linkedin", e.target.value)
//               }
//             />
//           </div>

//           {/* Skills Section */}
//           <div>
//             <Typography variant="h6" sx={{ margin: "20px 0 10px" }}>
//               Skills
//             </Typography>
//             {skills.map((skill, index) => (
//               <Stack key={index} direction="row" alignItems="center">
//                 <TextField
//                   label={`Skill ${index + 1}`}
//                   value={skill}
//                   onChange={(e) => handleSkillChange(index, e.target.value)}
//                 />
//                 {index === skills.length - 1 ? (
//                   <IconButton onClick={handleAddSkill}>
//                     <AddIcon />
//                   </IconButton>
//                 ) : (
//                   <IconButton onClick={() => handleRemoveSkill(index)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 )}
//               </Stack>
//             ))}
//           </div>

//           {/* Work Experience Section */}
//           <div>
//             <Typography variant="h6" sx={{ margin: "20px 0 10px" }}>
//               Work Experience
//             </Typography>
//             <TextField
//               required
//               label="Position"
//               value={formData.workExperience.position}
//               onChange={(e) =>
//                 handleInputChange("workExperience", "position", e.target.value)
//               }
//             />
//             <TextField
//               required
//               label="Company Name"
//               value={formData.workExperience.companyName}
//               onChange={(e) =>
//                 handleInputChange(
//                   "workExperience",
//                   "companyName",
//                   e.target.value
//                 )
//               }
//             />

//             {/* Duration Fields */}
//             <Stack direction="row" spacing={2} sx={{ margin: "10px" }}>
//               <TextField
//                 select
//                 label="Start Month"
//                 value={formData.workExperience.startMonth}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "workExperience",
//                     "startMonth",
//                     e.target.value
//                   )
//                 }
//               >
//                 {months.map((month) => (
//                   <MenuItem key={month} value={month}>
//                     {month}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 label="Start Year"
//                 value={formData.workExperience.startYear}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "workExperience",
//                     "startYear",
//                     e.target.value
//                   )
//                 }
//               >
//                 {years.map((year) => (
//                   <MenuItem key={year} value={year}>
//                     {year}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Stack>

//             <Stack direction="row" spacing={2} sx={{ margin: "10px" }}>
//               <TextField
//                 select
//                 label="End Month"
//                 value={formData.workExperience.endMonth}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "workExperience",
//                     "endMonth",
//                     e.target.value
//                   )
//                 }
//               >
//                 {months.map((month) => (
//                   <MenuItem key={month} value={month}>
//                     {month}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 label="End Year"
//                 value={formData.workExperience.endYear}
//                 onChange={(e) =>
//                   handleInputChange("workExperience", "endYear", e.target.value)
//                 }
//               >
//                 {years.map((year) => (
//                   <MenuItem key={year} value={year}>
//                     {year}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Stack>
//           </div>
//           <div>
//             <Typography variant="h6" sx={{ margin: "20px 0 10px" }}>
//               Academic Projects
//             </Typography>
//             {formData.academicProjects.map((project, index) => (
//               <Stack key={index} spacing={2} sx={{ margin: "10px" }}>
//                 <TextField
//                   required
//                   label="Project Name"
//                   value={project.name}
//                   onChange={(e) =>
//                     handleInputChange(
//                       "academicProjects",
//                       "name",
//                       e.target.value,
//                       index
//                     )
//                   }
//                 />
//                 <TextField
//                   required
//                   label="Skills Used"
//                   value={project.skillsUsed}
//                   onChange={(e) =>
//                     handleInputChange(
//                       "academicProjects",
//                       "skillsUsed",
//                       e.target.value,
//                       index
//                     )
//                   }
//                 />
//                 <Stack direction="row" spacing={1}>
//                   {index === formData.academicProjects.length - 1 && (
//                     <IconButton onClick={handleAddProject}>
//                       <AddIcon />
//                     </IconButton>
//                   )}
//                   {formData.academicProjects.length > 1 && (
//                     <IconButton onClick={() => handleRemoveProject(index)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   )}
//                 </Stack>
//               </Stack>
//             ))}
//           </div>

//           {/* Certifications Section */}
//           <div>
//             <Typography variant="h6" sx={{ margin: "20px 0 10px" }}>
//               Certifications
//             </Typography>
//             {formData.certifications.map((cert, index) => (
//               <Stack
//                 key={index}
//                 direction="row"
//                 alignItems="center"
//                 spacing={2}
//                 sx={{ margin: "10px" }}
//               >
//                 <TextField
//                   required
//                   label="Certification"
//                   value={cert.name}
//                   onChange={(e) =>
//                     handleInputChange(
//                       "certifications",
//                       "name",
//                       e.target.value,
//                       index
//                     )
//                   }
//                   sx={{ flex: 1 }}
//                 />
//                 {index === formData.certifications.length - 1 && (
//                   <IconButton onClick={handleAddCertification}>
//                     <AddIcon />
//                   </IconButton>
//                 )}
//                 {formData.certifications.length > 1 && (
//                   <IconButton onClick={() => handleRemoveCertification(index)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 )}
//               </Stack>
//             ))}
//           </div>

//           {/* Generate PDF Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={generatePDF}
//             sx={{ margin: "20px" }}
//           >
//             Generate PDF
//           </Button>
//         </Box>
//       </Box>

//       {/* Resume Preview */}
//       <Box
//         sx={{
//           flex: 1,
//           padding: "20px",
//           backgroundColor: "#f5f5f5",
//           borderRadius: "8px",
//           maxHeight: "100vh",
//           overflow: "auto",
//         }}
//       >
//         <div id="resume-preview">
//           {/* Preview content will be dynamically updated */}
//         </div>
//       </Box>
//     </div>
//   );
// };

// export default Fresher;

