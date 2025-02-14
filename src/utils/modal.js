import emitter from '../emitter/emitter';
import { generateUUID } from './uuid';

export const successModal = (
  message,
  buttonText,
  onButtonClick,
  canHide,
  onClose,
  id,
) => {
  id = id || generateUUID();
  onClose = onClose || (() => {});
  emitter.emit('modal', {
    message,
    buttonText,
    onButtonClick,
    id,
    canHide,
    type: 'success',
    onClose,
  });
  return;
};

export const errorModal = (
  message,
  buttonText,
  onButtonClick,
  canHide,
  onClose,
  id,
) => {
  id = id || generateUUID();
  onClose = onClose || (() => {});
  emitter.emit('modal', {
    message,
    buttonText,
    onButtonClick,
    id,
    canHide,
    type: 'error',
    onClose,
  });
  return;
};

export const warningModal = (
  message,
  buttonText,
  onButtonClick,
  canHide,
  onClose,
  id,
) => {
  id = id || generateUUID();
  onClose = onClose || (() => {});
  emitter.emit('modal', {
    message,
    buttonText,
    onButtonClick,
    id,
    canHide,
    type: 'warning',
    onClose,
  });
  return;
};

export const inputModal = (
  title,
  fieldData,
  buttonText,
  onButtonClick,
  canHide,
  onClose,
  id,
) => {
  id = id || generateUUID();
  onClose = onClose || (() => {});
  emitter.emit('modal', {
    title,
    fieldData,
    buttonText,
    onButtonClick,
    id,
    canHide,
    type: 'input',
    onClose,
  });
  return;
};
