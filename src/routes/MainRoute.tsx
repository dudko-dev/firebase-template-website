import { Box, Typography } from "@mui/material";
import "./MainRoute.css";
import { User } from "firebase/auth";

function MainRoute({ authUser }: { authUser: User | null | undefined }) {
  return (
    <div className="MainRoute">
      {authUser?.emailVerified ? null : (
        <Typography textAlign={"center"}>
          {authUser
            ? "Confirm your email by clicking on the link from your email to see more."
            : "Log in or register to see more."}
        </Typography>
      )}
      <br />
      <Typography align="center">The development is in progress...</Typography>
      <Box sx={{ marginBottom: "10vmin" }} />
    </div>
  );
}

export default MainRoute;
