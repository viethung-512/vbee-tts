import React from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';

import useModal from 'hooks/useModal';
import Button from 'app/layout/commons/form/Button';

interface Props {
  uid?: number;
  finishRecordLoading: boolean;
  completed: boolean;
  handleFinishRecord: () => void;
}

const BroadcasterSentenceTopActions: React.FC<Props> = ({
  uid,
  finishRecordLoading,
  completed,
  handleFinishRecord,
}) => {
  const { openModal } = useModal();
  const { t }: { t: any } = useTranslation();

  return (
    <Grid container alignItems='center' justify='space-between'>
      <Grid item>
        <Button
          content={
            completed
              ? t('ACTIONS_FINISH_RECORD_UNDO')
              : t('ACTIONS_FINISH_RECORD')
          }
          loading={finishRecordLoading}
          onClick={handleFinishRecord}
          variant={completed ? 'primary' : 'success'}
        />
      </Grid>
      <Grid item>
        <Button
          content={t('ACTIONS_SUBMIT_ERROR')}
          onClick={() => {
            openModal('SubmitErrorBroadcasterSentenceModal', { uid });
          }}
          variant='error'
        />
      </Grid>
    </Grid>
  );
};

export default BroadcasterSentenceTopActions;
