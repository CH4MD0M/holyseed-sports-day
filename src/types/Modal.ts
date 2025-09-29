export const ModalTypes = {
  CONFIRM: 'confirm-modal',
} as const;

export type ModalId = (typeof ModalTypes)[keyof typeof ModalTypes];
