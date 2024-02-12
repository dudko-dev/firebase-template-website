import { Button } from "@mui/material";
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import FirebaseAuth from "../../services/FirebaseAuth";
import "./SignInWithButton.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FirebaseAnalytics from "../../services/FirebaseAnalytics";
import { logEvent } from "firebase/analytics";

export enum SignInProviders {
  apple = "apple",
  google = "google",
  github = "github",
}

export const enabledProviders: SignInProviders[] = [];

function SignInWithButton(
  props: {
    provider?: SignInProviders;
    errorHandler?: (err: any) => void;
    disableButton?: boolean;
  } = {
      provider: SignInProviders.apple,
      errorHandler: (err: any) => { },
      disableButton: false,
    }
) {
  const [signInIsRunning, setSignInIsRunning] = useState(false);
  const navigate = useNavigate();

  const signInFun = async (): Promise<void> => {
    let provider: AuthProvider;
    switch (props.provider) {
      case SignInProviders.apple:
        provider = new OAuthProvider("apple.com").addScope("email");
        break;
      case SignInProviders.google:
        provider = new GoogleAuthProvider().addScope(
          "https://www.googleapis.com/auth/userinfo.email"
        );
        break;
      case SignInProviders.github:
        provider = new GithubAuthProvider().addScope("read:user");
        break;
      default:
        throw new TypeError("Invalid Sign In Provider");
    }
    setSignInIsRunning(true);
    let loggedIn = false;
    await signInWithPopup(FirebaseAuth, provider)
      .then(async (user) => {
        if (!user.user.emailVerified) {
          await sendEmailVerification(user.user, {
            url: `${window.location.origin}`,
          }).then(() => {
            logEvent(FirebaseAnalytics, "send_verification_email");
          });
        }
        loggedIn = true;
      })
      .catch((err) => {
        if (typeof props.errorHandler === "function") props.errorHandler(err);
      })
      .finally(() => {
        setSignInIsRunning(false);
        if (loggedIn) navigate("/");
        logEvent(FirebaseAnalytics, "login", {
          auth_provider: provider.providerId,
        });
      });
  };

  const getSymbol = (): string => {
    switch (props.provider) {
      case SignInProviders.apple:
        return "\uf179";
      case SignInProviders.google:
        return "\uf1a0";
      case SignInProviders.github:
        return "\uf09b";
      default:
        throw new TypeError("Invalid Sign In Provider");
    }
  };

  return (
    <Button
      type="button"
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      style={{ fontFamily: "FontAwersome" }}
      onClick={signInFun}
      disabled={signInIsRunning || props.disableButton}
    >
      {getSymbol()}
    </Button>
  );
}

export default SignInWithButton;
