import { withRouter, RouteComponentProps } from "react-router"
import React, { useEffect, useState } from "react"
import { getToken } from "./auth";
import { Typography, Button } from "@material-ui/core";

const canRunActionAutomatically = (referrer: string, org: string, name: string) => {
  if (referrer.startsWith(`https://github.com/${org}/${name}`)) {
    // If the button on the repository page, it should run with no click buttons.
    return true;
  }
  return false;
}

const dispatchGitHubActions = (org: string, name: string, eventType: string) => {
  const url = `https://api.github.com/repos/${org}/${name}/dispatches`;
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Authorization": getToken(),
      "Accept": "application/vnd.github.everest-preview+json",
    },
    body: JSON.stringify({
      "event_type": eventType,
    }),
  });
}

const ActionButton = (props: RouteComponentProps<{org: string, name: string}>) => {
  const org = props.match.params.org;
  const name = props.match.params.name;
  const [actionName, setActionName] = useState("");
  const [actionEventType, setActionEventType] = useState("");
  const [actionButtonType, setActionButtonType] = useState("");
  const [error, setError] = useState("");

  const runAction = () => {
    dispatchGitHubActions(org, name, actionEventType).then((res) => {
      if (res.ok) {
        location.href = `https://github.com/${org}/${name}/actions`;
      } else {
        setError("Error occured. Confirm to access rights for GitHub Apps.");
      }
    })
  }

  useEffect(() => {
    const query = new Map<string, string>()
    props.location.search.slice(1).split("&").forEach((elm) => {
      const [key, value] = elm.split("=");
      return query.set(key, value)
    })
    setActionName(query.get("name") || "");
    setActionEventType(query.get("eventType") || "");
    setActionButtonType(query.get("type") || "simple");

    const authorizationRequired = getToken().length == 0
    if (authorizationRequired) {
      // TODO: Authentication in this page(need to fix useAuthorization in auth.tsx)
      props.history.push("/repos")
    }

    if (canRunActionAutomatically(document.referrer, org, name)) {
      runAction();
    }
  }, [])

  return <>
    <Typography variant="h4">Action Button for <a href={`https://github.com/${org}/${name}`}>{`${org}/${name}`}</a></Typography>
    { error && <>
      <Typography variant="body1" style={{ color: "red" }}>{error}</Typography>
      <Typography variant="body1">
        Check <a href="https://github.com/settings/installations">Action Button on GitHub Apps</a> is really installed or you have a write access rights.
      </Typography>
    </>}
    <Button
      onClick={runAction}
      disabled={error.length > 0}
    >
      <img src={`${location.origin}/buttons/${actionButtonType}.svg?name=${actionName}`}/>
    </Button>
  </>
}

export default withRouter(ActionButton)
