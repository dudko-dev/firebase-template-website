import {
  ReactElement,
  cloneElement,
  SyntheticEvent,
  useState,
  useEffect,
} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { MainRoute, SecondRoute } from "../routes";
import FirebaseAuth from "../services/FirebaseAuth";
import { useAuthState } from "react-firebase-hooks/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import "./TopBar.css";
import { UserModel } from "../models/database/User";
import { User } from "firebase/auth";

const menuItems: {
  key: string;
  path: string;
  component: ({
    authUser,
    user,
    isLoadingUser,
  }: {
    authUser: User | null | undefined;
    user: UserModel | undefined;
    isLoadingUser: boolean;
  }) => JSX.Element;
  label: string;
  secure: boolean;
}[] = [
  {
    key: "page_main",
    path: "/",
    component: ({ authUser }: { authUser: User | null | undefined }) => (
      <MainRoute authUser={authUser} />
    ),
    label: "Main Page",
    secure: false,
  },
  {
    key: "page_second",
    path: "/second",
    component: ({
      authUser,
      user,
      isLoadingUser,
    }: {
      authUser: User | null | undefined;
      user: UserModel | undefined;
      isLoadingUser: boolean;
    }) => (
      <SecondRoute
        authUser={authUser}
        user={user}
        isLoadingUser={isLoadingUser}
      />
    ),
    label: "Second Page",
    secure: true,
  },
];

interface Props {
  window?: () => Window;
  children: ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

function ScrollableTabsButtonAuto(props: { items: typeof menuItems }) {
  const { items } = props;
  const location = useLocation();
  const pathIndex = items.findIndex((e) => e.path === location.pathname);
  const { REACT_APP_404 } = process.env;

  const [pageIndex, setPageIndex] = useState(pathIndex);

  useEffect(() => {
    const i = items.findIndex((e) => e.path === location.pathname);
    if (typeof items[i]?.path === "string") {
      setPageIndex(i);
    } else {
      setPageIndex(-1);
    }
  }, [location, items]);

  const navigate = useNavigate();

  const handleChange = (event: SyntheticEvent, newPageIndex: number) => {
    if (typeof items[newPageIndex]?.path === "string")
      navigate(items[newPageIndex].path);
    else navigate(REACT_APP_404 || "/");
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Tabs
        value={pageIndex !== -1 ? pageIndex : false}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Header Menu"
      >
        {items.map((e, i) => (
          <Tab label={e.label} key={`header_menu_${i}`} />
        ))}
      </Tabs>
    </Box>
  );
}

export default function ElevateAppBar() {
  const [user] = useAuthState(FirebaseAuth);
  const navigate = useNavigate();
  const { REACT_APP_NAME, REACT_APP_404, REACT_APP_AUTH_SIGNIN } = process.env;

  return (
    <div>
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            <Box sx={{ flexGrow: 0, minWidth: "4vh" }}>
              <img
                src="/assets/images/settings_white.svg"
                className="App-logo"
                alt="logo"
              />
            </Box>
            <Typography variant="h6" component="div">
              {REACT_APP_NAME}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                minWidth: "4vmin",
                justifyContent: "flex-end",
              }}
            >
              {user ? (
                <Typography
                  sx={{ paddingRight: "1vmin" }}
                >{`${user.email}`}</Typography>
              ) : null}
            </Box>
            {
              <Box
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  display: { xs: "flex", md: "unset" },
                  minWidth: "4vmin",
                  justifyContent: { xs: "end", md: "unset" },
                }}
              >
                {user ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      localStorage.removeItem("authorized");
                      FirebaseAuth.signOut();
                      navigate("/");
                    }}
                  >
                    <LogoutIcon />
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      navigate(REACT_APP_AUTH_SIGNIN || REACT_APP_404 || "/");
                    }}
                  >
                    <LoginIcon />
                  </Button>
                )}
              </Box>
            }
          </Toolbar>
          <ScrollableTabsButtonAuto
            items={
              user?.emailVerified
                ? menuItems
                : menuItems.filter((e) => !e.secure)
            }
          />
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Toolbar />
    </div>
  );
}

export { menuItems };
