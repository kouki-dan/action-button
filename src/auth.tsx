import { useEffect, useState } from "react";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import React from "react";
import { ApolloError } from "apollo-boost";

export const getToken = () => {
  const token = localStorage.getItem('github-token');
  return token ? `token ${token}` : '';
};

export const useAuthorization = (error: ApolloError | undefined) => {
  const statusCode: number = error && error.networkError && (error.networkError as any)["statusCode"];
  const authorized = statusCode !== 401
  useEffect(() => {
    firebase.auth().getRedirectResult().then(function (result) {
      if (result.credential) {
        const token = (result.credential as firebase.auth.OAuthCredential).accessToken;
        if (token) {
          localStorage.setItem("github-token", token);
          // TODO: Don't use page reload, just reload GraphQL query.
          location.reload();
        }
      }
    }).catch(function (error) {
      // TODO: Error handling
    });
  }, [])

  return authorized;
}

export const Unauthorized = () => {
  const auth = firebase.app().auth()
  const login = () => {
    const provider = new firebase.auth.GithubAuthProvider()
    auth.signInWithRedirect(provider)
  }
  return <>
    <p>Unauthorized :(</p>
    <Button onClick={login}>Click to Login with GitHub</Button>
  </>
}
