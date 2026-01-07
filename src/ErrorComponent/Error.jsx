import { useEffect } from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.error(error);
  useEffect(() => {
    document.title = "ChatSpace | Error";
  }, []);

  return (
    <div
      id="error-page"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: "20px",
        color: "white",
      }}
    >
      <h1 style={{ fontWeight: "900", fontSize: "4rem" }}>Oops!</h1>
      <p style={{ fontWeight: "500", fontSize: "1.5rem" }}>
        Sorry, an unexpected error has occurred.
      </p>
      <p>
        <i style={{ fontWeight: "700", fontSize: "1rem" }}>
          {" "}
          {error?.statusText || error?.message || "404 Not Found"}
        </i>
      </p>
    </div>
  );
};

export default Error;
