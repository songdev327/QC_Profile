import Template from "../components/Template";
import { useState ,useEffect } from "react";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import UndoIcon from '@mui/icons-material/Undo';
import AddIcon from '@mui/icons-material/Add';

function Addprocess() {
  const [process, setProcess] = useState("");
  const [processs, setProcesss] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchDataProcessList();
  }, []);

  const handleProcess = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าช่อง input ว่างหรือไม่
    if (process.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอก Process",
        icon: "error",
      });
      return; // หยุดการทำงานของฟังก์ชันถ้ามีข้อผิดพลาด
    }

    try {
      const confirmation = await Swal.fire({
        title: "ADD A PROCESS",
        text: "โปรดยืนยันการเพิ่ม PROCESS",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (confirmation.isConfirmed) {
        const payload = {
          process: process,
        };

        const response = await axios.post(
          config.api_path + "/process/processRegister",
          payload
        );

        if (response.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก PROCESS แล้ว",
            icon: "success",
            timer: 100000,
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

  const fetchDataProcessList = async () => {
    try {
      await axios
        .get(config.api_path + "/process/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setProcesss(res.data.results);
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
          await axios.delete(config.api_path + '/process/delete/' + item.id, config.headers()).then(res => {
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
    setProcess(item.process || ""); // ตั้งค่า partname ใน state
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
          await axios.put(config.api_path + '/process/update/' + item.id, {
            process: process,
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
                    <b className="fw-bold">ADD NEW PROCESS (Search master PDF file)</b>
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group clearfix">
                        <div className="icheck-primary d-inline">
                          <label></label>
                          <input
                            type="text"
                            onChange={(e) => setProcess(e.target.value)}
                            className="form-control"
                            placeholder="Input New Process name....."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="col-3">
                    <button
                      type="button"
                      onClick={handleProcess}
                      className="btn btn-success"
                    >
                      <AddIcon/>
                      INSERT DATA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
      <div className="">
        <Link to='/settings'>
          <button
            type="button"
            className="btn btn-danger"
          >
           <UndoIcon/>
            BACK
          </button>
          </Link>
        </div>
        <table
          className="mt-3 table table-bordered table-striped"
          id="table-qc-search"
        >
          <thead className="bg-dark" id="table-qc">
            <tr>
              <th className="text-white text-center">No</th>
              <th className="text-white text-center">Date Input</th>
              <th className="text-white text-center">Process Name</th>
              <th className="text-white text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {processs.length > 0
              ? processs.map((item) => (
                <tr>
                  <td className="text-center">{item.id}</td>
                  <td className="text-center">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-"}
                  </td>
                  <td className="text-center">{item.process}</td>
                  <td className="text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        data-toggle="modal"
                        data-target="#modalUpdateProcess"
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

     <Modal id="modalUpdateProcess" title="" modalSize="modal-lg">
        <div className="col-12 mb-3 update-part-name">
          <h3>UPDATE PROCESS NAME</h3>
        </div>
        <div className="row">
          <div className="col-4 mt-3">
            <label className="ml-2">Process Name</label>
            <input
              type="text"
              className="form-control"
              value={process}
              onChange={(e) => setProcess(e.target.value)}
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

export default Addprocess;
