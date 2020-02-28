import { withRouter, RouteComponentProps } from "react-router"
import React, { useState } from "react"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks";
import { RepositoryInfo } from "./graphqlTypes";
import { useAuthorization } from "./auth";
import { Typography, Box, TextField, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";

const REPOSITORY_INFO = gql`
query RepositoryInfo($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    nameWithOwner
    description
    url
  }
}
`;

const actionBUttonTypeDefault = "deployment";
const Repo = (props: RouteComponentProps<{org: string, name: string}>) => {
  const { loading, error, data } = useQuery<RepositoryInfo>(REPOSITORY_INFO, {
    variables: {
      owner: props.match.params.org,
      name: props.match.params.name,
    }
  });
  const unauthorized = useAuthorization(error);
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [actionButtonType, setActionButtonType] = useState<"deployment" | "dispatch">(actionBUttonTypeDefault);

  if (!unauthorized || data && data.repository == null) {
    return <>
      <Typography variant="h4">No Repository Found.</Typography>
      <Typography variant="body1">
        No repository found in this access rights. Confirm them
        <ol>
          <li>This repository is installed to <a href="https://github.com/apps/action-button">GitHub Apps</a></li>
          <li>This repository really exists</li>
        </ol>
      </Typography>
    </>
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }
  const handleEventTypeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventType(event.target.value);
  }

  const createButtonText = () => {
    const encodedName = encodeURIComponent(name);
    const encodedEventType = encodeURIComponent(eventType)
    const origin = location.origin
    const action = actionButtonType
    const queryString = `name=${encodedName}&eventType=${encodedEventType}&type=simple&action=${action}`
    return `[![Run Action](${origin}/buttons/simple.svg?${queryString})](${origin}/repos/${props.match.params.org}/${props.match.params.name}/button?${queryString})`
  }

  return <Box style={{padding: "20px"}}>
    { data && data.repository && <>
      <Box style={{maxWidth: "648px", width: "90%", margin: "0 auto"}}>
        <Typography variant="h5">Create an Action Button for <a href={data.repository.url}>{data.repository.nameWithOwner}</a></Typography>
        <TextField 
          label="Name" 
          helperText="The name of action. This is used on the button." 
          onChange={handleNameInput}
          fullWidth
          />
        <Box style={{marginTop: "1rem"}}>
          <FormLabel>Action Trigger Type</FormLabel>
          <RadioGroup
            defaultValue={actionBUttonTypeDefault}
            style={{textAlign: "center"}}
            onChange={(_, value) => {
              if (value == "deployment" || value == "dispatch") {
                setActionButtonType(value);
              }
            }}
            row>
            <FormControlLabel
              value="deployment"
              control={<Radio color="primary" />}
              label="Deployment"
              labelPlacement="start"
            />
            <FormControlLabel
              value="dispatch"
              control={<Radio color="primary" />}
              label="Repository Dispatch"
              labelPlacement="start"
            />
          </RadioGroup>
        </Box>
        {actionButtonType == "dispatch" && (
          <TextField
            label="Event Type"
            helperText="Webhook's event_type value. This is used to call GitHub webhooks."
            onChange={handleEventTypeInput}
            fullWidth
          />
        )}
        {actionButtonType == "deployment" /* TODO: Add deployment default parameters*/}
        <Box style={{marginTop: "40px", textAlign: "center"}}>
          <Typography variant="body1">
            Preview
          </Typography>

          <svg width="250" height="80" xmlns="http://www.w3.org/2000/svg">
            <rect y="1" x="1" rx="20" height="78" width="248" stroke-width="1" stroke="#000" fill="#9ACEE6" />
            <text stroke="#666" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" y="22" x="125">Run Actions</text>
            <text stroke="#000" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" y="52" x="125">{name || "Deploy Prod"}</text>
          </svg>
        </Box>

        <Box style={{marginTop: "40px"}}>
          <Typography variant="body1">
            Copy this and Paste your README.md of GitHub's repository.
          </Typography>
          <TextField 
            multiline 
            InputProps={{
              readOnly: true
            }}
            fullWidth
            disabled={name.length==0 || eventType.length==0}
            variant="outlined"
            value={createButtonText()}
            onFocus={ (event) => {
              event.target.select();
            }}
            />
        </Box>
      </Box>
    </>}
  </Box>
}

export default withRouter(Repo);
