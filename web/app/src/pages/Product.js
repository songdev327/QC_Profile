import Template from "./components/Template";
import Modal from "../pages/components/Modal";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../App.css"

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState(''); 
  const [model, setModel] = useState('');
  const [process, setProcess] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(""); // สร้าง state สำหรับเก็บ machine ที่เลือก
  // const [name, setName] = useState(''); Cancel Auto Login uer

   // State สำหรับ checkbox
   const [selectAll, setSelectAll] = useState(false);
   const [checkboxValues, setCheckboxValues] = useState({
     oil: false,
     air: false,
     pusher: false,
     stopper: false,
   });
 
   const handleSelectAllChange = () => {
     // อัปเดตสถานะของ selectAll และติ๊กทุก checkbox ตาม selectAll
     setSelectAll(!selectAll);
     setCheckboxValues({
       oil: !selectAll,
       air: !selectAll,
       pusher: !selectAll,
       stopper: !selectAll,
     });
 
     // Update product state ตามค่า checkbox ทั้งหมด
     setProduct({
       ...product,
       oil: !selectAll ? 'OK' : '',
       air: !selectAll ? 'OK' : '',
       pusher: !selectAll ? 'OK' : '',
       stopper: !selectAll ? 'OK' : '',
     });
   };
 
   const handleCheckboxChangeAll = (field) => {
     // Update checkbox state เฉพาะที่ถูกติ๊กโดยผู้ใช้
     setCheckboxValues((prev) => ({
       ...prev,
       [field]: !prev[field],
     }));
 
     // Update product state สำหรับแต่ละ checkbox
     setProduct((prev) => ({
       ...prev,
       [field]: !checkboxValues[field] ? 'OK' : '',
     }));
   };

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    getMachines();

  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/product/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setProducts(res.data.results);
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

  const getMachines = async () => {
    try {
      const response = await axios.get(config.api_path + "/machines/list");
      if (Array.isArray(response.data.results)) {
        setMachines(response.data.results); // ตั้งค่า machines เป็นอาเรย์ที่ดึงมา
      } else {
        setMachines([]); // ถ้าไม่ได้รับข้อมูลเป็นอาเรย์ ให้ตั้งค่าเป็นอาเรย์ว่างเปล่า
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

      // ตรวจสอบว่ามีการเลือก QC Check หรือไม่
  if (!product.area_qc_check) {
    Swal.fire({
      title: 'กรุณาเลือก QC Check',
      text: 'กรุณาเลือก QC EQM หรือ QC Line',
      icon: 'warning',
    });
    return;
  }

    if (document.getElementById("barcodeRegister").value === "" ||
      document.getElementById("nameRegister").value === "" ||
      document.getElementById("shiftRegister").value === "" ||
      document.getElementById("machineRegister").value === "" ||
      document.getElementById("modelRegister").value === "" ||
      document.getElementById("processRegister").value === "" ||
      document.getElementById("partSetupRegister").value === "") {
      Swal.fire({
        title: 'กรุณากรอกข้อมูล',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        icon: 'warning',
      });

      return;
    }

    try {
      const payload = {
        ...product, // เพิ่มข้อมูลทั้งหมดจาก product
      };
      await axios
        .post(
          config.api_path + "/product/insert",
          payload, config.headers())

        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "บันทึกข้อมูล",
              text: "บันทึกข้อมูล Change Tool แล้ว",
              icon: "success",
              timer: 10000,
            });
            navigate('/toolNumberSearch');
            window.location.reload();
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


  const handleMachineSelect = async (selectedOption) => {
    setModel("");
    setProcess("");

    setSelectedMachine(selectedOption.value);

    try {
      const response = await axios.get(
        `${config.api_path}/machines/${selectedOption.value}/details`
      );

      // แสดงข้อมูลเต็มที่ได้จาก API
      console.log("Full API response:", response.data);

      if (response.data.message === "success") {
        console.log("Model set to:", response.data.model);  // ตรวจสอบ model ที่ได้
        console.log("Process set to:", response.data.process);  // ตรวจสอบ process ที่ได้

        setModel(response.data.model);
        setProcess(response.data.process);

        setProduct({
          ...product,
          machine: selectedOption.value,
          model: response.data.model,
          process: response.data.process,
        });
      } else {
        Swal.fire({
          title: "error",
          text: "ไม่พบข้อมูลที่สอดคล้องกับ Machine Number นี้",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching machine details:", error);
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const ChangePages = () => {
      navigate('/toolNumberSearch');
      window.location.reload();
  }

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center mt-5">
          <div className="signup_form w-50" id="record-change-tool-1">
            <div className="card card-outline card-warnig">
              <div className="card-header" id="record-change-tool">
                <div className="card-title fw-bold">RECORD CHANGE TOOL ( SLEEVE ) ( BUSHING ) ( CONE )</div>
              </div>
              <div className="card-body">
            
                {/* <Link to="/toolnumber">
                  <button
                    className="btn btn-success ml-3"
                  >
                    Record Tool
                    <i
                      className="fa fa-list"
                      style={{ marginLeft: "0.625rem" }}
                    ></i>
                  </button>
                </Link> */}

                {/* <Link to="/toolNumberSearch"> */}
                  <button
                    className="btn btn-success ml-3" onClick={ChangePages}
                  >
                    Search Tool
                    <i
                      className="fa fa-search"
                      style={{ marginLeft: "0.635rem" }}
                    ></i>
                  </button>
                {/* </Link> */}
                
              </div>
            </div>
          </div>
        </div>
        <Modal id="modalProduct" title="" modalSize="modal-lg">
          <div className="col-12 mb-1" id="tool-production-list-p">
            <h3 className="h3">
              <b className="ml-3">RECORD TOOL DETAIL</b>
            </h3>
          </div>
          <form onSubmit={handleSave}>
            {/* <form> */}
            <div className="row">
              <div className="mt-3 col-3">
                <label>BARCODE</label>
                <input
                  onChange={(e) =>
                    setProduct({ ...product, barcode: e.target.value })
                  }
                  className="form-control"
                  id="barcodeRegister"
                />
              </div>
              <div className="mt-3 col-3">
                <label>NAME</label>
                <input
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value.toUpperCase() })
                  }
                  className="form-control"
                  id="nameRegister"
                  placeholder="Input..."
                />
              </div>

              <div className=" main1 mt-3 col-3">
                <label>SHIFT</label>
                <input
                  onChange={(e) =>
                    setProduct({ ...product, shift: e.target.value })
                  }
                  list="data1"
                  className="form-control"
                  id="shiftRegister"
                  placeholder="Shift..."
                />
                <datalist id="data1">
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                  <option>M</option>
                  <option>N</option>
                </datalist>
              </div>

              <div className="mt-3 col-3">
                <label>MACHINE</label>
                <Select
                  id="machineRegister"
                  options={
                    machines
                      ? machines.map((item) => ({
                        value: item.Machine_Number,
                        label: item.Machine_Number,
                      }))
                      : []
                  }
                  onChange={handleMachineSelect} // เรียกฟังก์ชันเมื่อเลือก Machine
                />
              </div>

              <div className="mt-3 col-6">
                <label>MODEL</label>
                <input
                  value={model} // แสดงค่าของ model ที่ได้จากการดึงข้อมูล
                  onChange={(e) => setProduct({ ...product, model: e.target.value })}
                  className="form-control"
                  id="modelRegister"
                  placeholder="Model..."
                />
              </div>

              <div className="mt-3 col-6">
                <label>PROCESS</label>
                <input
                  value={process} // แสดงค่าของ process ที่ได้จากการดึงข้อมูล
                  onChange={(e) => setProduct({ ...product, process: e.target.value })}
                  className="form-control"
                  id="processRegister"
                  placeholder="Process..."
                />
              </div>
            </div>

            <div className="row ml-3 mt-2 mb-2">
              <div className="col-2" id="qc-select-room-check">
                <div className="d-inline">
                  <input
                    className="mt-3 ml-2"
                    onChange={(e) => setProduct({ ...product, area_qc_check: "QC Eqm" })}
                    type="radio"
                    id="qc-eqm-radio"
                    name="qc-check"
                  />
                  <label className="ml-2" htmlFor="qc-eqm-radio">
                    QC EQM
                  </label>
                </div>
              </div>
              <div className="col-2" id="qc-select-room-checkl">
                <div className="d-inline">
                  <input
                    className="mt-3 ml-2"
                    onChange={(e) => setProduct({ ...product, area_qc_check: "QC Line" })}
                    type="radio"
                    id="qc-line-radio"
                    name="qc-check"
                  />
                  <label className="ml-2" htmlFor="qc-line-radio">
                    QC Line
                  </label>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body" id="bodyRoncom">
                <div className="container" id="tool-number">
                  <h3 className="h3">
                    <b className="ml-3">TOOL NUMBER</b>
                    <span className="ml-3"></span>
                  </h3>
                </div>
                <form>
                  {/* checkbox1 */}
                  <div classname="card-body bg-info">
                    <div className="row ml-3">
                      <div className="col-sm-2 mt-3">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t1: e.target.checked ? "T1" : "-", })
                              }
                              type="checkbox"
                              id="checkboxPrimary1"
                            />

                            <label className="ml-2" htmlFor="checkboxPrimary1">
                              T1
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 mt-3">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t2: e.target.value })
                              }
                              value="T2"
                              type="checkbox"
                              id="checkboxPrimary2"
                            />
                            <label className="ml-2" htmlFor="checkboxPrimary2">
                              T2
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 mt-3">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t3: e.target.value })
                              }
                              value="T3"
                              type="checkbox" id="checkboxPrimary3" />
                            <label className="ml-2" htmlFor="checkboxPrimary3">
                              T3
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 mt-3">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t4: e.target.value })
                              }
                              value="T4"
                              type="checkbox" id="checkboxPrimary4" />
                            <label className="ml-2" htmlFor="checkboxPrimary4">
                              T4
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 mt-3">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t5: e.target.value })
                              }
                              value="T5"
                              type="checkbox" id="checkboxPrimary5" />
                            <label className="ml-2" htmlFor="checkboxPrimary5">
                              T5
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2 mt-3">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t6: e.target.value })
                              }
                              value="T6"
                              type="checkbox" id="checkboxPrimary6" />
                            <label className="ml-2" htmlFor="checkboxPrimary6">
                              T6
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox1 */}

                    {/* checkbox2 */}
                    <div className="row ml-3">
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t7: e.target.value })
                              }
                              value="T7"
                              type="checkbox" id="checkboxPrimary7" />
                            <label className="ml-2" htmlFor="checkboxDanger7">
                              T7
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t8: e.target.value })
                              }
                              value="T8"
                              type="checkbox" id="checkboxPrimary8" />
                            <label className="ml-2" htmlFor="checkboxDanger8">
                              T8
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t9: e.target.value })
                              }
                              value="T9"
                              type="checkbox" id="checkboxPrimary9" />
                            <label className="ml-2" htmlFor="checkboxDanger9">
                              T9
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t10: e.target.value })
                              }
                              value="T10"
                              type="checkbox" id="checkboxPrimary10" />
                            <label className="ml-2" htmlFor="checkboxDanger10">
                              T10
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t11: e.target.value })
                              }
                              value="T11"
                              type="checkbox" id="checkboxPrimary11" />
                            <label className="ml-2" htmlFor="checkboxDanger11">
                              T11
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t12: e.target.value })
                              }
                              value="T12"
                              type="checkbox"
                              id="checkboxPrimary12"
                            />
                            <label className="ml-2" htmlFor="checkboxDanger12">
                              T12
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox2 */}

                    {/* checkbox3 */}
                    <div className="row ml-3">
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t13: e.target.value })
                              }
                              value="T13"
                              type="checkbox"
                              id="checkboxPrimary13"
                            />
                            <label className="ml-2" htmlFor="checkboxDanger13">
                              T13
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t14: e.target.value })
                              }
                              value="T14"
                              type="checkbox" id="checkboxPrimary14" />
                            <label className="ml-2" htmlFor="checkboxDanger14">
                              T14
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t15: e.target.value })
                              }
                              value="T15"
                              type="checkbox" id="checkboxPrimary15" />
                            <label className="ml-2" htmlFor="checkboxDanger15">
                              T15
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t16: e.target.value })
                              }
                              value="T16"
                              type="checkbox" id="checkboxPrimary16" />
                            <label className="ml-2" htmlFor="checkboxDanger16">
                              T16
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t17: e.target.value })
                              }
                              value="T17"
                              type="checkbox" id="checkboxPrimary17" />
                            <label className="ml-2" htmlFor="checkboxDanger17">
                              T17
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t18: e.target.value })
                              }
                              value="T18"
                              type="checkbox" id="checkboxPrimary18" />
                            <label className="ml-2" htmlFor="checkboxDanger18">
                              T18
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox3 */}

                    {/* checkbox4 */}
                    <div className="row ml-3">
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t19: e.target.value })
                              }
                              value="T19"
                              type="checkbox" id="checkboxPrimary19" />
                            <label className="ml-2" htmlFor="checkboxDanger19">
                              T19
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t20: e.target.value })
                              }
                              value="T20"
                              type="checkbox" id="checkboxPrimary20" />
                            <label className="ml-2" htmlFor="checkboxDanger20">
                              T20
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t21: e.target.value })
                              }
                              value="T21"
                              type="checkbox" id="checkboxPrimary21" />
                            <label className="ml-2" htmlFor="checkboxDanger21">
                              T21
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t22: e.target.value })
                              }
                              value="T22"
                              type="checkbox" id="checkboxPrimary22" />
                            <label className="ml-2" htmlFor="checkboxDanger22">
                              T22
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t23: e.target.value })
                              }
                              value="T23"
                              type="checkbox" id="checkboxPrimary23" />
                            <label className="ml-2" htmlFor="checkboxDanger23">
                              T23
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t24: e.target.value })
                              }
                              value="T24"
                              type="checkbox" id="checkboxPrimary24" />
                            <label className="ml-2" htmlFor="checkboxDanger24">
                              T24
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox4 */}

                    {/* checkbox5 */}
                    <div className="row ml-3">
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t25: e.target.value })
                              }
                              value="T25"
                              type="checkbox" id="checkboxPrimary25" />
                            <label className="ml-2" htmlFor="checkboxDanger25">
                              T25
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t26: e.target.value })
                              }
                              value="T26"
                              type="checkbox" id="checkboxPrimary26" />
                            <label className="ml-2" htmlFor="checkboxDanger26">
                              T26
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t27: e.target.value })
                              }
                              value="T27"
                              type="checkbox" id="checkboxPrimary27" />
                            <label className="ml-2" htmlFor="checkboxDanger27">
                              T27
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t28: e.target.value })
                              }
                              value="T28"
                              type="checkbox" id="checkboxPrimary28" />
                            <label className="ml-2" htmlFor="checkboxDanger28">
                              T28
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t29: e.target.value })
                              }
                              value="T29"
                              type="checkbox" id="checkboxPrimary29" />
                            <label className="ml-2" htmlFor="checkboxDanger29">
                              T29
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t30: e.target.value })
                              }
                              value="T30"
                              type="checkbox" id="checkboxPrimary30" />
                            <label className="ml-2" htmlFor="checkboxDanger30">
                              T30
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox5 */}

                    {/* checkbox6 */}
                    <div className="row ml-3">
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t31: e.target.value })
                              }
                              value="T31"
                              type="checkbox" id="checkboxPrimary31" />
                            <label className="ml-2" htmlFor="checkboxDanger31">
                              T31
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t32: e.target.value })
                              }
                              value="T32"
                              type="checkbox" id="checkboxPrimary32" />
                            <label className="ml-2" htmlFor="checkboxDanger32">
                              T32
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t33: e.target.value })
                              }
                              value="T33"
                              type="checkbox" id="checkboxPrimary33" />
                            <label className="ml-2" htmlFor="checkboxDanger33">
                              T33
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t34: e.target.value })
                              }
                              value="T34"
                              type="checkbox" id="checkboxPrimary34" />
                            <label className="ml-2" htmlFor="checkboxDanger34">
                              T34
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t35: e.target.value })
                              }
                              value="T35"
                              type="checkbox" id="checkboxPrimary35" />
                            <label className="ml-2" htmlFor="checkboxDanger35">
                              T35
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t36: e.target.value })
                              }
                              value="T36"
                              type="checkbox" id="checkboxPrimary36" />
                            <label className="ml-2" htmlFor="checkboxDanger36">
                              T36
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox6 */}

                    {/* checkbox7 */}
                    <div className="row ml-3">
                      <div className="col-sm-2 mb-4">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t37: e.target.value })
                              }
                              value="T37"
                              type="checkbox" id="checkboxPrimary37" />
                            <label className="ml-2" htmlFor="checkboxDanger37">
                              T37
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t38: e.target.value })
                              }
                              value="T38"
                              type="checkbox" id="checkboxPrimary38" />
                            <label className="ml-2" htmlFor="checkboxDanger38">
                              T38
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t39: e.target.value })
                              }
                              value="T39"
                              type="checkbox" id="checkboxPrimary39" />
                            <label className="ml-2" htmlFor="checkboxDanger39">
                              T39
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t40: e.target.value })
                              }
                              value="T40"
                              type="checkbox" id="checkboxPrimary40" />
                            <label className="ml-2" htmlFor="checkboxDanger40">
                              T40
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t41: e.target.value })
                              }
                              value="T41"
                              type="checkbox" id="checkboxPrimary41" />
                            <label className="ml-2" htmlFor="checkboxDanger41">
                              T41
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <div className="form-group clearfix">
                          <div className="d-inline">
                            <input
                              onChange={(e) =>
                                setProduct({ ...product, t42: e.target.value })
                              }
                              value="T42"
                              type="checkbox" id="checkboxPrimary42" />
                            <label className="ml-2" htmlFor="checkboxDanger42">
                              T42
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End checkbox6 */}

                  </div>
                </form>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-body" id="bodyRoncom">
                <div className="row">
                  <div className="h3 col-6 bg-info ml-3" id="condition-machine">
                    MACHINE CONDITION
                  </div>
                </div>
                {/* checkbox7 */}
                <div className="card">
                  <div className="row ml-3 mt-2">
                    <div className="col-sm-2 mt-1">
                      <div className="form-group clearfix">
                        <div className="d-inline">
                          <input
                            type="checkbox"
                            className="large-checkbox1"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                          <label className="ml-1" htmlFor="checkboxPrimaryAll">
                            All
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="row ml-3 mt-2">
                    <div className="col-sm-2 mt-1">
                      <div className="form-group clearfix">
                        <div className="d-inline">
                          <input
                           type="checkbox"
                            className="large-checkbox"
                            checked={checkboxValues.oil}
                            onChange={() => handleCheckboxChangeAll("oil")}
                            id="checkboxPrimaryOil"
                          />
                          <label className="ml-1" htmlFor="checkboxPrimaryOil">
                            Oil ok
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2 mt-1">
                      <div className="form-group clearfix">
                        <div className="d-inline">
                          <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={checkboxValues.air}
                            onChange={() => handleCheckboxChangeAll("air")}
                            id="checkboxPrimaryAir"
                          />
                          <label
                            className="ml-1"
                            htmlFor="checkboxPrimaryAir"
                          >
                            Air ok
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2 ml-2 mt-1">
                      <div className="form-group clearfix">
                        <div className="d-inline">
                          <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={checkboxValues.pusher}
                            onChange={() => handleCheckboxChangeAll("pusher")}
                            id="checkboxPrimaryPusher"
                          />
                          <label className="" htmlFor="checkboxPrimaryPusher">
                            Pusher ok
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3 ml-3 mt-1">
                      <div className="form-group clearfix">
                        <div className="d-inline">
                          <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={checkboxValues.stopper}
                            onChange={() => handleCheckboxChangeAll("stopper")}
                            id="checkboxPrimaryStopper"
                          />
                          <label className="" htmlFor="checkboxPrimaryStopper">
                            Stopper ok
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End checkbox6 */}
                <div className="card">
                  <div className="row mt-3">
                    <label className="ml-4">Part set up :</label>
                    <div className="col-3 ml-4">
                      <input
                        onChange={(e) =>
                          setProduct({ ...product, part_set_up: e.target.value })
                        }
                        className="form-control"
                        id="partSetupRegister"
                      />
                    </div>
                    <div className="col-1 mt-3 fw-bold">PCS.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 mb-4">
              <button onChange={handleSave} className="btn btn-success">
                Send record to QC equipment
                <i
                  className="fa fa-share-from-square"
                  style={{ marginLeft: "10px" }}
                ></i>
              </button>
            </div>
          </form>
        </Modal>
      </Template>
    </>
  );
}

export default Product;