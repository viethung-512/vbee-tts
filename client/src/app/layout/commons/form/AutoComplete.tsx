import React, { useState, useEffect } from 'react';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';

import { Controller, Control } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Spinner from '../async/Spinner';

interface Props {
  name: string;
  control: Control;
  label: string;
  options: any[];
  labelField: string;
  loading: boolean;
  isError: boolean;
  errorMessage?: string;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  variant?: BaseTextFieldProps['variant'];
  size?: BaseTextFieldProps['size'];
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

const AutoComplete: React.FC<Props> = ({
  name,
  control,
  label,
  options,
  labelField,
  loading,
  isError,
  errorMessage,
  variant = 'outlined',
  size = 'small',
  setOptions,
  setTerm,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open, setOptions]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ onChange, ...rest }) => {
        return (
          <Autocomplete
            size={size}
            fullWidth
            disableClearable
            options={options}
            loading={loading}
            open={open}
            getOptionLabel={option => {
              if (option && option[labelField]) {
                return option[labelField];
              }

              return '';
            }}
            getOptionSelected={(option, value) => option.iso === value.iso}
            renderOption={option => option[labelField]}
            onInputChange={(e, value) => setTerm(value)}
            onChange={(e, data) => onChange(data)}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderInput={params => (
              <TextField
                error={isError}
                helperText={errorMessage}
                label={label}
                variant={variant}
                className={classes.inputRoot}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <Spinner /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            {...rest}
          />
        );
      }}
    />
  );
};

export default AutoComplete;
