import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default function OutlinedCard() {
  const [isEditable, setIsEditable] = useState(false);
  const [name, setName] = useState("");
  const classes = useStyles();

  const handleEdit = () => {
    console.log("I am here");
    setIsEditable(!isEditable);
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Word of the Day
        </Typography>
        <TextField
          id="standard-basic"
          label="Name:"
          disabled={!isEditable}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setIsEditable(false)}
        />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}