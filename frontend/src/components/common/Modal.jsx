import React from "react";
import { createPortal } from "react-dom";
import "../../css/common/Modal.css";

const Modal = ({ children, onClose }) => {
  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <svg className="modal-close-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6.225 6.225a1 1 0 0 1 1.414 0L12 10.586l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 12l4.361 4.361a1 1 0 0 1-1.414 1.414L12 13.414l-4.361 4.361a1 1 0 0 1-1.414-1.414L10.586 12 6.225 7.639a1 1 0 0 1 0-1.414z"
              fill="currentColor"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
