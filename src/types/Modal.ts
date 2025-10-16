export const ModalTypes = {
  CONFIRM: 'confirm-modal',
  SELECT_PRODUCT: 'select-product',
} as const;

export type ModalId = (typeof ModalTypes)[keyof typeof ModalTypes];
