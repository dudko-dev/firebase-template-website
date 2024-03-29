import { Outlet, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { NoMatchRoute } from "../routes";
import FirebaseAuth from "../services/FirebaseAuth";
import Loader from "../components/Loader";
import TopBar, { menuItems } from "../components/TopBar";
import SignIn from "../components/auth/SignIn";
import { Paper } from "@mui/material";
import "./BaseScreen.css";
import BottomBar from "../components/BottomBar";
import SignUp from "../components/auth/SignUp";
import Recovery from "../components/auth/Action";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { UserModel } from "../models/database/User";

export default function BaseScreen() {
  const [authUser, isLoadingAuthUser] = useAuthState(FirebaseAuth);
  const userRef = doc(UserModel.parent, `${FirebaseAuth.currentUser?.uid}`);
  const [user, isLoadingUser] = useDocumentData(userRef);

  const {
    REACT_APP_AUTH_SIGNIN,
    REACT_APP_AUTH_SIGNUP,
    REACT_APP_AUTH_ACTION,
  } = process.env;

  return (
    <div className="App">
      <TopBar />
      {isLoadingAuthUser ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Outlet />} key="page_main">
            {menuItems.map((e, i) => {
              if (i === 0) {
                return (
                  <Route
                    index
                    element={e.component({
                      authUser,
                      user,
                      isLoadingUser,
                    })}
                    key={e.key}
                  />
                );
              }
              return (
                <Route
                  path={e.path.substring(1)}
                  element={e.component({
                    authUser,
                    user,
                    isLoadingUser,
                  })}
                  key={e.key}
                />
              );
            })}
            <Route
              path={REACT_APP_AUTH_SIGNIN}
              element={<SignIn />}
              key="page_signin"
            ></Route>
            <Route
              path={REACT_APP_AUTH_SIGNUP}
              element={<SignUp />}
              key="page_signup"
            ></Route>
            <Route
              path={REACT_APP_AUTH_ACTION}
              element={<Recovery />}
              key="page_recovery"
            ></Route>
            <Route path="*" element={<NoMatchRoute />} key="page_notfound" />
          </Route>
        </Routes>
      )}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomBar />
      </Paper>
    </div>
  );
}
