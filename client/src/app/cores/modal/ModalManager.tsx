import React from 'react';

// import TestModal from 'features/playground/TestModal';
import CropperAvatarModal from 'features/auth/settings/account-tab/CropperAvatarModal';
// import AssignSentencesModal from 'features/sentence/manage-sentence/AssignModal';
// import AutoAssignSentencesModal from 'features/sentence/manage-sentence/AutoAssignModal';
// import SubmitErrorSentenceModal from 'features/sentence/manage-sentence/SubmitErrorSentenceModal';
// import CreateVoiceModal from 'features/voice/manage-voices/CreateVoiceModal';
// import SubmitErrorBroadcasterSentence from 'features/broadcaster/broadcaster-sentences/SubmitErrorBroadcasterSentence';
// import SubmitErrorRecordModal from 'features/record/record-details/SubmitErrorRecord';
// import AutoAssignRecordsModal from 'features/record/manage-record/AutoAssignModal';
// import AssignRecordModal from 'features/record/manage-record/AssignModal';

const ModalManager: React.FC = props => {
  return (
    <span>
      <CropperAvatarModal />
      {/* <AssignSentencesModal />
      <AutoAssignSentencesModal />
      <SubmitErrorSentenceModal />
      <CreateVoiceModal />
      <SubmitErrorBroadcasterSentence />
      <SubmitErrorRecordModal />
      <AutoAssignRecordsModal />
      <AssignRecordModal /> */}
    </span>
  );
};

export default ModalManager;
