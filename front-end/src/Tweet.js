import React, { Component } from 'react';
import './Tweet.css';

class Tweet extends Component {

    render() {
        return(
            <blockquote className="twitter-tweet">
                <p>{this.props.text}</p>
                <a><strong> - {this.props.user}</strong> - {this.props.distance.toFixed(1)} miles away</a>
            </blockquote>
        );
    }
}

export default Tweet;
