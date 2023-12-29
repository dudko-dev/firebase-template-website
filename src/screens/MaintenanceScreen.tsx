import { Box, Paper, Typography } from "@mui/material";
import "./MaintenanceScreen.css";
import BottomBar from "../components/BottomBar";

export default function MaintenanceScreen(props: { message?: string }) {
  const { REACT_APP_NAME } = process.env;
  return (
    <Paper
      sx={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "#282c34",
      }}
      elevation={3}
    >
      <Box sx={{ marginTop: "25vmin", alignItems: "center" }}>
        <header className="Loader-header">
          <img
            src="/assets/images/settings_white.svg"
            className="Loader-logo"
            alt="logo"
          />
        </header>
      </Box>
      <Typography variant="h4" align="center" color="secondary">
        {REACT_APP_NAME}
      </Typography>
      <Typography align="center" color="secondary" marginTop={"5vmin"}>
        Maintenance mode
      </Typography>
      <Typography align="center" color="secondary" marginTop={"5vmin"}>
        {typeof props.message === "string" ? props.message : ""}
      </Typography>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#282c34",
        }}
        elevation={0}
      >
        <BottomBar />
      </Paper>
    </Paper>
  );
}
