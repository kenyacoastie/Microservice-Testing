import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import MenuBar from './Components/MenuBar/MenuBar';
import Home from './Containers/Home/Home';
import Events from './Containers/Events/Events';
// import Footer from './Components/Footer/Footer';
import Login from './Containers/Login/Login';
import UserEvents from './Components/UserEvents/UserEvents';
import Aux from './hoc/Aux/Aux';

class App extends Component {
  state = {
    loggedIn: false,
    personId: 0,
  }

  checkAuth = async (email) => {
    const url = '/events/users';
    const result = await axios.get(url);
    const auth = result.data.filter(user => user.email === email);
    if (auth.length > 0) {
      this.setState({ loggedIn: true, personId: auth[0].id });
      return true;
    }

    return false;
  };

  signUp = async (user) => {
    const url = '/events/users';
    const result = await axios.post(url, user);
    console.log(result);
    if (result.status === 200) {
      this.setState({ loggedIn: true, personId: result.data.id });
      return true;
    }
    return false;
  }

  logIn = () => {
    this.setState({ loggedIn: false, personId: 0 });
  }

  render() {
    const SignUp = (
      <Login
        signUp={user => this.signUp(user)}
        loggedIn={this.state.loggedIn}
        checkAuth={email => this.checkAuth(email)}
        pId={this.state.personId}
      />
    );

    const EventPage = (
      <Events
        loggedIn={this.state.loggedIn}
        personId={this.state.personId}
      />
    );

    const UserPage = (
      <UserEvents
        loggedIn={this.state.loggedIn}
        personId={this.state.personId}
      />
    );

    let routes = (
      <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/events" exact component={() => EventPage} />
        <Route path="/login" exact component={() => SignUp} />
        <Redirect to="/home" />
      </Switch>
    );

    if (this.state.loggedIn) {
      routes = (
        <Switch>
          <Route path="/home" exact component={Home} />
          <Route path="/events" exact component={() => EventPage} />
          <Route path="/login" exact component={() => SignUp} />
          <Route path="/userEvents" exact component={() => UserPage} />
          <Redirect to="/home" />
        </Switch>
      );
    }
    return (
      <Aux>
        <MenuBar loggedIn={this.state.loggedIn} logOut={this.logIn} />
        {routes}
        {/* <Footer /> */}
      </Aux>
    );
  }
}

export default App;
