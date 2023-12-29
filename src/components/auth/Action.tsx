import { useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
  signOut,
} from "firebase/auth";
import FirebaseAuth, { errorMessagesMap } from "../../services/FirebaseAuth";
import { Alert, Snackbar } from "@mui/material";
import { FirebaseError } from "firebase/app";
import "./Action.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const modes = ["resetEmail", "resetPassword", "verifyEmail"] as const;

export default function Action() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showMsg, setShowMsg] = useState(
    {} as {
      type: "success" | "warning" | "info" | "error";
      message: string;
      isShown: boolean;
    }
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const mode: (typeof modes)[number] = modes.includes(
    searchParams.get("mode") as any
  )
    ? (searchParams.get("mode") as (typeof modes)[number])
    : "resetEmail";
  const oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  const { REACT_APP_404, REACT_APP_AUTH_SIGNUP } = process.env;

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    localStorage.removeItem("authorized");
    const email = data.get("email")?.toString();
    if (!email) {
      setErrorMessage("You did not specify an email address.");
      return;
    }
    sendPasswordResetEmail(FirebaseAuth, email, {
      url: `${window.location.origin}`,
    })
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
      });
  };

  const handleConfirmResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    localStorage.removeItem("authorized");
    const password = data.get("password")?.toString();
    const repeatPassword = data.get("repeat_password")?.toString();
    if (!oobCode) {
      setErrorMessage("You must follow the link from the email..");
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
    confirmPasswordReset(FirebaseAuth, oobCode, password)
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
      });
  };

  const handleVerifyEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.removeItem("authorized");
    if (!oobCode) {
      setErrorMessage("You must follow the link from the email..");
      return;
    }
    applyActionCode(FirebaseAuth, oobCode)
      .then(() => signOut(FirebaseAuth))
      .then(() => {
        setErrorMessage("");
        navigate(REACT_APP_AUTH_SIGNUP || REACT_APP_404 || "/");
      })
      .catch((err: FirebaseError) => {
        if (errorMessagesMap[err.code]) {
          setErrorMessage(errorMessagesMap[err.code]);
        } else {
          setErrorMessage("Unknown error");
        }
      });
  };

  const inputBox = (): JSX.Element => {
    switch (mode) {
      case "verifyEmail":
        return (
          <Box
            component="form"
            onSubmit={handleVerifyEmail}
            noValidate
            sx={{ mt: 1 }}
          >
            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Verify
            </Button>
          </Box>
        );
      case "resetPassword":
        return (
          <Box
            component="form"
            onSubmit={handleConfirmResetPassword}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="repeat_password"
              label="Repeat New Password"
              type="password"
              id="repeat_password"
            />
            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Confirm
            </Button>
          </Box>
        );
      case "resetEmail":
      default:
        return (
          <Box
            component="form"
            onSubmit={handleResetPassword}
            noValidate
            sx={{ mt: 1 }}
          >
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
            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Restore
            </Button>
          </Box>
        );
    }
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
        {inputBox()}
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
