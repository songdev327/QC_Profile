import Template from "../../components/Template";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import Modal from "../../components/Modal";
import { Link } from "react-router-dom";
import './showMaster.css'
import Select from "react-select";
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

function AddPdfMachineTBAllModelInput() {
    const [productImage, setProductImage] = useState({});
    const [productImages, setProductImages] = useState([]);

    const [process, setProcess] = useState('');
    const [model, setModel] = useState('');
    const [toolnumber, setToolnumber] = useState('');
    const [machine_type, setMachine_type] = useState('TB');

    const [imageName, setImageName] = useState('');
    const [pdfUrl, setPdfUrl] = useState(''); // สร้าง state เพื่อเก็บ URL ของไฟล์ PDF

    const [machineNumbers, setMachineNumbers] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);

    const [model_noList, setModel_noList] = useState([]);
    const [process_noList, setProcess_noList] = useState([]);
    const [modelSearchTerm, setModelSearchTerm] = useState(""); // สำหรับโมเดล
    const [processSearchTerm, setProcessSearchTerm] = useState(""); // สำหรับโมเดล

    useEffect(() => {
        fetchDataProductImage();
        getModelList();
        getProcessList();
    }, []);

    const handleChangeFile = (files) => {
        // setProductImage(files[0]); ใช้สำหรับ img
        const selectedFile = files[0];
        console.log(files);
        if (selectedFile && selectedFile.type === "application/pdf") {
            setProductImage(selectedFile);
        } else {
            alert("Please select a PDF file.");
        }
    };

    const handleUpload = () => {
        Swal.fire({
            title: "Upload profile",
            text: "โปรดยืนยันการ Up Load file",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {

                    const _config = {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem(config.token_name),
                            "Content-Type": "multipart/form-data",
                        },
                    };

                    const formData = new FormData();
                    formData.append("productImage", productImage);
                    formData.append("productImageName", productImage.name);
                    formData.append("process", processSearchTerm);
                    formData.append("model", modelSearchTerm);
                    formData.append("toolnumber", toolnumber);
                    formData.append("machine_type", "TB");

                    await axios
                        .post(config.api_path + "/productImage/insertAllModelTBMachine", formData, _config)
                        .then((res) => {
                            if (res.data.message === "success") {
                                Swal.fire({
                                    title: "Upload Profile",
                                    text: "Upload Profile Ok",
                                    icon: "success",
                                    timer: 2000,
                                });
                                window.location.reload();
                                // console.log(formData);
                            }
                        })
                        .catch((err) => {
                            throw err.response.data;
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
    const fetchDataProductImage = async () => {
        try {
            //   const headers = config.headers(); // รับ headers เป็น object
            const response = await axios.get(config.api_path + "/productImage/getAllModelTBMachine");

            if (response.data.message === "success") {
                setProductImages(response.data.results);
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.data.message || 'Unknown error',
                    icon: "error",
                });
            }
        } catch (e) {
            Swal.fire({
                title: "Error",
                text: e.response ? e.response.data.message : e.message,
                icon: "error",
            });
        }
    };

    const handleDelete = (item) => {
        console.log('Item to delete:', item);

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
                    await axios.delete(config.api_path + '/productImage/deleteAllModelTBMachine/' + item.id, config.headers()).then(res => {
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
    }

    const handleUploadUpdate = () => {
        Swal.fire({
            title: "Update profile",
            text: "โปรดยืนยันการอัปเดตข้อมูล",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {
                    const _config = {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem(config.token_name),
                            "Content-Type": "multipart/form-data",
                        },
                    };
    
                    const formData = new FormData();
    
                    // ตรวจสอบว่ามีการอัปโหลดไฟล์ใหม่หรือไม่
                    if (productImage) {
                        formData.append("productImage", productImage);
                        formData.append("productImageName", productImage.name);
                    }
    
                    // เพิ่มฟิลด์อื่น ๆ เสมอไม่ว่าจะอัปโหลด PDF หรือไม่
                    formData.append("process", process);
                    formData.append("model", model);
                    formData.append("toolnumber", toolnumber);
                    formData.append("machine_type", "TB");
    
                    await axios
                        .put(config.api_path + `/productImage/updateAllModelTBMachine/${selectedItem.id}`, formData, _config)
                        .then((res) => {
                            if (res.data.message === "success") {
                                Swal.fire({
                                    title: "Update Profile",
                                    text: "ข้อมูลอัปเดตเรียบร้อย",
                                    icon: "success",
                                    timer: 2000,
                                });
                                window.location.reload();
                            }
                        })
                        .catch((err) => {
                            throw err.response.data;
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

    const [searchTerm, setSearchTerm] = useState(""); // State สำหรับเก็บหมายเลขเครื่องที่ค้นหา
    const [modelSearch, setModelSearch] = useState({ result: [] }); // ตั้งค่าตั้งต้นให้เหมาะสม
    const [toolSearch, setToolSearch] = useState({ result: [] }); // ตั้งค่าตั้งต้นให้เหมาะสม

    useEffect(() => {
        getModelSearch();
        getToolSearch();
    }, []);

    const handleSearch = () => {
        console.log("Filtered productImages:", productImages);
        
        if (searchTerm.trim() === "") {
            Swal.fire({
                title: "Error",
                text: "กรุณาเลือกข้อมูลที่ต้องการค้นหา",
                icon: "error",
            });
            return;
        }
    
        // กรอง `productImages` ตาม `model` หรือ `toolnumber`
        const filteredMachines = productImages.filter(item => {
            return item.model.toLowerCase() === searchTerm.toLowerCase();
                //    item.toolnumber.toLowerCase() === searchTerm.toLowerCase();
        });
    
        if (filteredMachines.length > 0) {
            setProductImages(filteredMachines); // อัปเดต `productImages` ด้วยข้อมูลที่ค้นหา
            console.log("Filtered Machines: ", filteredMachines);
        } else {
            Swal.fire({
                title: "ไม่พบข้อมูล",
                text: "ไม่พบข้อมูลที่ตรงกับการค้นหา",
                icon: "warning",
            });
        }
    };

    const handleSearchReset = () => {
        window.location.reload();
    }
    const getModelSearch = async () => {
        try {
            const response = await axios.get(config.api_path + "/productImage/getAllModelTBMachine");
            setModelSearch(response.data);
            console.log("Machines Search Response:", response.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };
    const getToolSearch = async () => {
        try {
            const response = await axios.get(config.api_path + "/productImage/getAllModelTBMachine");
            setToolSearch(response.data);
            console.log("Machines Search Response:", response.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };
    const handleEditClick = (item) => {
        setSelectedItem(item); // ตั้งค่า selectedItem เป็น item ที่ต้องการแก้ไข
        setModel(item.model); // ตั้งค่า machineNumber ใน state
        setProcess(item.process || ""); // ตั้งค่า partname ใน state
        setToolnumber(item.toolnumber || ""); // ตั้งค่า partname ใน state
        setMachine_type(item.machine_type || ""); // ตั้งค่า partname ใน state
    };

    useEffect(() => {
        if (selectedItem && selectedItem.id) { // ตรวจสอบว่ามี selectedItem และมี id
          const fetchPdfData = async () => {
            try {
              const response = await axios.get(`${config.api_path}/productImage/getUpdateTBImage/${selectedItem.id}`);
              if (response.data.message === 'success') {
                setImageName(response.data.result.imageName); // ตั้งค่าชื่อไฟล์ PDF
                setPdfUrl(`${config.api_path}/uploadproduction/${response.data.result.imageName}`); // ตั้งค่า URL ของไฟล์ PDF
              }
            } catch (error) {
              Swal.fire('Error', error.message, 'error');
            }
          };
          fetchPdfData();
        }
      }, [selectedItem]);

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
                                <div className="card">
                                    <div className="card-header">
                                        <h3>
                                            <b className="fw-bold">ADD RECORD PDF ALL MODEL TB MACHINE</b>
                                        </h3>
                                    </div>
                                    <div className="card-footer">
                                        <div className="row">
                                            <div className="col-3">
                                                <button
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#modalProductImage"
                                                    // onClick={handleUpload}
                                                    className="btn btn-success mr-4"
                                                >
                                                    <AddIcon />
                                                    ADD PDF
                                                </button>
                                            </div>
                                            <div className="col-3">
                                                <button
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#modalShowProductImage"
                                                    // onClick={handleUpload}
                                                    className="btn btn-primary ml-1"
                                                >
                                                    <ImportContactsIcon className="mr-1" />
                                                    OPEN PDF
                                                </button>
                                            </div>
                                            <div className="col-3">
                                                <Link to='/settings'>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                    >
                                                        <UndoIcon />
                                                        BACK
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-wrapper">
                    <div className="row">
                        <div className="mt-3 col-3">
                            <Select
                                options={
                                    modelSearch.results && modelSearch.results.length > 0
                                        ? modelSearch.results.map((item) => ({
                                            value: item.model,  // ดึงฟิลด์ model จากข้อมูล
                                            label: item.model   // ดึงฟิลด์ model เพื่อแสดงเป็น label
                                        }))
                                        : []
                                }
                                onChange={(selectedOption) => setSearchTerm(selectedOption.value)}
                            />
                        </div>
                        {/* <div className="mt-3 col-2">
                            <Select
                                options={
                                    toolSearch.results && toolSearch.results.length > 0
                                        ? toolSearch.results.map((item) => ({
                                            value: item.toolnumber,  // ดึงฟิลด์ model จากข้อมูล
                                            label: item.toolnumber   // ดึงฟิลด์ model เพื่อแสดงเป็น label
                                        }))
                                        : []
                                }
                                onChange={(selectedOption) => setSearchTerm(selectedOption.value)}
                            />
                        </div> */}
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

                    <table
                        className="mt-3 table table-bordered table-striped"
                        id="table-qc-search1"
                    >
                        <thead className="bg-dark" id="table-qc">
                            <tr>
                                <th className="text-white text-center">No</th>
                                <th className="text-white text-center">Date Input</th>
                                <th className="text-white text-center">Machine</th>
                                <th className="text-white text-center">Process</th>
                                <th className="text-white text-center">Model</th>
                                <th className="text-white text-center">Tool Number</th>
                                <th className="text-white text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productImages.length > 0
                                ? productImages.map((item) => (
                                     <tr key={item.id}> {/* เพิ่ม `key` ที่ไม่ซ้ำกันที่นี่ */}
                                     <td className="text-center">{item.id}</td>
                                        <td className="text-center">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-"}
                                        </td>
                                        <td className="text-center">{item.machine_type}</td>
                                        <td className="text-center">{item.process}</td>
                                        <td className="text-center">{item.model}</td>
                                        <td className="text-center">{item.toolnumber}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                data-toggle="modal"
                                                data-target="#modalProductImageUpdate"
                                                type="button"
                                                className="btn btn-primary mr-3"
                                            >
                                                <i className="fa fa-pencil mr-2"></i> Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(item)}
                                                type="button"
                                                className="btn btn-danger"
                                            >
                                                <i className="fa fa-trash mr-2"></i>
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                                : ""}
                        </tbody>
                    </table>
                </div>
            </Template>
            <Modal id="modalProductImage" title="" modalSize="modal-lg">
                <div className="col-12 mb-3" id="add-record-master-pdf">
                    <h3 className="h3">
                        <b className="ml-3">ADD RECORD MASTER PDF ALL MODEL TB MACHINE</b>
                    </h3>
                </div>
                <div className="row">
                    <div className="col-2 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                            MC/Type
                        </div>
                        <input
                            // onChange={(e) => setMachine_type(e.target.value)}
                            value="TB"
                            type="text"
                            className="form-control"
                            disabled
                        />
                    </div>
                    <div className="col-4 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                            Process
                        </div>
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

                    <div className="col-5 ml-2 mt-3" id="box-2">
                        <div className="text-bold pl-2" id="box-2">
                            Model
                        </div>
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
                </div>
                <div className="row">
                    <div className="col-2 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                            Tool Number
                        </div>
                        <input
                            onChange={(e) => setToolnumber(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Input..."
                        />
                    </div>

                    <div className="col-7 ml-2 mt-3" id="box-2">
                        <div className="text-bold pl-1 ">Add PDF</div>
                        <input
                            onChange={(e) => handleChangeFile(e.target.files)}
                            type="file"
                            //   accept=".pdf"
                            // name="pdfName"
                            accept="application/pdf"
                            name="imageName1"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <button onClick={handleUpload} className="btn btn-success">
                        Upload PDF
                        <i className="fa fa-cloud-arrow-up ml-3"></i>
                    </button>
                </div>
                <hr className="mt-5">
                </hr>
            </Modal>
            <Modal id="modalShowProductImage" title="" modalSize="modal-lg">
                <div className="col-12 mb-3" id="add-record-master-pdf">
                    <h3 className="h3">
                        <b className="ml-3">RECORD MASTER PDF ALL TB MACHINE</b>
                    </h3>
                </div>
                <hr className="mt-5">
                </hr>
                <div className="row">
                    {productImages.length > 0
                        ? productImages.map((item) => (
                            <div className="col-12" key={item.imageName}>
                                <div>
                                    <iframe
                                        style={{ width: "43.75rem", height: "50rem" }}
                                        src={config.api_path + "/uploadproduction/" + item.imageName}
                                        alt=""
                                    ></iframe>
                                </div>
                            </div>
                        ))
                        : ""}
                </div>
            </Modal>
            <Modal id="modalProductImageUpdate" title="" modalSize="modal-lg">
                <div className="col-12 mb-3" id="add-record-master-pdf">
                    <h3 className="h3">
                        <b className="ml-3">UPDATE RECORD MASTER PDF ALL MODEL TB MACHINE</b>
                    </h3>
                </div>
                <div className="row">
                    <div className="col-2 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                        MC/Type
                        </div>
                        <input
                            value={machine_type}
                            onChange={(e) => setMachine_type(e.target.value)}
                            type="text"
                            className="form-control"
                            disabled
                        />
                    </div>
                    <div className="col-4 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                            Process
                        </div>
                        <input
                            value={process}
                            onChange={(e) => setProcess(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Input......"
                        />
                    </div>

                    <div className="col-5 ml-2 mt-3" id="box-2">
                        <div className="text-bold pl-2" id="box-2">
                            Model
                        </div>
                        <input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Input......"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-2 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                            Tool Number
                        </div>
                        <input
                            value={toolnumber}
                            onChange={(e) => setToolnumber(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="select..."
                        />
                    </div>

                    <div className="col-7 ml-2 mt-3" id="box-2">
                        <div className="text-bold pl-1">STATUS PDF</div>
                        {pdfUrl ? (
                            <iframe
                                src={pdfUrl} // แสดง PDF ผ่าน iframe
                                style={{ width: "100%", height: "500px" }}
                                frameBorder="0"
                            ></iframe>
                        ) : (
                            <p>No PDF available</p>
                        )}
                        <input
                            onChange={(e) => handleChangeFile(e.target.files)}
                            type="file"
                            accept="application/pdf"
                            name="imageName1"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <button onClick={handleUploadUpdate} className="btn btn-success">
                        UpDate PDF
                        <i className="fa fa-cloud-arrow-up ml-3"></i>
                    </button>
                </div>
                <hr className="mt-5">
                </hr>
            </Modal>
        </>
    )
}
export default AddPdfMachineTBAllModelInput;