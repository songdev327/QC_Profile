import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ใช้ไอคอนจาก react-icons
import LoginIcon from '@mui/icons-material/Login';

import "../App.css";

function Login() {
  const [process, setProcess] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false); // state สำหรับเก็บสถานะเปิด-ปิดรหัสผ่าน

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      localStorage.setItem("hasRefreshed", "true");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 second = 1000 milliseconds
    }
  }, []);

  const handleSignin = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        process: process,
        password: password,
      };
      await axios
        .post(config.api_path + "/member/signin", payload)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "Login",
              text: "เข้าสู่ระบบแล้ว",
              icon: "success",
            });
            console.log(res.data.token);
            console.log(res.data.result);
            localStorage.setItem(config.token_name, res.data.token);

            if (process === "Production") {
              navigate("/home");
            } else if (process === "QC Equipment") {
              navigate("/homeqc");
            }
            window.location.reload();
          } else {
            Swal.fire({
              title: "Login",
              text: "ไม่พบข้อมูลในระบบ",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
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
            <div className="h1 card-header text-center txet-bold mg-3" id="login">
              <i className="text-dark nav-icon fas fa-thin fa-address-card mr-3" />
              LOGIN
            </div>
            <form onSubmit={handleSignin}>
              <div className="card-body">
                <div>
                  <label>PROCESS</label>
                  <input
                    onChange={(e) => setProcess(e.target.value)}
                    type="text"
                    list="data2"
                    className="form-control mr-5"
                    placeholder="Process..."
                  />
                  <datalist id="data2">
                    <option>Production</option>
                    <option>QC Equipment</option>
                  </datalist>
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
                    <button type="submit" className="col-6 btn btn-primary bg-primary text-white">
                      SING IN
                      <LoginIcon className="ml-2"/>
                    </button>
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

export default Login;
