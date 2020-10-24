import React, { Fragment, useState, useRef } from 'react';
import { useMutation } from "@apollo/client";
import { useSnackbar } from 'notistack';
import { Box, Button, TextField, Paper, Icon, Typography, Tooltip, Fab, Alert, Snackbar, styles } from '../ui';
import { SendIcon } from '../icon';
import { CreateMemoMutation } from '../query';
import updateMemo from './update-memo';
import { AddIcon } from '../icon';
import ReactQuill from 'react-quill';
import { useTransition, useSpring, animated, config } from 'react-spring';
import 'react-quill/dist/quill.snow.css';

const useStyle = styles.makeStyles(theme => ({
  wrapper: {
    maxWidth: '40em',
    margin: '0 auto',
  },
  container: {
    padding: '1em',
  },
  containerBtn: {
    cursor: 'text',
  },
  input: {
    width: '100%',
    margin: '0.5em 0 1em',
  },
  editorContainer: {
    height: '20em',
  },
  editor: {
    height: '17em',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

function Editor({ content, updateContent, height }) {
  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={updateContent}
      modules={modules}
      formats={formats}
      style={{ height }}
    />
  );
}

const ForwardRefEditor = React.forwardRef(({ content, updateContent, height }, ref) => {
  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={updateContent}
      modules={modules}
      formats={formats}
      style={{ height }}
      ref={ref}
    />
  );
});

const AnimatedEditor = animated(ForwardRefEditor);

export default function NewMemo() {
  const classes = useStyle();
  const contentEl = useRef(null);
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

  const disabled = loading || content.trim().length == 0;
  const [value, setValue] = useState('');
  const focus = () => {
    if (contentEl.current) {
      contentEl.current.focus();
    } else {
      requestAnimationFrame(focus);
    }
  }
  const open = () => {
    if (!visible) {
      updateVisible(true);
      focus();
    }
  };
  const props = useSpring({
    from: { opacity: 0, height: 0 },
    to: { opacity: visible ? 1 : 0, height: visible ? 1 : 0 },
    config: {
      tension: 220,
      friction: 12,
      clamp: true,
    },
  });
  return (
    <Box className={classes.wrapper} onClick={open}>
        <Paper className={`${classes.container} ${visible ? '' : classes.containerBtn}`}>
          <animated.div style={{
            opacity: props.opacity.interpolate(x => 1 - x),
            height: props.height.interpolate(x => `${1.5 * (1 - x)}em`)
          }}>
            <Typography variant="body1">
              Create a new Memo Card ...
            </Typography>
          </animated.div>
          <animated.div style={{
            height: props.height.interpolate(x => `${x * 20}em`),
            pointerEvents: props.opacity.interpolate(x => x == 0 ? 'none' : 'auto'),
            opacity: props.opacity,
          }}>
            <AnimatedEditor
              content={content}
              updateContent={updateContent}
              height={props.height.interpolate(x => `${x * 16.5}em`)}
              ref={contentEl}
            />
          </animated.div>
          <animated.div
            className={classes.btnContainer}
            style={{
              height: props.height.interpolate(x => `${x * 2}em`),
              opacity: props.opacity,
              pointerEvents: props.opacity.interpolate(x => x == 0 ? 'none' : 'auto'),
            }}
          >
            <Button onClick={() => updateVisible(false)}>cancel</Button>
            <Button
              variant="contained"
              color="primary"
              disabled={disabled}
              startIcon={<AddIcon />}
              onClick={onCreate}
            >
              Create a new memo
            </Button>
          </animated.div>
        </Paper>
    </Box>
  )
}