import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';

import { type ModalId } from '@/types/Modal';
import { StoreWithShallow, useStoreWithShallow } from './util';

interface ModalItem {
  content: React.ReactNode;
}

type ModalState = {
  modals: Partial<Record<ModalId, ModalItem>>;
};

type ModalActions = {
  openModal: (id: ModalId, content: React.ReactNode) => void;
  closeModal: (id: ModalId) => void;
  closeAllModal: () => void;
};

type ModalStore = ModalState & ModalActions;

const initialState: ModalState = {
  modals: {},
};

const modalStore = createWithEqualityFn(
  immer<ModalStore>((set) => ({
    ...initialState,
    openModal: (id: ModalId, content: React.ReactNode) => {
      set((state) => {
        state.modals[id] = { content };
      });
    },

    closeModal: (id: ModalId) => {
      set((state) => {
        delete state.modals[id];
      });
    },

    closeAllModal: () => set(initialState),
  }))
);

export const useModalStore: StoreWithShallow<ModalStore> = (keys) =>
  useStoreWithShallow(modalStore, keys);
