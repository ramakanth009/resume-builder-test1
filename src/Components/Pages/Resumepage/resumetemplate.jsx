import React from 'react';
import { 
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const ResumeTemplate = ({ resumeData }) => {
  const [processedData, setProcessedData] = React.useState(null);
  
  React.useEffect(() => {
    if (resumeData) {
      const processed = {
        header: {
          name: resumeData.header?.Name || '',
          email: resumeData.header?.Email || '',
          phone: resumeData.header?.Phone || ''
        },
        summary: resumeData.summary || '',
        skills: Array.isArray(resumeData.skills) ? resumeData.skills.filter(Boolean) : [],
        workExp: Array.isArray(resumeData.workExperience) ? 
          resumeData.workExperience.filter(exp => exp.position || exp.company) : [],
        education: resumeData.education?.[0] || {},
        projects: Array.isArray(resumeData.academicProjects) ? 
          resumeData.academicProjects.filter(proj => proj.name) : [],
        certs: Array.isArray(resumeData.certifications) ? 
          resumeData.certifications.filter(Boolean) : []
      };
      setProcessedData(processed);
    }
  }, [resumeData]);

  if (!resumeData || !processedData) {
    return <Box sx={{ p: 2 }}><Typography>Loading...</Typography></Box>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>            {processedData.header.name || ''}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {[processedData.header.email, processedData.header.phone].filter(Boolean).join(' | ')}
          </Typography>
        </Box>

        {/* Summary */}
        {processedData.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Professional Summary
            </Typography>
            <Typography variant="body1">
              {processedData.summary}
            </Typography>
          </Box>
        )}

        {/* Skills */}
        {processedData.skills.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {processedData.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Work Experience */}
        {processedData.workExp.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Work Experience
            </Typography>
            <List>
              {processedData.workExp.map((exp, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                  <Typography variant="h6">{exp.position}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {exp.company} | {exp.duration}
                  </Typography>
                  {exp.responsibilities && (
                    <List>
                      {exp.responsibilities.map((resp, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Education
            </Typography>
            <Typography variant="h6">
              {processedData.education.degree} in {processedData.education.specialization}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {processedData.education.institution}, {processedData.education.graduationYear}
            </Typography>
          </Box>
        )}

        {/* Academic Projects */}
        {processedData.projects.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Academic Projects
            </Typography>
            <List>
              {processedData.projects.map((project, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body1">{project.description}</Typography>
                  {project.skillsUsed && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                        <Typography variant="subtitle2" color="text.secondary">
                          Skills: {project.skillsUsed}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {index < processedData.projects.length - 1 && <Divider sx={{ width: '100%', mt: 2 }} />}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Certifications */}
        {processedData.certs.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              Certifications
            </Typography>
            <List>
              {processedData.certs.map((cert, index) => (
                <ListItem key={index}>
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