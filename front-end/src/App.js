import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import logo from './aux/germs.svg';
import './App.css';
import Notification from './notification.js';
import Tweets from './Tweets.js';
import WebFont from 'webfontloader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

WebFont.load({
  google: {
    families: ['Open Sans:300,400', 'sans-serif']
  }
});

const Page = ({ title }) => (
    <div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>{title}</h2>
        </div>
        <p className="App-intro">
            This is the {title} page.
        </p>
        <p>
            <Link to="/">Home</Link>
        </p>
        <p>
            <Link to="/about">About</Link>
        </p>
        <p>
            <Link to="/settings">Settings</Link>
        </p>
        <Notification />
    </div>
);

const Home = (props) => (
    <Page title="Home"/>
);

const About = (props) => (
    <Page title="About"/>
);

const Settings = (props) => (
    <Page title="Settings"/>
);

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: 'loading',
            showTweets: false
        };
    }

    callAPI(){
        let API_KEY = 'AIzaSyDYXLym9KjBK9xmcoDfTVjpZ24RJwYpZmg'
        fetch('http://api.flutrack.org/?s=flu').then(function (response) {
            return response.json();
        }).then(result => {
            result.map(tweet => {
                fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + tweet.latitude + ',' + tweet.longitude + '&sensor=true&key=' + API_KEY).then(function (response) {
                    return response.json();
                }).then(result => {
                    tweet.location = result;
                    console.log(result);
                })
            })
            this.setState({tweets:result})
            // console.log(this.state.tweets);
        });
    }

    componentDidMount() {
        this.callAPI();
    }

    toggleTweet() {
      var state = this.state.showTweets;
      this.setState({showTweets:!state});
    }

    render() {
        return (
            <div>
              <MuiThemeProvider>
                <div className="App">
                  <div>
                      <img src={logo} className="App-logo" alt="logo" />
                      <h2>Outfluenza</h2>
                  </div>
                  <RaisedButton className="button" label="Tweets" primary={true} onClick={this.toggleTweet.bind(this)} />
                  {this.state.showTweets ? <Tweets tweets={this.state.tweets}/> : null}
                </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
