import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Book } from "./types";

interface BorrowDialogProps {
  book: Book;
  open: boolean;
  onDialogAccepted?: { (): void };
  onDialogDeclined?: { (): void };
}

const BorrowDialog: React.FC<BorrowDialogProps> = ({
  book,
  open,
  onDialogAccepted,
  onDialogDeclined,
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Borrow {book.title}?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Great choice! Just to let you know, you will need to give this book
          back at some point. Are you okay with that?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogDeclined}>No thanks</Button>
        <Button onClick={onDialogAccepted} color="primary" autoFocus>
          Borrow Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BorrowDialog;
