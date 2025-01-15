import React, { useEffect, useState } from "react";
import ResumeTemplate1 from "../Resumetemplates/resumetemplate1";
import ResumeTemplate2 from "../Resumetemplates/resumetemplate2";
import ResumeTemplate3 from "../Resumetemplates/resumetemplate3";
import ResumeTemplate4 from "../Resumetemplates/resumetemplate4";
import template1Image from "../../Assets/template1.png";
import template2Image from "../../Assets/template2.png";
import template3Image from "../../Assets/template3.png";
import template4Image from "../../Assets/template4.png";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  choosetempmain: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    padding: "20px",
    justifyContent: "space-between",
    // gap: "34vw",
  },
  chooseback: {
    marginRight: "10px",
  },
  choosehead: {},
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
    gridTemplateColumns: "1fr 1fr", // This makes 2 columns
    gap: "10px",
    padding: "20px",
  },
  templateImage: {
    height: "90%",
    width: "90%",
    cursor: "pointer",
  },
});

const ChooseTemplate = () => {
  const classes = useStyles();
  const [previewData, setPreviewData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const navigate = useNavigate();

  // useEffect(() => {
    // const storedData = localStorage.getItem("previewData");
    // if (storedData) {
      // setPreviewData(JSON.parse(storedData));
    // }
  // }, []);

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
        return <p>No template selected</p>;
    }
  };

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
        <Typography variant="h3" color="initial" className={classes.choosehead}>
          Choose Template
        </Typography>
        <Button variant="contained">Download</Button>
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
            <img
              src={template1Image}
              alt="Template 1"
              className={classes.templateImage}
              onClick={() => setSelectedTemplate("template1")}
            />
            <img
              src={template2Image}
              alt="Template 2"
              className={classes.templateImage}
              onClick={() => setSelectedTemplate("template2")}
            />
            <img
              src={template3Image}
              alt="Template 3"
              className={classes.templateImage}
              onClick={() => setSelectedTemplate("template3")}
            />
            <img
              src={template4Image}
              alt="Template 4"
              className={classes.templateImage}
              onClick={() => setSelectedTemplate("template4")}
            />
          </Box>
        </Box>
        <Box className={classes.chooseright}>
          {previewData ? renderTemplate() : <p>No data available</p>}
        </Box>
      </Box>
    </Box>
  );
};

export default ChooseTemplate;
