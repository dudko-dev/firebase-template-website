import { Typography, Link } from "@mui/material";
import "./BottomBar.css";
import FirebaseAnalytics from "../services/FirebaseAnalytics";
import { logEvent } from "firebase/analytics";
import { useLocation } from "react-router-dom";
import { useCallback } from "react";

function BottomBar() {
  const location = useLocation();

  useCallback(() => {
    logEvent(FirebaseAnalytics, "page_view", {
      page_path: `${location.pathname}`,
      page_title: document.title,
    });
  }, [location]);

  return (
    <Typography align="center">
      <Link href="https://dudko.dev" underline="none">
        2023-{new Date().getFullYear()}©by siarhei dudko
      </Link>
    </Typography>
  );
}

export default BottomBar;
