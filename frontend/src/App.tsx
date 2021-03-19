import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import BookIcon from "@material-ui/icons/Book";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BookPage from "./BookPage";
import Library from "./Library";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#202CE0",
    },
    secondary: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: ["Lato", "Roboto", "Arial", "sans-serif"].join(","),
  },
});

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  loginIcon: {
    color: "#fff",
  },
  title: {
    fontFamily: "Lato",
    flexGrow: 1,
  },
  subtleLink: {
    color: "inherit",
    textDecoration: "none",
  },
}));

export const UserContext = React.createContext("");

const App: React.FC = () => {
  const classes = useStyles();

  const [myAddress, setMyAddress] = useState(
    localStorage.getItem("myAddress") || ""
  );
  const [myAddressText, setMyAddressText] = React.useState(myAddress);
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);

  const handleLoginButtonClick = () => {
    setMyAddress(myAddressText);
    setLoginDialogOpen(false);
  };

  const handleLoginDialogClickClose = () => {
    setLoginDialogOpen(false);
    setMyAddressText(myAddress);
  };

  useEffect(() => {
    localStorage.setItem("myAddress", myAddress);
  }, [myAddress]);

  return (
    <Router>
      <React.Fragment>
        <UserContext.Provider value={myAddress}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky">
              <Toolbar>
                <BookIcon className={classes.icon} />
                <Typography
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}
                >
                  <Link to="/" className={classes.subtleLink}>
                    BOOKCHAIN
                  </Link>
                </Typography>
                <IconButton
                  onClick={() => {
                    setLoginDialogOpen(true);
                  }}
                  aria-label="login"
                  className={classes.loginIcon}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Dialog
                  open={loginDialogOpen}
                  onClose={handleLoginDialogClickClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To subscribe to this website, please enter your email
                      address here. We will send updates occasionally.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="myAddress"
                      label="Wallet address"
                      fullWidth
                      value={myAddressText}
                      onChange={(event) => {
                        setMyAddressText(event.target.value.toLowerCase());
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleLoginButtonClick} color="primary">
                      Login
                    </Button>
                  </DialogActions>
                </Dialog>
              </Toolbar>
            </AppBar>
            <Switch>
              <Route
                path="/books/:bookId"
                render={(props) => {
                  return <BookPage {...props}></BookPage>;
                }}
              />
              <Route path="/">
                <Library />
              </Route>
            </Switch>
          </ThemeProvider>
        </UserContext.Provider>
      </React.Fragment>
    </Router>
  );
};

export default App;
