import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { BaseCSSProperties } from '@material-ui/core/styles/withStyles';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface MyCssProperties extends BaseCSSProperties {
    [key: string]: any;
  }

  interface Theme {
    custom: {
      successButton: {
        contained: MyCssProperties;
        outlined: MyCssProperties;
      };
      errorButton: {
        contained: MyCssProperties;
        outlined: MyCssProperties;
      };
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom?: {
      successButton?: {
        contained?: MyCssProperties;
        outlined?: MyCssProperties;
      };
      errorButton?: {
        contained?: MyCssProperties;
        outlined?: MyCssProperties;
      };
    };
  }
}
