import { Fragment, useState } from "react";

import {
  FormControl,
  Input,
  FormLabel,
  Button,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer } from "react-toastify";
import {
  allErrors,
  allSuccess,
  errorShow,
  successShow,
  auth,
  signInWithEmailAndPassword,
} from "./firebase";

const LogIn = () => {
  const [logInLoading, setLogInLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [logInInputs, setLogInInputs] = useState({
    logInEmail: "huzaifa@gmail.com",
    logInPassword: "123456",
  });

  const logInInputsArray = [
    {
      inputCommonName: "logInEmail",
      inputPlaceHolderName: "Email",
      inputType: "email",
    },
    {
      inputCommonName: "logInPassword",
      inputPlaceHolderName: "Password",
      inputType: passwordShow ? "text" : "password",
    },
  ];

  const logInInputsHandler = (event) => {
    const { name, value } = event.target;
    setLogInInputs((prevSetLogInInputs) => ({
      ...prevSetLogInInputs,
      [name]: value,
    }));
  };

  const logInSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      if (
        /\s/.test(logInInputs.logInEmail) ||
        /\s/.test(logInInputs.logInPassword)
      ) {
        errorShow(allErrors.blankSpace);
        return;
      } else if (!logInInputs.logInEmail) {
        errorShow(allErrors.emailError);
        return;
      } else if (!logInInputs.logInPassword) {
        errorShow(allErrors.passwordError);
        return;
      } else if (logInInputs.logInPassword <= 6) {
        errorShow(allErrors.passwordWeekError);
        return;
      }
      setLogInLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        logInInputs.logInEmail,
        logInInputs.logInPassword
      );
      console.log(userCredential);
      setLogInLoading(false);
      logInInputs.logInEmail = "";
      logInInputs.logInPassword = "";
      successShow(allSuccess.logInSuccess);
    } catch (error) {
      if (error.message === `Firebase: Error (auth/invalid-credential).`) {
        errorShow(allErrors.inValidUser);
      } else if (
        error.message ===
        `Firebase: Password should be at least 6 characters (auth/weak-password).`
      ) {
        errorShow(allErrors.passwordWeekError);
      } else if (
        error.message === `Firebase: Error (auth/network-request-failed).`
      ) {
        errorShow(allErrors.slowNetworkError);
      } else {
        errorShow(error.message);
      }
      console.log(error.message);
      setLogInLoading(false);
    }
  };
  return (
    <Fragment>
      <Box
        width={"100%"}
        height={"100vh"}
        component={"div"}
        className="SignUpPage"
        sx={{
          backgroundColor: "#25D366",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <ToastContainer />
        <Box
          component={"form"}
          className="signUpForm"
          onSubmit={logInSubmitHandler}
          sx={{
            backgroundColor: "#fff",
            width: {
              xs: "100%",
              sm: "500px",
            },
            height: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            borderRadius: "20px",
            padding: "10px 10px",
          }}
        >
          {logInInputsArray.map((elem, index) => {
            return (
              <Fragment key={index}>
                <FormControl
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "10px 10px",
                  }}
                  disabled={logInLoading ? true : false}
                >
                  <FormLabel
                    htmlFor={elem.inputCommonName}
                    sx={{
                      width: "100%",
                      fontSize: { xs: "1em", lg: "1.5em" },
                      color: "#128C7E",
                      ...(elem.inputType === "file" && {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "5px",
                      }),
                    }}
                  >
                    {elem.inputPlaceHolderName}
                  </FormLabel>

                  <Input
                    type={elem.inputType}
                    name={elem.inputCommonName}
                    className={elem.inputCommonName}
                    sx={{
                      color: "#128C7E",
                      width: "100%",
                      padding: "10px 20px",
                    }}
                    id={elem.inputCommonName}
                    placeholder={`Enter ${elem.inputPlaceHolderName}`}
                    value={logInInputs[elem.inputCommonName]}
                    onChange={logInInputsHandler}
                  />

                  {index === 1 && (
                    <IconButton
                      onClick={() => {
                        setPasswordShow((prev) => !prev);
                      }}
                      sx={{
                        position: "absolute",
                        fontSize: "1.3em",
                        marginBottom: "0.4rem",
                        right: "3%",
                        top: "50%",
                        cursor: "pointer",
                      }}
                    >
                      {passwordShow ? (
                        <VisibilityIcon
                          sx={{ fill: "#128c7e" }}
                        ></VisibilityIcon>
                      ) : (
                        <VisibilityOffIcon
                          sx={{ fill: "#128c7e" }}
                        ></VisibilityOffIcon>
                      )}
                    </IconButton>
                  )}
                </FormControl>
              </Fragment>
            );
          })}

          <Button
            disabled={logInLoading ? true : false}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "10px 15px",
              background: "#128C7E",
              color: "white",
              fontWeight: "900",
              letterSpacing: "2px",
              fontSize: { xs: "0.8em", lg: "1.5em" },
            }}
            type={"submit"}
            name="logInSubmitButton"
            className={"logInSubmitButton"}
            id={"logInSubmitButton"}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {logInLoading ? (
                <CircularProgress color="white" size={"1.5em"} />
              ) : (
                "Log In"
              )}
            </Box>
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
export default LogIn;
