import { useTranslation } from 'react-i18next';

import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import teal from '@material-ui/core/colors/teal';
import { SentenceStatus } from '@tts-dev/common';

function useRenderFields() {
  const { t }: { t: any } = useTranslation();

  const getStatus = (statusCode: SentenceStatus) => {
    const status = {
      name: '',
      color: '',
    };

    switch (statusCode) {
      case SentenceStatus.INITIAL:
        status.name = t('STATUS_INITIAL');
        status.color = blue[500];
        break;
      case SentenceStatus.ASSIGNED:
        status.name = t('STATUS_ASSIGNED');
        status.color = orange[500];
        break;
      case SentenceStatus.ERROR:
        status.name = t('STATUS_ERROR');
        status.color = red[500];
        break;
      case SentenceStatus.SUBMITTED:
        status.name = t('STATUS_SUBMITTED');
        status.color = green[500];
        break;
      case SentenceStatus.APPROVED:
      default:
        status.name = t('STATUS_APPROVED');
        status.color = teal[500];
        break;
    }

    return status;
  };

  return { getStatus };
}

export default useRenderFields;
