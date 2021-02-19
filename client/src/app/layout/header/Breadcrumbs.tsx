import React, { useEffect } from 'react';
import {
  Link as RouterLink,
  MemoryRouter,
  Route,
  useHistory,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Link, { LinkProps } from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs';

import { breadcrumbChange } from 'app/cores/ui/uiSlice';
import { AppState, UIState } from 'app/redux/rootReducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 360,
    },
    lists: {
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing(1),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

const Breadcrumbs = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { breadcrumbs } = useSelector<AppState, UIState>(state => state.ui);

  useEffect(() => {
    const pathname = history.location.pathname;

    dispatch(breadcrumbChange(pathname));
  }, [history.location.pathname, dispatch]);

  return (
    <MemoryRouter initialEntries={['/inbox']} initialIndex={0}>
      <div className={classes.root}>
        <Route>
          {({ location }) => {
            return (
              <MUIBreadcrumbs>
                {breadcrumbs.map(b => {
                  return (
                    <Grid container alignItems='center'>
                      {b.icon && (
                        <Icon
                          fontSize='small'
                          style={{ marginRight: theme.spacing(1) }}
                        >
                          {b.icon}
                        </Icon>
                      )}
                      <LinkRouter color='inherit' to={b.link}>
                        {t(b.name)}
                      </LinkRouter>
                    </Grid>
                  );
                })}
              </MUIBreadcrumbs>
            );
          }}
        </Route>
      </div>
    </MemoryRouter>
  );
};

export default Breadcrumbs;
