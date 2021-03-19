import React, { useEffect, useState, useContext, useCallback } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Book, Record } from "./types";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { UserContext } from "./App";
import RecordTable from "./RecordTable";
import BorrowDialog from "./BorrowDialog";
import ReturnDialog from "./ReturnDialog";
import WaitDialog from "./WaitDialog";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface BookPageProps {
  bookId: string;
}

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: theme.spacing(2),
  },
  container: {
    paddingTop: theme.spacing(3),
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
  pleaseLogIn: {
    marginTop: theme.spacing(1),
  },
}));

const BookPage: React.FC<RouteComponentProps<BookPageProps>> = (props) => {
  const classes = useStyles();
  const myAddress = useContext(UserContext);
  const bookId = props.match.params.bookId;
  const [book, setBook] = useState<Book | undefined>();
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [waitDialogOpen, setWaitDialogOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const reloadDelay = 1000; // ms

  const sendRecordRequest = (status: string) => {
    return fetch(
      `${process.env.REACT_APP_BACKEND_URL}/books/${bookId}/records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: myAddress,
          status: status,
        }),
      }
    );
  };

  const borrowBook = async () => {
    setBorrowDialogOpen(false);
    setWaitDialogOpen(true);
    const res = await sendRecordRequest("borrowed");
    if (res.status === 200) {
      setTimeout(() => {
        setWaitDialogOpen(false);
        setSuccessSnackbarOpen(true);
        fetchBook();
      }, reloadDelay);
    } else {
      setWaitDialogOpen(false);
      setErrorSnackbarOpen(true);
    }
  };

  const returnBook = async () => {
    setReturnDialogOpen(false);
    setWaitDialogOpen(true);
    const res = await sendRecordRequest("returned");
    if (res.status === 200) {
      setTimeout(() => {
        setWaitDialogOpen(false);
        setSuccessSnackbarOpen(true);
        fetchBook();
      }, reloadDelay);
    } else {
      setWaitDialogOpen(false);
      setErrorSnackbarOpen(true);
    }
  };

  const fetchBook = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/books/${bookId}`).then(
      async (res) => {
        const bookResponse = await res.json();
        console.log(bookResponse);
        setBook(bookResponse);
      }
    );
    fetch(`${process.env.REACT_APP_BACKEND_URL}/books/${bookId}/records`).then(
      async (res) => {
        const recordsResponse = await res.json();
        console.log(recordsResponse);
        recordsResponse.sort((a: Record, b: Record) => {
          return Number(a.time) < Number(b.time) ? -1 : 1;
        });
        setRecords(recordsResponse);
      }
    );
  }, [bookId]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  if (book) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Box display="flex" flexDirection="row">
          <Box className={classes.spacing}>
            <img alt="Book cover art" src={book.coverUrl} />
          </Box>
          <Box className={classes.spacing}>
            <Typography variant="h3">{book.title}</Typography>
            <Typography variant="h5">{book.author}</Typography>
            <Typography>{book.year}</Typography>
            <Typography>ISBN {book.isbn}</Typography>
            <Box className={classes.buttons}>
              {book.borrower === "" ? (
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  disabled={myAddress === ""}
                  onClick={() => {
                    setBorrowDialogOpen(true);
                  }}
                >
                  Borrow
                </Button>
              ) : book.borrower === myAddress ? (
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setReturnDialogOpen(true);
                  }}
                >
                  Return
                </Button>
              ) : (
                <Button size="small" variant="contained" disabled>
                  Unavailable
                </Button>
              )}
            </Box>
            {myAddress ? undefined : (
              <Typography className={classes.pleaseLogIn}>
                Please log in to borrow or return books
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <RecordTable records={records} />
        </Box>
        <BorrowDialog
          book={book}
          open={borrowDialogOpen}
          onDialogAccepted={borrowBook}
          onDialogDeclined={() => {
            setBorrowDialogOpen(false);
          }}
        />
        <ReturnDialog
          book={book}
          open={returnDialogOpen}
          onDialogAccepted={returnBook}
          onDialogDeclined={() => {
            setReturnDialogOpen(false);
          }}
        />
        <WaitDialog open={waitDialogOpen} />
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => {
            setSuccessSnackbarOpen(false);
          }}
        >
          <Alert severity="success">
            Your request was successfully written to the blockchain!
          </Alert>
        </Snackbar>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => {
            setErrorSnackbarOpen(false);
          }}
        >
          <Alert severity="error">
            An error occurred writing your request to the blockchain
          </Alert>
        </Snackbar>
      </Container>
    );
  } else {
    return <Box></Box>;
  }
};

export default BookPage;
