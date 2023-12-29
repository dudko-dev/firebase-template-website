import { Typography, Link } from "@mui/material";
import "./NoMatchRoute.css";

function NoMatchRoute() {
  return (
    <div className="NoMatchRoute">
      <Typography align="center" variant="h2" fontWeight="bold">
        Not Found
      </Typography>
      <Typography align="center">
        <Link href="/">home page</Link>
      </Typography>
    </div>
  );
}

export default NoMatchRoute;
