import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState, AuthState } from 'app/redux/rootReducer';
import { AppRoute } from 'app/configs/routes';

const DynamicRoute: React.FC<AppRoute> = ({
  component,
  private: isPrivate,
  resources,
  hasPermission,
  ...rest
}) => {
  const { authenticated, loading, user } = useSelector<AppState, AuthState>(
    state => state.auth
  );

  const Component: React.ComponentType<any> = component;

  return (
    <Route
      {...rest}
      render={props => {
        if (isPrivate) {
          if (!loading && !authenticated && user === null) {
            return <Redirect to='/login' />;
          }

          const permission =
            resources.length === 0
              ? hasPermission
              : user?.role.resources.some(rs =>
                  resources.some(resource => {
                    return (
                      resource.name === rs.name &&
                      resource.actions.some(act => rs.actions.includes(act))
                    );
                  })
                );

          if (user && !permission) {
            return <Redirect to='/unauthorized' />;
          }

          return <Component {...props} />;
        }

        if (!loading && authenticated) {
          return <Redirect to='/dashboard' />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default DynamicRoute;
