import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  resumemain: {
    margin: "30px",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold !important",
    marginBottom: "30px !important",
  },
  resumebox: {
    display: "flex",
    gap:"20px"
  },
  resumecontent: {
    // height: "100vh",
    width: "50%",
    backgroundColor: "rgb(233, 233, 233)",
    borderRadius: "20px",
    display:"flex",
    justifyContent:"center",
    // alignItems:"center"
  },
  section1head:{
    textAlign:"center"
  },









  resumepreview: {
    height: "100vh",
    width: "50%",
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: "20px",
  },
}));
