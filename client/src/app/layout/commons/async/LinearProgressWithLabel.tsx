import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress';

interface Props extends LinearProgressProps {
  value: number;
}

const LinearProgressWithLabel: React.FC<Props> = ({ value = 0, ...rest }) => {
  return (
    <Box display='flex' alignItems='center' width='100%'>
      <Box width='100%' mr={1}>
        <LinearProgress
          color='primary'
          variant='determinate'
          value={value}
          {...rest}
        />
      </Box>
      <Box minWidth={35}>
        <Typography
          variant='body2'
          color='textSecondary'
        >{`${value}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
