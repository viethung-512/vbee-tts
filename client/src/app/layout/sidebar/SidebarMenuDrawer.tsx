import React from 'react';

import DrawerWrapper from 'app/cores/drawer/DrawerWrapper';
import SidebarMain from './SidebarMain';

const SidebarMenuDrawer: React.FC = () => {
  return (
    <DrawerWrapper drawerType='SidebarMenuDrawer'>
      <SidebarMain isInDrawer={true} />
    </DrawerWrapper>
  );
};

export default SidebarMenuDrawer;
