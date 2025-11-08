import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; // Import ไลบรารี xlsx
import "./setting.css";
import { AiFillFileExcel } from "react-icons/ai"; // นำเข้าไอคอน Excel
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

function HistoryImagesForQc() {
    const [products, setProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [machines, setMachines] = useState(""); // สร้าง state เพื่อเก็บข้อมูลเครื่อง



    useEffect(() => {
        getMachines();
    }, []);

    const getMachines = async () => {
        try {
            const response = await axios.get(config.api_path + "/getDataMC");
            setMachines(response.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };

    const fetchDataSearch = async () => {
        try {
            if (!startDate || !endDate) {
                Swal.fire({
                    title: "CONFIRM",
                    text: "กรุณาใส่วันที่เริ่มและวันที่สิ้นสุด",
                    icon: "warning",
                });
                return;
            }

            const response = await axios.post(
                config.api_path + "/product/listRecordNew",
                { startDate, endDate },
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

            setProducts(response.data.results); // ตั้งค่า products เป็นข้อมูลที่ดึงมา
            Swal.fire({
                title: "Success",
                text: "ค้นหาข้อมูลที่ต้องการสำเร็จ",
                icon: "success",
                timer: 1000
            });
        } catch (e) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const downloadExcel = () => {
        // หัวตารางที่ต้องการ โดยย้าย Tool No. t1 ถึง t42 ไว้หลัง Process
        const headers = [
            "Barcode", "Date", "Name", "Shift", "Machine", "Model", "Process", "Tool change case",
            // คอลัมน์ Tool No. t1 ถึง t42 จะมาอยู่ตรงนี้
            ...Array.from({ length: 42 }, (_, i) => `Tool No. T${i + 1}`),
            "Oil", "Air", "Pusher", "Stoppet", "Part set up", // เพิ่มหัวตารางใหม่
            "Neme QC By off", "Date QC By off", "Time QC By off", // เพิ่มหัวตารางใหม่
            "Remark", "AF",
            "Name After set", "Date After set", "Time After set", // เพิ่มหัวตารางใหม่
            "Contour",
            "Contour Ng Target Spec", "Contour Ng Drawing Spec", "Contour Over Target", "Contour Under Target",
            "Sulfcom",
            "Sulfcom Ng Target Spec", "Sulfcom Ng Drawing Spec", "Sulfcom Over Target", "Sulfcom Under Target",
            "Roncom",
            "Roncom Ng Target Spec", "Roncom Ng Drawing Spec", "Roncom Over Target", "Roncom Under Target",
            "Talysurf",
            "Talysurf Ng Target Spec", "Talysurf Ng Drawing Spec", "Talysurf Over Target", "Talysurf Under Target",
            "Projector Status", "Projector Ng Spec 1", "Projector Ng Spec 2", "Projector Ng Spec 3",
            "Projector Ng Spec 4", "Projector Ng Spec 5",
            // ย้าย Name QC Projector Check, Date QC Projector Check, Time QC Projector Check มาหลังจาก Projector Ng Spec 5
            "Name QC Projector Check", "Date QC Projector Check", "Time QC Projector Check",
            "Image Names", "Time Start", "Name QC Check", "Mesering Type", "Setter AF By Type" ,"Time Check", "End Time", "End Date"
        ];

        // ตรวจสอบว่า products มีข้อมูลหรือไม่
        if (!products || products.length === 0) {
            Swal.fire({
                title: "Error",
                text: "ไม่มีข้อมูลที่จะส่งออก",
                icon: "error",
            });
            return;
        }

        // การแมปข้อมูลลงใน excelData
        let excelData = products.flatMap((item) =>
            item.productImages && item.productImages.length > 0
                ? item.productImages.map((img) => ({
                    Barcode: item.barcode || "-",
                    Date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-", // แสดงเวลาที่แปลงจาก createdAt
                    Name: item.name || "-",
                    Shift: item.shift || "-",
                    Machine: item.machine || "-",
                    Model: item.model || "-",
                    Process: item.process || "-",
                    "Tool change case": item.tool_change_case || "-",

                    // แมปข้อมูล Tool No. t1 ถึง t42
                    "Tool No. T1": item.t1 || "-",
                    "Tool No. T2": item.t2 || "-",
                    "Tool No. T3": item.t3 || "-",
                    "Tool No. T4": item.t4 || "-",
                    "Tool No. T5": item.t5 || "-",
                    "Tool No. T6": item.t6 || "-",
                    "Tool No. T7": item.t7 || "-",
                    "Tool No. T8": item.t8 || "-",
                    "Tool No. T9": item.t9 || "-",
                    "Tool No. T10": item.t10 || "-",
                    "Tool No. T11": item.t11 || "-",
                    "Tool No. T12": item.t12 || "-",
                    "Tool No. T13": item.t13 || "-",
                    "Tool No. T14": item.t14 || "-",
                    "Tool No. T15": item.t15 || "-",
                    "Tool No. T16": item.t16 || "-",
                    "Tool No. T17": item.t17 || "-",
                    "Tool No. T18": item.t18 || "-",
                    "Tool No. T19": item.t19 || "-",
                    "Tool No. T20": item.t20 || "-",
                    "Tool No. T21": item.t21 || "-",
                    "Tool No. T22": item.t22 || "-",
                    "Tool No. T23": item.t23 || "-",
                    "Tool No. T24": item.t24 || "-",
                    "Tool No. T25": item.t25 || "-",
                    "Tool No. T26": item.t26 || "-",
                    "Tool No. T27": item.t27 || "-",
                    "Tool No. T28": item.t28 || "-",
                    "Tool No. T29": item.t29 || "-",
                    "Tool No. T30": item.t30 || "-",
                    "Tool No. T31": item.t31 || "-",
                    "Tool No. T32": item.t32 || "-",
                    "Tool No. T33": item.t33 || "-",
                    "Tool No. T34": item.t34 || "-",
                    "Tool No. T35": item.t35 || "-",
                    "Tool No. T36": item.t36 || "-",
                    "Tool No. T37": item.t37 || "-",
                    "Tool No. T38": item.t38 || "-",
                    "Tool No. T39": item.t39 || "-",
                    "Tool No. T40": item.t40 || "-",
                    "Tool No. T41": item.t41 || "-",
                    "Tool No. T42": item.t42 || "-",
                    // แมปข้อมูลใหม่ที่เพิ่มเข้ามา
                    Oil: item.oil || "-",
                    Air: item.air || "-",
                    Pusher: item.pusher || "-",
                    Stoppet: item.stopper || "-",
                    "Part set up": item.part_set_up || "-",
                    "Neme QC By off": item.name_qc_by_off || "-",
                    "Date QC By off": item.date_qc_by_off ? item.date_qc_by_off.replace("T", " ").substring(0, 10) : "-",
                    "Time QC By off": item.time_qc_by_off || "-",
                    Remark: item.remark || "-",
                  
                    AF: item.afterset || "-",
                    "Name After set": item.nameafterset || "-",
                    "Date After set": item.dateafterset ? item.dateafterset.replace("T", " ").substring(0, 10) : "-",
                    "Time After set": item.timeafterset || "-",
                    Contour: item.contour || "-",
                    "Contour Ng Target Spec": item.contour_ng_target_spec || "-",
                    "Contour Ng Drawing Spec": item.contour_ng_drawing_spec || "-",
                    "Contour Over Target": item.contour_over_target || "-",
                    "Contour Under Target": item.contour_under_target || "-",
                    Sulfcom: item.sulfcom || "-",
                    "Sulfcom Ng Target Spec": item.sulfcom_ng_target_spec || "-",
                    "Sulfcom Ng Drawing Spec": item.sulfcom_ng_drawing_spec || "-",
                    "Sulfcom Over Target": item.sulfcom_over_target || "-",
                    "Sulfcom Under Target": item.sulfcom_under_target || "-",
                    Roncom: item.roncom || "-",
                    "Roncom Ng Target Spec": item.roncom_ng_target_spec || "-",
                    "Roncom Ng Drawing Spec": item.roncom_ng_drawing_spec || "-",
                    "Roncom Over Target": item.roncom_over_target || "-",
                    "Roncom Under Target": item.roncom_under_target || "-",
                    Talysurf: item.talysurf || "-",
                    "Talysurf Ng Target Spec": item.talysurf_ng_target_spec || "-",
                    "Talysurf Ng Drawing Spec": item.talysurf_ng_drawing_spec || "-",
                    "Talysurf Over Target": item.talysurf_over_target || "-",
                    "Talysurf Under Target": item.talysurf_under_target || "-",
                    "Projector Status": item.projector_status || "-",
                    "Projector Ng Spec 1": item.projector_ng_spec_1 || "-",
                    "Projector Ng Spec 2": item.projector_ng_spec_2 || "-",
                    "Projector Ng Spec 3": item.projector_ng_spec_3 || "-",
                    "Projector Ng Spec 4": item.projector_ng_spec_4 || "-",
                    "Projector Ng Spec 5": item.projector_ng_spec_5 || "-",
                    "Name QC Projector Check": item.name_qc_projector_check || "-",
                    "Date QC Projector Check": item.date_qc_projector_check ? item.date_qc_projector_check.replace("T", " ").substring(0, 10) : "-",
                    "Time QC Projector Check": item.time_qc_projector_check || "-",
                    "Image Names": img.imageName
                    ? `=HYPERLINK("${config.api_path}/uploads/${img.imageName}", "${img.imageName}")`
                    : "No Images",
                    "Time Start": item.qc_eqm_start_time || "-",
                    "Name QC Check": img.nameeqm || "-",
                    "Mesering Type": img.mesering || "-",
                    "Setter AF By Type": img.nameafterset || "-",
                    "Time Check": img.timeeqm || "-",
                    "End Time": item.qc_eqm_afterset_end_time || "-",
                    "End Date": item.barcode === "Pass"
                        ? item.updatedAt.replace("T", " ").substring(0, 10) || "-"
                        : "-"
                }))
                : [
                    {
                        Barcode: item.barcode || "-",
                        Date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', { hour12: false }) : "-", // แสดงเวลาที่แปลงจาก createdAt
                        Name: item.name || "-",
                        Shift: item.shift || "-",
                        Machine: item.machine || "-",
                        Model: item.model || "-",
                        Process: item.process || "-",
                        "Tool change case": item.tool_change_case || "-",

                        // แมปข้อมูล Tool No. t1 ถึง t42
                        "Tool No. T1": item.t1 || "-",
                        "Tool No. T2": item.t2 || "-",
                        "Tool No. T3": item.t3 || "-",
                        "Tool No. T4": item.t4 || "-",
                        "Tool No. T5": item.t5 || "-",
                        "Tool No. T6": item.t6 || "-",
                        "Tool No. T7": item.t7 || "-",
                        "Tool No. T8": item.t8 || "-",
                        "Tool No. T9": item.t9 || "-",
                        "Tool No. T10": item.t10 || "-",
                        "Tool No. T11": item.t11 || "-",
                        "Tool No. T12": item.t12 || "-",
                        "Tool No. T13": item.t13 || "-",
                        "Tool No. T14": item.t14 || "-",
                        "Tool No. T15": item.t15 || "-",
                        "Tool No. T16": item.t16 || "-",
                        "Tool No. T17": item.t17 || "-",
                        "Tool No. T18": item.t18 || "-",
                        "Tool No. T19": item.t19 || "-",
                        "Tool No. T20": item.t20 || "-",
                        "Tool No. T21": item.t21 || "-",
                        "Tool No. T22": item.t22 || "-",
                        "Tool No. T23": item.t23 || "-",
                        "Tool No. T24": item.t24 || "-",
                        "Tool No. T25": item.t25 || "-",
                        "Tool No. T26": item.t26 || "-",
                        "Tool No. T27": item.t27 || "-",
                        "Tool No. T28": item.t28 || "-",
                        "Tool No. T29": item.t29 || "-",
                        "Tool No. T30": item.t30 || "-",
                        "Tool No. T31": item.t31 || "-",
                        "Tool No. T32": item.t32 || "-",
                        "Tool No. T33": item.t33 || "-",
                        "Tool No. T34": item.t34 || "-",
                        "Tool No. T35": item.t35 || "-",
                        "Tool No. T36": item.t36 || "-",
                        "Tool No. T37": item.t37 || "-",
                        "Tool No. T38": item.t38 || "-",
                        "Tool No. T39": item.t39 || "-",
                        "Tool No. T40": item.t40 || "-",
                        "Tool No. T41": item.t41 || "-",
                        "Tool No. T42": item.t42 || "-",
                        // แมปข้อมูลใหม่ที่เพิ่มเข้ามา
                        Oil: item.oil || "-",
                        Air: item.air || "-",
                        Pusher: item.pusher || "-",
                        Stoppet: item.stopper || "-",
                        "Part set up": item.part_set_up || "-",
                        "Neme QC By off": item.name_qc_by_off || "-",
                        "Date QC By off": item.date_qc_by_off ? item.date_qc_by_off.replace("T", " ").substring(0, 10) : "-",
                        "Time QC By off": item.time_qc_by_off || "-",
                        Remark: item.remark || "-",
                      
                        AF: item.afterset || "-",
                        "Name After set": item.nameafterset || "-",
                        "Date After set": item.dateafterset ? item.dateafterset.replace("T", " ").substring(0, 10) : "-",
                        "Time After set": item.timeafterset || "-",
                        Contour: item.contour || "-",
                        "Contour Ng Target Spec": item.contour_ng_target_spec || "-",
                        "Contour Ng Drawing Spec": item.contour_ng_drawing_spec || "-",
                        "Contour Over Target": item.contour_over_target || "-",
                        "Contour Under Target": item.contour_under_target || "-",
                        Sulfcom: item.sulfcom || "-",
                        "Sulfcom Ng Target Spec": item.sulfcom_ng_target_spec || "-",
                        "Sulfcom Ng Drawing Spec": item.sulfcom_ng_drawing_spec || "-",
                        "Sulfcom Over Target": item.sulfcom_over_target || "-",
                        "Sulfcom Under Target": item.sulfcom_under_target || "-",
                        Roncom: item.roncom || "-",
                        "Roncom Ng Target Spec": item.roncom_ng_target_spec || "-",
                        "Roncom Ng Drawing Spec": item.roncom_ng_drawing_spec || "-",
                        "Roncom Over Target": item.roncom_over_target || "-",
                        "Roncom Under Target": item.roncom_under_target || "-",
                        Talysurf: item.talysurf || "-",
                        "Talysurf Ng Target Spec": item.talysurf_ng_target_spec || "-",
                        "Talysurf Ng Drawing Spec": item.talysurf_ng_drawing_spec || "-",
                        "Talysurf Over Target": item.talysurf_over_target || "-",
                        "Talysurf Under Target": item.talysurf_under_target || "-",
                        "Projector Status": item.projector_status || "-",
                        "Projector Ng Spec 1": item.projector_ng_spec_1 || "-",
                        "Projector Ng Spec 2": item.projector_ng_spec_2 || "-",
                        "Projector Ng Spec 3": item.projector_ng_spec_3 || "-",
                        "Projector Ng Spec 4": item.projector_ng_spec_4 || "-",
                        "Projector Ng Spec 5": item.projector_ng_spec_5 || "-",
                        "Name QC Projector Check": item.name_qc_projector_check || "-",
                        "Date QC Projector Check": item.date_qc_projector_check ? item.date_qc_projector_check.replace("T", " ").substring(0, 10) : "-",
                        "Time QC Projector Check": item.time_qc_projector_check || "-",
                        "Image Names": "No Images",
                        "Time Start": item.qc_eqm_start_time || "-",
                        "Name QC Check": item.nameeqm || "-",
                        "Mesering Type": item.mesering || "-",
                        "Setter AF By Type": item.nameafterset || "-",
                        "Time Check": item.timeeqm || "-",
                        "End Time": item.qc_eqm_afterset_end_time || "-",
                        "End Date": item.barcode === "Pass"
                            ? item.updatedAt.replace("T", " ").substring(0, 10) || "-"
                            : "-"
                    }
                ]
        );

        // สร้างไฟล์ Excel
        const worksheet = XLSX.utils.json_to_sheet(excelData, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Record change Tool");

        XLSX.writeFile(workbook, "products_with_links.xlsx");
    };



    const clearData = () => {
        window.location.reload();
    };

    return (
        <>
            {console.log(products)}{" "}
            {/* ใส่ console.log ตรงนี้เพื่อดูข้อมูลทุกครั้งที่มีการ re-render */}
            <div className="m-4 border rounded border-primary p-2 bg-secondary">
                <h1 className="text-center text-bold">RECORD CHANGE TOOL</h1>
            </div>
            <div className="m-4 border rounded border-primary p-4">
                <div className="row">
                    <div className="col-3">
                        <div className="text-bold ml-2">START DATE</div>
                        <input
                            type="date"
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-3">
                        <div className="text-bold ml-2">END DATE</div>
                        <input
                            type="date"
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    {/* <div className="col-3">
                        <div className="text-bold ml-2">Machine</div>
                        <Select
                            options={
                                machines && machines.result
                                    ? machines.result.map((item) => ({
                                        value: item.Machine_Number,
                                        label: item.Machine_Number,
                                    }))
                                    : []
                            }
                            onChange={(selectedOption) => {
                                setSelectedOption(selectedOption);
                            }}
                        />
                    </div> */}
                </div>

                <div className="col-6 mt-4">
                    <button
                        type="button"
                        className="btn btn-primary mr-3"
                        id="search"
                        onClick={fetchDataSearch}
                    >
                        <SearchIcon />
                        SEARCH
                    </button>
                    <button
                        onClick={clearData}
                        className="btn btn-danger ml-3"
                        id="clear"
                    >
                        CLEAR
                        <RotateLeftIcon
                            className="ml-1"
                        />
                    </button>
                    <button
                        onClick={downloadExcel}
                        className="btn btn-success ml-5" // เปลี่ยนเป็นสีเขียว
                        id="export"
                    >
                        <AiFillFileExcel style={{ marginRight: "5px" }} /> {/* เพิ่มไอคอน Excel */}
                        EXPORT TO EXCEL
                    </button>
                </div>
            </div>
            <div className="">
                <Link to='/settingsForQc'>
                    <button
                        type="button"
                        className="btn btn-danger ml-4"
                    >
                        <UndoIcon />
                        BACK
                    </button>
                </Link>
            </div>
            <table className="mt-3 table table-bordered table-striped">
                <thead className="" id="table-product-history">
                    <tr>
                        <th className="text-white">Barcode</th>
                        <th className="text-white">Date</th>
                        <th className="text-white">Name</th>
                        <th className="text-white">Shift</th>
                        <th className="text-white">Machine</th>
                        <th className="text-white">Model</th>
                        <th className="text-white">Process</th>
                        <th className="text-white">Tool No.</th>
                        <th className="text-white">Remark</th>
                        <th className="text-white">AF</th>
                        <th className="text-white">Setter After</th>
                        <th className="text-center text-white">Contour</th>
                        <th className="text-center text-white">Sulfcom</th>
                        <th className="text-center text-white">Roncom</th>
                        <th className="text-center text-white">Talysurf</th>
                        <th className="text-center text-white">Images</th>{" "}
                        <th className="text-white">Time Start</th>
                        <th className="text-white">Name QC Check</th>
                        <th className="text-white">Mesering Type</th>
                        <th className="text-white">Time Check</th>
                        <th className="text-white">Setter AF Set</th>
                        <th className="text-white">End Time</th>
                        <th className="text-white">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0
                        ? products.map((item) =>
                            item.productImages && item.productImages.length > 0 ? (
                                item.productImages.map((img, index) => (
                                    <tr key={`${item.id}-${index}`}>
                                        <td
                                            className={`
            ${item.barcode === "Pass" ? "bg-success" : ""}
            ${item.barcode === "Cancel" ? "bg-danger" : ""}
            ${item.barcode === "Reject" ? "bg-danger" : ""}
          `}
                                        >
                                            {item.barcode}
                                        </td>
                                        <td>

                                        {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', {
                                                timeZone: 'Asia/Bangkok', // Ensure time is in the Bangkok timezone
                                                hour12: false
                                            }) : "-"}

                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.shift}</td>
                                        <td>{item.machine}</td>
                                        <td>{item.model}</td>
                                        <td>{item.process}</td>
                                        <td>
                                            {item.t1}-{item.t2}-{item.t3}-{item.t4}-{item.t5}-
                                            {item.t6}-{item.t7}-{item.t8}-{item.t9}-{item.t10}-
                                            {item.t11}-{item.t12}-{item.t13}-{item.t14}-{item.t15}-
                                            {item.t16}-{item.t17}-{item.t18}-{item.t19}-{item.t20}-
                                            {item.t21}-{item.t22}-{item.t23}-{item.t24}-{item.t25}-
                                            {item.t26}-{item.t27}-{item.t28}-{item.t29}-{item.t30}-
                                            {item.t31}-{item.t32}-{item.t33}-{item.t34}-{item.t35}-
                                            {item.t36}-{item.t37}-{item.t38}-{item.t39}-{item.t40}-
                                            {item.t41}-{item.t42}
                                        </td>
                                        <td className="text-danger">{item.remark}</td>
                                        <td>{item.afterset}</td>
                                        <td>{item.nameafterset}</td>
                                        <td
                                            className={`${item.contour === "Ok"
                                                ? "bg-success text-center"
                                                : item.contour === "Ng"
                                                    ? "bg-danger text-center"
                                                    : item.contour === "Max" || item.contour === "Min"
                                                        ? "bg-blue text-center"
                                                        : "text-center"
                                                }`}
                                        >
                                            {item.contour} <br />
                                            {item.contour === 'NG' && (
                                                <>
                                                    {item.contour_ng_tool_no} <br />
                                                    {item.contour_ng_detail}
                                                </>
                                            )}

                                        </td>
                                        <td
                                            className={`${item.sulfcom === "Ok"
                                                ? "bg-success text-center"
                                                : item.sulfcom === "Ng"
                                                    ? "bg-danger text-center"
                                                    : item.sulfcom === "Max" || item.sulfcom === "Min"
                                                        ? "bg-blue text-center"
                                                        : "text-center"
                                                }`}
                                        >
                                            {item.sulfcom}
                                        </td>
                                        <td
                                            className={`${item.roncom === "Ok"
                                                ? "bg-success text-center"
                                                : item.roncom === "Ng"
                                                    ? "bg-danger text-center"
                                                    : item.roncom === "Max" || item.roncom === "Min"
                                                        ? "bg-blue text-center"
                                                        : "text-center"
                                                }`}
                                        >
                                            {item.roncom}
                                        </td>
                                        <td
                                            className={`${item.talysurf === "Ok"
                                                ? "bg-success text-center"
                                                : item.talysurf === "Ng"
                                                    ? "bg-danger text-center"
                                                    : item.talysurf === "Max" || item.talysurf === "Min"
                                                        ? "bg-blue text-center"
                                                        : "text-center"
                                                }`}
                                        >
                                            {item.talysurf}
                                        </td>
                                        <td>{img.imageName}</td> {/* ใช้ img ที่นี่ */}
                                        <td>{item.qc_eqm_start_time}</td>
                                        <td>{img.nameeqm}</td> {/* ใช้ img ที่นี่ */}
                                        <td>{img.mesering}</td> {/* ใช้ img ที่นี่ */}
                                        <td>{img.timeeqm}</td>
                                        <td>{img.nameafterset}</td>
                                        <td>{item.qc_eqm_afterset_end_time}</td>
                                        <td>
                                            {item.barcode === "Pass"
                                                ? item.updatedAt.replace("T", " ").substring(0, 10)
                                                : ""}
                                        </td>{" "}
                                    </tr>
                                ))
                            ) : (
                                <tr key={item.id}>
                                    <td
                                        className={`
      ${item.barcode === "Pass" ? "bg-success" : ""}
      ${item.barcode === "Cancel" ? "bg-danger" : ""}
      ${item.barcode === "Reject" ? "bg-danger" : ""}
    `}
                                    >
                                        {item.barcode}
                                    </td>
                                    <td>

                                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB', {
                                                timeZone: 'Asia/Bangkok', // Ensure time is in the Bangkok timezone
                                                hour12: false
                                            }) : "-"}

                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.shift}</td>
                                    <td>{item.machine}</td>
                                    <td>{item.model}</td>
                                    <td>{item.process}</td>
                                    <td>
                                        {item.t1}-{item.t2}-{item.t3}-{item.t4}-{item.t5}-
                                        {item.t6}-{item.t7}-{item.t8}-{item.t9}-{item.t10}-
                                        {item.t11}-{item.t12}-{item.t13}-{item.t14}-{item.t15}-
                                        {item.t16}-{item.t17}-{item.t18}-{item.t19}-{item.t20}-
                                        {item.t21}-{item.t22}-{item.t23}-{item.t24}-{item.t25}-
                                        {item.t26}-{item.t27}-{item.t28}-{item.t29}-{item.t30}-
                                        {item.t31}-{item.t32}-{item.t33}-{item.t34}-{item.t35}-
                                        {item.t36}-{item.t37}-{item.t38}-{item.t39}-{item.t40}-
                                        {item.t41}-{item.t42}
                                    </td>
                                    <td className="text-danger">{item.remark}</td>
                                    <td>{item.afterset}</td>
                                    <td>{item.nameafterset}</td>
                                    <td
                                        className={`${item.contour === "Ok"
                                            ? "bg-success text-center"
                                            : item.contour === "Ng"
                                                ? "bg-danger text-center"
                                                : item.contour === "Max" || item.contour === "Min"
                                                    ? "bg-blue text-center"
                                                    : "text-center"
                                            }`}
                                    >
                                        {item.contour}
                                    </td>
                                    <td
                                        className={`${item.sulfcom === "Ok"
                                            ? "bg-success text-center"
                                            : item.sulfcom === "Ng"
                                                ? "bg-danger text-center"
                                                : item.sulfcom === "Max" || item.sulfcom === "Min"
                                                    ? "bg-blue text-center"
                                                    : "text-center"
                                            }`}
                                    >
                                        {item.sulfcom}
                                    </td>
                                    <td
                                        className={`${item.roncom === "Ok"
                                            ? "bg-success text-center"
                                            : item.roncom === "Ng"
                                                ? "bg-danger text-center"
                                                : item.roncom === "Max" || item.roncom === "Min"
                                                    ? "bg-blue text-center"
                                                    : "text-center"
                                            }`}
                                    >
                                        {item.roncom}
                                    </td>
                                    <td
                                        className={`${item.talysurf === "Ok"
                                            ? "bg-success text-center"
                                            : item.talysurf === "Ng"
                                                ? "bg-danger text-center"
                                                : item.talysurf === "Max" || item.talysurf === "Min"
                                                    ? "bg-blue text-center"
                                                    : "text-center"
                                            }`}
                                    >
                                        {item.talysurf}
                                    </td>
                                    <td>No Images</td> {/* ถ้าไม่มีภาพ */}
                                    <td>{item.qc_eqm_start_time}</td>
                                    <td>{item.nameeqm ?? ''}</td>
                                    <td>{item.mesering}</td>
                                    <td>{item.nameafterset}</td>
                                    <td>{item.timeeqm}</td>
                                    <td>{item.qc_eqm_afterset_end_time}</td>
                                    <td>
                                        {item.barcode === "Pass"
                                            ? item.updatedAt.replace("T", " ").substring(0, 10)
                                            : ""}
                                    </td>{" "}
                                    {/* เพิ่มเงื่อนไขที่นี่ */}
                                </tr>
                            )
                        )
                        : ""}
                </tbody>
            </table>
        </>
    );
}

export default HistoryImagesForQc;