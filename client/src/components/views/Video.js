import React from 'react';

class Video extends React.Component {
    render(){
        return (
            <div>
                <h2>{this.props.video.title}</h2>
                <h4>Insira o vídeo aqui</h4>
                <h4>{this.props.video.description}</h4>
            </div>
        )

    }
}

export default Video