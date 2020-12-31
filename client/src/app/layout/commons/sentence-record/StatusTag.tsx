import React from 'react';
import { SentenceStatus } from '@tts-dev/common';

import Chip from '@material-ui/core/Chip';
import useRenderFields from 'hooks/useRenderFields';

interface Props {
  statusCode: SentenceStatus;
}

const StatusTag: React.FC<Props> = ({ statusCode }) => {
  const { getStatus } = useRenderFields();

  const { name, color } = getStatus(statusCode);

  return (
    <Chip
      size='small'
      variant='outlined'
      label={name}
      style={{
        color: color,
        borderColor: color,
        borderRadius: 8,
        width: '100%',
      }}
    />
  );
};

export default StatusTag;
