import Template from "../components/Template";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import Select from "react-select";
import UndoIcon from '@mui/icons-material/Undo';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';


function AddMasterToolNumberTB() {
  const [Machine_Number, setMachine_Number] = useState("");
  const [Partname_Model, setPartname_Model] = useState("");
  const [process, setProcess] = useState("");
  const [tool_no, setTool_no] = useState("");
  const [section_check, setSection_check] = useState("");
  const [spec_tool_no, setSpec_tool_no] = useState("");
  const [machineNumbers, setMachineNumbers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [idNumber, setIdNumber] = useState();
  const [password_input, setPassword_input] = useState("");

  const [toolSearchTerm, setToolSearchTerm] = useState(""); // สำหรับเก็บหมายเลขเครื่องมือที่ค้นหา

  const [machines, setMachines] = useState([]);
  const [tool_noSearch, setTool_noSearch] = useState([]);

  const [selectedMachine, setSelectedMachine] = useState(""); // สร้าง state สำหรับเก็บ machine ที่เลือก
  const [filteredMachineNumbers, setFilteredMachineNumbers] = useState([]); // State สำหรับเก็บเครื่องที่กรอง

  const [machineSearchTerm, setMachineSearchTerm] = useState(""); // สำหรับเครื่องจักร
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [processSearchTerm, setProcessSearchTerm] = useState(""); // สำหรับโมเดล // สำหรับโมเดล
  const [model_noList, setModel_noList] = useState([]);
  const [process_noList, setProcess_noList] = useState([]);
  const [model_noSearch, setModel_noSearch] = useState([]);
  const [partnameModelSearchTerm, setPartnameModelSearchTerm] = useState(""); // New state for Partname_Model

  const sectionOptionsTool = [
    { value: "T01", label: "T01" },
    { value: "T02", label: "T02" },
    { value: "T03", label: "T03" },
    { value: "T04", label: "T04" },
    { value: "T05", label: "T05" },
    { value: "T06", label: "T06" },
    { value: "T07", label: "T07" },
    { value: "T08", label: "T08" },
    { value: "T09", label: "T09" },
    { value: "T10", label: "T10" },
    { value: "T11", label: "T11" },
    { value: "T12", label: "T12" },
    { value: "T13", label: "T13" },
    { value: "T14", label: "T14" },
    { value: "T15", label: "T15" },
    { value: "T16", label: "T16" },
    { value: "T17", label: "T17" },
    { value: "T18", label: "T18" },
    { value: "T19", label: "T19" },
    { value: "T20", label: "T20" },
    { value: "T21", label: "T21" },
    { value: "T22", label: "T22" },
    { value: "T23", label: "T23" },
    { value: "T24", label: "T24" },
    { value: "T25", label: "T25" },
    { value: "T26", label: "T26" },
    { value: "T27", label: "T27" },
    { value: "T28", label: "T28" },
    { value: "T29", label: "T29" },
    { value: "T30", label: "T30" },
    { value: "T31", label: "T31" },
    { value: "T32", label: "T32" },
    { value: "T33", label: "T33" },
    { value: "T34", label: "T34" },
    { value: "T35", label: "T35" },
    { value: "T36", label: "T36" },
    { value: "T37", label: "T37" },
    { value: "T38", label: "T38" },
    { value: "T39", label: "T39" },
    { value: "T40", label: "T40" },
    { value: "T41", label: "T41" },
    { value: "T42", label: "T42" },
  ];


  // ฟังก์ชันสำหรับการเลือกค่าใน dropdown
  const handleSectionChangeTool = (sectionOptionsTool) => {
    setTool_no(sectionOptionsTool ? sectionOptionsTool.value : ""); // กำหนดค่าที่เลือกใน state
  };

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
    getMachines(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูกสร้าง
    getModelList();
    getModelSearch();
    getProcessList();
  }, []); // ตรวจสอบว่า useEffect ถูกตั้งค่าถูกต้อง

  const getMachines = async () => {
    try {
      const response = await axios.get(
        config.api_path + "/masterSpecQcLine/listSearchTypeMC"
      );
      if (response.data.message === "success") {
        setMachines(response.data.result); // ตั้งค่า state เป็นข้อมูลเครื่องจักรที่ดึงมา
        console.log("Fetched machines:", response.data.result); // ตรวจสอบค่าที่ดึงมา
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const getModelList = async () => {
    try {
      const response = await axios.get(config.api_path + "/getPartModelShaft");
      setModel_noList(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const getProcessList = async () => {
    try {
      const response = await axios.get(config.api_path + "/getProcess");
      setProcess_noList(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const getModelSearch = async () => {
    try {
      const response = await axios.get(config.api_path + "/getPartModelShaft");
      setModel_noSearch(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  // ฟังก์ชันสำหรับเพิ่ม Machine ใหม่
  const handleMasterToolNumber = async (e) => {

   // เพิ่ม console.log เพื่อตรวจสอบค่าของ machineSearchTerm, modelSearchTerm, และ toolSearchTerm
   console.log("Machine Type:", machineSearchTerm);
   console.log("Model Name:", modelSearchTerm);
   console.log("Tool Number:", tool_no);  // ตรวจสอบค่า tool_no ว่ามีค่าอะไร

   if (machineSearchTerm === "" || modelSearchTerm === "" || tool_no === "") {
       Swal.fire({
           title: "กรุณากรอกข้อมูล",
           text: "กรุณากรอกข้อมูลให้ครบถ้วน",
           icon: "warning",
       });
       return;
   }

    try {
      const confirmation = await Swal.fire({
        title: "ADD MASTER SPEC",
        text: "โปรดยืนยันการเพิ่ม SPEC",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (confirmation.isConfirmed) {
        const payload = {
          Machine_Number: machineSearchTerm,
          Partname_Model: modelSearchTerm,
          process: processSearchTerm,
          tool_no: tool_no,
          password_input: password_input,
        };
        const response = await axios.post(
          config.api_path + "/masterToolNumber/masterToolNumberInsertTB",
          payload
        );
        if (response.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก SPEC แล้ว",
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

  const fetchDataMachineList = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/masterToolNumber/masterToolNumberListTB",
        config.headers()
      );
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

  // ฟังก์ชันสำหรับอัปเดตข้อมูล Machine
  const handleUpdate = async (item) => {
    if (!item || !item.id) {
      Swal.fire({
        title: "Error",
        text: "Invalid item ID",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "อัพเดท",
      text: "ยืนยันการอัพเดทข้อมูล",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .put(
              config.api_path + "/masterToolNumber/updateTB/" + item.id,
              {
                Machine_Number: Machine_Number, // ใช้ค่า state ของ machineNumber
                Partname_Model: Partname_Model,
                process: process,
                tool_no: tool_no,
                password_input: password_input,
              },
              config.headers()
            )
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  title: "อัพเดทข้อมูล",
                  text: "อัพเดทข้อมูลแล้ว",
                  icon: "success",
                  timer: 2000,
                });
                window.location.reload();
              }
            });
        } catch (e) {
          Swal.fire({
            title: "Error",
            text: e.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleEditClick = (item) => {
    setSelectedItem(item); // ตั้งค่า selectedItem เป็น item ที่ต้องการแก้ไข
    setIdNumber(item.id || ""); // ตั้งค่า selectedItem เป็น item ที่ต้องการแก้ไข
    setMachine_Number(item.Machine_Number || ""); // ตั้งค่า machineNumber ใน state
    setPartname_Model(item.Partname_Model || ""); // ตั้งค่า partname ใน state
    setProcess(item.process || ""); // ตั้งค่า partname ใน state
    setTool_no(item.tool_no || "");
  };

  // ฟังก์ชันสำหรับลบข้อมูล Machine
  const handleDelete = async (item) => {
    if (!item || !item.id) {
      Swal.fire({
        title: "Error",
        text: "Invalid item ID",
        icon: "error",
      });
      return;
    }
    Swal.fire({
      title: "ลบข้อมูล",
      text: "ยืนยันการลบข้อมูลออกจากระบบ",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(
            config.api_path + "/machinesToolNumber/deleteTB/" + item.id,
            config.headers()
          );
          Swal.fire({
            title: "ลบข้อมูล",
            text: "ลบข้อมูลแล้ว",
            icon: "success",
            timer: 2000,
          });
          window.location.reload();
        } catch (e) {
          Swal.fire({
            title: "Error",
            text: e.message,
            icon: "error",
          });
        }
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState(""); // State สำหรับเก็บหมายเลขเครื่องที่ค้นหา
  const [machinesSearch, setMachinesSearch] = useState({ result: [] }); // ตั้งค่าตั้งต้นให้เหมาะสม

  useEffect(() => {
    getToolNumberSearch();
  }, []);

  const getToolNumberSearch = async () => {
    try {
      const response = await axios.get(
        config.api_path + "/machinesToolNumber/listSearchTool"
      );
      setTool_noSearch(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "" && toolSearchTerm.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณาเลือกหมายเลขเครื่องหรือหมายเลขเครื่องมือเพื่อค้นหา",
        icon: "error",
      });
      return;
    }

    const filteredMachines = machineNumbers.filter((item) => {
      const matchesMachineNumber = searchTerm ? item.Machine_Number === searchTerm : true;
      // const matchesToolNumber = toolSearchTerm ? item.tool_no === toolSearchTerm : true;
      const matchesPartnameModel = partnameModelSearchTerm ? item.Partname_Model === partnameModelSearchTerm : true;
      return matchesMachineNumber && matchesPartnameModel; // ต้องตรงทั้งสองเงื่อนไข
    });

    setMachineNumbers(filteredMachines); // อัปเดต machineNumbers ด้วยค่าที่กรอง
  };

  const handleSearchReset = () => {
    window.location.reload();
  };

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50">
            <div className="card card-outline card-success">
              <div className="card-header text-center">
                <h3>
                  <b className="fw-bold">ADD NEW MASTER TOOL NUMBER ( TB MACHINE )</b>
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="input-group">
                    <div className="col-2">
                        <Select
                          id="machineType"
                          options={machines.length > 0 ? machines.map((item) => ({
                            value: item.machine_type,
                            label: item.machine_type,
                          })) : []}
                          onChange={(selectedOption) => setMachineSearchTerm(selectedOption.value)} // ตั้งค่า machineSearchTerm
                          placeholder="MC..."
                        />
                      </div>
                      <div className="col-5">
                        <Select
                          id="modelName"
                          options={model_noList.result && model_noList.result.length > 0 ? model_noList.result.map((item) => ({
                            value: item.Partname_Model,
                            label: item.Partname_Model,
                          })) : []}
                          onChange={(selectedOption) => setModelSearchTerm(selectedOption.value)} // ตั้งค่า modelSearchTerm
                          placeholder="Model..."
                        />
                      </div>
                      <div className="col-3">
                        <Select
                          id="modelName"
                          options={process_noList.result && process_noList.result.length > 0 ? process_noList.result.map((item) => ({
                            value: item.process,
                            label: item.process,
                          })) : []}
                          onChange={(selectedOption) => setProcessSearchTerm(selectedOption.value)} // ตั้งค่า modelSearchTerm
                          placeholder="Process..."
                        />
                      </div>
                      <Select
                        id="toolNumber"
                        options={sectionOptionsTool}
                        value={sectionOptionsTool.find(option => option.value === tool_no)} // กำหนดค่าเริ่มต้นให้กับ Select
                        onChange={handleSectionChangeTool} // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกตัวเลือก
                        className="col-2"
                        placeholder="Tool..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="col-7">
                  <button
                    type="button"
                    onClick={handleMasterToolNumber}
                    className="btn btn-success"
                  >
                   <AddIcon/>
                    INSERT DATA
                  </button>
                  <Link to="/settings">
                    <button type="button" className="btn btn-danger ml-3"
                    >
                    <UndoIcon/>
                      BACK
                    </button>
                  </Link>
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
              <div className="mt-3 col-2">
                <Select
                  options={
                    machines.length > 0 // ตรวจสอบว่า machines มีค่าและไม่ว่าง
                      ? machines.map((item) => ({
                          value: item.machine_type, // ใช้ Machine_type
                          label: item.machine_type, // ใช้ Machine_type ใน label
                        }))
                      : []
                  }
                  onChange={(selectedOption) =>
                    setSearchTerm(selectedOption.value)
                  } // ตั้งค่า searchTerm
                  placeholder="Section MC..."
                />
              </div>
              <div className="mt-3 col-3">
                <Select
                  options={
                    model_noSearch.result && model_noSearch.result.length > 0 // ตรวจสอบว่า machinesSearch.result มีค่าและไม่ว่าง
                      ? model_noSearch.result.map((item) => ({
                        value: item.Partname_Model, // เปลี่ยนให้ใช้ tool_no แทน
                        label: item.Partname_Model, // ใช้ tool_no ใน label
                      }))
                      : []
                  }
                  onChange={(selectedOption) => setPartnameModelSearchTerm(selectedOption.value)} // ตั้งค่า toolSearchTerm
                  placeholder="Section Model..."
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
                  onClick={handleSearchReset} // เชื่อมต่อฟังก์ชันค้นหา
                >
                  <RotateLeftIcon/>
                  RESET
                </button>
              </div>
            </div>
          </form>
          <table className="mt-3 table table-bordered table-striped">
            <thead className="bg-dark">
              <tr>
                <th className="text-white text-center">No.</th>
                <th className="text-white text-center">Date Input</th>
                <th className="text-white text-center">Machine Type</th>
                <th className="text-white text-center">Partname Model</th>
                <th className="text-white text-center">Process</th>
                <th className="text-white text-center">Tool No</th>
                <th className="text-white text-center">Password input</th>
                <th className="text-white text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {machineNumbers.length > 0 ? (
                machineNumbers.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-"}
                    </td>
                    <td className="text-center">{item.Machine_Number}</td>
                    <td className="text-center">{item.Partname_Model}</td>
                    <td className="text-center">{item.process}</td>
                    <td className="text-center">{item.tool_no}</td>
                    <td className="text-center">{item.password_input}</td>
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
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    ไม่มีข้อมูลที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Template>

      {/* Modal สำหรับแก้ไขข้อมูล Machine */}
      <Modal id="modalUpdateMachine" title="" modalSize="modal-lg">
        <div className="col-12 mb-3 update-part-name">
          <h3>UPDATE MASTER TOOL NUMBER</h3>
        </div>
        <div className="row">
          <div className="col-2 mt-3">
            <label>Machine</label>
            <input
              type="text"
              className="form-control"
              value={Machine_Number}
              onChange={(e) => setMachine_Number(e.target.value)}
            />
          </div>
          <div className="col-4 mt-3">
            <label>Model Name</label>
            <input
              type="text"
              className="form-control"
              value={Partname_Model}
              onChange={(e) => setPartname_Model(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Process</label>
            <input
              type="text"
              className="form-control"
              value={process}
              onChange={(e) => setProcess(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Tool Number</label>
            <input
              type="text"
              className="form-control"
              value={tool_no}
              onChange={(e) => setTool_no(e.target.value)}
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

export default AddMasterToolNumberTB;