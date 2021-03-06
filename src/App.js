import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import _ from "lodash";

import { auth } from "./api/firebase";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";

import withAuthentication from "./hoc/withAuthentication";

const ProtectedDashboardView = withAuthentication("/")(Dashboard);
const ProtectedGeneratorView = withAuthentication("/")(Generator);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: auth.currentUser,
      isSignedIn: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged((user) =>
      this.setState({
        isLoading: false,
        isSignedIn: !!user,
        user,
      })
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const { user, isSignedIn, isLoading } = this.state;
    console.table(_.get(user, "email"), isSignedIn, isLoading);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    const appProps = {
      user,
    };

    return !isSignedIn ? (
      <Home />
    ) : (
      <BrowserRouter>
        <Switch>
          <Route
            path="/auth"
            exact
            render={(props) => (
              <Home
                setLoading={() => this.setState({ isLoading: !isLoading })}
                {...props}
                {...appProps}
              />
            )}
          />
          <Route
            path="/"
            exact
            render={(props) => (
              <ProtectedDashboardView {...props} {...appProps} />
            )}
          />
          <Route
            path="/generate"
            exact
            render={(props) => (
              <ProtectedGeneratorView {...props} {...appProps} />
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
