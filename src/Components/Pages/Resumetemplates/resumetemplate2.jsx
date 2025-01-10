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
      fontFamily: "Inter !important",
    },
  },
  paper: {
    padding: "40px",
    margin: "32px 0",
    boxSizing: "border-box",
    borderRadius: "0",
    // backgroundColor: "#FFFFFF",
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    margin: "20px",
  },
  rightSection: {
    flex: "0 0 58%",
    padding: "10px 10px 0 0",
    marginRight: "20px !important",
  },
  leftSection: {
    maxWidth: "30%",
    flex: "0 0 30",
    backgroundColor: "#FDFDFD",
    padding: "10px 32px 32px 32px",
  },
  headerBox: {
    borderBottom: "1px solid #163853",
  },
  headerName: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#323B4C",
    textTransform: "uppercase",
    letterSpacing: "3px",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#323B4C",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "16px",
    borderBottom: "1px solid #EEEEEE",
    paddingBottom: "8px",
  },
  sectionContainer: {
    marginBottom: "40px",
  },
  worksectiondetail: {
    display: "flex",
    flexDirection: "column",
  },
  profile: {
    color: "#666666",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  experienceItem: {
    // marginBottom: "24px",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  companyTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333333",
    marginBottom: "4px",
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
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "32px",
    color: "#666666",
    "& > *": {
      fontSize: "14px",
    },
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
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "8px",
  },
  projectDescription: {
    // color: "#666666",
    marginBottom: "16px",
    lineHeight: "1.6 !important",
  },
  projectTechnologies: {
    color: "#666666",
  },
  projectDivider: {
    margin: "16px 0",
  },
  skillList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    "& li": {
      color: "#666666",
      marginBottom: "8px",
      fontSize: "14px",
    },
  },
  languageItem: {
    color: "#666666",
    fontSize: "14px",
    marginBottom: "8px",
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
    <Container maxWidth="md">
      <Paper elevation={3} className={classes.paper}>
        <Box className={classes.mainContainer}>
          {/* Header */}
          <Box sx={{ mb: 4, pb: 3 }} className={classes.headerBox}>
            <Typography
              variant="h4"
              // component="h1"
              gutterBottom
              className={classes.headerName}
            >
              {processedData.header.name}
            </Typography>
          </Box>
          <Box className={classes.subContainer}>
            <Stack className={classes.leftSection}>
              {/* Contact */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  Contact
                </Typography>
                <Box className={classes.contactInfo}>
                  <Typography>{processedData.header.phone}</Typography>
                  <Typography>{processedData.header.email}</Typography>
                  {processedData.header.github && (
                    <Typography>
                      <a
                        href={processedData.header.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </Typography>
                  )}
                  {processedData.header.linkedin && (
                    <Typography>
                      <a
                        href={processedData.header.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Typography>
                  )}
                  {processedData.header.portfolio && (
                    <Typography>
                      <a
                        href={processedData.header.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Portfolio
                      </a>
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Skills */}
              {processedData.skills.length > 0 && (
                <Box className={classes.sectionContainer}>
                  <Typography className={classes.sectionTitle}>
                    Skills
                  </Typography>
                  <List className={classes.skillList}>
                    {processedData.skills.map((skill, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemText primary={skill} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Languages */}
              {/* <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  Languages
                </Typography>
                <List className={classes.skillList}>
                  {(processedData.languages || ["English (Fluent)"]).map(
                    (lang, index) => (
                      <ListItem key={index} disablePadding>
                        <Typography className={classes.languageItem}>
                          {lang}
                        </Typography>
                      </ListItem>
                    )
                  )}
                </List>
              </Box> */}
              {/* Education */}
              {processedData.education && (
                <Box className={classes.sectionContainer}>
                  <Typography className={classes.sectionTitle}>
                    Education
                  </Typography>
                  <Typography className={classes.companyTitle}>
                    {processedData.education.degree} in{" "}
                    {processedData.education.specialization}
                    {" - "}
                    {/* <Typography className={classes.experienceDate}> */}
                    {processedData.education.graduationYear}
                    {/* </Typography> */}
                  </Typography>
                  <Typography className={classes.experienceDesc}>
                    {processedData.education.institution}
                  </Typography>
                </Box>
              )}
            </Stack>
            <Stack className={classes.rightSection}>
              {/* Profile */}
              {processedData.summary && (
                <Box className={classes.sectionContainer}>
                  <Typography className={classes.sectionTitle}>
                    Profile
                  </Typography>
                  <Typography className={classes.profile}>
                    {processedData.summary}
                  </Typography>
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
                        <Typography variant="h6">{exp.company}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {exp.position} | {exp.duration}
                        </Typography>
                        {exp.responsibilities && (
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
                        <Box className={classes.projectBox}>
                          <Typography
                            variant="subtitle1"
                            className={classes.projectTitle}
                          >
                            {project.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            className={classes.projectDescription}
                          >
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
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeTemplate;
