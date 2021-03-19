import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "./App";
import { Book } from "./types";

const useStyles = makeStyles((theme) => ({
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
  cardStatus: {
    marginTop: theme.spacing(2),
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
          <Box className={classes.cardStatus}>
            {book.borrower && book.borrower !== myAddress ? (
              <Chip label="Unavailable" disabled variant="outlined" />
            ) : undefined}
            {book.borrower && book.borrower === myAddress ? (
              <Chip label="Borrowed" color="primary" variant="outlined" />
            ) : undefined}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookCard;
