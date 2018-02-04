import React, { Component } from 'react';
import pin from './aux/pin.svg';
import call from './aux/agenda.svg';
import './Doctor.css';
import RaisedButton from 'material-ui/RaisedButton';

class Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_info : false
        }
    }

    toggleInfo = () => {
        var show = !this.state.show_info;
        this.setState({ show_info : show });
    }

    render() {
        console.log(this.props.doctors);
        return(
            <div className='doctor' onClick={this.toggleInfo}>
                <h3><strong>{this.props.name}</strong> - {this.props.distance.toFixed(1)} miles away</h3>
                <p>
                    <img className="pin" src={pin}/>
                    {this.state.show_info ? this.props.location: null}
                    {this.state.show_info ? <br/> : null}
                    <img className="call" src={call}/>
                    {this.state.show_info ? this.props.contact : null}
                </p>
            </div>
        )
    }
}

export default Doctor;
