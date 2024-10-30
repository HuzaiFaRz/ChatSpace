
// {
//   signUpInputsArray.map((elem, index) => {
//     return (
//       <Fragment key={index}>
//         <FormControl
//           sx={{
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "flex-start",
//             padding: "10px 10px",
//           }}
//           disabled={signUpLoading ? true : false}
//         >
//           <FormLabel
//             htmlFor={elem.inputCommonName}
//             sx={{
//               width: "100%",
//               fontSize: { xs: "1em", lg: "1.5em" },
//               color: "#128C7E",
//               ...(index === 3 && {
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "flex-start",
//                 gap: "20px",
//               }),
//             }}
//           >
//             {elem.inputPlaceHolderName}
//             {index !== 3 ? "" : <AddAPhotoIcon sx={{ fontSize: "1.5em" }} />}
//           </FormLabel>

//           <Input
//             type={elem.inputType}
//             name={elem.inputCommonName}
//             className={elem.inputCommonName}
//             sx={{
//               color: "#128C7E",
//               width: "100%",
//               display: index !== 3 ? "flex" : "none",
//               padding: "10px 20px",
//             }}
//             id={elem.inputCommonName}
//             placeholder={
//               index !== 3 ? `Enter ${elem.inputPlaceHolderName}` : undefined
//             }
//             accept={elem.inputType === "file" ? "image/*" : undefined} // Adds accept attribute for file input
//             value={
//               elem.inputType === "file"
//                 ? undefined
//                 : signUpInputs[elem.inputCommonName] || ""
//             }
//             onChange={(e) => signUpInputsHandler(e, elem.inputType)} // Passes input type for conditional handling
//           />
//           {index === 3 && signUpInputs[elem.inputCommonName]?.name && (
//             <p>Selected File: {signUpInputs[elem.inputCommonName].name}</p> // Display selected file name
//           )}
//         </FormControl>
//       </Fragment>
//     );
//   });
// }

// // createUserWithEmailAndPassword(
// //   auth,
// //   signUpUserInformaTion.signUpEmail,
// //   signUpUserInformaTion.signUpPassword
// // )
// //   .then((userCredential) => {
// //     const user = userCredential.user;
// //     const userRef = ref(storage, `Users/${userCredential.user.uid}`);
// //     uploadBytes(userRef, signUpUserInformaTion.signUpProfile)
// //       .then((a) => {
// //         getDownloadURL(userRef)
// //           .then((URL) => {
// //             signUpUserInformaTion.signUpProfile = URL;
// //             const userDocRef = doc(db, "Users", userCredential.user.uid);
// //             setDoc(userDocRef, signUpUserInformaTion)
// //               .then((b) => {
// //                 alertMain.style.display = "none";
// //                 alertMain.innerHTML = "";
// //                 showToast("SignUp SuccessFully", "#198754", 2000);
// //                 signUpForm.reset();
// //                 resetSignUpButton();
// //                 window.location.href = "../Login/login.html";
// //               })
// //               .catch((error) => {
// //                 alertMain.style.display = "none";
// //                 alertMain.innerHTML = "";
// //                 console.log(error);
// //               });
// //           })
// //           .catch((error) => {
// //             alertMain.style.display = "none";
// //             alertMain.innerHTML = "";
// //             console.log(error);
// //           });
// //       })
// // #075E54
// // #128C7E
// // #25D366
// //   #34B7F1
// // #
// // #
// // #25D366
// //   #34B7F1
