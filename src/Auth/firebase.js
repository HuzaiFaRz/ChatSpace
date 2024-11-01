import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
const {
  VITE_CHATSPACE_apiKey,
  VITE_CHATSPACE_authDomain,
  VITE_CHATSPACE_projectId,
  VITE_CHATSPACE_storageBucket,
  VITE_CHATSPACE_messagingSenderId,
  VITE_CHATSPACE_appId,
  VITE_CHATSPACE_measurementId,
} = import.meta.env;
const firebaseConfig = {
  // apiKey: VITE_CHATSPACE_apiKey,
  // authDomain: VITE_CHATSPACE_authDomain,
  // projectId: VITE_CHATSPACE_projectId,
  // storageBucket: VITE_CHATSPACE_storageBucket,
  // messagingSenderId: VITE_CHATSPACE_messagingSenderId,
  // appId: VITE_CHATSPACE_appId,
  // measurementId: VITE_CHATSPACE_measurementId,
  apiKey: "AIzaSyBdDy4_WmcRK8NQEnqzrYlefppTEh9pKnM",
  authDomain: "chatspace-dd695.firebaseapp.com",
  projectId: "chatspace-dd695",
  storageBucket: "chatspace-dd695.appspot.com",
  messagingSenderId: "259681605914",
  appId: "1:259681605914:web:c88bf99187bd08bfd034a3",
  measurementId: "G-1Q7TQR7NB2",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const notificationStyled = {
  style: { width: "100%", lineHeight: "20px" },
  autoClose: 2000,
  theme: "light",
  position: "top-center",
  draggablePercent: 100,
};

const errorShow = (errorMessege) => {
  toast.error(errorMessege, notificationStyled);
};
const successShow = (successMessege) => {
  toast.success(successMessege, notificationStyled);
};
const allErrors = {
  nameError: "Please Enter Your Name.",
  emailError: "Please Enter Your Eamil",
  passwordError: "Please Enter Password.",
  inValidUser: "No Account Found With This Email",
  userExistError: "This Email Is Already Registered",
  slowNetworkError: "Check Your Internet Connection And Try Again",
  profileError: "Select Profile Photo",
  blankSpace: "Please remove any blank spaces.",
  passwordWeekError: "Password should be at least 6 characters",
};
const allSuccess = {
  signUpSuccess: "Account Created Successfully! You Can Now Log In.",
  logInSuccess: "Login Successful!",
};

export {
  allErrors,
  allSuccess,
  errorShow,
  successShow,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  db,
  storage,
  doc,
  setDoc,
  getDoc,
  getDocs,
  ref,
  uploadBytes,
  getDownloadURL,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
};
