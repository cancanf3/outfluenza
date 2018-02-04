import React, { Component } from 'react';
import pin from './aux/pin.svg';
import './Doctor.css';
import RaisedButton from 'material-ui/RaisedButton';

class Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_address : false
        }
    }

    toggleAddress = () => {
        var show = !this.state.show_address;
        this.setState({ show_address : show });
    }

    render() {
        console.log(this.props.doctors);
        return(
            <div className='doctor'>
                <h3>{this.props.name}</h3>
                <p>
                    <img className="pin" onClick={this.toggleAddress} src={pin}/>
                    {this.state.show_address ? this.props.location : null}
                </p>
            </div>
        )
    }
}

export default Doctor;
