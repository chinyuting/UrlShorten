import React from "react";

export default function UrlTable({ urlList, toggleUrlActive }) {
  return (
    <div className="divide-y divide-gray-200 border border-gray-300 rounded-xl overflow-hidden mt-5 max-w-6xl mx-auto">
      <div className="grid grid-cols-8 font-semibold bg-gray-100 text-gray-700 px-4 py-2 gap-2">
        <div className="col-span-2">短網址</div>
        <div className="col-span-2">原網址</div>
        <div className="col-span-2">備註說明</div>
        <div className="col-span-1">是否啟用</div>
        <div className="col-span-1">是否加密</div>
      </div>

      {urlList.length === 0 ? (
        <div className="text-center text-gray-500 col-span-8 py-6">
          目前沒有任何短網址，請在上方表格中新增
        </div>
      ) : (
        urlList.map((item) => (
          <div
            key={item.shortCode}
            className="grid grid-cols-8 px-4 py-3 items-start bg-white hover:bg-gray-50 text-sm break-words gap-2"
          >
            <a
              href={`${import.meta.env.VITE_REDIRECT_URL}/${item.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline col-span-2"
            >
              {`${import.meta.env.VITE_REDIRECT_URL}/${item.shortCode}`}
            </a>
            <div className="text-gray-800 col-span-2">{item.originalUrl}</div>
            <div className="text-gray-800 col-span-2">{item.comment}</div>
            <div className="text-gray-800 col-span-1 flex items-center">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  id={`url-toggle-${item.shortCode}`}
                  type="checkbox"
                  className="sr-only peer"
                  checked={item.isUrlActive}
                  onChange={() => toggleUrlActive(item.shortCode)}
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded-md flex items-center justify-center transition peer-checked:bg-gray-600 peer-checked:border-gray-600"></div>
                <svg
                  className="w-5 h-5 text-white hidden peer-checked:block absolute"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="hidden md:inline-block ml-2 text-sm text-gray-700 font-medium">
                  {item.isUrlActive ? "已啟用" : "未啟用"}
                </span>
              </label>
            </div>
            <div className="text-gray-800 col-span-1">
              {item.isSecret ? "已加密" : "無"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
