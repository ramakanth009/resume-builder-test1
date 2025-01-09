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
          name: resumeData.header?.name || "",
          email: resumeData.header?.email || "",
          phone: resumeData.header?.phone || "",
          github: resumeData.header?.github || "",
          linkedin: resumeData.header?.linkedin || "",
          portfolio: resumeData.header?.portfolio || "",
        },
        summary: resumeData.summary || "",
        skills: Array.isArray(resumeData.skills)
          ? resumeData.skills.filter(Boolean)
          : [],
        workExp: Array.isArray(resumeData.workExperience)
          ? resumeData.workExperience.filter(
              (exp) => exp.position || exp.companyName
            )
          : [],
        education: resumeData.education?.[0] || {},
        projects: Array.isArray(resumeData.projects)
          ? resumeData.projects.filter((proj) => proj.name)
          : [],
        certs: Array.isArray(resumeData.certifications)
          ? resumeData.certifications.filter(Boolean)
          : [],
      };
      console.log("Processed Data for Template:", processed);
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
              processedData.header.github && (
                <a href={processedData.header.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              ),
              processedData.header.linkedin && (
                <a href={processedData.header.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              ),
              processedData.header.portfolio && (
                <a href={processedData.header.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              ),
            ]
              .filter(Boolean)
              .map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && " | "}
                  {item}
                </React.Fragment>
              ))}
          </Typography>
        </Box>

        {/* Summary */}
        {processedData.summary && typeof processedData.summary === "string" && (
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
                    {exp.companyName} | {exp.duration}
                  </Typography>
                  {Array.isArray(exp.responsibilities) &&
                    exp.responsibilities.length > 0 && (
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
                              display: "list-item",
                              listStyleType: "disc",
                              "&::marker": {
                                color: "#2365C8",
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
            <List sx={{ mt: 2 }}>
              {processedData.projects.map((project, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    className={classes.projectItem}
                    sx={{
                      padding: "8px 0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h6"
                      className={classes.projectTitle}
                      sx={{ fontWeight: 600 }}
                    >
                      {project.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#666666",
                        mt: 1,
                      }}
                    >
                      {project.description}
                    </Typography>
                  </ListItem>
                  {index < processedData.projects.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Certifications */}
        {Array.isArray(processedData.certs) &&
          processedData.certs.length > 0 && (
            <Box className={classes.sectionContainer}>
              <Typography
                variant="h5"
                gutterBottom
                className={classes.sectionTitle}
              >
                Certifications
              </Typography>
              <List
                sx={{
                  listStyleType: "disc",
                  padding: "0 0 3px 20px",
                }}
              >
                {processedData.certs.map((cert, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "list-item",
                      listStyleType: "disc",
                      "&::marker": {
                        color: "#2365C8",
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
