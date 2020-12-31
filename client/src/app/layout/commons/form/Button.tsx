import React from 'react';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';

import Spinner from '../async/Spinner';

interface Props {
  content: string;
  loading?: boolean;
  variant?: 'success' | 'error' | 'secondary' | 'primary' | 'default';
  type?: ButtonProps['type'];
  disabled?: ButtonProps['disabled'];
  startIcon?: ButtonProps['startIcon'];
  size?: ButtonProps['size'];
  onClick?: ButtonProps['onClick'];
  className?: ButtonProps['className'];
  style?: ButtonProps['style'];
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '10em',
    borderRadius: 0,
    textTransform: 'unset',
  },
  success: {
    ...theme.custom.successButton.contained,
  },
  error: {
    ...theme.custom.errorButton.contained,
  },
}));

const Button: React.FC<Props> = ({
  variant = 'default',
  type,
  loading = false,
  disabled = false,
  content,
  onClick,
  size = 'medium',
  startIcon,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const errorColor = theme.palette.error.main;
  const successColor = theme.palette.success.main;
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  const getColor = () => {
    let color;

    switch (variant) {
      case 'success':
        color = successColor;
        break;
      case 'error':
        color = errorColor;
        break;
      case 'secondary':
        color = secondaryColor;
        break;
      case 'primary':
      default:
        color = primaryColor;
        break;
    }

    return color;
  };

  const color: ButtonProps['color'] =
    variant === 'primary'
      ? 'primary'
      : variant === 'secondary'
      ? 'secondary'
      : 'default';

  return (
    <MUIButton
      variant='contained'
      disabled={disabled || loading}
      className={clsx(
        classes.root,
        variant === 'success'
          ? classes.success
          : variant === 'error'
          ? classes.error
          : null
      )}
      color={color}
      onClick={onClick}
      type={type}
      size={size}
      startIcon={startIcon ? startIcon : null}
      {...rest}
    >
      {loading ? <Spinner color={getColor()} /> : content}
    </MUIButton>
  );
};

export default Button;
