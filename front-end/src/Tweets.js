import React, { Component } from 'react';
import Tweet from './Tweet.js';

class Tweets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: '',
            key: 0,
            tweets: []
        };
    }

    callFluLocation = (e) => {
        var zip = e.target.value;

        if(zip.length > 4) {
            console.log("A real zip code");
        }
    }

    render() {

        var tweets = this.props.tweets;

        return (
            <div>
                <input
                    type='text'
                    value={this.state.search}
                    onChange={this.callFluLocation}
                />
                <br></br>
                <br></br>
                {
                    (this.props.tweets !== 'loading' ?
                        this.props.tweets.map(
                            tweet =>
                            <Tweet
                                user={tweet.user_name}
                                text={tweet.tweet_text}
                            />
                        ) : <h1>Loading tweets...</h1>)
                    }
            </div>
        );
    }
}

export default Tweets;
