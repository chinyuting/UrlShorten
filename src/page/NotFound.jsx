import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">頁面不存在</h2>
      <p className="text-gray-600 mb-6 text-center">
        找不到你要訪問的頁面，可能是短網址不存在或已被停用。
      </p>
      <Link
        to="/"
        className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-600 cursor-pointer transition"
      >
        返回首頁
      </Link>
    </div>
  );
}
