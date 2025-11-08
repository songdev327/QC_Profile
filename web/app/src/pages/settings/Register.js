import { useState, useEffect } from "react";
import axios from 'axios';
import config from "../../config";
import Swal from 'sweetalert2';
import Template from "../components/Template";
import "./setting.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';


function Register() {
  const [packages, setPackages] = useState([]);
  const [userProcess, setUserProcess] = useState("");  // เพิ่ม state เพื่อเก็บ process ของผู้ใช้
  const [yourPackage, setYourPackage] = useState({});
  const [name, setName] = useState();
  const [lastname, setLastname] = useState();
  const [process, setProcess] = useState();
  const [employee, setEmployee] = useState();
  const [password, setPassword] = useState();
  const [permissions, setPermissions] = useState();
  const [typemc, setTypemc] = useState();

  const [getUser, setGetUser] = useState([]);

  // State สำหรับควบคุมการแสดงฟอร์ม
  const [showForm, setShowForm] = useState(false);

  // เพิ่ม useState สำหรับจัดการ id ของสมาชิกที่จะทำการแก้ไข
  const [editId, setEditId] = useState(null);

  const [userNumbers, setUserNumbers] = useState([]);

  const [password_input, setPassword_input] = useState("");

  // ดึงข้อมูล password จาก localStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    const storedPassword = localStorage.getItem("userPassword"); // ดึง password จาก localStorage
    if (storedPassword) {
      setPassword_input(storedPassword); // ตั้งค่า state ของ password
    }
  }, []); // ทำงานครั้งเดียวตอน component mount

  useEffect(() => {
    fetchData();
    fetchDataUserList();
  }, []);

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


  useEffect(() => {
    const processFromStorage = localStorage.getItem("userProcess");  // ดึงค่า process จาก localStorage
    console.log("Process from storage:", processFromStorage);  // ตรวจสอบว่าดึงค่าได้หรือไม่
    setUserProcess(processFromStorage);  // เก็บค่า process ลงใน state
  }, []);

  const fetchDataUserList = async () => {
    try {
      await axios
        .get(config.api_path + "/user/listProduction", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setGetUser(res.data.results);
            setFilteredUserNumbers(res.data.results); // ตั้งค่าข้อมูลเริ่มต้นของการกรอง
          }
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleEdit = (item) => {
    console.log("Editing item:", item); // ตรวจสอบข้อมูลที่ส่งมาว่าถูกต้องหรือไม่
    setYourPackage({ id: item.packageId, name: item.process }); // เก็บ packageId แต่เราต้องส่ง id ของสมาชิกสำหรับการอัปเดต
    setName(item.name);
    setLastname(item.lastname);
    setProcess(item.process);
    setEmployee(item.employee);
    setPassword(item.password);
    setPermissions(item.permissions);
    setTypemc(item.typemc);
    setShowForm(true);
    setEditId(item.id); // เก็บ id ของสมาชิกสำหรับการอัปเดต
  };

  const choosePackage = (item) => {
    setYourPackage(item);
    setShowForm(true); // แสดงฟอร์มเมื่อเลือกแพ็กเกจ
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าช่อง input ว่างหรือไม่
    if (!name || !lastname || !process || !employee || !password || !permissions || !typemc) {
      Swal.fire({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: 'ทุกช่องจำเป็นต้องกรอกข้อมูล',
        icon: 'warning',
        showConfirmButton: true
      });
      return;
    }

    try {
      Swal.fire({
        title: 'ยืนยันการบันทึกข้อมูล',
        text: 'โปรดยืนยันการบันทึกข้อมูล',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true
      }).then(res => {
        if (res.isConfirmed) {
          const payload = {
            packageId: yourPackage?.id || null,
            name: name,
            lastname: lastname,
            process: process,
            employee: employee,
            password: password,
            permissions: permissions,
            typemc: typemc,
            password_input: password_input,
          }

          // ตรวจสอบว่ากำลังแก้ไขหรือเพิ่มข้อมูลใหม่
          if (editId) {  // ใช้ editId (ซึ่งเป็น id ของสมาชิก)
            axios.put(config.api_path + '/package/memberUpdate/' + editId, payload).then(res => {
              if (res.data.message === 'success') {
                Swal.fire({
                  title: 'บันทึกข้อมูล',
                  text: 'อัปเดตข้อมูลแล้ว',
                  icon: 'success',
                  timer: 5000
                });
                window.location.reload();
              }
            }).catch(err => {
              throw err.response.data;
            });
          } else {
            // กรณีเป็นการเพิ่มข้อมูลใหม่
            axios.post(config.api_path + '/package/memberRegister', payload).then(res => {
              if (res.data.message === 'success') {
                Swal.fire({
                  title: 'บันทึกข้อมูล',
                  text: 'บันทึกการลงทะเบียนแล้ว',
                  icon: 'success',
                  timer: 5000
                });
                window.location.reload();
              }
            }).catch(err => {
              throw err.response.data;
            });
          }
        }
      });

    } catch (e) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      });
    }
  };

  const handleDelete = (item) => {
    if (!item || !item.id) {
      Swal.fire({
        title: 'Error',
        text: 'Invalid item ID',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'ลบข้อมูล',
      text: 'ยืนยันการลบข้อมูลออกจากระบบ',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true
    }).then(async res => {
      if (res.isConfirmed) {
        try {
          await axios.delete(config.api_path + '/user/delete/' + item.id, config.headers()).then(res => {
            if (res.data.message === 'success') {
              Swal.fire({
                title: 'ลบข้อมูล',
                text: 'ลบข้อมูลแล้ว',
                icon: 'success',
                timer: 2000
              });
              window.location.reload();
            }
          });
        } catch (e) {
          Swal.fire({
            title: 'Error',
            text: e.message,
            icon: 'error'
          });
        }
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState(""); // State สำหรับเก็บหมายเลขเครื่องที่ค้นหา
  const [userSearch, setUserSearch] = useState({ result: [] }); // ตั้งค่าตั้งต้นให้เหมาะสม
  const [filteredUserNumbers, setFilteredUserNumbers] = useState([]); // State สำหรับเก็บเครื่องที่กรอง

  // ฟังก์ชันค้นหาข้อมูลโดยการกรองจาก `getUser`
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      Swal.fire({
        title: "Error",
        text: "กรุณาเลือกหรือกรอกหมายเลขพนักงานเพื่อค้นหา",
        icon: "error",
      });
      return;
    }

    const filteredUsers = getUser.filter(item => {
      return item.employee && item.employee.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (filteredUsers.length === 0) {
      Swal.fire({
        title: "ไม่พบข้อมูล",
        text: "ไม่มีข้อมูลที่ตรงกับหมายเลขพนักงานที่ค้นหา",
        icon: "warning",
      });
    } else {
      setFilteredUserNumbers(filteredUsers); // ตั้งค่าผลการค้นหา
    }
  };


  useEffect(() => {
    fetchDataUserListSearch();
  }, []);

  const handleReset = () => {
    window.location.reload();
  };



  const fetchDataUserListSearch = async () => {
    try {
      const res = await axios.get(config.api_path + "/user/listSearch", config.headers());
      if (res.data.message === "success") {
        console.log("Fetched user numbers:", res.data.results); // ตรวจสอบว่าข้อมูลถูกดึงมาแล้ว
        setUserNumbers(res.data.results); // ตรวจสอบว่าข้อมูลถูกตั้งค่าหรือไม่
        setFilteredUserNumbers(res.data.results)
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50">
            <div className="card card-outline card-success mt-3">
              <div className="card-header">
                <div className="container mt-3">
                  <div className="h3 mt-3 mb-3" id="qc-equipment-system-1">
                    REGISTER NEW MEMBER TO APPLICATION
                  </div>
                  <div className="row">
                    {packages.map((item) => {
                      if (userProcess === "Production" && item.name === "Production") {
                        // แสดงปุ่ม Production สำหรับผู้ใช้ที่มี process เป็น "Production"
                        return (
                          <div className="col-4 mt-3" key={item.id}>
                            <div className="card">
                              <div className="card-body text-center">
                                <div className="h4 text-black text-bold">{item.name}</div>
                                <div className="mt-3">
                                  <button
                                    onClick={() => choosePackage(item)}
                                    className="btn btn-success"
                                  >
                                   <AddIcon/>
                                    Register
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null; // ไม่แสดงปุ่มถ้าไม่ตรงกับเงื่อนไข
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-2">
                <Link to='/settings'>
                  <button type="button" className="btn btn-danger ml-4">
                    <UndoIcon />
                    BACK
                  </button>
                </Link>
                <button
                  onClick={() => handleReset()}
                  className="btn btn-danger ml-4"
                >
                  RESET
                  <RotateLeftIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* แสดงฟอร์มหลังจากเลือกแพ็กเกจ */}
        {showForm && (
          <div className="signup_container d-flex justify-content-center">
            <div className="signup_form w-40">
              <div className="card card-outline card-success p-5">
                <form onSubmit={handleRegister}>
                  <div>
                    <label className="mb-2">STATUS</label>
                    <div className="alert alert-info">
                      {yourPackage?.name || 'No Package Selected'} {/* แสดงชื่อแพ็กเกจ ถ้าไม่มีข้อมูลจะแสดงข้อความว่า 'No Package Selected' */}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label>USER LOGIN</label>
                    <input
                      type="text"
                      className="form-control"
                      value={password_input || ''}
                      disabled
                    />
                  </div>
                  <div className="mt-3">
                    <label>Name (ชื่อ)</label>
                    <input
                      className="form-control"
                      value={name || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setName(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                  </div>
                  <div className="mt-3">
                    <label>Last Name (นามสกุล)</label>
                    <input
                      className="form-control"
                      value={lastname || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setLastname(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                  </div>
                  <div className="main1 mt-3">
                    <label>Process (ส่วนงาน)</label>
                    <input
                      list="data1"
                      type="text"
                      className="form-control"
                      value={process || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setProcess(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                    <datalist id="data1">
                      <option>Production</option>
                    </datalist>
                  </div>
                  <div className="mt-3">
                    <label>Employee (รหัส)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={employee || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setEmployee(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                  </div>
                  <div className="mt-3">
                    <label>Password (password)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setPassword(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                  </div>
                  <div className="mt-3">
                    <label>Permissions (Authorization)</label>
                    <input
                      type="text"
                      list="data2"
                      className="form-control"
                      value={permissions || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setPermissions(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                    <datalist id="data2">
                      <option>User</option>
                      <option>Leader</option>
                      <option>Admin</option>
                    </datalist>
                  </div>
                  <div className="mt-3">
                    <label>Type MC (MC)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={typemc || ''}  // แสดงข้อมูลเดิม ถ้าไม่มีข้อมูลให้แสดงเป็นค่าว่าง
                      onChange={(e) => setTypemc(e.target.value)}  // อัปเดตเมื่อมีการเปลี่ยนแปลง
                    />
                  </div>
                  <div>
                    <button className="btn btn-success mt-3" type="submit">
                      Save
                    </button>
                    <button className="btn btn-danger mt-3 ml-5" type="button"
                      onClick={() => handleReset()}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="content-wrapper">
          <div className="row">
            <div className="mt-3 col-3">
              <Select
                options={
                  userNumbers && userNumbers.length > 0 // ตรวจสอบว่า userNumbers มีค่าและไม่ว่าง
                    ? userNumbers.map((item) => ({
                      value: item.employee,
                      label: item.employee,
                    }))
                    : []
                }
                onChange={(selectedOption) => setSearchTerm(selectedOption.value)}
              />
            </div>
            <div className="mt-3 col-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearch} // เชื่อมต่อฟังก์ชันค้นหา
              >
               <SearchIcon/>
                SEARCH
              </button>
              <button
                type="button"
                className="btn btn-danger ml-2"
                onClick={handleReset} // เชื่อมต่อฟังก์ชันค้นหา
              >
                RESET
              <RotateLeftIcon/>
              </button>
            </div>
          </div>
        </div>

        {/* ตารางข้อมูลผู้ใช้ */}
        <div className="content-wrapper">
          <table className="mt-3 table table-bordered table-striped" id="table-qc-search1">
            <thead className="bg-dark" id="table-qc">
              <tr>
                <th className="text-white text-center">No</th>
                <th className="text-white text-center">Date Input</th>
                <th className="text-white text-center">Name (ชื่อ)</th>
                <th className="text-white text-center">Last Name (นามสกุล)</th>
                <th className="text-white text-center">Process (ส่วนงาน)</th>
                <th className="text-white text-center">Employee (รหัส)</th>
                <th className="text-white text-center">Password</th>
                <th className="text-white text-center">Permissions</th>
                <th className="text-white text-center">Type MC</th>
                <th className="text-white text-center">Name Input</th>
                <th className="text-white text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUserNumbers.length > 0 ? (
                filteredUserNumbers
                  .filter(item => item.process === "Production") // กรองเฉพาะ process ที่เป็น "Production"
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="text-center">{item.id}</td>
                      <td className="text-center">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-"}
                      </td>
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">{item.lastname}</td>
                      <td className="text-center">{item.process}</td>
                      <td className="text-center">{item.employee}</td>
                      <td className="text-center">{item.password}</td>
                      <td className="text-center">{item.permissions}</td>
                      <td className="text-center">{item.typemc}</td>
                      <td className="text-center">{item.password_input}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleEdit(item)}  // เรียกใช้ฟังก์ชัน handleEdit แทน
                          type="button"
                          className="btn btn-primary mr-3"
                        >
                          <i className="fa fa-pencil mr-2"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          type="button"
                          className="btn btn-danger"
                        >
                          <i className="fa fa-trash mr-2"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </Template>
    </>
  );
}

export default Register;
