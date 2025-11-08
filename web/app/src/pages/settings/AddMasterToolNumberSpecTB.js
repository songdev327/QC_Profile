import Template from "../components/Template";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import { AiFillFileExcel } from "react-icons/ai"; // นำเข้าไอคอน Excel
import Select from "react-select";
import UndoIcon from "@mui/icons-material/Undo";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import * as XLSX from "xlsx";

function AddMasterToolNumberSpecTB() {
  const [Machine_Number, setMachine_Number] = useState("");
  const [Partname_Model, setPartname_Model] = useState("");
  const [process, setProcess] = useState("");
  const [tool_no, setTool_no] = useState("");
  const [section_check, setSection_check] = useState("");
  const [spec_tool_no, setSpec_tool_no] = useState("");
  const [rev_control, setRev_control] = useState("");
  const [part_no, setPart_no] = useState("");
  const [machineNumbers, setMachineNumbers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [idNumber, setIdNumber] = useState();
  const [password_input, setPassword_input] = useState("");

  const [spec_center, setSpec_center] = useState("");
  const [date_control, setDate_control] = useState("");
  const [div_control, setDiv_control] = useState("");
  const [sequence_number_spec, setSequence_number_spec] = useState();
  const [mesering_type, setMesering_type] = useState("");

  const [toolSearchTerm, setToolSearchTerm] = useState(""); // สำหรับเก็บหมายเลขเครื่องมือที่ค้นหา
  const [partnameModelSearchTerm, setPartnameModelSearchTerm] = useState(""); // New state for Partname_Model

  const [machines, setMachines] = useState([]);
  const [tool_noSearch, setTool_noSearch] = useState([]);
  const [model_noSearch, setModel_noSearch] = useState([]);
  const [process_noList, setProcess_noList] = useState([]);

  const [selectedMachine, setSelectedMachine] = useState(""); // สร้าง state สำหรับเก็บ machine ที่เลือก
  const [filteredMachineNumbers, setFilteredMachineNumbers] = useState([]); // State สำหรับเก็บเครื่องที่กรอง

  const [machineSearchTerm, setMachineSearchTerm] = useState(""); // สำหรับเครื่องจักร
  const [modelSearchTerm, setModelSearchTerm] = useState(""); // สำหรับโมเดล
  const [processSearchTerm, setProcessSearchTerm] = useState(""); // สำหรับโมเดล
  const [model_noList, setModel_noList] = useState([]);

  const [searchResult, setSearchResult] = useState(null); // สร้าง state เก็บผลลัพธ์การค้นหา

  // ตัวเลือกที่จะแสดงใน Select
  const sectionOptions = [
    { value: "Production Check", label: "Production Check" },
    { value: "QC Line Check", label: "QC Line Check" },
    { value: "QC In process", label: "QC In process" },
  ];
  const sectionOptionsDiv = [
    { value: "PCMB", label: "PCMB" },
    { value: "PCMS", label: "PCMS" },
  ];

  const sectionOptionsMesering = [
    { value: "Contour", label: "Contour" },
    { value: "Rondcom", label: "Rondcom" },
    { value: "Sulfcom", label: "Sulfcom" },
    { value: "Talysurf", label: "Talysurf" },
  ];

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

  // ฟังก์ชันสำหรับการเลือกค่าใน dropdown
  const handleSectionChange = (selectedOption) => {
    setSection_check(selectedOption ? selectedOption.value : ""); // กำหนดค่าที่เลือกใน state
  };

  const handleSectionChangeDiv = (selectedOptionDiv) => {
    setDiv_control(selectedOptionDiv ? selectedOptionDiv.value : ""); // กำหนดค่าที่เลือกใน state
  };

  const handleSectionChangeMesering = (sectionOptionsMesering) => {
    setMesering_type(sectionOptionsMesering ? sectionOptionsMesering.value : ""); // กำหนดค่าที่เลือกใน state
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

  // ฟังก์ชันสำหรับเพิ่ม Machine ใหม่
  const handleMasterSpecQcLine = async (e) => {
    e.preventDefault();
    if (
      document.getElementById("machineType").value === "" ||
      document.getElementById("modelName").value === "" ||
      document.getElementById("toolNumber").value === "" ||
      document.getElementById("sectionCheck").value === "" ||
      document.getElementById("specToolNumber").value === "" ||
      document.getElementById("revControl").value === "" ||
      document.getElementById("partNo").value === ""
    ) {
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
          section_check: section_check,
          spec_tool_no: spec_tool_no,
          rev_control: rev_control,
          part_no: part_no,
          password_input: password_input,
          spec_center: spec_center,
          date_control: date_control,
          div_control: div_control,
          sequence_number_spec: sequence_number_spec,
          mesering_type: mesering_type,

        };
        const response = await axios.post(
          config.api_path + "/masterNumber/masterNumberSpecToolInsertTB",
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
        config.api_path + "/masterNumber/masterNumberSpecNumberToolListTB",
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
              config.api_path +
                "/masterNumber/masterNumberSpecNumberToolupdateTB/" +
                item.id,
              {
                Machine_Number: Machine_Number,
                Partname_Model: Partname_Model,
                process: process,
                tool_no: tool_no,
                section_check: section_check,
                spec_tool_no: spec_tool_no,
                rev_control: rev_control,
                part_no: part_no,
                password_input: password_input,
                spec_center: spec_center,
                date_control: date_control,
                div_control: div_control,
                sequence_number_spec: sequence_number_spec,
                mesering_type: mesering_type,
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
    setSection_check(item.section_check || "");
    setSpec_tool_no(item.spec_tool_no || "");
    setRev_control(item.rev_control || "");
    setPart_no(item.part_no || "");
    setSpec_center(item.spec_center || "");
    setDate_control(item.date_control || "");
    setDiv_control(item.div_control || "");
    setSequence_number_spec(item.sequence_number_spec || "");
    setMesering_type(item.mesering_type || "");
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
            config.api_path +
              "/masterNumber/masterNumberSpecNumberTooldeleteTB/" +
              item.id,
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
    getModelSearch();
    getModelList();
    getProcessList();
  }, []);

  const getModelList = async () => {
    try {
      const response = await axios.get(config.api_path + "/getPartModelShaft");
      setModel_noList(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const getToolNumberSearch = async () => {
    try {
      const response = await axios.get(
        config.api_path + "/masterSpecTool/masterSpecToolSearchTB"
      );
      setTool_noSearch(response.data);
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

  const getProcessList = async () => {
    try {
      const response = await axios.get(config.api_path + "/getProcess");
      setProcess_noList(response.data);
      console.log("Machines Search Response:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleSearch = () => {
    if (
      searchTerm.trim() === "" &&
      toolSearchTerm.trim() === "" &&
      partnameModelSearchTerm.trim() === ""
    ) {
      Swal.fire({
        title: "Error",
        text: "กรุณาเลือก Type Machine. & Model. เพื่อค้นหา",
        icon: "error",
      });
      return;
    }

    const filteredMachines = machineNumbers.filter((item) => {
      const matchesMachineNumber = searchTerm
        ? item.Machine_Number === searchTerm
        : true;
      const matchesToolNumber = toolSearchTerm
        ? item.tool_no === toolSearchTerm
        : true;
      const matchesPartnameModel = partnameModelSearchTerm
        ? item.Partname_Model === partnameModelSearchTerm
        : true;
      return matchesMachineNumber && matchesToolNumber && matchesPartnameModel;
    });

    console.log("Filtered Machines:", filteredMachines);

    if (filteredMachines.length > 0) {
      const firstResult = filteredMachines[0];

      console.log("First Result:", firstResult);

    // รวม spec_tool_no กับ section_check
      // ดึงและเรียงข้อมูล specifications ตาม sequence_number_spec
      const sortedSpecifications = filteredMachines
        .filter((item) => item.sequence_number_spec !== undefined)
        .sort((a, b) => a.sequence_number_spec - b.sequence_number_spec)
        .map(
          (item) =>
            `${item.section_check || "Default Section"} , ${
              item.spec_tool_no || "Default Spec"
            }`
        );

      setSearchResult({
        ...firstResult,
        specifications:
          sortedSpecifications.length > 0
            ? sortedSpecifications
            : ["Default Spec"],
      });
      // เพิ่ม timer และ timerProgressBar เพื่อปิดแจ้งเตือนอัตโนมัติ
      Swal.fire({
        title: "Success",
        text: "Data found!",
        icon: "success",
        timer: 1000, // กำหนดเวลาในหน่วยมิลลิวินาที (2 วินาที)
        timerProgressBar: true, // เพิ่มแถบแสดงเวลานับถอยหลัง
        showConfirmButton: false, // ซ่อนปุ่ม OK
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "No data found!",
        icon: "error",
      });
    }

    setMachineNumbers(filteredMachines); // อัปเดต machineNumbers ด้วยค่าที่กรอง
  };

  const handleSearchReset = () => {
    window.location.reload();
  };

  const exportToExcel = () => {
    // ตรวจสอบว่าผู้ใช้งานกรอกข้อมูลครบหรือไม่
    if (!searchTerm || !partnameModelSearchTerm) {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอกข้อมูลในฟิลด์ Section MC และ Section Model ก่อนส่งออกไฟล์ Excel",
        icon: "error",
      });
      return;
    }
    if (machineNumbers.length === 0) {
      Swal.fire({
        title: "Error",
        text: "ไม่มีข้อมูลสำหรับส่งออก",
        icon: "error",
      });
      return;
    }

    // กำหนดหัวตารางและข้อมูล
    const headers = [
      [
        "Date",
        "Machine Number",
        "Partname Model",
        "Process",
        "Tool No",
        "Section check",
        "Spec check",
        "Rev",
        "Part no",
        "Name input",
      ],
    ];
    const data = machineNumbers.map((item) => [
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB")
        : "-",
      item.Machine_Number,
      item.Partname_Model,
      item.process,
      item.tool_no,
      item.section_check,
      item.spec_tool_no,
      item.rev_control,
      item.part_no,
      item.password_input,
    ]);

    // รวมหัวตารางและข้อมูล
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // สร้างและบันทึกไฟล์
    XLSX.writeFile(workbook, "Exported_Data.xlsx");
  };

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50">
            <div className="card card-outline card-success">
              <div className="card-header text-center">
                <h3>
                  <b className="fw-bold">
                    ADD NEW MASTER TOOL NUMBER SPEC ( TB MACHINE )
                  </b>
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="input-group">
                      <div className="col-2">
                        <Select
                          id="machineType"
                          options={
                            machines.length > 0
                              ? machines.map((item) => ({
                                  value: item.machine_type,
                                  label: item.machine_type,
                                }))
                              : []
                          }
                          onChange={(selectedOption) =>
                            setMachineSearchTerm(selectedOption.value)
                          } // ตั้งค่า machineSearchTerm
                          placeholder="MC..."
                        />
                      </div>
                      <div className="col-5">
                        <Select
                          id="modelName"
                          options={
                            model_noList.result &&
                            model_noList.result.length > 0
                              ? model_noList.result.map((item) => ({
                                  value: item.Partname_Model,
                                  label: item.Partname_Model,
                                }))
                              : []
                          }
                          onChange={(selectedOption) =>
                            setModelSearchTerm(selectedOption.value)
                          } // ตั้งค่า modelSearchTerm
                          placeholder="Section Model..."
                        />
                      </div>
                      <div className="col-3">
                        <Select
                          id="modelName"
                          options={
                            process_noList.result &&
                            process_noList.result.length > 0
                              ? process_noList.result.map((item) => ({
                                  value: item.process,
                                  label: item.process,
                                }))
                              : []
                          }
                          onChange={(selectedOption) =>
                            setProcessSearchTerm(selectedOption.value)
                          } // ตั้งค่า modelSearchTerm
                          placeholder="Process..."
                        />
                      </div>
                      <Select
                        id="toolNumber"
                        options={sectionOptionsTool}
                        value={sectionOptionsTool.find(
                          (option) => option.value === tool_no
                        )} // กำหนดค่าเริ่มต้นให้กับ Select
                        onChange={handleSectionChangeTool} // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกตัวเลือก
                        className="col-2"
                        placeholder="Tool..."
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="input-group">
                      <Select
                        id="sectionCheck"
                        options={sectionOptions}
                        value={sectionOptions.find(
                          (option) => option.value === section_check
                        )} // กำหนดค่าเริ่มต้นให้กับ Select
                        onChange={handleSectionChange} // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกตัวเลือก
                        className="col-4 mt-3"
                        placeholder="Select Section..."
                      />
                      <input
                        id="specToolNumber"
                        type="text"
                        onChange={(e) => setSpec_tool_no(e.target.value)}
                        className="col-6 form-control mt-3 ml-2"
                        placeholder="Spec........."
                      />
                      <input
                        id="revControl"
                        type="text"
                        onChange={(e) => setRev_control(e.target.value)}
                        className="col-2 form-control mt-3 ml-2 mr-2"
                        placeholder="Rev........."
                      />
                    </div>
                    <div className="col-12">
                      <div className="input-group">
                        <input
                          id="partNo"
                          type="text"
                          onChange={(e) => setPart_no(e.target.value)}
                          className="col-3 form-control mt-3"
                          placeholder="Part no........."
                        />
                        <input
                          type="text"
                          onChange={(e) => setSpec_center(e.target.value)}
                          className="col-3 form-control mt-3 ml-2"
                          placeholder="Spec center........."
                        />
                        <input
                          type="text"
                          onChange={(e) => setDate_control(e.target.value)}
                          className="col-3 form-control mt-3 ml-2"
                          placeholder="Date control........."
                        />
                        <Select
                          id="sectionCheck"
                          options={sectionOptionsDiv}
                          value={sectionOptionsDiv.find(
                            (option) => option.value === div_control
                          )} // กำหนดค่าเริ่มต้นให้กับ Select
                          onChange={handleSectionChangeDiv} // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกตัวเลือก
                          className="col-3 mt-3 ml-1"
                          placeholder="Div......"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                    <div className="input-group">
                      <input
                        type="number"
                        onChange={(e) => setSequence_number_spec(e.target.value)}
                        className="col-3 form-control mt-3"
                        placeholder="No Spec........."
                      />

                      <Select
                        id="sectionCheck"
                        options={sectionOptionsMesering}
                        value={sectionOptionsMesering.find(
                          (option) => option.value === mesering_type
                        )} // กำหนดค่าเริ่มต้นให้กับ Select
                        onChange={handleSectionChangeMesering} // ฟังก์ชันที่ถูกเรียกเมื่อมีการเลือกตัวเลือก
                        className="col-3 mt-3"
                        placeholder="Mesering......"
                      />
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="col-6">
                  <button
                    type="button"
                    onClick={handleMasterSpecQcLine}
                    className="btn btn-success"
                  >
                    <AddIcon />
                    INSERT DATA
                  </button>
                  <Link to="/settings">
                    <button type="button" className="btn btn-danger ml-3">
                      <UndoIcon />
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
              <div className="mt-3 col-1">
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
                  placeholder="MC..."
                />
              </div>
              <div className="mt-3 col-2">
                <Select
                  options={
                    tool_noSearch.result && tool_noSearch.result.length > 0 // ตรวจสอบว่า machinesSearch.result มีค่าและไม่ว่าง
                      ? tool_noSearch.result.map((item) => ({
                          value: item.tool_no, // เปลี่ยนให้ใช้ tool_no แทน
                          label: item.tool_no, // ใช้ tool_no ใน label
                        }))
                      : []
                  }
                  onChange={(selectedOption) =>
                    setToolSearchTerm(selectedOption.value)
                  } // ตั้งค่า toolSearchTerm
                  placeholder="Tool..."
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
                  onChange={(selectedOption) =>
                    setPartnameModelSearchTerm(selectedOption.value)
                  } // ตั้งค่า toolSearchTerm
                  placeholder="Section Model..."
                />
              </div>
              <div className="mt-3 col-6">
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
                  <RotateLeftIcon />
                  RESET
                </button>
                <button
                  type="button"
                  className="btn btn-success ml-3"
                  // id="export"
                  onClick={exportToExcel} // เชื่อมต่อฟังก์ชัน exportToExcel
                >
                  <AiFillFileExcel style={{ marginRight: "5px" }} />
                  EXPORT TO EXCEL
                </button>
                <Link
                  to="/toolingFormAuditTBS"
                  state={{
                    Machine_Number:
                      searchResult?.Machine_Number || "Default Machine",
                    Partname_Model:
                      searchResult?.Partname_Model || "Default Part Name",
                    process: searchResult?.process || "Default Process",
                    tool_no: searchResult?.tool_no || "Default Tool No",
                    part_no: searchResult?.part_no || "Default Part no",
                    rev_control: searchResult?.rev_control || "Default Rev",
                    date_control: searchResult?.date_control || "Default Date",
                    div_control: searchResult?.div_control || "Default Div",
                    section_check:
                      searchResult?.section_check || "Default Section",
                    specifications: searchResult?.specifications || [
                      "Default Spec (Default Section)",
                    ],
                  }}
                >
                  <button type="button" className="btn btn-success ml-3">
                    FORM AUDIT
                  </button>
                </Link>
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
                <th className="text-white text-center">Section check</th>
                <th className="text-white text-center">Spec check</th>
                <th className="text-white text-center">Rev</th>
                <th className="text-white text-center">Part no</th>
                <th className="text-white text-center">Spec center</th>
                <th className="text-white text-center">Date control</th>
                <th className="text-white text-center">Div</th>
                <th className="text-white text-center">No Spec</th>
                <th className="text-white text-center">Mesering</th>
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
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString("en-GB", {
                            hour12: false,
                          })
                        : "-"}
                    </td>
                    <td className="text-center">{item.Machine_Number}</td>
                    <td className="text-center">{item.Partname_Model}</td>
                    <td className="text-center">{item.process}</td>
                    <td className="text-center">{item.tool_no}</td>
                    <td className="text-center">{item.section_check}</td>
                    <td className="text-center">{item.spec_tool_no}</td>
                    <td className="text-center">{item.rev_control}</td>
                    <td className="text-center">{item.part_no}</td>
                    <td className="text-center">{item.spec_center}</td>
                    <td className="text-center">{item.date_control}</td>
                    <td className="text-center">{item.div_control}</td>
                    <td className="text-center">{item.sequence_number_spec}</td>
                    <td className="text-center">{item.mesering_type}</td>
                    <td className="text-center">{item.password_input}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        data-toggle="modal"
                        data-target="#modalUpdateMachine"
                        type="button"
                        className="btn btn-primary mr-3"
                      >
                        <i className="fa fa-pencil mr-1"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        type="button"
                        className="btn btn-danger"
                      >
                        <i className="fa fa-trash mr-1"></i> Delete
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
          <h3>UPDATE MASTER SPEC</h3>
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
          <div className="col-3 mt-3">
            <label>Section check</label>
            <input
              type="text"
              className="form-control"
              value={section_check}
              onChange={(e) => setSection_check(e.target.value)}
            />
          </div>
          <div className="col-5 mt-3">
            <label>Spec check</label>
            <input
              type="text"
              className="form-control"
              value={spec_tool_no}
              onChange={(e) => setSpec_tool_no(e.target.value)}
            />
          </div>
          <div className="col-1 mt-3">
            <label>Rev</label>
            <input
              type="text"
              className="form-control"
              value={rev_control}
              onChange={(e) => setRev_control(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Part no</label>
            <input
              type="text"
              className="form-control"
              value={part_no}
              onChange={(e) => setPart_no(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Spec center</label>
            <input
              type="text"
              className="form-control"
              value={spec_center}
              onChange={(e) => setSpec_center(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Date control</label>
            <input
              type="text"
              className="form-control"
              value={date_control}
              onChange={(e) => setDate_control(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Div</label>
            <input
              type="text"
              className="form-control"
              value={div_control}
              onChange={(e) => setDiv_control(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>No Spec</label>
            <input
              type="number"
              className="form-control"
              value={sequence_number_spec}
              onChange={(e) => setSequence_number_spec(e.target.value)}
            />
          </div>
          <div className="col-3 mt-3">
            <label>Mesering</label>
            <input
              type="text"
              className="form-control"
              value={mesering_type}
              onChange={(e) => setMesering_type(e.target.value)}
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

export default AddMasterToolNumberSpecTB;
