import React from 'react';

// import TestModal from 'features/playground/TestModal';
import CropperAvatarModal from 'features/auth/settings/account-tab/CropperAvatarModal';
import SubmitErrorSentenceModal from 'features/sentence/containers/SubmitErrorSentenceModal';
import AssignSentenceModal from 'features/sentence/containers/AssignModal';
import SubmitErrorRecordModal from 'features/record/containers/SubmitErrorRecordModal';
import AssignRecordModal from 'features/record/containers/AssignModal';
import SubmitErrorBroadcasterSentenceModal from 'features/broadcaster/containers/SubmitErrorBroadcasterSentence';
// import AssignSentencesModal from 'features/sentence/manage-sentence/AssignModal';
// import AutoAssignSentencesModal from 'features/sentence/manage-sentence/AutoAssignModal';
// import CreateVoiceModal from 'features/voice/manage-voices/CreateVoiceModal';
// import SubmitErrorBroadcasterSentence from 'features/broadcaster/broadcaster-sentences/SubmitErrorBroadcasterSentence';
// import SubmitErrorRecordModal from 'features/record/record-details/SubmitErrorRecord';
// import AutoAssignRecordsModal from 'features/record/manage-record/AutoAssignModal';
// import AssignRecordModal from 'features/record/manage-record/AssignModal';

const ModalManager: React.FC = props => {
  return (
    <span>
      <CropperAvatarModal />
      <SubmitErrorSentenceModal />
      <AssignSentenceModal />
      <SubmitErrorRecordModal />
      <AssignRecordModal />
      <SubmitErrorBroadcasterSentenceModal />
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
