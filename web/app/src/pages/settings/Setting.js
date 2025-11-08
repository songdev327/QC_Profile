import Template from "../components/Template";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DnsIcon from "@mui/icons-material/Dns";
import IronIcon from "@mui/icons-material/Iron";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ArticleIcon from "@mui/icons-material/Article";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DashboardIcon from '@mui/icons-material/Dashboard';

function Setting() {
  const [userPermission, setUserPermission] = useState(""); // เก็บข้อมูลสิทธิ์ผู้ใช้

  const [userPassword, setUserPassword] = useState(""); // เก็บข้อมูลรหัสผ่าน


  // useEffect(() => {
  //   const userPermissionsFromStorage = localStorage.getItem("userPermissions");
  //   console.log("Permissions from storage:", userPermissionsFromStorage); // ตรวจสอบค่าที่ถูกดึงมา

  //   if (userPermissionsFromStorage) {
  //     const trimmedPermissions = userPermissionsFromStorage.trim(); // ตัดช่องว่าง
  //     setUserPermission(trimmedPermissions); // เก็บค่าไว้ใน state ถ้ามีค่า
  //     console.log("Should display buttons:", trimmedPermissions === "Leader" || trimmedPermissions === "Admin");
  //   } else {
  //     console.error("No permissions found in localStorage");
  //   }
  // }, []);

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
      <Template>
        <div className="signup_container d-flex justify-content-center">
          {/* <div className="register-box"> */}
          <div className="signup_form w-50">
            <div className="card card-outline card-success mt-1">
              <div className="card-header text-center" id="">
                <h3 className="h2">
                  <SettingsIcon className="mb-2 fw-bold" id="setting" />
                  <b className="ml-3">SETTING</b>
                  <span className="ml-3"></span>
                  {/* แสดงรหัสผ่านที่ดึงมาจาก localStorage */}
                  <input
                    type="text"
                    className="ml-3"
                    id="userLogin"
                    value={userPassword}
                    readOnly
                  />
                </h3>
              </div>
              <div className="card-body" id="">
                <form>
                  <div className="h2 col-12 text-center sleeve-component">
                    SLEEVE COMPONENT
                  </div>
                  <div className="col-12">
                    {/* ปุ่มสำหรับ Leader และ Admin */}
                    {(userPermission === "Leader" ||
                      userPermission === "Admin") && (
                        <>
                          <div className="custom-row">
                            <Link to="/addmachine">
                              <button
                                type="button"
                                className="btn btn-success custom-button"
                              >
                                <IronIcon className="mr-1" />
                                ADD MACHINE SLEEVE
                              </button>
                            </Link>
                          </div>
                        </>
                      )}

                    {/* ปุ่มสำหรับ Admin เท่านั้น */}
                    {userPermission === "Admin" && (
                      <>
                        <div className="custom-row">
                          <div className="custom-col-12">
                            <Link to="/addpartname">
                              <button
                                type="button"
                                className="btn btn-success custom-button"
                              >
                                <DnsIcon className="mr-1" />
                                ADD PART NAME
                              </button>
                            </Link>
                            <Link to="/recordProduction">
                              <button
                                type="button"
                                className="btn btn-success custom-button"
                              >
                                <ReceiptLongIcon className="mr-1" />
                                HISTORY RECORD
                              </button>
                            </Link>
                            <Link to="/recordNgTool">
                              <button type="button" className="btn btn-success custom-button">
                                <ReceiptLongIcon className="mr-1" />
                                HISTORY RECORD TOOL NG
                              </button>
                            </Link>
                          </div>

                          <div className="custom-col-12">
                            <Link to="/addprocess">
                              <button
                                type="button"
                                className="btn btn-success custom-button"
                              >
                                <AccountTreeIcon className="mr-1" />
                                ADD PROCESS
                              </button>
                            </Link>
                            <Link to="/register">
                              <button
                                type="button"
                                className="btn btn-success custom-button"
                              >
                                <HowToRegIcon className="mr-1" />
                                REGISTER
                              </button>
                            </Link>
                          </div>
                          <div className="custom-col-12">
                            <Link to="/addmachineType">
                              <button
                                type="button"
                                className="btn btn-success custom-button"
                              >
                                <PrecisionManufacturingIcon className="mr-1" />
                                ADD MACHINE TYPE
                              </button>
                            </Link>
                            <Link to="/adminDashboard">
                              <button type="button"
                                className="btn btn-warning custom-button">
                                <DashboardIcon className="mr-1" />
                                DASHBOARD
                              </button>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* ซ่อนปุ่มอื่น ๆ สำหรับ Leader */}
                  {userPermission === "Admin" && (
                    <>
                      <hr></hr>
                    </>
                  )}
                </form>

                {userPermission === "Admin" && (
                  <>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE CH154 ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberSleeve">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER CH
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecSleeve">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER SPEC TOOL NUMBER CH
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineCHAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE CS ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberCS">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER CS
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecCS">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER SPEC TOOL NUMBER CS
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineCSAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE SB ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberSB">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER SB
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecSB">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER SPEC TOOL NUMBER SB
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineSBAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>

                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE TN ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberTN">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER TN
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecTN">
                      <button type="button" className="btn btn-success ml-2">
                        <ArticleIcon className="mr-1" />
                        MASTER SPEC TOOL NUMBER TN
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineTNAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                   
                  </>
                )}

                {(userPermission === "Leader" ||
                  userPermission === "Admin") && (
                    <>
                      <div className="h2 col-12 text-center shaft-component">
                        SHAFT COMPONENT
                      </div>
                      <div className="custom-row">
                        <Link to="/addmachineShaft">
                          <button
                            type="button"
                            className="btn btn-primary custom-button"
                          >
                            <IronIcon className="mr-1" />
                            ADD MACHINE SHAFT
                          </button>
                        </Link>
                      </div>
                    </>
                  )}

                {userPermission === "Admin" && (
                  <>
                    <div className="custom-row">
                      <div className="custom-col-12">
                        <Link to="/addpartnameShaft">
                          <button
                            type="button"
                            className="btn btn-primary custom-button"
                          >
                            <DnsIcon className="mr-1" />
                            ADD PART NAME SHAFT
                          </button>
                        </Link>

                        <Link to="/recordProduction">
                          <button
                            type="button"
                            className="btn btn-primary custom-button"
                          >
                            <ReceiptLongIcon className="mr-1" />
                            HISTORY RECORD
                          </button>
                        </Link>
                      </div>

                      <div className="custom-col-12">
                        <Link to="/addprocess">
                          <button
                            type="button"
                            className="btn btn-primary custom-button"
                          >
                            <AccountTreeIcon className="mr-1" />
                            ADD PROCESS
                          </button>
                        </Link>
                        <Link to="/register">
                          <button
                            type="button"
                            className="btn btn-primary custom-button"
                          >
                            <HowToRegIcon className="mr-1" />
                            REGISTER
                          </button>
                        </Link>
                      </div>
                      <div className="custom-col-12">
                        <Link to="/addmachineType">
                          <button
                            type="button"
                            className="btn btn-primary custom-button"
                          >
                            <PrecisionManufacturingIcon className="mr-1" />
                            ADD MACHINE TYPE
                          </button>
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE TBS ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumber">
                      <button
                        type="button"
                        className="btn btn-primary"
                      >
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER TBS
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpec">
                      <button
                        type="button"
                        className="btn btn-primary ml-2"
                      >
                        <ArticleIcon className="mr-1" />
                        MASTER SPEC TOOL NUMBER TBS
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineTBSAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE TBM ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberTBM">
                      <button type="button" className="btn btn-primary">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER TBM
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecTBM">
                      <button type="button" className="btn btn-primary ml-2">
                        <ArticleIcon className="ml-1" />
                        MASTER SPEC TOOL NUMBER TBM
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineTBMAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE TTC ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberTTC">
                      <button type="button" className="btn btn-primary">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER TTC
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecTTC">
                      <button type="button" className="btn btn-primary ml-2">
                        <ArticleIcon className="ml-1" />
                        MASTER SPEC TOOL NUMBER TTC
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineTTCAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE TB ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberTB">
                      <button type="button" className="btn btn-primary">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER TB
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecTB">
                      <button type="button" className="btn btn-primary ml-2">
                        <ArticleIcon className="ml-1" />
                        MASTER SPEC TOOL NUMBER TB
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineTBAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                    <hr></hr>
                    <div className="h4 col-12 sleeve-component-palen">
                      MACHINE TCH ADD RECORD CHANGE TOOL & PDF
                    </div>
                    <Link to="/addMasterToolNumberTCH">
                      <button type="button" className="btn btn-primary">
                        <ArticleIcon className="mr-1" />
                        MASTER TOOL NUMBER TCH
                      </button>
                    </Link>
                    <Link to="/addMasterToolNumberSpecTCH">
                      <button type="button" className="btn btn-primary ml-2">
                        <ArticleIcon className="ml-1" />
                        MASTER SPEC TOOL NUMBER TCH
                      </button>
                    </Link>
                    <Link to="/AddPdfMachineTCHAllModelInput">
                      <button
                        type="button"
                        className="btn ml-3 mt-2"
                        id="button-machine"
                      >
                        ADD PDF ALL MODEL
                      </button>
                    </Link>
                  </>
                )}
                <hr></hr>
               
              </div>
            </div>
          </div>
        </div>
      </Template>
    </>
  );
}
export default Setting;
