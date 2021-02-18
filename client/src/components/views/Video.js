import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Spinner, Modal} from 'react-bootstrap';

import api from '../../config/axios/api.js';

class Video extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            ...props.video
        }
    }
    static getDerivedStateFromProps(props, state) {
        console.log(props, state);
        return {...props.video}
    }
    render(){
        return (
            <div>
                <h2>{this.state.title}</h2>
                <h4>Insira o vídeo aqui</h4>
                <h4>{this.state.description}</h4>
            </div>
        )

    }
}

export default Video