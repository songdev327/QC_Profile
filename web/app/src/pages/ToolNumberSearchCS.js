import { useState, useEffect } from "react";
import config from "../config";
import axios from "axios";
import { format } from "date-fns";
import { useMemo } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "./components/Modal";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ModalProjector from "./components/ModalProjector";
import ModalQCInprocessShaft from "./components/ModalQCInprocessShaft";
import ModalQCInspection from "./components/ModalQCInspection"
// import RotateLeftIcon from '@mui/icons-material/RotateLeft';

function ToolNumberSearchCS(props) {
  const [product, setProduct] = useState({
    //---- Start Edit chart Request Morita 18/04/25 ---------------------------------------------------
    afterset: "",
    afterset2: "",
    afterset3: "",
    afterset4: "",
    afterset5: "",
    nameafterset: "",
    nameafterset2: "",
    nameafterset3: "",
    nameafterset4: "",
    nameafterset5: "",
  });

  let currentStep = null;
  if (product.afterset === "AF1" && product.nameafterset?.trim()) {
    currentStep = 1;
  }
  if (product.afterset2 === "AF2" && product.nameafterset2?.trim()) {
    currentStep = 2;
  }
  if (product.afterset3 === "AF3" && product.nameafterset3?.trim()) {
    currentStep = 3;
  }
  if (product.afterset4 === "AF4" && product.nameafterset4?.trim()) {
    currentStep = 4;
  }
  if (product.afterset5 === "AF5" && product.nameafterset5?.trim()) {
    currentStep = 5;
  }

  const getLockedStatus = (stepNumber) => {
    if (stepNumber === 1) {
      return (
        product.afterset !== "" || // กำลังอยู่ระหว่างขั้นตอน
        product.afterset2 !== "" ||
        product.afterset3 !== "" ||
        product.afterset4 !== "" ||
        product.afterset5 !== "" ||
        (product.afterset === "AF1" && product.nameafterset?.trim()) // เงื่อนไขนี้ทำให้ติ๊กได้ครั้งแรก
      );
    }
    return currentStep !== null && stepNumber !== currentStep + 1;
  };

  //---- End Edit chart Request Morita 18/04/25 ---------------------------------------------------

  const [products, setProducts] = useState([]);

  const [model, setModel] = useState("");
  const [process, setProcess] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productImage, setProductImage] = useState({});
  const [productImagesProjector, setProductImagesProjector] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nameafterset, setNameafterset] = useState("");
  const [dateafterset, setDateafterset] = useState("");
  const [timeafterset, setTimeafterset] = useState("");

  const [nameafterset2, setNameafterset2] = useState("");
  const [dateafterset2, setDateafterset2] = useState("");
  const [timeafterset2, setTimeafterset2] = useState("");
  const [nameafterset3, setNameafterset3] = useState("");
  const [nameafterset4, setNameafterset4] = useState("");
  const [nameafterset5, setNameafterset5] = useState("");


  const [name_qc_by_off, setName_qc_by_off] = useState("");
  const [date_qc_by_off, setDate_qc_by_off] = useState("");
  const [time_qc_by_off, setTime_qc_by_off] = useState("");
  const [contour_ng_tool_no, setContour_ng_tool_no] = useState("");
  const [contour_ng_detail, setContour_ng_detail] = useState("");
  const [sulfcom_ng_tool_no, setSulfcom_ng_tool_no] = useState("");
  const [sulfcom_ng_detail, setSulf_ng_detail] = useState("");
  const [roncom_ng_tool_no, setRoncom_ng_tool_no] = useState("");
  const [roncom_ng_detail, setRon_ng_detail] = useState("");
  const [talysurf_ng_tool_no, setTalysurf_ng_tool_no] = useState("");
  const [talysurf_ng_detail, setTalysurf_ng_detail] = useState("");
  const [projector_type, setProjector_type] = useState("Projector");
  const [projector_status, setProjector_status] = useState("");
  const [name_qc_projector_check, setName_qc_projector_check] = useState("");
  const [date_qc_projector_check, setDate_qc_projector_check] = useState();
  const [time_qc_projector_check, setTime_qc_projector_check] = useState();
  const [date_qc_line, setDate_qc_line] = useState("");
  const [time_qc_line, setTime_qc_line] = useState("");
  const [end_time_qc_line, setEnd_time_qc_line] = useState("");
  const [nameQcLine, setNameQcLine] = useState("");
  const [productId, setProductId] = useState(null);
  const [qcDataStatus, setQcDataStatus] = useState([]);
  const [nameQcCheck, setNameQcCheck] = useState("");
  const [showCheckButton, setShowCheckButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toolNumbers, setToolNumbers] = useState([]);
  const [selectedTNumber, setSelectedTNumber] = useState([]);
  const [toolNumbersFetched, setToolNumbersFetched] = useState(false);
  const [selectAllTool, setSelectAllTool] = useState(false);
  const [specInputs, setSpecInputs] = useState({});
  const [specToolNo, setSpecToolNo] = useState("");
  const [machines, setMachines] = useState("");
  const [machinesSearch, setMachinesSearch] = useState("");
  const [passChecked, setPassChecked] = useState([]);
  const [rejectChecked, setRejectChecked] = useState([]);
  const [af1Checked, setAf1Checked] = useState(false);
  const [af2Checked, setAf2Checked] = useState(false);
  const [af3Checked, setAf3Checked] = useState(false);
  const [af4Checked, setAf4Checked] = useState(false);
  const [af5Checked, setAf5Checked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [end_time_qc_lineAuto, setEnd_time_qc_lineAuto] = useState("");
  const [showNewInput, setShowNewInput] = useState(false); // ใช้ useState เพื่อจัดการสถานะของ input ใหม่
  const [qclineStatus, setQclineStatus] = useState(""); // สร้าง state สำหรับเก็บค่า qcline_status
  const [timeLeft, setTimeLeft] = useState(1800); // Time in seconds for countdown (30 minutes)

  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการเปลี่ยนค่าใน select
  const handleQclineStatusChange = (e) => {
    setQclineStatus(e.target.value); // ตั้งค่าของ qcline_status เมื่อเลือกใน select
  };

  const [selectAll, setSelectAll] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    oil: false,
    air: false,
    pusher: false,
    stopper: false,
  });
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setCheckboxValues({
      oil: !selectAll,
      air: !selectAll,
      pusher: !selectAll,
      stopper: !selectAll,
    });
    setProduct({
      ...product,
      oil: !selectAll ? "OK" : "",
      air: !selectAll ? "OK" : "",
      pusher: !selectAll ? "OK" : "",
      stopper: !selectAll ? "OK" : "",
    });
  };

  const handleCheckboxChangeAll = (field) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setProduct((prev) => ({
      ...prev,
      [field]: !checkboxValues[field] ? "OK" : "",
    }));
  };

  useEffect(() => {
    if (props.spec && props.spec.spec_tool_no) {
      setSpecToolNo(props.spec.spec_tool_no);
    }
  }, [props.spec]);

  useEffect(() => {
    if (product.name_qc_by_off) {
      setName_qc_projector_check(product.name_qc_by_off);
    }
  }, [product.name_qc_by_off]);

  const handleUploadImage = () => {
    console.log("Projector Type: ", product.projector_type);
    Swal.fire({
      title: "Upload Image",
      text: "โปรดยืนยันการอัปโหลดไฟล์รูปภาพ",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("productImage", productImage);
          formData.append("productId", product.id);
          formData.append("barcode", product.barcode);
          formData.append("name", product.name);
          formData.append("shift", product.shift);
          formData.append("machine", product.machine);
          formData.append("model", product.model);
          formData.append("process", product.process);
          formData.append("afterset", product.afterset);
          formData.append("projector_type", "Projector");
          formData.append("projector_status", "NG");

          const _config = {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem(config.token_name),
              "Content-Type": "multipart/form-data",
            },
          };

          await axios
            .post(
              config.api_path + "/productImage/insertImageProjector",
              formData,
              _config
            )
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  title: "Upload Image",
                  text: "Upload Image successful",
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

  useEffect(() => {
    getMachines();

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().slice(0, 8);
    const formattedTimeAuto = now.toTimeString().slice(0, 8);
    setDateafterset(formattedDate);
    setTimeafterset(formattedTime);
    setEnd_time_qc_lineAuto(formattedTimeAuto);

    const nowAutoDate = new Date();
    const DateAF2 = nowAutoDate.toISOString().split("T")[0];
    const TimeAF2 = nowAutoDate.toTimeString().slice(0, 8);
    setDateafterset2(DateAF2);
    setTimeafterset2(TimeAF2);

    const nowOC = new Date();
    const formattedDateQC = nowOC.toISOString().split("T")[0];
    const formattedTimeQC = nowOC.toTimeString().slice(0, 8);
    setDate_qc_by_off(formattedDateQC);
    setTime_qc_by_off(formattedTimeQC);

    const nowQCProjector = new Date();
    const formattedDateQCProjector = nowQCProjector.toISOString().split("T")[0];
    const formattedTimeQCProjector = nowQCProjector.toTimeString().slice(0, 8);
    setDate_qc_projector_check(formattedDateQCProjector);
    setTime_qc_projector_check(formattedTimeQCProjector);
  }, []);

  useEffect(() => {
    handlePageClick({ selected: currentPage - 1 });
    const interval = setInterval(() => {
      handlePageClick({ selected: currentPage - 1 });
      window.location.reload();
    }, 1800000); // 1800000ms คือ 30 นาที หน้าเว็บรีเฟรชทุก 30 นาที (30 * 60 * 1000 milliseconds หรือ 1,800,000ms)
    return () => clearInterval(interval);
  }, [currentPage]);

  useEffect(() => {
    getMachinesSearch();
  }, []);

  useEffect(() => {
    if (product) {
      setAf1Checked(product.afterset === "AF1");
      setAf2Checked(product.afterset2 === "AF2");
      setAf3Checked(product.afterset3 === "AF3");
      setAf4Checked(product.afterset4 === "AF4");
      setAf5Checked(product.afterset5 === "AF5");
    }
  }, [product]);

  function handleAf1Change(e) {
    const { checked } = e.target;
    setAf1Checked(checked);
    if (checked) {
      setAf2Checked(false) &&
        setAf3Checked(false) &&
        setAf4Checked(false) &&
        setAf5Checked(false);
    }
  }
  function handleAf2Change(e) {
    const { checked } = e.target;
    setAf2Checked(checked);
    if (checked) {
      setAf1Checked(false) &&
        setAf3Checked(false) &&
        setAf4Checked(false) &&
        setAf5Checked(false);
    }
  }
  function handleAf3Change(e) {
    const { checked } = e.target;
    setAf3Checked(checked);
    if (checked) {
      setAf1Checked(false) &&
        setAf2Checked(false) &&
        setAf4Checked(false) &&
        setAf5Checked(false);
    }
  }
  function handleAf4Change(e) {
    const { checked } = e.target;
    setAf4Checked(checked);
    if (checked) {
      setAf1Checked(false) &&
        setAf2Checked(false) &&
        setAf3Checked(false) &&
        setAf5Checked(false);
    }
  }
  function handleAf5Change(e) {
    const { checked } = e.target;
    setAf5Checked(checked);
    if (checked) {
      setAf1Checked(false) &&
        setAf2Checked(false) &&
        setAf3Checked(false) &&
        setAf4Checked(false);
    }
  }

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
      // console.log("Fetched products:", response.data.results);
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

  const handlePageClick = async (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    const limit = 50;
    const offset = (selectedPage - 1) * limit;
    try {
      const response = await axios.get(
        `${config.api_path}/product/listNewProductionSleeveCS?offset=${offset}&limit=${limit}`,
        config.headers()
      );
      if (response.data.message === "success") {
        setProducts(response.data.results.slice(0, limit));
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
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
      return "rgb(255, 193, 94)"; // yellow
    } else if (status === "Min") {
      return "rgb(255, 193, 94)"; // yellow
    } else if (status === "Over target") {
      return "#ff9966"; // orange
    } else if (status === "Under target") {
      return "#ff9966"; // orange
    } else {
      return "black";
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
      const response = await axios.get(config.api_path + "/machinesCS/listOnlyTool");
      if (Array.isArray(response.data.results)) {
        setMachines(response.data.results);
      } else {
        setMachines([]);
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const getMachinesSearch = async () => {
    try {
      const response = await axios.get(config.api_path + "/getDataMC");
      setMachinesSearch(response.data);
      // console.log(response);
    } catch (error) {
      console.error("Error fetching machines:", error);
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
      // console.log("Full API response:", response.data);

      if (response.data.message === "success") {
        // console.log("Model set to:", response.data.model);
        // console.log("Process set to:", response.data.process);

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


  //---- Start Edit chart Request Morita 18/04/25 ---------------------------------------------------

  const handleSaveAfterSetUnified = async (e, type) => {
    e.preventDefault();

    let isChecked = false;
    let name = "";
    let date = "";
    let time = "";
    let nameField = "";
    let dateField = "";
    let timeField = "";

    // กำหนดค่าตามประเภท AF
    switch (type) {
      case "AF1":
        isChecked = af1Checked;
        name = nameafterset;
        date = dateafterset;
        time = timeafterset;
        nameField = "nameafterset";
        dateField = "dateafterset";
        timeField = "timeafterset";
        break;
      case "AF2":
        isChecked = af2Checked;
        name = nameafterset2;
        date = dateafterset2;
        time = timeafterset2;
        nameField = "nameafterset2";
        dateField = "dateafterset2";
        timeField = "timeafterset2";
        break;
      case "AF3":
        isChecked = af3Checked;
        name = nameafterset3;
        date = dateafterset2;
        time = timeafterset2;
        nameField = "nameafterset3";
        dateField = "dateafterset3";
        timeField = "timeafterset3";
        break;
      case "AF4":
        isChecked = af4Checked;
        name = nameafterset4;
        date = dateafterset2;
        time = timeafterset2;
        nameField = "nameafterset4";
        dateField = "dateafterset4";
        timeField = "timeafterset4";
        break;
      case "AF5":
        isChecked = af5Checked;
        name = nameafterset5;
        date = dateafterset2;
        time = timeafterset2;
        nameField = "nameafterset5";
        dateField = "dateafterset5";
        timeField = "timeafterset5";
        break;
      default:
        console.error("ไม่รู้จักประเภท AF");
        return;
    }

    // เช็กว่าติ๊ก checkbox แล้วหรือยัง
    if (!isChecked) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: `กรุณาเลือก ${type}`,
        icon: "warning",
      });
      return;
    }

    // เช็กว่ากรอกชื่อหรือยัง
    if (!name || name.trim() === "") {
      Swal.fire({
        title: "แจ้งเตือน",
        text: `กรุณากรอกชื่อในการ ${type}`,
        icon: "warning",
      });
      return;
    }

    try {
      const confirmResult = await Swal.fire({
        title: "คุณต้องการบันทึกข้อมูลใช่ไหม?",
        text: `ยืนยันเพื่อบันทึก After Set ${type}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (confirmResult.isConfirmed) {
        let url = config.api_path + "/product/insert";

        if (product.id !== undefined) {
          url = config.api_path + "/product/update";
        }

        // 🔥 เตรียม payload เฉพาะ field ที่เกี่ยวกับ type นั้น ๆ
        let payload = {
          ...product,
          [nameField]: name,
          [dateField]: date,
          [timeField]: time,
        };

        await axios.post(url, payload, config.headers()).then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "บันทึกข้อมูลสำเร็จ",
              text: `บันทึก After Set ${type} เรียบร้อยแล้ว`,
              icon: "success",
              timer: 1500,
            }).then(() => {
              window.location.reload();
            });
          }
        });
      } else {
        Swal.fire({
          title: "ยกเลิกการบันทึก",
          text: "ข้อมูลยังไม่ถูกบันทึก",
          icon: "info",
        });
      }
    } catch (e) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: e.message,
        icon: "error",
      });
    }
  };

  //---- End Edit chart Request Morita 18/04/25 ---------------------------------------------------

  const handleSaveQCBYoffTN = async (e) => {
    e.preventDefault();
    try {
      let url = config.api_path + "/product/insert";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }
      let payload = {
        ...product,
        date_qc_by_off: date_qc_by_off,
        time_qc_by_off: time_qc_by_off,
      };
      await axios.post(url, payload, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก QC BY OFF แล้ว",
            icon: "success",
          });
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

 const handleSaveCancelRecord = async (e) => {
  e.preventDefault();

  const status = document.getElementById("statusForProduct")?.value;
  const remark = document.getElementById("remarkForProduct")?.value;

  if (!status || !remark) {
    Swal.fire({
      title: "กรุณากรอกข้อมูล",
      text: "กรุณากรอกข้อมูล Cancel และ Remark",
      icon: "warning",
    });
    return;
  }

  try {
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "ไม่พบ ID ของรายการ กรุณารีเฟรชหน้า",
        icon: "error",
      });
      return;
    }

    const url = `${config.api_path}/product/updateCancel/${product.id}`;
    const res = await axios.put(url, product, config.headers());

    if (res.data.message === "success") {
      Swal.fire({
        title: "บันทึกข้อมูล",
        text: "บันทึก Cancel & Remark แล้ว",
        icon: "success",
      });
      window.location.reload();
    }
  } catch (e) {
    Swal.fire({
      title: "error",
      text: e.message,
      icon: "error",
    });
  }
};
  const handleSaveNewPartSetUp = async (e) => {
    e.preventDefault();
    if (document.getElementById("changeInputNewPartSetup").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอกข้อมูล Part set up",
        icon: "warning",
      });
      return;
    }
    try {
      let url = config.api_path + "/product/insert";

      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }
      await axios.post(url, product, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Part set up แล้ว",
            icon: "success",
          });
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

  const openModalAddPartSetUp = () => {
    const modalElement = document.getElementById("modalAddPartSetUp");
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show(); // เปิด Modal
  };

  const closeModalAddPartSetUp = () => {
    const modalElement = document.getElementById("modalAddPartSetUp");
    if (modalElement) {
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.style.display = "none";

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  };

  const [selectedMCType, setSelectedMCType] = useState(
    localStorage.getItem("selectedMCType") || ""
  );
  const hasTNMachine = useMemo(() => {
    const tnMachines = filteredProducts.filter(
      (item) => item.machine && item.machine.startsWith("TN")
    );
    // console.log("Machines starting with 'TN':", tnMachines.map((item) => item.machine));
    return selectedMCType === "TN" && tnMachines.length > 0;
  }, [filteredProducts, selectedMCType]);

  const handleMCTypeChange = (value) => {
    setSelectedMCType(value);
    localStorage.setItem("selectedMCType", value); // บันทึกค่าลงใน LocalStorage

    // เมื่อกดปุ่มแต่ละปุ่ม ให้ไปที่หน้าเฉพาะ
    if (value === "CH") {
      navigate("/toolNumberSearch");
      window.location.reload();
    } else if (value === "CS") {
      navigate("/toolNumberSearchCSlist");
      window.location.reload();
    } else if (value === "SB") {
      navigate("/toolNumberSearchSBlist");
      window.location.reload();
    } else if (value === "TN") {
      navigate("/toolNumberSearchTNlist");
      window.location.reload();
    } else {
      console.log("No specific navigation for the selected value.");
    }
  };

  useEffect(() => {
    const filtered = products.filter((item) => {
      return selectedMCType === "" || item.machine.startsWith(selectedMCType);
    });
    setFilteredProducts(filtered);
    // console.log("Filtered Products:", filtered.map((item) => item.machine));
  }, [selectedMCType, products]);

  //------------------------- Auto Tool -----------------------------------------------------------------------

  useEffect(() => {
    if (product) {
      // console.log("Product data:", product);
      setSelectedOverTarget({
        t1: product.t1 || "",
        t2: product.t2 || "",
        t3: product.t3 || "",
        t4: product.t4 || "",
        t5: product.t5 || "",
        t6: product.t6 || "",
        t7: product.t7 || "",
        t8: product.t8 || "",
        t9: product.t9 || "",
        t10: product.t10 || "",
        t11: product.t11 || "",
        t12: product.t12 || "",
        t13: product.t13 || "",
        t14: product.t14 || "",
        t15: product.t15 || "",
        t16: product.t16 || "",
        t17: product.t17 || "",
        t18: product.t18 || "",
        t19: product.t19 || "",
        t20: product.t20 || "",
        t21: product.t21 || "",
        t22: product.t22 || "",
        t23: product.t23 || "",
        t24: product.t24 || "",
        t25: product.t25 || "",
        t26: product.t26 || "",
        t27: product.t27 || "",
        t28: product.t28 || "",
        t29: product.t29 || "",
        t30: product.t30 || "",
        t31: product.t31 || "",
        t32: product.t32 || "",
        t33: product.t33 || "",
        t34: product.t34 || "",
        t35: product.t35 || "",
        t36: product.t36 || "",
        t37: product.t37 || "",
        t38: product.t38 || "",
        t39: product.t39 || "",
        t40: product.t40 || "",
        t41: product.t41 || "",
        t42: product.t42 || "",
      });
    }
  }, [product]);

  const openModalContourOverTarget = async () => {
    try {
      const modalElement = document.getElementById("modalContourOverTarget");
      const modalInstance = new window.bootstrap.Modal(modalElement);

      // เก็บข้อมูล Tool No จาก product.t1 ถึง product.t42
      const tNumbers = [];
      for (let i = 1; i <= 42; i++) {
        const toolNumber = product[`t${i}`]; // เข้าถึงแต่ละ Tool No
        if (toolNumber) tNumbers.push(toolNumber);
      }

      // หากไม่มี Tool No ทั้งหมดให้แสดงข้อความเตือน
      if (tNumbers.length === 0) {
        Swal.fire({
          title: "Error",
          text: "กรุณากรอกข้อมูล Tool No ทุกตัว",
          icon: "error",
        });
        return;
      }

      // ส่งข้อมูล toolNumbers และ machineNumber ไปยัง API
      const response = await axios.post(
        `${config.api_path}/api/spec1`,
        {
          tNumbers: tNumbers,
          machineNumber: product.machine,
          partNameModel: product.model,
          productId: product.id,
        },
        config.headers()
      );

      const specs = response.data;
      // console.log("Specs fetched:", specs);
      setSpecData(specs); // ใช้ข้อมูลที่ดึงมาเก็บใน state

      // แสดง modal
      modalInstance.show();
    } catch (error) {
      console.error("Error fetching specs:", error);
      const modalElement = document.getElementById("modalContourOverTarget");
      const modalInstance = new window.bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  };

  const closeModalContourOverTarget = () => {
    const modalElement = document.getElementById("modalContourOverTarget");
    if (modalElement) {
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.style.display = "none";
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  };
  const [inputValues, setInputValues] = useState([]);
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    setInputValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = value || "";
      return updatedValues;
    });
  };
  const [specData, setSpecData] = useState([]);
  const [selectedOverTarget, setSelectedOverTarget] = useState([]);
  const handleInputChangeContourOver = (event, key, type) => {
    const { value } = event.target;
    console.log(`Input changed: ${key} = ${value}`);

    if (type === "Over") {
      setSelectedOverTarget((prev) => {
        const updatedTargets = { ...prev };
        updatedTargets[key] = value || "";
        console.log("Updated selectedOverTarget:", updatedTargets);
        return updatedTargets;
      });
    }
  };

  useEffect(() => {
    if (specData.length > 0) {
      const initialPassChecked = specData.map((spec) => spec.pass === "Yes");
      const initialRejectChecked = specData.map(
        (spec) => spec.reject === "Yes"
      );
      setPassChecked(initialPassChecked);
      setRejectChecked(initialRejectChecked);
    }
  }, [specData]);

  const handleCheckboxChangePassReject = (index, type) => {
    let updatedSpecData = [...specData];
    if (type === "pass") {
      updatedSpecData[index].pass =
        updatedSpecData[index].pass === "Yes" ? "No" : "Yes";
      updatedSpecData[index].reject = "No";
      setSpecData(updatedSpecData);
    } else if (type === "reject") {
      updatedSpecData[index].reject =
        updatedSpecData[index].reject === "Yes" ? "No" : "Yes";
      updatedSpecData[index].pass = "No";
      setSpecData(updatedSpecData);
    }
  };

  const fetchPassRejectData = async () => {
    try {
      const response = await axios.get(
        `${config.api_path}/api/qc-line-input-pass-rejectNew`
      );
      // console.log("Fetched QC data:", response.data);
      const qcData = response.data.reduce((acc, item) => {
        acc[item.productId] = { pass: item.pass, reject: item.reject };
        return acc;
      }, {});
      setQcDataStatus(qcData);
    } catch (error) {
      console.error("Error fetching pass/reject data:", error);
    }
  };

  useEffect(() => {
    if (product && product.id) {
      setProductId(product.id);
    }
  }, [product]);

  useEffect(() => {
    fetchPassRejectData();
  }, []);

  const allPass = inputValues.every((value, index) => passChecked[index]);
  const hasNameQcLine = !!nameQcLine;

  const handleOkClickToolNumberList = async () => {
    try {
      if (!product || !product.machine || !product.model) {
        return;
      }
      const machineNumber = product.machine.split("-")[0];
      const partNameModel = product.model;
      const processName = product.process;
      const response = await axios.post(
        `${config.api_path}/api/toolNumBerListNewSpecSleeveCS`,
        {
          machineNumber: machineNumber,
          partNameModel: partNameModel,
          processName: processName,
        }
      );
      if (response.status !== 200 || !Array.isArray(response.data)) {
        return;
      }
      const fetchedToolNumbers = response.data.map((item) => ({
        tool_no: item.tool_no || "",
        selected: false,
        specs: item.specs || [],
        statusOptions: {
          complete: false,
          burr: false,
          broken: false,
          cf: false,
        },
      }));

      // สร้าง specInputs จาก fetchedToolNumbers
      const newSpecInputs = fetchedToolNumbers.reduce(
        (acc, tool, toolIndex) => {
          acc[toolIndex] = tool.specs.reduce((specAcc, spec, specIndex) => {
            specAcc[specIndex] = spec.spec_center || ""; // ใช้ spec_center เป็นค่า default
            return specAcc;
          }, {});
          return acc;
        },
        {}
      );

      setToolNumbers(fetchedToolNumbers);
      setSpecInputs(newSpecInputs); // ตั้งค่า specInputs
      setToolNumbersFetched(true);
    } catch (error) { }
  };

  const handleSelectAllChangeAllTool = () => {
    const newSelectAll = !selectAllTool;
    setSelectAllTool(newSelectAll);
    const updatedToolNumbers = toolNumbers.map((tool) => ({
      ...tool,
      selected: newSelectAll,
    }));
    setToolNumbers(updatedToolNumbers);
  };

  const handleToolSelectionToolNumber = (toolIndex) => {
    const updatedToolNumbers = [...toolNumbers];
    updatedToolNumbers[toolIndex].selected =
      !updatedToolNumbers[toolIndex].selected;
    setToolNumbers(updatedToolNumbers);
  };

  const handleStatusChangeToolNumber = (toolIndex, option) => {
    const updatedToolNumbers = [...toolNumbers];
    if (option === "complete") {
      updatedToolNumbers[toolIndex].statusOptions = {
        complete: !updatedToolNumbers[toolIndex].statusOptions.complete,
        burr: false,
        broken: false,
        cf: false,
      };
    } else if (option === "burr") {
      updatedToolNumbers[toolIndex].statusOptions = {
        complete: false,
        burr: !updatedToolNumbers[toolIndex].statusOptions.burr,
        broken: false,
        cf: false,
      };
    } else if (option === "broken") {
      updatedToolNumbers[toolIndex].statusOptions = {
        complete: false,
        burr: false,
        broken: !updatedToolNumbers[toolIndex].statusOptions.broken,
        cf: false,
      };
    } else if (option === "cf") {
      updatedToolNumbers[toolIndex].statusOptions = {
        complete: false,
        burr: false,
        cf: !updatedToolNumbers[toolIndex].statusOptions.cf,
        broken: false,
      };
    }
    setToolNumbers(updatedToolNumbers);
  };

  const handleSpecInputChange = (toolIndex, specIndex, e) => {
    const value = e.target.value;
    setSpecInputs((prevState) => ({
      ...prevState,
      [toolIndex]: {
        ...prevState[toolIndex],
        [specIndex]: value,
      },
    }));

    const updatedToolNumbers = [...toolNumbers];
    const updatedSpec = updatedToolNumbers[toolIndex]?.specs[specIndex] || {};
    if (value.trim() !== "") {
      updatedSpec.pass = "Yes";
      updatedSpec.reject = "No";
    } else {
      updatedSpec.pass = "-";
      updatedSpec.reject = "-";
    }
    updatedToolNumbers[toolIndex].specs[specIndex] = updatedSpec;
    setToolNumbers(updatedToolNumbers);
  };

  const handleStatusChangeSpec = (toolIndex, specIndex, status) => {
    if (
      !toolNumbers ||
      !toolNumbers[toolIndex] ||
      !toolNumbers[toolIndex].specs ||
      !toolNumbers[toolIndex].specs[specIndex]
    ) {
      console.error("Invalid tool or spec data");
      return;
    }
    const updatedToolNumbers = [...toolNumbers];
    const updatedSpec = { ...updatedToolNumbers[toolIndex].specs[specIndex] };
    if (status === "pass") {
      updatedSpec.pass = updatedSpec.pass === "Yes" ? "-" : "Yes";
      updatedSpec.reject = updatedSpec.pass === "Yes" ? "No" : "-";
    } else if (status === "reject") {
      updatedSpec.reject = updatedSpec.reject === "Yes" ? "-" : "Yes";
      updatedSpec.pass = updatedSpec.reject === "Yes" ? "No" : "-";
    }
    updatedToolNumbers[toolIndex].specs[specIndex] = updatedSpec;
    setToolNumbers(updatedToolNumbers);
  };

  const handleReset = () => {
    setSelectAllTool(false);
    const updatedToolNumbers = toolNumbers.map((tool) => ({
      ...tool,
      selected: false,
    }));
    setToolNumbers(updatedToolNumbers);
  };

  const handleSaveNewAuto = async (e) => {
    e.preventDefault();
    if (!product.area_qc_check) {
      Swal.fire({
        title: "กรุณาเลือก QC Check",
        text: "กรุณาเลือก QC EQM หรือ QC Line",
        icon: "warning",
      });
      return;
    }
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
      return;
    }
    try {
      const selectedTools = {};
      const toolChangeCases = [];
      toolNumbers.forEach((tool) => {
        if (tool.selected) {
          const toolNo = tool.tool_no.toLowerCase();
          const toolKey = parseInt(toolNo.slice(1), 10);

          if (toolKey >= 1 && toolKey <= 42) {
            selectedTools[`t${toolKey}`] = tool.tool_no;

            if (tool.statusOptions.complete) {
              toolChangeCases.push(`${tool.tool_no}, Complete`);
            }
            if (tool.statusOptions.burr) {
              toolChangeCases.push(`${tool.tool_no}, Burr`);
            }
            if (tool.statusOptions.broken) {
              toolChangeCases.push(`${tool.tool_no}, Broken`);
            }
            if (tool.statusOptions.cf) {
              toolChangeCases.push(`${tool.tool_no}, C/F`);
            }
          }
        }
      });
      const statusCheck = toolNumbers.some(
        (tool) =>
          tool.selected && !Object.values(tool.statusOptions).some((v) => v)
      );
      if (statusCheck) {
        Swal.fire({
          title: "กรุณาเลือกสถานะ",
          text: "กรุณาเลือกสถานะสำหรับ Tool Number ที่เลือก",
          icon: "warning",
        });
        return;
      }
      const payload = {
        ...product,
        ...selectedTools,
        origin_barcode: product.barcode, // 🟦 เพิ่มตรงนี้ 08-05-25
        tool_change_case: toolChangeCases.join("; "),
      };
      const productResponse = await axios.post(
        config.api_path + "/product/insertNewToolAuto",
        payload,
        config.headers()
      );
      if (productResponse.data.message === "success") {
        Swal.fire({
          title: "บันทึกข้อมูล",
          text: "บันทึกข้อมูล Change Tool แล้ว",
          icon: "success",
        });
        const productInputSpecs = [];
        toolNumbers.forEach((tool, toolIndex) => {
          if (tool.selected) {
            tool.specs.forEach((spec, specIndex) => {
              const toolStatus = [];
              if (tool.statusOptions.complete) toolStatus.push("Complete");
              if (tool.statusOptions.burr) toolStatus.push("Burr");
              if (tool.statusOptions.broken) toolStatus.push("Broken");
              if (tool.statusOptions.cf) toolStatus.push("cf");
              productInputSpecs.push({
                productId: productResponse.data.result.id,
                barcode: product.barcode,
                name: product.name,
                tool_no: tool.tool_no,
                Machine_Number: product.machine,
                Partname_Model: product.model,
                section_check: spec.section_check,
                rev_control: spec.rev_control,
                part_no: spec.part_no,
                spec_tool_no: spec.spec_tool_no,
                spec_tool_no_input:
                  specInputs[toolIndex]?.[specIndex] || spec.spec_tool_no_input,
                pass: spec.pass || "",
                reject: spec.reject || "",
                tool_change_case: toolStatus.join(", "),
              });
            });
          }
        });
        await axios
          .post(
            config.api_path + "/product/insertProductInputSpec",
            productInputSpecs,
            config.headers()
          )
          .then((response) => {
            console.log("ProductInputSpecModel Data Inserted:", response);
            window.location.reload();
          })
          .catch((error) => {
            console.error(
              "Error inserting data to ProductInputSpecModel:",
              error
            );
          });
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };


  //------------------------------ Start Save Data QC Line Sub cut --------------------------------------------------------------  */
  const handleSaveSpecQCLineOnly_Subcut_input_data = async (e) => {
    e.preventDefault();
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "productId is required",
        icon: "error",
      });
      return;
    }
    if (document.getElementById("name_qc_input_spec").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอก ชื่อผู้กรอกข้อมูล",
        icon: "warning",
      });
      return;
    }

    const productInputSpecs = [];

    specData.forEach((spec, index) => {
      let passValue = "";
      let rejectValue = "";
      if (passChecked[index]) {
        passValue = "Yes";
        rejectValue = "No";
      } else if (rejectChecked[index]) {
        passValue = "No";
        rejectValue = "Yes";
      }

      const updatedSpec = {
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        tool_no: spec.tool_no,
        Machine_Number: product.machine,
        Partname_Model: product.model,
        name_qc_line: nameQcCheck,
        date_qc_line: date_qc_by_off,
        start_time_qc_line: product.time_qc_by_off,
        end_time_qc_line: end_time_qc_lineAuto,
        section_check: spec.section_check,
        spec_tool_no: spec.spec_tool_no,
        spec_tool_no_input: inputValues[index] || spec.spec_tool_no_input,
        pass: passValue,
        reject: rejectValue,
        tool_change_case: "",
      };
      if (spec.id) {
        updatedSpec.id = spec.id;
      }
      productInputSpecs.push(updatedSpec);
    });
    console.log("Payload to update ProductInputSpecModel:", productInputSpecs);
    try {
      const updateResponse = await axios.put(
        config.api_path + "/product/updateProductInputSpec",
        productInputSpecs,
        config.headers()
      );
      console.log(
        "Update response from ProductInputSpecModel:",
        updateResponse
      );
      if (
        updateResponse.data.message === "ProductInputSpec updated successfully"
      ) {
        Swal.fire({
          title: "อัปเดตข้อมูล QC Line",
          text: "อัพเดตข้อมูล QC Line แล้ว",
          icon: "success",
          timer: 2000,
        });
        const updateProductPayload = {
          productId: product.id,
          name_qc_by_off: nameQcCheck,
          end_time_qc_by_off: end_time_qc_lineAuto || null, // ตั้งค่าเป็น null หากค่าว่าง
          qcline_status: qclineStatus, // ส่ง qcline_status ไปด้วย
        };

        // อัปเดต barcode ถ้า qclineStatus เป็น 'OK'
        let barcode = product.barcode;
        if (qclineStatus === "OK") {
          barcode = "Pass"; // กำหนดให้ barcode เป็น 'Pass' เมื่อ qclineStatus เป็น 'OK'
        }

        // ตรวจสอบค่า barcode ก่อนที่จะส่งไปยังฐานข้อมูล
        // console.log("Updated barcode value:", barcode);

        // ส่งข้อมูลที่อัปเดตแล้วไปยังฐานข้อมูล
        const updateProductPayloadWithBarcode = {
          ...updateProductPayload, // ข้อมูลเดิม
          barcode: barcode, // เพิ่มค่า barcode ที่อัปเดต
        };

        const updateProductResponse = await axios.put(
          config.api_path + "/product/updateToolAutoSleeveQCLineOnly",
          updateProductPayloadWithBarcode, // ส่งข้อมูลที่อัปเดตแล้ว,
          config.headers()
        );
        // console.log("Update response from ProductModel:", updateProductResponse);
        if (
          updateProductResponse.data.message === "Product updated successfully"
        ) {
          Swal.fire({
            title: "In put Spec",
            text: "In put Spec Ok แล้ว",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "ไม่สามารถอัปเดตข้อมูลใน ProductModel ได้",
            icon: "error",
          });
        }
        closeModalContourOverTarget();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถอัปเดตข้อมูล QC Line",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSaveNameQCEQM_Subcut = async (e) => {
    e.preventDefault();

    if (document.getElementById("name_qc_input_spec").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอก ชื่อผู้กรอกข้อมูล",
        icon: "warning",
      });
      return;
    }

    const productInputSpecs = [];

    specData.forEach((spec, index) => {
      let passValue = "";
      let rejectValue = "";
      if (passChecked[index]) {
        passValue = "Yes";
        rejectValue = "No";
      } else if (rejectChecked[index]) {
        passValue = "No";
        rejectValue = "Yes";
      }
      const updatedSpec = {
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        tool_no: spec.tool_no,
        Machine_Number: product.machine,
        Partname_Model: product.model,
        name_qc_line: nameQcCheck,
        date_qc_line: date_qc_by_off,
        start_time_qc_line: product.time_qc_by_off,
        end_time_qc_line: end_time_qc_lineAuto,
        section_check: spec.section_check,
        spec_tool_no: spec.spec_tool_no,
        spec_tool_no_input: inputValues[index] || spec.spec_tool_no_input,
        pass: passValue,
        reject: rejectValue,
        tool_change_case: "",
      };
      if (spec.id) {
        updatedSpec.id = spec.id;
      }
      productInputSpecs.push(updatedSpec);
    });
    console.log("Payload to update ProductInputSpecModel:", productInputSpecs);
    try {
      const updateResponse = await axios.put(
        config.api_path + "/product/updateProductInputSpec",
        productInputSpecs,
        config.headers()
      );
      console.log(
        "Update response from ProductInputSpecModel:",
        updateResponse
      );
      if (
        updateResponse.data.message === "ProductInputSpec updated successfully"
      ) {
        Swal.fire({
          title: "อัปเดตข้อมูล QC Line",
          text: "อัพเดตข้อมูล QC Line แล้ว",
          icon: "success",
          timer: 2000,
        });
        const updateProductPayload = {
          productId: product.id,
          name_qc_by_off: nameQcCheck,
          end_time_qc_by_off: end_time_qc_lineAuto || null, // ตั้งค่าเป็น null หากค่าว่าง
          // qcline_status: qclineStatus, // ส่ง qcline_status ไปด้วย
        };
        const updateProductResponse = await axios.put(
          config.api_path + "/product/updateToolAutoSleeve",
          updateProductPayload,
          config.headers()
        );
        console.log(
          "Update response from ProductModel:",
          updateProductResponse
        );
        if (
          updateProductResponse.data.message === "Product updated successfully"
        ) {
          Swal.fire({
            title: "In put Spec",
            text: "In put Spec Ok แล้ว",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "ไม่สามารถอัปเดตข้อมูลใน ProductModel ได้",
            icon: "error",
          });
        }
        closeModalContourOverTarget();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถอัปเดตข้อมูล QC Line",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSaveNameQCLineNot_Data_input = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่า productId มีอยู่หรือไม่
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "productId is required",
        icon: "error",
      });
      return;
    }

    try {
      // ส่งคำขอ PUT เพื่ออัปเดตข้อมูลใน ProductModel
      const updateProductPayload = {
        productId: product.id,
        name_qc_by_off: nameQcCheck || "", // ถ้าไม่มีค่า ให้ส่งค่าว่าง
        end_time_qc_by_off: end_time_qc_lineAuto || null, // ส่งค่า end_time_qc_lineAuto หรือ null หากไม่มี
      };

      const updateProductResponse = await axios.put(
        config.api_path + "/product/updateToolAutoSleeve",
        updateProductPayload,
        config.headers()
      );

      console.log("Update response from ProductModel:", updateProductResponse);

      if (
        updateProductResponse.data.message === "Product updated successfully"
      ) {
        Swal.fire({
          title: "อัปเดตข้อมูล QC Line",
          text: "อัปเดตข้อมูล QC Line แล้ว",
          icon: "success",
          timer: 2000,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถอัปเดตข้อมูลใน ProductModel ได้",
          icon: "error",
        });
      }
      closeModalContourOverTarget();
      window.location.reload();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  //------------------------------ End Save Data QC Line Sub cut --------------------------------------------------------------  */

  //*------------------------------ Start Save Data QC Line TN --------------------------------------------------------------  */
  const handleSaveSpecQCLine_TN_input_data = async (e) => {
    e.preventDefault();

    if (document.getElementById("name_qc_input_spec").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอก ชื่อผู้กรอกข้อมูล",
        icon: "warning",
      });
      return;
    }

    const productInputSpecs = [];

    specData.forEach((spec, index) => {
      let passValue = "";
      let rejectValue = "";
      if (passChecked[index]) {
        passValue = "Yes";
        rejectValue = "No";
      } else if (rejectChecked[index]) {
        passValue = "No";
        rejectValue = "Yes";
      }
      const updatedSpec = {
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        tool_no: spec.tool_no,
        Machine_Number: product.machine,
        Partname_Model: product.model,
        name_qc_line: nameQcCheck,
        date_qc_line: date_qc_by_off,
        start_time_qc_line: product.time_qc_by_off,
        end_time_qc_line: end_time_qc_lineAuto,
        section_check: spec.section_check,
        spec_tool_no: spec.spec_tool_no,
        spec_tool_no_input: inputValues[index] || spec.spec_tool_no_input,
        pass: passValue,
        reject: rejectValue,
        tool_change_case: "",
      };
      if (spec.id) {
        updatedSpec.id = spec.id;
      }
      productInputSpecs.push(updatedSpec);
    });
    console.log("Payload to update ProductInputSpecModel:", productInputSpecs);
    try {
      const updateResponse = await axios.put(
        config.api_path + "/product/updateProductInputSpec",
        productInputSpecs,
        config.headers()
      );
      console.log(
        "Update response from ProductInputSpecModel:",
        updateResponse
      );
      if (
        updateResponse.data.message === "ProductInputSpec updated successfully"
      ) {
        Swal.fire({
          title: "อัปเดตข้อมูล QC Line",
          text: "อัพเดตข้อมูล QC Line แล้ว",
          icon: "success",
          timer: 2000,
        });
        const updateProductPayload = {
          productId: product.id,
          name_qc_by_off: nameQcCheck,
          end_time_qc_by_off: end_time_qc_lineAuto || null, // ตั้งค่าเป็น null หากค่าว่าง
          // qcline_status: qclineStatus, // ส่ง qcline_status ไปด้วย
        };
        const updateProductResponse = await axios.put(
          config.api_path + "/product/updateToolAutoSleeve",
          updateProductPayload,
          config.headers()
        );
        console.log(
          "Update response from ProductModel:",
          updateProductResponse
        );
        if (
          updateProductResponse.data.message === "Product updated successfully"
        ) {
          Swal.fire({
            title: "In put Spec",
            text: "In put Spec Ok แล้ว",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "ไม่สามารถอัปเดตข้อมูลใน ProductModel ได้",
            icon: "error",
          });
        }
        closeModalContourOverTarget();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถอัปเดตข้อมูล QC Line",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSaveSpecQCLineOnly_TN_input_data = async (e) => {
    e.preventDefault();

    if (!nameQcCheck) {
      // เช็คว่า input ว่างหรือไม่
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอก ชื่อผู้กรอกข้อมูล QC",
        icon: "warning",
      });
      return;
    }
    const productInputSpecs = [];

    specData.forEach((spec, index) => {
      let passValue = "";
      let rejectValue = "";
      if (passChecked[index]) {
        passValue = "Yes";
        rejectValue = "No";
      } else if (rejectChecked[index]) {
        passValue = "No";
        rejectValue = "Yes";
      }

      const updatedSpec = {
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        tool_no: spec.tool_no,
        Machine_Number: product.machine,
        Partname_Model: product.model,
        name_qc_line: nameQcCheck,
        date_qc_line: date_qc_by_off,
        start_time_qc_line: product.time_qc_by_off,
        end_time_qc_line: end_time_qc_lineAuto,
        section_check: spec.section_check,
        spec_tool_no: spec.spec_tool_no,
        spec_tool_no_input: inputValues[index] || spec.spec_tool_no_input,
        pass: passValue,
        reject: rejectValue,
        tool_change_case: "",
      };
      if (spec.id) {
        updatedSpec.id = spec.id;
      }
      productInputSpecs.push(updatedSpec);
    });
    console.log("Payload to update ProductInputSpecModel:", productInputSpecs);
    try {
      const updateResponse = await axios.put(
        config.api_path + "/product/updateProductInputSpec",
        productInputSpecs,
        config.headers()
      );
      console.log(
        "Update response from ProductInputSpecModel:",
        updateResponse
      );
      if (
        updateResponse.data.message === "ProductInputSpec updated successfully"
      ) {
        Swal.fire({
          title: "อัปเดตข้อมูล QC Line",
          text: "อัพเดตข้อมูล QC Line แล้ว",
          icon: "success",
          timer: 2000,
        });
        const updateProductPayload = {
          productId: product.id,
          name_qc_by_off: nameQcCheck,
          end_time_qc_by_off: end_time_qc_lineAuto || null, // ตั้งค่าเป็น null หากค่าว่าง
          qcline_status: qclineStatus, // ส่ง qcline_status ไปด้วย
        };

        // อัปเดต barcode ถ้า qclineStatus เป็น 'OK'
        let barcode = product.barcode;
        if (qclineStatus === "OK") {
          barcode = "Pass"; // กำหนดให้ barcode เป็น 'Pass' เมื่อ qclineStatus เป็น 'OK'
        }

        // ตรวจสอบค่า barcode ก่อนที่จะส่งไปยังฐานข้อมูล
        console.log("Updated barcode value:", barcode);

        // ส่งข้อมูลที่อัปเดตแล้วไปยังฐานข้อมูล
        const updateProductPayloadWithBarcode = {
          ...updateProductPayload, // ข้อมูลเดิม
          barcode: barcode, // เพิ่มค่า barcode ที่อัปเดต
        };

        const updateProductResponse = await axios.put(
          config.api_path + "/product/updateToolAutoSleeveQCLineOnly",
          updateProductPayloadWithBarcode, // ส่งข้อมูลที่อัปเดตแล้ว,
          config.headers()
        );
        console.log(
          "Update response from ProductModel:",
          updateProductResponse
        );
        if (
          updateProductResponse.data.message === "Product updated successfully"
        ) {
          Swal.fire({
            title: "In put Spec",
            text: "In put Spec Ok แล้ว",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "ไม่สามารถอัปเดตข้อมูลใน ProductModel ได้",
            icon: "error",
          });
        }
        closeModalContourOverTarget();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถอัปเดตข้อมูล QC Line",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };
  //*------------------------------ End Save Data QC Line TN --------------------------------------------------------------  */

  const closeModalShowAF = () => {
    const modalElement = document.getElementById("modalShowAF");
    if (modalElement) {
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.style.display = "none";
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  };

  return (
    <>
      <Link to="/home" class="ml-3">
        <i className="text-dark nav-icon fas fa-home mt-1" id="iconM" />
      </Link>

      {/* <Link to="/toolNumber" className="mt-1">
        <i className="fa fa-list ml-3 text-dark" id="icon-search"></i>
      </Link> */}

      <div className="row">
        <div className="col-12 items-per-page-containerSearch mb-3">
          <label htmlFor="itemsPerPage1" className="form-label1 border-label me-2">
            SELECT M/C TYPE :
          </label>

          <div className="btn-group" role="group" aria-label="MC Types">
            <button
              type="button"
              className={`btn ${selectedMCType === "CH" ? "btn-primary" : "btn-light"} ml-1`}
              onClick={() => handleMCTypeChange("CH")}
            >
              CH
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "CS" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("CS")}
            >
              CS
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "SB" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("SB")}
            >
              SB
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "TN" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("TN")}
            >
              TN
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <button
          data-toggle="modal"
          data-target="#modalProduct"
          className="btn btn-success col-1"
          id="registerTool"
        >
          Register Tool
          <i
            className="fa fa-cash-register"
            style={{ marginLeft: "0.625rem" }}
          ></i>
        </button>
      </div>
      <div className="signup_container d-flex justify-content-center">
        <div className="signup_form w-50">
          <div className="card card-outline card-pink">
            <div className="card-header text-center" id="record-change-tool">
              <h3 className="h3">
                <b className="ml-3">
                  SEARCH DATA HISTORY ( SLEEVE ) {Math.floor(timeLeft / 60)}:
                  {timeLeft % 60 < 10 ? "0" : ""}
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
                        className="btn border border-secondary-subtle bg-secondary fw-bold ml-3 mr-2"
                        id="spanUser"
                      >
                        Start Date
                      </span>
                      <input
                        onChange={(e) => setStartDate(e.target.value)}
                        type="date"
                        name="startdate"
                        className="form-control mr-1 text-primary"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="">
                      <span
                        className="btn border border-secondary-subtle bg-secondary fw-bold ml-3  mr-2"
                        id="spanUser"
                      >
                        End Date
                      </span>
                      <input
                        onChange={(e) => setEndDate(e.target.value)}
                        type="date"
                        name="endtdate"
                        className="form-control mr-1 text-primary"
                      />
                    </div>
                  </div>

                  <div className="col-6 ml-1">
                    <div className="form-group clearfix">
                      <div className="icheck-primary d-inline">
                        <span
                          className="btn border border-secondary-subtle bg-secondary fw-bold mr-2 ml-2"
                          id="spanUser"
                        >
                          Machine
                        </span>
                        <Select
                          options={
                            machinesSearch && machinesSearch.result // ตรวจสอบว่า machines และ machines.result มีค่าหรือไม่
                              ? machinesSearch.result.map((item) => ({
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
                            singleValue: (provided) => ({
                              ...provided,
                              color: 'rgba(27, 61, 255, 1)',
                            }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: 'rgba(27, 61, 255, 1)',
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
                      SEARCH MACHINE
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
        id="table-product-number"
        style={{ fontSize: "1.0rem" }}
      >
        <thead className="bg-dark" id="record-change-tool-2">
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
                  {item.barcode} <br />
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
                  {item.end_time_qc_by_off}
                  <br />
                  {item.qcline_status}
                </td>

                <td className="text-center">
                  {item.barcode === "Pass" &&
                    item.area_qc_check === "QC Eqm" ? (
                    <>{item.qc_eqm_afterset_end_time}</> // ถ้า product.barcode เป็น 'Pass' และ area_qc_check เป็น 'QC Eqm'
                  ) : item.barcode === "Pass" &&
                    item.area_qc_check === "QC Line" ? (
                    <>{item.end_time_qc_by_off}</> // ถ้า product.barcode เป็น 'Pass' และ area_qc_check เป็น 'QC Line'
                  ) : null}
                  <br />
                  <button
                    onClick={(e) => handleChooseProduct(item)}
                    data-toggle="modal"
                    data-target="#modalProductImage"
                    className="btn"
                    id="add-profile"
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

      {showModal && (
        <Modal id="modalProductTool" title="" modalSize="modal-lg">
          <div className="col-12 mb-1" id="tool-production-list-p">
            <h3 className="h3">
              <b className="ml-3">RECORD TOOL DETAIL</b>
            </h3>
            <h4>Selected T Numbers: {selectedTNumber.join(", ")}</h4>
          </div>
          <form onSubmit={handleSaveNewAuto}>{/* ฟอร์มอื่น ๆ */}</form>
        </Modal>
      )}

      {/*------ Start Add Modal Register ---------------------------------------------------- */}
      <Modal id="modalProduct" title="" modalSize="modal-lg">
        <div className="col-12 mb-1" id="tool-production-list-p">
          <h3 className="h3">
            <b className="ml-3">RECORD TOOL DETAIL</b>
          </h3>
        </div>
        <form onSubmit={handleSaveNewAuto}>
          {/* <form> */}
          <div className="row">
            <div className="mt-3 col-3">
              <label>BARCODE</label>
              <input
                onChange={(e) =>
                  setProduct({ ...product, barcode: e.target.value })
                }
                className="form-control fw-bold"
                id="barcodeRegister"
              />
            </div>
            <div className="mt-3 col-3">
              <label>NAME</label>
              <input
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value.toUpperCase(),
                  })
                }
                className="form-control fw-bold"
                id="nameRegister"
                placeholder="Input ......."
              />
            </div>

            <div className=" main1 mt-3 col-3">
              <label>SHIFT</label>
              <input
                onChange={(e) =>
                  setProduct({ ...product, shift: e.target.value })
                }
                list="data101"
                className="form-control fw-bold"
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
                  machines
                    ? machines.map((item) => ({
                      value: item.Machine_Number,
                      label: item.Machine_Number,
                    }))
                    : []
                }
                styles={{
                  singleValue: (provided) => ({
                    ...provided,
                    fontWeight: 'bold'
                  }),
                }}
                onChange={handleMachineSelect} // เรียกฟังก์ชันเมื่อเลือก Machine
              />
            </div>

            <div className="mt-3 col-6">
              <label>MODEL</label>
              <input
                value={model} // แสดงค่าของ model ที่ได้จากการดึงข้อมูล
                onChange={(e) =>
                  setProduct({ ...product, model: e.target.value })
                }
                className="form-control fw-bold"
                id="modelRegister"
                placeholder="Model..."
              />
            </div>
            <div className="mt-3 col-6">
              <label>PROCESS</label>
              <input
                value={process} // แสดงค่าของ process ที่ได้จากการดึงข้อมูล
                onChange={(e) =>
                  setProduct({ ...product, process: e.target.value })
                }
                className="form-control fw-bold"
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
                  onChange={(e) =>
                    setProduct({ ...product, area_qc_check: "QC Eqm" })
                  }
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
                  onChange={(e) =>
                    setProduct({ ...product, area_qc_check: "QC Line" })
                  }
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

          <div className="card mt-3">
            <div className="card-body" id="bodyRoncom">
              <div className="container" id="tool-number">
                <button
                  className=""
                  id="toolNumber-auto"
                  type="button"
                  onClick={handleOkClickToolNumberList}
                >
                  SELECT TOOL NUMBER
                </button>
              </div>

              <form>
                <div classname="card-body bg-info">
                  <div className="tool-numbers">
                    {toolNumbersFetched && ( // ตรวจสอบว่าได้ดึงข้อมูลมาแล้ว
                      <>
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                          <div className="form-check tool-item mt-3">
                            <input
                              type="checkbox"
                              className="form-check-input custom-checkbox" // เพิ่ม class ที่น
                              id="select-all"
                              checked={selectAllTool}
                              onChange={handleSelectAllChangeAllTool}
                            />
                            <label
                              className="form-check-label fw-bold"
                              htmlFor="select-all"
                              style={{ textDecoration: "underline" }}
                            >
                              SELECT ALL
                            </label>
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleReset} // เรียกใช้ฟังก์ชันเมื่อคลิก
                          >
                            Reset
                          </button>
                        </div>
                      </>
                    )}

                    {toolNumbers.map((tool, toolIndex) => (
                      <>
                        <div key={toolIndex} className="form-check tool-item">
                          <div className="tool-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`tool-${tool.tool_no}`}
                              checked={tool.selected || false}
                              onChange={() =>
                                handleToolSelectionToolNumber(toolIndex)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`tool-${tool.tool_no}`}
                            >
                              {tool.tool_no}
                            </label>
                          </div>
                          <br />

                          {tool.selected && (
                            <div className="status-options">
                              <div>
                                <input
                                  type="checkbox"
                                  id={`complete-${tool.tool_no}`}
                                  checked={tool.statusOptions.complete || false}
                                  onChange={() =>
                                    handleStatusChangeToolNumber(
                                      toolIndex,
                                      "complete"
                                    )
                                  }
                                  className="form-check-input"
                                />
                                <label
                                  id="tool-complete"
                                  htmlFor={`complete-${tool.tool_no}`}
                                >
                                  Complete
                                </label>
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={`burr-${tool.tool_no}`}
                                  checked={tool.statusOptions.burr || false}
                                  onChange={() =>
                                    handleStatusChangeToolNumber(
                                      toolIndex,
                                      "burr"
                                    )
                                  }
                                  className="form-check-input"
                                />
                                <label
                                  id="tool-burr"
                                  htmlFor={`burr-${tool.tool_no}`}
                                >
                                  Burr
                                </label>
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={`broken-${tool.tool_no}`}
                                  checked={tool.statusOptions.broken || false}
                                  onChange={() =>
                                    handleStatusChangeToolNumber(
                                      toolIndex,
                                      "broken"
                                    )
                                  }
                                  className="form-check-input"
                                />
                                <label
                                  id="tool-broken"
                                  htmlFor={`broken-${tool.tool_no}`}
                                >
                                  Broken
                                </label>
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  id={`cf-${tool.tool_no}`}
                                  checked={tool.statusOptions.cf || false}
                                  onChange={() =>
                                    handleStatusChangeToolNumber(
                                      toolIndex,
                                      "cf"
                                    )
                                  }
                                  className="form-check-input"
                                />
                                <label
                                  id="tool-cf"
                                  htmlFor={`cf-${tool.tool_no}`}
                                >
                                  C/F
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {tool.selected && (
                          <div className="specs-container mt-3">
                            {tool.specs.map((spec, specIndex) => {
                              const isHighlight =
                                spec.section_check === "QC Line Check" ||
                                spec.section_check === "QC In process" ||
                                spec.section_check === "SPC Check"; // ตรวจสอบเงื่อนไขใหม่
                              return (
                                <div
                                  key={specIndex}
                                  className={`spec-item ${isHighlight ? "highlight" : ""
                                    }`}
                                  style={{
                                    backgroundColor: isHighlight
                                      ? "#fef7b2"
                                      : "",
                                  }} // ตั้งค่า background color
                                >
                                  <p>
                                    <span className="underline">Tool :</span>{" "}
                                    {spec.tool_no}
                                    <span className="spacing"></span>
                                    <span className="underline">
                                      Part no :
                                    </span>{" "}
                                    {spec.part_no}
                                    <span className="spacing"></span>
                                    <span className="underline">
                                      Rev :
                                    </span>{" "}
                                    {spec.rev_control}
                                    <span className="spacing"></span>
                                    <span className="underline">Section :</span>
                                    {spec.section_check}
                                    <span className="spacing"></span>
                                    <br />
                                    <span style={{ color: "blue" }}>
                                      <span className="underline">Spec :</span>{" "}
                                      {spec.spec_tool_no}
                                    </span>
                                  </p>
                                  <div className="input-checkbox-container d-flex align-items-center">
                                    {/* Input field */}
                                    <input
                                      type="text"
                                      value={
                                        specInputs[toolIndex]?.[specIndex] || ""
                                      }
                                      onChange={(e) =>
                                        handleSpecInputChange(
                                          toolIndex,
                                          specIndex,
                                          e
                                        )
                                      }
                                      // className="form-control me-3 text-primary" 
                                      className={`form-control me-3 ${spec.section_check === "QC Line Check" ? "text-white" : "text-primary"
                                        }`}
                                    />

                                    {/* Checkbox for Pass */}
                                    <div className="status-options mt-3">
                                      <div className="ml-5">
                                        <input
                                          type="checkbox"
                                          id={`pass-${spec.spec_tool_no}`}
                                          checked={spec.pass === "Yes"}
                                          onChange={() =>
                                            handleStatusChangeSpec(
                                              toolIndex,
                                              specIndex,
                                              "pass"
                                            )
                                          }
                                          className="form-check-input pass-checkbox ml-3"
                                        />
                                        <label
                                          id="label-pass-reject"
                                          htmlFor={`pass-${spec.spec_tool_no}`}
                                        >
                                          Pass
                                        </label>
                                      </div>
                                    </div>

                                    {/* Checkbox for Reject */}
                                    <div className="status-options mt-3">
                                      <input
                                        type="checkbox"
                                        id={`reject-${spec.spec_tool_no}`}
                                        checked={spec.reject === "Yes"}
                                        onChange={() =>
                                          handleStatusChangeSpec(
                                            toolIndex,
                                            specIndex,
                                            "reject"
                                          )
                                        }
                                        className="form-check-input reject-checkbox ml-3"
                                      />
                                      <label
                                        id="label-pass-reject"
                                        htmlFor={`reject-${spec.spec_tool_no}`}
                                      >
                                        Reject
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="separator"></div>
                      </>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body" id="bodyRoncom">
              <div className="row">
                <div className="h3 col-9 bg-info ml-2" id="condition-machine">
                  MACHINE CONDITION
                </div>
              </div>
              {/* Start Machine condition */}
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
                        <label className="ml-1" htmlFor="checkboxPrimaryAir">
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
              {/* End Machine condition */}
              <div className="card">
                <div className="row mt-3">
                  <label className="ml-4 mt-3">Part set up :</label>
                  <div className="col-3">
                    <input
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          part_set_up: e.target.value,
                        })
                      }
                      className="form-control"
                      id="partSetupRegister"
                      type="number"
                    />
                  </div>
                  <div className="col-1 mt-3 fw-bold">PCS.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-4">
            <button onChange={handleSaveNewAuto} className="btn btn-success">
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

      {/*------ Start Modal Result ---------------------------------------------------------*/}

      <ModalQCInspection id="modalProductImage" title="" modalSize="modal-dialog-custom-xlll">
        <div className="col-12 mb-3" id="tool-production-list">
          <h3 className="h3">
            <b className="ml-3">Change tool production list</b>
          </h3>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="text-bold" id="box-product">
              Barcode
            </div>
            <input
              // onChange={(e) => setBarcode(e.target.value)}
              value={product.barcode}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold" id="box-product">
              Name
            </div>
            <input
              // onChange={(e) => setName(e.target.value)}
              value={product.name}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold" id="box-product">
              Machine
            </div>

            <input
              // onChange={(e) => setMachine(e.target.value)}
              value={product.machine}
              className="form-control text-primary"
            />
          </div>
          <div className="col-4">
            <div className="text-bold" id="box-product">
              Model
            </div>
            <input
              // onChange={(e) => setModel(e.target.value)}
              value={product.model}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold" id="box-product">
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
          {hasTNMachine && (
            <div className="col-12 mt-2">
              <button
                className="btn btn-primary ml-1 mb-3"
                id="addPartSetUp"
                type="button"
                onClick={openModalAddPartSetUp}
              >
                + part set up
              </button>
            </div>
          )}
          <hr />
          <div className="col-4 mt-2">
            <div className="text-bold text-center" id="qc-inprocess-confirm">
              Status Name QC Line
            </div>
            <input
              value={product.name_qc_by_off}
              className="form-control text-dark fw-bold text-center"
              disabled
            />
          </div>
          <div className="col-3 mt-2">
            <div className="text-bold text-center" id="qc-inprocess-confirm">
              Date
            </div>
            <input
              value={date_qc_by_off}
              onChange={(e) => setDate_qc_by_off(e.target.value)}
              className="form-control text-dark fw-bold text-center"
              disabled
            />
          </div>
          <div className="col-3 mt-2">
            <div className="text-bold text-center" id="qc-inprocess-confirm">
              Time
            </div>
            <input
              value={time_qc_by_off}
              onChange={(e) => setTime_qc_by_off(e.target.value)}
              className="form-control text-dark fw-bold text-center"
              disabled
            />
          </div>
          <div className="col-2"></div>

          {/*---------------- Start Button QC Line Sub cut ----------------------------- */}

          <div className="col-12 mt-2">
            {/* ตรวจสอบว่า name_qc_by_off มีข้อมูลหรือไม่ */}
            {!hasTNMachine && !product.area_qc_check === "QC Line" && (
              <button
                className="btn ml-1 mt-2"
                id="confirmQCbyoff"
                type="button"
                // onClick={handleSaveQCBYoff}
                onClick={openModalContourOverTarget}
              >
                Confirm QC Line
              </button>
            )}
            {!hasTNMachine && product.area_qc_check === "QC Eqm" && (
              <button
                className="btn ml-1 mt-2"
                id="confirmQCbyoff"
                type="button"
                // onClick={handleSaveQCBYoff}
                onClick={openModalContourOverTarget}
              >
                Confirm QC Line.
              </button>
            )}
            {product.area_qc_check === "QC Line" && !hasTNMachine && (
              <button
                className="btn mt-2"
                id="confirmQCbyoff"
                type="button"
                onClick={openModalContourOverTarget}
              >
                Confirm QC Line Only Check
              </button>
            )}
            {/*---------------- Start Button QC Line Sub cut --------------------------------- */}

            {/*---------------- Start Button QC Line TN -------------------------------------- */}
            {hasTNMachine && (
              <button
                className="btn mt-2 ml-1"
                id="confirmQCbyoff"
                type="button"
                onClick={openModalContourOverTarget}
              >
                QC Inprocess TN
              </button>
            )}
          </div>
          {/*---------------- End Button QC Line TN ----------------------------------------- */}

          {/* End Machine condition */}

          <hr className="mt-3 mb-1 "></hr>
          <hr className=""></hr>


          {/*---- Start Edit chart Request Morita 18/04/25 ------------------------------------------------------------------- */}
          <div className="col-7 mt-2 ml-2 mt-2" id="tool-setter-confirm">
            <h3 className="h3">
              <b className="ml-3">Setter confirm After set

                <button
                  type="button"
                  className="btn btn-primary ml-4"
                  data-toggle="modal"
                  data-target="#modalShowAF"
                >Detail AF
                </button>

              </b>
            </h3>
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="tool-setter-confirm1">
              Date
            </div>
            <input
              value={dateafterset}
              onChange={(e) => setDateafterset(e.target.value)}
              className="form-control text-center text-primary"
              name="dateafterset"
              disabled
            />
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="tool-setter-confirm1">
              Time
            </div>
            <input
              value={timeafterset}
              onChange={(e) => setTimeafterset(e.target.value)}
              className="form-control text-center text-primary"
              name="timeafterset"
              disabled
            />
          </div>

          <div className="col-2 mt-2 ml-2">
            <div className="text-bold" id="tool-setter-confirm1">
              AF1 : <span className="text-danger">{product.nameafterset}</span>
            </div>
            {!product.nameafterset && (
              <input
                onChange={(e) => setNameafterset(e.target.value.toUpperCase())}
                className="form-control text-primary"
                name="nameafterset"
                id="nameafterset" placeholder="Input.."
              />
            )}
          </div>
          <div className="col-2 mt-2 ml-2">
            <div className="text-bold" id="tool-setter-confirm1">
              AF2 : <span className="text-danger">{product.nameafterset2}</span>
            </div>
            {!product.nameafterset2 && (
              <input
                onChange={(e) => setNameafterset2(e.target.value.toUpperCase())}
                className="form-control text-primary"
                name="nameafterset2"
                id="nameafterset2"
                placeholder="Input.."
              />
            )}
          </div>
          <div className="col-2 mt-2 ml-2">
            <div className="text-bold" id="tool-setter-confirm1">
              AF3 : <span className="text-danger">{product.nameafterset3}</span>
            </div>
            {!product.nameafterset3 && (
              <input
                onChange={(e) => setNameafterset3(e.target.value.toUpperCase())}
                className="form-control text-primary"
                name="nameafterset3"
                id="nameafterset3" placeholder="Input.."
              />
            )}
          </div>
          <div className="col-2 mt-2 ml-2">
            <div className="text-bold" id="tool-setter-confirm1">
              AF4 : <span className="text-danger">{product.nameafterset4}</span>
            </div>
            {!product.nameafterset4 && (
              <input
                onChange={(e) => setNameafterset4(e.target.value.toUpperCase())}
                className="form-control text-primary"
                name="nameafterset4"
                id="nameafterset4" placeholder="Input.."
              />
            )}
          </div>
          <div className="col-2 mt-2 ml-2">
            <div className="text-bold" id="tool-setter-confirm1">
              AF5 : <span className="text-danger">{product.nameafterset5}</span>
            </div>
            {!product.nameafterset5 && (
              <input
                onChange={(e) => setNameafterset5(e.target.value.toUpperCase())}
                className="form-control text-primary"
                name="nameafterset5"
                id="nameafterset5" placeholder="Input.."
              />
            )}
          </div>

          <div className="col-sm-6 mt-1 ml-2">
            <div className="form-group clearfix" id="afterset-change-tool">

              <div className="d-inline">
                <input
                  onChange={(e) => {
                    handleAf1Change(e);
                    setProduct({ ...product, afterset: "AF1" });
                  }}
                  checked={af1Checked}
                  type="checkbox"
                  // id="checkboxPrimaryAF1"
                  name="r1"
                  className={`checkbox ${af1Checked ? "checkbox-blue" : ""}`} // เพิ่ม className
                  // disabled={getLockedStatus(1)}
                  disabled={
                    product.afterset === "AF1" ||
                    product.afterset2 === "AF2" ||
                    product.afterset3 === "AF3" ||
                    product.afterset4 === "AF4" ||
                    product.afterset5 === "AF5"
                  } // เพิ่มเงื่อนไขนี้
                />
                <label
                  className={`ml-1 ${af1Checked ? "text-blue" : ""}`}
                  htmlFor="checkboxPrimaryAF1"
                >
                  AF1
                </label>
              </div>

              {product.nameafterset?.trim() && (
                <>
                  <div className="d-inline ml-3">
                    <input
                      onChange={(e) => {
                        handleAf2Change(e);
                        setProduct({ ...product, afterset2: "AF2" });
                      }}
                      checked={af2Checked}
                      type="checkbox"
                      // id="checkboxPrimaryAF2"
                      name="r2"
                      className={`checkbox ${af2Checked ? "checkbox-blue" : ""}`}
                      disabled={getLockedStatus(2)}
                    />
                    <label
                      className={`ml-1 ${af2Checked ? "text-blue" : ""}`}
                      htmlFor="checkboxPrimaryAF2"
                    >
                      AF2
                    </label>
                  </div>

                  <div className="d-inline ml-3">
                    <input
                      onChange={(e) => {
                        handleAf3Change(e);
                        setProduct({ ...product, afterset3: "AF3" });
                      }}
                      checked={af3Checked}
                      type="checkbox"
                      // id="checkboxPrimaryAF3"
                      name="r3"
                      className={`checkbox ${af3Checked ? "checkbox-blue" : ""}`}
                      // disabled={product.afterset !== "AF2"}
                      disabled={getLockedStatus(3)}
                    />
                    <label
                      className={`ml-1 ${af3Checked ? "text-blue" : ""}`}
                      htmlFor="checkboxPrimaryAF3"
                    >
                      AF3
                    </label>
                  </div>
                  <div className="d-inline ml-3">
                    <input
                      onChange={(e) => {
                        handleAf4Change(e);
                        setProduct({ ...product, afterset4: "AF4" });
                      }}
                      checked={af4Checked}
                      type="checkbox"
                      // id="checkboxPrimaryAF4"
                      name="r4"
                      className={`checkbox ${af4Checked ? "checkbox-blue" : ""}`}
                      disabled={getLockedStatus(4)}
                    />
                    <label
                      className={`ml-1 ${af4Checked ? "text-blue" : ""}`}
                      htmlFor="checkboxPrimaryAF4"
                    >
                      AF4
                    </label>
                  </div>
                  <div className="d-inline ml-3">
                    <input
                      onChange={(e) => {
                        handleAf5Change(e);
                        setProduct({ ...product, afterset5: "AF5" });
                      }}
                      checked={af5Checked}
                      type="checkbox"
                      // id="checkboxPrimaryAF5"
                      name="r5"
                      className={`checkbox ${af5Checked ? "checkbox-blue" : ""}`}
                      disabled={getLockedStatus(5)}
                    />
                    <label
                      className={`ml-1 ${af5Checked ? "text-blue" : ""}`}
                      htmlFor="checkboxPrimaryAF5"
                    >
                      AF5
                    </label>
                  </div>
                </>
              )}

              <div className="row">
                <div className="col-3">
                  <input
                    value={product.afterset}
                    className="form-control text-primary" disabled
                  />
                </div>
                <div className="col-3">
                  <input
                    value={product.afterset2}
                    className="form-control text-primary" disabled
                  />
                </div>
                <div className="col-3">
                  <input
                    value={product.afterset3}
                    className="form-control text-primary" disabled
                  />
                </div>
                <div className="col-3">
                  <input
                    value={product.afterset4}
                    className="form-control text-primary" disabled
                  />
                </div>
                <div className="col-3">
                  <input
                    value={product.afterset5}
                    className="form-control text-primary" disabled
                  />
                </div>
              </div>

              <div className="col-12 mt-3">
                {!product.nameafterset && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    // onClick={handleSaveAfterSet}
                    onClick={(e) => handleSaveAfterSetUnified(e, "AF1")}
                  >
                    AF 1
                  </button>
                )}
                {!product.nameafterset2 && (
                  <button
                    // onClick={handleSaveAfterSet2}
                    onClick={(e) => handleSaveAfterSetUnified(e, "AF2")}
                    className="btn btn-primary ml-1"
                  >
                    AF 2
                  </button>
                )}
                {!product.nameafterset3 && (
                  <button
                    // onClick={handleSaveAfterSet3}
                    onClick={(e) => handleSaveAfterSetUnified(e, "AF3")}
                    className="btn btn-primary ml-1"
                  >
                    AF 3
                  </button>
                )}
                {!product.nameafterset4 && (
                  <button
                    // onClick={handleSaveAfterSet4}
                    onClick={(e) => handleSaveAfterSetUnified(e, "AF4")}
                    className="btn btn-primary ml-1"
                  >
                    AF 4
                  </button>
                )}
                {!product.nameafterset5 && (
                  <button
                    // onClick={handleSaveAfterSet5}
                    onClick={(e) => handleSaveAfterSetUnified(e, "AF5")}
                    className="btn btn-primary ml-1"
                  >
                    AF 5
                  </button>
                )}
              </div>

            </div>
          </div>
          {/*---- End Edit chart Request Morita 18/04/25 ------------------------------------------------------------------- */}

          <div className="col-5 mt-1">
            <div className="form-group clearfix" id="afterset-change-tool">
              <div className="d-flex flex-column">
                <div className="text-center bg-danger pl-2 mb-2">
                  Cancel Record
                </div>
                <div className="d-flex">
                  <input
                    onChange={(e) =>
                      setProduct({ ...product, barcode: e.target.value })
                    }
                    className="col-4 form-control mr-2"
                    name="statusForProduct"
                    id="statusForProduct"
                    list="data_cancel"
                    type="text"
                    placeholder="Select ......."
                  />
                  <datalist id="data_cancel">
                    <option>Cancel</option>
                  </datalist>
                  <input
                    onChange={(e) =>
                      setProduct({ ...product, remark: e.target.value })
                    }
                    name="remarkForProduct"
                    className="form-control"
                    id="remarkForProduct"
                    type="text"
                    placeholder="Input ..........."
                  />
                </div>
              </div>
              <button
                onClick={handleSaveCancelRecord}
                className="col-6 btn btn-danger mt-3"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>

          <hr className="mt-3 mb-1"></hr>
          <hr className=""></hr>

          <div className="col-12 mt-4 mb-3" id="tool-qc-confirm">
            <h3 className="h3">
              <b className="ml-3">QC Equipment confirm</b>
            </h3>
          </div>
        </div>
        <div className="mt-1"></div>

        <div className="btn" id="result-mesering">
          Result Profile & Image
        </div>
        <div className="row">
          {productImages.length > 0
            ? productImages.map((item) => (
              <div className="col-12" key={item.id}>
                <button className="btn mt-3" id="mesering">
                  Mesering type : {item.mesering}
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
                  id=""
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {item.status}
                </button>

                <div>
                  <iframe
                    style={{ width: "40rem", height: "50rem" }}
                    src={config.api_path + "/uploads/" + item.imageName}
                    alt=""
                  ></iframe>
                </div>
                <div>{/* {" "} */}</div>
              </div>
            ))
            : ""}
        </div>
      </ModalQCInspection>

      {/*------ End Modal Result ---------------------------------------------------------*/}

      <ModalProjector id="modalAddPartSetUp" title="" modalSize="modal-lg">
        <h3 className="h3 addpart-setup">
          <b className="ml-3">ADD PART SET UP</b>
        </h3>
        <div className="row">
          <div className="col-4 mt-4">
            <div className="text-bold text-center" id="add-part-set-up">
              Part set up normal
            </div>
            <input
              type="number"
              value={product.part_set_up}
              className="form-control text-dark fw-bold text-center"
              readOnly
            />
          </div>
          <div className="col-8"></div>
          <div className="col-4 mt-4">
            <div className="text-bold text-center" id="add-part-set-up">
              + Part set up
            </div>
            <input
              id="changeInputNewPartSetup"
              className="form-control text-dark fw-bold text-center"
              placeholder="Input........."
              onChange={(e) =>
                setProduct({
                  ...product,
                  part_set_up: e.target.value,
                })
              }
            />
          </div>
          <div className="col-8 mt-4"></div>
          <div className="col-4 mt-5 ml-1 mb-5">
            <button
              className="btn btn-success mt-3"
              onClick={handleSaveNewPartSetUp}
            >
              SAVE NEW PART SET UP
            </button>
          </div>
          <div className="col-8 mt-5"></div>
        </div>
        <hr />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger ml-2 mb-5"
            id="close-modal-projector"
            onClick={closeModalAddPartSetUp}
          >
            Close
          </button>
        </div>
      </ModalProjector>

      {/*------ Start Modal QC Line ---------------------------------------------------------*/}

      <ModalQCInprocessShaft id="modalContourOverTarget" modalSize="modal-lg">
        <h3 className="h3 qc-line-check">
          <b className="ml-3">{product.area_qc_check} Check</b>
        </h3>
        <div className="row">
          <div className="col-2">
            <div className="text-bold text-center" id="box-product">
              Barcode
            </div>
            <input
              value={product.barcode}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold text-center" id="box-product">
              Machine
            </div>
            <input
              value={product.machine}
              className="form-control text-primary"
            />
          </div>
          <div className="col-4">
            <div className="text-bold text-center" id="box-product">
              Model
            </div>
            <input
              value={product.model}
              className="form-control text-primary"
            />
          </div>
          <div className="col-3">
            <div className="text-bold text-center" id="box-product">
              Part set up (PCS.)
            </div>
            <input
              value={product.part_set_up}
              className="form-control text-primary"
            />
          </div>
        </div>
        <div className="row">
          <div className="text-bold ml-2 col-12 mt-2 mb-1" id="box-product">
            Tool Number
          </div>
        </div>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            if (/^t\d+$/.test(key) && value) {
              // แสดง T Number ที่มีอยู่ใน product
              return (
                <div className="col-3" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="text"
                        id={`input-Over-${key}`}
                        value={selectedOverTarget[key] || value || ""}
                        onChange={(e) =>
                          handleInputChangeContourOver(e, key, "Over")
                        }
                        className="form-control text-primary"
                      />
                      <label
                        className="ml-2 tool-product-auto"
                        htmlFor={`input-Over-${key}`}
                      >
                        {key.toUpperCase()}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <hr></hr>
        <div className="row">
          <div className="col-3">
            <div className="text-bold" id="qc-inprocess-confirm">
              Time Start , {product.time_qc_by_off}
            </div>
            <input
              // value={product.time_qc_by_off}
              value={product.time_qc_by_off}
              className="form-control text-primary mb-2"
              readOnly
            />
          </div>
          <div className="col-3">
            <div className="text-bold" id="qc-inprocess-confirm">
              Status Name QC
            </div>
            <input
              value={product.name_qc_by_off}
              className="form-control text-primary mb-2"
              readOnly // ปิดการแก้ไข เพราะผู้ใช้จะไม่สามารถแก้ไขตรงนี้ได้
            />
          </div>
          <div className="col-3">
            <div className="text-bold" id="qc-inprocess-confirm">
              Date
            </div>
            <input
              value={date_qc_by_off}
              onChange={(e) => setDate_qc_line(e.target.value)}
              className="form-control text-primary mb-2"
              readOnly // ปิดการแก้ไข เพราะผู้ใช้จะไม่สามารถแก้ไขตรงนี้ได้
            />
          </div>
          <div className="col-3">
            <div className="text-bold" id="qc-inprocess-confirm">
              Time End , {product.end_time_qc_by_off}
            </div>
            <input
              value={end_time_qc_lineAuto}
              onChange={(e) => setEnd_time_qc_lineAuto(e.target.value)}
              className="form-control text-primary mb-2"
              readOnly // ปิดการแก้ไข เพราะผู้ใช้จะไม่สามารถแก้ไขตรงนี้ได้
            />
          </div>
        </div>
        <hr />

        {product.time_qc_by_off
          ? specData.map((spec, index) => (
            <div
              key={index}
              className="col-12"
              style={{
                border: "2px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <div className="row">
                <div
                  className="col-5"
                  id="tool-no-array"
                  style={{
                    backgroundColor:
                      spec.section_check === "QC Line Check" ||
                        spec.section_check === "QC In process" ||
                        spec.section_check === "SPC Check"
                        ? "#fef7b2"
                        : "", // เพิ่มเงื่อนไขใหม
                    fontWeight: "bold",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <span className="underline">
                    Rev: {spec.rev_control} {spec.section_check}:{" "}
                  </span>
                  {spec.tool_no}: {spec.spec_tool_no}
                </div>
                <div className="col-3">
                  <input
                    type="text"
                    value={
                      inputValues[index] || spec.spec_tool_no_input || ""
                    } // ใช้ค่าใน inputValues หรือค่าเดิมจากฐานข้อมูล
                    onChange={(e) => handleInputChange(e, index)} // เมื่อผู้ใช้เปลี่ยนแปลง
                    className="form-control"
                  />
                </div>
                <div className="col-1 ml-4">
                  <input
                    className="form-check-input pass-checkbox-qcline"
                    type="checkbox"
                    checked={passChecked[index]} // ใช้ passChecked จาก state
                    onChange={() =>
                      handleCheckboxChangePassReject(index, "pass")
                    } // เปลี่ยนสถานะ Pass
                  />
                  <span className="spacing ml-4">Pass</span>
                </div>
                <div className="col-2 ml-4">
                  <input
                    className="form-check-input reject-checkbox-qcline"
                    type="checkbox"
                    checked={rejectChecked[index]} // ใช้ rejectChecked จาก state
                    onChange={() =>
                      handleCheckboxChangePassReject(index, "reject")
                    } // เปลี่ยนสถานะ Reject
                  />
                  <span className="spacing ml-4">Reject</span>
                </div>
              </div>
            </div>
          ))
          : null}

        <div className="col-10">
          {!product.time_qc_by_off && (
            <button
              className="btn btn-success mb-3 mr-3 blinking-button"
              onClick={handleSaveQCBYoffTN}
            >
              Start Time
            </button>
          )}
        </div>
        <hr />

        {/* ซ่อน Input Name QC Check ถ้าค่าทั้งหมดใน inputValues เท่ากับ Pass */}

        {/*---------  ปิด Input Name QC Line? โดยเปลี่ยนจาก product.name_qc_by_off เป็น !product.time_qc_by_off ---------*/}

        {!specData.length ? (
          !product.time_qc_by_off ? null : (
            <>
              {/* แสดง input และปุ่มใหม่ในกรณีที่ไม่มีข้อมูลจากฐานข้อมูล */}

              <div className="row">
                <div className="col-5 mt-2 mb-4 ml-1">
                  <div className="text-bold" id="qc-inprocess-confirm">
                    Input Name QC Line?
                  </div>
                  <input
                    type="text"
                    className="form-control text-primary mb-2"
                    onChange={(e) =>
                      setNameQcCheck(e.target.value.toUpperCase())
                    }
                    placeholder="Input ............."
                    id="name_qc_input_spec"
                  />
                </div>
              </div>

              <button
                className="btn btn-success mb-3 ml-1"
                onClick={handleSaveNameQCLineNot_Data_input}
              >
                Save Name QC Line?
              </button>
            </>
          )
        ) : (
          <>
            {/* แสดง input และปุ่มตามสถานะของ nameQcLine */}
            {/*---------  ปิด Input Name QC Line Sub cut to QC EQM โดยเพิ่ม product.time_qc_by_off && ---------*/}
            <div className="row">
              {product.area_qc_check === "QC Line" &&
                !hasTNMachine &&
                product.time_qc_by_off && (
                  <div className="col-5 mt-2 mb-4 ml-1">
                    <div className="text-bold" id="qc-inprocess-confirm">
                      Input Name QC Line.
                    </div>
                    <input
                      type="text"
                      className="form-control text-primary mb-2"
                      onChange={(e) =>
                        setNameQcCheck(e.target.value.toUpperCase())
                      }
                      placeholder="Input ............."
                      id="name_qc_input_spec"
                    />
                  </div>
                )}

              {/*---------  ปิด Input Name QC Line Sub cut to QC EQM โดยเพิ่ม product.time_qc_by_off && ---------*/}

              {product.area_qc_check === "QC Line" &&
                !hasTNMachine &&
                product.time_qc_by_off && (
                  <div className="col-5 mt-2 mb-4 ml-1">
                    <div
                      className="text-bold text-center"
                      id="qc-inprocess-confirm"
                    >
                      Status.
                    </div>
                    <select
                      id="statusValue"
                      className="form-control"
                      value={qclineStatus} // ตั้งค่า value เป็น qclineStatus
                      onChange={handleQclineStatusChange} // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลง
                    >
                      <option value="">Select...</option>
                      <option value="OK">OK</option>
                      <option value="NG">NG</option>
                    </select>
                  </div>
                )}
            </div>

            {/*---------  ปิด Input Name QC Line Sub cut to QC EQM โดยเพิ่ม product.time_qc_by_off && ---------*/}
            {product.area_qc_check === "QC Line" &&
              product.time_qc_by_off &&
              !nameQcLine &&
              !hasTNMachine && (
                <button
                  className="btn btn-success mb-3 ml-1"
                  onClick={handleSaveSpecQCLineOnly_Subcut_input_data}
                >
                  Save Spec QC Line sub cut.
                </button>
              )}
            {product.area_qc_check === "QC Line" &&
              !hasTNMachine &&
              nameQcLine && (
                <button
                  className="btn btn-success mb-3 ml-1"
                  onClick={handleSaveSpecQCLineOnly_Subcut_input_data}
                >
                  Update Spec QC Line sub cut.
                </button>
              )}
          </>
        )}

        {/*---------  ปิด Input Name QC Line Sub cut to QC EQM โดยเพิ่ม product.time_qc_by_off && ---------*/}

        {specData.length
          ? product.area_qc_check === "QC Eqm" &&
          product.time_qc_by_off &&
          !hasTNMachine && (
            <>
              <div className="row">
                <div className="col-6 mt-2 mb-2 ml-1">
                  <div
                    className="text-bold text-center"
                    id="qc-inprocess-confirm"
                  >
                    Input Name QC Line Sub cut to QC EQM
                  </div>
                  <input
                    type="text"
                    className="form-control text-primary mb-2"
                    onChange={(e) =>
                      setNameQcCheck(e.target.value.toUpperCase())
                    }
                    placeholder="Input ............."
                    id="name_qc_input_spec"
                  />
                </div>
                <div className="col-5"></div>
              </div>
              <button
                className="btn btn-success mb-3 ml-1"
                onClick={handleSaveNameQCEQM_Subcut}
              >
                Save Name QC Line Sub cut to QC EQM
              </button>
            </>
          )
          : null}

        {hasTNMachine &&
          product.area_qc_check === "QC Eqm" &&
          !product.time_qc_by_off == "" && (
            <>
              <div className="row">
                <div className="col-6 mt-2 mb-2 ml-1">
                  <div
                    className="text-bold text-center"
                    id="qc-inprocess-confirm"
                  >
                    Input Name QC Line TN
                  </div>
                  <input
                    type="text"
                    className="form-control text-primary mb-2"
                    onChange={(e) =>
                      setNameQcCheck(e.target.value.toUpperCase())
                    }
                    placeholder="Input ............."
                    id="name_qc_input_spec"
                  />
                </div>
                <div className="col-5"></div>
              </div>
              <button
                className="btn btn-success mb-3 ml-1"
                onClick={handleSaveSpecQCLine_TN_input_data}
              >
                Save Name QC Line TN
              </button>
            </>
          )}

        {hasTNMachine &&
          product.area_qc_check === "QC Line" &&
          !product.time_qc_by_off == "" && (
            <div className="row">
              <div className="col-6 mt-2 mb-2 ml-1">
                <div
                  className="text-bold text-center"
                  id="qc-inprocess-confirm"
                >
                  Input Name QC Line TN?
                </div>
                <input
                  id="qcLine-tn-confirm"
                  type="text"
                  className="form-control text-primary mb-2"
                  onChange={(e) => setNameQcCheck(e.target.value.toUpperCase())}
                  placeholder="Input ............."
                />
              </div>
              <div className="col-3 mt-2 mb-4 ml-1">
                <div
                  className="text-bold text-center"
                  id="qc-inprocess-confirm"
                >
                  Status?
                </div>
                <select
                  id="statusValue"
                  className="form-control"
                  value={qclineStatus} // ตั้งค่า value เป็น qclineStatus
                  onChange={handleQclineStatusChange} // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลง
                >
                  <option value="">Select...</option>
                  <option value="OK">OK</option>
                  <option value="NG">NG</option>
                </select>
              </div>
              <div className="col-2"></div>
            </div>
          )}

        {hasTNMachine &&
          product.area_qc_check === "QC Line" &&
          !products.time_qc_by_off &&
          !nameQcLine && (
            <button
              className="btn btn-success mb-3 ml-1"
              onClick={handleSaveSpecQCLineOnly_TN_input_data}
            >
              Save Name QC Line TN?
            </button>
          )}

        <hr />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger mb-3 ml-1"
            onClick={closeModalContourOverTarget}
            id="modal-close"
          >
            Close
          </button>
        </div>
      </ModalQCInprocessShaft>
      {/*------ End Modal QC Line ---------------------------------------------------------*/}

      {/*------ Start Modal show AF ---------------------------------------------------------*/}
      <ModalQCInprocessShaft id="modalShowAF" title="" modalSize="modal-lg">
        <div className="col-12 mt-1">
          <div className="form-group clearfix" id="afterset-change-tool">
            <div className="d-flex flex-column">
              <div className="fw-bold">Name : A/F No. </div>

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

            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger mb-3 ml-1"
            onClick={closeModalShowAF}
            id="modal-close"
          >
            Close
          </button>
        </div>

      </ModalQCInprocessShaft>

      {/*------ End Modal show AF ---------------------------------------------------------*/}

    </>
  );
}

export default ToolNumberSearchCS;
