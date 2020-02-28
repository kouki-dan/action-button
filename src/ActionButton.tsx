import { withRouter, RouteComponentProps } from "react-router";
import React, { useEffect, useState } from "react";
import { getToken } from "./auth";
import {
  Typography,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Grid
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

export const canRunActionAutomatically = (
  referrer: string,
  org: string,
  name: string
) => {
  if (referrer.startsWith(`https://github.com/${org}/${name}`)) {
    // If the button on the repository page, it should run with no click buttons.
    if (
      referrer.startsWith(`https://github.com/${org}/${name}/issues`) ||
      referrer.startsWith(`https://github.com/${org}/${name}/pulls`)
    ) {
      // However, it is not allowed that the link is in Issues or Pull Requests
      // because the link may be wrote by non-authors.
      return false;
    }
    return true;
  }
  return false;
};

const dispatchGitHubActions = (
  org: string,
  name: string,
  eventType: string
) => {
  const url = `https://api.github.com/repos/${org}/${name}/dispatches`;
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: getToken(),
      Accept: "application/vnd.github.everest-preview+json"
    },
    body: JSON.stringify({
      event_type: eventType
    })
  });
};

const runRepositoryDispatch = (
  org: string,
  name: string,
  eventType: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  dispatchGitHubActions(org, name, eventType).then(res => {
    if (res.ok) {
      location.href = `https://github.com/${org}/${name}/actions`;
    } else {
      setError("Error occured. Confirm to access rights for GitHub Apps.");
    }
  });
};

type Deployment = {
  // show: https://developer.github.com/v3/repos/deployments/#parameters-1
  ref: string;
  task?: string;
  autoMerge: boolean;
  payload?: string;
  environment?: string;
  description?: string;
};

const runDeploy = (
  org: string,
  name: string,
  deployment: Deployment,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const url = `https://api.github.com/repos/${org}/${name}/deployments`;
  fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: getToken()
    },
    body: JSON.stringify({
      ref: deployment.ref,
      task: deployment.task,
      auto_merge: deployment.autoMerge,
      payload: deployment.payload,
      environment: deployment.environment,
      description: deployment.description
    })
  }).then(res => {
    if (res.ok) {
      // Should it redirect to deployment page?
      location.href = `https://github.com/${org}/${name}/actions`;
    } else {
      if (res.status == 403) {
        setError("Error occured. Confirm to access rights for GitHub Apps.");
      } else {
        res.json().then(error => {
          setError("Error occured. " + error["message"]);
        });
      }
    }
  });
};

const parseDeployment = (query: Map<string, string>): Deployment => {
  let autoMerge = true;
  if (query.get("auto_merge") == "false") {
    autoMerge = false;
  }

  return {
    ref: query.get("ref") || "master",
    task: query.get("task"),
    autoMerge: autoMerge,
    payload: query.get("payload"),
    environment: query.get("environment"),
    description: query.get("description")
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    }
  })
);

type DeploymentPropertiesProps = {
  deployment: Deployment;
  onChange: (deployment: Deployment) => void;
};

const DeploymentProperties: React.FC<DeploymentPropertiesProps> = ({
  deployment,
  onChange
}) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      style={{
        margin: "1rem 0"
      }}
    >
      <Typography variant="h5" style={{ textAlign: "left" }}>
        Deployment Settings
      </Typography>
      <TextField
        label="Branch or Tag or SHA"
        helperText="The ref to deploy. This can be a branch, tag, or SHA."
        value={deployment.ref}
        onChange={event => {
          onChange({
            ...deployment,
            ref: event.target.value
          });
        }}
        fullWidth
      />
      <TextField
        label="Task (optional)"
        helperText="Specifies a task to execute. Default: deploy"
        value={deployment.task}
        onChange={event => {
          onChange({
            ...deployment,
            task: event.target.value
          });
        }}
        fullWidth
      />
      <TextField
        label="Payload (optional)"
        helperText="JSON payload with extra information about the deployment."
        value={deployment.payload}
        onChange={event => {
          onChange({
            ...deployment,
            payload: event.target.value
          });
        }}
        fullWidth
        multiline
      />
      <TextField
        label="Environment (optional)"
        helperText="Name for the target deployment environment. Default: production"
        value={deployment.environment}
        onChange={event => {
          onChange({
            ...deployment,
            environment: event.target.value
          });
        }}
        fullWidth
      />
      <TextField
        label="Descritpion (optional)"
        helperText="Short description of the deployment."
        value={deployment.description}
        onChange={event => {
          onChange({
            ...deployment,
            description: event.target.value
          });
        }}
        fullWidth
      />
      <FormControlLabel
        control={<Checkbox />}
        checked={deployment.autoMerge}
        onChange={(_, checked) => {
          onChange({
            ...deployment,
            autoMerge: checked
          });
        }}
        label={
          <>
            <Grid container direction="row" alignItems="center">
              <Grid item>Auto Merge</Grid>
              <Grid item>
                <Tooltip title="Attempts to automatically merge the default branch into the requested ref, if it's behind the default branch.">
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              </Grid>
            </Grid>
          </>
        }
      ></FormControlLabel>
    </Box>
  );
};

const ActionButton = (
  props: RouteComponentProps<{ org: string; name: string }>
) => {
  const org = props.match.params.org;
  const name = props.match.params.name;
  const [actionName, setActionName] = useState("");
  const [actionEventType, setActionEventType] = useState("");
  const [actionButtonType, setActionButtonType] = useState("");
  const [deploymentParameter, setDeploymentParameter] = useState<Deployment>({
    ref: "master",
    autoMerge: true
  });
  const [actionButtonAction, setActionButtonAction] = useState<
    "dispatch" | "deployment"
  >("dispatch");
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new Map<string, string>();
    props.location.search
      .slice(1)
      .split("&")
      .forEach(elm => {
        const [key, value] = elm.split("=");
        return query.set(key, value);
      });
    setActionName(query.get("name") || "");
    setActionEventType(query.get("eventType") || "");
    setActionButtonType(query.get("type") || "simple");
    const action = query.get("action");
    if (action == "deployment") {
      setActionButtonAction(action);
      setDeploymentParameter(parseDeployment(query));
    }

    const authorizationRequired = getToken().length == 0;
    if (authorizationRequired) {
      // TODO: Authentication in this page(need to fix useAuthorization in auth.tsx)
      props.history.push("/repos");
      return;
    }
  }, []);

  useEffect(() => {
    // Currently, deployment is not run automatically because user may want to change a parameter.
    if (
      actionButtonAction == "dispatch" &&
      canRunActionAutomatically(document.referrer, org, name)
    ) {
      runRepositoryDispatch(org, name, actionEventType, setError);
    }
  }, [actionButtonAction]);

  return (
    <Box
      style={{
        maxWidth: "720px",
        width: "90%",
        margin: "0 auto",
        textAlign: "center"
      }}
    >
      <Typography variant="h4">
        Action Button for{" "}
        <a href={`https://github.com/${org}/${name}`}>{`${org}/${name}`}</a>
      </Typography>
      {error && (
        <>
          <Typography variant="body1" style={{ color: "red" }}>
            {error}
          </Typography>
          <Typography variant="body1">
            Check{" "}
            <a href="https://github.com/apps/action-button">
              Action Button on GitHub Apps
            </a>{" "}
            is really installed or you have a write access rights.
          </Typography>
        </>
      )}
      {!error && actionButtonAction == "deployment" && (
        <DeploymentProperties
          deployment={deploymentParameter}
          onChange={deployment => {
            setDeploymentParameter(deployment);
          }}
        />
      )}
      <Button
        onClick={() => {
          switch (actionButtonAction) {
            case "deployment":
              runDeploy(org, name, deploymentParameter, setError);
              break;
            case "dispatch":
              runRepositoryDispatch(org, name, actionEventType, setError);
              break;
          }
        }}
        disabled={error.length > 0}
        style={{
          margin: "1rem 0"
        }}
      >
        <img
          src={`${location.origin}/buttons/${actionButtonType}.svg?name=${actionName}`}
        />
      </Button>
    </Box>
  );
};

export default withRouter(ActionButton);
