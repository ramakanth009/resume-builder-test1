import React, { useEffect, useState } from "react";
import ResumeTemplate1 from "../Resumetemplates/resumetemplate1";
import ResumeTemplate2 from "../Resumetemplates/resumetemplate2";
import ResumeTemplate3 from "../Resumetemplates/resumetemplate3";
import ResumeTemplate4 from "../Resumetemplates/resumetemplate4";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

// API base URL - replace with your actual API URL
const MASTER_API_URL = "http://your-api-base-url.com";

const useStyles = makeStyles({
  choosetempmain: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    padding: "20px",
    justifyContent: "space-between",
  },
  chooseback: {
    marginRight: "10px",
  },
  choosemain: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },
  chooseleft: {
    width: "40%",
    backgroundColor: "#f5f5f5",
    margin: "30px",
  },
  chooseright: {
    width: "60%",
  },
  choosesubhead: {
    textAlign: "center",
    padding: "10px",
  },
  choosebutton: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    padding: "20px",
  },
  templateImage: {
    height: "90%",
    width: "90%",
    cursor: "pointer",
    border: "2px solid transparent",
    "&:hover": {
      border: "2px solid #1976d2",
    },
  },
  selectedTemplate: {
    border: "2px solid #1976d2",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    padding: "20px",
  }
});

const ChooseTemplate = () => {
  const classes = useStyles();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const navigate = useNavigate();

  // to fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${MASTER_API_URL}/api/templates`);
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setTemplates(data.templates);
          // to set first template as default selected
          if (data.templates.length > 0) {
            setSelectedTemplate(`template${data.templates[0].id}`);
          }
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const templateId = selectedTemplate.replace('template', '');
      const fetchPreviewData = async () => {
        try {
          const response = await fetch(`${MASTER_API_URL}/api/templates/${templateId}/preview`);
          if (!response.ok) {
            throw new Error('Failed to fetch preview data');
          }
          const data = await response.json();
          setPreviewData(data);
        } catch (err) {
          console.error('Error fetching preview data:', err);
        }
      };

      fetchPreviewData();
    }
  }, [selectedTemplate]);

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "template1":
        return <ResumeTemplate1 resumeData={previewData} />;
      case "template2":
        return <ResumeTemplate2 resumeData={previewData} />;
      case "template3":
        return <ResumeTemplate3 resumeData={previewData} />;
      case "template4":
        return <ResumeTemplate4 resumeData={previewData} />;
      default:
        return <p>Please select a template</p>;
    }
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.errorMessage}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box className={classes.choosetempmain}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          className={classes.chooseback}
        >
          Back
        </Button>
        <Typography variant="h3" color="initial">
          Choose Template
        </Typography>
        <Button 
          variant="contained"
          disabled={!selectedTemplate}
        >
          Download
        </Button>
      </Box>
      <Box className={classes.choosemain}>
        <Box className={classes.chooseleft}>
          <Typography
            variant="h3"
            className={classes.choosesubhead}
            color="initial"
          >
            Templates
          </Typography>
          <Box className={classes.choosebutton}>
            {templates.map((template) => (
              <img
                key={template.id}
                src={`${MASTER_API_URL}${template.thumbnail_url}`}
                alt={template.name}
                className={`${classes.templateImage} ${
                  selectedTemplate === `template${template.id}` ? classes.selectedTemplate : ''
                }`}
                onClick={() => setSelectedTemplate(`template${template.id}`)}
                title={template.description}
              />
            ))}
          </Box>
        </Box>
        <Box className={classes.chooseright}>
          {renderTemplate()}
        </Box>
      </Box>
    </Box>
  );
};

export default ChooseTemplate;