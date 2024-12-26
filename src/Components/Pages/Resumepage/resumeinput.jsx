import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Stack,
  Container,
  CircularProgress,
  Alert,
  styled
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete"; // Fixed import
import ResumeTemplate from "./resumetemplate";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  inputField: {
    width: "calc(38ch + 20px)",
    margin: "10px 10px !important"
  },
  box: {
    height: "100vh",
    overflow: "hidden",
    padding: "20px"
  },
  contentWrapper: {
    display: "flex",
    gap: "20px",
    height: "calc(100% - 40px)"
  },
  formSection: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px"
  },
  previewSection: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px"
  },
  sectionTitle: {
    margin: "20px 0 10px",
    color: "#1976d2",
    fontWeight: 600
  },
  generateButton: {
    marginTop: "20px",
    marginBottom: "20px"
  }
});

const ResumeBuilder = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [formData, setFormData] = useState({
    // Match the API request structure
    name: "",
    email: "",
    phone: "",
    target_role: "",
    work_experience: [{
      position: "",
      company_name: "",
      duration: ""
    }],
    skills: [""],
    Academic_projects: [{
      name: "",
      description: "",
      skills_used: ""
    }],
    degree: "",
    specialization: "",
    institution: "",
    graduation_year: new Date().getFullYear(),
    certifications: [""]
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Work Experience handlers
  const handleAddWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        {
          position: "",
          company_name: "",
          duration: ""
        }
      ]
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill))
    }));
  };

  // Academic Projects handlers
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      Academic_projects: [
        ...prev.Academic_projects,
        {
          name: "",
          description: "",
          skills_used: ""
        }
      ]
    }));
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      Academic_projects: prev.Academic_projects.filter((_, i) => i !== index)
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      Academic_projects: prev.Academic_projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  // Certifications handlers
  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""]
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleCertificationChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? value : cert
      )
    }));
  };

  const handleGeneratePreview = async () => {
    setLoading(true);
    setError(null);
    setPreviewData(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_fresher_resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("Raw API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate resume');
      }

      // Transform API response to match template structure
      const transformedData = {
        header: {
          Name: data.resume.Header?.Name || data.resume.Header?.name || "",
          Email: data.resume.Header?.Email || data.resume.Header?.email || "",
          Phone: data.resume.Header?.Phone || data.resume.Header?.phone || ""
        },
        summary: data.resume.Summary?.["Professional Summary"] || data.resume.Summary || "",
        skills: Array.isArray(data.resume.Skills) ? data.resume.Skills : [],
        workExperience: (data.resume["Work Experience"] || []).map(exp => ({
          position: exp.Position,
          company: exp.Company,
          duration: exp.Duration,
          responsibilities: exp.Responsibilities || []
        })),
        education: [{
          degree: data.resume.Education?.Degree || "",
          specialization: data.resume.Education?.Specialization || "",
          institution: data.resume.Education?.Institution || "",
          graduationYear: data.resume.Education?.["Graduation Year"] || ""
        }],
        academicProjects: Array.isArray(data.resume["Academic Projects"]) 
          ? data.resume["Academic Projects"].map(proj => ({
              name: proj["Project Name"] || "",
              description: proj.Description || "",
              technologies: proj.Technologies || [],
              duration: proj.Duration || "",
              role: proj.Role || ""
            }))
          : [],
        certifications: data.resume.Certifications || []
      };

      console.log("Transformed Data:", transformedData);
      setPreviewData(transformedData);

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.box}>
      <Box className={classes.contentWrapper}>
        <Box className={classes.formSection}>
          <Typography variant="h4" gutterBottom>
            Resume Builder
          </Typography>

          <Box component="form">
            {/* Personal Info Section */}
            <Typography variant="h6" className={classes.sectionTitle}>Personal Info</Typography>
            <Box>
              <TextField
                required
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={classes.inputField}
              />
              <TextField
                required
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={classes.inputField}
              />
              <TextField
                required
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={classes.inputField}
              />
              <TextField
                label="LinkedIn"
                value={formData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                className={classes.inputField}
              />
              <TextField
                label="GitHub"
                value={formData.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                className={classes.inputField}
              />
              <TextField
                required
                label="Target Role"
                value={formData.target_role}
                onChange={(e) =>
                  handleInputChange("target_role", e.target.value)
                }
                className={classes.inputField}
              />
            </Box>

            {/* Work Experience Section */}
            <Typography variant="h6" className={classes.sectionTitle}>Work Experience</Typography>
            {formData.work_experience.map((exp, index) => (
              <Box key={index}>
                <TextField
                  label="Position"
                  value={exp.position}
                  onChange={(e) =>
                    handleWorkExperienceChange(index, "position", e.target.value)
                  }
                  className={classes.inputField}
                />
                <TextField
                  label="Company Name"
                  value={exp.company_name}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      index,
                      "company_name",
                      e.target.value
                    )
                  }
                  className={classes.inputField}
                />
                <TextField
                  label="Duration"
                  value={exp.duration}
                  onChange={(e) =>
                    handleWorkExperienceChange(index, "duration", e.target.value)
                  }
                  placeholder="e.g., Jan 2024 - Present"
                  className={classes.inputField}
                />
                <IconButton
                  onClick={() =>
                    index === formData.work_experience.length - 1
                      ? handleAddWorkExperience()
                      : handleRemoveWorkExperience(index)
                  }
                >
                  {index === formData.work_experience.length - 1 ? (
                    <AddIcon />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Box>
            ))}

            {/* Skills Section */}
            <Typography variant="h6" className={classes.sectionTitle}>Skills</Typography>
            {formData.skills.map((skill, index) => (
              <Stack key={index} direction="row" alignItems="center">
                <TextField
                  required
                  label={`Skill ${index + 1}`}
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className={classes.inputField}
                />
                <IconButton
                  onClick={() =>
                    index === formData.skills.length - 1
                      ? handleAddSkill()
                      : handleRemoveSkill(index)
                  }
                >
                  {index === formData.skills.length - 1 ? (
                    <AddIcon />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Stack>
            ))}

            {/* Academic Projects Section */}
            <Typography variant="h6" className={classes.sectionTitle}>Academic Projects</Typography>
            {formData.Academic_projects.map((project, index) => (
              <Box key={index}>
                <TextField
                  required
                  label="Project Name"
                  value={project.name}
                  onChange={(e) =>
                    handleProjectChange(index, "name", e.target.value)
                  }
                  className={classes.inputField}
                />
                <TextField
                  required
                  label="Skills Used"
                  value={project.skills_used}
                  onChange={(e) =>
                    handleProjectChange(index, "skills_used", e.target.value)
                  }
                  className={classes.inputField}
                />
                <IconButton
                  onClick={() =>
                    index === formData.Academic_projects.length - 1
                      ? handleAddProject()
                      : handleRemoveProject(index)
                  }
                >
                  {index === formData.Academic_projects.length - 1 ? (
                    <AddIcon />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Box>
            ))}

            {/* Education Section */}
            <Typography variant="h6" className={classes.sectionTitle}>Education</Typography>
            <Box>
              <TextField
                required
                label="Degree"
                value={formData.degree}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                className={classes.inputField}
              />
              <TextField
                required
                label="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange("specialization", e.target.value)
                }
                className={classes.inputField}
              />
              <TextField
                required
                label="Institution"
                value={formData.institution}
                onChange={(e) =>
                  handleInputChange("institution", e.target.value)
                }
                className={classes.inputField}
              />
              <TextField
                required
                label="Graduation Year"
                value={formData.graduation_year}
                onChange={(e) =>
                  handleInputChange("graduation_year", e.target.value)
                }
                className={classes.inputField}
              />
            </Box>

            {/* Certifications Section */}
            <Typography variant="h6" className={classes.sectionTitle}>Certifications</Typography>
            {formData.certifications.map((cert, index) => (
              <Stack key={index} direction="row" alignItems="center">
                <TextField
                  label={`Certification ${index + 1}`}
                  value={cert}
                  onChange={(e) =>
                    handleCertificationChange(index, e.target.value)
                  }
                  className={classes.inputField}
                />
                <IconButton
                  onClick={() =>
                    index === formData.certifications.length - 1
                      ? handleAddCertification()
                      : handleRemoveCertification(index)
                  }
                >
                  {index === formData.certifications.length - 1 ? (
                    <AddIcon />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Stack>
            ))}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGeneratePreview}
              disabled={loading}
              className={classes.generateButton}
            >
              {loading ? <CircularProgress size={24} /> : "Generate Resume"}
            </Button>
          </Box>
        </Box>

        <Box className={classes.previewSection}>
          <Typography variant="h5" gutterBottom>
            Preview
          </Typography>
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {previewData && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Preview data loaded
                </Typography>
              </Box>
              <ResumeTemplate resumeData={previewData} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ResumeBuilder;
