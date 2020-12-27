import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { DateTimePicker } from '@material-ui/pickers';
import { TextFieldProps } from '@material-ui/core/TextField';

interface Props {
  label: string;
  name: string;
  control: Control;
  isError: boolean;
  variant?: TextFieldProps['variant'];
  errorMessage?: string;
  fullWidth?: boolean;
  size?: TextFieldProps['size'];
}

const DateInput: React.FC<Props> = ({
  label,
  name,
  control,
  isError,
  errorMessage,
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  ...rest
}) => {
  return (
    <Controller
      render={({ onChange, value }) => (
        <DateTimePicker
          size={size}
          margin='normal'
          label={label}
          fullWidth={fullWidth}
          inputVariant={variant}
          onChange={onChange}
          value={value}
          autoComplete='off'
          style={{ marginTop: 0 }}
          error={isError}
          helperText={isError ? errorMessage : null}
          format='MMMM, dd yyyy'
          {...rest}
        />
      )}
      control={control}
      name={name}
    />
  );
};

export default DateInput;
