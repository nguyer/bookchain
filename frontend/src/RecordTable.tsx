import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Record } from "./types";

interface RecordTableProps {
  records: Record[];
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

const RecordTable: React.FC<RecordTableProps> = ({ records }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="right">Event</TableCell>
            <TableCell align="right">Borrowed/Returned by</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.time}>
              <TableCell component="th" scope="row">
                {record.time}
              </TableCell>
              <TableCell align="right">{record.event}</TableCell>
              <TableCell align="right">
                {record.borrowedBy}
                {record.returnedBy}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecordTable;
