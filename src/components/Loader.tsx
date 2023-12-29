import { Box } from "@mui/material";
import "./Loader.css";

function Loader() {
  return (
    <Box sx={{ marginTop: "10vmin", alignItems: "center" }}>
      <header className="Loader-header">
        <img
          src="/assets/images/settings_dark.svg"
          className="Loader-logo"
          alt="logo"
        />
      </header>
    </Box>
  );
}

export default Loader;
