import React from 'react';
import { RouteComponentProps, RouteProps } from 'react-router-dom';

export interface AppRoute extends RouteProps {
  private: boolean;
  hasPermission?: boolean;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  pageTitle?: string;
  path?: string;
}
