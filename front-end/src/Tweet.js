import React, { Component } from 'react';
import './Tweet.css';
import bird from './aux/twitter.svg';


class Tweet extends Component {

    render() {
        return(
            <blockquote className="twitter-tweet">
                <p>{this.props.text}</p>
                <a><img className="bird" src={bird}/><strong> {this.props.user}</strong> - {this.props.distance.toFixed(1)} miles away</a>
            </blockquote>
        );
    }
}

export default Tweet;
