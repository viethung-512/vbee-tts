import React from 'react';
import { Control, Controller } from 'react-hook-form';

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
  return (
    <Controller
      as={
        <TextField
          label={label}
          fullWidth={fullWidth}
          variant={variant}
          autoComplete='off'
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
