import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PasswordModal from "../components/PasswordModal";
import Alert from "../components/Alert";

const RedirectPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ title: "", message: "" });

  const { code } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/${code}`,
          {
            params: { checkOnly: true },
          }
        );

        if (data.needPassword) {
          setShowModal(true);
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/${code}`
          );
          if (res.data.redirectUrl) {
            window.location.href = res.data.redirectUrl;
          } else {
            setAlertMsg({ title: "錯誤", message: "找不到轉址 URL" });
            setShowAlert(true);
            navigate("/not-found");
          }
        }
      } catch (err) {
        setAlertMsg({ title: "錯誤", message: `API 錯誤, ${err}` });
        setShowAlert(true);
        navigate("/not-found");
      }
    };

    checkPassword();
  }, [code, navigate]);

  const handlePasswordSubmit = async (password) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/${code}`, {
        params: { password },
      });

      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        setAlertMsg({
          title: "錯誤",
          message: `${res.data.message || "發生錯誤"}`,
        });
        setShowAlert(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("密碼錯誤");
      } else {
        setAlertMsg({ title: "錯誤", message: "錯誤，請稍後再試" });
        setShowAlert(true);
      }
    }
  };

  return (
    <>
      {showModal && <PasswordModal onSubmit={handlePasswordSubmit} />}
      {showAlert && (
        <Alert
          title={alertMsg.title}
          message={alertMsg.message}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default RedirectPage;
