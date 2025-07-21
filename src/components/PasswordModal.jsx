import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const PasswordModal = ({ onSubmit }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("請輸入密碼");
      return;
    }
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-10 rounded shadow-md w-xl">
        <h2 className="text-xl font-bold mb-6">請輸入密碼</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 bg-white rounded px-3 py-2 mb-6 outline-0 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer transition"
          >
            確認
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
