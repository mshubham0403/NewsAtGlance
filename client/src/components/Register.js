import React, { useState, useEffect, useRef } from "react";
import { register } from "./UserFuctions";
import {
  MDBIcon,
  toast,
  ToastContainer,
  MDBFreeBird,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBContainer,
  MDBEdgeHeader,
} from "mdbreact";
import ReactSnackBar from "react-js-snackbar";

const Register = ({ history }) => {
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    errors: {},
    Show: false,
    Showing: true,
    message: "",
  });

 

  const showRef = useRef(false);

  useEffect(() => {
    if (state.Showing) return;

    setState((prevState) => ({
      ...prevState,
      Show: true,
      Showing: true,
    }));

    const timeout = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        Show: false,
        Showing: false,
      }));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [state.Showing]);

  const onChange = (e) => {
    const prop =e.target.name;
    const val =e.target.value;
    setState((prevState) => ({
      ...prevState,
      [prop]: val,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
     fn: state.first_name,
    ln:state.last_name,
     email: state.email,
     pwd: state.password,
    };

    register(newUser).then((res) => {
      if (res.status === "success") {
        history.push(`/login`);
      } else if (res.status === "fail") {
        show(res.message);
      } else {
        history.push(`/error`);
      }
    });
  };

  const show = (message) => {
    console.log(message);
    if (showRef.current) return;

    setState((prevState) => ({
      ...prevState,
      Show: false,
      Showing: true,
      message,
    }));

    const timeout = setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        Show: false,
        Showing: false,
      }));
    }, 2000);

    return () => clearTimeout(timeout);
  };

  return (
    <div style={{ marginBottom: "20vh" }}>
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
                  <p className="h4 text-center mb-4">Register</p>
                  <label
                    htmlFor="defaultFormLoginEmailEx"
                    className="grey-text"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={state.first_name}
                    onChange={onChange}
                  />
                  <br />

                  <label
                    htmlFor="defaultFormLoginEmailEx"
                    className="grey-text"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    placeholder="Enter your lastname name"
                    value={state.last_name}
                    onChange={onChange}
                  />
                  <br />

                  <label
                    htmlFor="defaultFormLoginEmailEx"
                    className="grey-text"
                  >
                    Enter Mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    value={state.email}
                    onChange={onChange}
                  />
                  <br />

                  <label
                    htmlFor="defaultFormLoginPasswordEx"
                    className="grey-text"
                  >
                    Your password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={onChange}
                  />
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-lg btn-primary ">
                      Register!
                    </button>
                  </div>
                </form>

                <div className="my-2">
                  <p style={{ fontWeight: "300", fontSize: "0.75rem" }}>:)</p>
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBFreeBird>
      </MDBContainer>

      <div>
        <ReactSnackBar Icon={<MDBIcon icon="newspaper" />} Show={state.Show}>
          {state.message}
        </ReactSnackBar>
      </div>
    </div>
  );
};

export default Register;
