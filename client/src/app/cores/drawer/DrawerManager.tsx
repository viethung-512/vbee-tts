import React from 'react';

// import EditSentenceHistoryDrawer from 'features/sentence/sentence-details/EditSentenceHistory';
// import CheckingProgressDrawer from 'features/progress/checking-progress-sidebar/CheckingProgressDrawer';
import SidebarMenuDrawer from 'app/layout/sidebar/SidebarMenuDrawer';

const DrawerManager: React.FC = props => {
  return (
    <span>
      {/* <EditSentenceHistoryDrawer />
      <CheckingProgressDrawer /> */}
      <SidebarMenuDrawer />
    </span>
  );
};

export default DrawerManager;
