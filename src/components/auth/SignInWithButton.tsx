import { Button } from "@mui/material";
import {
  AuthProvider,
  // FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import FirebaseAuth from "../../services/FirebaseAuth";
import "./SignInWithButton.css";

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
  } = {
    provider: SignInProviders.apple,
    errorHandler: (err: any) => {},
  }
) {
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
    await signInWithPopup(FirebaseAuth, provider).catch((err) => {
      if (typeof props.errorHandler === "function") props.errorHandler(err);
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
    >
      {getSymbol()}
    </Button>
  );
}

export default SignInWithButton;
