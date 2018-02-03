import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import logo from './logo.svg';
import './App.css';
import Notification from './notification.js';
import Tweets from './Tweets.js';

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
        };
    }

    callAPI(){
        fetch('http://api.flutrack.org/?s=flu').then(function (response) {
            return response.json();
        }).then(result => {
            // result.map(tweet => {
            //     fetch('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + tweet.latitude + ',' + tweet.longitude + '&sensor=true').then(function (response) {
            //         return response.json();
            //     }).then(result => {
            //         tweet.location = result;
            //         console.log(result);
            //     })
            // })
            this.setState({tweets:result})
            // console.log(this.state.tweets);
        });
    }

    componentDidMount() {
        this.callAPI();
    }


    render() {
        return (
            <div>
                <Router history={browserHistory}>
                    <Route path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Route path="/settings" component={Settings}/>
                </Router>
                <Tweets tweets={this.state.tweets}/>
            </div>
        );
    }
}

export default App;
