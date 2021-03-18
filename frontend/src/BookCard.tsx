import React, { ReactFragment, useContext } from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

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

import { makeStyles } from "@material-ui/core/styles";

import { UserContext } from "./Books";
import { ProgressPlugin } from "webpack";

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

interface BookCardProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const myAddress = useContext(UserContext);
  const classes = useStyles();

  return (
    <Box onClick={onClick}>
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
                // onClick={handleBorrowDialogClickOpen}
              >
                Borrow
              </Button>
            ) : book.borrower == myAddress ? (
              <Button
                size="small"
                variant="contained"
                color="secondary"
                // onClick={handleReturnDialogClickOpen}
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
      {/* <Dialog
        open={returnDialogOpen}
        onClose={handleReturnDialogClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Return {book.title}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This means you actually need to give the book back to its rightful
            owner. Are you ready to do that?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnDialogClickClose}>Not yet</Button>
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

      */}
    </Box>
  );
};

export default BookCard;
