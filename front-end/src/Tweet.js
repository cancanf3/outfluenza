import React, { Component } from 'react';
import './Tweet.css';

class Tweet extends Component {

    render() {
        return(
            <div className="tweet">
                <h4><b>{this.props.user}</b></h4>
                <p>{this.props.text}</p>
            </div>
        );
    }
}

export default Tweet;
