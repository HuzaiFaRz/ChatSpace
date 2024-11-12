/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment, useEffect, useRef } from "react";
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
  Tooltip,
  Fade,
  Backdrop,
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
  serverTimestamp,
  allErrors,
  setDoc,
  addDoc,
  ref,
  deleteDoc,
  updateDoc,
  arrayUnion,
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
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PropTypes from "prop-types";
import { useAuth } from "../Utilities/AuthProvider";
import { toast, ToastContainer } from "react-toastify";

const ChatSpaceApp = () => {
  const { loginUser } = useAuth();
  // States
  // States
  const [outSideUsers, setOutSideUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [logOutLoading, setLogOutLoading] = useState(false);
  const [chat, setChat] = useState({
    chatOpen: false,
    chatOpenData: undefined,
  });
  const [profileRightBarOpen, setProfileRightBarOpen] = useState(false);
  const [chatsLeftBarOpen, setChatsLeftBarOpen] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [deleteMessageModal, setDeleteMessageModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [getEachUserMessages, setGetEachUserMessages] = useState();
  // States
  // States

  // Massege Scroll Bar Set
  // Massege Scroll Bar Set
  const messageBody = useRef(null);
  useEffect(() => {
    if (chat.chatOpen) {
      if (messageBody.current) {
        messageBody.current.scrollTop = messageBody.current.scrollHeight;
      }
    }
  }, [chat.chatOpen]);
  // Massege Scroll Bar Set
  // Massege Scroll Bar Set

  // Login Checker
  // Login Checker
  const navigate = useNavigate();
  useEffect(() => {
    if (loginUser) {
      navigate("/");
    }
  }, [loginUser, navigate]);
  // Login Checker
  // Login Checker

  // Log Out
  // Log Out
  const logOutHandler = async () => {
    try {
      setLogOutLoading(true);
      await signOut(auth);
      setLogOutLoading(false);
      successShow(allSuccess.signOutSuccess);
    } catch (error) {
      setLogOutLoading(false);
      errorShow(error.messege || allErrors.logOutError);
    }
  };
  // Log Out
  // Log Out

  // Side Bar and Modal
  // Side Bar and Modal
  const toggleRightDrawer = (anchor, open) => () => {
    setProfileRightBarOpen({ ...profileRightBarOpen, [anchor]: open });
  };
  const toggleLeftDrawer = (anchor, open) => () => {
    setChatsLeftBarOpen({ ...chatsLeftBarOpen, [anchor]: open });
  };
  const userModalHandler = () => setOpenUserModal(!openUserModal);
  const deleteMessageModalHandler = () =>
    setDeleteMessageModal(!deleteMessageModal);
  // Side Bar and Modal
  // Side Bar and Modal

  // Default Style
  // Default Style
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

  // Default Style
  // Default Style

  // UserGetting
  // UserGetting
  useEffect(() => {
    const UsersDocRef = query(
      collection(db, "Users"),
      orderBy("signupTime", "asc")
    );
    const allUsersSnapShot = onSnapshot(UsersDocRef, (snapshot) => {
      const allUserDataSnapShot = snapshot.docs.map((allUsersData) => {
        return {
          allUserID: allUsersData.id,
          allUserDATA: allUsersData.data(),
        };
      });
      const outSideUserFiltered = allUserDataSnapShot.filter(
        (data) => data.allUserID !== loginUser.uid
      );
      allUserDataSnapShot
        .filter((data) => data.allUserID === loginUser.uid)
        .map((data) => {
          setCurrentUser(data);
        });
      setOutSideUsers(outSideUserFiltered);
    });
    return () => {
      allUsersSnapShot();
    };
  }, []);
  // UserGetting
  // UserGetting

  // Message Saving Handler
  // Message Saving Handler
  const messageFormHandler = async (event) => {
    event.preventDefault();
    try {
      if (
        !messageInput ||
        /^\s*$/.test(messageInput) ||
        messageInput.trim().length === 0
      ) {
        errorShow(allErrors.emptyMessegeError);
        return;
      }
      const massegesCollection = collection(db, "Messages");
      await addDoc(massegesCollection, {
        messageDeleteForMe: false,
        messageDeleteForAll: false,
        messageEdited: false,
        messageText: messageInput,
        messageSentAt: serverTimestamp(),
        messageSentBy: loginUser.uid,
        messageSendTo: chat.chatOpenData?.allUserID,
      });
      setMessageInput("");
      if (messageBody.current) {
        messageBody.current.scrollTop = messageBody.current.scrollHeight;
      }
      successShow(allSuccess.messegeSentSuccess);
    } catch (error) {
      errorShow(error.messege);
    }
  };
  // Message Saving Handler
  // Message Saving Handler

  // Message Getting
  // Message Getting
  useEffect(() => {
    const MessagesDocRef = query(
      collection(db, "Messages"),
      orderBy("messageSentAt", "asc")
    );

    const allMessagesSnapShot = onSnapshot(MessagesDocRef, (snapshot) => {
      const filteredMessages = snapshot.docs
        .map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
        .filter((data) => data.messageSendTo === chat.chatOpenData?.allUserID);
      setGetEachUserMessages(filteredMessages);
    });

    return () => {
      allMessagesSnapShot();
    };
  }, [chat.chatOpenData?.allUserID]);
  // Message Getting
  // Message Getting

  useEffect(() => {
    if (messageBody.current) {
      messageBody.current.scrollTop = messageBody.current.scrollHeight;
      return;
    }
  }, [getEachUserMessages]);

  const [messageID, setMessageID] = useState();

  const deleteMessageForMeHandler = async () => {
    try {
      const deleteMessageFormeRef = doc(db, "Messages", messageID);
      setDeleteMessageModal(false);
      await updateDoc(deleteMessageFormeRef, {
        messageDeleteForMe: arrayUnion(loginUser.uid),
      });
      successShow(allSuccess.messageDeleteSuccess);
    } catch (error) {
      errorShow(allErrors.messageDeleteError || error.message);
    }
  };

  const deleteMessageForAllHandler = async () => {
    try {
      const deleteMessageFormeRef = doc(db, "Messages", messageID);
      setDeleteMessageModal(false);
      await updateDoc(deleteMessageFormeRef, {
        messageDeleteForAll: true,
        messageText: "This Message Has Been Deleted",
      });
      successShow(allSuccess.messageDeleteSuccess);
    } catch (error) {
      errorShow(allErrors.messageDeleteError || error.message);
    }
  };

  const messageCopyHandler = async (copyText) => {
    try {
      await navigator.clipboard.writeText(copyText);
      successShow(allSuccess.messageCopySuccess);
    } catch (error) {
      errorShow(allErrors.messageCopyError || error.message);
    }
  };

  const contacts =
    outSideUsers.length === 0 ? (
      <CircularProgress
        size={"5rem"}
        sx={{
          position: "absolute",
          color: "white",
        }}
      />
    ) : (
      outSideUsers.map((data, index) => {
        return (
          <List
            key={index}
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
              setChat((prevSetChat) => ({
                ...prevSetChat,
                chatOpen: true,
                chatOpenData: data,
              }));
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
              src={data?.allUserDATA?.signUpProfile}
              alt="Profile Img"
            />
            <ListItemText
              primary={data?.allUserDATA?.signUpName}
              sx={{ color: "#fff" }}
            />
          </List>
        );
      })
    );

  return (
    <Fragment>
      <ToastContainer />
      <AppBar
        position="static"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
          width: "100%",
          height: { xs: "15vh", sm: "8vh" },
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
            Chats
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
          open={chatsLeftBarOpen["left"]}
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
              src={currentUser?.allUserDATA?.signUpProfile}
              alt="Profile Img"
            />
            <Typography
              sx={{
                fontWeight: "400",
                color: "#fff",
                fontSize: { xs: "2rem", sm: "2rem" },
              }}
            >
              Hi ! {currentUser?.allUserDATA?.signUpName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ color: "white" }}>
              {currentUser?.allUserDATA?.signUpEmail}
            </Typography>
          </Box>
        </Drawer>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: { xs: "85vh", sm: "92vh" },
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
            justifyContent: outSideUsers.length !== 0 ? "flex-start" : "center",
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
          {chat.chatOpen ? (
            <>
              <Box
                id="messegeDiv"
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  id="massegeHeader"
                  sx={{
                    width: "100%",
                    backgroundColor: "#075E54",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    aligmItems: "center",
                    padding: "10px 10px",
                    borderBottom: "1px solid #fff",
                    position: "absolute",
                    top: "0%",
                    height: "10%",
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
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={openUserModal}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: "100%", sm: "600px" },
                            backgroundColor: "#075E54",
                            color: "white",
                            border: "2px solid #fff",
                            borderRadius: "20px",
                            boxShadow: 24,
                            p: 4,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: {
                              xs: "space-between",
                              sm: "center",
                            },
                            alignItems: "center",
                            gap: { xs: "0px", sm: "20px" },
                          }}
                        >
                          <Box
                            component={"img"}
                            sx={{
                              borderRadius: "50%",
                              width: { xs: "60px", sm: "100px" },
                              height: { xs: "60px", sm: "100px" },
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            src={chat.chatOpenData?.allUserDATA?.signUpProfile}
                            alt="Profile Img"
                          />
                          <Box>
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h6"
                            >
                              {chat.chatOpenData?.allUserDATA?.signUpName}
                            </Typography>
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                              component="p"
                            >
                              {chat.chatOpenData?.allUserDATA?.signUpEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
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
                      src={chat.chatOpenData?.allUserDATA?.signUpProfile}
                      alt="Profile Img"
                    />
                    <ListItemText
                      primary={chat.chatOpenData?.allUserDATA?.signUpName}
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
                  ref={messageBody}
                  id="messegeBody"
                  sx={{
                    width: "100%",
                    height: "80%",
                    overflowX: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "10px 10px",
                    }}
                  >
                    {getEachUserMessages?.length === 0 ? (
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
                        No Messeges
                      </Typography>
                    ) : (
                      getEachUserMessages?.map((data, index) => {
                        const {
                          messageSentBy,
                          messageText,
                          messageDeleteForMe,
                          messageDeleteForAll,
                          messageEdited,
                        } = data;
                        const messageSendAtConvert =
                          data?.messageSentAt?.seconds * 1000 +
                          data?.messageSentAt?.nanoseconds / 1000000;
                        const messageSendAtConverted = new Date(
                          messageSendAtConvert
                        )?.toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: "true",
                          weekday: "short",
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                        });

                        return (
                          <React.Fragment key={index}>
                            {messageDeleteForMe?.includes(
                              loginUser.uid
                            ) ? null : (
                              <Box
                                component={"div"}
                                id="messege"
                                sx={{
                                  color:
                                    messageSentBy === loginUser.uid
                                      ? "#075E54"
                                      : "#fff",
                                  backgroundColor:
                                    messageSentBy === loginUser.uid
                                      ? "#fff"
                                      : "#075E54",
                                  width: "300px",
                                  minWidth: "max-content",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                  opacity: messageDeleteForAll ? "0.5" : "1",
                                  alignItems: "flex-start",
                                  alignSelf:
                                    messageSentBy === loginUser.uid
                                      ? "flex-end"
                                      : "flex-start",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: messageDeleteForAll
                                      ? "14px"
                                      : "15px",
                                  }}
                                >
                                  {messageText}
                                </Typography>

                                {messageDeleteForAll || (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-evenly",
                                      alignItems: "center",
                                      padding: "0px 10px",
                                    }}
                                    component={"div"}
                                  >
                                    <ContentCopyIcon
                                      sx={{
                                        color: "#075E54",
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        messageCopyHandler(messageText);
                                      }}
                                    />
                                    {messageSentBy === loginUser.uid && (
                                      <>
                                        <Tooltip title={"Delete Message"}>
                                          <DeleteIcon
                                            sx={{
                                              color: "#075E54",
                                              fontSize: "1.1rem",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              deleteMessageModalHandler();
                                              setMessageID(data.id);
                                            }}
                                          />
                                        </Tooltip>
                                      </>
                                    )}

                                    <span
                                      id="messegeTime"
                                      style={{
                                        color:
                                          messageSentBy === loginUser.uid
                                            ? "#075E54"
                                            : "#fff",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {messageSendAtConverted === "Invalid Date"
                                        ? "Loading....."
                                        : messageSendAtConverted}
                                    </span>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}

                    <Modal
                      open={deleteMessageModal}
                      onClose={deleteMessageModalHandler}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={deleteMessageModal}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: {
                              xs: "100%",
                              sm: "600px",
                            },
                            backgroundColor: "#075E54",
                            color: "white",
                            border: "2px solid #fff",
                            borderRadius: "20px",
                            boxShadow: 24,
                            p: 4,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: {
                              xs: "space-between",
                              sm: "center",
                            },
                            alignItems: "center",
                            gap: { xs: "0px", sm: "20px" },
                          }}
                        >
                          <Button
                            sx={buttonStyled}
                            onClick={() => {
                              deleteMessageForMeHandler();
                            }}
                          >
                            Delete For Me
                          </Button>
                          <Button
                            sx={buttonStyled}
                            onClick={() => {
                              deleteMessageForAllHandler();
                            }}
                          >
                            Delete For Everyone
                          </Button>
                        </Box>
                      </Fade>
                    </Modal>
                  </Box>
                </Box>
                <Box
                  component={"form"}
                  id="messegeForm footer"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "#075E54",
                    padding: "10px 10px",
                    borderLeft: "2px solid white",
                    position: "absolute",
                    bottom: "0",
                    height: "10%",
                  }}
                  onSubmit={messageFormHandler}
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
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                  />
                  <IconButton
                    type="submit"
                    // disabled={
                    //   !messageInput || /\s/.test(messageInput) ? true : false
                    // }
                    disabled={
                      !messageInput ||
                      /^\s*$/.test(messageInput) ||
                      messageInput.trim().length === 0
                    }
                    sx={{ width: { xs: "20%", md: "10%" } }}
                  >
                    <SendIcon
                      sx={{
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
