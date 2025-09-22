'use client';

import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';

import { useModalStore } from '@/store/use-modal-store';

export const ModalRenderer = () => {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const pathname = usePathname();

  const { modals, closeAllModal } = useModalStore(['modals', 'closeAllModal']);

  useEffect(() => {
    closeAllModal();
  }, [pathname, closeAllModal]);

  useEffect(() => {
    setMounted(true);
    const portalElement = document.getElementById('portal-root');

    if (!portalElement) {
      const newPortalRoot = document.createElement('div');
      newPortalRoot.id = 'portal-root';
      document.body.appendChild(newPortalRoot);
      setPortalRoot(newPortalRoot);
    } else {
      setPortalRoot(portalElement);
    }

    return () => {
      if (!document.getElementById('portal-root')) {
        portalRoot?.remove();
      }
    };
  }, []);

  if (!mounted || !portalRoot) return null;

  const renderModals = () => {
    return Object.entries(modals).map(([id, { content }]) => (
      <Fragment key={id}>{content}</Fragment>
    ));
  };

  return createPortal(<AnimatePresence>{renderModals()}</AnimatePresence>, portalRoot);
};
