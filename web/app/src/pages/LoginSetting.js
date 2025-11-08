import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ใช้ไอคอนจาก react-icons
import LoginIcon from '@mui/icons-material/Login';
import UndoIcon from '@mui/icons-material/Undo';
import "../App.css";

function LoginSetting() {
  const [process, setProcess] = useState("Production");
  const [password, setPassword] = useState();

  const [showPassword, setShowPassword] = useState(false); // state สำหรับเก็บสถานะเปิด-ปิดรหัสผ่าน

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();

    if (process !== "Production") {
      Swal.fire({
        title: "Login",
        text: "อนุญาตเฉพาะผู้ใช้ที่ใช้ Production เท่านั้น",
        icon: "warning",
      });
      return; // หยุดการทำงานหาก process ไม่ใช่ "Production"
    }

    try {
      const payload = {
        process: process,
        password: password,
      };

      await axios
        .post(config.api_path + "/member/signinSettingToProduction", payload)
        .then((res) => {
          if (res.data.message === "success") {
            // ตรวจสอบว่าได้ permissions จากเซิร์ฟเวอร์
            if (res.data.permissions) {
              // เก็บ permissions และ token ลงใน localStorage
              localStorage.setItem("userPermissions", res.data.permissions);
              localStorage.setItem(config.token_name, res.data.token);
              localStorage.setItem("userProcess", process);  // เก็บ process ลงใน localStorage
              localStorage.setItem("userPassword", password); // เก็บ password ลงใน localStorage

              // ✅ เพิ่มตรงนี้ เก็บชื่อที่ login
              if (res.data.name) {
                localStorage.setItem("userName", res.data.name);
              }


              console.log("Permissions set in localStorage:", res.data.permissions);

              Swal.fire({
                title: "Login",
                text: "เข้าสู่ระบบแล้ว",
                icon: "success",
              });

              // เปลี่ยนเส้นทางไปยังหน้า settings
              navigate("/settings");
              window.location.reload();
            } else {
              Swal.fire({
                title: "Login",
                text: "ไม่พบสิทธิ์ของผู้ใช้งาน (permissions)",
                icon: "error",
              });
            }
          } else {
            Swal.fire({
              title: "Login",
              text: "ไม่พบข้อมูลในระบบ",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Login Error",
            text: err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
            icon: "error",
          });
        });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="signup_container d-flex justify-content-center mt-5">
        <div className="signup_form w-50">
          <div className="card card-outline card-primary">
            <div className="h1 card-header text-center txet-bold mg-3" id="login-setting">
              <i className="text-dark nav-icon fas fa-thin fa-address-card mr-3" />
              LOGIN SETTING TO PRODUCTION
            </div>
            <form onSubmit={handleSignIn}>
              <div className="card-body">
                <div>
                  <label>PROCESS</label>
                  <input
                    onChange={(e) => setProcess(e.target.value)}
                    type="text"
                    value="Production"
                    className="form-control mr-5"
                    disabled
                  />
                </div>
                <div className="mt-3">
                  <label>PASSWORD</label>
                  <div className="input-group">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="password......."
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-primary fw-bold"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-3">
                    <button type="submit" className="btn btn-primary bg-primary text-white">
                      SING IN
                      <LoginIcon className="ml-2" />
                    </button>
                    <Link to="/home">
                      <button type="button" className="btn btn-danger text-white ml-4">
                        <UndoIcon />
                        BACK
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginSetting;

