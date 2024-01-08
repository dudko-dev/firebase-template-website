import { Box, Card, CardContent, Typography } from "@mui/material";
import "./SecondRoute.css";
import Loader from "../components/Loader";
import { User } from "firebase/auth";
import { UserModel } from "../models/database/User";

function SecondRoute({
  authUser,
  user,
  isLoadingUser,
}: {
  authUser: User | null | undefined;
  user: UserModel | undefined;
  isLoadingUser: boolean;
}) {
  return authUser?.emailVerified || isLoadingUser ? (
    <div className="SecondRoute">
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            fontWeight="bold"
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {user?.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </CardContent>
      </Card>
      <br />
      <Typography align="center">The development is in progress...</Typography>
      <Box sx={{ marginBottom: "10vmin" }} />
    </div>
  ) : (
    <Loader />
  );
}

export default SecondRoute;
