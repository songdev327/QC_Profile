import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ใช้ไอคอนจาก react-icons
import LoginIcon from '@mui/icons-material/Login';
import UndoIcon from '@mui/icons-material/Undo';
import "../App.css";

function LoginSettingQc() {
  const [process, setProcess] = useState("QC Equipment");
  const [password, setPassword] = useState();


  const [showPassword, setShowPassword] = useState(false); // state สำหรับเก็บสถานะเปิด-ปิดรหัสผ่าน

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
  
    if (process !== "QC Equipment") {
      Swal.fire({
        title: "Login",
        text: "อนุญาตเฉพาะผู้ใช้ที่ใช้ QC Equipment เท่านั้น",
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
        .post(config.api_path + "/member/signinSettingToQCEquipment", payload)
        .then((res) => {
          if (res.data.message === "success") {
            // ตรวจสอบว่าได้ permissions จากเซิร์ฟเวอร์
            if (res.data.permissions) {
              // เก็บ permissions และ token ลงใน localStorage
              localStorage.setItem("userPermissions", res.data.permissions);
              localStorage.setItem(config.token_name, res.data.token);
              localStorage.setItem("userProcess", process);  // เก็บ process ลงใน localStorage
              localStorage.setItem("userPassword", password); // เก็บ password ลงใน localStorage


              console.log("Permissions set in localStorage:", res.data.permissions);
  
              Swal.fire({
                title: "Login",
                text: "เข้าสู่ระบบแล้ว",
                icon: "success",
              });
  
              // เปลี่ยนเส้นทางไปยังหน้า settings
              navigate("/settingsForQc");
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
            <div className="h1 card-header text-center txet-bold mg-3" id="login-setting-qc">
              <i className="text-dark nav-icon fas fa-thin fa-address-card mr-3" />
              LOGIN SETTING TO QC
            </div>
            <form onSubmit={handleSignIn}>
              <div className="card-body">
                <div>
                  <label>PROCESS</label>
                  <input
                    onChange={(e) => setProcess(e.target.value)}
                    type="text"
                    value="QC Equipment"
                    // list="data3"
                    className="form-control mr-5" disabled
                    // placeholder="Process......."
                  />
                  {/* <datalist id="data3">
                  <option>QC Equipment</option>
                  </datalist> */}
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
                      <LoginIcon className="ml-2"/>
                    </button>
                    <Link to="/homeqc">
                    <button type="button" className="btn btn-danger text-white ml-5">
                    <UndoIcon/>
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

export default LoginSettingQc;