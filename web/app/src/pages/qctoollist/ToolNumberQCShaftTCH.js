import Modal from "../components/Modal";
import ModalSelectTool from "../components/ModalSelectTool";
import Swal from "sweetalert2";
import config from "../../config";
import axios from "axios";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ModalQCInprocessShaft from "../components/ModalQCInprocessShaft";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ModalQCEqmAfter from "../components/ModalQCEqmAfter";
import { useNavigate } from 'react-router-dom';

// import GradingIcon from '@mui/icons-material/Grading';

import "./ToolQC.css";

const playAnnouncement = (machine, status) => {
  const fileExtension = status === "OK" ? "mp3" : "mp3";
  const audioFilePath = `${process.env.PUBLIC_URL}/audio/shaft/${machine} ${status}.${fileExtension}`;

  const audio = new Audio(audioFilePath);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
};

// Function to dynamically play the OK file
const playAnnouncementOk = (machine) => {
  playAnnouncement(machine, "OK");
};

// Function to dynamically play the NG file
const playAnnouncementNg = (machine) => {
  playAnnouncement(machine, "NG");
};

function ToolNumberQCShaftTCH() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [productImage, setProductImage] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [status, setStatus] = useState();
  const [mesering, setMesering] = useState();
  const [afterset, setAfterset] = useState();

  const [memberName, setMemberName] = useState("");
  const [nameeqm, setNameeqm] = useState("");
  const [dateeqm, setDateeqm] = useState("");
  const [timeeqm, setTimeeqm] = useState("");

  const [name_qc_by_off, setName_qc_by_off] = useState("");
  const [date_qc_by_off, setDate_qc_by_off] = useState("");
  const [time_qc_by_off, setTime_qc_by_off] = useState("");
  const [qc_eqm_start_time, setQc_eqm_start_time] = useState();
  const [qc_eqm_afterset_end_time, setQc_eqm_afterset_end_time] = useState();

  const [contour, setContour] = useState("");
  const [sulfcom, setSulfcom] = useState("");
  const [roncom, setRoncom] = useState("");
  const [talysurf, setTalysurf] = useState("");

  const [contour_ng_target_spec, setContour_ng_target_spec] = useState("");
  const [contour_ng_drawing_spec, setContour_ng_drawing_spec] = useState("");
  const [sulfcom_ng_tool_no, setSulfcom_ng_tool_no] = useState("");
  const [sulfcom_ng_detail, setSulf_ng_detail] = useState("");
  const [roncom_ng_tool_no, setRoncom_ng_tool_no] = useState("");
  const [roncom_ng_detail, setRon_ng_detail] = useState("");
  const [talysurf_ng_tool_no, setTalysurf_ng_tool_no] = useState("");
  const [talysurf_ng_detail, setTalysurf_ng_detail] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // Time in seconds for countdown (30 minutes)

  // const [selectedMCType, setSelectedMCType] = useState(''); // เก็บค่าเครื่องที่เลือก

  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState();
  const [shift, setShift] = useState();
  const [machine, setMachine] = useState();
  const [model, setModel] = useState();
  const [process, setProcess] = useState();
  const [nameafterset, setNameafterset] = useState();

  const [checkboxState, setCheckboxState] = useState({});

  const [qcDataStatus, setQcDataStatus] = useState([]); // ประกาศ state สำหรับเก็บข้อมูล qcData
  const [productId, setProductId] = useState(null); // Define productId state

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return parseInt(localStorage.getItem("itemsPerPage")) || 20;
  });
  const [totalItems, setTotalItems] = useState(0); // State for total items
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  const [showAftersetList, setShowAftersetList] = useState(false);

  const navigate = useNavigate(); // สร้างตัวแปร navigate


  const handleOpenModalAF = (item) => {
    setProduct(item);            // ใส่ข้อมูลที่จะโชว์ใน modal
    // setIsModalOpen(true);        // เปิด modal
  };

  useEffect(() => {
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
    const nowQCEQMTime = new Date();
    const formattedTimeQCEQMStart = nowQCEQMTime.toTimeString().slice(0, 8);
    const formattedTimeQCEQMEnd = nowQCEQMTime.toTimeString().slice(0, 8);
    setQc_eqm_start_time(formattedTimeQCEQMStart);
    setQc_eqm_afterset_end_time(formattedTimeQCEQMEnd);
  }, []);

  //--- Start Add 10-05-25 ---------------------------------------------
  useEffect(() => {
    fetchDataUser(); // ดึงชื่อผู้ใช้งาน
  }, []);

  //--- End Add 10-05-25 ---------------------------------------------

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toTimeString().slice(0, 8);
      setQc_eqm_afterset_end_time(formattedTime);
    };
    // อัปเดตเวลาทุก 1 วินาที
    const intervalId = setInterval(updateTime, 1000);
    // เรียกฟังก์ชันครั้งแรกเมื่อคอมโพเนนต์เรนเดอร์
    updateTime();
    // ล้าง interval เมื่อคอมโพเนนต์ถูกทำลาย
    return () => clearInterval(intervalId);
  }, []);

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
    if (product && product.id) {
      setProductId(product.id); // ตั้งค่า productId
    }
  }, [product]);

  useEffect(() => {
    fetchPassRejectData();
  }, []);

  const fetchPassRejectData = async () => {
    try {
      const response = await axios.get(
        `${config.api_path}/api/qc-line-input-pass-reject`
      );
      console.log("Fetched QC data:", response.data);
      const qcData = response.data.reduce((acc, item) => {
        acc[item.productId] = { pass: item.pass, reject: item.reject };
        return acc;
      }, {});
      setQcDataStatus(qcData);
    } catch (error) {
      console.error("Error fetching pass/reject data:", error);
    }
  };
  //---- Start Contour condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  const [userSelectedContour, setUserSelectedContour] = useState(""); // สร้าง state สำหรับการเลือกของผู้ใช้

  // เมื่อผู้ใช้งานเลือกค่าใหม่ใน <select>
  const handleContourChange = (e) => {
    setProduct({ ...product, contour: e.target.value });
    setUserSelectedContour(e.target.value); // เก็บค่าที่ผู้ใช้เลือก
  };

  const [selectedTargetSpec, setSelectedTargetSpec] = useState([]);
  const [selectedDrawingSpec, setSelectedDrawingSpec] = useState([]);
  const handleCheckboxChange = (key, type) => {
    if (type === "target") {
      setSelectedTargetSpec((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    } else if (type === "drawing") {
      setSelectedDrawingSpec((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedOverTarget, setSelectedOverTarget] = useState([]);
  const handleCheckboxChangeContourOver = (key, type) => {
    if (type === "Over") {
      setSelectedOverTarget((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedUnderTarget, setSelectedUnderTarget] = useState([]);
  const handleCheckboxChangeContourUnder = (key, type) => {
    if (type === "Under") {
      setSelectedUnderTarget((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const handleOkClick = () => {
    setProduct({
      ...product,
      // ตรวจสอบ contour_ng_target_spec
      contour_ng_target_spec:
        selectedTargetSpec.length > 0
          ? selectedTargetSpec.map((key) => key.toUpperCase()).join(", ")
          : product.contour_ng_target_spec &&
            product.contour_ng_target_spec !== ""
            ? product.contour_ng_target_spec // ถ้ามีค่าเดิมในฐานข้อมูล ให้คงค่าเดิม
            : "-", // ถ้าไม่มีค่าเดิมในฐานข้อมูลและไม่มีการเลือก ให้ใส่ "-"

      // ตรวจสอบ contour_ng_drawing_spec
      contour_ng_drawing_spec:
        selectedDrawingSpec.length > 0
          ? selectedDrawingSpec.map((key) => key.toUpperCase()).join(", ")
          : product.contour_ng_drawing_spec &&
            product.contour_ng_drawing_spec !== ""
            ? product.contour_ng_drawing_spec // ถ้ามีค่าเดิมในฐานข้อมูล ให้คงค่าเดิม
            : "-", // ถ้าไม่มีค่าเดิมในฐานข้อมูลและไม่มีการเลือก ให้ใส่ "-"
    });
    closeModal2(); // ปิด Modal
  };

  const openModal2 = () => {
    const modalElement = document.getElementById("modalSelectToolNg");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };

  const closeModal2 = () => {
    const modalElement = document.getElementById("modalSelectToolNg");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickContourOverTarget = () => {
    setProduct({
      ...product,
      contour_over_target: selectedOverTarget
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalContourOverTarget(); // ปิด Modal
  };
  const openModalContourOverTarget = () => {
    const modalElement = document.getElementById("modalContourOverTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalContourOverTarget = () => {
    const modalElement = document.getElementById("modalContourOverTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickContourUnderTarget = () => {
    setProduct({
      ...product,
      contour_under_target: selectedUnderTarget
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalContourUnderTarget(); // ปิด Modal
  };
  const openModalContourUnderTarget = () => {
    const modalElement = document.getElementById("modalContourUnderTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalContourUnderTarget = () => {
    const modalElement = document.getElementById("modalContourUnderTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  //---- End Contour condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  //---- Start Sulfcom condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  const [userSelectedSulfcom, setUserSelectedSulfcom] = useState(""); // สร้าง state สำหรับการเลือกของผู้ใช้

  // เมื่อผู้ใช้งานเลือกค่าใหม่ใน <select>
  const handleSulfcomChange = (e) => {
    setProduct({ ...product, sulfcom: e.target.value });
    setUserSelectedSulfcom(e.target.value); // เก็บค่าที่ผู้ใช้เลือก
  };

  const [selectedTargetSpecSulfcom, setSelectedTargetSpecSulfcom] = useState(
    []
  );
  const [selectedDrawingSpecSulfcom, setSelectedDrawingSpecSulfcom] = useState(
    []
  );
  const handleCheckboxChangeSulfcom = (key, type) => {
    if (type === "target") {
      setSelectedTargetSpecSulfcom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    } else if (type === "drawing") {
      setSelectedDrawingSpecSulfcom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedOverTargetSulfcom, setSelectedOverTargetSulfcom] = useState(
    []
  );
  const handleCheckboxChangeSulfcomOver = (key, type) => {
    if (type === "Over") {
      setSelectedOverTargetSulfcom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedUnderTargetSulfcom, setSelectedUnderTargetSulfcom] = useState(
    []
  );
  const handleCheckboxChangeSulfcomUnder = (key, type) => {
    if (type === "Under") {
      setSelectedUnderTargetSulfcom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const handleOkClickSulfcom = () => {
    setProduct({
      ...product,
      sulfcom_ng_target_spec:
        selectedTargetSpecSulfcom.length > 0
          ? selectedTargetSpecSulfcom.map((key) => key.toUpperCase()).join(", ")
          : product.sulfcom_ng_target_spec &&
            product.sulfcom_ng_target_spec !== ""
            ? product.sulfcom_ng_target_spec
            : "-",

      sulfcom_ng_drawing_spec:
        selectedDrawingSpecSulfcom.length > 0
          ? selectedDrawingSpecSulfcom
            .map((key) => key.toUpperCase())
            .join(", ")
          : product.sulfcom_ng_drawing_spec &&
            product.sulfcom_ng_drawing_spec !== ""
            ? product.sulfcom_ng_drawing_spec
            : "-",
    });
    closeModalSulfcom();
  };

  const openModalSulfcom = () => {
    const modalElement = document.getElementById("modalSelectToolNgSulfcom");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };

  const closeModalSulfcom = () => {
    const modalElement = document.getElementById("modalSelectToolNgSulfcom");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickSulfcomOverTarget = () => {
    setProduct({
      ...product,
      sulfcom_over_target: selectedOverTargetSulfcom
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalSulfcomOverTarget(); // ปิด Modal
  };
  const openModalSulfcomOverTarget = () => {
    const modalElement = document.getElementById("modalSulfcomOverTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalSulfcomOverTarget = () => {
    const modalElement = document.getElementById("modalSulfcomOverTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickSulfcomUnderTarget = () => {
    setProduct({
      ...product,
      sulfcom_under_target: selectedUnderTargetSulfcom
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalSulfcomUnderTarget(); // ปิด Modal
  };
  const openModalSulfcomUnderTarget = () => {
    const modalElement = document.getElementById("modalSulfcomUnderTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalSulfcomUnderTarget = () => {
    const modalElement = document.getElementById("modalSulfcomUnderTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  //---- End Sulfcom condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  //---- Start Rondcom condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  const [userSelectedRoncom, setUserSelectedRoncom] = useState(""); // สร้าง state สำหรับการเลือกของผู้ใช้

  // เมื่อผู้ใช้งานเลือกค่าใหม่ใน <select>
  const handleRoncomChange = (e) => {
    setProduct({ ...product, roncom: e.target.value });
    setUserSelectedRoncom(e.target.value); // เก็บค่าที่ผู้ใช้เลือก
  };

  const [selectedTargetSpecRoncom, setSelectedTargetSpecRoncom] = useState([]);
  const [selectedDrawingSpecRoncom, setSelectedDrawingSpecRoncom] = useState(
    []
  );
  const handleCheckboxChangeRoncom = (key, type) => {
    if (type === "target") {
      setSelectedTargetSpecRoncom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    } else if (type === "drawing") {
      setSelectedDrawingSpecRoncom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedOverTargetRoncom, setSelectedOverTargetRoncom] = useState([]);
  const handleCheckboxChangeRoncomOver = (key, type) => {
    if (type === "Over") {
      setSelectedOverTargetRoncom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedUnderTargetRoncom, setSelectedUnderTargetRoncom] = useState(
    []
  );
  const handleCheckboxChangeRoncomUnder = (key, type) => {
    if (type === "Under") {
      setSelectedUnderTargetRoncom((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const handleOkClickRoncom = () => {
    setProduct({
      ...product,
      roncom_ng_target_spec:
        selectedTargetSpecRoncom.length > 0
          ? selectedTargetSpecRoncom.map((key) => key.toUpperCase()).join(", ")
          : product.roncom_ng_target_spec &&
            product.roncom_ng_target_spec !== ""
            ? product.roncom_ng_target_spec // ถ้ามีค่าเดิมในฐานข้อมูล ให้คงค่าเดิม
            : "-", // ถ้าไม่มีค่าเดิมในฐานข้อมูลและไม่มีการเลือก ให้ใส่ "-"

      roncom_ng_drawing_spec:
        selectedDrawingSpecRoncom.length > 0
          ? selectedDrawingSpecRoncom.map((key) => key.toUpperCase()).join(", ")
          : product.roncom_ng_drawing_spec &&
            product.roncom_ng_drawing_spec !== ""
            ? product.roncom_ng_drawing_spec // ถ้ามีค่าเดิมในฐานข้อมูล ให้คงค่าเดิม
            : "-", // ถ้าไม่มีค่าเดิมในฐานข้อมูลและไม่มีการเลือก ให้ใส่ "-"
    });
    closeModalRoncom(); // ปิด Modal
  };

  const openModalRoncom = () => {
    const modalElement = document.getElementById("modalSelectToolNgRoncom");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };

  const closeModalRoncom = () => {
    const modalElement = document.getElementById("modalSelectToolNgRoncom");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickRoncomOverTarget = () => {
    setProduct({
      ...product,
      roncom_over_target: selectedOverTargetRoncom
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalRoncomOverTarget(); // ปิด Modal
  };
  const openModalRoncomOverTarget = () => {
    const modalElement = document.getElementById("modalRoncomOverTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalRoncomOverTarget = () => {
    const modalElement = document.getElementById("modalRoncomOverTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickRoncomUnderTarget = () => {
    setProduct({
      ...product,
      roncom_under_target: selectedUnderTargetRoncom
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalRoncomUnderTarget(); // ปิด Modal
  };
  const openModalRoncomUnderTarget = () => {
    const modalElement = document.getElementById("modalRoncomUnderTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalRoncomUnderTarget = () => {
    const modalElement = document.getElementById("modalRoncomUnderTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  //---- End Rondcom condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  //---- Start Sulfcom condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  const [userSelectedTalysurf, setUserSelectedTalysurf] = useState(""); // สร้าง state สำหรับการเลือกของผู้ใช้

  // เมื่อผู้ใช้งานเลือกค่าใหม่ใน <select>
  const handleTalysurfChange = (e) => {
    setProduct({ ...product, talysurf: e.target.value });
    setUserSelectedTalysurf(e.target.value); // เก็บค่าที่ผู้ใช้เลือก
  };

  const [selectedTargetSpecTalysurf, setSelectedTargetSpecTalysurf] = useState(
    []
  );
  const [selectedDrawingSpecTalysurf, setSelectedDrawingSpecTalysurf] =
    useState([]);
  const handleCheckboxChangeTalysurf = (key, type) => {
    if (type === "target") {
      setSelectedTargetSpecTalysurf((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    } else if (type === "drawing") {
      setSelectedDrawingSpecTalysurf((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedOverTargetTalysurf, setSelectedOverTargetTalysurf] = useState(
    []
  );
  const handleCheckboxChangeTalysurfOver = (key, type) => {
    if (type === "Over") {
      setSelectedOverTargetTalysurf((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const [selectedUnderTargetTalysurf, setSelectedUnderTargetTalysurf] =
    useState([]);
  const handleCheckboxChangeTalysurfUnder = (key, type) => {
    if (type === "Under") {
      setSelectedUnderTargetTalysurf((prev) => {
        if (prev.includes(key)) {
          return prev.filter((item) => item !== key);
        } else {
          return [...prev, key];
        }
      });
    }
  };

  const handleOkClickTalysurf = () => {
    setProduct({
      ...product,
      talysurf_ng_target_spec:
        selectedTargetSpecTalysurf.length > 0
          ? selectedTargetSpecTalysurf
            .map((key) => key.toUpperCase())
            .join(", ")
          : product.talysurf_ng_target_spec &&
            product.talysurf_ng_target_spec !== ""
            ? product.talysurf_ng_target_spec // ถ้ามีค่าเดิมในฐานข้อมูล ให้คงค่าเดิม
            : "-", // ถ้าไม่มีค่าเดิมในฐานข้อมูลและไม่มีการเลือก ให้ใส่ "-"

      talysurf_ng_drawing_spec:
        selectedDrawingSpecTalysurf.length > 0
          ? selectedDrawingSpecTalysurf
            .map((key) => key.toUpperCase())
            .join(", ")
          : product.talysurf_ng_drawing_spec &&
            product.talysurf_ng_drawing_spec !== ""
            ? product.talysurf_ng_drawing_spec // ถ้ามีค่าเดิมในฐานข้อมูล ให้คงค่าเดิม
            : "-", // ถ้าไม่มีค่าเดิมในฐานข้อมูลและไม่มีการเลือก ให้ใส่ "-"
    });
    closeModalTalysurf(); // ปิด Modal
  };

  const openModalTalysurf = () => {
    const modalElement = document.getElementById("ToolNgTalysurf");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };

  const closeModalTalysurf = () => {
    const modalElement = document.getElementById("ToolNgTalysurf");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickTalysurfOverTarget = () => {
    setProduct({
      ...product,
      talysurf_over_target: selectedOverTargetTalysurf
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalTalysurfOverTarget(); // ปิด Modal
  };
  const openModalTalysurfOverTarget = () => {
    const modalElement = document.getElementById("modalTalysurfOverTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalTalysurfOverTarget = () => {
    const modalElement = document.getElementById("modalTalysurfOverTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  const handleOkClickTalysurfUnderTarget = () => {
    setProduct({
      ...product,
      talysurf_under_target: selectedUnderTargetTalysurf
        .map((key) => key.toUpperCase())
        .join(", "),
    });
    closeModalTalysurfUnderTarget(); // ปิด Modal
  };
  const openModalTalysurfUnderTarget = () => {
    const modalElement = document.getElementById("modalTalysurfUnderTarget");
    const modalInstance = new window.bootstrap.Modal(modalElement); // ใช้ window.bootstrap แทน
    modalInstance.show(); // เปิด Modal
  };
  const closeModalTalysurfUnderTarget = () => {
    const modalElement = document.getElementById("modalTalysurfUnderTarget");
    if (modalElement) {
      modalElement.classList.remove("show"); // ลบคลาส 'show' เพื่อปิด Modal
      modalElement.setAttribute("aria-hidden", "true"); // ตั้งค่า aria-hidden
      modalElement.style.display = "none"; // ซ่อน Modal

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop); // ลบ backdrop ออก
      }
    }
  };

  //---- End Talysurf condition OK , NG(Drawing) , Max , Min , Over target , Under target -----------

  useEffect(() => {
    // เมื่อเปิด Modal รีเซ็ต checkboxState ทั้งหมดให้เป็น false
    const initialCheckboxState = {};
    Object.keys(product).forEach((key) => {
      if (key.startsWith("t")) {
        initialCheckboxState[key] = false; // กำหนดค่าเริ่มต้นเป็น false
      }
    });
    setCheckboxState(initialCheckboxState); // ตั้งค่า state ของ checkbox ใหม่
  }, [product]);

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

  const fetchDataSearch = async (e) => {
    try {
      if (!barcode || !barcode.trim()) {
        Swal.fire({
          title: "CONFIRM",
          text: "กรุณาใส่ Barcode เพื่อ Check",
          icon: "warning",
        });
        return;
      }

      const response = await axios.post(
        config.api_path + "/product/barcode",
        { barcode: barcode },
        config.headers()
      );

      if (response.data.results.length === 0) {
        Swal.fire({
          title: "ไม่พบข้อมูล barcode",
          text: "กรุณาตรวจสอบ Barcode อีกครั้ง",
          icon: "error",
        });
        return;
      }

      setProducts(response.data.results);
      Swal.fire({
        title: "Success",
        text: "ค้นหา Barcode ที่ต้องการสำเร็จ",
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
      return "black"; // default color for undefined statuses
    }
  }

  const handleChangeFile = (files) => {
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
          formData.append("nameeqm", memberName);
          formData.append("dateeqm", dateeqm);
          formData.append("timeeqm", timeeqm);
          formData.append("barcode", product.barcode);
          formData.append("name", product.name);
          formData.append("shift", product.shift);
          formData.append("machine", product.machine);
          formData.append("model", product.model);
          formData.append("process", product.process);
          // formData.append("afterset", product.afterset);
          // formData.append("nameafterset", product.nameafterset);
          formData.append("afterset", aftersetFinal);
          formData.append("nameafterset", nameaftersetFinal);

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
    setProduct(item); // กำหนดค่า product ที่เลือก
    const modalElement = document.getElementById("modalProductImage");
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show(); // เปิด Modal

    fetchDataProductImage(item);
  };

  const handleChooseProductStatusPass = (item) => {
    setProduct(item); // กำหนดค่า product ที่เลือก
    const modalElement = document.getElementById("modalStatus");
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show(); // เปิด Modal

    // fetchDataProductImage(item);
  };

  const handleChooseProductStart = (item) => {
    setProduct(item);
    fetchDataProductImage(item);
  };

  const fetchDataProductImage = async (item) => {
    try {
      await axios
        .get(
          config.api_path + "/productImage/mesering/" + item.id,
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

  const handleDelete = (item) => {
    Swal.fire({
      title: "ลบข้อมูล",
      text: "ยืนยันการลบข้อมูลออกจากระบบ",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .delete(
              config.api_path + "/productImage/delete/" + item.id,
              config.headers()
            )
            .then((res) => {
              if (res.data.message === "success") {
                fetchData();
                Swal.fire({
                  title: "ลบข้อมูล",
                  text: "ลบข้อมูลแล้ว",
                  icon: "success",
                  timer: 2000,
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
      }
    });
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();

    const contourValueElement = document.getElementById("contourValue");
    const contourNgTargetElement = document.getElementById("contourNgTarget");
    const contourNgDrawingElement = document.getElementById("contourNgDrawing");
    const contourOverTargetElement = document.getElementById("contourOvertarget");
    const contourUnderTargetElement = document.getElementById("contourUndertarget");

    // ✅ ดึงค่าจาก input
    const contourValue = contourValueElement?.value || "";
    const contourNgTarget = contourNgTargetElement?.value || "";
    const contourNgDrawing = contourNgDrawingElement?.value || "";
    const contourOverTarget = contourOverTargetElement?.value || "";
    const contourUnderTarget = contourUnderTargetElement?.value || "";

    // ✅ ตรวจสอบค่าที่จำเป็น
    if (contourValue === "NG(Drawing)" && (contourNgTarget === "" || contourNgDrawing === "")) {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Tool และ Detail ก่อนบันทึกเมื่อเลือก NG",
        icon: "warning",
      });
      return;
    }
    if (contourValue === "Over target" && contourOverTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Over target",
        icon: "warning",
      });
      return;
    }
    if (contourValue === "Under target" && contourUnderTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Under target",
        icon: "warning",
      });
      return;
    }
    if (contourValue === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณาเลือกค่าในช่อง Contour",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่ามี product.id หรือไม่
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "ไม่พบ ID ของรายการ กรุณารีเฟรชหน้าก่อนบันทึก",
        icon: "error",
      });
      return;
    }

    try {

      // ✅ เตรียมข้อมูลส่งไป backend
      let updateData = {
        id: product.id,
        contour: contourValue,  // ✅ เพิ่มฟิลด์ contour ไปด้วย
        contour_ng_target_spec: contourNgTarget || null,
        contour_ng_drawing_spec: contourNgDrawing || null,
        contour_over_target: contourOverTarget || null,
        contour_under_target: contourUnderTarget || null,
      };

      // ถ้า contour ไม่ใช่ NG/Over/Under → ล้างค่า
      if (
        product.contour !== "NG(Drawing)" &&
        product.contour !== "Over target" &&
        product.contour !== "Under target"
      ) {
        updateData.contour_ng_target_spec = null;
        updateData.contour_ng_drawing_spec = null;
        updateData.contour_over_target = null;
        updateData.contour_under_target = null;
      }

      console.log("🟢 Data ส่งไป backend:", updateData);

      // ✅ เรียก PUT API (ตามหลัก REST)
      const url = `${config.api_path}/product/updateDetailNg/${product.id}`;
      const res = await axios.put(url, updateData, config.headers());

      if (res.data.message === "success") {
        Swal.fire({
          title: "สำเร็จ",
          text: "บันทึกข้อมูล Contour แล้ว",
          icon: "success",
          timer: 1800,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
        });
      }
    } catch (e) {
      console.error("❌ Error:", e);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }


  };

  const handleSaveStatusSulfcom = async (e) => {
    e.preventDefault();

    const sulfcomValueElement = document.getElementById("sulfcomValue");
    const sulfcomNgTargetElement = document.getElementById("sulfcomNgTarget");
    const sulfcomNgDrawingElement = document.getElementById("sulfcomNgDrawing");
    const sulfcomOverTargetElement = document.getElementById("sulfcomOvertarget");
    const sulfcomUnderTargetElement = document.getElementById("sulfcomUndertarget");

    // ✅ ดึงค่าจาก input
    const sulfcomValue = sulfcomValueElement?.value || "";
    const sulfcomNgTarget = sulfcomNgTargetElement?.value || "";
    const sulfcomNgDrawing = sulfcomNgDrawingElement?.value || "";
    const sulfcomOverTarget = sulfcomOverTargetElement?.value || "";
    const sulfcomUnderTarget = sulfcomUnderTargetElement?.value || "";

    if (sulfcomValue === "NG(Drawing)" && (sulfcomNgTarget === "" || sulfcomNgDrawing === "")
    ) {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Tool และ Detail ก่อนบันทึกเมื่อเลือก NG",
        icon: "warning",
      });
      return;
    }
    if (sulfcomValue === "Over target" && sulfcomOverTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Over target",
        icon: "warning",
      });
      return;
    }
    if (sulfcomValue === "Under target" && sulfcomUnderTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Under target",
        icon: "warning",
      });
      return;
    }
    if (document.getElementById("sulfcomValue").value === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Sulfcom",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่ามี product.id หรือไม่
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "ไม่พบ ID ของรายการ กรุณารีเฟรชหน้าก่อนบันทึก",
        icon: "error",
      });
      return;
    }

    try {

      // ✅ เตรียมข้อมูลส่งไป backend
      let updateDataSulfcom = {
        id: product.id,
        sulfcom: sulfcomValue,  // ✅ เพิ่มฟิลด์ contour ไปด้วย
        sulfcom_ng_target_spec: sulfcomNgTarget || null,
        sulfcom_ng_drawing_spec: sulfcomNgDrawing || null,
        sulfcom_over_target: sulfcomOverTarget || null,
        sulfcom_under_target: sulfcomUnderTarget || null,
      };

      // ถ้า contour ไม่ใช่ NG/Over/Under → ล้างค่า
      if (
        product.sulfcom !== "NG(Drawing)" &&
        product.sulfcom !== "Over target" &&
        product.sulfcom !== "Under target"
      ) {
        updateDataSulfcom.sulfcom_ng_target_spec = null;
        updateDataSulfcom.sulfcom_ng_drawing_spec = null;
        updateDataSulfcom.sulfcom_over_target = null;
        updateDataSulfcom.sulfcom_under_target = null;
      }

      console.log("🟢 Data ส่งไป backend:", updateDataSulfcom);

      // ✅ เรียก PUT API (ตามหลัก REST)
      const url = `${config.api_path}/product/updateDetailNgSulfcom/${product.id}`;
      const res = await axios.put(url, updateDataSulfcom, config.headers());

      if (res.data.message === "success") {
        Swal.fire({
          title: "สำเร็จ",
          text: "บันทึกข้อมูล Sulfcom แล้ว",
          icon: "success",
          timer: 1800,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
        });
      }
    } catch (e) {
      console.error("❌ Error:", e);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }

  };

  const handleSaveStatusRoncom = async (e) => {
    e.preventDefault();

    const roncomValueElement = document.getElementById("roncomValue");
    const roncomNgTargetElement = document.getElementById("roncomNgTarget");
    const roncomNgDrawingElement = document.getElementById("roncomNgDrawing");
    const roncomOverTargetElement = document.getElementById("roncomOvertarget");
    const roncomUnderTargetElement = document.getElementById("roncomUndertarget");

    // ✅ ดึงค่าจาก input
    const roncomValue = roncomValueElement?.value || "";
    const roncomNgTarget = roncomNgTargetElement?.value || "";
    const roncomNgDrawing = roncomNgDrawingElement?.value || "";
    const roncomOverTarget = roncomOverTargetElement?.value || "";
    const roncomUnderTarget = roncomUnderTargetElement?.value || "";

    if (roncomValue === "NG(Drawing)" && (roncomNgTarget === "" || roncomNgDrawing === "")
    ) {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Tool และ Detail ก่อนบันทึกเมื่อเลือก NG",
        icon: "warning",
      });
      return;
    }
    if (roncomValue === "Over target" && roncomOverTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Over target",
        icon: "warning",
      });
      return;
    }
    if (roncomValue === "Under target" && roncomUnderTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Under target",
        icon: "warning",
      });
      return;
    }
    if (document.getElementById("roncomValue").value === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Rondcom",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่ามี product.id หรือไม่
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "ไม่พบ ID ของรายการ กรุณารีเฟรชหน้าก่อนบันทึก",
        icon: "error",
      });
      return;
    }

    try {

      // ✅ เตรียมข้อมูลส่งไป backend
      let updateDataRoncom = {
        id: product.id,
        roncom: roncomValue,  // ✅ เพิ่มฟิลด์ contour ไปด้วย
        roncom_ng_target_spec: roncomNgTarget || null,
        roncom_ng_drawing_spec: roncomNgDrawing || null,
        roncom_over_target: roncomOverTarget || null,
        roncom_under_target: roncomUnderTarget || null,
      };

      // ถ้า contour ไม่ใช่ NG/Over/Under → ล้างค่า
      if (
        product.roncom !== "NG(Drawing)" &&
        product.roncom !== "Over target" &&
        product.roncom !== "Under target"
      ) {
        updateDataRoncom.roncom_ng_target_spec = null;
        updateDataRoncom.roncom_ng_drawing_spec = null;
        updateDataRoncom.roncom_over_target = null;
        updateDataRoncom.roncom_under_target = null;
      }

      console.log("🟢 Data ส่งไป backend:", updateDataRoncom);

      // ✅ เรียก PUT API (ตามหลัก REST)
      const url = `${config.api_path}/product/updateDetailNgRoncom/${product.id}`;
      const res = await axios.put(url, updateDataRoncom, config.headers());

      if (res.data.message === "success") {
        Swal.fire({
          title: "สำเร็จ",
          text: "บันทึกข้อมูล Roncom แล้ว",
          icon: "success",
          timer: 1800,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
        });
      }
    } catch (e) {
      console.error("❌ Error:", e);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }


  };

  const handleSaveStatusTalysurf = async (e) => {
    e.preventDefault();

    const talysurfValueElement = document.getElementById("talysurfValue");
    const talysurfNgTargetElement = document.getElementById("talysurfNgTarget");
    const talysurfNgDrawingElement = document.getElementById("talysurfNgDrawing");
    const talysurfOverTargetElement = document.getElementById("talysurfOvertarget");
    const talysurfUnderTargetElement = document.getElementById("talysurfUndertarget");

    // ✅ ดึงค่าจาก input
    const talysurfValue = talysurfValueElement?.value || "";
    const talysurfNgTarget = talysurfNgTargetElement?.value || "";
    const talysurfNgDrawing = talysurfNgDrawingElement?.value || "";
    const talysurfOverTarget = talysurfOverTargetElement?.value || "";
    const talysurfUnderTarget = talysurfUnderTargetElement?.value || "";

    if (talysurfValue === "NG(Drawing)" && (talysurfNgTarget === "" || talysurfNgDrawing === "")
    ) {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Tool และ Detail ก่อนบันทึกเมื่อเลือก NG",
        icon: "warning",
      });
      return;
    }
    if (talysurfValue === "Over target" && talysurfOverTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Over target",
        icon: "warning",
      });
      return;
    }
    if (talysurfValue === "Under target" && talysurfUnderTarget === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Under target",
        icon: "warning",
      });
      return;
    }
    if (document.getElementById("talysurfValue").value === "") {
      Swal.fire({
        title: "Warning",
        text: "กรุณากรอกข้อมูลในช่อง Rondcom",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่ามี product.id หรือไม่
    if (!product.id) {
      Swal.fire({
        title: "Error",
        text: "ไม่พบ ID ของรายการ กรุณารีเฟรชหน้าก่อนบันทึก",
        icon: "error",
      });
      return;
    }

    try {

      // ✅ เตรียมข้อมูลส่งไป backend
      let updateDataTalysurf = {
        id: product.id,
        talysurf: talysurfValue,  // ✅ เพิ่มฟิลด์ contour ไปด้วย
        talysurf_ng_target_spec: talysurfNgTarget || null,
        talysurf_ng_drawing_spec: talysurfNgDrawing || null,
        talysurf_over_target: talysurfOverTarget || null,
        talysurf_under_target: talysurfUnderTarget || null,
      };

      // ถ้า contour ไม่ใช่ NG/Over/Under → ล้างค่า
      if (
        product.talysurf !== "NG(Drawing)" &&
        product.talysurf !== "Over target" &&
        product.talysurf !== "Under target"
      ) {
        updateDataTalysurf.talysurf_ng_target_spec = null;
        updateDataTalysurf.talysurf_ng_drawing_spec = null;
        updateDataTalysurf.talysurf_over_target = null;
        updateDataTalysurf.talysurf_under_target = null;
      }

      console.log("🟢 Data ส่งไป backend:", updateDataTalysurf);

      // ✅ เรียก PUT API (ตามหลัก REST)
      const url = `${config.api_path}/product/updateDetailNgTalysurf/${product.id}`;
      const res = await axios.put(url, updateDataTalysurf, config.headers());

      if (res.data.message === "success") {
        Swal.fire({
          title: "สำเร็จ",
          text: "บันทึกข้อมูล Talysurf แล้ว",
          icon: "success",
          timer: 1800,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
        });
      }
    } catch (e) {
      console.error("❌ Error:", e);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }

  };


  const handleSaveStatusToProduct = async (e) => {
    e.preventDefault();

    if (document.getElementById("statusForProduct").value === "") {
      Swal.fire({
        title: "กรุณาเลือก",
        text: "Status เพื่อแจ้ง Production",
        icon: "warning",
      });

      return;
    }

    const startEndEQM = {
      qc_eqm_afterset_end_time: qc_eqm_afterset_end_time,
    };

    // Log payload before sending
    console.log("Payload to be sent:", { ...product, ...startEndEQM });

    try {
      let url = config.api_path + "/product/insert";

      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      const response = await axios.post(
        url,
        { ...product, ...startEndEQM },
        config.headers()
      );

      // Log response from backend
      console.log("Response from backend:", response);

      if (response.data.message === "success") {
        Swal.fire({
          title: "บันทึกข้อมูล",
          text: "บันทึก Status แล้ว",
          icon: "success",
          timer: 10000,
        });
        window.location.reload();
        fetchData();
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });

      // Log any errors
      console.error("Error:", e);
    }
  };

  const handleStartTimeEQM = async (e) => {
    e.preventDefault();

    const startTimeEQM = {
      ...product,
      qc_eqm_start_time: qc_eqm_start_time,
    };

    try {
      let url = config.api_path + "/product/updateTimeEQM";

      await axios.post(url, startTimeEQM, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Start Time แล้ว",
            icon: "success",
            timer: 20000,
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

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    localStorage.setItem("itemsPerPage", newItemsPerPage);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.api_path}/product2TCH/listMachineQCShaftTCH?page=${currentPage}&limit=${itemsPerPage}`,
        config.headers()
      );
      if (response.data.message === "success") {
        setProducts(response.data.results);
        setTotalItems(response.data.totalItems);
        // setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));

        // คำนวณจำนวนหน้าทั้งหมด โดยใช้ Math.min เพื่อให้มั่นใจว่ามีหน้าทั้งหมดไม่เกินจำนวน maxRows
        setTotalPages(
          Math.ceil(Math.min(response.data.totalItems, 200) / itemsPerPage)
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSaveCancelReject = async (e) => {
    e.preventDefault();

    const status = document.getElementById("statusForReject")?.value;
    const remark = document.getElementById("remarkForReject")?.value;

    if (!status || !remark) {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอกข้อมูล Reject และ Remark",
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

      const url = `${config.api_path}/product/updateReject/${product.id}`;
      const res = await axios.put(url, product, config.headers());

      if (res.data.message === "success") {
        Swal.fire({
          title: "บันทึกข้อมูล",
          text: "บันทึก Reject & Remark แล้ว",
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    if (totalPages <= 15) {
      return Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"
            } mx-1`}
        >
          {index + 1}
        </button>
      ));
    } else {
      return (
        <>
          <div className="Previous-Next">
            <button
              onClick={handlePreviousPage}
              className={`btn ${currentPage === 1 ? "btn-secondary" : "btn-primary"
                } mx-1`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`btn ${currentPage === totalPages ? "btn-secondary" : "btn-primary"
                } mx-1`}
              disabled={currentPage === totalPages}
            >
              Next ...
            </button>
          </div>
        </>
      );
    }
  };

  const [selectedMCType, setSelectedMCType] = useState(() => {
    return localStorage.getItem("selectedMCType") || "";
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  // ฟังก์ชันสำหรับการเปลี่ยนค่าของ M/C Type และบันทึกค่าลงใน LocalStorage
  const handleMCTypeChange = (value) => {
    setSelectedMCType(value);
    localStorage.setItem("selectedMCType", value); // บันทึกค่าลงใน LocalStorage

    // เมื่อกดปุ่มแต่ละปุ่ม ให้ไปที่หน้าเฉพาะ
    if (value === "TBS") {
      navigate("/toolNumberQCShaft");
      window.location.reload();
    } else if (value === "TBM") {
      navigate("/toolNumberQCShaftTBM");
      window.location.reload();
    } else if (value === "TTC") {
      navigate("/toolNumberQCShaftTTC");
      window.location.reload();
    } else if (value === "TCH") {
      navigate("/toolNumberQCShaftTCH");
      window.location.reload();
    } else if (value === "TB") {
      navigate("/toolNumberQCShaftTB");
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
  }, [selectedMCType, products]);

  //------- Start Add web socket 20-10-25 -------------------------------------------------
  
  useEffect(() => {
    const socket = config.socket;
  
    socket.on("productUpdated", (updatedProduct) => {
      console.log("🟡 Product updated via socket:", updatedProduct);
  
      // ✅ อัปเดต state ตาม id ถ้าคุณใช้ list
      setProducts((prev) =>
        prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      );
    });
  
    return () => {
      socket.off("productUpdated");
    };
  }, []);
  
  
   useEffect(() => {
    const socket = config.socket;
  
    // 🔌 Event การเชื่อมต่อ
    socket.on("connect", () => console.log("✅ Connected to socket:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected from socket"));
  
    // 🆕 รับข้อมูลเมื่อมีการเพิ่มรายการใหม่
    socket.on("productAdded", (newProduct) => {
      // console.log("🆕 New product:", newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      setTotalItems((prev) => prev + 1);
  
      if (
        selectedMCType === "" ||
        newProduct.machine.startsWith(selectedMCType)
      ) {
        setFilteredProducts((prev) => [newProduct, ...prev]);
      }
    });
  
    // 🔄 รับข้อมูลเมื่อมีการแก้ไขรายการ (Contour, Sulfcom)
    socket.on("productUpdated", (updatedProduct) => {
      // console.log("🔄 Product updated:", updatedProduct);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item
        )
      );
      if (
        selectedMCType === "" ||
        updatedProduct.machine.startsWith(selectedMCType)
      ) {
        setFilteredProducts((prev) =>
          prev.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item
          )
        );
      }
    });
  
    return () => {
      // ✅ ล้าง event ทั้งหมดตอน unmount
      socket.off("connect");
      socket.off("disconnect");
      socket.off("productAdded");
      socket.off("productUpdated");
    };
  }, [selectedMCType]);
  
  //------- End Add web socket 20-10-25  ------------------------------------------------------------

  // เลือกค่าหลังสุดที่ไม่ว่างของ nameafterset
  const nameaftersetFinal =
    product.nameafterset5?.trim() ||
    product.nameafterset4?.trim() ||
    product.nameafterset3?.trim() ||
    product.nameafterset2?.trim() ||
    product.nameafterset?.trim() ||
    "";

  // เลือกค่าหลังสุดที่ไม่ว่างของ afterset
  const aftersetFinal =
    product.afterset5?.trim() ||
    product.afterset4?.trim() ||
    product.afterset3?.trim() ||
    product.afterset2?.trim() ||
    product.afterset?.trim() ||
    "";

  const handleSaveAfterSet_1_Production = async (e) => {
    e.preventDefault();

    if (!memberName) {
      Swal.fire({
        title: "ยังไม่ได้โหลดชื่อผู้ใช้",
        text: "ระบบกำลังโหลดชื่อผู้ใช้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่าไม่มี nameafterset หรือ afterset จากฐานข้อมูล
    if (!product.nameafterset || !product.afterset) {
      Swal.fire({
        title: "ไม่สามารถบันทึกได้",
        text: "ยังไม่มีข้อมูล After Set 1",
        icon: "warning",
      });
      return;
    }

    if (document.getElementById("AfterSet_1").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาเลือก Status AF1",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกสถานะ AF1 ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#28a745", // เขียว
      cancelButtonColor: "#dc3545",  // แดง
    });

    if (!result.isConfirmed) return;

    const now = new Date();
    const dateNow = now.toISOString().split("T")[0];      // YYYY-MM-DD
    const timeNow = now.toTimeString().split(" ")[0];      // HH:mm:ss

    const updatedProduct = {
      ...product,
      nameafterset_eqm: memberName,
      afterset_eqm: product.afterset_eqm,
      dateafterset_eqm: dateNow,
      timeafterset_eqm: timeNow,
    };

    try {
      let url = config.api_path + "/product/insert";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios.post(url, updatedProduct, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Status AF1 แล้ว",
            icon: "success",
            timer: 1000,
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
  const handleSaveAfterSet_2_Production = async (e) => {
    e.preventDefault();

    if (!memberName) {
      Swal.fire({
        title: "ยังไม่ได้โหลดชื่อผู้ใช้",
        text: "ระบบกำลังโหลดชื่อผู้ใช้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่าไม่มี nameafterset หรือ afterset จากฐานข้อมูล
    if (!product.nameafterset2 || !product.afterset2) {
      Swal.fire({
        title: "ไม่สามารถบันทึกได้",
        text: "ยังไม่มีข้อมูล After Set 2",
        icon: "warning",
      });
      return;
    }

    if (document.getElementById("AfterSet_2").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาเลือก Status AF2",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกสถานะ AF2 ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#28a745", // เขียว
      cancelButtonColor: "#dc3545",  // แดง
    });

    if (!result.isConfirmed) return;

    const now = new Date();
    const dateNow = now.toISOString().split("T")[0];      // YYYY-MM-DD
    const timeNow = now.toTimeString().split(" ")[0];      // HH:mm:ss

    const updatedProduct = {
      ...product,
      nameafterset_eqm2: memberName,
      afterset_eqm2: product.afterset_eqm2,
      dateafterset_eqm2: dateNow,
      timeafterset_eqm2: timeNow,
    };

    try {
      let url = config.api_path + "/product/insert";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios.post(url, updatedProduct, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Status AF2 แล้ว",
            icon: "success",
            timer: 1000,
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
  const handleSaveAfterSet_3_Production = async (e) => {
    e.preventDefault();

    if (!memberName) {
      Swal.fire({
        title: "ยังไม่ได้โหลดชื่อผู้ใช้",
        text: "ระบบกำลังโหลดชื่อผู้ใช้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่าไม่มี nameafterset หรือ afterset จากฐานข้อมูล
    if (!product.nameafterset3 || !product.afterset3) {
      Swal.fire({
        title: "ไม่สามารถบันทึกได้",
        text: "ยังไม่มีข้อมูล After Set 3",
        icon: "warning",
      });
      return;
    }

    if (document.getElementById("AfterSet_3").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาเลือก Status AF3",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกสถานะ AF3 ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#28a745", // เขียว
      cancelButtonColor: "#dc3545",  // แดง
    });

    if (!result.isConfirmed) return;

    const now = new Date();
    const dateNow = now.toISOString().split("T")[0];      // YYYY-MM-DD
    const timeNow = now.toTimeString().split(" ")[0];      // HH:mm:ss

    const updatedProduct = {
      ...product,
      nameafterset_eqm3: memberName,
      afterset_eqm3: product.afterset_eqm3,
      dateafterset_eqm3: dateNow,
      timeafterset_eqm3: timeNow,
    };

    try {
      let url = config.api_path + "/product/insert";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios.post(url, updatedProduct, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Status AF3 แล้ว",
            icon: "success",
            timer: 1000,
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
  const handleSaveAfterSet_4_Production = async (e) => {
    e.preventDefault();

    if (!memberName) {
      Swal.fire({
        title: "ยังไม่ได้โหลดชื่อผู้ใช้",
        text: "ระบบกำลังโหลดชื่อผู้ใช้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่าไม่มี nameafterset หรือ afterset จากฐานข้อมูล
    if (!product.nameafterset4 || !product.afterset4) {
      Swal.fire({
        title: "ไม่สามารถบันทึกได้",
        text: "ยังไม่มีข้อมูล After Set 4",
        icon: "warning",
      });
      return;
    }


    if (document.getElementById("AfterSet_4").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาเลือก Status AF4",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกสถานะ AF3 ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#28a745", // เขียว
      cancelButtonColor: "#dc3545",  // แดง
    });

    if (!result.isConfirmed) return;

    const now = new Date();
    const dateNow = now.toISOString().split("T")[0];      // YYYY-MM-DD
    const timeNow = now.toTimeString().split(" ")[0];      // HH:mm:ss

    const updatedProduct = {
      ...product,
      nameafterset_eqm4: memberName,
      afterset_eqm4: product.afterset_eqm4,
      dateafterset_eqm4: dateNow,
      timeafterset_eqm4: timeNow,
    };

    try {
      let url = config.api_path + "/product/insert";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios.post(url, updatedProduct, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Status AF4 แล้ว",
            icon: "success",
            timer: 1000,
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
  const handleSaveAfterSet_5_Production = async (e) => {
    e.preventDefault();

    if (!memberName) {
      Swal.fire({
        title: "ยังไม่ได้โหลดชื่อผู้ใช้",
        text: "ระบบกำลังโหลดชื่อผู้ใช้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
        icon: "warning",
      });
      return;
    }

    // ✅ ตรวจสอบว่าไม่มี nameafterset หรือ afterset จากฐานข้อมูล
    if (!product.nameafterset5 || !product.afterset5) {
      Swal.fire({
        title: "ไม่สามารถบันทึกได้",
        text: "ยังไม่มีข้อมูล After Set 5",
        icon: "warning",
      });
      return;
    }

    if (document.getElementById("AfterSet_5").value === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาเลือก Status AF5",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกสถานะ AF5 ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#28a745", // เขียว
      cancelButtonColor: "#dc3545",  // แดง
    });

    if (!result.isConfirmed) return;

    const now = new Date();
    const dateNow = now.toISOString().split("T")[0];      // YYYY-MM-DD
    const timeNow = now.toTimeString().split(" ")[0];      // HH:mm:ss

    const updatedProduct = {
      ...product,
      nameafterset_eqm5: memberName,
      afterset_eqm5: product.afterset_eqm5,
      dateafterset_eqm5: dateNow,
      timeafterset_eqm5: timeNow,
    };

    try {
      let url = config.api_path + "/product/insert";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios.post(url, updatedProduct, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึก Status AF5 แล้ว",
            icon: "success",
            timer: 1000,
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

  const closeModalCancelRecord = () => {
    const modalElement = document.getElementById("modalCancelRecord");
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
      <Link to="/homeQC" class="ml-3">
        <i className="text-dark nav-icon fas fa-home mt-1" id="iconM" />
      </Link>

      <div className="row">
        <div className="col-12 items-per-page-containerSearch mb-3">
          <label htmlFor="itemsPerPage1" className="form-label1 border-label me-2">
            SELECT M/C TYPE :
          </label>

          <div className="btn-group" role="group" aria-label="MC Types">
            <button
              type="button"
              className={`btn ${selectedMCType === "TBS" ? "btn-primary" : "btn-light"} ml-1`}
              onClick={() => handleMCTypeChange("TBS")}
            >
              TBS
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "TBM" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("TBM")}
            >
              TBM
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "TTC" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("TTC")}
            >
              TTC
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "TCH" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("TCH")}
            >
              TCH
            </button>
            <button
              type="button"
              className={`btn ${selectedMCType === "TB" ? "btn-primary" : "btn-light"} ml-4`}
              onClick={() => handleMCTypeChange("TB")}
            >
              TB
            </button>
          </div>
        </div>
      </div>

      <div className="signup_container d-flex justify-content-center">
        <div className="signup_form w-50">
          <div className="card card-outline card-dark">
            <div className="card-header text-center" id="product-tool-list">
              <h3 className="h3">
                <b className="ml-3">
                  SEARCH BARCODE PRODUCTION CHANGE TOOL ( SHAFT ){" "}
                  {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
                  {timeLeft % 60}
                </b>
                <span className="ml-3"></span>
              </h3>
            </div>
            <div className="card-body" id="bodySurfcom">
              <form>
                <div className="row">
                  <div className="col-6">
                    <span
                      className="btn bg-secondary border border-secondary-subtle fw-bold mr-2"
                      id="spanUser"
                    >
                      Barcode
                    </span>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control mr-5"
                        placeholder="กรุณาใส่ Barcode เพื่อ Check"
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer border border-secondary-subtle mt-1">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-success mr-3"
                      onClick={fetchDataSearch}
                    >
                      SEARCH BARCODE
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-2 items-per-page-container mb-3 bg-primary">
          <label
            htmlFor="itemsPerPage"
            className="form-label border-label me-2"
          >
            ITEMS PER PAGE:
          </label>
          <select
            id="itemsPerPage"
            className="form-select w-auto"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select>
        </div>
        <div className="col-3 mt-3">{renderPageButtons()}</div>
      </div>
      <table
        className="mt-3 table table-bordered table-striped"
        id="table-qc-search"
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
            <th className="text-center text-white">
              {/* <DirectionsRunIcon /> */}
              Rondcom
            </th>
            <th className="text-center text-white">Talysurf</th>
            <th className="text-center text-white">QC Line</th>
            <th className="text-center text-white">Start</th>
            <th className="text-center text-white">Check</th>
            <th className="text-center text-white">Status</th>
            <th className="text-center text-white">Phone</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0
            ? filteredProducts.map((item) => (
              <tr key={item.id}>
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
                  {...(
                    item.afterset &&
                      item.nameafterset &&
                      !item.afterset2 &&
                      !item.nameafterset2 &&
                      !item.afterset3 &&
                      !item.nameafterset3 &&
                      !item.afterset4 &&
                      !item.nameafterset4 &&
                      !item.afterset5 &&
                      !item.nameafterset5
                      ? {
                        "data-toggle": "modal",
                        "data-target": "#modalShowAF",
                        onClick: () => handleOpenModalAF(item),
                      }
                      : {}
                  )}

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
                  {...(
                    item.afterset2 &&
                      item.nameafterset2 &&
                      !item.afterset3 &&
                      !item.nameafterset3 &&
                      !item.afterset4 &&
                      !item.nameafterset4 &&
                      !item.afterset5 &&
                      !item.nameafterset5
                      ? {
                        "data-toggle": "modal",
                        "data-target": "#modalShowAF",
                        onClick: () => handleOpenModalAF(item),
                      }
                      : {}
                  )}
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
                  {...(
                    item.afterset3 &&
                      item.nameafterset3 &&
                      !item.afterset4 &&
                      !item.nameafterset4 &&
                      !item.afterset5 &&
                      !item.nameafterset5
                      ? {
                        "data-toggle": "modal",
                        "data-target": "#modalShowAF",
                        onClick: () => handleOpenModalAF(item),
                      }
                      : {}
                  )}
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
                  {...(
                    item.afterset4 &&
                      item.nameafterset4 &&
                      !item.afterset5 &&
                      !item.nameafterset5
                      ? {
                        "data-toggle": "modal",
                        "data-target": "#modalShowAF",
                        onClick: () => handleOpenModalAF(item),
                      }
                      : {}
                  )}
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
                  {...(
                    item.afterset5 &&
                      item.nameafterset5
                      ? {
                        "data-toggle": "modal",
                        "data-target": "#modalShowAF",
                        onClick: () => handleOpenModalAF(item),
                      }
                      : {}
                  )}
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
                  {item.qc_eqm_start_time ? (
                    item.qc_eqm_start_time
                  ) : (
                    <button
                      onClick={(e) => {
                        if (item.area_qc_check !== "QC Line") {
                          // เปิด Modal เฉพาะเมื่อไม่ใช่ QC Line
                          handleChooseProductStart(item);
                          // ใช้ JavaScript เพื่อเปิด Modal แทนการใช้ data-toggle
                          const modalElement =
                            document.getElementById("modalStartTimeEQM");
                          const modalInstance = new window.bootstrap.Modal(
                            modalElement
                          );
                          modalInstance.show(); // เปิด Modal
                        } else {
                          e.preventDefault(); // ป้องกันการทำงานถ้าเป็น QC Line
                          console.log("QC Line selected, cannot open modal.");
                        }
                      }}
                      className="btn mr-2 mb-2"
                    >
                      <AccessAlarmIcon className="start-time-qem" />
                      Start
                    </button>
                  )}
                </td>

                <td className="text-center">
                  {item.qc_eqm_start_time ? (
                    <button
                      onClick={(e) => handleChooseProduct(item)}
                      data-toggle="modal"
                      data-target="#modalProductImage"
                      className="btn mr-2"
                      id="add-profile-qc"
                    >
                      <i className="fa fa-image mr-1"></i>
                      Check
                    </button>
                  ) : null}
                </td>
                <td className="text-center">
                  {item.qc_eqm_afterset_end_time}
                  {item.qc_eqm_start_time && item.barcode !== "Pass" ? ( // ตรวจสอบทั้ง qc_eqm_start_time และ barcode
                    <button
                      onClick={(e) => handleChooseProductStatusPass(item)}
                      data-toggle="modal"
                      data-target="#modalStatus"
                      className="btn ml-2 bg-primary"
                    >
                      Status
                    </button>
                  ) : null}
                </td>
                {/* <td>
                    {item.barcode === "Pass" ? (
                      // หาก barcode เป็น "Pass" ให้แสดงปุ่ม OK
                      <button
                        onClick={() => {
                          playAnnouncementOk(item.machine);
                        }}
                        className="btn ml-2 mb-1 bg-primary btn-large"
                      >
                        <VolumeUpIcon />
                        OK
                      </button>
                    ) : null}

                    {item.contour === "NG(Drawing)" ||
                    item.sulfcom === "NG(Drawing)" ||
                    item.roncom === "NG(Drawing)" ||
                    item.talysurf === "NG(Drawing)" ? (
                      <button
                        onClick={() => {
                          playAnnouncementNg(item.machine);
                        }}
                        className="btn ml-2 bg-danger btn-large"
                      >
                        <VolumeUpIcon />
                        NG
                      </button>
                    ) : null}
                  </td> */}

                <td>
                  {item.barcode === "Pass" && item.area_qc_check === "QC Eqm" ? (
                    // หาก barcode เป็น "Pass" ให้แสดงปุ่ม OK
                    <button
                      onClick={() => {
                        playAnnouncementOk(item.machine);
                      }}
                      className="btn ml-2 mb-1 bg-primary btn-large"
                    >
                      <VolumeUpIcon />
                      OK
                    </button>
                  ) : null}

                  {item.contour === "NG(Drawing)" ||
                    item.contour === "Max" || item.contour === "Min" ||
                    item.contour === "Over target" || item.contour === "Under target" ||

                    item.sulfcom === "NG(Drawing)" ||
                    item.sulfcom === "Max" || item.sulfcom === "Min" ||
                    item.sulfcom === "Over target" || item.sulfcom === "Under target" ||

                    item.roncom === "NG(Drawing)" ||
                    item.roncom === "Max" || item.roncom === "Min" ||
                    item.roncom === "Over target" || item.roncom === "Under target" ||

                    item.talysurf === "NG(Drawing)" ||
                    item.talysurf === "Max" || item.talysurf === "Min" ||
                    item.talysurf === "Over target" || item.talysurf === "Under target"
                    ? (
                      <button
                        onClick={() => {
                          playAnnouncementNg(item.machine);
                        }}
                        className="btn ml-2 bg-danger btn-large"
                      >
                        <VolumeUpIcon />
                        NG
                      </button>
                    ) : null}
                </td>

              </tr>
            ))
            : ""}
        </tbody>
      </table>

      <Modal id="modalStartTimeEQM" title="" modalSize="modal-lg">
        <div className="col-12 mb-3" id="tool-qc-confirm">
          <h3 className="h3">
            <b className="ml-3">START TIME CHECK</b>
          </h3>
        </div>
        <div className="col-3 mt-3">
          <div className="text-bold text-center bg-secondary">Time</div>
          <input
            value={qc_eqm_start_time}
            onChange={(e) =>
              setProduct({ ...product, qc_eqm_start_time: e.target.value })
            }
            className="form-control text-center text-primary"
            name="qc_eqm_start_time"
          />
        </div>
        <div className="col-8 mt-3"></div>
        <div className="col-12">
          <button
            className="btn btn-success mb-4 mt-3 col-6"
            onClick={handleStartTimeEQM}
            type="button"
          >
            <AccessAlarmIcon className="p-2 fs-1" id="start-time-qem-modal" />
            Start Time
          </button>
        </div>
      </Modal>

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
              onChange={(e) => setBarcode(e.target.value)}
              value={product.barcode}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Name
            </div>
            <input
              onChange={(e) => setName(e.target.value)}
              value={product.name}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Machine
            </div>

            <input
              onChange={(e) => setMachine(e.target.value)}
              value={product.machine}
              className="form-control text-primary"
            />
          </div>
          <div className="col-4">
            <div className="text-bold pl-2" id="box-product">
              Model
            </div>
            <input
              onChange={(e) => setModel(e.target.value)}
              value={product.model}
              className="form-control text-primary"
            />
          </div>
          <div className="col-2">
            <div className="text-bold pl-2" id="box-product">
              Process
            </div>
            <input
              onChange={(e) => setProcess(e.target.value)}
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

          <hr className="mt-1 mb-1"></hr>
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
          <hr className="mt-1 mb-1"></hr>

          <div className="col-12 mt-1 mb-1" id="tool-production-Afterset-qc">
            <h3 className="h3">
              <b className="ml-3">Production After set
                <button
                  type="button"
                  className="col-5 btn btn-danger ml-5 fw-bold"
                  data-toggle="modal"
                  data-target="#modalCancelRecord"
                >
                  Cancel Record
                </button>

              </b>
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

          <div className="col-2 mt-3">
            <div className="text-bold text-center bg-secondary">User EQM</div>
            <input
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="form-control text-center text-primary"
              name="nameeqm"
            />
          </div>

          <div className="col-2 mt-3">
            <div className="text-bold text-center bg-secondary">Date</div>
            <input
              value={dateeqm}
              onChange={(e) => setDateeqm(e.target.value)}
              className="form-control text-center text-primary"
              name="dateeqm"
            />
          </div>

          <div className="col-2 mt-3">
            <div className="text-bold text-center bg-secondary">Time</div>
            <input
              value={timeeqm}
              onChange={(e) => setTimeeqm(e.target.value)}
              className="form-control text-center text-primary"
              name="timeeqm"
            />
          </div>

          <div className="col-12 mt-2 mb-3" id="tool-qc-confirm">
            <h3 className="h3">
              <b className="ml-3">QC Equipment confirm</b>
            </h3>
          </div>

          <div className="col-2">
            <input
              value={product.contour}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-2 ">
            <input
              value={product.sulfcom}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-2 ">
            <input
              value={product.roncom}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-2">
            <input
              value={product.talysurf}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-4"></div>

          {/*---------- Start Contour condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          <div className="col-2">
            <div className="text-bold text-center" id="box-1">
              Contour
            </div>
            {/* Select สำหรับให้ผู้ใช้งานเลือกค่า */}
            <select
              onChange={handleContourChange} // เรียกใช้ฟังก์ชันเมื่อมีการเลือกค่า
              value={userSelectedContour || product.contour} // แสดงค่าที่เลือกใหม่หรือค่าเดิมจากฐานข้อมูล
              id="contourValue"
              className="form-control"
            >
              <option value="">Select...</option>
              <option value="OK">OK</option>
              <option value="NG(Drawing)">NG(Drawing)</option>
              <option value="Max">Max</option>
              <option value="Min">Min</option>
              <option value="Over target">Over target</option>
              <option value="Under target">Under target</option>
            </select>
            {/* ถ้ามีค่า contour จากการเลือกใหม่หรือฐานข้อมูล, ให้แสดงผล */}
            {userSelectedContour || product.contour ? (
              <>
                {userSelectedContour === "NG(Drawing)" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModal2}
                    >
                      Select tool
                    </button>
                    <input
                      id="contourNgTarget"
                      value={product.contour_ng_target_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev, contour_ng_target_spec: e.target.value.toUpperCase(),
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                    <input
                      id="contourNgDrawing"
                      value={product.contour_ng_drawing_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev, contour_ng_drawing_spec: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Detail......."
                    />
                  </>
                )}

                {userSelectedContour === "Over target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalContourOverTarget}
                    >
                      Over target
                    </button>
                    <input
                      id="contourOvertarget"
                      value={product.contour_over_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          contour_over_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {userSelectedContour === "Under target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalContourUnderTarget}
                    >
                      Under target
                    </button>
                    <input
                      id="contourUndertarget"
                      value={product.contour_under_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          contour_under_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {/* ปุ่ม Save จะแสดงเฉพาะเมื่อผู้ใช้งานเลือกค่าใหม่จาก <select> */}
                {userSelectedContour && (
                  <button
                    className="btn btn-success mt-4"
                    onClick={handleSaveStatus}
                    type="button"
                  >
                    Save Contour
                  </button>
                )}
              </>
            ) : null}{" "}
            {/* ถ้าไม่มีการเลือกค่า ให้ซ่อนปุ่ม */}
          </div>

          {/*---------- End Contour condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          {/*---------- Start Sulfcom condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          <div className="col-2">
            <div className="text-bold text-center" id="box-1">
              Surfcom
            </div>
            {/* Select สำหรับให้ผู้ใช้งานเลือกค่า */}
            <select
              onChange={handleSulfcomChange} // เรียกใช้ฟังก์ชันเมื่อมีการเลือกค่า
              value={userSelectedSulfcom || product.sulfcom} // แสดงค่าที่เลือกใหม่หรือค่าเดิมจากฐานข้อมูล
              id="sulfcomValue"
              className="form-control"
            >
              <option value="">Select...</option>
              <option value="OK">OK</option>
              <option value="NG(Drawing)">NG(Drawing)</option>
              <option value="Max">Max</option>
              <option value="Min">Min</option>
              <option value="Over target">Over target</option>
              <option value="Under target">Under target</option>
            </select>
            {/* ถ้ามีค่า sulfcom จากการเลือกใหม่หรือฐานข้อมูล, ให้แสดงผล */}
            {userSelectedSulfcom || product.sulfcom ? (
              <>
                {userSelectedSulfcom === "NG(Drawing)" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalSulfcom}
                    >
                      Select tool
                    </button>
                    <input
                      id="sulfcomNgTarget"
                      value={product.sulfcom_ng_target_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          sulfcom_ng_target_spec: e.target.value.toUpperCase(),
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                    <input
                      id="sulfcomNgDrawing"
                      value={product.sulfcom_ng_drawing_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          sulfcom_ng_drawing_spec: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Detail......."
                    />
                  </>
                )}

                {userSelectedSulfcom === "Over target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalSulfcomOverTarget}
                    >
                      Over target
                    </button>
                    <input
                      id="sulfcomOvertarget"
                      value={product.sulfcom_over_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          sulfcom_over_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {userSelectedSulfcom === "Under target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalSulfcomUnderTarget}
                    >
                      Under target
                    </button>
                    <input
                      id="sulfcomUndertarget"
                      value={product.sulfcom_under_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          sulfcom_under_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {/* ปุ่ม Save จะแสดงเฉพาะเมื่อผู้ใช้งานเลือกค่าใหม่จาก <select> */}
                {userSelectedSulfcom && (
                  <button
                    className="btn btn-success mt-4"
                    onClick={handleSaveStatusSulfcom}
                    type="button"
                  >
                    Save Sulfcom
                  </button>
                )}
              </>
            ) : null}{" "}
            {/* ถ้าไม่มีการเลือกค่า ให้ซ่อนปุ่ม */}
          </div>

          {/*---------- End Sulfcom condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          {/*---------- Start Roncom condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          <div className="col-2">
            <div className="text-bold text-center" id="box-1">
              Rondcom
            </div>
            {/* Select สำหรับให้ผู้ใช้งานเลือกค่า */}
            <select
              onChange={handleRoncomChange} // เรียกใช้ฟังก์ชันเมื่อมีการเลือกค่า
              value={userSelectedRoncom || product.roncom} // แสดงค่าที่เลือกใหม่หรือค่าเดิมจากฐานข้อมูล
              id="roncomValue"
              className="form-control"
            >
              <option value="">Select...</option>
              <option value="OK">OK</option>
              <option value="NG(Drawing)">NG(Drawing)</option>
              <option value="Max">Max</option>
              <option value="Min">Min</option>
              <option value="Over target">Over target</option>
              <option value="Under target">Under target</option>
            </select>
            {/* ถ้ามีค่า roncom จากการเลือกใหม่หรือฐานข้อมูล, ให้แสดงผล */}
            {userSelectedRoncom || product.roncom ? (
              <>
                {userSelectedRoncom === "NG(Drawing)" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalRoncom}
                    >
                      Select tool
                    </button>
                    <input
                      id="roncomNgTarget"
                      value={product.roncom_ng_target_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          roncom_ng_target_spec: e.target.value.toUpperCase(),
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                    <input
                      id="roncomNgDrawing"
                      value={product.roncom_ng_drawing_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          roncom_ng_drawing_spec: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Detail......."
                    />
                  </>
                )}

                {userSelectedRoncom === "Over target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalRoncomOverTarget}
                    >
                      Over target
                    </button>
                    <input
                      id="roncomOvertarget"
                      value={product.roncom_over_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          roncom_over_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {userSelectedRoncom === "Under target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalRoncomUnderTarget}
                    >
                      Under target
                    </button>
                    <input
                      id="roncomUndertarget"
                      value={product.roncom_under_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          roncom_under_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {/* ปุ่ม Save จะแสดงเฉพาะเมื่อผู้ใช้งานเลือกค่าใหม่จาก <select> */}
                {userSelectedRoncom && (
                  <button
                    className="btn btn-success mt-4"
                    onClick={handleSaveStatusRoncom}
                    type="button"
                  >
                    Save Rondcom
                  </button>
                )}
              </>
            ) : null}{" "}
            {/* ถ้าไม่มีการเลือกค่า ให้ซ่อนปุ่ม */}
          </div>

          {/*---------- End Rondcom condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          {/*---------- Start Talysurf condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          <div className="col-2">
            <div className="text-bold text-center" id="box-1">
              Talysurf
            </div>
            {/* Select สำหรับให้ผู้ใช้งานเลือกค่า */}
            <select
              onChange={handleTalysurfChange} // เรียกใช้ฟังก์ชันเมื่อมีการเลือกค่า
              value={userSelectedTalysurf || product.talysurf} // แสดงค่าที่เลือกใหม่หรือค่าเดิมจากฐานข้อมูล
              id="talysurfValue"
              className="form-control"
            >
              <option value="">Select...</option>
              <option value="OK">OK</option>
              <option value="NG(Drawing)">NG(Drawing)</option>
              <option value="Max">Max</option>
              <option value="Min">Min</option>
              <option value="Over target">Over target</option>
              <option value="Under target">Under target</option>
            </select>
            {/* ถ้ามีค่า roncom จากการเลือกใหม่หรือฐานข้อมูล, ให้แสดงผล */}
            {userSelectedTalysurf || product.talysurf ? (
              <>
                {userSelectedTalysurf === "NG(Drawing)" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalTalysurf}
                    >
                      Select tool
                    </button>
                    <input
                      id="talysurfNgTarget"
                      value={product.talysurf_ng_target_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) =>({
                          ...prev,
                          talysurf_ng_target_spec: e.target.value.toUpperCase(),
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                    <input
                      id="talysurfNgDrawing"
                      value={product.talysurf_ng_drawing_spec || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          talysurf_ng_drawing_spec: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Detail......."
                    />
                  </>
                )}

                {userSelectedTalysurf === "Over target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalTalysurfOverTarget}
                    >
                      Over target
                    </button>
                    <input
                      id="talysurfOvertarget"
                      value={product.talysurf_over_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          talysurf_over_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {userSelectedTalysurf === "Under target" && (
                  <>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={openModalTalysurfUnderTarget}
                    >
                      Under target
                    </button>
                    <input
                      id="talysurfUndertarget"
                      value={product.talysurf_under_target || ""}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          talysurf_under_target: e.target.value,
                        }))
                      }
                      type="text"
                      className="form-control mt-2"
                      placeholder="Tool......."
                    />
                  </>
                )}

                {/* ปุ่ม Save จะแสดงเฉพาะเมื่อผู้ใช้งานเลือกค่าใหม่จาก <select> */}
                {userSelectedTalysurf && (
                  <button
                    className="btn btn-success mt-4"
                    onClick={handleSaveStatusTalysurf}
                    type="button"
                  >
                    Save Talysurf
                  </button>
                )}
              </>
            ) : null}{" "}
            {/* ถ้าไม่มีการเลือกค่า ให้ซ่อนปุ่ม */}
          </div>

          {/*---------- End Talysurf condition OK , NG(Drawing) , Max , Min , Over target , Under target--------------*/}

          <div className="col-4"></div>
          {/* <div className="col-12">
            <button
              className="btn btn-success mb-4 mt-3 ml-2"
              onClick={handleSaveStatus}
              type="button"
            >
              Save status
            </button>
          </div> */}

          <hr className="mt-2 mb-1"></hr>

          <div className="col-3 mt-3">
            <div className="text-bold pl-2" id="box-1">
              Mesering PDF
            </div>
            <input
              onChange={(e) => setMesering(e.target.value)}
              list="data4"
              type="text"
              className="form-control"
              placeholder="select..."
            />
            <datalist id="data4">
              <option>Contour</option>
              <option>Sulfcom</option>
              <option>Roncom</option>
              <option>Talysurf</option>
            </datalist>
          </div>

          <div className="col-2 mt-3">
            <div className="text-bold pl-2" id="box-1">
              Status PDF
            </div>
            <input
              onChange={(e) => setStatus(e.target.value)}
              list="data2"
              type="text"
              className="form-control"
              placeholder="select..."
            />
            <datalist id="data2">
              <option>OK</option>
              <option>NG(Drawing)</option>
              <option>Max</option>
              <option>Min</option>
              <option>Over target</option>
              <option>Under target</option>
            </datalist>
          </div>

          <div className="col-6 ml-2 mt-3" id="box-1">
            <div className="text-bold pl-1 ">Profile status</div>
            <input
              onChange={(e) => handleChangeFile(e.target.files)}
              type="file"
              //   accept=".pdf"
              // name="pdfName"
              accept="application/pdf"
              name="imageName"
              className="form-control"
            />
          </div>

          {/* {productImage.name !== undefined ? (
            <div>File: {productImage.name}</div>
          ) : (
            ""
          )} */}
        </div>
        <div className="mt-3">
          <button onClick={handleUpload} className="btn btn-success">
            Upload PDF
            <i className="fa fa-cloud-arrow-up ml-3"></i>
          </button>
        </div>
        <hr className="mt-5"></hr>

        <div className="btn mt-4" id="result-mesering">
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
                <button className="btn mt-3" id="mesering">
                  Time :{" "}
                  {format(new Date(item.updatedAt), "yyyy-MM-dd HH:mm")}
                </button>
                <button
                  className="btn mt-3"
                  id="mesering-1"
                  style={{ backgroundColor: getStatusColor(item.status), color: "rgb(0, 0, 0)" }}
                >
                  {item.status}
                </button>
                <button
                  onClick={(e) => handleDelete(item)}
                  className="col-2 btn mt-3 mt-1 ms-5"
                  id="delete-img"
                >
                  Delete PDF
                  {/* <i className="fa fa-times ml-3"></i> */}
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

      <Modal id="modalStatus" title="" modalSize="modal-lg">
        <div className="row">
          <div className="col-2">
            <div className="text-bold text-center bg-secondary">User EQM</div>
            <input
              value={memberName}
              // onChange={(e) => setNameeqm((e.target.value={nameeqm}))}
              onChange={(e) => setMemberName(e.target.value)}
              className="form-control text-center text-primary"
              name="nameeqm"
            />
          </div>

          <div className="col-2">
            <div className="text-bold text-center bg-secondary">Date</div>
            <input
              value={dateeqm}
              // onChange={(e) => setNameeqm((e.target.value={nameeqm}))}
              onChange={(e) => setDateeqm(e.target.value)}
              className="form-control text-center text-primary"
              name="dateeqm"
            />
          </div>
          <div className="col-2">
            <div className="text-bold text-center bg-secondary">Time</div>
            <input
              value={qc_eqm_afterset_end_time}
              onChange={(e) =>
                setProduct({
                  ...product,
                  qc_eqm_afterset_end_time: e.target.value,
                })
              }
              className="form-control text-center text-primary"
              name="qc_eqm_afterset_end_time"
            />
          </div>

          <div className="col-12 mt-2 mb-3" id="tool-qc-confirm">
            <h3 className="h3">
              <b className="ml-3">QC Equipment confirm</b>
            </h3>
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center " id="box-1">
              Contour
            </div>
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="box-1">
              Sulfcom
            </div>
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="box-1">
              Roncom
            </div>
          </div>
          <div className="col-2 mt-2">
            <div className="text-bold text-center" id="box-1">
              Talysurf
            </div>
          </div>
          <div className="col-4"></div>
          <div className="col-2">
            <input
              value={product.contour}
              disabled
              className="form-control text-center"
            />
          </div>

          <div className="col-2 ">
            <input
              value={product.sulfcom}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-2 ">
            <input
              value={product.roncom}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-2">
            <input
              value={product.talysurf}
              disabled
              className="form-control text-center"
            />
          </div>
          <div className="col-4 mt-3"></div>

          <div className="col-3 mt-5">
            <div className="text-center bg-success pl-2">Confirm Status</div>
            <input
              onChange={(e) =>
                setProduct({ ...product, barcode: e.target.value })
              }
              className="form-control"
              id="statusForProduct"
              list="data_pass"
              type="text"
              placeholder="Select....."
            />
            <datalist id="data_pass">
              <option>Pass</option>
            </datalist>
          </div>
          <div className="col-9"></div>

          <div className="col-6">
            <button
              className="btn btn-success mb-4 mt-3"
              onClick={handleSaveStatusToProduct}
              type="button"
            >
              Choot Status
            </button>
          </div>

          <hr className="mt-2 mb-3"></hr>
        </div>
      </Modal>

      <ModalQCInprocessShaft id="modalCancelRecord" title="" modalSize="modal-lg">
        <div className="col-12 mt-3">
          <div className="form-group clearfix">
            <div className="d-flex flex-column">
              <div className="h1 text-center bg-danger pl-2 mb-5">
                Cancel Record
              </div>
              <div className="d-flex mt-3">
                <input
                  onChange={(e) =>
                    setProduct({ ...product, barcode: e.target.value })
                  }
                  className="col-4 form-control mr-2"
                  name="statusForReject"
                  id="statusForReject"
                  list="data155"
                  type="text"
                  placeholder="กรุณาเลือก.........."
                />
                <datalist id="data155">
                  <option>Reject</option>
                </datalist>
                <input
                  onChange={(e) =>
                    setProduct({ ...product, remark: e.target.value })
                  }
                  name="remarkForReject"
                  className="form-control"
                  id="remarkForReject"
                  type="text"
                  placeholder="สาเหตุ..........."
                />
              </div>
            </div>
            <button
              onClick={handleSaveCancelReject}
              className="col-3 btn btn-success mt-3 fw-bold"
              type="button"
            >
              <span className="h4">SAVE</span>
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger mb-3 ml-1"
            onClick={closeModalCancelRecord}
            id="modal-close"
          >
            Close
          </button>
        </div>

      </ModalQCInprocessShaft>

      {/*----------- Start Modal Contour condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      <ModalSelectTool id="modalSelectToolNg" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Target Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-target-${key}`}
                        value={key}
                        checked={selectedTargetSpec.includes(key)}
                        onChange={() => handleCheckboxChange(key, "target")}
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-target-${key}`}
                      >
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <h3 className="h3 drawingspec">
          <b className="ml-3">Drawing Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตัดวงเล็บออกจาก value ก่อนแสดงผล
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-drawing-${key}`}
                        value={key}
                        checked={selectedDrawingSpec.includes(key)}
                        onChange={() => handleCheckboxChange(key, "drawing")}
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-drawing-${key}`}
                      >
                        {key.toUpperCase()} {/* ตัดวงเล็บออกจากค่า */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="col-10">
          <button className="btn btn-primary mb-3" onClick={handleOkClick}>
            Ok
          </button>
        </div>
        <hr />

        <button className="btn btn-danger" onClick={closeModal2}>
          Close
        </button>
      </ModalSelectTool>

      <ModalSelectTool id="modalContourOverTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Over Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Over-${key}`}
                        value={key}
                        checked={selectedOverTarget.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeContourOver(key, "Over")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Over-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickContourOverTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalContourOverTarget}
        >
          Close
        </button>
      </ModalSelectTool>
      <ModalSelectTool id="modalContourUnderTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Under Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Under-${key}`}
                        value={key}
                        checked={selectedUnderTarget.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeContourUnder(key, "Under")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Under-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickContourUnderTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalContourUnderTarget}
        >
          Close
        </button>
      </ModalSelectTool>

      {/*----------- End Modal Contour condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      {/*----------- Start Modal Sulfcom condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      <ModalSelectTool id="modalSelectToolNgSulfcom" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Target Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-target-${key}`}
                        value={key}
                        checked={selectedTargetSpecSulfcom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeSulfcom(key, "target")
                        }
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-target-${key}`}
                      >
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <h3 className="h3 drawingspec">
          <b className="ml-3">Drawing Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตัดวงเล็บออกจาก value ก่อนแสดงผล
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-drawing-${key}`}
                        value={key}
                        checked={selectedDrawingSpecSulfcom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeSulfcom(key, "drawing")
                        }
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-drawing-${key}`}
                      >
                        {key.toUpperCase()} {/* ตัดวงเล็บออกจากค่า */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickSulfcom}
          >
            Ok
          </button>
        </div>
        <hr />

        <button className="btn btn-danger" onClick={closeModalSulfcom}>
          Close
        </button>
      </ModalSelectTool>

      <ModalSelectTool id="modalSulfcomOverTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Over Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Over-${key}`}
                        value={key}
                        checked={selectedOverTargetSulfcom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeSulfcomOver(key, "Over")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Over-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickSulfcomOverTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalSulfcomOverTarget}
        >
          Close
        </button>
      </ModalSelectTool>
      <ModalSelectTool id="modalSulfcomUnderTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Under Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Under-${key}`}
                        value={key}
                        checked={selectedUnderTargetSulfcom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeSulfcomUnder(key, "Under")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Under-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickSulfcomUnderTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalSulfcomUnderTarget}
        >
          Close
        </button>
      </ModalSelectTool>

      {/*----------- End Modal Sulfcom condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      {/*----------- Start Modal Rondcom condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      <ModalSelectTool id="modalSelectToolNgRoncom" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Target Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-target-${key}`}
                        value={key}
                        checked={selectedTargetSpecRoncom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeRoncom(key, "target")
                        }
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-target-${key}`}
                      >
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <h3 className="h3 drawingspec">
          <b className="ml-3">Drawing Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตัดวงเล็บออกจาก value ก่อนแสดงผล
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-drawing-${key}`}
                        value={key}
                        checked={selectedDrawingSpecRoncom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeRoncom(key, "drawing")
                        }
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-drawing-${key}`}
                      >
                        {key.toUpperCase()} {/* ตัดวงเล็บออกจากค่า */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickRoncom}
          >
            Ok
          </button>
        </div>
        <hr />

        <button className="btn btn-danger" onClick={closeModalRoncom}>
          Close
        </button>
      </ModalSelectTool>

      <ModalSelectTool id="modalRoncomOverTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Over Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Over-${key}`}
                        value={key}
                        checked={selectedOverTargetRoncom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeRoncomOver(key, "Over")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Over-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickRoncomOverTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button className="btn btn-danger" onClick={closeModalRoncomOverTarget}>
          Close
        </button>
      </ModalSelectTool>
      <ModalSelectTool id="modalRoncomUnderTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Under Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Under-${key}`}
                        value={key}
                        checked={selectedUnderTargetRoncom.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeRoncomUnder(key, "Under")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Under-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickRoncomUnderTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalRoncomUnderTarget}
        >
          Close
        </button>
      </ModalSelectTool>

      {/*----------- End Modal Rondcom condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      {/*----------- Start Modal Rondcom condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      <ModalSelectTool id="ToolNgTalysurf" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Target Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-target-${key}`}
                        value={key}
                        checked={selectedTargetSpecTalysurf.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeTalysurf(key, "target")
                        }
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-target-${key}`}
                      >
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <h3 className="h3 drawingspec">
          <b className="ml-3">Drawing Spec</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตัดวงเล็บออกจาก value ก่อนแสดงผล
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-drawing-${key}`}
                        value={key}
                        checked={selectedDrawingSpecTalysurf.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeTalysurf(key, "drawing")
                        }
                      />
                      <label
                        className="ml-2"
                        htmlFor={`checkbox-drawing-${key}`}
                      >
                        {key.toUpperCase()} {/* ตัดวงเล็บออกจากค่า */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickTalysurf}
          >
            Ok
          </button>
        </div>
        <hr />

        <button className="btn btn-danger" onClick={closeModalTalysurf}>
          Close
        </button>
      </ModalSelectTool>

      <ModalSelectTool id="modalTalysurfOverTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Over Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Over-${key}`}
                        value={key}
                        checked={selectedOverTargetTalysurf.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeTalysurfOver(key, "Over")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Over-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickTalysurfOverTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalTalysurfOverTarget}
        >
          Close
        </button>
      </ModalSelectTool>
      <ModalSelectTool id="modalTalysurfUnderTarget" modalSize="modal-lg">
        <h3 className="h3 targetspec">
          <b className="ml-3">Under Target</b>
        </h3>
        <div className="row">
          {Object.entries(product).map(([key, value], index) => {
            // ตรวจสอบเฉพาะคีย์ที่ขึ้นต้นด้วย "t" และตัดวงเล็บออกจาก value
            if (/^t\d+$/.test(key) && value) {
              return (
                <div className="col-2" key={index}>
                  <div className="form-group clearfix">
                    <div className="d-inline">
                      <input
                        type="checkbox"
                        id={`checkbox-Under-${key}`}
                        value={key}
                        checked={selectedUnderTargetTalysurf.includes(key)}
                        onChange={() =>
                          handleCheckboxChangeTalysurfUnder(key, "Under")
                        }
                      />
                      <label className="ml-2" htmlFor={`checkbox-Under-${key}`}>
                        {key.toUpperCase()} {/* แสดงค่า key เช่น T7 */}
                      </label>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="col-10">
          <button
            className="btn btn-primary mb-3"
            onClick={handleOkClickTalysurfUnderTarget}
          >
            Ok
          </button>
        </div>
        <hr />

        <button
          className="btn btn-danger"
          onClick={closeModalTalysurfUnderTarget}
        >
          Close
        </button>
      </ModalSelectTool>

      {/*----------- End Modal Talysurf condition OK , NG(Drawing) Max , Min , Over target , Under target --------------  */}

      {/*------ Start Modal show AF ---------------------------------------------------------*/}
      <ModalQCEqmAfter id="modalShowAF" title="" modalSize="modal-dialog-custom-xlAF">
        <div className="col-12 mb-1" id="tool-qc-confirm">
          <h3 className="h3">
            <b className="ml-3">QC Equipment confirm After set</b>
          </h3>
        </div>
        <div className="col-12 mt-1">
          <div className="form-group clearfix" id="afterset-change-tool">
            <div className="d-flex flex-column">
              <div style={{ fontSize: "1.3rem" }} className="fw-bold">{product.machine} , Name : A/F No. </div>
              <div className="d-flex">
                <input
                  value={product.timeafterset}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "6.0rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.afterset}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <select
                  id="AfterSet_1"
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
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  value={product.afterset_eqm || ""}
                  onChange={(e) =>
                    setProduct({ ...product, afterset_eqm: e.target.value })
                  }
                >
                  <option value="">-- Status --</option>
                  <option value="OK">OK</option>
                  <option value="NG(Drawing)">NG(Drawing)</option>
                  <option value="Max">Max</option>
                  <option value="Min">Min</option>
                  <option value="Over target">Over target</option>
                  <option value="Under target">Under target</option>
                </select>
                <input
                  value="QC"
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset_eqm}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.timeafterset_eqm}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5.5rem" }}
                  disabled
                />
                {/* {!(product.afterset_eqm && product.timeafterset_eqm) && ( */}
                <button
                  type="button"
                  className="btn btn-success ml-2"
                  style={{ height: "2.5rem", width: "8.0rem" }}
                  onClick={handleSaveAfterSet_1_Production}
                >
                  Save AF1
                </button>
                {/* )} */}
              </div>

              <div className="d-flex mt-1">
                <input
                  value={product.timeafterset2}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "6.0rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset2}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.afterset2}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <select
                  id="AfterSet_2"
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
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  value={product.afterset_eqm2 || ""}
                  onChange={(e) =>
                    setProduct({ ...product, afterset_eqm2: e.target.value })
                  }
                >
                  <option value="">-- Status --</option>
                  <option value="OK">OK</option>
                  <option value="NG(Drawing)">NG(Drawing)</option>
                  <option value="Max">Max</option>
                  <option value="Min">Min</option>
                  <option value="Over target">Over target</option>
                  <option value="Under target">Under target</option>
                </select>
                <input
                  value="QC"
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset_eqm2}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.timeafterset_eqm2}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5.5rem" }}
                  disabled
                />
                {/* {!(product.afterset_eqm2 && product.timeafterset_eqm2) && ( */}
                <button
                  type="button"
                  className="btn btn-success ml-2"
                  style={{ height: "2.5rem", width: "8.0rem" }}
                  onClick={handleSaveAfterSet_2_Production}
                > Save AF2
                </button>
                {/* )} */}
              </div>
              <div className="d-flex mt-1">
                <input
                  value={product.timeafterset3}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "6.0rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset3}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.afterset3}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <select
                  id="AfterSet_3"
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
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  value={product.afterset_eqm3 || ""}
                  onChange={(e) =>
                    setProduct({ ...product, afterset_eqm3: e.target.value })
                  }
                >
                  <option value="">-- Status --</option>
                  <option value="OK">OK</option>
                  <option value="NG(Drawing)">NG(Drawing)</option>
                  <option value="Max">Max</option>
                  <option value="Min">Min</option>
                  <option value="Over target">Over target</option>
                  <option value="Under target">Under target</option>
                </select>
                <input
                  value="QC"
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset_eqm3}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.timeafterset_eqm3}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5.5rem" }}
                  disabled
                />
                {/* {!(product.afterset_eqm3 && product.timeafterset_eqm3) && ( */}
                <button
                  type="button"
                  className="btn btn-success ml-2"
                  style={{ height: "2.5rem", width: "8.0rem" }}
                  onClick={handleSaveAfterSet_3_Production}
                > Save AF3
                </button>
                {/* )} */}
              </div>
              <div className="d-flex mt-1">
                <input
                  value={product.timeafterset4}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "6.0rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset4}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.afterset4}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <select
                  id="AfterSet_4"
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
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  value={product.afterset_eqm4 || ""}
                  onChange={(e) =>
                    setProduct({ ...product, afterset_eqm4: e.target.value })
                  }
                >
                  <option value="">-- Status --</option>
                  <option value="OK">OK</option>
                  <option value="NG(Drawing)">NG(Drawing)</option>
                  <option value="Max">Max</option>
                  <option value="Min">Min</option>
                  <option value="Over target">Over target</option>
                  <option value="Under target">Under target</option>
                </select>
                <input
                  value="QC"
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset_eqm4}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.timeafterset_eqm4}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5.5rem" }}
                  disabled
                />
                {/* {!(product.afterset_eqm4 && product.timeafterset_eqm4) && ( */}
                <button
                  type="button"
                  className="btn btn-success ml-2"
                  style={{ height: "2.5rem", width: "8.0rem" }}
                  onClick={handleSaveAfterSet_4_Production}
                > Save AF4
                </button>
                {/* )} */}
              </div>
              <div className="d-flex mt-1">
                <input
                  value={product.timeafterset5}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "6.0rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset5}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.afterset5}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <select
                  id="AfterSet_5"
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
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  value={product.afterset_eqm5 || ""}
                  onChange={(e) =>
                    setProduct({ ...product, afterset_eqm5: e.target.value })
                  }
                >
                  <option value="">-- Status --</option>
                  <option value="OK">OK</option>
                  <option value="NG(Drawing)">NG(Drawing)</option>
                  <option value="Max">Max</option>
                  <option value="Min">Min</option>
                  <option value="Over target">Over target</option>
                  <option value="Under target">Under target</option>
                </select>
                <input
                  value="QC"
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5rem" }}
                  disabled
                />
                <input
                  value={product.nameafterset_eqm5}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "10.0rem" }}
                  disabled
                />
                <input
                  value={product.timeafterset_eqm5}
                  className="form-control text-primary fw-bold"
                  style={{ height: "2.5rem", width: "5.5rem" }}
                  disabled
                />
                {/* {!(product.afterset_eqm5 && product.timeafterset_eqm5) && ( */}
                <button
                  type="button"
                  className="btn btn-success ml-2"
                  style={{ height: "2.5rem", width: "8.0rem" }}
                  onClick={handleSaveAfterSet_5_Production}
                > Save AF5
                </button>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </ModalQCEqmAfter>
      {/*------ End Modal show AF ---------------------------------------------------------*/}

    </>
  );
}
export default ToolNumberQCShaftTCH;
