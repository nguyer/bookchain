import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

interface WaitDialogProps {
  open: boolean;
}

const WaitDialog: React.FC<WaitDialogProps> = ({ open }) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Please wait...</DialogTitle>
      <LinearProgress />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Your request is now being written to the blockchain record...
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default WaitDialog;
