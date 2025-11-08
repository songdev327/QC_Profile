import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import "../App.css";

function ToolNumber() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});

  const [partModel, setPartModel] = useState("");
  const [process, setProcess] = useState("");
  const [machines, setMachines] = useState(""); // สร้าง state เพื่อเก็บข้อมูลเครื่อง

  const [contour_ng_tool_no, setContour_ng_tool_no] = useState("");
  const [contour_ng_detail, setContour_ng_detail] = useState("");
  const [sulfcom_ng_tool_no, setSulfcom_ng_tool_no] = useState("");
  const [sulfcom_ng_detail, setSulf_ng_detail] = useState("");
  const [roncom_ng_tool_no, setRoncom_ng_tool_no] = useState("");
  const [roncom_ng_detail, setRon_ng_detail] = useState("");
  const [talysurf_ng_tool_no, setTalysurf_ng_tool_no] = useState("");
  const [talysurf_ng_detail, setTalysurf_ng_detail] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // ประกาศ state currentPage

  const navigate = useNavigate();

  useEffect(() => {
    getMachines();
    getProcess();
    getPartnameModel();
  }, []);

  useEffect(() => {
    handlePageClick({ selected: currentPage - 1 });
    const interval = setInterval(() => {
      handlePageClick({ selected: currentPage - 1 });
      window.location.reload();
    }, 60000);

    return () => clearInterval(interval);
  }, [currentPage]);

  const handlePageClick = async (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage); // อัปเดตหน้าปัจจุบัน
    const limit = 50; // แสดง 50 รายการต่อหน้า
    const offset = (selectedPage - 1) * limit; // คำนวณ offset ตามหน้าที่เลือก

    try {
      const response = await axios.get(
        `${config.api_path}/product/listNew?offset=${offset}&limit=${limit}`,
        config.headers()
      );
      if (response.data.message === "success") {
        setProducts(response.data.results.slice(0, limit)); // แสดงผลเฉพาะ 50 บรรทัดที่ดึงมา
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const getPartnameModel = async () => {
    try {
      const response = await axios.get(config.api_path + "/getPartModel"); // แก้ไข path ของ API ตามที่ใช้งานจริง
      setPartModel(response.data); // ตั้งค่า state PartModel เป็นข้อมูลเครื่องที่ดึงมา
      console.log(response);
    } catch (error) {
      console.error("Error fetching partname:", error);
    }
  };
  const getProcess = async () => {
    try {
      const response = await axios.get(config.api_path + "/getProcess"); // แก้ไข path ของ API ตามที่ใช้งานจริง
      setProcess(response.data); // ตั้งค่า state PartModel เป็นข้อมูลเครื่องที่ดึงมา
      console.log(response);
    } catch (error) {
      console.error("Error fetching partname:", error);
    }
  };

  const getMachines = async () => {
    try {
      const response = await axios.get(config.api_path + "/getDataMC"); // แก้ไข path ของ API ตามที่ใช้งานจริง
      setMachines(response.data); // ตั้งค่า state machines เป็นข้อมูลเครื่องที่ดึงมา
      console.log(response);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      document.getElementById("barcodeRegister").value === "" ||
      document.getElementById("nameRegister").value === "" ||
      document.getElementById("shiftRegister").value === "" ||
      document.getElementById("machineRegister").value === "" ||
      document.getElementById("modelRegister").value === "" ||
      document.getElementById("processRegister").value === "" ||
      document.getElementById("partSetupRegister").value === ""
    ) {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
      });

      return; // หยุดการทำงานทันทีหากไม่ได้เลือกสถานะ
    }

    try {
      const payload = {
        ...product, // เพิ่มข้อมูลทั้งหมดจาก product
        // name: memberName // เพิ่ม memberName เข้าไปใน payload , Cancel Auto Login uer
      };
      await axios
        .post(config.api_path + "/product/insert", payload, config.headers())

        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "บันทึกข้อมูล",
              text: "บันทึกข้อมูล Change Tool แล้ว",
              icon: "success",
              timer: 10000,
            });
            navigate("/toolNumberSearch");
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

   const ChangePagesSleeve = () => {
      navigate('/toolNumberSearch');
      window.location.reload();
  }
   const ChangePagesShaft = () => {
      navigate('/toolNumberSearchShaft');
      window.location.reload();
  }



  return (
    <>
      <Link to="/home" class="ml-3">
        <i className="text-dark nav-icon fas fa-home mt-1" id="iconM" />
      </Link>

      <Link to="/toolNumberSearch" className="mt-1">
        <label className="ml-3 sleeve" onClick={ChangePagesSleeve}>SLEEVE</label>
      </Link>

      <Link to="/toolNumberSearchShaft" className="mt-1">
        <label className="ml-3 shaft" onClick={ChangePagesShaft}>SHAFT</label>
      </Link>
      {/* <Link to="/toolNumberSearch" className="mt-1">
                <i
                    className="fa fa-search ml-3 text-dark" id="icon-search"
                // style={{ marginLeft: "10px" }}
                ></i>
            </Link> */}

      {/* <div className="col-8 mt-2">
                <div className="col-3 items-per-page-containerSearch mb-3">
                    <label htmlFor="itemsPerPage1" className="form-label1 border-label me-2">SELECT M/C TYPE :</label>
                    <select
                        id="itemsPerPage1"
                        className="form-select w-auto ml-2"
                        value={selectedMCType}
                        onChange={handleMCTypeChange}
                        style={{ fontSize: "18px", fontWeight: "bold", color: "red" }} // กำหนดขนาดตัวหนังสือของ select ทั้งหมด
                    >
                        <option style={{ fontWeight: "bold", fontSize: "18px" }} value={''}>ALL</option>
                        <option style={{ fontWeight: "bold", fontSize: "18px" }} value={'CH'}>CH</option>
                        <option style={{ fontWeight: "bold", fontSize: "18px" }} value={'CS'}>CS</option>
                        <option style={{ fontWeight: "bold", fontSize: "18px" }} value={'SB'}>SB</option>
                        <option style={{ fontWeight: "bold", fontSize: "18px" }} value={'TN'}>TN</option>
                    </select>
                </div>
            </div> */}

      <div className="col-12 mt-4 text-center" id="record-change-tool-h1">
        <h1 className="h1-font">ALL RECORD PRODUCTION TOOL LIST</h1>
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={4} // จำนวนหน้าทั้งหมดเป็น 2 หน้า (50 รายการต่อหน้า, 100 รายการทั้งหมด)
        marginPagesDisplayed={1}
        pageRangeDisplayed={4}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />

      <table
        className="mt-3 table table-bordered table-striped"
        id="table-product-number"
         style={{ fontSize: "1.0rem" }}
      >
        <thead className="bg-dark" id="table-setter">
          <tr>
            <th className="text-white">Barcode</th>
            <th className="text-white">Date</th>
            <th className="text-white">Name</th>
            <th className="text-white">Shift</th>
            <th className="text-white">Machine</th>
            <th className="text-white">Model</th>
            <th className="text-white">Process</th>
            <th className="text-white">Tool No.</th>
            <th className="text-primary">AF1</th>
            <th className="text-primary">AF2</th>
            <th className="text-primary">AF3</th>
            <th className="text-primary">AF4</th>
            <th className="text-primary">AF5</th>
            <th className="text-white">Remark</th>
            <th className="text-center text-white">Contour</th>
            <th className="text-center text-white">Surfcom</th>
            <th className="walking-animation text-center text-white">
              <DirectionsRunIcon />
              Rondcom
            </th>
            <th className="text-center text-white">Talysurf</th>
            <th className="text-center text-white">QC Line</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "0.9rem" }}>
          {products.length > 0
            ? products.map((item) => (
                <tr>
                  <td
                    className={`
                              ${item.barcode === "Pass" ? "bg-success" : ""}
                              ${item.barcode === "Cancel" ? "bg-danger" : ""}
                              ${item.barcode === "Reject" ? "bg-danger" : ""}
                            `}
                    style={{
                      backgroundColor:
                        item.area_qc_check === "QC Line" ? "#b5f3e5" : "",
                    }}
                  >
                    {item.barcode}
                    <br />
                    -------
                    <br />
                    {item.area_qc_check}
                  </td>
                  <td>
                    {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}
                  </td>
                   <td>{item.name}<br />
                  -------
                  <br />
                  {item.origin_barcode}
                  </td>
                  <td>{item.shift}</td>
                  <td>{item.machine}</td>
                  <td>{item.model}</td>
                  <td>{item.process}</td>
                  <td>
                    {item.t1}-{item.t2}-{item.t3}-{item.t4}-{item.t5}-{item.t6}-
                    {item.t7}-{item.t8}-{item.t9}-{item.t10}-{item.t11}-
                    {item.t12}-{item.t13}-{item.t14}-{item.t15}-{item.t16}-
                    {item.t17}-{item.t18}-{item.t19}-{item.t20}-{item.t21}-
                    {item.t22}-{item.t23}-{item.t24}-{item.t25}-{item.t26}-
                    {item.t27}-{item.t28}-{item.t29}-{item.t30}-{item.t31}-
                    {item.t32}-{item.t33}-{item.t34}-{item.t35}-{item.t36}-
                    {item.t37}-{item.t38}-{item.t39}-{item.t40}-{item.t41}-
                    {item.t42}
                  </td>
                  <td
                  className={`${item.afterset_eqm === "OK" || item.afterset_eqm === "Ok"
                    ? "bg-success text-center"
                    : item.afterset_eqm === "NG(Drawing)" ||
                      item.afterset_eqm === "Ng"
                      ? "bg-danger text-center"
                      : item.afterset_eqm === "Max" || item.afterset_eqm === "Min"
                        ? "bg-warning text-center"
                        : item.afterset_eqm === "Over target" ||
                          item.afterset_eqm === "Under target"
                          ? "bg-orange text-center"
                          : "text-center"
                    }`}
                >
                  {item.afterset && item.nameafterset ? (
                    <>
                      {item.afterset}
                      <br />
                      By {item.nameafterset}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={`${item.afterset_eqm2 === "OK" || item.afterset_eqm2 === "Ok"
                    ? "bg-success text-center"
                    : item.afterset_eqm2 === "NG(Drawing)" ||
                      item.afterset_eqm2 === "Ng"
                      ? "bg-danger text-center"
                      : item.afterset_eqm2 === "Max" || item.afterset_eqm2 === "Min"
                        ? "bg-warning text-center"
                        : item.afterset_eqm2 === "Over target" ||
                          item.afterset_eqm2 === "Under target"
                          ? "bg-orange text-center"
                          : "text-center"
                    }`}
                >
                  {item.afterset2 && item.nameafterset2 ? (
                    <>
                      {item.afterset2}
                      <br />
                      By {item.nameafterset2}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={`${item.afterset_eqm3 === "OK" || item.afterset_eqm3 === "Ok"
                    ? "bg-success text-center"
                    : item.afterset_eqm3 === "NG(Drawing)" ||
                      item.afterset_eqm3 === "Ng"
                      ? "bg-danger text-center"
                      : item.afterset_eqm3 === "Max" || item.afterset_eqm3 === "Min"
                        ? "bg-warning text-center"
                        : item.afterset_eqm3 === "Over target" ||
                          item.afterset_eqm3 === "Under target"
                          ? "bg-orange text-center"
                          : "text-center"
                    }`}
                >
                  {item.afterset3 && item.nameafterset3 ? (
                    <>
                      {item.afterset3}
                      <br />
                      By {item.nameafterset3}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={`${item.afterset_eqm4 === "OK" || item.afterset_eqm4 === "Ok"
                    ? "bg-success text-center"
                    : item.afterset_eqm4 === "NG(Drawing)" ||
                      item.afterset_eqm4 === "Ng"
                      ? "bg-danger text-center"
                      : item.afterset_eqm4 === "Max" || item.afterset_eqm4 === "Min"
                        ? "bg-warning text-center"
                        : item.afterset_eqm4 === "Over target" ||
                          item.afterset_eqm4 === "Under target"
                          ? "bg-orange text-center"
                          : "text-center"
                    }`}
                >
                  {item.afterset4 && item.nameafterset4 ? (
                    <>
                      {item.afterset4}
                      <br />
                      By {item.nameafterset4}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={`${item.afterset_eqm5 === "OK" || item.afterset_eqm5 === "Ok"
                    ? "bg-success text-center"
                    : item.afterset_eqm5 === "NG(Drawing)" ||
                      item.afterset_eqm5 === "Ng"
                      ? "bg-danger text-center"
                      : item.afterset_eqm5 === "Max" || item.afterset_eqm5 === "Min"
                        ? "bg-warning text-center"
                        : item.afterset_eqm5 === "Over target" ||
                          item.afterset_eqm5 === "Under target"
                          ? "bg-orange text-center"
                          : "text-center"
                    }`}
                >
                  {item.afterset5 && item.nameafterset5 ? (
                    <>
                      {item.afterset5}
                      <br />
                      By {item.nameafterset5}
                    </>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="text-danger">{item.remark}</td>

                  <td
                    className={`${
                      item.contour === "OK" || item.contour === "Ok"
                        ? "bg-success text-center"
                        : item.contour === "NG(Drawing)" ||
                          item.contour === "Ng"
                        ? "bg-danger text-center"
                        : item.contour === "Max" || item.contour === "Min"
                        ? "bg-warning text-center"
                        : item.contour === "Over target" ||
                          item.contour === "Under target"
                        ? "bg-orange text-center"
                        : "text-center"
                    }`}
                  >
                    {item.contour} <br />
                    {/* เงื่อนไขสำหรับ NG(Drawing) */}
                    {item.contour === "NG(Drawing)" && (
                      <>
                        {item.contour_ng_target_spec} <br />
                        {item.contour_ng_drawing_spec}
                      </>
                    )}
                    {/* เงื่อนไขสำหรับ Over target */}
                    {item.contour === "Over target" && (
                      <>{item.contour_over_target}</>
                    )}
                    {/* เงื่อนไขสำหรับ Under target */}
                    {item.contour === "Under target" && (
                      <>{item.contour_under_target}</>
                    )}
                  </td>

                  <td
                    className={`${
                      item.sulfcom === "OK" || item.sulfcom === "Ok"
                        ? "bg-success text-center"
                        : item.sulfcom === "NG(Drawing)" ||
                          item.sulfcom === "Ng"
                        ? "bg-danger text-center"
                        : item.sulfcom === "Max" || item.sulfcom === "Min"
                        ? "bg-warning text-center"
                        : item.sulfcom === "Over target" ||
                          item.sulfcom === "Under target"
                        ? "bg-orange text-center"
                        : "text-center"
                    }`}
                  >
                    {item.sulfcom} <br />
                    {/* เงื่อนไขสำหรับ NG(Drawing) */}
                    {item.sulfcom === "NG(Drawing)" && (
                      <>
                        {item.sulfcom_ng_target_spec} <br />
                        {item.sulfcom_ng_drawing_spec}
                      </>
                    )}
                    {/* เงื่อนไขสำหรับ Over target */}
                    {item.sulfcom === "Over target" && (
                      <>{item.sulfcom_over_target}</>
                    )}
                    {/* เงื่อนไขสำหรับ Under target */}
                    {item.sulfcom === "Under target" && (
                      <>{item.sulfcom_under_target}</>
                    )}
                  </td>

                  <td
                    className={`${
                      item.roncom === "OK" || item.roncom === "Ok"
                        ? "bg-success text-center"
                        : item.roncom === "NG(Drawing)" || item.roncom === "Ng"
                        ? "bg-danger text-center"
                        : item.roncom === "Max" || item.roncom === "Min"
                        ? "bg-warning text-center"
                        : item.roncom === "Over target" ||
                          item.roncom === "Under target"
                        ? "bg-orange text-center"
                        : "text-center"
                    }`}
                  >
                    {item.roncom} <br />
                    {/* เงื่อนไขสำหรับ NG(Drawing) */}
                    {item.roncom === "NG(Drawing)" && (
                      <>
                        {item.roncom_ng_target_spec} <br />
                        {item.roncom_ng_drawing_spec}
                      </>
                    )}
                    {/* เงื่อนไขสำหรับ Over target */}
                    {item.roncom === "Over target" && (
                      <>{item.roncom_over_target}</>
                    )}
                    {/* เงื่อนไขสำหรับ Under target */}
                    {item.roncom === "Under target" && (
                      <>{item.roncom_under_target}</>
                    )}
                  </td>

                  <td
                    className={`${
                      item.talysurf === "OK" || item.talysurf === "Ok"
                        ? "bg-success text-center"
                        : item.talysurf === "NG(Drawing)" ||
                          item.talysurf === "Ng"
                        ? "bg-danger text-center"
                        : item.talysurf === "Max" || item.talysurf === "Min"
                        ? "bg-warning text-center"
                        : item.talysurf === "Over target" ||
                          item.talysurf === "Under target"
                        ? "bg-orange text-center"
                        : "text-center"
                    }`}
                  >
                    {item.talysurf} <br />
                    {/* เงื่อนไขสำหรับ NG(Drawing) */}
                    {item.talysurf === "NG(Drawing)" && (
                      <>
                        {item.talysurf_ng_target_spec} <br />
                        {item.talysurf_ng_drawing_spec}
                      </>
                    )}
                    {/* เงื่อนไขสำหรับ Over target */}
                    {item.talysurf === "Over target" && (
                      <>{item.talysurf_over_target}</>
                    )}
                    {/* เงื่อนไขสำหรับ Under target */}
                    {item.talysurf === "Under target" && (
                      <>{item.talysurf_under_target}</>
                    )}
                  </td>
                  <td
                    className={`${
                      item.qcline_status === "OK"
                        ? "bg-success text-center text-white"
                        : item.qcline_status === "NG"
                        ? "bg-danger text-center"
                        : ""
                    }`}
                  >
                    {item.qcline_status}
                    {/* {item.projector_status === 'NG' && (
                                        <div className="mt-2 text-white text-left">
                                            {item.projector_ng_spec_1 && <div>Spec 1: {item.projector_ng_spec_1}</div>}
                                            {item.projector_ng_spec_2 && <div>Spec 2: {item.projector_ng_spec_2}</div>}
                                            {item.projector_ng_spec_3 && <div>Spec 3: {item.projector_ng_spec_3}</div>}
                                            {item.projector_ng_spec_4 && <div>Spec 4: {item.projector_ng_spec_4}</div>}
                                            {item.projector_ng_spec_5 && <div>Spec 5: {item.projector_ng_spec_5}</div>}
                                        </div>
                                    )} */}
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>

      {/*------ Start Add Modal Register ---------------------------------------------------- */}
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
              <label>Barcode</label>
              <input
                onChange={(e) =>
                  setProduct({ ...product, barcode: e.target.value })
                }
                className="form-control"
                id="barcodeRegister"
              />
            </div>
            <div className="mt-3 col-3">
              <label>Name</label>
              <input
                // value={memberName} Cancel Auto Login uer
                // onChange={(e) => setName((e.target.value = { name }))} Cancel Auto Login uer
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value.toUpperCase() })
                }
                className="form-control"
                id="nameRegister"
                placeholder="Input ........."
              />
            </div>

            <div className=" main1 mt-3 col-3">
              <label>SHIFT</label>
              <input
                onChange={(e) =>
                  setProduct({ ...product, shift: e.target.value })
                }
                list="data101"
                className="form-control"
                id="shiftRegister"
                placeholder="Shift..."
              />
              <datalist id="data101">
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
                  machines && machines.result // ตรวจสอบว่า machines และ machines.result มีค่าหรือไม่
                    ? machines.result.map((item) => ({
                        value: item.Machine_Number,
                        label: item.Machine_Number,
                      }))
                    : [] // ให้ map ผ่านรายการว่างหากไม่มีค่า
                }
                onChange={(selectedOption) =>
                  setProduct({ ...product, machine: selectedOption.value })
                }
              />
            </div>

            <div className="mt-3 col-6">
              <label>MODEL</label>
              <Select
                options={
                  partModel && partModel.result // ตรวจสอบว่า partModel และ partModel.result มีค่าหรือไม่
                    ? partModel.result.map((item) => ({
                        value: item.Partname_Model,
                        label: item.Partname_Model,
                      }))
                    : [] // ให้ map ผ่านรายการว่างหากไม่มีค่า
                }
                onChange={(selectedOption) =>
                  setProduct({ ...product, model: selectedOption.value })
                }
                id="modelRegister"
              />
            </div>
            <div className="mt-3 col-6">
              <label>PROCESS</label>
              <Select
                options={
                  process && process.result // ตรวจสอบว่า partModel และ partModel.result มีค่าหรือไม่
                    ? process.result.map((item) => ({
                        value: item.process,
                        label: item.process,
                      }))
                    : [] // ให้ map ผ่านรายการว่างหากไม่มีค่า
                }
                onChange={(selectedOption) =>
                  setProduct({ ...product, process: selectedOption.value })
                }
                id="processRegister"
              />
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body" id="bodyRoncom">
              <div className="container" id="tool-number">
                <h3 className="h3">
                  <b className="ml-3">Tool Number</b>
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
                              setProduct({
                                ...product,
                                t1: e.target.checked ? "T1" : "-",
                              })
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
                            type="checkbox"
                            id="checkboxPrimary3"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary4"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary5"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary6"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary7"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary8"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary9"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary10"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary11"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary14"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary15"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary16"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary17"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary18"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary19"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary20"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary21"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary22"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary23"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary24"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary25"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary26"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary27"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary28"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary29"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary30"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary31"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary32"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary33"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary34"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary35"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary36"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary37"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary38"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary39"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary40"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary41"
                          />
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
                            type="checkbox"
                            id="checkboxPrimary42"
                          />
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
                <div className="h3 col-9 bg-info ml-2" id="condition-machine">
                  Machine Condition
                </div>
              </div>
              {/* Start Machine condition */}
              <div className="card">
                <div className="row ml-3 mt-2">
                  <div className="col-sm-2 mt-1">
                    <div className="form-group clearfix">
                      <div className="d-inline">
                        <input
                          onChange={(e) =>
                            setProduct({ ...product, oil: e.target.value })
                          }
                          value="OK"
                          type="checkbox"
                          id="checkboxPrimaryOil"
                          className="large-checkbox"
                        />
                        <label className="ml-1" htmlFor="checkboxPrimaryOil">
                          Oil OK
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2 mt-1">
                    <div className="form-group clearfix">
                      <div className="d-inline">
                        <input
                          onChange={(e) =>
                            setProduct({ ...product, air: e.target.value })
                          }
                          value="OK"
                          type="checkbox"
                          id="checkboxPrimaryAir"
                          className="large-checkbox"
                        />
                        <label className="ml-1" htmlFor="checkboxPrimaryAir">
                          Air OK
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2 ml-2 mt-1">
                    <div className="form-group clearfix">
                      <div className="d-inline">
                        <input
                          onChange={(e) =>
                            setProduct({ ...product, pusher: e.target.value })
                          }
                          value="OK"
                          type="checkbox"
                          id="checkboxPrimaryPusher"
                          className="large-checkbox"
                        />
                        <label className="" htmlFor="checkboxPrimaryPusher">
                          Pusher OK
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 ml-3 mt-1">
                    <div className="form-group clearfix">
                      <div className="d-inline">
                        <input
                          onChange={(e) =>
                            setProduct({ ...product, stopper: e.target.value })
                          }
                          value="OK"
                          type="checkbox"
                          id="checkboxPrimaryStopper"
                          className="large-checkbox"
                        />
                        <label className="" htmlFor="checkboxPrimaryStopper">
                          Stopper OK
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Machine condition */}
              <div className="card">
                <div className="row mt-3">
                  <label className="ml-4 mt-3">Part set up :</label>
                  <div className="col-3">
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

      {/*------ End Add Modal Register ---------------------------------------------------------*/}
    </>
  );
}
export default ToolNumber;
