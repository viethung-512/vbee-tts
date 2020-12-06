import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';
import { DateTimePicker } from '@material-ui/pickers';
import { TextFieldProps } from '@material-ui/core/TextField';

interface Props {
  label: string;
  name: string;
  control: Control;
  error: Record<string, string>;
  variant: TextFieldProps['variant'];
  fullWidth?: boolean;
}

const useStyles = makeStyles(theme => ({
  inputRoot: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const DateInput: React.FC<Props> = ({
  label,
  name,
  control,
  error,
  variant = 'outlined',
  fullWidth = true,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Controller
      as={
        // @ts-ignore
        <DateTimePicker
          margin='normal'
          label={label}
          fullWidth={fullWidth}
          inputVariant={variant}
          autoComplete='off'
          className={classes.inputRoot}
          style={{ marginTop: 0 }}
          error={Boolean(error)}
          helperText={error?.message}
          format='MMMM, dd yyyy'
          {...rest}
        />
      }
      control={control}
      name={name}
    />
  );
};

export default DateInput;
