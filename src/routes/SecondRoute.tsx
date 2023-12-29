import { Box, Typography } from "@mui/material";
import "./SecondRoute.css";
import FirebaseAuth from "../services/FirebaseAuth";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../components/Loader";

function SecondRoute() {
  const [user] = useAuthState(FirebaseAuth);
  return user?.emailVerified ? (
    <div className="SecondRoute">
      <Typography align="center">The development is in progress...</Typography>
      <Typography align="left" style={{ whiteSpace: "pre-line" }}>
        {JSON.stringify(user, undefined, "\u00A0\u00A0\u00A0\u00A0")}
      </Typography>
      <Box sx={{ marginBottom: "10vmin" }} />
    </div>
  ) : (
    <Loader />
  );
}

export default SecondRoute;
