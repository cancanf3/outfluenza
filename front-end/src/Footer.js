import React, { Component } from 'react';

class Footer extends Component {

    render() {
        return(
            <div className='division'>
                <div className='footer'>
                    <h4>Made with <img src={this.props.like} className="like" alt="like" /></h4>
                </div>
            </div>
        )
    }
}

export default Footer;
