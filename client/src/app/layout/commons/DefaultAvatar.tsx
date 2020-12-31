import React from 'react';
import { useTranslation } from 'react-i18next';

const DefaultAvatar: React.FC = props => {
  const { t }: { t: any } = useTranslation();

  return (
    <img
      alt={t('PLACEHOLDER_DEFAULT_AVATAR')}
      src='/user.png'
      style={{ width: '100%' }}
    />
  );
};

export default DefaultAvatar;
