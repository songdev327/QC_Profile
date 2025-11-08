import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { format } from "date-fns";
import "./ToolQC.css";
import { Link } from "react-router-dom";
import BalanceIcon from "@mui/icons-material/Balance";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

function ToolQCSearch() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [productImage, setProductImage] = useState({});
  const [productImages, setProductImages] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [status, setStatus] = useState();
  const [mesering, setMesering] = useState();
  const [afterset, setAfterset] = useState();

  const [memberName, setMemberName] = useState("");
  const [dateeqm, setDateeqm] = useState("");
  const [timeeqm, setTimeeqm] = useState("");

  const [name_qc_by_off, setName_qc_by_off] = useState("");
  const [date_qc_by_off, setDate_qc_by_off] = useState("");
  const [time_qc_by_off, setTime_qc_by_off] = useState("");
  const [nameafterset, setNameafterset] = useState();

  const [contour_ng_tool_no, setContour_ng_tool_no] = useState("");
  const [contour_ng_detail, setContour_ng_detail] = useState("");
  const [sulfcom_ng_tool_no, setSulfcom_ng_tool_no] = useState("");
  const [sulfcom_ng_detail, setSulf_ng_detail] = useState("");
  const [roncom_ng_tool_no, setRoncom_ng_tool_no] = useState("");
  const [roncom_ng_detail, setRon_ng_detail] = useState("");
  const [talysurf_ng_tool_no, setTalysurf_ng_tool_no] = useState("");
  const [talysurf_ng_detail, setTalysurf_ng_detail] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // Time in seconds for countdown (30 minutes)

  const [machines, setMachines] = useState(""); // สร้าง state เพื่อเก็บข้อมูลเครื่อง
  const [currentPage, setCurrentPage] = useState(1); // ประกาศ state currentPage

  const [showAftersetList, setShowAftersetList] = useState(false);

  useEffect(() => {
    getMachines();
    fetchDataUser();
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().slice(0, 8);
    setDateeqm(formattedDate);
    setTimeeqm(formattedTime);

    const nowOC = new Date();
    const formattedDateQC = nowOC.toISOString().split("T")[0];
    const formattedTimeQC = nowOC.toTimeString().slice(0, 8);
    setDate_qc_by_off(formattedDateQC);
    setTime_qc_by_off(formattedTimeQC);
  }, []);

  useEffect(() => {
    handlePageClick({ selected: currentPage - 1 });
    const interval = setInterval(() => {
      handlePageClick({ selected: currentPage - 1 });
      window.location.reload();
    }, 1800000);

    return () => clearInterval(interval);
  }, [currentPage]);

  useEffect(() => {
    // Timer countdown for 30 minutes
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          window.location.reload(); // Reload the page after 30 minutes
          return 1800; // Reset the timer to 30 minutes = 1800
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    // Clear interval when component is unmounted
    return () => clearInterval(interval);
  }, []);

  const fetchDataSearch = async (machine) => {
    try {
      if (!machine || !machine.trim()) {
        Swal.fire({
          title: "CONFIRM",
          text: "กรุณาใส่ Machine เพื่อค้นหาข้อมูล",
          icon: "warning",
        });
        return;
      }
      if (!startDate || !endDate) {
        Swal.fire({
          title: "CONFIRM",
          text: "กรุณาใส่วันที่เริ่มและวันที่สิ้นสุด",
          icon: "warning",
        });
        return; // Exit function
      }
      const response = await axios.post(
        config.api_path + "/product/ProductMCQC",
        { machine, startDate, endDate },
        config.headers()
      );

      if (response.data.results.length === 0) {
        Swal.fire({
          title: "ไม่พบข้อมูล Machine",
          text: "กรุณาตรวจสอบ Machine อีกครั้ง",
          icon: "error",
        });
        return;
      }
      setProducts(response.data.results);
      console.log("Fetched products:", response.data.results);
      Swal.fire({
        title: "Success",
        text: "ค้นหา Machine ที่ต้องการสำเร็จ",
        icon: "success",
      });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const fetchDataUser = async () => {
    try {
      await axios
        .get(config.api_path + "/member/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMemberName(res.data.result.name);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

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
          const formData = new FormData();
          formData.append("productImage", productImage);
          formData.append("productId", product.id);
          formData.append("status", status);
          formData.append("mesering", mesering);
          // formData.append("barcode", barcode);
          formData.append("barcode", product.barcode);
          formData.append("name", product.name);
          formData.append("shift", product.shift);
          formData.append("machine", product.machine);
          formData.append("model", product.model);
          formData.append("process", product.process);
          formData.append("t1", product.t1);
          formData.append("t2", product.t2);
          formData.append("t3", product.t3);
          formData.append("t4", product.t4);
          formData.append("t5", product.t5);
          formData.append("t6", product.t6);
          formData.append("t7", product.t7);
          formData.append("t8", product.t8);
          formData.append("t9", product.t9);
          formData.append("t10", product.t10);
          formData.append("t11", product.t11);
          formData.append("t12", product.t12);
          formData.append("t13", product.t13);
          formData.append("t14", product.t14);
          formData.append("t15", product.t15);
          formData.append("t16", product.t16);
          formData.append("afterset", product.afterset);

          const _config = {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem(config.token_name),
              "Content-Type": "multipart/form-data",
            },
          };

          await axios
            .post(config.api_path + "/productImage/insert", formData, _config)
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  title: "Upload Profile",
                  text: "Upload Profile Ok",
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

  const handleChooseProduct = (item) => {
    setProduct(item);
    fetchDataProductImage(item);
  };

  function getStatusColor(status) {
    if (status === "OK" || status === "Ok") {
      return "#33cc33"; // green
    } else if (status === "NG(Drawing)" || status === "Ng" || status === "NG") {
      return "#ff0000"; // red
    } else if (status === "Max") {
      return "#ffff00"; // yellow
    } else if (status === "Min") {
      return "#ffff00"; // yellow
    } else if (status === "Over target") {
      return "#ff9966"; // orange
    } else if (status === "Under target") {
      return "#ff9966"; // orange
    } else {
      return "black"; // default color for undefined statuses
    }
  }

  const fetchDataProductImage = async (item) => {
    try {
      await axios
        .get(
          config.api_path + "/productImage/list/" + item.id,
          config.headers()
        )
        .then((res) => {
          if (res.data.message === "success") {
            setProductImages(res.data.results);
          }
        })
        .catch((err) => {
          throw err.response.data;
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
      const response = await axios.get(config.api_path + "/getDataMC");
      setMachines(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handlePageClick = async (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage); // อัปเดตหน้าปัจจุบัน
    const limit = 50; // แสดง 50 รายการต่อหน้า
    const offset = (selectedPage - 1) * limit; // คำนวณ offset ตามหน้าที่เลือก

    try {
      const response = await axios.get(
        `${config.api_path}/productSLV/listNewComponentSLV?offset=${offset}&limit=${limit}`,
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

  const [selectedMCType, setSelectedMCType] = useState(() => {
    // ดึงค่าที่บันทึกใน LocalStorage (ถ้ามี) เพื่อแสดงผลเมื่อผู้ใช้รีเฟรช
    return localStorage.getItem("selectedMCType") || "";
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleMCTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedMCType(selectedValue);
    localStorage.setItem("selectedMCType", selectedValue); // บันทึกค่าลงใน LocalStorage
  };
  useEffect(() => {
    const filtered = products.filter((item) => {
      // ถ้า selectedMCType เป็นค่าว่าง (ALL) ให้แสดงข้อมูลทั้งหมด
      // ถ้าไม่ว่าง ให้กรองเฉพาะที่ machine เริ่มต้นด้วยค่าที่เลือก เช่น 'CH', 'CS', 'SB'
      return selectedMCType === "" || item.machine.startsWith(selectedMCType);
    });
    setFilteredProducts(filtered);
  }, [selectedMCType, products]);


  return (
    <>
      <Link to="/homeQC" class="ml-3">
        {/* <BalanceIcon
          className="text-dark fw-bold ml-3"
          id="iconM"
        />
        QC Equipment */}
        <i className="text-dark nav-icon fas fa-home mt-1 mb-2" id="iconM" />
      </Link>
      {/* <Link to="/toolNumberQC">
        <BalanceIcon
          className="text-dark fw-bold ml-2 mb-2"
          id="icon-mesering-check"
        />
      </Link> */}
      <div className="col-8">
        <div className="col-3 items-per-page-containerSearch mb-2">
          <label
            htmlFor="itemsPerPage1"
            className="form-label1 border-label me-2"
          >
            SELECT M/C TYPE :
          </label>
          <select
            id="itemsPerPage1"
            className="form-select w-auto ml-2"
            value={selectedMCType}
            onChange={handleMCTypeChange}
            style={{ fontSize: "18px", fontWeight: "bold", color: "red" }} // กำหนดขนาดตัวหนังสือของ select ทั้งหมด
          >
            <option style={{ fontWeight: "bold", fontSize: "18px" }} value={""}>
              ALL
            </option>
            <option
              style={{ fontWeight: "bold", fontSize: "18px" }}
              value={"CH"}
            >
              CH
            </option>
            <option
              style={{ fontWeight: "bold", fontSize: "18px" }}
              value={"CS"}
            >
              CS
            </option>
            <option
              style={{ fontWeight: "bold", fontSize: "18px" }}
              value={"SB"}
            >
              SB
            </option>
            <option
              style={{ fontWeight: "bold", fontSize: "18px" }}
              value={"TN"}
            >
              TN
            </option>
          </select>
        </div>
      </div>
      <div className="signup_container d-flex justify-content-center">
        <div className="signup_form w-50">
          <div className="card card-outline card-yellow">
            <div className="card-header text-center" id="tool-qc-search">
              <h3 className="h3">
                <b className="ml-3">
                  ALL SEARCH DATA HISTORY ( SLEEVE ) {Math.floor(timeLeft / 60)}
                  :{timeLeft % 60 < 10 ? "0" : ""}
                  {timeLeft % 60}
                </b>
                <span className="ml-3"></span>
              </h3>
            </div>
            <div className="card-body" id="bodySurfcom">
              <form>
                <div className="input-group">
                  <div className="row">
                    <div className="">
                      <span
                        className="btn border border-secondary-subtle bg-secondary fw-bold ml-4 mr-2"
                        id="spanUser"
                      >
                        Start Date
                      </span>
                      <input
                        onChange={(e) => setStartDate(e.target.value)}
                        type="date"
                        name="startdate"
                        className="form-control mr-3"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="">
                      <span
                        className="btn border border-secondary-subtle bg-secondary fw-bold ml-4  mr-2"
                        id="spanUser"
                      >
                        End Date
                      </span>
                      <input
                        onChange={(e) => setEndDate(e.target.value)}
                        type="date"
                        name="endtdate"
                        className="form-control mr-3"
                      />
                    </div>
                  </div>

                  <div className="col-4 ml-3">
                    <div className="form-group clearfix">
                      <div className="icheck-primary d-inline">
                        <span
                          className="btn border border-secondary-subtle bg-secondary fw-bold mr-2 ml-5"
                          id="spanUser"
                        >
                          Machine
                        </span>
                        <Select
                          options={
                            machines && machines.result // ตรวจสอบว่า machines และ machines.result มีค่าหรือไม่
                              ? machines.result.map((item) => ({
                                value: item.Machine_Number,
                                label: item.Machine_Number,
                              }))
                              : [] // ให้ map ผ่านรายการว่างหากไม่มีค่า
                          }
                          onChange={(selectedOption) => {
                            setSelectedOption(selectedOption); // กำหนดค่าให้กับ selectedOption เมื่อมีการเลือก
                            setProduct({
                              ...product,
                              machine: selectedOption.value,
                            });
                          }}
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: "150px", // จำกัดความสูงของเมนู dropdown
                              overflowY: "auto", // เพิ่มการเลื่อนในแนวตั้ง
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer border border-secondary-subtle">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-success mr-3"
                      onClick={() => {
                        if (!selectedOption) {
                          Swal.fire({
                            title: "ไม่พบข้อมูล Machine",
                            text: "กรุณาตรวจสอบ Machine อีกครั้ง",
                            icon: "error",
                          });
                          return;
                        }
                        fetchDataSearch(selectedOption.value);
                      }}
                    >
                      SEARCH MACHINE NUMBER
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={4} // จำนวนหน้าทั้งหมดเป็น 2 หน้า (50 รายการต่อหน้า, 200 รายการทั้งหมด)
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
        id="table-qc-search"
        style={{ fontSize: "1.0rem" }}
      >
        <thead className="bg-dark" id="table-qc">
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
            <th className="text-center text-white">Result</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "0.9rem" }}>
          {filteredProducts.length > 0
            ? filteredProducts.map((item) => (
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
                  className={`${item.contour === "OK" || item.contour === "Ok"
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
                  className={`${item.sulfcom === "OK" || item.sulfcom === "Ok"
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
                  className={`${item.roncom === "OK" || item.roncom === "Ok"
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
                  className={`${item.talysurf === "OK" || item.talysurf === "Ok"
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
                  className={`${item.qcline_status === "OK"
                      ? "bg-success text-center text-white"
                      : item.qcline_status === "NG"
                        ? "bg-danger text-center"
                        : ""
                    }`}
                >
                  {item.qcline_status}
                </td>

                <td className="text-center">
                  <button
                    // onClick={(e) => handleChooseProduct(item)}
                    // data-toggle="modal"
                    // data-target="#modalProductImage"
                    // className="btn mr-2" id="add-profile-qc"

                    onClick={(e) => {
                      if (item.area_qc_check !== "QC Line") {
                        // เปิด Modal เฉพาะเมื่อไม่ใช่ QC Line
                        handleChooseProduct(item);
                        // ใช้ JavaScript เพื่อเปิด Modal แทนการใช้ data-toggle
                        const modalElement =
                          document.getElementById("modalProductImage");
                        const modalInstance = new window.bootstrap.Modal(
                          modalElement
                        );
                        modalInstance.show(); // เปิด Modal
                      } else {
                        e.preventDefault(); // ป้องกันการทำงานถ้าเป็น QC Line
                        console.log("QC Line selected, cannot open modal.");
                      }
                    }}
                    className="btn mr-2"
                    id="add-profile-qc"
                  >
                    <i className="fa fa-image mr-2"></i>
                    Open
                  </button>
                </td>
              </tr>
            ))
            : ""}
        </tbody>
      </table>

      <Modal id="modalProductImage" title="" modalSize="modal-lg">
        <div className="col-12 mb-3" id="tool-production-list">
          <h3 className="h3">
            <b className="ml-3">Change tool production list</b>
          </h3>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Barcode
            </div>
            <input
              value={product.barcode}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Name
            </div>
            <input value={product.name} className="form-control text-primary" />
          </div>
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Machine
            </div>
            <input
              value={product.machine}
              className="form-control text-primary"
            />
          </div>
          <div className="col-4">
            <div className="text-bold pl-2" id="box-product">
              Model
            </div>
            <input
              value={product.model}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Process
            </div>
            <input
              value={product.process}
              className="form-control text-primary"
            />
          </div>

          <div className="col-12">
            <div className="text-bold mt-2" id="box">
              Change Tool case.
            </div>
            <input
              value={product.tool_change_case}
              className="form-control text-primary pr-1"
            />
          </div>
          <hr className="mt-3 mb-1"></hr>
          {/* Start Machine condition*/}
          <div className="row">
            <div
              className="h4 fw-bold col-12 ml-1 mt-2"
              id="tool-production-Afterset-qc"
            >
              Machine Condition
            </div>
          </div>
          <div className="row">
            <div className="col-2 mt-1">
              <div className="text-bold" id="box">
                Oil
              </div>
              <input
                value={product.oil}
                className="form-control text-primary pr-1"
              />
            </div>
            <div className="col-2 mt-1">
              <div className="text-bold" id="box">
                Air
              </div>
              <input
                value={product.air}
                className="form-control text-primary pr-1"
              />
            </div>
            <div className="col-2 mt-1">
              <div className="text-bold" id="box">
                Pusher
              </div>
              <input
                value={product.pusher}
                className="form-control text-primary pr-1"
              />
            </div>
            <div className="col-2 mt-1">
              <div className="text-bold" id="box">
                Stopper
              </div>
              <input
                value={product.stopper}
                className="form-control text-primary pr-1"
              />
            </div>
            <div className="col-2 mt-1">
              <div className="text-bold" id="box">
                Part set up :
              </div>
              <input
                value={product.part_set_up}
                className="form-control text-primary pr-1"
              />
            </div>
            <div className="col-2">
              <div className="text-bold text-white mt-4">---------</div>
              <div className="text-bold mt-1">PCS.</div>
            </div>
          </div>

          <div className="col-3 mt-2">
            <div className="text-bold text-center" id="qc-inprocess-confirm">
              Status Name QC BY Off
            </div>
            <input
              value={product.name_qc_by_off}
              className="form-control text-dark fw-bold text-center"
              disabled
            />
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="qc-inprocess-confirm">
              Date
            </div>
            <input
              value={date_qc_by_off}
              className="form-control text-dark fw-bold text-center"
              disabled
            />
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="qc-inprocess-confirm">
              Time
            </div>
            <input
              value={time_qc_by_off}
              className="form-control text-dark fw-bold text-center"
              disabled
            />
          </div>
          <hr className="mt-3 mb-1"></hr>
          <hr></hr>

          <div className="col-12 mt-2 mb-3" id="tool-production-Afterset-qc">
            <h3 className="h3">
              <b className="ml-3">Production After set</b>
            </h3>
          </div>

          <div className="col-12">
            <div className="form-group clearfix" id="afterset-change-tool">
              <div className="d-flex flex-column">
                <div
                  className="fw-bold mb-2"
                  style={{ cursor: "pointer", color: "rgb(13, 0, 250)", fontSize: "1.3rem" }}
                  onClick={() => setShowAftersetList(prev => !prev)}
                >
                  Status : AF
                </div>
                {showAftersetList && (
                  <>
                    <div className="d-flex">
                      <input
                        value={product.timeafterset}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "9.0rem" }}
                        disabled
                      />
                      <input
                        value={product.afterset}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.5rem" }}
                        disabled
                      />
                      <input
                        className={`form-control text-primary fw-bold ${product.afterset_eqm === "OK"
                          ? "bg-success text-white"
                          : product.afterset_eqm === "NG(Drawing)"
                            ? "bg-danger text-white"
                            : product.afterset_eqm === "Max" || product.afterset_eqm === "Min"
                              ? "bg-warning text-dark"
                              : product.afterset_eqm === "Over target" || product.afterset_eqm === "Under target"
                                ? "bg-orange text-dark"
                                : ""
                          }`}
                        style={{ height: "2.5rem", width: "8.5rem" }}
                        value={product.afterset_eqm || ""}
                      />
                      <input
                        value="QC"
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.0rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset_eqm || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "8.3rem" }}
                        disabled
                      />
                      <input
                        value={product.timeafterset_eqm || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                    </div>

                    <div className="d-flex mt-1">
                      <input
                        value={product.timeafterset2}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset2}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "9.0rem" }}
                        disabled
                      />
                      <input
                        value={product.afterset2}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.5rem" }}
                        disabled
                      />
                      <input
                        className={`form-control text-primary fw-bold ${product.afterset_eqm2 === "OK"
                          ? "bg-success text-white"
                          : product.afterset_eqm2 === "NG(Drawing)"
                            ? "bg-danger text-white"
                            : product.afterset_eqm2 === "Max" || product.afterset_eqm2 === "Min"
                              ? "bg-warning text-dark"
                              : product.afterset_eqm2 === "Over target" || product.afterset_eqm2 === "Under target"
                                ? "bg-orange text-dark"
                                : ""
                          }`}
                        style={{ height: "2.5rem", width: "8.5rem" }}
                        value={product.afterset_eqm2 || ""}
                      />
                      <input
                        value="QC"
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.0rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset_eqm2 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "8.3rem" }}
                        disabled
                      />
                      <input
                        value={product.timeafterset_eqm2 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                    </div>

                    <div className="d-flex mt-1">
                      <input
                        value={product.timeafterset3}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset3}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "9.0rem" }}
                        disabled
                      />
                      <input
                        value={product.afterset3}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.5rem" }}
                        disabled
                      />
                      <input
                        className={`form-control text-primary fw-bold ${product.afterset_eqm3 === "OK"
                          ? "bg-success text-white"
                          : product.afterset_eqm3 === "NG(Drawing)"
                            ? "bg-danger text-white"
                            : product.afterset_eqm3 === "Max" || product.afterset_eqm3 === "Min"
                              ? "bg-warning text-dark"
                              : product.afterset_eqm3 === "Over target" || product.afterset_eqm3 === "Under target"
                                ? "bg-orange text-dark"
                                : ""
                          }`}
                        style={{ height: "2.5rem", width: "8.5rem" }}
                        value={product.afterset_eqm3 || ""}
                      />
                      <input
                        value="QC"
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.0rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset_eqm3 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "8.3rem" }}
                        disabled
                      />
                      <input
                        value={product.timeafterset_eqm3 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                    </div>

                    <div className="d-flex mt-1">
                      <input
                        value={product.timeafterset4}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset4}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "9.0rem" }}
                        disabled
                      />
                      <input
                        value={product.afterset4}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.5rem" }}
                        disabled
                      />
                      <input
                        className={`form-control text-primary fw-bold ${product.afterset_eqm4 === "OK"
                          ? "bg-success text-white"
                          : product.afterset_eqm4 === "NG(Drawing)"
                            ? "bg-danger text-white"
                            : product.afterset_eqm4 === "Max" || product.afterset_eqm4 === "Min"
                              ? "bg-warning text-dark"
                              : product.afterset_eqm4 === "Over target" || product.afterset_eqm4 === "Under target"
                                ? "bg-orange text-dark"
                                : ""
                          }`}
                        style={{ height: "2.5rem", width: "8.5rem" }}
                        value={product.afterset_eqm4 || ""}
                      />
                      <input
                        value="QC"
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.0rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset_eqm4 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "8.3rem" }}
                        disabled
                      />
                      <input
                        value={product.timeafterset_eqm4 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                    </div>

                    <div className="d-flex mt-1">
                      <input
                        value={product.timeafterset5}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset5}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "9.0rem" }}
                        disabled
                      />
                      <input
                        value={product.afterset5}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.5rem" }}
                        disabled
                      />
                      <input
                        className={`form-control text-primary fw-bold ${product.afterset_eqm5 === "OK"
                          ? "bg-success text-white"
                          : product.afterset_eqm5 === "NG(Drawing)"
                            ? "bg-danger text-white"
                            : product.afterset_eqm5 === "Max" || product.afterset_eqm5 === "Min"
                              ? "bg-warning text-dark"
                              : product.afterset_eqm5 === "Over target" || product.afterset_eqm5 === "Under target"
                                ? "bg-orange text-dark"
                                : ""
                          }`}
                        style={{ height: "2.5rem", width: "8.5rem" }}
                        value={product.afterset_eqm5 || ""}
                      />
                      <input
                        value="QC"
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "4.0rem" }}
                        disabled
                      />
                      <input
                        value={product.nameafterset_eqm5 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "8.3rem" }}
                        disabled
                      />
                      <input
                        value={product.timeafterset_eqm5 || ""}
                        className="form-control text-primary fw-bold"
                        style={{ height: "2.5rem", width: "5.5rem" }}
                        disabled
                      />
                    </div>

                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="mb-1"></hr>

          <hr></hr>

          <div className="col-2">
            <div className="text-bold text-center bg-secondary">User EQM</div>
            <input
              value={memberName}
              disabled
              className="form-control text-center text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold text-center bg-secondary">Date</div>
            <input
              value={dateeqm}
              disabled
              onChange={(e) => setDateeqm(e.target.value)}
              className="form-control text-center text-primary"
            />
          </div>

          <div className="col-2">
            <div className="text-bold text-center bg-secondary">Time</div>
            <input
              value={timeeqm}
              disabled
              onChange={(e) => setTimeeqm(e.target.value)}
              className="form-control text-center text-primary"
            />
          </div>

          <div className="col-12 mt-2 mb-3" id="tool-qc-confirm">
            <h3 className="h3">
              <b className="ml-3">QC Equipment confirm</b>
            </h3>
          </div>
        </div>

        <div className="btn mt-3" id="result-mesering">
          Result Profile
        </div>
        <div className="row">
          {productImages.length > 0
            ? productImages.map((item) => (
              <div className="col-12" key={item.id}>
                {/* <div>
                    <img
                      src={config.api_path + "/uploads/" + item.imageName}
                      width="300px"
                      height="500px"
                      alt=""
                    />
                  </div> */}
                <button className="btn mt-3" id="mesering">
                  Mesering : {item.mesering}
                </button>
                <button className="btn mt-3" id="mesering">
                  After Set : {item.afterset}
                </button>
                {/* <button className="btn mt-3 ml-1" id="mesering">{item.status}</button> */}

                <button className="btn mt-3" id="mesering">
                  Time :{" "}
                  {format(new Date(item.updatedAt), "yyyy-MM-dd HH:mm")}
                </button>

                <button
                  className="btn mt-3 ml-1"
                  id="mesering-1"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {item.status}
                </button>

                <div>
                  <iframe
                    style={{ width: "43.75rem", height: "50rem" }}
                    src={config.api_path + "/uploads/" + item.imageName}
                    alt=""
                  ></iframe>
                </div>
                <div>{/* {" "} */}</div>
              </div>
            ))
            : ""}
        </div>
      </Modal>
    </>
  );
}

export default ToolQCSearch;
