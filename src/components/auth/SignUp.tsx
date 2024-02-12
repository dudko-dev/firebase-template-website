import { useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import FirebaseAuth, { errorMessagesMap } from "../../services/FirebaseAuth";
import { Alert, Checkbox, Snackbar, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";
import "./SignUp.css";
import SignInWithButton, {
  SignInProviders,
  enabledProviders,
} from "./SignInWithButton";
import { useNavigate } from "react-router-dom";
import FirebaseAnalytics from "../../services/FirebaseAnalytics";
import { logEvent } from "firebase/analytics";

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [signUpIsRunning, setSignUpIsRunning] = useState(false);
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [showMsg, setShowMsg] = useState(
    {} as {
      type: "success" | "warning" | "info" | "error";
      message: string;
      isShown: boolean;
    }
  );
  const { REACT_APP_404, REACT_APP_AUTH_SIGNIN, REACT_APP_AUTH_ACTION } =
    process.env;
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    localStorage.removeItem("authorized");
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    const repeatPassword = data.get("repeat_password")?.toString();
    if (!email) {
      setErrorMessage("You did not specify an email address.");
      return;
    }
    if (!password) {
      setErrorMessage("You did not specify a password.");
      return;
    }
    if (!repeatPassword) {
      setErrorMessage("You need to repeat the password.");
      return;
    }
    if (password !== repeatPassword) {
      setErrorMessage("The passwords don't match.");
      return;
    }
    setSignUpIsRunning(true);
    await createUserWithEmailAndPassword(FirebaseAuth, email, password)
      .then((user) =>
        sendEmailVerification(user.user, {
          url: `${window.location.origin}`,
        }).then(() => {
          logEvent(FirebaseAnalytics, "send_verification_email");
        })
      )
      .then(() => {
        setErrorMessage("");
        navigate("/");
      })
      .catch((err: FirebaseError) => {
        if (errorMessagesMap[err.code]) {
          setErrorMessage(errorMessagesMap[err.code]);
        } else {
          setErrorMessage("Unknown error");
        }
      })
      .finally(() => {
        setSignUpIsRunning(false);
        logEvent(FirebaseAnalytics, "sign_up");
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="repeat_password"
            label="Repeat Password"
            type="password"
            id="repeat_password"
          />
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          <Typography sx={{ fontSize: "8pt" }}>
            <Checkbox
              onChange={(event) => {
                setAcceptPolicies(!!event.target?.checked);
              }}
              value={acceptPolicies}
            />
            I confirm my agreement with{" "}
            <a href="/privacy_policy" target="_blank" rel="noreferrer">
              the privacy policy
            </a>{" "}
            and{" "}
            <a href="/eula" target="_blank" rel="noreferrer">
              the terms of services
            </a>
            .
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={signUpIsRunning || !acceptPolicies}
          >
            Sign Up
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
                  disableButton={signUpIsRunning || !acceptPolicies}
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
                  navigate(REACT_APP_AUTH_SIGNIN || REACT_APP_404 || "/");
                }}
              >
                <Typography sx={{ fontSize: "1em" }}>
                  Have an account?
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "10vmin" }} />
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
