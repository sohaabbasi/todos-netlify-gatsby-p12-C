import React from "react"

import gql from "graphql-tag"
import { useQuery, useMutation } from "@apollo/client"

import List from '@material-ui/core/List';
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
// import NavBar from './Navbar';
import './style.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// Importing of Icons

import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd"
// import EventNoteIcon from '@material-ui/icons/EventNote';
import AssignmentIcon from '@material-ui/icons/Assignment';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}






const GET_TODOS = gql`
  {
    items {
      id
      item
    }
  }
`

const ADD_TODO = gql`
  mutation AddTask($message: String!) {
    addTask(message: $message)
  }
`

const DELETE_TODO = gql`
  mutation RemoveTask($id: String!) {
    removeTask(id: $id)
  }
`

export default function Home() {
  const { loading, error, data } = useQuery(GET_TODOS)
  const [InputTodo, setInputTodo] = React.useState("")

  const [addTask] = useMutation(ADD_TODO)
  const [removeTask] = useMutation(DELETE_TODO)

  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmitForm = event => {
    // Prevent Form Refresh Onsubmit
    event.preventDefault()
    handleClick()

    // Adding Task
    addTask({
      variables: {
        message: InputTodo,
      },
      refetchQueries: [{ query: GET_TODOS }],
    })

  }
  const handleDelete = id => {
    removeTask({
      variables: { id: id },
      refetchQueries: [{ query: GET_TODOS }],
    })
  }

  if (loading) {
    return (
    <CircularProgress className="loader" variant="static"  />
    )
  }

  if (error) {
    console.log(error)
  }
  return (
    <Paper className="paper" elevation={3} style={{ width: "500px", margin: " 70px auto", minHeight: "200px" }}>


      <h1 style={{ textAlign: "center", fontSize: 42, padding: "15px 15px 0px 15px" }}> Todo Application </h1>
      <form
        onSubmit={e => handleSubmitForm(e)}
        style={{ margin: "20px 10px" }}>

        <TextField
          style={{ margin: "10px 0px" }}
          id="standard-basic"
          label="Enter Todo Item"
          type="text"
          value={InputTodo}
          required
          fullWidth
          onChange={e => setInputTodo(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          startIcon={<PlaylistAddIcon />}
        >
          Add New Todo
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Todo Item has been added successfully
        </Alert>
      </Snackbar>

      <div>
        <List>
          {data?.items.map(curr => {

            return (
              <ListItem
                key={curr.id}
              >
                <ListItemAvatar>
                  <Avatar style={{ color: "white", backgroundColor: "green[500]" }}>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={curr.item}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(curr.id)}
                  >
                    <Avatar style={{ color: "white", backgroundColor: "red[500]" }}>
                      <DeleteIcon />
                    </Avatar>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </div>
    </Paper>
  )
}
