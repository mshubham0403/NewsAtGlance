import React, { useState, useEffect } from 'react';
import { login } from './UserFuctions';
import {
  MDBIcon,
  MDBFreeBird,
  MDBCol,
  MDBRow,
  MDBCardBody,
  MDBContainer,
  MDBEdgeHeader,
} from 'mdbreact';
import ReactSnackBar from 'react-js-snackbar';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    login(user)
      .then((res) => {
        if (res.token && res.status === 'success') {
          console.log(res);
          history.push('/home');
        } else if (res.status === 'fail') {
          showSnackbar(res.message);
        } else {
          history.push('/error');
        }
      });
  };

  const showingSnackbar = (message) => {
    if (showSnackbar) return;

    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 2000);
  };

  return (
    <div style={{ marginBottom: '20vh' }}>
      <MDBContainer className="m-3 mb-12">
        <MDBEdgeHeader color="mdb-color darken-2"></MDBEdgeHeader>
        <MDBFreeBird>
          <MDBRow>
            <MDBCol
              md="8"
              lg="7"
              className="mx-auto float-none white z-depth-1 py-2 px-2"
            >
              <MDBCardBody>
                <form onSubmit={onSubmit}>
                  <p className="h4 text-center mb-4">Sign in</p>
                  <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    Your email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={onChangeEmail}
                  />
                  <br />

                  <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                    Your password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChangePassword}
                  />
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-lg btn-primary ">
                      Login
                    </button>
                  </div>
                </form>

                <div className="my-2">
                
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBFreeBird>
      </MDBContainer>

      <div>
        <ReactSnackBar Icon={<MDBIcon icon="newspaper" />} Show={showSnackbar}>
          {snackbarMessage}
        </ReactSnackBar>
      </div>
    </div>
  );
};

export default Login;
