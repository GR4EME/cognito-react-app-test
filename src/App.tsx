import React from "react";
import { Amplify, Auth } from "aws-amplify";
import logo from "./logo.svg";
import "./App.css";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import * as AWS from "aws-sdk";

Amplify.configure({
  Auth: {
    // Amazon Cognito Region
    region: "eu-west-2",

    // Amazon Cognito User Pool ID
    userPoolId: "...",

    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "...",

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "...",

    mandatorySignIn: true,

    // Configure storage to session storage
    storage: window.sessionStorage,

    oauth: {
      domain: "...",
      scope: [
        "phone",
        "email",
        "profile",
        "openid",
        "aws.cognito.signin.user.admin",
      ],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
});

AWS.config.region = "eu-west-2"; // Region

async function signIn() {
  console.log("sign in");

  await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Cognito,
  });
}

async function signOut() {
  console.log("sign out");

  await Auth.signOut();
}

async function getSession() {
  console.log("get session");

  const session = await Auth.currentSession();

  console.log(session);

  const idToken = session.getIdToken();
  const idTokenJwt = idToken.getJwtToken();

  console.log(idToken);
  console.log(idTokenJwt);

  const accessToken = session.getAccessToken();
  const accessTokenJwt = accessToken.getJwtToken();

  console.log(accessToken);
  console.log(accessTokenJwt);
}

async function getUser() {
  console.log("get user");

  const user = await Auth.currentAuthenticatedUser();

  // Globally unique ID for database - unique within cognito but would change if the same user is re-added.
  //
  console.log("sub:", user.attributes.sub);

  console.log("attributes:", user.attributes);
}

async function getCredentials() {
  console.log("get credentials");

  const credentials = await Auth.currentCredentials();

  console.log(credentials);
}

async function downloadFile() {
  console.log("download file");

  const credentials = await Auth.currentCredentials();

  AWS.config.credentials = new AWS.Credentials(credentials);

  const s3 = new AWS.S3();

  const objects = await s3
    .listObjects({ Bucket: "bundle-builder-test" })
    .promise();

  console.log(objects);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={signIn}>Sign In</button>
        <button onClick={signOut}>Sign Out</button>
        <button onClick={getSession}>Get Session</button>
        <button onClick={getUser}>Get User</button>
        <button onClick={getCredentials}>Get Credentials</button>
        <button onClick={downloadFile}>Download File</button>
      </header>
    </div>
  );
}

export default App;
