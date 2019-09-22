import React, { useEffect } from "react"
import firebase from "firebase";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GetRepositories } from "./graphqlTypes";
import { Button } from "@material-ui/core";
import { useAuthorization, Unauthorized } from "./auth";

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

const Repos = () => {
  const { loading, error, data } = useQuery<GetRepositories>(OWN_REPOSITORIES);

  const authorized = useAuthorization(error)
  if (!authorized) {
    return <Unauthorized/>
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // TODO: Show data to user.
  console.log(data);

  return <div>Repos</div>
}

export default Repos;
