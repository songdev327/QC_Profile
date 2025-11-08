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

function AddMasterSpecQcLine() {
    const [Machine_Number, setMachine_Number] = useState("");
    const [Partname_Model, setPartname_Model] = useState("");
    const [tool_no, setTool_no] = useState("");
    const [spec, setSpec] = useState("");
    const [machineNumbers, setMachineNumbers] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [idNumber, setIdNumber] = useState();

    const [toolSearchTerm, setToolSearchTerm] = useState(""); // สำหรับเก็บหมายเลขเครื่องมือที่ค้นหา

    const [machines, setMachines] = useState([]); 
    const [tool_noSearch, setTool_noSearch] = useState([]); 

    const [selectedMachine, setSelectedMachine] = useState(""); // สร้าง state สำหรับเก็บ machine ที่เลือก
    const [filteredMachineNumbers, setFilteredMachineNumbers] = useState([]); // State สำหรับเก็บเครื่องที่กรอง

    useEffect(() => {
        fetchDataMachineList();
    }, []);

    useEffect(() => {
        getMachines(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูกสร้าง
    }, []); // ตรวจสอบว่า useEffect ถูกตั้งค่าถูกต้อง

    const getMachines = async () => {
        try {
            const response = await axios.get(config.api_path + "/masterSpecQcLine/listSearchTypeMC");
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
        if (Machine_Number.trim() === "") {
            Swal.fire({
                title: "Error",
                text: "กรุณากรอกหมายเลขเครื่อง",
                icon: "error",
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
                    Machine_Number: Machine_Number,
                    Partname_Model: Partname_Model,
                    tool_no: tool_no,
                    spec: spec,
                };
                const response = await axios.post(config.api_path + "/masterSpecQcLine/masterSpecQcLineInsert", payload);
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
            const res = await axios.get(config.api_path + "/masterSpecQcLine/masterSpecQcLineList", config.headers());
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
                    await axios.put(config.api_path + '/masterSpecQcLine/update/' + item.id, {
                        Machine_Number: Machine_Number, // ใช้ค่า state ของ machineNumber
                        Partname_Model: Partname_Model,
                        tool_no: tool_no,
                        spec: spec,
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
        setIdNumber(item.id || ""); // ตั้งค่า selectedItem เป็น item ที่ต้องการแก้ไข
        setMachine_Number(item.Machine_Number || ""); // ตั้งค่า machineNumber ใน state
        setPartname_Model(item.Partname_Model || ""); // ตั้งค่า partname ใน state
        setTool_no(item.tool_no || "");
        setSpec(item.spec || "");
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
                    await axios.delete(config.api_path + '/masterSpecQcLine/delete/' + item.id, config.headers());
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

    const [searchTerm, setSearchTerm] = useState(""); // State สำหรับเก็บหมายเลขเครื่องที่ค้นหา
    const [machinesSearch, setMachinesSearch] = useState({ result: [] }); // ตั้งค่าตั้งต้นให้เหมาะสม

    useEffect(() => {
        getToolNumberSearch();
    }, []);


    const getToolNumberSearch = async () => {
        try {
            const response = await axios.get(config.api_path + "/masterSpecQcLine/listSearchSpec");
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
                text: "กรุณาเลือก Type Machine. & Tool No. เพื่อค้นหา",
                icon: "error",
            });
            return;
        }
    
        const filteredMachines = machineNumbers.filter(item => {
            const matchesMachineNumber = searchTerm ? item.Machine_Number === searchTerm : true;
            const matchesToolNumber = toolSearchTerm ? item.tool_no === toolSearchTerm : true;
            return matchesMachineNumber && matchesToolNumber; // ต้องตรงทั้งสองเงื่อนไข
        });
    
        setMachineNumbers(filteredMachines); // อัปเดต machineNumbers ด้วยค่าที่กรอง
    };

    const handleSearchReset = () => {
        window.location.reload();
    }


    return (
        <>
            <Template>

                <div className="signup_container d-flex justify-content-center">
                    <div className="signup_form w-50">
                        <div className="card card-outline card-success">
                            <div className="card-header text-center">
                                <h3>
                                    <b className="fw-bold">ADD NEW MASTER SPEC QC LINE</b>
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                onChange={(e) => setMachine_Number(e.target.value)}
                                                className="col-2 form-control mt-3"
                                                placeholder="Machine........."
                                            />
                                            <input
                                                type="text"
                                                onChange={(e) => setPartname_Model(e.target.value)}
                                                className="col-4 form-control mt-3 ml-3"
                                                placeholder="Model name........"
                                            />
                                            <input
                                                type="text"
                                                onChange={(e) => setTool_no(e.target.value)}
                                                className="col-2 form-control mt-3 ml-3"
                                                placeholder="Tool........."
                                            />
                                            <input
                                                type="text"
                                                onChange={(e) => setSpec(e.target.value)}
                                                className="col-4 form-control mt-3 ml-3"
                                                placeholder="Spec........."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="col-4">
                                    <button
                                        type="button"
                                        onClick={handleMasterSpecQcLine}
                                        className="btn btn-success"
                                    >
                                     <AddIcon/>
                                        INSERT DATA
                                    </button>
                                    <Link to='/settings'>
                                        <button
                                            type="button"
                                            className="btn btn-danger ml-3"
                                        >
                                           <UndoIcon/>
                                            BACK
                                        </button>
                                    </Link>
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
                                    onChange={(selectedOption) => setSearchTerm(selectedOption.value)} // ตั้งค่า searchTerm
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
                                    onChange={(selectedOption) => setToolSearchTerm(selectedOption.value)} // ตั้งค่า toolSearchTerm
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
                                <th className="text-white text-center">Machine Number</th>
                                <th className="text-white text-center">Partname Model</th>
                                <th className="text-white text-center">Tool No</th>
                                <th className="text-white text-center">Spec QC Line</th>
                                <th className="text-white text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {machineNumbers.length > 0
                                ? machineNumbers.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-center">{item.id}</td>
                                        <td className="text-center">{item.createdAt.replace("T", " ").substring(0, 16)}</td>
                                        <td className="text-center">{item.Machine_Number}</td>
                                        <td className="text-center">{item.Partname_Model}</td>
                                        <td className="text-center">{item.tool_no}</td>
                                        <td className="text-center">{item.spec}</td>
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
                                : <tr><td colSpan="6" className="text-center">ไม่มีข้อมูลที่ค้นหา</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Template>

            {/* Modal สำหรับแก้ไขข้อมูล Machine */}
            <Modal id="modalUpdateMachine" title="" modalSize="modal-lg">
                <div className="col-12 mb-3 update-part-name">
                    <h3>UPDATE MASTER SPEC QC LINE</h3>
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
                    <div className="col-2 mt-3">
                        <label>Tool Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={tool_no}
                            onChange={(e) => setTool_no(e.target.value)}
                        />
                    </div>
                    <div className="col-4 mt-3">
                        <label>Spec QC Line</label>
                        <input
                            type="text"
                            className="form-control"
                            value={spec}
                            onChange={(e) => setSpec(e.target.value)}
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

export default AddMasterSpecQcLine;