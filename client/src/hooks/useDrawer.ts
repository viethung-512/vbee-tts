import { useDispatch, useSelector } from 'react-redux';
import {
  openDrawer as open,
  closeDrawer as close,
} from 'app/cores/drawer/drawerSlice';
import { AppState, DrawerState } from 'app/redux/rootReducer';

const useDrawer = () => {
  const dispatch = useDispatch();
  const { open: status, drawerType } = useSelector<AppState, DrawerState>(
    state => state.drawer
  );

  const openDrawer = (drawerType: string, drawerProps?: any) => {
    dispatch(open({ drawerType, drawerProps }));
  };

  const closeDrawer = () => dispatch(close());

  const getDrawerStatus = (type: string) =>
    type === drawerType ? status : false;

  return {
    openDrawer,
    closeDrawer,
    getDrawerStatus,
  };
};

export default useDrawer;
