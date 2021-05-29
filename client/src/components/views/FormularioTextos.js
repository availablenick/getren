import React from 'react';
import { withRouter } from 'react-router-dom';
import { Toast } from 'react-bootstrap';

import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import api from '../../config/axios/api.js';

class FormularioTextos extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sections: {
        home: {
          label: 'Página principal',
          text: ''
        },
        'quem-somos': {
          label: 'Quem somos' ,
          text: ''
        },
        faq: {
          label: 'Perguntas frequentes',
          text: ''
        }
      },
      selectedSection: 'home',
      currentText: '',
      didUpdateSucceed: false,
    };
  }

  componentDidMount() {
    const sections = this.state.sections;

    Object.entries(sections).forEach(([section, sectionInfo]) => {
      api.get('/texts/' + section)
        .then((response) => {
          const text = response.data.body;
          
          this.setState((prevState) => {
            return {
              sections: {
                ...prevState.sections,
                [section]: {
                  ...sectionInfo,
                  text: text
                }
              }
            };
          });

          if (section === 'home') {
            this.setState({ currentText: text });
          }
        });
    });
  }

  sectionOptions() {
    const options = [];
    const sections = this.state.sections;

    Object.entries(sections).forEach(([section, sectionInfo]) => {
      console.log(section);
      options.push((
        <div className="form-check col-sm-4">
          <input type="radio" id={section + 'Radio'} value={section}
            onChange={this.handleSectionChange} checked={this.state.selectedSection === section}/>
          <label className="form-check-label" htmlFor={section + 'Radio'}>
            {sectionInfo.label}
          </label> 
        </div>
      ));
    });
    return options;
  }
  
  render() {
    return(
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>TEXTOS</h2>
        <form className='form-login'className='w-100' onSubmit={this.handleSubmit}>

          <div className='col-sm-12'>
              {this.sectionOptions()}
          </div>

          <FroalaEditor
            model={this.state.currentText}
            onModelChange={this.handleModelChange} 
          />

          <div className='d-flex justify-content-center'>
            <button type='submit' className='btn btn-primary mt-3'>Salvar</button>
          </div>
        </form>

        <Toast className='position-fixed'
          style={{ bottom: '1em', right: '1em', width: '30em' ,zIndex: '10' }}
          onClose={ () => { this.setState({ didUpdateSucceed: false }) } }
          show={ this.state.didUpdateSucceed } delay={ 3000 } autohide
        >
          <Toast.Header>
            <strong className="mr-auto">Seção atualizada!</strong>
            <small>Há poucos segundos</small>
          </Toast.Header>
          <Toast.Body>Texto da seção {this.state.selectedSection} atualizado!</Toast.Body>
        </Toast>
      </div>
    );
  }

  handleSectionChange = (event) => {
    let section = event.target.value;
    let sectionText = this.state.sections[section].text;

    this.setState({ selectedSection: section, currentText: sectionText });
  }
  
  handleModelChange = (model) => {
    this.setState({ currentText: model });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    api.put('/texts/' + this.state.selectedSection, { body: this.state.currentText})
      .then((response) => {
        this.setState({ didUpdateSucceed: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

}

export default withRouter(FormularioTextos);