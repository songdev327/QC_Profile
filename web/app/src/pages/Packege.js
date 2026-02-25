import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../config";
import Modal from "./components/Modal";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Style.css"

function Package() {
    const [packages, setPackages] = useState([]);
    const [yourPackage, setYourPackage ] = useState({});
    const [name, setName] = useState();
    const [lastname, setLastname] = useState();
    const [process, setProcess] = useState();
    const [employee, setEmployee] = useState();
    const [password, setPassword] = useState();


    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
  
    }, [])

    const fetchData = async () => {
        try {
            axios.get(config.api_path + '/package/list').then(res => {
                setPackages(res.data.results);
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            console.log(e.message);
        }
    }

    const choosePackage = (item) => {
          setYourPackage(item);
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            Swal.fire({
                title: 'ยืนยันการลงทะเบียน',
                text: 'โปรดยืนยันการลงทะเบียน',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(res =>{
                if (res.isConfirmed) {
                    const payload = {
                        packageId: yourPackage.id,
                        name: name,
                        lastname: lastname,
                        process: process,
                        employee: employee,
                        password: password
                    }
                    axios.post(config.api_path + '/package/memberRegister', payload).then(res => {
                        if (res.data.message === 'success') {
                          Swal.fire({
                            title: 'บันทึกข้อมูล',
                            text: 'บันทึกการลงทะเบียนแล้ว',
                            icon: 'success',
                            timer: 5000
                          }) 
                          navigate('/login');
                          window.location.reload();
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
                }
            })
   
        }catch (e) {
          Swal.fire({
            title: 'error',
            message: e.message,
            icon: 'error'
          })
        }
    }

    return (
      <>
        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50">
            <div className="card card-outline card-success mt-5">
              <div className="card-header">
                <div className="container mt-2">
                  <div className="h2 mt-3" id="tool-inspection-system">
                    TOOL INSPECTION SYSTEM
                  </div>
                  <div className="h4 ml-3" id="login-to-application">
                    Login To Application
                  </div>
                  <div className="card-footer border border-secondary-subtle mt-4">
                    <div className="col-12">
                      <Link to="/login" class="nav-link">
                        <button type="button" className="col-4 btn btn-success">
                          LOGIN
                        </button>
                      </Link>
                    </div>
                  </div>
                  {/* <div
                    className="h4 ml-3 mt-5 mb-3 text-center text-white"
                    id="register-member"
                  >
                    Register New a Member
                  </div> */}
                  {/* <div className="row">
                    {packages.map((item) => (
                      <div className="col-4">
                        <div className="card ">
                          <div className="card-body text-center">
                            <div className="h4 text-success text-bold">
                              {item.name}
                            </div>
                            <div className="mt-3">
                              <button
                                onClick={(e) => choosePackage(item)}
                                data-bs-toggle="modal"
                                data-bs-target="#modalRegister"
                                className="btn btn-primary"
                              >
                                Register
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal className="btnClose" id="modalRegister" title="REGISTER">
          <form onSubmit={handleRegister}>
            <div>
              <label className="mb-2">STATUS</label>
              <div className="alert alert-info">{yourPackage.name}</div>
            </div>
            <div className="mt-3">
              <label>Name (ชื่อ)</label>
              <input
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label>Last Name (นามสกุล)</label>
              <input
                className="form-control"
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <div className="main1 mt-3">
              <label>Process (ส่วนงาน)</label>
              <input
                list="data1"
                type="text"
                className="form-control"
                onChange={(e) => setProcess(e.target.value)}
              />
              <datalist id="data1">
                <option>Production</option>
                <option>QC Equipment</option>
              </datalist>
            </div>
            <div className="mt-3">
              <label>Employee (รหัส)</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setEmployee(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label>Password (รหัส)</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button className="btn btn-primary mt-3" onClick={handleRegister}>
                ยืนยันการสมัคร
                <i
                  className="fa fa-arrow-right"
                  style={{ marginLeft: "10px" }}
                ></i>
              </button>
            </div>
          </form>
        </Modal>
      </>
    );
}

export default Package;