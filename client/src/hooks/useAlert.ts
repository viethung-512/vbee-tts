import { useDispatch } from 'react-redux';
import {
  success,
  error,
  warning,
  info,
  clear,
} from 'app/cores/alert/alertSlice';

const useAlert = () => {
  const dispatch = useDispatch();

  const alertSuccess = (message: string) => {
    dispatch(success(message));
  };
  const alertError = (message: string) => {
    dispatch(error(message));
  };
  const alertWarning = (message: string) => {
    dispatch(warning(message));
  };
  const alertInfo = (message: string) => {
    dispatch(info(message));
  };
  const alertClear = () => {
    dispatch(clear());
  };

  return {
    alertSuccess,
    alertError,
    alertWarning,
    alertInfo,
    alertClear,
  };
};

export default useAlert;
