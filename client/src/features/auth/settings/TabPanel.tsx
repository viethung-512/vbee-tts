import React from 'react';

interface Props {
  index: number;
  value: number;
}

const TabPanel: React.FC<Props> = ({ index, value, children, ...other }) => {
  return (
    <div
      role='tabpanel'
      style={{ width: '100%' }}
      hidden={value !== index}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default TabPanel;
