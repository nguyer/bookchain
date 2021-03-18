import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import BookIcon from "@material-ui/icons/Book";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
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

interface Book {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string;
  year: string;
  isbn: string;
  borrower: string;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Bookchain, Inc.
      </Link>{" "}
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
}));

const Books: React.FC = () => {
  const classes = useStyles();

  const [books, setBooks] = useState<Book[]>([]);
  const [myAddress, setMyAddress] = useState<String>("");
  const [borrowDialogOpen, setBorrowDialogOpen] = React.useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("bookId");

  const handleBorrowDialogClickOpen = () => {
    setBorrowDialogOpen(true);
  };

  const handleBorrowDialogClickClose = () => {
    setBorrowDialogOpen(false);
  };

  const handleReturnDialogClickOpen = () => {
    setReturnDialogOpen(true);
  };

  const handleReturnDialogClickClose = () => {
    setReturnDialogOpen(false);
  };

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

  return (
    <React.Fragment>
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
              BOOKCHAIN
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
                  To subscribe to this website, please enter your email address
                  here. We will send updates occasionally.
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
                <Button onClick={handleLoginDialogClickClose} color="primary">
                  Login
                </Button>
              </DialogActions>
            </Dialog>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container spacing={4}>
              <Grid container className={classes.libraryHeader}>
                <Typography variant="h6" className={classes.libraryTitle}>
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
                      <option value={"availability"}>Availability</option>
                    </Select>
                  </FormControl>
                </FormGroup>
              </Grid>
              {books.map((book) => (
                <Grid item key={book.bookId} xs={4} sm={3} md={3} lg={3}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={book.coverUrl}
                      title="Cover art"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {book.title}
                      </Typography>
                      <Typography>{book.author}</Typography>
                    </CardContent>
                    {myAddress !== "" ? (
                      <CardActions>
                        {book.borrower == "" ? (
                          <Button
                            size="small"
                            color="primary"
                            onClick={handleBorrowDialogClickOpen}
                          >
                            Borrow
                          </Button>
                        ) : book.borrower == myAddress ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={handleReturnDialogClickOpen}
                          >
                            Return
                          </Button>
                        ) : (
                          <Button size="small" variant="contained" disabled>
                            Unavailable
                          </Button>
                        )}

                        {/* <Button size="small" color="primary">
                        View
                      </Button>
                      <Button size="small" color="primary">
                        Edit
                      </Button> */}
                      </CardActions>
                    ) : undefined}
                  </Card>
                  <Dialog
                    open={returnDialogOpen}
                    onClose={handleReturnDialogClickClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      Return {book.title}?
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        This means you actually need to give the book back to
                        its rightful owner. Are you ready to do that?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleReturnDialogClickClose}>
                        Not yet
                      </Button>
                      <Button
                        // TODO: change this to actually return the book
                        onClick={handleReturnDialogClickClose}
                        color="secondary"
                        autoFocus
                      >
                        Return Book
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={borrowDialogOpen}
                    onClose={handleBorrowDialogClickClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      Borrow {book.title}?
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Great choice! Just to let you know, you will need to
                        give this book back at some point. Are you okay with
                        that?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleBorrowDialogClickClose}>
                        No thanks
                      </Button>
                      <Button
                        // TODO: change this to actually return the book
                        onClick={handleBorrowDialogClickClose}
                        color="primary"
                        autoFocus
                      >
                        Borrow Book
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          {/* <Typography variant="h6" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" component="p">
            Something here to give the footer a purpose!
          </Typography> */}
          <Copyright />
        </footer>
        {/* End footer */}
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Books;
