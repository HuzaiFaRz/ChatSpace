// import { useState } from "react";

// const Home = () => {
//   const [massegeInput, setMassegeInput] = useState({
//     massegeText: "",
//     massegeSentAt: "",
//     massegeSentBy: "",
//   });

//   const [massegeTyping, setMassegeTyping] = useState(
//     massegeInput.massegeSentBy
//   );

//   const massegeHandler = (event) => {
//     setMassegeTyping("Typing");
//     setMassegeInput((prevMassegeInput) => ({
//       ...prevMassegeInput,
//       massegeText: event.target.value,
//       massegeSentAt: new Date(),
//       massegeSentBy: "Huzaifa",
//     }));
//   };

//   const massegeFormHandler = (event) => {
//     event.preventDefault();
//     if (!massegeInput.massegeText) {
//       alert("Fill Massege");
//       return;
//     }
//   };
//   return (
//     <>
//       <form className="massege-Form" onSubmit={massegeFormHandler}>
//         <h1>{massegeTyping}</h1>
//         <input
//           type="text"
//           value={massegeInput.massegeText}
//           onChange={massegeHandler}
//         />
//         <input type="submit" value={"Send"} />
//       </form>

//       <div
//         style={{
//           width: "400px",
//           height: "300px",
//           overflowY: "scroll",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-start",
//           justifyItems: "center",
//           backgroundColor: "sandybrown",
//         }}
//       >
//         <div
//           style={{
//             width: "max-content",
//             padding: "10px 20px",
//             margin: "10px 20px",
//             background: "black",
//             color: "white",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "flex-start",
//           }}
//         >
//           <span>{massegeInput.massegeText}</span>
//           <span>{massegeInput.massegeSentBy}</span>
//           <span>{massegeInput.massegeSentAt.toString()}</span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;

const Home = () => {
  return <div>Home</div>;
};

export default Home;
