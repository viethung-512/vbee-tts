import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';
import TextField, {
  OutlinedTextFieldProps,
  TextFieldProps,
} from '@material-ui/core/TextField';

type Props = {
  control: Control;
  name: string;
  label: string;
  fullWidth?: boolean;
  variant?: OutlinedTextFieldProps['variant'];
  isError: boolean;
  errorMessage?: string;
};

const useStyles = makeStyles(theme => ({
  inputRoot: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const Input: React.FC<Props & TextFieldProps> = ({
  control,
  name,
  label,
  fullWidth = true,
  variant = 'outlined',
  isError,
  errorMessage,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Controller
      as={
        <TextField
          label={label}
          fullWidth={fullWidth}
          variant={variant}
          autoComplete='off'
          className={classes.inputRoot}
          error={isError}
          helperText={errorMessage}
          {...rest}
        />
      }
      control={control}
      name={name}
    />
  );
};

export default Input;
