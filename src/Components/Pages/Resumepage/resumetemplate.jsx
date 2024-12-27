import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import "@fontsource/inter";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  "@global": {
    "*": {
      fontFamily: "Inter !important",
    },
  },
  root: {},
  paper: {
    padding: "32px",
    margin: "32px 0",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  headerName: {
    color: "#2365C8",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sectionTitle: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    paddingBottom: "8px",
    color: "#2365C8",
    textTransform: "uppercase",
  },
  sectionContainer: {
    marginBottom: "32px",
  },
  skillChip: {
    margin: "4px",
    backgroundColor: "rgba(35, 101, 200, 0.09)",
  },
  experienceItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "16px 0",
  },
  projectItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "16px 0",
  },
  projectTitle: {
    paddingBottom: "8px",
  },
  projectSkills: {
    marginTop: "8px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  projectDivider: {
    width: "100%",
    marginTop: "16px",
  },
  educationHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});

const ResumeTemplate = ({ resumeData }) => {
  const classes = useStyles();
  const [processedData, setProcessedData] = React.useState(null);

  React.useEffect(() => {
    if (resumeData) {
      const processed = {
        header: {
          name: resumeData.header?.Name || "",
          email: resumeData.header?.Email || "",
          phone: resumeData.header?.Phone || "",
          github: resumeData.header?.GitHub || "",
          linkedin: resumeData.header?.LinkedIn || "",
        },
        summary: resumeData.summary || "",
        skills: Array.isArray(resumeData.skills)
          ? resumeData.skills.filter(Boolean)
          : [],
        workExp: Array.isArray(resumeData.workExperience)
          ? resumeData.workExperience.filter(
              (exp) => exp.position || exp.company
            )
          : [],
        education: resumeData.education?.[0] || {},
        projects: Array.isArray(resumeData.academicProjects)
          ? resumeData.academicProjects.filter((proj) => proj.name)
          : [],
        certs: Array.isArray(resumeData.certifications)
          ? resumeData.certifications.filter(Boolean)
          : [],
      };
      setProcessedData(processed);
    }
  }, [resumeData]);

  if (!resumeData || !processedData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        {/* Header */}
        <Box className={classes.header}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className={classes.headerName}
          >
            {processedData.header.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {[
              processedData.header.email,
              processedData.header.phone,
              processedData.header.github,
              processedData.header.linkedin,
            ]
              .filter(Boolean)
              .join(" | ")}
          </Typography>
        </Box>

        {/* Summary */}
        {processedData.summary && (
          <Box className={classes.sectionContainer}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionTitle}
            >
              Professional Summary
            </Typography>
            <Typography variant="body1">{processedData.summary}</Typography>
          </Box>
        )}

        {/* Skills */}
        {processedData.skills.length > 0 && (
          <Box className={classes.sectionContainer}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionTitle}
            >
              Skills
            </Typography>
            <Box className={classes.skillsContainer}>
              {processedData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="outlined"
                  className={classes.skillChip}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Work Experience */}
        {processedData.workExp.length > 0 && (
          <Box className={classes.sectionContainer}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionTitle}
            >
              Work Experience
            </Typography>
            <List>
              {processedData.workExp.map((exp, index) => (
                <ListItem key={index} className={classes.experienceItem}>
                  <Typography variant="h6">{exp.position}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {exp.company} | {exp.duration}
                  </Typography>
                  {exp.responsibilities && (
                    <List
                      sx={{
                        listStyleType: "disc",
                        padding: "0 0 3px 20px",
                      }}
                    >
                      {exp.responsibilities.map((resp, idx) => (
                        <ListItem
                          key={idx}
                          sx={{
                            display: "list-item", // Ensures it behaves like a list item without the default bullet point
                            listStyleType: "disc", // Removes bullet points
                            "&::marker": {
                              color: "#2365C8", // Set the bullet color
                            },
                          }}
                        >
                          <ListItemText primary={resp} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Education */}
        {processedData.education && (
          <Box className={classes.sectionContainer}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionTitle}
            >
              Education
            </Typography>
            <Typography variant="h6" className={classes.educationHeader}>
              {processedData.education.degree} in{" "}
              {processedData.education.specialization}
              <Typography variant="subtitle1" color="text.secondary">
                {" - "}
                {processedData.education.graduationYear}
              </Typography>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {processedData.education.institution}
            </Typography>
          </Box>
        )}

        {/* Academic Projects */}
        {processedData.projects.length > 0 && (
          <Box className={classes.sectionContainer}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionTitle}
            >
              Academic Projects
            </Typography>
            <List>
              {processedData.projects.map((project, index) => (
                <ListItem key={index} className={classes.projectItem}>
                  <Typography variant="h6" className={classes.projectTitle}>
                    {project.name}
                  </Typography>
                  <Typography variant="body1">{project.description}</Typography>
                  {project.skillsUsed && (
                    <Box className={classes.projectSkills}>
                      {Array.isArray(project.skillsUsed) ? (
                        project.skillsUsed.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))
                      ) : (
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ color: "#2365C8", textTransform: "uppercase" }}
                        >
                          Skills: {project.skillsUsed}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {index < processedData.projects.length - 1 && (
                    <Divider className={classes.projectDivider} />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Certifications */}
        {processedData.certs.length > 0 && (
          <Box className={classes.sectionContainer}>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionTitle}
            >
              Certifications
            </Typography>
            {/* <List disablePadding sx={{ listStyleType: "none", padding: 0 }}>
              {processedData.certs.map((cert, index) => (
                <ListItem key={index} sx={{ display: "list-item", listStyleType: "none" }}>
                  <ListItemText primary={cert} />
                </ListItem>
              ))}
            </List> */}
            <List
              // disablePadding
              sx={{
                listStyleType: "disc",
                padding: "0 0 3px 20px",
              }}
            >
              {processedData.certs.map((cert, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "list-item", // Ensures it behaves like a list item without the default bullet point
                    listStyleType: "disc", // Removes bullet points
                    "&::marker": {
                      color: "#2365C8", // Set the bullet color
                    },
                  }}
                >
                  <ListItemText primary={cert} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResumeTemplate;
