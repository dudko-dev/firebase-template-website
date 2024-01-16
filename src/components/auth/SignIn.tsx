import { useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { signInWithEmailAndPassword } from "firebase/auth";
import FirebaseAuth, { errorMessagesMap } from "../../services/FirebaseAuth";
import { Alert, Snackbar, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";
import "./SignIn.css";
import SignInWithButton, {
  SignInProviders,
  enabledProviders,
} from "./SignInWithButton";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState("");
  const [signInIsRunning, setSignInIsRunning] = useState(false);
  const [showMsg, setShowMsg] = useState(
    {} as {
      type: "success" | "warning" | "info" | "error";
      message: string;
      isShown: boolean;
    }
  );
  const { REACT_APP_404, REACT_APP_AUTH_SIGNUP, REACT_APP_AUTH_ACTION } =
    process.env;
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    localStorage.removeItem("authorized");
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    if (!email) {
      setErrorMessage("You did not specify an email address.");
      return;
    }
    if (!password) {
      setErrorMessage("You did not specify a password.");
      return;
    }
    setSignInIsRunning(true);
    signInWithEmailAndPassword(FirebaseAuth, email, password)
      .then(() => {
        setErrorMessage("");
        navigate("/");
      })
      .catch((err: FirebaseError) => {
        switch (err.code) {
          case "auth/invalid-login-credentials":
          case "auth/user-not-found":
          case "auth/wrong-password":
            setErrorMessage("Invalid username or password");
            break;
          default:
            if (errorMessagesMap[err.code]) {
              setErrorMessage(errorMessagesMap[err.code]);
            } else {
              setErrorMessage("Unknown error");
            }
            break;
        }
      })
      .finally(() => {
        setSignInIsRunning(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={signInIsRunning}
          >
            Sign In
          </Button>
          <Grid container textAlign={"center"}>
            {enabledProviders.map((e: string) => (
              <Grid item xs key={`signin_button_${e.toString()}`}>
                <SignInWithButton
                  provider={e as SignInProviders}
                  errorHandler={(err: any) => {
                    if (errorMessagesMap[err.code]) {
                      setShowMsg({
                        type: "error",
                        message: errorMessagesMap[err.code],
                        isShown: true,
                      });
                    } else {
                      setShowMsg({
                        type: "error",
                        message: "Unknown error",
                        isShown: true,
                      });
                    }
                  }}
                ></SignInWithButton>
              </Grid>
            ))}
          </Grid>
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs>
              <Button
                onClick={() => {
                  navigate(REACT_APP_AUTH_ACTION || REACT_APP_404 || "/");
                }}
              >
                <Typography sx={{ fontSize: "1em" }}>
                  Forgot password?
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  navigate(REACT_APP_AUTH_SIGNUP || REACT_APP_404 || "/");
                }}
              >
                <Typography sx={{ fontSize: "1em" }}>
                  Don't have an account?
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={showMsg.isShown}
        autoHideDuration={6000}
        onClose={() => {
          setShowMsg({ ...showMsg, isShown: false });
        }}
        sx={{ width: "100%", padding: "3vmin", justifyContent: "end" }}
      >
        {
          <Alert
            onClose={() => {
              setShowMsg({ ...showMsg, isShown: false });
            }}
            sx={{ marginRight: "3vmin" }}
            severity={showMsg.type}
          >
            {showMsg.message}
          </Alert>
        }
      </Snackbar>
    </Container>
  );
}
