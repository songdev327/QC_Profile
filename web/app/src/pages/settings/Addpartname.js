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

function Addpartname() {

  const [partname, setPartname] = useState("");
  const [partNo, setPartNo] = useState('');
  const [partnames, setPartnames] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [partModel, setPartModel] = useState('');
  
  const [filteredPartNames, setFilteredPartNames] = useState([]); // State สำหรับเก็บข้อมูลที่ค้นหา


  useEffect(() => {
    fetchDataPartNameList();
  }, []);

  const handlePartname = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าช่อง input ว่างหรือไม่
    if (partname.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอก Part Model",
        icon: "error",
      });
      return; // หยุดการทำงานของฟังก์ชันถ้ามีข้อผิดพลาด
    }
    if (partNo.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอก Part no.",
        icon: "error",
      });
      return; // หยุดการทำงานของฟังก์ชันถ้ามีข้อผิดพลาด
    }

    try {
      const confirmation = await Swal.fire({
        title: "ADD PART NAME MODEL",
        text: "โปรดยืนยันการเพิ่ม PART NAME",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (confirmation.isConfirmed) {
        const payload = {
          Partname_Model: partname,
          Part_No: partNo,

        };

        const response = await axios.post(
          config.api_path + "/partname/partnameRegister",
          payload
        );

        if (response.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก PART NAME แล้ว",
            icon: "success",
            timer: 100000
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

  const fetchDataPartNameList = async () => {
    try {
      const res = await axios.get(config.api_path + "/partname/list", config.headers());
      console.log("Fetched partnames:", res.data.results); // ตรวจสอบค่าที่ดึงมา
      if (res.data.message === "success") {
        setPartnames(res.data.results);
        setFilteredPartNames(res.data.results); // ตั้งค่า filteredPartNames ด้วยค่าที่ดึงมา
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
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
          await axios.delete(config.api_path + '/partname/delete/' + item.id, config.headers()).then(res => {
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

  const handleEditClick = (item) => {
    setSelectedItem(item); // ตั้งค่า selectedItem เป็น item ที่ต้องการแก้ไข
    setPartname(item.Partname_Model || ""); // ตั้งค่า partname ใน state
    setPartNo(item.Part_No|| ""); // ตั้งค่า partname ใน state
  };

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
          await axios.put(config.api_path + '/partname/update/' + item.id, {
            Partname_Model: partname,
            Part_No: partNo,
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

  const getPartnameModel = async () => {
    try {
        const response = await axios.get(config.api_path + "/getPartModel");
        console.log("Part Models:", response.data); // ตรวจสอบข้อมูลที่รับ
        setPartModel(response.data);
    } catch (error) {
        console.error("Error fetching partname:", error);
    }
  };

  useEffect(() => {
    getPartnameModel();
  }, []);

  const handleSearch = () => {
    console.log("Search button clicked"); // ตรวจสอบว่าฟังก์ชันถูกเรียก
    if (!partModel || !partModel.value) {
      Swal.fire({
        title: "Error",
        text: "กรุณาเลือก Model ที่ต้องการค้นหา",
        icon: "error",
      });
      return;
    }

    const filteredModels = partnames.filter(item => item.Partname_Model === partModel.value);

    console.log("Filtered Models:", filteredModels); // ตรวจสอบค่าที่ถูกกรอง

    if (filteredModels.length === 0) {
      Swal.fire({
        title: "No results found",
        text: "ไม่พบข้อมูล Model ที่ค้นหา",
        icon: "info",
      });
    }

    setFilteredPartNames(filteredModels); // อัปเดต filteredPartNames ด้วยค่าที่ค้นหา
  };

  const handleSearchReset = () => {
    window.location.reload();
  };

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center">
          {/* <div className="register-box"> */}
          <div className="signup_form w-50">
            <div className="card card-outline card-success">
              <div className="card-header text-center" id="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="">
                      <b className="fw-bold">ADD NEW PART MODEL NAME (Search master PDF file)</b>
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {/* <div className="col-sm-12"> */}
                        {/* <div className="form-group clearfix"> */}
                          <div className="icheck-primary d-inline col-6 text-start">
                            <label className="">Model name</label>
                            <input
                              type="text"
                              onChange={(e) => setPartname(e.target.value)}
                              className="form-control"
                              placeholder="In put new model....."
                            />
                          </div>
                          <div className="icheck-primary d-inline col-6 text-start">
                            <label className="">Part no.</label>
                            <input
                              type="text"
                              onChange={(e) => setPartNo(e.target.value)}
                              className="form-control"
                              placeholder="Part no....."
                            />
                          </div>

                        {/* </div> */}

                      {/* </div> */}

                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={handlePartname}
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
          </div>
        </div>
        <div className="content-wrapper">
          <form>
            <div className="row">
              <div className="col-3">
                <Select
                  options={
                    partModel && partModel.result
                      ? partModel.result.map((item) => ({
                        value: item.Partname_Model,
                        label: item.Partname_Model,
                      }))
                      : []
                  }
                  onChange={(selectedOption) => setPartModel(selectedOption)} // ตั้งค่า partModel
                />
              </div>
              <div className="col-8">
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
                  RESET
                  <RotateLeftIcon/>
                </button>
              </div>
            </div>
          </form>
          <table
            className="mt-3 table table-bordered table-striped"
            id="table-qc-search1"
          >
            <thead className="bg-dark" id="table-qc">
              <tr>
                <th className="text-white text-center">No</th>
                <th className="text-white text-center">Date Input</th>
                <th className="text-white text-center">Model</th>
                <th className="text-white text-center">Part no</th>
                <th className="text-white text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartNames.length > 0
                ? filteredPartNames.map((item, index) => (
                  <tr>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-"}
                    </td>
                    <td className="text-center">{item.Partname_Model}</td>
                    <td className="text-center">{item.Part_No}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        data-toggle="modal"
                        data-target="#modalUpdatePartname"
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

      <Modal id="modalUpdatePartname" title="" modalSize="modal-lg">
        <div className="col-12 mb-3 update-part-name">
          <h3>UPDATE PART MODEL NAME</h3>
        </div>
        <div className="row">
          <div className="col-4 mt-3">
            <label className="ml-2">Model Name</label>
            <input
              type="text"
              className="form-control"
              value={partname}
              onChange={(e) => setPartname(e.target.value)}
            />
          </div>
          <div className="col-4 mt-3">
            <label className="ml-2">Part no</label>
            <input
              type="text"
              className="form-control"
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
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
export default Addpartname;
