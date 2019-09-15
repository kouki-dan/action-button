import React from "react";
import { Typography, Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles({
  detail: {
    padding: "12px 10%"
  },
  explanation: {
    padding: "1rem 0"
  }
})

const Home = () => {
  const classes = useStyles();
  return <>
    <Box style={{
      padding: "90px 0",
      backgroundColor: "#fcfcfc",
      textAlign: "center"
    }}>
      <Typography variant="h2" align="center" paragraph={true} style={{
          fontWeight: "bold",
          lineHeight: "1.6em"
      }} >This is a Button for<br/>GitHub Actions</Typography>
      {/* TODO: Use a style of button created at this service */}
      <Button>Show Detail</Button>
    </Box>
    <Box className={classes.detail}>
      <Typography variant="h3">Details</Typography>

      <Box className={classes.explanation}>
        <Typography variant="h4">1. Create your GitHub Actions to build with human based trigger.</Typography>
        <Typography variant="body1">aaaa a aaa aaa a aaa</Typography>
      </Box>

      <Box className={classes.explanation}>
        <Typography variant="h4">2. Create a Button in this service.</Typography>
        <Typography variant="body1">aaaa a aaa aaa a aaa</Typography>
      </Box>

      <Box className={classes.explanation}>
        <Typography variant="h4">3. Put the Button to your README at your GitHub repository.</Typography>
        <Typography variant="body1">aaaa a aaa aaa a aaa</Typography>
      </Box>

      <Box className={classes.explanation}>
        <Typography variant="h4">4. Click the Button in README file and trigger GitHub Actions anywhere.</Typography>
        <Typography variant="body1">aaaa a aaa aaa a aaa</Typography>
      </Box>

      <Box style={{
        textAlign: "center"
      }}>
        <Button>Try it now!</Button>
      </Box>
    </Box>
  </>;
}

export default Home;
