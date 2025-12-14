import React from "react";
import BaseModal from "./BaseModal";

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  children,
}) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Confirmation"
      actionLabel="Confirmer"
      onAction={onConfirm}
      variant="confirm"
      size="sm"
    >
      {children}
    </BaseModal>
  );
}






