import TemplateQC from "../components/TemplateQC";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import "./setting.css"
import { useEffect, useState } from "react";
import HowToRegIcon from '@mui/icons-material/HowToReg';

function SettingForQc() {

  const [userPermission, setUserPermission] = useState(""); // เก็บข้อมูลสิทธิ์ผู้ใช้

  const [userPassword, setUserPassword] = useState(""); // เก็บข้อมูลรหัสผ่าน

  useEffect(() => {
    const userPermissionsFromStorage = localStorage.getItem("userPermissions");
    const userPasswordFromStorage = localStorage.getItem("userPassword"); // ดึงรหัสผ่านจาก localStorage
    console.log("Permissions from storage:", userPermissionsFromStorage);
    console.log("Password from storage:", userPasswordFromStorage);

    if (userPermissionsFromStorage) {
      const trimmedPermissions = userPermissionsFromStorage.trim(); // ตัดช่องว่าง
      setUserPermission(trimmedPermissions); // เก็บค่า permission ไว้ใน state
    } else {
      console.error("No permissions found in localStorage");
    }

    if (userPasswordFromStorage) {
      setUserPassword(userPasswordFromStorage); // เก็บรหัสผ่านไว้ใน state
    }
  }, []);

  return (
    <>
      <TemplateQC>
        <div className="signup_container d-flex justify-content-center">
          {/* <div className="register-box"> */}
          <div className="signup_form w-50">
            <div className="card card-outline card-primary mt-1">
              <div className="card-header text-center" id="login-setting-qc">
                <h3 className="h2">
                  <SettingsIcon className="mb-2 fw-bold" id="setting" />
                  <b className="ml-3">SETTING FOR QC</b>
                  <span className="ml-3"></span>
                    {/* แสดงรหัสผ่านที่ดึงมาจาก localStorage */}
                    <input 
                  type="text"
                  className="ml-3"
                  id="userLoginQC" 
                  value={userPassword}
                  readOnly />
                </h3>
              </div>
              <div className="card-body" id="">
                <form>
                  <div className="col-12">
                    <Link to="/registerForQc">
                      <button type="button" className="btn btn-success mr-3 mt-2">
                      <HowToRegIcon className="mr-1"/>
                        REGISTER
                      </button>
                    </Link>
                    {/* <Link to="/history">
                      <button type="button" className="btn btn-success mr-3 mt-2">
                        HISTORY
                      </button>
                    </Link> */}
                    {/* <Link to="/historyImagesForQc">
                      <button type="button" className="btn btn-success mr-3 mt-2">
                      <i className="fa-solid fa-bars mr-2"></i>
                        HISTORY RECORD
                      </button>
                    </Link> */}
                    <Link to="/recordProductionPageQC">
                      <button type="button" className="btn btn-success mr-3 mt-2">
                      <i className="fa-solid fa-bars mr-2"></i>
                        HISTORY RECORD
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </TemplateQC>
    </>
  );
}
export default SettingForQc;