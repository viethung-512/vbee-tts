import { cloneElement } from 'react';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

const ElevationScroll: React.FC<Props> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

export default ElevationScroll;
