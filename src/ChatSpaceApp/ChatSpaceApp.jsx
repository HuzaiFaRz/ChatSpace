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
  collection,
  query,
  db,
  orderBy,
  doc,
  onSnapshot,
  serverTimestamp,
  allErrors,
  addDoc,
  updateDoc,
  arrayUnion,
  deleteField,
  where,
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
import { ToastContainer } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";

const ChatSpaceApp = () => {
  useEffect(() => {
    document.title = "ChatSpace";
  }, []);

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
  const [editMessageModal, setEditMessageModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messageEditInput, setMessageEditInput] = useState("");
  const [messagesMe, setMessagesMe] = useState();
  const [messagesYou, setMessagesYou] = useState();
  const [allMessages, setAllMessages] = useState();
  const [editMessageLoading, setEditMessageLoading] = useState(false);
  const [deleteMessageLoading, setDeleteMessageLoading] = useState(false);
  const [chatSearchInput, setChatSearchInput] = useState("");
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

  // Side Bars and Modals
  // Side Bars and Modals
  const toggleRightDrawer = (anchor, open) => () => {
    setProfileRightBarOpen({ ...profileRightBarOpen, [anchor]: open });
  };
  const toggleLeftDrawer = (anchor, open) => () => {
    setChatsLeftBarOpen({ ...chatsLeftBarOpen, [anchor]: open });
  };
  const userModalHandler = () => setOpenUserModal(!openUserModal);
  const deleteMessageModalHandler = () =>
    setDeleteMessageModal(!deleteMessageModal);
  const editMessageModalHandler = () => {
    setEditMessageModal(!editMessageModal);
    setMessageEditInput("");
  };
  // Side Bars and Modals
  // Side Bars and Modals

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
  }, [loginUser.uid]);
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
      const newMessage = {
        messageEdited: false,
        messageText: messageInput,
        messageSendAt: serverTimestamp(),
        messageSendBy: loginUser.uid,
        messageSendTo: chat.chatOpenData?.allUserID,
      };
      await addDoc(massegesCollection, newMessage);
      setMessageInput("");
      if (messageBody.current) {
        messageBody.current.scrollTop = messageBody.current.scrollHeight;
      }
      successShow(allSuccess.messegeSendSuccess);
    } catch (error) {
      errorShow(error.messege);
    }
  };
  // Message Saving Handler
  // Message Saving Handler

  // Message Getting
  // Message Getting

  useEffect(() => {
    if (!chat?.chatOpenData?.allUserID) {
      return;
    }
    const unsubscribeMe = onSnapshot(
      query(
        collection(db, "Messages"),
        orderBy("messageSendAt", "asc"),
        where("messageSendBy", "==", loginUser?.uid),
        where("messageSendTo", "==", chat.chatOpenData?.allUserID)
      ),

      (snapshot) => {
        const messagesMeGetting = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setMessagesMe(messagesMeGetting);
      }
    );

    const unsubscribeYou = onSnapshot(
      query(
        collection(db, "Messages"),
        orderBy("messageSendAt", "desc"),
        where("messageSendBy", "==", chat.chatOpenData?.allUserID),
        where("messageSendTo", "==", loginUser?.uid)
      ),
      (snapshot) => {
        const messagesYouGetting = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setMessagesYou(messagesYouGetting);
      }
    );

    return () => {
      unsubscribeMe();
      unsubscribeYou();
    };
  }, [chat.chatOpenData?.allUserID, loginUser?.uid]);

  useEffect(() => {
    if (messagesMe && messagesYou) {
      setAllMessages(
        [...messagesMe, ...messagesYou].sort(
          (a, b) => a?.messageSendAt?.seconds - b?.messageSendAt?.seconds
        )
      );
    }
  }, [messagesMe, messagesYou]);

  // Message Getting
  // Message Getting

  useEffect(() => {
    if (messageBody.current) {
      messageBody.current.scrollTop = messageBody.current.scrollHeight;
      return;
    }
  }, [allMessages]);

  const [messageID, setMessageID] = useState();
  // Message DeleteForMe Handler
  // Message DeleteForMe Handler
  const messageDeleteForMeHandler = async () => {
    try {
      const deleteMessageForMeRef = doc(db, "Messages", messageID);
      setDeleteMessageLoading(true);
      await updateDoc(deleteMessageForMeRef, {
        messageDeleteForMe: arrayUnion(loginUser.uid),
      });
      setDeleteMessageModal(false);
      setDeleteMessageLoading(false);
      successShow(allSuccess.messageDeleteSuccessFully);
    } catch (error) {
      setDeleteMessageModal(false);
      setDeleteMessageLoading(false);
      errorShow(allErrors.messageDeleteError || error.message);
    }
  };
  // Message DeleteForMe Handler
  // Message DeleteForMe Handler

  // Message DeleteForAll Handler
  // Message DeleteForAll Handler
  const messageDeleteForAllHandler = async () => {
    try {
      const deleteMessageForAllRef = doc(db, "Messages", messageID);
      setDeleteMessageLoading(true);
      await updateDoc(deleteMessageForAllRef, {
        messageDeleteForAll: true,
        messageDeleteForAllAt: serverTimestamp(),
        messageEdited: deleteField(),
      });
      setDeleteMessageModal(false);
      setDeleteMessageLoading(false);
      successShow(allSuccess.messageDeleteSuccessFully);
    } catch (error) {
      setDeleteMessageModal(false);
      setDeleteMessageLoading(false);
      errorShow(allErrors.messageDeleteError || error.message);
    }
  };
  // Message DeleteForAll Handler
  // Message DeleteForAll Handler

  // Message Copy Handler
  // Message Copy Handler
  const messageCopyHandler = async (copyText) => {
    try {
      await navigator.clipboard.writeText(copyText);
      successShow(allSuccess.messageCopySuccess);
    } catch (error) {
      errorShow(allErrors.messageCopyError || error.message);
    }
  };
  // Message Copy Handler
  // Message Copy Handler

  // Message Edit Handler
  // Message Edit Handler
  const messageEditHandler = async () => {
    event.preventDefault();
    try {
      if (
        /^\s*$/.test(messageEditInput) ||
        !messageEditInput ||
        messageEditInput.trim().length === 0
      ) {
        errorShow(allErrors.emptyMessegeError);
        return;
      }
      const editMessageRef = doc(db, "Messages", messageID);
      setEditMessageLoading(true);
      await updateDoc(editMessageRef, {
        messageText: messageEditInput,
        messageEdited: true,
      });
      successShow(allSuccess.messageEditSuccessFully);
      setEditMessageLoading(false);
      setMessageEditInput("");
      setEditMessageModal(false);
    } catch (error) {
      setEditMessageLoading(false);
      setMessageEditInput("");
      setEditMessageModal(false);
      errorShow(error.message || allErrors);
    }
  };
  // Message Edit Handler
  // Message Edit Handler

  // Chat Search Handler
  // Chat Search Handler
  const chatSearchHandler = (event) => {
    setChatSearchInput(event.target.value);
    outSideUsers.forEach((data) => {
      if (
        event.target.value.toLocaleLowerCase() ===
        data.allUserDATA.signUpName.toLocaleLowerCase()
      ) {
        return;
      }
    });
  };
  // Chat Search Handler
  // Chat Search Handler

  const contacts =
    outSideUsers?.length === 0 ? (
      <CircularProgress
        size={"5rem"}
        sx={{
          color: "white",
        }}
      />
    ) : (
      outSideUsers?.map((data, index) => {
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
          borderBottom: "2.5px solid #fff",
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
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#075E54",
              borderBottom: "2.5px solid #fff",
              p: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              height: "100px",
            }}
          >
            <Input
              type="text"
              placeholder="Search By Name"
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "10px 15px",
                color: "#075E54",
                borderRadius: "20px",
              }}
              disableUnderline={true}
              value={chatSearchInput}
              onChange={(event) => {
                chatSearchHandler(event);
              }}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "15px",
              padding: "10px 0",
            }}
          >
            {contacts}
          </Box>
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
              textAlign: "center",
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
                width: "100%",
                fontWeight: "400",
                color: "#fff",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Hi ! {currentUser?.allUserDATA?.signUpName}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ color: "white", width: "100%" }}
            >
              {currentUser?.allUserDATA?.signUpEmail}
            </Typography>
          </Box>
        </Drawer>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            justifyContent: outSideUsers.length !== 0 ? "flex-start" : "center",
            width: { xs: "0%", sm: "40%" },
            height: "100%",
            backgroundColor: "#075E54",
          }}
        >
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#075E54",
              borderBottom: "2.5px solid #fff",
              p: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              height: "10%",
            }}
          >
            <Input
              type="text"
              placeholder="Search By Name"
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                padding: "10px 15px",
                color: "#075E54",
                borderRadius: "20px",
              }}
              disableUnderline={true}
              value={chatSearchInput}
              onChange={(event) => {
                chatSearchHandler(event);
              }}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "15px",
              padding: "10px 0",
            }}
          >
            {contacts}
          </Box>
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
                    borderBottom: "2.5px solid #fff",
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
                    {allMessages?.length === 0 ? (
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
                      allMessages?.map((data, index) => {
                        const { messageSendBy, messageText, messageEdited } =
                          data;
                        const messageSendAtConvert =
                          data?.messageSendAt?.seconds * 1000 +
                          data?.messageSendAt?.nanoseconds / 1000000;
                        const messageSendAtConverted = new Date(
                          messageSendAtConvert
                        )?.toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: "true",
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                        });
                        return (
                          <React.Fragment key={index}>
                            {data?.messageDeleteForMe?.includes(
                              loginUser.uid
                            ) || (
                              <Box
                                component={"div"}
                                id="messege"
                                sx={{
                                  color:
                                    messageSendBy === loginUser.uid
                                      ? "#075E54"
                                      : "#fff",
                                  backgroundColor:
                                    messageSendBy === loginUser.uid
                                      ? "#fff"
                                      : "#075E54",
                                  width: "300px",
                                  minWidth: "max-content",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                  opacity: data?.messageDeleteForAll
                                    ? "0.5"
                                    : "1",
                                  alignItems: "flex-start",
                                  alignSelf:
                                    messageSendBy === loginUser.uid
                                      ? "flex-end"
                                      : "flex-start",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: data?.messageDeleteForAll
                                      ? "14px"
                                      : "15px",
                                  }}
                                >
                                  {data?.messageDeleteForAll
                                    ? "This Message Has Been Deleted"
                                    : messageText}
                                </Typography>

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
                                  {data?.messageDeleteForAll ? null : (
                                    <>
                                      {messageEdited && (
                                        <Typography
                                          sx={{
                                            fontSize: "12px",
                                          }}
                                        >
                                          Edited
                                        </Typography>
                                      )}
                                      {data?.messageSendBy ===
                                        loginUser?.uid && (
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
                                          <Tooltip title={"Edit Message"}>
                                            <EditIcon
                                              sx={{
                                                color: "#075E54",
                                                fontSize: "1.1rem",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                editMessageModalHandler();
                                                setMessageID(data.id);
                                              }}
                                            />
                                          </Tooltip>
                                        </>
                                      )}
                                      <>
                                        <Tooltip title={"Copy Message"}>
                                          <ContentCopyIcon
                                            sx={{
                                              color:
                                                messageSendBy === loginUser?.uid
                                                  ? "#075E54"
                                                  : "#fff",
                                              fontSize: "0.9rem",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              messageCopyHandler(messageText);
                                            }}
                                          />
                                        </Tooltip>
                                        <span
                                          id="messegeTime"
                                          style={{
                                            color:
                                              messageSendBy === loginUser.uid
                                                ? "#075E54"
                                                : "#fff",
                                            fontSize: "0.8rem",
                                          }}
                                        >
                                          {messageSendAtConverted ===
                                          "Invalid Date"
                                            ? "Loading....."
                                            : messageSendAtConverted}
                                        </span>
                                      </>
                                    </>
                                  )}
                                </Box>
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
                              messageDeleteForMeHandler();
                            }}
                            disabled={deleteMessageLoading && true}
                          >
                            Delete For Me
                          </Button>
                          <Button
                            sx={buttonStyled}
                            onClick={() => {
                              messageDeleteForAllHandler();
                            }}
                            disabled={deleteMessageLoading && true}
                          >
                            Delete For Everyone
                          </Button>
                        </Box>
                      </Fade>
                    </Modal>

                    <Modal
                      open={editMessageModal}
                      onClose={editMessageModalHandler}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={editMessageModal}>
                        <Box
                          component={"form"}
                          id="messegeEditForm"
                          onSubmit={messageEditHandler}
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
                          <Input
                            type="text"
                            placeholder="Type Edit Messege"
                            sx={{
                              width: "80%",
                              backgroundColor: "#fff",
                              padding: "10px 15px",
                              color: "#075E54",
                              borderRadius: "20px",
                            }}
                            disableUnderline={true}
                            value={messageEditInput}
                            onChange={(event) =>
                              setMessageEditInput(event.target.value)
                            }
                            disabled={editMessageLoading && true}
                          />

                          <IconButton
                            type="submit"
                            disabled={editMessageLoading && true}
                          >
                            <EditIcon
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
                    borderLeft: "2.5px solid #fff",
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
                    //   !messageInput ||
                    //   /^\s*$/.test(messageInput) ||
                    //   messageInput.trim().length === 0
                    // }
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
