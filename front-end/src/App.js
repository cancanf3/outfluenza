import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import logo from './aux/germs.svg';
import pain from './aux/pain.svg';
import prescription from './aux/prescription.svg';
import like from './aux/like.svg';
import './App.css';
import Notification from './notification.js';
import Footer from './Footer.js';
import Tweets from './Tweets.js';
import Doctors from './Doctors.js'
import WebFont from 'webfontloader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { PieChart, Pie, RadialBarChart, RadialBar, Sector, Legend, Cell } from 'recharts';
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
            cdc: 'cdc',
            toggleLoad:false,
            doctors:'loading',
            zip:'zipcode',
            text: 'zipcode'
        };
    }

    handleChange = ( e ) => {
      this.state.zip = e.target.value
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
                this.getCDC();
            });
        }
    }

    getGeoFromZip(zipcode) {
      fetch('https://86c8f266.ngrok.io/rest/mangohacks/zipcode/', {
          method: 'POST',
          body: JSON.stringify({"zipcode":zipcode}),
          headers: {'Content-Type': 'application/json'}
      }).then( data => {
          return data.json();
      }).then(data => {
        let json = {
            "latitude": data.lat,
            "longitude": data.lng
        };
        this.setState({coordinates:json})
        this.getTweets();
        this.getDoctors();
        this.getCDC();
      });
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
        fetch('https://86c8f266.ngrok.io/rest/mangohacks/doctors/', {
            method: 'POST',
            body: JSON.stringify(this.state.coordinates),
            headers: {'Content-Type': 'application/json'}

        }).then( data => { return data.json(); }).then(data => {
            this.setState({doctors:data});
        });

    }

    getCDC() {
        fetch('https://86c8f266.ngrok.io/rest/mangohacks/cdc/', {
            method: 'POST',
            body: JSON.stringify(this.state.coordinates),
            headers: {'Content-Type': 'application/json'}

        }).then( data => { return data.json(); }).then(data => {
            this.setState({cdc:data});
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

    submitZip = (e) => {
        var newZip = document.getElementById('zipcode').value;
        // Haz tu call aqui
        this.getGeoFromZip(newZip);
    }

    enableButton = (e) => {
        if(e.target.value.length > 4) {
            this.setState({enableButton:true});
        }
        else {
            this.setState({enableButton:false});
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
                'Infection Level',
                'Not Infected'
            ]
        };

        var cool_data = [
            {name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8'},
            {name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed'},
            {name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1'},
            {name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d'},
            {name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c'},
            {name: '50+', uv: 2.63, pv: 4800, fill: '#d0ed57'},
            {name: 'unknow', uv: 6.67, pv: 4800, fill: '#ffc658'}
        ];

        const style = {
            top: 0,
            left: 350,
            lineHeight: '24px'
        };

        var dunut_data = [{name: 'Infection Level', value: parseInt(this.state.cdc.activity_level)*10},
        {name: 'Not Infected', value: 100-parseInt(this.state.cdc.activity_level)*10}]

        var donut_options = {
            circumference: Math.PI,
            rotation: Math.PI,
        }

        const RADIAN = Math.PI / 180;
        const COLORS = ['#0088FE', '#00C49F'];

        return (
            <div className="App">
                <MuiThemeProvider>
                    <SnowStorm
                        className="snow"
                        snowColor='black' useMeltEffect={true} vMaxX={10}
                        useTwinkleEffect={true} excludeMobile={false}
                    />
                    {this.state.toggleLoad ?
                        <div> <br /> <br /> <br /> <br /> <br/>
                        <h2>Gathering your data...</h2>
                        <CircularProgress
                            style={'width: 100%'} mode="indeterminate" size={150} thickness={7}/> </div> :
                            <div className="App">
                                <div className='main'>
                                    <div className='logo'>
                                        <img src={logo} className="App-logo" alt="logo" />
                                        <h1>Outfluenza.</h1>
                                        <h3>Keeping the flu away from our communities.</h3>
                                        <TextField
                                            hintText={this.state.cdc.postal}
                                            onChange={ this.handleChange }
                                            className="zipcode"
                                            id='zipcode'
                                            hintStyle={{ width: '100%', textAlign: 'center' }}
                                            inputStyle={{ width: '100%', textAlign: 'center' }}
                                            onChange={this.enableButton}
                                        />
                                        <FlatButton
                                            label="Change"
                                            style={{width:'4%', marginLeft:'1%'}}
                                            onClick={this.submitZip}
                                            disabled={!this.state.enableButton}
                                        />
                                    </div>
                                </div>
                                <div className='division'>
                                    <div className='personal'>
                                        <img src={pain} className="pain" alt="pain" />
                                        <h2>You are % likely to contract the flu</h2>
                                        <h4>Some more data</h4>
                                    </div>
                                </div>
                                <div className='division'>
                                    <h1>Treat the flu: Doctors close to you</h1>
                                    <Doctors doctors={this.state.doctors}/>
                                </div>
                                <div className='division infected statesInfo'>
                                    <div className='gauge'>
                                        <PieChart width={340} height={320}>
                                            <Pie
                                                data={dunut_data}
                                                cx={175}
                                                cy={200}
                                                startAngle={360}
                                                endAngle={0}
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#D75A4A"
                                                paddingAngle={0}
                                                >
                                                </Pie>
                                            </PieChart>
                                        </div>
                                        <div>
                                            <h2> Infection Level {parseInt(this.state.cdc.activity_level)}/10 </h2>
                                            <h2>{this.state.cdc.statename} has a {this.state.cdc.activity_level_label} level of infection</h2>

                                            <a href={this.state.cdc.url} target="_blank" style={{color : 'white'}} class="official_source">
                                                <img style={{color : 'white'}} src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQ1Ny4wMyA0NTcuMDMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1Ny4wMyA0NTcuMDM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNNDIxLjUxMiwyMDcuMDc0bC04NS43OTUsODUuNzY3Yy00Ny4zNTIsNDcuMzgtMTI0LjE2OSw0Ny4zOC0xNzEuNTI5LDBjLTcuNDYtNy40MzktMTMuMjk2LTE1LjgyMS0xOC40MjEtMjQuNDY1ICAgbDM5Ljg2NC0zOS44NjFjMS44OTUtMS45MTEsNC4yMzUtMy4wMDYsNi40NzEtNC4yOTZjMi43NTYsOS40MTYsNy41NjcsMTguMzMsMTQuOTcyLDI1LjczNmMyMy42NDgsMjMuNjY3LDYyLjEyOCwyMy42MzQsODUuNzYyLDAgICBsODUuNzY4LTg1Ljc2NWMyMy42NjYtMjMuNjY0LDIzLjY2Ni02Mi4xMzUsMC04NS43ODFjLTIzLjYzNS0yMy42NDYtNjIuMTA1LTIzLjY0Ni04NS43NjgsMGwtMzAuNDk5LDMwLjUzMiAgIGMtMjQuNzUtOS42MzctNTEuNDE1LTEyLjIyOC03Ny4zNzMtOC40MjRsNjQuOTkxLTY0Ljk4OWM0Ny4zOC00Ny4zNzEsMTI0LjE3Ny00Ny4zNzEsMTcxLjU1NywwICAgQzQ2OC44NjksODIuODk3LDQ2OC44NjksMTU5LjcwNiw0MjEuNTEyLDIwNy4wNzR6IE0xOTQuNzA4LDM0OC4xMDRsLTMwLjUyMSwzMC41MzJjLTIzLjY0NiwyMy42MzQtNjIuMTI4LDIzLjYzNC04NS43NzgsMCAgIGMtMjMuNjQ4LTIzLjY2Ny0yMy42NDgtNjIuMTM4LDAtODUuNzk1bDg1Ljc3OC04NS43NjdjMjMuNjY1LTIzLjY2Miw2Mi4xMjEtMjMuNjYyLDg1Ljc2NywwICAgYzcuMzg4LDcuMzksMTIuMjA0LDE2LjMwMiwxNC45ODYsMjUuNzA2YzIuMjQ5LTEuMzA3LDQuNTYtMi4zNjksNi40NTQtNC4yNjZsMzkuODYxLTM5Ljg0NSAgIGMtNS4wOTItOC42NzgtMTAuOTU4LTE3LjAzLTE4LjQyMS0yNC40NzdjLTQ3LjM0OC00Ny4zNzEtMTI0LjE3Mi00Ny4zNzEtMTcxLjU0MywwTDM1LjUyNiwyNDkuOTYgICBjLTQ3LjM2Niw0Ny4zODUtNDcuMzY2LDEyNC4xNzIsMCwxNzEuNTUzYzQ3LjM3MSw0Ny4zNTYsMTI0LjE3Nyw0Ny4zNTYsMTcxLjU0NywwbDY1LjAwOC02NS4wMDMgICBDMjQ2LjEwOSwzNjAuMzM2LDIxOS40MzcsMzU3LjcyMywxOTQuNzA4LDM0OC4xMDR6IiBmaWxsPSIjMDAwMDAwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                                                Official Source</a>

                                            </div>
                                        </div>

                                        <div className='tweets'>
                                            <Tweets stage={this.state.tweets} tweets={this.state.tweets.nearbyTweets}/>
                                        </div>
                                        <Footer like={like}/>
                                    </div>}
                                </MuiThemeProvider>
                            </div>
                        );
                    }
                }

                export default App;
