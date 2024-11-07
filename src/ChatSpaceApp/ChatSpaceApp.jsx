import React, { useState, Fragment, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Drawer,
  CircularProgress,
  IconButton,
  List,
  Input,
  ListItemText,
  AppBar,
  Modal,
} from "@mui/material";

import {
  auth,
  signOut,
  errorShow,
  successShow,
  allSuccess,
  getDocs,
  collection,
  where,
  query,
  db,
  orderBy,
  doc,
  getDoc,
  onSnapshot,
} from "../Auth/firebase";

import { useNavigate } from "react-router-dom";

import {
  AccountBox as AccountBoxIcon,
  Logout as LogoutIcon,
  Contacts as ContactsIcon,
  Call as CallIcon,
  Videocam as VideocamIcon,
  Search as SearchIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useAuth } from "../Utilities/AuthProvider";

const ChatSpaceApp = () => {
  const [currentUserData, setCurrentUserData] = useState();
  const [allUsersData, setAllUserData] = useState([]);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [passingUser, setPassingUser] = useState();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (loginUser) {
      navigate("/");
    }
  }, [loginUser, navigate]);

  useEffect(() => {
    if (loginUser) {
      (async () => {
        try {
          const userDocRef = doc(db, "Users", loginUser.uid);
          const response = await getDoc(userDocRef);
          setCurrentUserData(response.data());
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [loginUser]);

  useEffect(() => {
    const allUsersDocRef = query(
      collection(db, "Users"),
      orderBy("signupTime", "asc")
    );
    const gettingAllUserRealTime = onSnapshot(allUsersDocRef, (doc) => {
      const onlyGettingOutSideUsers = doc.docs.filter((e) => {
        return e.id !== loginUser?.uid;
      });
      const updatedUsersData = onlyGettingOutSideUsers.map((data) => {
        return data.id, data.data();
      });
      setAllUserData(updatedUsersData);
    });
    return () => gettingAllUserRealTime();
  }, [loginUser?.uid]);

  const [logOutLoading, setLogOutLoading] = useState(false);
  const [profileRightBarOpen, setProfileRightBarOpen] = useState(false);
  const [contactsLeftBarOpen, setContactsLeftBarOpen] = useState(false);
  const toggleRightDrawer = (anchor, open) => () => {
    setProfileRightBarOpen({ ...profileRightBarOpen, [anchor]: open });
  };
  const toggleLeftDrawer = (anchor, open) => () => {
    setContactsLeftBarOpen({ ...contactsLeftBarOpen, [anchor]: open });
  };
  const buttonStyled = {
    padding: "10px 15px",
    backgroundColor: "white",
    color: "#075E54",
    textTransform: "capitalize",
    fontSize: "0.8rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "20px",
  };
  const iconStyled = {
    color: "#075E54",
    fontSize: "1rem",
  };

  const logOutHandler = async () => {
    try {
      setLogOutLoading(true);
      await signOut(auth);
      setLogOutLoading(false);
      successShow(allSuccess.signOutSuccess);
    } catch (error) {
      setLogOutLoading(false);
      console.log(error);
      errorShow(error.messege);
    }
  };
  const [openUserModal, setOpenUserModal] = useState(false);
  const userModalHandler = () => setOpenUserModal(!openUserModal);

  const [massegeInput, setMassegeInput] = useState({
    massegeText: "",
    massegeSentAt: "",
    massegeSentBy: "",
  });

  const [massegeTyping, setMassegeTyping] = useState(
    massegeInput.massegeSentBy
  );

  const massegeHandler = (event) => {
    setMassegeTyping("Typing");
    setMassegeInput((prevMassegeInput) => ({
      ...prevMassegeInput,
      massegeText: event.target.value,
      massegeSentAt: new Date(),
      massegeSentBy: "Huzaifa",
    }));
  };

  const massegeFormHandler = (event) => {
    event.preventDefault();
    if (!massegeInput.massegeText) {
      alert("Fill Massege");
      return;
    }
  };

  const contacts =
    allUsersData.length === 0 ? (
      <React.Fragment>
        <Typography
          sx={{
            width: "100%",
            textAlign: "center",
            fontSize: "2em",
            color: "#fff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          No User Found
        </Typography>
      </React.Fragment>
    ) : (
      allUsersData.map((usersData, index) => {
        return (
          <React.Fragment key={index}>
            <List
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                },
                "&:focus": {
                  backgroundColor: "rgba(0,0,0,0.6)",
                },
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                padding: "15px 15px",
                cursor: "pointer",
              }}
              onClick={() => {
                setChatOpen(true);
                setPassingUser(usersData);
              }}
            >
              <Box
                component={"img"}
                sx={{
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={
                  usersData === undefined
                    ? "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                    : usersData.signUpProfile
                }
                alt="Profile Img"
              />
              <ListItemText
                primary={
                  usersData === undefined ? "User" : usersData.signUpName
                }
                sx={{ color: "#fff" }}
              />
            </List>
          </React.Fragment>
        );
      })
    );

  return (
    <Fragment>
      <AppBar
        position="static"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
          width: "100%",
          height: "max-content",
          backgroundColor: "#128C7E",
          boxShadow: "none",
          borderBottom: "1px solid white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            onClick={toggleLeftDrawer("left", true)}
            sx={{
              padding: "10px 15px",
              backgroundColor: "white",
              color: "#075E54",
              textTransform: "capitalize",
              fontSize: "0.8rem",
              display: { xs: "flex", sm: "none" },
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderRadius: "20px",
            }}
          >
            Contacts
            <ContactsIcon sx={iconStyled}></ContactsIcon>
          </Button>
          <Typography
            variant="h6"
            sx={{ fontWeight: "600", letterSpacing: "1px" }}
            component="h5"
          >
            ChatSpace
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button onClick={toggleRightDrawer("right", true)} sx={buttonStyled}>
            Profile
            <AccountBoxIcon sx={iconStyled}></AccountBoxIcon>
          </Button>

          <Button
            onClick={logOutHandler}
            disabled={logOutLoading ? true : false}
            sx={buttonStyled}
          >
            Log Out
            {logOutLoading ? (
              <CircularProgress color="#075E54" size="1rem" />
            ) : (
              <LogoutIcon sx={iconStyled}></LogoutIcon>
            )}
          </Button>
        </Box>
      </AppBar>
      <Box>
        <Drawer
          anchor={"left"}
          open={contactsLeftBarOpen["left"]}
          onClose={toggleLeftDrawer("left", false)}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          {contacts}
        </Drawer>
        <Drawer
          anchor={"right"}
          open={profileRightBarOpen["right"]}
          onClose={toggleRightDrawer("right", false)}
        >
          <Box
            component={"div"}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Box
              component={"img"}
              sx={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
                objectPosition: "center",
              }}
              src={
                currentUserData === undefined
                  ? "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                  : currentUserData.signUpProfile
              }
              alt="Profile Img"
            />
            <Typography
              sx={{
                fontWeight: "400",
                color: "#fff",
                fontSize: { xs: "2rem", sm: "2rem" },
              }}
            >
              Hi !{" "}
              {currentUserData === undefined
                ? "User"
                : currentUserData.signUpName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ color: "white" }}>
              {currentUserData === undefined
                ? `User@gmail.com`
                : currentUserData.signUpEmail}
            </Typography>
          </Box>
        </Drawer>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: { xs: "88vh", sm: "93vh" },
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "15px",
            width: { xs: "0%", sm: "40%" },
            height: "100%",
            backgroundColor: "#075E54",
            padding: "10px 0",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {contacts}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: { xs: "100%", sm: "60%" },
            height: "100%",
            backgroundColor: "#128C7E",
            position: "relative",
          }}
        >
          {chatOpen ? (
            <>
              <Box
                id="messegeDiv"
                sx={{
                  width: "100%",
                  height: "90%",
                  overflowY: "auto",
                }}
              >
                <Box
                  id="messegeHeader"
                  sx={{
                    width: "100%",
                    height: "10%",
                    backgroundColor: "#075E54",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    aligmItems: "center",
                    padding: "10px 10px",
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                    onClick={userModalHandler}
                  >
                    <Modal
                      open={openUserModal}
                      onClose={userModalHandler}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          backgroundColor: "#075E54",
                          color: "white",
                          border: "2px solid #fff",
                          borderRadius: "20px",
                          boxShadow: 24,
                          p: 4,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component={"img"}
                          sx={{
                            borderRadius: "50%",
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          src={
                            passingUser === undefined
                              ? "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                              : passingUser.signUpProfile
                          }
                          alt="Profile Img"
                        />
                        <Box>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            {" "}
                            {passingUser === undefined
                              ? `User`
                              : passingUser.signUpName}
                          </Typography>
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 2 }}
                          >
                            {passingUser === undefined
                              ? `User@gmail.com`
                              : passingUser.signUpEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </Modal>

                    <Box
                      component={"img"}
                      sx={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      src={
                        passingUser === undefined
                          ? `https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png`
                          : passingUser.signUpProfile
                      }
                      alt="Profile Img"
                    />
                    <ListItemText
                      primary={
                        passingUser === undefined
                          ? `User`
                          : passingUser.signUpName
                      }
                      sx={{ color: "#fff" }}
                    />
                  </List>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyConetnt: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <IconButton type="submit">
                      <CallIcon
                        sx={{
                          transition: "all 0.1s linear",
                          fontSize: "2rem",
                          padding: "5px 5px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                          color: "#075E54",
                        }}
                      />
                    </IconButton>
                    <IconButton type="submit">
                      <VideocamIcon
                        sx={{
                          transition: "all 0.1s linear",
                          fontSize: "2rem",
                          color: "#128C7E",
                          padding: "5px 5px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                        }}
                      />
                    </IconButton>
                    <IconButton type="submit">
                      <SearchIcon
                        sx={{
                          transition: "all 0.1s linear",
                          fontSize: "2rem",
                          color: "#128C7E",
                          padding: "5px 5px",
                          cursor: "pointer",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>
                <Box
                  id="messegeBody"
                  sx={{
                    width: "100%",
                    height: "90%",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "100%",
                      alignItems: false ? "flex-end" : "flex-start",
                      padding: "10px 10px",
                    }}
                  >
                    <Typography
                      id="messegetext"
                      sx={{
                        color: "white",
                        backgroundColor: "#075E54",
                        width: "80%",
                        padding: "10px 10px",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Perferendis magni modi laboriosam fugiat voluptas!
                      Facilis.
                      <span
                        id="messegeTime"
                        style={{
                          width: "100%",
                          color: "white",
                          opacity: "0.5",
                          fontSize: "1rem",
                          textAlign: "end",
                          padding: "5px 10px",
                        }}
                      >
                        01:26
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                component={"form"}
                id="messegeForm"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "10%",
                  backgroundColor: "#075E54",
                  padding: "10px 10px",
                  // borderTop: "5px solid white",
                  // borderRight: "5px solid white",
                  borderLeft: "2px solid white",
                }}
                onSubmit={massegeFormHandler}
              >
                <Input
                  type="text"
                  placeholder="Type Messege"
                  id="messegeInput"
                  sx={{
                    width: { xs: "80%", md: "90%" },
                    backgroundColor: "#fff",
                    padding: "10px 15px",
                    color: "#075E54",
                    borderRadius: "20px",
                  }}
                  disableUnderline={true}
                  value={massegeInput.massegeText}
                  onChange={massegeHandler}
                />

                <IconButton
                  type="submit"
                  sx={{ width: { xs: "20%", md: "10%" } }}
                >
                  <SendIcon
                    sx={{
                      transition: "all 0.1s linear",
                      fontSize: "3rem",
                      color: "#128C7E",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                    }}
                  />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "2em",
                  color: "#fff",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                No Chat Open
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Fragment>
  );
};

ChatSpaceApp.propTypes = {
  window: PropTypes.func,
};

export default ChatSpaceApp;
