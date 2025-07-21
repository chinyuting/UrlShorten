import React from "react";

function Alert({ title, message, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-90 relative mt-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-800 transition-colors text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold text-red-600 mb-2">{title}</h2>
        <p className="text-gray-800">{message}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white mt-3 px-4 py-2 rounded-md transition-colors shadow"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alert;
