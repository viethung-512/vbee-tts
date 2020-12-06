import { useTranslation } from 'react-i18next';

import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import teal from '@material-ui/core/colors/teal';

// TODO: need to update
function useRenderFields({ allStatus }: any) {
  const { t } = useTranslation();

  // TODO: need to update
  const getStatus = (statusCode: any) => {
    const status = {
      name: '',
      color: '',
    };

    const {
      STATUS_INITIAL,
      STATUS_ASSIGNED,
      STATUS_ERROR,
      STATUS_SUBMITTED,
      STATUS_APPROVED,
    } = allStatus;

    switch (statusCode) {
      case STATUS_INITIAL:
        status.name = t('STATUS_INITIAL');
        status.color = blue[500];
        break;
      case STATUS_ASSIGNED:
        status.name = t('STATUS_ASSIGNED');
        status.color = orange[500];
        break;
      case STATUS_ERROR:
        status.name = t('STATUS_ERROR');
        status.color = red[500];
        break;
      case STATUS_SUBMITTED:
        status.name = t('STATUS_SUBMITTED');
        status.color = green[500];
        break;
      case STATUS_APPROVED:
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
