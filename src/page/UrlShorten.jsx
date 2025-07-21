import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowDown,
  faCopy,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "../components/Alert";

const API_BASEURL = "http://localhost:3001";

export default function UrlShorten() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ title: "", message: "" });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [originUrl, setOriginUrl] = useState("");
  const [meta, setMeta] = useState({ title: "" });
  const [comment, setComment] = useState("");
  const [isUrlActive, setIsUrlActive] = useState(true);
  const [password, setPassword] = useState("");
  const [urlList, setUrlList] = useState(() => {
    return JSON.parse(localStorage.getItem("urlDatabase") || "[]");
  });

  const togglePasswordVisibility = () => {
    setIsShowPassword((prev) => !prev);
  };

  const urlShortenRef = useRef(null);
  const handleCopy = () => {
    const urlShorten = urlShortenRef.current;
    if (urlShorten && urlShorten.value) {
      navigator.clipboard.writeText(urlShorten.value);
    }
  };

  const handleGetMeta = async () => {
    if (!originUrl.trim()) {
      toast.error("請輸入連結");
      return;
    }
    try {
      const res = await axios.post(`${API_BASEURL}/api/scrape`, {
        url: originUrl,
      });
      const combined = `${res.data.title}`;
      setMeta({ title: res.data.title });
      setComment(combined);
    } catch (error) {
      setAlertMsg({ title: "錯誤", message: "取得頁面資訊失敗" });
      setShowAlert(true);
    }
  };

  const handleShorten = async () => {
    try {
      const originalUrl = originUrl.trim();
      const customCode = urlShortenRef.current?.value.trim();

      if (!originalUrl) {
        setAlertMsg({ title: "錯誤", message: "請輸入連結或貼上完整網址" });
        setShowAlert(true);
        return;
      }

      const res = await axios.post(`${API_BASEURL}/api/shorten`, {
        originalUrl,
        customCode: customCode || null,
        isUrlActive,
        comment,
        password,
      });

      if (res.data.shortUrl) {
        urlShortenRef.current.value = res.data.shortUrl;
        const newData = {
          shortCode: res.data.shortCode,
          originalUrl: originalUrl,
          isUrlActive: isUrlActive,
          isSecret: password.trim().length !== 0,
          comment: comment,
          createdAt: new Date().toISOString(),
        };
        const updated = [newData, ...urlList];
        setUrlList(updated);
        localStorage.setItem("urlDatabase", JSON.stringify(updated));

        toast.success("縮址成功！短網址結果請看下方表格");

        setOriginUrl("");
        setComment("");
        setMeta({ title: "" });
        setPassword("");
        urlShortenRef.current.value = "";
      } else {
        setAlertMsg({ title: "錯誤", message: "短網址產生失敗" });
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMsg({ title: "錯誤", message: "短網址產生失敗" });
      setAlertMsg({
        title: "無法建立短網址",
        message: "這個短網址可能已經被使用了，請嘗試使用不同的名稱後再試一次。",
      });
      setShowAlert(true);
    }
  };

  const toggleUrlActive = async (shortCode) => {
    // 先備份原本的 urlList
    const originalList = [...urlList];

    // 產生新的 urlList 陣列（切換狀態）
    const updatedList = urlList.map((item) => {
      if (item.shortCode === shortCode) {
        return { ...item, isUrlActive: !item.isUrlActive };
      }
      return item;
    });

    // 先更新前端狀態與 localStorage
    setUrlList(updatedList);
    localStorage.setItem("urlDatabase", JSON.stringify(updatedList));

    // 找到剛更新的項目，送 API 更新後端
    const updatedItem = updatedList.find(
      (item) => item.shortCode === shortCode
    );

    try {
      await axios.put(`${API_BASEURL}/api/updateUrlActive`, {
        shortCode: updatedItem.shortCode,
        isUrlActive: updatedItem.isUrlActive,
      });
      toast.success("更新成功！");
    } catch (error) {
      setAlertMsg({ title: "錯誤", message: "更新啟用狀態失敗" });
      setShowAlert(true);

      // 更新失敗，恢復原本的狀態
      setUrlList(originalList);
      localStorage.setItem("urlDatabase", JSON.stringify(originalList));
    }
  };

  const labelClass = "text-gray-500 block font-semibold my-2";
  const commentClass =
    "text-gray-500 block font-semibold flex items-center pb-1 mt-2";
  const inputClass =
    "w-full border-2 border-gray-300 bg-white rounded px-3 py-2 outline-0 placeholder:text-gray-400";

  return (
    <div className="p-7 md:p-10 min-h-screen">
      {showAlert && (
        <Alert
          title={alertMsg.title}
          message={alertMsg.message}
          onClose={() => setShowAlert(false)}
        />
      )}
      <form className="grid grid-cols-1 md:grid-cols-8 gap-3 max-w-6xl mx-auto rounded bg-gray-100 p-6">
        <div className="md:col-span-4">
          <label htmlFor="originUrl" className={labelClass}>
            連結
          </label>
          <input
            type="text"
            id="originUrl"
            className={inputClass}
            placeholder="請輸入或貼上完整網址"
            value={originUrl}
            onChange={(e) => setOriginUrl(e.target.value)}
          />
          <span className="w-full text-sm tracking-tighter text-gray-500 font-medium">
            貼上的網址若包含 utm 標籤，會自動解析並使用 Google Analytics 功能
          </span>
        </div>

        <div className="col-span-1 md:col-span-2 relative">
          <label htmlFor="shortenUrl" className={labelClass}>
            短網址
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="shortenUrl"
              className={`${inputClass} pr-8`}
              ref={urlShortenRef}
            />
            <button
              type="button"
              className="absolute right-3 text-gray-500 hover:text-gray-700"
              onClick={handleCopy}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
          <span className="w-full text-sm tracking-tighter text-gray-500 font-medium">
            可自行填寫，或是自動產生
          </span>
        </div>

        <div className="col-span-1 md:col-span-2 relative">
          <label htmlFor="password" className={labelClass}>
            密碼保護
          </label>
          <div className="relative flex items-center">
            <input
              type={isShowPassword ? "text" : "password"}
              id="password"
              className={`${inputClass} pr-8`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <span className="w-full text-sm tracking-tighter text-gray-500 font-medium">
            若不使用密碼保護，將此欄位清空即可
          </span>
        </div>

        <div className="col-span-1 md:col-span-8 mt-4">
          <label htmlFor="comment" className={commentClass}>
            備註說明
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 flex gap-2 items-center rounded ml-2 text-sm font-normal cursor-pointer"
              onClick={handleGetMeta}
            >
              <FontAwesomeIcon icon={faCloudArrowDown} />
              取得頁面資訊
            </button>
          </label>
          <textarea
            id="comment"
            rows="4"
            className={inputClass}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="col-span-1 md:col-span-6 w-full flex items-center gap-2">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isUrlActive}
              onChange={() => setIsUrlActive((prev) => !prev)}
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
            <span className="ml-2 text-sm text-gray-700 font-medium">
              是否啟用
            </span>
          </label>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="button"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
            onClick={handleShorten}
          >
            產生短網址
          </button>
        </div>
      </form>

      <div className="divide-y divide-gray-200 border border-gray-300 rounded-xl overflow-hidden mt-5 max-w-6xl mx-auto">
        <div className="grid grid-cols-8 font-semibold bg-gray-100 text-gray-700 px-4 py-2 gap-2">
          <div className="col-span-2">短網址</div>
          <div className="col-span-2">原網址</div>
          <div className="col-span-2">備註說明</div>
          <div className="col-span-1">是否啟用</div>
          <div className="col-span-1">是否加密</div>
        </div>

        {urlList.map((item) => (
          <div
            key={item.shortCode}
            className="grid grid-cols-8 px-4 py-3 items-start bg-white hover:bg-gray-50 text-sm break-words gap-2"
          >
            <a
              href={`http://localhost:5173/${item.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline col-span-2"
            >
              {`http://localhost:5173/${item.shortCode}`}
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
        ))}
      </div>
    </div>
  );
}
