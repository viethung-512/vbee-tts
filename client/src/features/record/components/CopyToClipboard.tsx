import React, { useState } from 'react';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import copy from 'clipboard-copy';

interface ChildProps {
  copy: (content: any) => void;
}

interface Props {
  TooltipProps?: Partial<TooltipProps>;
  children: (props: ChildProps) => React.ReactElement<any>;
}

const CopyToClipboard: React.FC<Props> = ({ TooltipProps, children }) => {
  const [state, setState] = useState({ showTooltip: false });

  const onCopy = (content: any) => {
    copy(content);
    setState({ showTooltip: true });
  };

  const handleOnTooltipClose = () => {
    setState({ showTooltip: false });
  };

  return (
    <Tooltip
      open={state.showTooltip}
      title={'Copied to clipboard!'}
      leaveDelay={1500}
      onClose={handleOnTooltipClose}
      {...(TooltipProps || {})}
    >
      {children({ copy: onCopy }) as React.ReactElement<any>}
    </Tooltip>
  );
};

export default CopyToClipboard;
