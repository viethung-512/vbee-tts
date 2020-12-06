import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.palette.divider,
    borderTopStyle: 'solid',
    padding: theme.spacing(1),
  },
}));

const Footer: React.FC = props => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <footer className={classes.footer}>
      <Grid container alignItems='center' justify='center'>
        <Typography variant='caption' align='center'>
          {t('FOOTER_MAIN')}
        </Typography>
      </Grid>
    </footer>
  );
};

export default Footer;
