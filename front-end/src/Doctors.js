import React, { Component } from 'react';
import Doctor from './Doctor.js';
import './Doctors.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Doctors extends Component {
    render() {
        console.log(this.props.doctors);
        return(
            <div className='doctors'>
                <MuiThemeProvider>
                {/* <img src={prescription} className="prescription" alt="prescription" /> */}
                {this.props.doctors !== 'loading' ? this.props.doctors.map(doctor =>
                    <Doctor
                        name={doctor.Name}
                        location={doctor.Location}
                        availability={doctor.Availability}
                    />
                ) : null }
                </MuiThemeProvider>
            </div>
        )
    }
}

export default Doctors;
