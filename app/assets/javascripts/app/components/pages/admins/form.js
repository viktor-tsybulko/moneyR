import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Clearfix
} from 'react-bootstrap';
import {
  Paper,
  RaisedButton,
  TextField,
  SelectField,
  MenuItem,
  CircularProgress,
  DatePicker
} from 'material-ui';
import { paperStyle } from '../../common/styles';
import ImageComponent from '../../common/image_component';
import ImagesComponent from '../../common/images_component';
import { show, upsert } from '../../../services/admin';

class AdminForm extends Component {
  state = {
    admin: {
      email: '',
      password: '',
      password_confirmation: ''
    },
    validationErrors: {}
  };

  componentWillMount() {
    this._retrieveAdmin();
  }

  _retrieveAdmin = () => {
    const { id } = this.props.params;
    if (!id) { return false }
    show(id).success(res => {
      this.setState({
        admin: {
          ...res.admin,
          password: '',
          password_confirmation: ''
        }
      })
    })
  };

  handleChange = (key, value) => {
    const { admin } = this.state;

    this.setState({
      admin: {
        ...admin,
        [key]: value
      },
      validationErrors: {
        ...this.state.validationErrors,
        [key]: null
      }
    })
  };

  handleSubmit = event => {
    event.preventDefault();
    const { admin } = this.state;

    upsert(admin)
      .success(res => {
        location.hash = '#/admins';
      })
      .progress(value => {
        this.setState({ progress: value })
      })
      .error(res => {
        this.setState({
          validationErrors: res.validation_errors
        })
      })
  };


  render() {
    const { isLoading } = this.props.app.main;
    const { admin, progress, validationErrors } = this.state;

    return (
      <Paper style={paperStyle} zDepth={1}>
        <h2>&nbsp;Admin Form</h2>
        <br/>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Row>
              <Col sm={2}>
                <ControlLabel>
                  Email:
                </ControlLabel>
              </Col>
              <Col sm={10}>
                <TextField
                  floatingLabelText='Email'
                  fullWidth={true}
                  value={admin.email}
                  onChange={(_,val) => this.handleChange('email', val)}
                  errorText={ validationErrors.email ? validationErrors.email.join(', ') : '' }
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col sm={2}>
                <ControlLabel>
                  Password:
                </ControlLabel>
              </Col>
              <Col sm={10}>
                <TextField
                  floatingLabelText='Password'
                  fullWidth={true}
                  value={admin.password}
                  onChange={(_,val) => this.handleChange('password', val)}
                  errorText={ validationErrors.password ? validationErrors.password.join(', ') : '' }
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col sm={2}>
                <ControlLabel>
                  Password confirmation:
                </ControlLabel>
              </Col>
              <Col sm={10}>
                <TextField
                  floatingLabelText='Password confirmation'
                  fullWidth={true}
                  value={admin.password_confirmation}
                  onChange={(_,val) => this.handleChange('password_confirmation', val)}
                  errorText={ validationErrors.password_confirmation ? validationErrors.password_confirmation.join(', ') : '' }
                />
              </Col>
            </Row>
          </FormGroup>
          <Col sm={4} smOffset={8} className="text-right">
            <br/>
            <CircularProgress className={isLoading && progress > 0 ? 'loading-spinner' : 'hidden'} mode="determinate" value={progress} size={36} />
            <RaisedButton type='submit' primary={true} className='pull-right' label="Save admin" disabled={isLoading} />
          </Col>
          <Clearfix />
        </form>
      </Paper>
    )
  }
}

export default connect(state => state)(AdminForm)