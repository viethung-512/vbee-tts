import React, { Fragment } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@material-ui/core/styles';

import AppLayout from 'app/layout/AppLayout';
import LoadingContainer from 'app/layout/commons/async/LoadingContainer';
import DynamicRoute from 'app/layout/commons/DynamicRoute';

import LoginPage from 'pages/auth/Login';
import useRoute from 'hooks/useRoute';

interface Props {
  loading: boolean;
}

const AppRoutes: React.FC<Props> = ({ loading }) => {
  const theme = useTheme();
  const location = useLocation();
  const { t }: { t: any } = useTranslation();
  const { routes } = useRoute();

  const secondaryColor = theme.palette.secondary.main;

  const getPageTitle = (pathname: string): string => {
    const routeMatch = routes.find(r => {
      if (r.path) {
        return pathname.split('/')[1] === r.path.split('/')[1];
      }

      return false;
    });

    if (!routeMatch) {
      return 'Some page title';
    }

    return routeMatch.pageTitle!;
  };

  const title = t(getPageTitle(location.pathname));

  return (
    <Switch>
      <DynamicRoute
        exact={true}
        path='/login'
        private={false}
        component={LoginPage}
        hasPermission={true}
      />
      <Route
        render={() => {
          return (
            <Fragment>
              <LoadingContainer loading={loading} color={secondaryColor} />
              <AppLayout title={title}>
                <Switch>
                  {routes.map((route, index) => (
                    <DynamicRoute
                      key={index}
                      exact={route.exact}
                      path={route.path}
                      component={route.component}
                      private={route.private}
                      hasPermission={route.hasPermission}
                    />
                  ))}
                </Switch>
              </AppLayout>
            </Fragment>
          );
        }}
      />
    </Switch>
  );
};

export default AppRoutes;
