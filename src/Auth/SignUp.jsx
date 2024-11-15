import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import {
  FormControl,
  Input,
  FormLabel,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer } from "react-toastify";
import {
  allErrors,
  allSuccess,
  errorShow,
  successShow,
  auth,
  createUserWithEmailAndPassword,
  db,
  storage,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  serverTimestamp,
} from "./firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [fileExtension, setFileExtension] = useState();
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [signUpInputs, setSignUpInputs] = useState({
    signUpProfile: "",
    signUpName: "",
    signUpEmail: "",
    signUpPassword: "",
    signupTime: serverTimestamp(),
  });

  const signUpInputsArray = [
    {
      inputCommonName: "signUpName",
      inputPlaceHolderName: "Name",
      inputType: "text",
    },
    {
      inputCommonName: "signUpEmail",
      inputPlaceHolderName: "Email",
      inputType: "email",
    },
    {
      inputCommonName: "signUpPassword",
      inputPlaceHolderName: "Password",
      inputType: passwordShow ? "text" : "password",
    },
    {
      inputCommonName: "signUpProfile",
      inputPlaceHolderName: "Select Profile",
      inputType: "file",
    },
  ];
  // const filesExtentions = /(\.jpg|\.jpeg|\.webp|\.png)$/i;
  const signUpInputsHandler = (event) => {
    try {
      const { name, value, type } = event.target;
      setSignUpInputs((prevSetSignUpInputs) => ({
        ...prevSetSignUpInputs,
        [name]: type === "file" ? event.target.files[0] : value,
      }));

      type === "file" && setFileExtension(event.target.files[0].type);
    } catch (error) {
      console.log(error);
    }
  };

  const signUpSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!signUpInputs.signUpName) {
        errorShow(allErrors.nameError);
        return;
      } else if (!signUpInputs.signUpEmail) {
        errorShow(allErrors.emailError);
        return;
      } else if (!signUpInputs.signUpPassword) {
        errorShow(allErrors.passwordError);
        return;
      } else if (signUpInputs.signUpPassword.length < 6) {
        errorShow(allErrors.passwordWeekError);
        return;
      } else if (!signUpInputs.signUpProfile) {
        errorShow(allErrors.profileError);
        return;
      } else if (
        fileExtension !== "image/jpeg" &&
        fileExtension !== "image/jpg" &&
        fileExtension !== "image/png" &&
        fileExtension !== "image/webp"
      ) {
        errorShow(allErrors.profileExtention);
        return;
      } else if (
        /^\s*$/.test(signUpInputs.signUpName) ||
        /\s/.test(signUpInputs.signUpEmail) ||
        /\s/.test(signUpInputs.signUpPassword)
      ) {
        errorShow(allErrors.blankSpace);
        return;
      }
      setSignUpLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpInputs.signUpEmail,
        signUpInputs.signUpPassword
      );
      const user = userCredential.user;
      const userRef = ref(storage, `Users/${user.uid}`);
      await uploadBytes(userRef, signUpInputs.signUpProfile);
      const URL = await getDownloadURL(userRef);
      signUpInputs.signUpProfile = URL;
      const usersDoc = doc(db, "Users", user.uid);
      await setDoc(usersDoc, signUpInputs);
      successShow(allSuccess.signUpSuccess);
      setSignUpLoading(false);
      setSignUpInputs((prevSetSignUpInputs) => ({
        ...prevSetSignUpInputs,
        signUpProfile: "",
        signUpName: "",
        signUpEmail: "",
        signUpPassword: "",
        signupTime: "",
      }));
      navigate("/login");
    } catch (error) {
      if (error.message === `Firebase: Error (auth/email-already-in-use).`) {
        errorShow(allErrors.userExistError);
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
      console.log(error);
      setSignUpLoading(false);
    }
  };
  return (
    <Fragment>
      <Box
        width={"100%"}
        height={"100%"}
        component={"div"}
        className="SignUpPage"
        sx={{
          backgroundColor: "#128C7E",
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
          onSubmit={signUpSubmitHandler}
          sx={{
            backgroundColor: "#fff",
            width: {
              xs: "100%",
              sm: "500px",
            },
            height: "700px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            borderRadius: "20px",
            padding: "10px 10px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#128C7E",
              fontWeight: "500",
              textDecoration: "underline",
              textUnderlineOffset: "20px",
              padding: "10px 10px",
            }}
          >
            Sign Up
          </Typography>
          {signUpInputsArray.map((elem, index) => {
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
                  disabled={signUpLoading && true}
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
                        gap: "10px",
                      }),
                    }}
                  >
                    {elem.inputType === "file" && (
                      <AddAPhotoIcon
                        sx={{ fontSize: "1.3em", marginBottom: "0.4rem" }}
                      ></AddAPhotoIcon>
                    )}
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
                    placeholder={
                      elem.inputType === "file"
                        ? undefined
                        : `Enter ${elem.inputPlaceHolderName}`
                    }
                    value={
                      elem.inputType === "file"
                        ? undefined
                        : signUpInputs[elem.inputCommonName] || ""
                    }
                    inputProps={{
                      accept: elem.inputType === "file" ? "image/*" : undefined,
                    }}
                    onChange={(event) => {
                      signUpInputsHandler(event);
                    }}
                  />

                  {index === 2 && (
                    <IconButton
                      disabled={signUpLoading && true}
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
            disabled={signUpLoading && true}
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
            name="signUpSubmitButton"
            className={"signUpSubmitButton"}
            id={"signUpSubmitButton"}
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
              {signUpLoading ? (
                <CircularProgress color="white" size={"1.5em"} />
              ) : (
                "Sign Up"
              )}
            </Box>
          </Button>
          <Box
            component={"span"}
            sx={{
              padding: "20px 15px",
              width: "100%",
              color: "#075E54",
              textAlign: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Already have an Account ?
            <Button disabled={signUpLoading && true}>
              <Link
                to={"/login"}
                style={{
                  textDecoration: "none",
                  color: "#34B7F1",
                  fontWeight: "900",
                  textTransform: "capitalize",
                }}
              >
                Log In
              </Link>
            </Button>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};
export default SignUp;
