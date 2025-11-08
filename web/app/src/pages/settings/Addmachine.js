import Template from "../components/Template";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import Select from "react-select";
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

function Addmachine() {
  const [machineNumber, setMachineNumber] = useState("");
  const [partname, setPartname] = useState("");
  const [process, setProcess] = useState("");
  const [ip_address, setIp_address] = useState("");
  const [system_no, setSystem_no] = useState();
  const [address_type, setAddress_type] = useState("");
  const [address_no, setAddress_no] = useState("");

  const [machineNumbers, setMachineNumbers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [password_input, setPassword_input] = useState("");

  const [machines, setMachines] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(""); // สร้าง state สำหรับเก็บ machine ที่เลือก
  const [filteredMachineNumbers, setFilteredMachineNumbers] = useState([]); // State สำหรับเก็บเครื่องที่กรอง

  const [searchTerm, setSearchTerm] = useState(""); // State สำหรับเก็บหมายเลขเครื่องที่ค้นหา
  const [machinesSearch, setMachinesSearch] = useState({ result: [] }); // ตั้งค่าตั้งต้นให้เหมาะสม

  const [model_noList, setModel_noList] = useState([]);
  const [process_noList, setProcess_noList] = useState([]);
  const [modelSearchTerm, setModelSearchTerm] = useState(""); // สำหรับโมเดล
  const [processSearchTerm, setProcessSearchTerm] = useState(""); // สำหรับโมเดล

  useEffect(() => {
    fetchDataMachineList();
  }, []);

  // ดึงข้อมูล password จาก localStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    const storedPassword = localStorage.getItem("userPassword"); // ดึง password จาก localStorage
    if (storedPassword) {
      setPassword_input(storedPassword); // ตั้งค่า state ของ password
    }
  }, []); // ทำงานครั้งเดียวตอน component mount

  useEffect(() => {
    getMachinesSearch();
    getModelList();
    getProcessList();
  }, []);


  // ฟังก์ชันสำหรับดึงรายการ Machine ทั้งหมด
  const fetchDataMachineList = async () => {
    try {
      const res = await axios.get(config.api_path + "/machines/list", config.headers());
      if (res.data.message === "success") {
        setMachineNumbers(res.data.results);
        setFilteredMachineNumbers(res.data.results); // ตั้งค่าความตึงเครียดตั้งต้นให้กับ filteredMachineNumbers
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const sectionOptionsTool = [
    { value: "X", label: "X" },
    { value: "Y", label: "Y" },
    { value: "R", label: "R" },
  ];

  const handleSectionChangeTool = (sectionOptionsTool) => {
    setAddress_type(sectionOptionsTool ? sectionOptionsTool.value : ""); // กำหนดค่าที่เลือกใน state
  };


  // ฟังก์ชันสำหรับเพิ่ม Machine ใหม่
  const handleMachine = async (e) => {
    e.preventDefault();
    if (machineNumber.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอกหมายเลขเครื่อง",
        icon: "error",
      });
      return;
    }
    try {
      const confirmation = await Swal.fire({
        title: "ADD MACHINE NUMBER",
        text: "โปรดยืนยันการเพิ่ม MACHINE",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (confirmation.isConfirmed) {
        // const payload = {
        //   Machine_Number: machineNumber,
        //   Partname_Model: partname,
        //   process: process,
        //   password_input: password_input,
        const payload = {
          Machine_Number: machineNumber,   // ข้อมูลจาก input สำหรับ Machine Number
          Partname_Model: modelSearchTerm, // ข้อมูลจาก Select สำหรับ Partname Model
          process: processSearchTerm,     // ข้อมูลจาก Select สำหรับ Process
          ip_address: ip_address,
          system_no: system_no,
          address_no: address_no,
          address_type: address_type,
          password_input: password_input, // ข้อมูล password ที่ดึงจาก localStorage
        };
        const response = await axios.post(config.api_path + "/machine/machineRegister", payload);
        if (response.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก MACHINE NUMBER แล้ว",
            icon: "success",
            timer: 1000,
          });
          window.location.reload();
        }
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  // ฟังก์ชันสำหรับอัปเดตข้อมูล Machine
  const handleUpdate = async (item) => {
    if (!item || !item.id) {
      Swal.fire({
        title: 'Error',
        text: 'Invalid item ID',
        icon: 'error'
      });
      return;
    }
    Swal.fire({
      title: 'อัพเดท',
      text: 'ยืนยันการอัพเดทข้อมูล',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true
    }).then(async res => {
      if (res.isConfirmed) {
        try {
          await axios.put(config.api_path + '/machines/update/' + item.id, {
            Machine_Number: machineNumber, // ใช้ค่า state ของ machineNumber
            Partname_Model: modelSearchTerm,
            process: processSearchTerm,
            ip_address: ip_address,
            system_no: system_no,
            address_no: address_no,
            address_type: address_type,
            password_input: password_input,
          }, config.headers())
            .then(res => {
              if (res.data.message === 'success') {
                Swal.fire({
                  title: 'อัพเดทข้อมูล',
                  text: 'อัพเดทข้อมูลแล้ว',
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

  const handleEditClick = (item) => {
    setSelectedItem(item); // ตั้งค่า selectedItem เป็น item ที่ต้องการแก้ไข
    setMachineNumber(item.Machine_Number); // ตั้งค่า machineNumber ใน state
    // setPartname(item.Partname_Model || ""); // ตั้งค่า partname ใน state
    setModelSearchTerm(item.Partname_Model || ""); // ตั้งค่า partname ใน state
    // setProcess(item.process || ""); // ตั้งค่า partname ใน state
    setProcessSearchTerm(item.process || ""); // ตั้งค่า partname ใน state
     setIp_address(item.ip_address || ""); 
    setSystem_no(item.system_no || ""); 
    setAddress_type(item.address_type || ""); 
    setAddress_no(item.address_no || ""); 
  };

  // ฟังก์ชันสำหรับลบข้อมูล Machine
  const handleDelete = async (item) => {
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
          await axios.delete(config.api_path + '/machines/delete/' + item.id, config.headers());
          Swal.fire({
            title: 'ลบข้อมูล',
            text: 'ลบข้อมูลแล้ว',
            icon: 'success',
            timer: 2000
          });
          window.location.reload();
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

  const getMachinesSearch = async () => {
    try {
      const response = await axios.get(config.api_path + "/machines/listSearch");
      setMachinesSearch(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณาเลือกหมายเลขเครื่องเพื่อค้นหา",
        icon: "error",
      });
      return;
    }
    const filteredMachines = machineNumbers.filter(item => item.Machine_Number === searchTerm);
    setMachineNumbers(filteredMachines);
  };

  const handleSearchReset = () => {
    window.location.reload();
  }

  const getModelList = async () => {
    try {
      const response = await axios.get(config.api_path + "/getPartModel");
      setModel_noList(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };
  const getProcessList = async () => {
    try {
      const response = await axios.get(config.api_path + "/getProcess/AddprocessAddMachine");
      setProcess_noList(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  return (
    <>
      <Template>

        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50">
            <div className="card card-outline card-success">
              <div className="card-header text-center">
                <h3>
                  <b className="fw-bold">ADD NEW MACHINE NUMBER SLEEVE ALL</b>
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="input-group">
                      <input
                        type="text"
                        onChange={(e) => setMachineNumber(e.target.value)}
                        className="col-3 form-control mr-2"
                        placeholder="Machine Number......"
                      />
                      <div className="col-5">
                        <Select
                          id="modelName"
                          options={model_noList.result && model_noList.result.length > 0 ? model_noList.result.map((item) => ({
                            value: item.Partname_Model,
                            label: item.Partname_Model,
                          })) : []}
                          onChange={(selectedOption) => setModelSearchTerm(selectedOption.value)} // ตั้งค่า modelSearchTerm
                          placeholder="Section Model..."
                        />
                      </div>
                      <div className="col-4">
                        <Select
                          id="modelName"
                          options={process_noList.result && process_noList.result.length > 0 ? process_noList.result.map((item) => ({
                            value: item.process,
                            label: item.process,
                          })) : []}
                          onChange={(selectedOption) => setProcessSearchTerm(selectedOption.value)} // ตั้งค่า modelSearchTerm
                          placeholder="Section Process..."
                        />
                      </div>
                        <div className="col-12">
                    <div className="input-group">
                      <input
                        type="text"
                        onChange={(e) => setIp_address(e.target.value)}
                        className="col-3 form-control mt-3"
                        placeholder="Ip......"
                      />
                      <input
                        type="number"
                        onChange={(e) => setSystem_no(e.target.value)}
                        className="col-3 form-control mt-3 ml-3"
                        placeholder="System No....."
                      />
                     <Select
                        id="toolNumber"
                        options={sectionOptionsTool}
                        value={sectionOptionsTool.find(option => option.value === address_type)} // กำหนดค่าเริ่มต้นให้กับ Select
                        onChange={handleSectionChangeTool} // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกตัวเลือก
                        className="col-2 mt-3 ml-3"
                        placeholder="Type..."
                      />
                      <input
                        type="text"
                        onChange={(e) => setAddress_no(e.target.value)}
                        className="col-3 form-control mt-3 ml-3"
                        placeholder="Address No......"
                      />
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="col-10">
                  <button
                    type="button"
                    onClick={handleMachine}
                    className="btn btn-success"
                  >
                    <AddIcon />
                    INSERT DATA
                  </button>
                  <Link to='/settings'>
                    <button
                      type="button"
                      className="btn btn-danger ml-3"
                    >
                      <UndoIcon />
                      BACK
                    </button>
                  </Link>
                  {/* Display the password in the input */}
                  <input
                    type="text"
                    className="ml-2 text-center"
                    id="userLogin-addmachine"
                    value={password_input} // แสดง password ที่เก็บใน localStorage
                    readOnly // ป้องกันไม่ให้แก้ไขข้อมูลนี้
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <form>
            <div className="row">
              <div className="mt-3 col-3">
                <Select
                  options={
                    machinesSearch.result && machinesSearch.result.length > 0 // ตรวจสอบว่า machinesSearch.result มีค่าและไม่ว่าง
                      ? machinesSearch.result.map((item) => ({
                        value: item.Machine_Number,
                        label: item.Machine_Number,
                      }))
                      : []
                  }
                  onChange={(selectedOption) => setSearchTerm(selectedOption.value)} // ตั้งค่า searchTerm
                />
              </div>
              <div className="mt-3 col-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSearch} // เชื่อมต่อฟังก์ชันค้นหา
                >
                  <SearchIcon />
                  SEARCH
                </button>
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={handleSearchReset} // เชื่อมต่อฟังก์ชันค้นหา
                >
                  RESET
                  <RotateLeftIcon />
                </button>
              </div>
            </div>
          </form>
          <table className="mt-3 table table-bordered table-striped">
            <thead className="bg-dark">
              <tr>
                <th className="text-white text-center">No</th>
                <th className="text-white text-center">Date Input</th>
                <th className="text-white text-center">Machine Number</th>
                <th className="text-white text-center">Partname Model</th>
                <th className="text-white text-center">Process Name</th>
                <th className="text-white text-center">Ip Address</th>
                <th className="text-white text-center">System No</th>
                <th className="text-white text-center">Address Type</th>
                <th className="text-white text-center">Address No</th>
                <th className="text-white text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {machineNumbers.length > 0
                ? machineNumbers.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-"}
                    </td>
                    <td className="text-center">{item.Machine_Number}</td>
                    <td className="text-center">{item.Partname_Model}</td>
                    <td className="text-center">{item.process}</td>
                    <td className="text-center">{item.ip_address}</td>
                    <td className="text-center">{item.system_no}</td>
                    <td className="text-center">{item.address_type}</td>
                    <td className="text-center">{item.address_no}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        data-toggle="modal"
                        data-target="#modalUpdateMachine"
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
                : ""}
            </tbody>
          </table>
        </div>
      </Template>

      {/* Modal สำหรับแก้ไขข้อมูล Machine */}
      <Modal id="modalUpdateMachine" title="" modalSize="modal-lg">
        <div className="col-12 mb-3 update-part-name">
          <h3>UPDATE MACHINE NUMBER AND MODEL NAME</h3>
        </div>
        <div className="row">
          <div className="col-3 mt-3">
            <label>Machine Number</label>
            <input
              type="text"
              className="form-control"
              value={machineNumber}
              onChange={(e) => setMachineNumber(e.target.value)}
            />
          </div>
          <div className="col-4 mt-3">
            <label>Model Name</label>
            <Select
              id="modelName"
              options={model_noList.result && model_noList.result.length > 0 ? model_noList.result.map((item) => ({
                value: item.Partname_Model,
                label: item.Partname_Model,
              })) : []}
              value={modelSearchTerm ? { value: modelSearchTerm, label: modelSearchTerm } : null} // กำหนดค่าที่เลือกจาก state หรือ null ถ้าไม่มี
              onChange={(selectedOption) => setModelSearchTerm(selectedOption.value)} // เมื่อเลือกค่าจาก dropdown
              placeholder="Select Model Name"
            />
          </div>
          <div className="col-4 mt-3">
            <label>Process</label>
            <Select
              id="modelName"
              options={process_noList.result && process_noList.result.length > 0 ? process_noList.result.map((item) => ({
                value: item.process,
                label: item.process,
              })) : []}
              value={processSearchTerm ? { value: processSearchTerm, label: processSearchTerm } : null} // กำหนดค่าที่เลือกจาก state หรือ null ถ้าไม่มี
              onChange={(selectedOption) => setProcessSearchTerm(selectedOption.value)} // ตั้งค่า modelSearchTerm
              placeholder="Section Process..."
            />
          </div>
            <div className="col-3 mt-3">
            <label>Ip Address</label>
            <input
              // type="text"
              className="form-control"
              value={ip_address}
              onChange={(e) => setIp_address(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>System No</label>
            <input
              type="number"
              className="form-control"
              value={system_no}
              onChange={(e) => setSystem_no(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Address Type</label>
            <input
              type="text"
              className="form-control"
              value={address_type}
              onChange={(e) => setAddress_type(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Address No</label>
            <input
              type="text"
              className="form-control"
              value={address_no}
              onChange={(e) => setAddress_no(e.target.value)}
            />
          </div>

        </div>
        <div className="mt-3">
          <button
            className="btn btn-success"
            onClick={() => handleUpdate(selectedItem)}
          >
            Update
            <i className="fa fa-cloud-arrow-up ml-3"></i>
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Addmachine;
