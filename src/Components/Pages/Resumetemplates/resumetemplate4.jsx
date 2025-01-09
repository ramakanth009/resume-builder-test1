import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";
import "@fontsource/inter";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  "@global": {
    "*": {
      fontFamily: "tahoma !important",
      boxSizing: "border-box",
    },
  },
  root: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  paper: {
    margin: "32px 0",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: "40px",
    backgroundColor: "#59677B !important",
  },
  headerName: {
    color: "#F4F2F1",
    textTransform: "capitalize",
    borderBottom: "#F4F2F1 2px solid",
    fontFamily: "times !important",
    marginBottom: "16px",
  },
  headerlinks: {
    color: "#F4F2F1 !important",
    marginBottom: "16px",
  },
  headerlink2: {
    fontSize: "1.1rem",
    color: "#F4F2F1 !important",
    textDecoration: "underline",
    "&:hover": {
      color: "#E0E0E0 !important",
    },
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    // margin: "40px",
    // "@media (max-width: 960px)": {
    //   flexDirection: "column",
    //   gap: "20px",
    //   margin: "20px",
    // },
  },
  leftSection: {
    minWidth: "60%",
    flex: "0 0 60%",
    padding: "30px 10px 0 30px",
    backgroundColor: "#EDECED",
    // "@media (max-width: 960px)": {
    //   flex: "1 1 100%",
    //   padding: "0",
    //   borderRight: "none",
    // },
  },
  rightSection: {
    minWidth: "30%",
    flex: "0 0 35%",
    padding: "20px 0 0 5px",
    // "@media (max-width: 960px)": {
    //   flex: "1 1 100%",
    // },
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#596D7B",
    textTransform: "capitalize",
    letterSpacing: "2px",
    marginBottom: "16px",
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: "32px",
    // borderBottom: "2px solid #59677B",
  },
  profile: {
    color: "#666666",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  experienceItem: {
    marginBottom: "24px",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  companyTitle: {
    fontSize: "16px !important",
    fontWeight: "bold !important",
    color: "#333333",
    marginBottom: "8px",
  },
  experienceDate: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "12px",
  },
  experienceDesc: {
    color: "#666666",
    marginBottom: "8px",
  },
  projectItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "8px 0",
    width: "100%",
  },
  projectBox: {
    width: "100%",
  },
  projectTitle: {
    fontSize: "20px !important",
    fontWeight: "500 !important",
    color: "#333333",
    marginBottom: "8px",
  },
  projectDescription: {
    marginBottom: "16px",
    lineHeight: "1.6 !important",
    color: "#666666",
  },
  projectDivider: {
    margin: "16px 0",
    width: "100%",
  },
  skillList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "32px",
    "& li": {
      color: "#666666",
      marginBottom: "8px",
      fontSize: "14px",
    },
  },
  responsibilityList: {
    listStyleType: "disc",
    padding: "0 0 3px 20px",
    "& .MuiListItem-root": {
      display: "list-item",
      padding: "1px",
      "&::marker": {
        color: "#323B4C",
      },
    },
  },
  linkContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    flexWrap: "wrap",
  },
});

const ResumeTemplate = ({ resumeData }) => {
  const classes = useStyles();
  const [processedData, setProcessedData] = React.useState(null);
  const [error, setError] = React.useState(null);

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
      setProcessedData(processed);
    }
  }, [resumeData]);

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!processedData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading resume data...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Box className={classes.header}>
          <Typography variant="h3" component="h1" className={classes.headerName}>
            {processedData.header.name}
          </Typography>
          
          {(processedData.header.email || processedData.header.phone) && (
            <Typography className={classes.headerlinks}>
              {[processedData.header.email, processedData.header.phone]
                .filter(Boolean)
                .join(" | ")}
            </Typography>
          )}

          <Box className={classes.linkContainer}>
            {processedData.header.github && (
              <Typography>
                <a href={processedData.header.github} className={classes.headerlink2}>
                  Github |
                </a>
              </Typography>
            )}
            {processedData.header.linkedin && (
              <Typography>
                <a
                  href={processedData.header.linkedin}
                  className={classes.headerlink2}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn |
                </a>
              </Typography>
            )}
            {processedData.header.portfolio && (
              <Typography>
                <a
                  href={processedData.header.portfolio}
                  className={classes.headerlink2}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
              </Typography>
            )}
          </Box>
        </Box>

        <Box className={classes.subContainer}>
          <Stack className={classes.leftSection}>
            {processedData.workExp.length > 0 && (
              <Box className={classes.sectionContainer}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Work Experience
                </Typography>
                <List>
                  {processedData.workExp.map((exp, index) => (
                    <ListItem key={index} className={classes.experienceItem}>
                      <Typography variant="h6">{exp.company}</Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {exp.position} {exp.duration ? `| ${exp.duration}` : ""}
                      </Typography>
                      {exp.responsibilities?.length > 0 && (
                        <List className={classes.responsibilityList}>
                          {exp.responsibilities.map((resp, idx) => (
                            <ListItem key={idx}>
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

            {processedData.projects.length > 0 && (
              <Box className={classes.sectionContainer}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Academic Projects
                </Typography>
                <List>
                  {processedData.projects.map((project, index) => (
                    <ListItem key={index} className={classes.projectItem}>
                      <Box className={classes.projectBox}>
                        <Typography variant="subtitle1" className={classes.projectTitle}>
                          {project.name}
                        </Typography>
                        <Typography variant="body1" className={classes.projectDescription}>
                          {project.description}
                        </Typography>
                      </Box>
                      {index < processedData.projects.length - 1 && (
                        <Divider className={classes.projectDivider} />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Certifications */}
            {Array.isArray(processedData.certs) && processedData.certs.length > 0 && (
              <Box className={classes.sectionContainer}>
                <Typography variant="h5" className={classes.sectionTitle}>
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
                          color: "#323B4C",
                        },
                      }}
                    >
                      <ListItemText primary={cert} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {processedData.education && (
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  Education
                </Typography>
                <Typography className={classes.companyTitle}>
                  {processedData.education.degree} in {processedData.education.specialization}
                  {processedData.education.graduationYear && ` - ${processedData.education.graduationYear}`}
                </Typography>
                <Typography className={classes.experienceDesc}>
                  {processedData.education.institution}
                </Typography>
              </Box>
            )}
          </Stack>

          <Stack className={classes.rightSection}>
            {processedData.summary && (
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  Professional Summary
                </Typography>
                <Typography className={classes.profile}>
                  {processedData.summary}
                </Typography>
              </Box>
            )}

            {processedData.skills.length > 0 && (
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>Skills</Typography>
                <List className={classes.skillList}>
                  {processedData.skills.map((skill, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={skill} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeTemplate;