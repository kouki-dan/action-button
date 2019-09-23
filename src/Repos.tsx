import React, { useEffect, useState } from "react"
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GetRepositories } from "./graphqlTypes";
import { useAuthorization, Unauthorized } from "./auth";
import { List, ListItem, ListItemText, makeStyles, ListSubheader, Link, Typography, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Button, DialogTitle } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";

const OWN_REPOSITORIES = gql`
query GetRepositories {
  viewer {
    name
    login
    repositories(first: 100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
      nodes {
        name
        nameWithOwner
      }
    }
    organizations(first: 100) {
      nodes {
        name
        login
        repositories(first: 100) {
          nodes {
            name
            nameWithOwner
          }
        }
      }
    }
  }
}
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  header: {
    display: "flex",
    paddingBottom: theme.spacing(1),
    borderBottom: "1px solid #ddd",
  },
  headerLink: {
    alignSelf: "flex-end",
    marginLeft: "1em",
  }
}));

const Repos: React.SFC<RouteComponentProps> = ({
  history
}) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<GetRepositories>(OWN_REPOSITORIES);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ repoName, setRepoName ] = useState("");

  const authorized = useAuthorization(error)
  if (!authorized) {
    return <Unauthorized/>
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const clickRepository = (nameWithOwner: string) => {
    history.push("/repos/"+nameWithOwner);
  }
  const handleDialogOpen = () => {
    setDialogOpen(true);
  }
  const handleDialogClose = () => {
    setDialogOpen(false);
  }
  const handleDialogInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepoName(event.target.value);
  }

  const isCorrectRepoName = (repoName: string) => {
    const splitted = repoName.split("/")
    return splitted.length == 2 && splitted[0].length > 0 && splitted[1].length > 0
  }

  return <>
    <List
      className={classes.root}
      subheader={
        <ListSubheader className={classes.header}>
          <Typography variant="h4">
            Your Repositories 
          </Typography>
          <Link component="button" onClick={handleDialogOpen} className={classes.headerLink}>
            Repository Not Found?
          </Link>
        </ListSubheader>
      }
    >
      {data && [data.viewer, ...(data.viewer.organizations.nodes || [])].map((organization) => {
        if (organization == null) {
          return null;
        }
        return <>
          <ListItem key={organization.login}>
            <ListItemText primary={organization.login}>
            </ListItemText>
          </ListItem>
          {organization.repositories.nodes && organization.repositories.nodes.map((repository) => {
            if (repository == null) {
              return null;
            }
            return <List key={repository.nameWithOwner}>
              <ListItem button className={classes.nested} onClick={() => { clickRepository(repository.nameWithOwner) }}>
                <ListItemText primary={repository.nameWithOwner}></ListItemText>
              </ListItem>
            </List>
          })}
        </>
      })
      }
    </List>
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Repository Not Found?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A part of repositories is shown on this page if you have a lot of repositories for now.
          You can move to repository directly input org and repo name below text field.<br/>
          If your name is <b>actions</b> and your repository name is <b>myRepo</b>, type <b>actions/myRepo</b> below.
        </DialogContentText>
        <TextField
          autoFocus
          label="org/repo"
          onChange={handleDialogInput}
          fullWidth
        />
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button disabled={!isCorrectRepoName(repoName)} onClick={() => clickRepository(repoName)}>Move to Reposiotry</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  </>
}

export default withRouter(Repos);
