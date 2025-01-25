import React, { useState } from 'react';

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h2>Bottom Modal</h2>
      {/* Trigger/Open The Modal */}
      <button onClick={openModal}>Open Modal</button>

      {/* The Modal */}
      {isModalOpen && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target.className === 'modal') closeModal();
          }}
        >
          {/* Modal content */}
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h2>Modal Header</h2>
            </div>
            <div className="modal-body">
              <p>Some text in the Modal Body</p>
              <p>Some other text...</p>
            </div>
            <div className="modal-footer">
              <h3>Modal Footer</h3>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        body {
          font-family: Arial, Helvetica, sans-serif;
        }

        .modal {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          animation: fadeIn 0.4s;
        }

        .modal-content {
          position: relative;
          background-color: #fefefe;
          border-radius: 5px;
          width: 80%;
          max-width: 500px;
          animation: slideIn 0.4s;
        }

        .close {
          color: white;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          background-color: #5cb85c;
          padding: 5px 10px;
          border-radius: 3px;
        }

        .modal-header {
          padding: 2px 16px;
          background-color: #5cb85c;
          color: white;
        }

        .modal-body {
          padding: 2px 16px;
        }

        .modal-footer {
          padding: 2px 16px;
          background-color: #5cb85c;
          color: white;
        }

        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
