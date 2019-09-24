import React from "react";
import { Typography, Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  detail: {
    padding: "12px 10%"
  },
  explanation: {
    padding: "1rem 0"
  },
  body: {
    padding: "0.5em 0"
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
      <Button
        onClick={() => {
          location.href = "#details"
        }}
        style={{
          padding: "0",
          borderRadius: "20px",
        }}
      >
        <img src={`${location.origin}/buttons/simple.svg?name=Show%20Detail`} />
      </Button>
    </Box>
    <Box className={classes.detail} id="details">
      <Typography variant="h3">Details</Typography>

      <Box className={classes.explanation}>
        <Typography variant="h4">1. Create your GitHub Actions to build with human based trigger.</Typography>
        <Typography variant="body1" className={classes.body}>
          GitHub Actions is useful feature on GitHub.
          Actions is able to run with various GitHub events such as pushes or pull requests. 
          However there is no event with human based trigger such as click any button. 
          This service makes it possible to run with clicking a button. 
          For example, setup deploy feature in this button. 
          <a href="https://github.com/kouki-dan/action-button/blob/master/.github/workflows/deploy.yml">This</a> is an example to use this button.
        </Typography>
      </Box>

      <Box className={classes.explanation}>
        <Typography variant="h4">2. Create a Button in this service.</Typography>
        <Typography variant="body1" className={classes.body}>To create a button is too easy. Find your repository and input a title of button and event_type name.</Typography>
        <div style={{
          textAlign: "center"
        }}
        >
          <img
            width="80%"
            src="https://user-images.githubusercontent.com/1401711/65517425-a9f59380-df1d-11e9-8ef2-b94b7ecd4df6.png"
          />
        </div>
      </Box>

      <Box className={classes.explanation}>
        <Typography variant="h4">3. Put the Button to your README at your GitHub repository.</Typography>
        <Typography variant="body1" className={classes.body}>
          After creating a button, copy markdown text and paste to your GitHub page to run actions/
        </Typography>
      </Box>

      <Box className={classes.explanation}>
        <Typography variant="h4">4. Click the Button in README file and trigger GitHub Actions anywhere.</Typography>
        <Typography variant="body1" className={classes.body}>Click the button and run Actions.</Typography>
        <div style={{
          textAlign: "center"
        }}
        >
          <img
            width="80%"
            src="https://user-images.githubusercontent.com/1401711/65518509-5ab06280-df1f-11e9-9f29-c1d3c6055402.png"
          />
        </div>

      </Box>

      <Box style={{
        textAlign: "center"
      }}>
        <Link to="repos">
          <Button
            style={{
              padding: "0",
              borderRadius: "20px",
            }}
          >
            <img src={`${location.origin}/buttons/simple.svg?name=Try%20it%20now!`} />
          </Button>
        </Link>
      </Box>
    </Box>
  </>;
}

export default Home;
