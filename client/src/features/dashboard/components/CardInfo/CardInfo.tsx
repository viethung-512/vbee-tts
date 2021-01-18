import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardInfoItem, { InfoItem } from './CardInfoItem';

const infoItems: InfoItem[] = [
  {
    total: 10,
    current: 5,
    percent: 50,
    label: 'user',
    icon: 'people',
    bgColor: '#fff',
  },
  {
    total: 10,
    current: 5,
    percent: 50,
    label: 'user',
    icon: 'people',
    bgColor: '#fff',
  },
  {
    total: 10,
    current: 5,
    percent: 50,
    label: 'user',
    icon: 'people',
    bgColor: '#fff',
  },
  {
    total: 10,
    current: 5,
    percent: 50,
    label: 'user',
    icon: 'people',
    bgColor: '#fff',
  },
];

const CardInfo = () => {
  return (
    <Grid container spacing={2}>
      {infoItems.map((item, index) => (
        <Grid item xs key={`${index}_${item.label}`}>
          <CardInfoItem card={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardInfo;
