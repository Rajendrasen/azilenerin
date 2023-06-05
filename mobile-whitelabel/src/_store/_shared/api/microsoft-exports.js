import * as Msal from 'msal';

export const msConfig = {
  clientID: 'b77cd394-2b71-4de1-80ff-098f86d9d2d3',
  graphScopes: ['contacts.read'],
  redirectUri: 'http://localhost:3000/mycontacts',
  graphUrl: 'https://graph.microsoft.com/v1.0/',
};

export class AuthService {
  constructor() {
    let redirectUri = msConfig.redirectUri;
    this.applicationConfig = {
      clientID: msConfig.clientID,
      graphScopes: msConfig.graphScopes,
    };
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      '',
      () => {
        // callback for login redirect
      },
      {
        redirectUri,
      }
    );
  }
  login = () => {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      () => {
        const user = this.app.getUser();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  };
  logout = () => {
    this.app.logout();
  };
  getToken = () => {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      () => {
        return this.app.acquireTokenPopup(this.applicationConfig.graphScopes).then(
          accessToken => {
            return accessToken;
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  };
}

export class GraphService {
  constructor() {
    this.graphUrl = msConfig.graphUrl;
  }

  getUserInfo = token => {
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    const options = {
      headers,
    };
    return fetch(`${this.graphUrl}/me/contacts`, options)
      .then(response => response.json())
      .catch(response => {
        throw new Error(response.text());
      });
  };
}
