import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import EditIcon from '@material-ui/icons/Edit';

import DefaultAvatar from 'app/layout/commons/DefaultAvatar';
import useModal from 'hooks/useModal';

interface Props {
  authPhotoURL?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  avatar: {
    width: 100,
    height: 100,
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.divider}`,
  },
  avatarWrapper: {
    position: 'relative',
    padding: theme.spacing(1),
  },
  editButton: {
    position: 'absolute',
    bottom: -theme.spacing(0.5),
    right: -theme.spacing(0.5),
  },
  input: {
    display: 'none',
  },
}));

const UserAvatarUpload: React.FC<Props> = ({ authPhotoURL }) => {
  const classes = useStyles();
  const { openModal } = useModal();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // uploadAvatar({ variables: { image: e.target.files[0] } });
    if (e.target && e.target.files) {
      let files;
      // @ts-ignore
      if (e.dataTransfer) {
        // @ts-ignore
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = () => {
        openModal('CropperAvatarModal', {
          image: reader.result,
        });
      };
      e.target.value = '';
    }
  };

  return (
    <Grid
      container
      direction='column'
      justify='flex-start'
      alignItems='center'
      className={classes.root}
    >
      <Grid item className={classes.avatarWrapper}>
        <Avatar alt='avatar' src={authPhotoURL} className={classes.avatar}>
          <DefaultAvatar />
        </Avatar>
        <input
          accept='image/*'
          className={classes.input}
          id='upload-avatar'
          type='file'
          onChange={onChange}
        />
        <label htmlFor='upload-avatar'>
          <Tooltip title='Upload Avatar'>
            <IconButton
              color='secondary'
              aria-label='upload picture'
              component='span'
              className={classes.editButton}
            >
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </label>
      </Grid>
    </Grid>
  );
};

export default UserAvatarUpload;
