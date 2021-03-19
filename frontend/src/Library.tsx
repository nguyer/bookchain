import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import { Book } from "./types";
import BookCard from "./BookCard";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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

const Library: React.FC = () => {
  const classes = useStyles();
  const [books, setBooks] = useState<Book[]>([]);

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
            <FormControl variant="outlined" className={classes.formControl}>
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
            <Link to={`/books/${book.bookId}`} className={classes.subtleLink}>
              <BookCard book={book}></BookCard>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Library;
