import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import logo from './aux/germs.svg';
import pain from './aux/pain.svg';
import prescription from './aux/prescription.svg';
import like from './aux/like.svg';
import './App.css';
import Notification from './notification.js';
import Tweets from './Tweets.js';
import WebFont from 'webfontloader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { PieChart, Pie, Sector } from 'recharts';
import {Doughnut} from 'react-chartjs-2';
import SnowStorm from 'react-snowstorm';


WebFont.load({
    google: {
        families: ['Open Sans:300,400', 'sans-serif']
    }
});


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: 'loading',
            showTweets: false,
            coordinates: {
                "latitude": 0,
                "longitude": 0
            },
            toggleLoad:false,
        };
    }

    callAPI(){
        let API_KEY = 'AIzaSyDYXLym9KjBK9xmcoDfTVjpZ24RJwYpZmg'
        fetch('http://api.flutrack.org/?s=flu').then(function (response) {
            return response.json();
        }).then(result => {
            result.map(tweet => {
                fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + tweet.latitude + ',' + tweet.longitude + '&sensor=true&key=' + API_KEY)
                .then(function (response) {
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

    getGeoLoc() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position) => {
                let json = {
                    "latitude": position.coords.latitude,
                    "longitude": position.coords.longitude
                };
                this.setState({coordinates:json})
                this.getTweets();
                this.getDoctors();
            });
        }
    }

    getTweets() {
        fetch('https://86c8f266.ngrok.io/rest/mangohacks/tweets/', {
            method: 'POST',
            body: JSON.stringify(this.state.coordinates),
            headers: {'Content-Type': 'application/json'}
        }).then( data => {
            return data.json();
        }).then(data => {
            this.setState({tweets:data});
        });

    }


    getDoctors() {
        console.log(this.state.coordinates);
        console.log(this.state.flag);
        fetch('https://86c8f266.ngrok.io/rest/mangohacks/doctors/', {
            method: 'POST',
            body: JSON.stringify(this.state.coordinates),
            headers: {'Content-Type': 'application/json'}

        }).then( data => { return data.json(); }).then(data => {
            console.log(data);
            this.setState({toggleLoad:false});
        });

    }

    componentWillMount() {
        this.setState({toggleLoad:true});
    }

    componentDidMount() {
        this.getGeoLoc()
    }

    toggleTweet() {
        var state = this.state.showTweets;
        this.setState({showTweets:!state});

    }

    callFluLocation = (e) => {
        var zip = e.target.value;
        if(zip.length > 4) {
            console.log("A real zip code");
        }
    }

    render() {

        var donut_data = {
            datasets: [{
                data: [80, 20],
                backgroundColor: [
                    '#0d171b',
                    '#3abdcf'
                ]
            }],
            labels: [
                'Not Infected',
                'Infected'
            ]
        };

        var donut_options = {
            circumference: Math.PI,
            rotation: Math.PI,
        }

        return (
            <div className="App">
                <MuiThemeProvider>
                    {this.state.toggleLoad ?
                      <div> <br /> <br /> <br /> <br /> <br/>
                      <h2>Gathering your data.</h2>
                      <SnowStorm snowColor='black' useMeltEffect={true} vMaxX={10} useTwinkleEffect={true} excludeMobile={false}/>
                      <CircularProgress
                      style={'width: 100%'} mode="indeterminate" size={150} thickness={7}/> </div>:
                      <div className="App">
                        <div>
                            <img src={logo} className="App-logo" alt="logo" />
                            <h2>Outfluenza</h2>
                        </div>
                        <hr/>
                        <h2> Your community is % </h2>
                        <div className='division'>
                            <div className='personal'>
                                <img src={pain} className="pain" alt="pain" />
                                <h2>You are % likely to contract the flu</h2>
                                <h4>Some more data</h4>
                            </div>
                        </div>
                        <div className='division'>
                            <div className='community'>
                                <img src={prescription} className="prescription" alt="prescription" />
                                <h2>Your community is % infected</h2>
                                <h4>Some more data</h4>
                            </div>
                        </div>
                        <Doughnut data={donut_data} options={donut_options}/>
                        <div className='tweets'>
                            <RaisedButton className="button" label="Tweets" primary={true} onClick={this.toggleTweet.bind(this)} />
                            {this.state.showTweets ? <Tweets tweets={this.state.tweets}/> : null}
                        </div>
                        <div className='division'>
                            <div className='footer'>
                                <h4>Made with <img src={like} className="like" alt="like" /></h4>
                            </div>
                        </div>
                    </div>}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
