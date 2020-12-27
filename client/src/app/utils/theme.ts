import { createMuiTheme } from '@material-ui/core/styles';

const parentTheme = createMuiTheme({});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F2C94C',
      contrastText: '#fff',
    },
  },
  custom: {
    successButton: {
      contained: {
        backgroundColor: parentTheme.palette.success.main,
        '&:hover': {
          backgroundColor: parentTheme.palette.success.dark,
        },
        color: '#fff',
      },
      outlined: {
        color: parentTheme.palette.success.main,
        borderColor: parentTheme.palette.success.main,
        '&:hover': {
          backgroundColor: parentTheme.palette.action.hover,
          borderColor: parentTheme.palette.success.main,
        },
      },
    },
    errorButton: {
      contained: {
        backgroundColor: parentTheme.palette.error.main,
        '&:hover': {
          backgroundColor: parentTheme.palette.error.dark,
        },
        color: '#fff',
      },
      outlined: {
        color: parentTheme.palette.error.main,
        borderColor: parentTheme.palette.error.main,
        '&:hover': {
          backgroundColor: parentTheme.palette.action.hover,
          borderColor: parentTheme.palette.error.main,
        },
      },
    },
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        '&:hover fieldset': {
          borderColor: `${parentTheme.palette.primary.main} !important`,
        },
      },
    },
  },
});

export default theme;
