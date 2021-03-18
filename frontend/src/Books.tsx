import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import BookIcon from "@material-ui/icons/Book";

import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Book } from "./types";
import BookCard from "./BookCard";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BookPage from "./BookPage";
import { inherits } from "node:util";

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
  overrides: {
    MuiBackdrop: {
      root: {
        backgroundColor: "rgba(0,0,0,0.1)",
      },
    },
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      Bookchain, Inc.
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  loginIcon: {
    color: "#fff",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "150%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  title: {
    fontFamily: "Lato",
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  libraryTitle: {
    flexGrow: 1,
  },
  libraryHeader: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  subtleLink: {
    color: "inherit",
    textDecoration: "none",
  },
}));

export const UserContext = React.createContext("");

const Books: React.FC = () => {
  const classes = useStyles();

  const [books, setBooks] = useState<Book[]>([]);
  const [myAddress, setMyAddress] = useState("");
  const [borrowDialogOpen, setBorrowDialogOpen] = React.useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("bookId");
  const [selectedBook, setSelectedBook] = React.useState<Book | undefined>(
    undefined
  );
  const [bookDialogOpen, setBookDialogOpen] = React.useState(false);

  const handleLoginDialogClickOpen = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginDialogClickClose = () => {
    setLoginDialogOpen(false);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/books`).then(async (res) => {
      const booksResponse = await res.json();
      console.log(booksResponse);
      booksResponse.sort((a: Book, b: Book) => {
        return Number(a.bookId) < Number(b.bookId) ? -1 : 1;
      });

      setBooks(booksResponse);
    });
  }, []);

  useEffect(() => {
    if (selectedBook) {
      setBookDialogOpen(true);
    }
  }, [selectedBook]);

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
                  onClick={handleLoginDialogClickOpen}
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
                      value={myAddress}
                      onChange={(event) => {
                        setMyAddress(event.target.value);
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleLoginDialogClickClose}
                      color="primary"
                    >
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
                <main>
                  <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                      <Grid container className={classes.libraryHeader}>
                        <Typography
                          variant="h6"
                          className={classes.libraryTitle}
                        >
                          Library
                        </Typography>
                        <FormGroup row>
                          <FormControlLabel
                            control={<Checkbox name="checkedC" />}
                            label="Show only borrowed by me"
                          />
                          <FormControl
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel htmlFor="outlined-age-native-simple">
                              Sort by
                            </InputLabel>
                            <Select
                              native
                              label="Sort by"
                              inputProps={{
                                name: "age",
                                id: "outlined-age-native-simple",
                              }}
                              value={"bookId"}
                            >
                              <option value={"bookId"}>Book ID</option>
                              <option value={"title"}>Title</option>
                              <option value={"author"}>Author</option>
                              <option value={"availability"}>
                                Availability
                              </option>
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </Grid>
                      {books.map((book) => (
                        <Grid
                          item
                          key={book.bookId}
                          xs={4}
                          sm={3}
                          md={3}
                          lg={3}
                        >
                          <Link
                            to={`/books/${book.bookId}`}
                            className={classes.subtleLink}
                          >
                            <BookCard book={book}></BookCard>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </main>
              </Route>
            </Switch>
          </ThemeProvider>
        </UserContext.Provider>
      </React.Fragment>
    </Router>
  );
};

export default Books;
