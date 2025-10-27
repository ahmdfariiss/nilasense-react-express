import { useEffect } from "react";

export const useDialogFix = () => {
  useEffect(() => {
    const applyDialogStyles = () => {
      const dialog = document.querySelector('[role="dialog"]');
      const overlay = document.querySelector('[data-slot="dialog-overlay"]');
      const alertDialog = document.querySelector('[role="alertdialog"]');
      const alertOverlay = document.querySelector(
        '[data-slot="alert-dialog-overlay"]'
      );

      if (dialog) {
        dialog.style.cssText = `
          display: grid !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 50 !important;
          background-color: white !important;
          color: black !important;
          width: 90% !important;
          max-width: 600px !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px !important;
          padding: 24px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
        `;

        dialog.querySelectorAll("*").forEach((el) => {
          if (el.style) {
            el.style.color = el.style.color || "inherit";
            el.style.opacity = el.style.opacity || "1";
          }
        });
      }

      if (overlay) {
        overlay.style.cssText = `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 49 !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
        `;
      }

      if (alertDialog) {
        alertDialog.style.cssText = `
          display: grid !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 50 !important;
          background-color: white !important;
          color: black !important;
          width: 90% !important;
          max-width: 500px !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px !important;
          padding: 24px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
        `;
      }

      if (alertOverlay) {
        alertOverlay.style.cssText = `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 49 !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
        `;
      }

      // Fix dialog close button
      const closeButton = document.querySelector(
        '[data-slot="dialog-close-button"]'
      );
      if (closeButton) {
        closeButton.style.cssText = `
          position: absolute !important;
          top: 1rem !important;
          right: 1rem !important;
          opacity: 0.7 !important;
          z-index: 60 !important;
          display: inline-flex !important;
          cursor: pointer !important;
        `;
      }

      // Fix alert dialog action buttons
      const actionButton = document.querySelector(
        '[data-slot="alert-dialog-action"]'
      );
      const cancelButton = document.querySelector(
        '[data-slot="alert-dialog-cancel"]'
      );

      if (actionButton) {
        actionButton.style.cssText = `
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 60 !important;
          cursor: pointer !important;
        `;
      }

      if (cancelButton) {
        cancelButton.style.cssText = `
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 60 !important;
          cursor: pointer !important;
        `;
      }
    };

    const observer = new MutationObserver(applyDialogStyles);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
};
