import React, { useRef, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useTranslation } from 'react-i18next';

import LinearProgress from '@material-ui/core/LinearProgress';

import ModalWrapper from 'app/cores/modal/ModalWrapper';
import useModal from 'hooks/useModal';
import useAlert from 'hooks/useAlert';
import Button from 'app/layout/commons/form/Button';
import { blobToFile } from 'app/utils/helper';
import { AppState, ModalState } from 'app/redux/rootReducer';
import { AppDispatch } from 'app/redux/store';
import { uploadAvatar } from 'features/auth/authSlice';
import { FieldError } from '@tts-dev/common';

const CropperAvatarModal: React.FC = props => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const cropper = useRef<any>(null);
  const [cropData, setCropData] = useState<File>();
  const { closeModal } = useModal();
  const { alertSuccess, alertError } = useAlert();
  const [loading, setLoading] = useState(false);
  const { modalProps } = useSelector<AppState, ModalState>(
    state => state.modal
  );
  const image = modalProps ? modalProps.image : null;

  function cropImage() {
    if (typeof cropper.current.getCroppedCanvas() === 'undefined') {
      return;
    }
    cropper.current.getCroppedCanvas().toBlob((blob: any) => {
      const imageFile = blobToFile(blob, 'avatar.jpeg');

      setCropData(imageFile);
    }, 'image/jpeg');
  }

  const handleUpload = async () => {
    if (cropData) {
      setLoading(true);
      const res = await dispatch(uploadAvatar({ avatar: cropData }));

      if (res.meta.requestStatus === 'rejected') {
        const errs = res.payload as FieldError[];
        errs.forEach(err => {
          alertError(err.message);
        });
      } else {
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        closeModal();
      }

      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      closeable={true}
      modalType='CropperAvatarModal'
      title={t('TITLE_UPLOAD_AVATAR')}
      actions={
        <Fragment>
          <Button
            variant='success'
            content={t('ACTIONS_CONFIRM')}
            loading={loading}
            disabled={loading}
            onClick={handleUpload}
          />
          <Button content={t('ACTIONS_CANCEL')} onClick={closeModal} />
        </Fragment>
      }
    >
      <Cropper
        ref={cropper}
        style={{ height: 400, width: '100%' }}
        initialAspectRatio={1}
        aspectRatio={1}
        preview='.img-preview'
        src={image}
        viewMode={1}
        guides={true}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        crop={cropImage}
      />
      {loading && <LinearProgress />}
    </ModalWrapper>
  );
};

export default CropperAvatarModal;
