import { useState, FormEvent, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
  getIdToken,
} from "firebase/auth";
import FirebaseAuth, { errorMessagesMap } from "../../services/FirebaseAuth";
import { Alert, Snackbar } from "@mui/material";
import { FirebaseError } from "firebase/app";
import "./Action.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const modes = ["resetEmail", "resetPassword", "verifyEmail"] as const;

export default function Action() {
  const [errorMessage, setErrorMessage] = useState("");
  const [actionIsRunning, setActionIsRunning] = useState(false);
  const [showMsg, setShowMsg] = useState(
    {} as {
      type: "success" | "warning" | "info" | "error";
      message: string;
      isShown: boolean;
    }
  );
  const [searchParams] = useSearchParams();
  const mode: (typeof modes)[number] = modes.includes(
    searchParams.get("mode") as any
  )
    ? (searchParams.get("mode") as (typeof modes)[number])
    : "resetEmail";
  let oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    localStorage.removeItem("authorized");
    const email = data.get("email")?.toString();
    if (!email) {
      setErrorMessage("You did not specify an email address.");
      return;
    }
    setActionIsRunning(true);
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
      })
      .finally(() => {
        setActionIsRunning(false);
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
    setActionIsRunning(true);
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
      })
      .finally(() => {
        setActionIsRunning(false);
      });
  };

  const handleVerifyEmail = useCallback(async () => {
    if (mode !== "verifyEmail") return;
    if (!oobCode) {
      setShowMsg({
        type: "error",
        message: "You must follow the link from the email.",
        isShown: true,
      });
      return;
    }
    setActionIsRunning(true);
    await applyActionCode(FirebaseAuth, oobCode)
      .then(async () => {
        setShowMsg({
          type: "info",
          message: "The address has been confirmed, you need to log in again.",
          isShown: true,
        });
        if (FirebaseAuth.currentUser)
          await getIdToken(FirebaseAuth.currentUser, true);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 500);
      })
      .catch((err: FirebaseError) => {
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
      })
      .finally(() => {
        setActionIsRunning(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, oobCode]);

  useEffect(() => {
    handleVerifyEmail();
  }, [handleVerifyEmail]);

  const inputBox = (): JSX.Element | null => {
    switch (mode) {
      case "verifyEmail":
        return null;
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={actionIsRunning}
            >
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={actionIsRunning}
            >
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
