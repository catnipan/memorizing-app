import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { useSnackbar } from 'notistack';
import { Box, Button, TextField, Paper, Icon, Typography, Tooltip, Fab, Alert, Snackbar, styles } from '../ui';
import { SendIcon } from '../icon';
import { CreateMemoMutation } from '../query';
import updateMemo from './update-memo';
import { AddIcon } from '../icon';

const useStyle = styles.makeStyles(theme => ({
  input: {
    width: '100%',
    margin: '0.5em 0 1em',
  },
  fab: {
    marginTop: '2em',
    marginBottom: '1em',
  },
  wrapper: {
    padding: '2em',
    flexGrow: 1,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}));

export default function NewMemo() {
  const classes = useStyle();

  const [visible, updateVisible] = useState(false);
  const [title, updateTitle] = useState('');
  const [content, updateContent] = useState('');
  const [snackBar, updateSnackBar] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [create, { data, error, loading }] = useMutation(CreateMemoMutation, {
    onCompleted: ({ CreateMemo: newMemo }) => {
      updateMemo(memos => [...memos, newMemo]);
      updateVisible(false);
      updateTitle('');
      updateContent('');
      enqueueSnackbar('Memo created successfully!', { variant: 'success' });
    }
  });

  const onCreate = () => create({
    variables: {
      title,
      content,
    }
  });

  const disabled = loading || title.trim().length == 0 || content.trim().length == 0;

  return (
    <Box className={classes.container}>
      <Tooltip title="Add" aria-label="add">
        <Fab
          color="secondary"
          className={classes.fab}
          onClick={() => updateVisible(!visible)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      {visible && (
        <Paper className={classes.wrapper}>
          <Box>
            <TextField
              className={classes.input}
              label="Title, Keywords, etc.."
              value={title}
              onChange={e => updateTitle(e.target.value)}
              disabled={loading}
            />
          </Box>
          <Box>
            <TextField
              label="Add some more details here..."
              className={classes.input}
              multiline
              rows={5}
              variant="outlined"
              value={content}
              disabled={loading}
              onChange={e => updateContent(e.target.value)}
            />
          </Box>
          <Box className={classes.btnContainer}>
            <Button
              variant="contained"
              color="primary"
              disabled={disabled}
              startIcon={<AddIcon />}
              onClick={onCreate}
            >
              Create a new memo
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}