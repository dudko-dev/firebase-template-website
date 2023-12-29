import { Typography, Link } from "@mui/material";
import "./BottomBar.css";

function BottomBar() {
  return (
    <Typography align="center">
      <Link href="https://dudko.dev" underline="none">
        2023-{new Date().getFullYear()}©by siarhei dudko
      </Link>
    </Typography>
  );
}

export default BottomBar;
