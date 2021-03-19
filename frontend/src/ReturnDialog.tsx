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
      <DialogTitle id="alert-dialog-title">Return {book.title}?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This means you actually need to give the book back to its rightful
          owner. Are you ready to do that?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogDeclined}>No thanks</Button>
        <Button onClick={onDialogAccepted} color="secondary" autoFocus>
          Return book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BorrowDialog;
