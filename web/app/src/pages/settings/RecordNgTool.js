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

function RecordNgTool() {
    const [products, setProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [machines, setMachines] = useState(""); // สร้าง state เพื่อเก็บข้อมูลเครื่อง
    const [machinesShaft, setMachinesShaft] = useState(""); // สร้าง state เพื่อเก็บข้อมูลเครื่อง

    // ช่วยจัดรูปแบบวันที่แบบ YYYY-MM-DD จาก string/Date หรือคืน "-" ถ้าไม่มีค่า
    // ✅ ป้องกัน null เวลาตัดวันที่
    const safeISO10 = (v) => {
        if (!v) return "-";
        const s = typeof v === "string" ? v : (v instanceof Date ? v.toISOString() : String(v));
        return s.replace("T", " ").substring(0, 10);
    };

    // ✅ รวม Tool No. t1..t42
    const joinTools = (item) => {
        const parts = [];
        for (let i = 1; i <= 42; i++) {
            const key = `t${i}`;  // <-- ต้องเป็น string template
            parts.push(item[key] ?? "");
        }
        return parts.join("-");
    };

    useEffect(() => {
        getMachines();
        getMachinesShaft();
    }, []);

    const getMachines = async () => {
        try {
            const response = await axios.get(config.api_path + "/getDataMC");
            setMachines(response.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };
    const getMachinesShaft = async () => {
        try {
            const response = await axios.get(config.api_path + "/getDataMCShaft");
            setMachinesShaft(response.data);
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

            const machineFilter = selectedOption ? selectedOption.value : "";

            // ✅ เรียก API ตัวใหม่ ที่ “ไม่ join”
            const response = await axios.post(
                config.api_path + "/product/listCaseToolNG",
                { startDate, endDate, machineFilter },
                config.headers()
            );

            const rows = response.data?.results ?? [];
            if (rows.length === 0) {
                Swal.fire({
                    title: "ไม่พบข้อมูล",
                    text: "กรุณาตรวจสอบเงื่อนไขอีกครั้ง",
                    icon: "info",
                });
                setProducts([]);
                return;
            }

            setProducts(rows);
            Swal.fire({
                title: "Success",
                text: "ค้นหาข้อมูลที่ต้องการสำเร็จ",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
            });
        } catch (e) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            });
        }
    };




    const clearData = () => {
        window.location.reload();
    };


    // ✅ ส่งออก Excel ตามผลลัพธ์ที่ค้นหาใน state `products`
    const downloadExcel = () => {
        if (!products || products.length === 0) {
            Swal.fire({
                title: "Error",
                text: "ไม่มีข้อมูลที่จะส่งออก (กรุณาค้นหาข้อมูลก่อน)",
                icon: "error",
            });
            return;
        }

        // หัวคอลัมน์ให้ตรงกับตาราง
        const headers = [
            "Barcode", "Date", "Name", "Shift", "Machine", "Model", "Process", "Tool No.", "Case","Remark",
            "AF1", "Setter After1", "AF2", "Setter After2", "AF3", "Setter After3", "AF4", "Setter After4", "AF5", "Setter After5",
            "contour_ng_target_spec", "contour_ng_drawing_spec", "contour_over_target", "contour_under_target",
            "sulfcom_ng_target_spec", "sulfcom_ng_drawing_spec", "sulfcom_over_target", "sulfcom_under_target",
            "roncom_ng_target_spec", "roncom_ng_drawing_spec", "roncom_over_target", "roncom_under_target",
            "talysurf_ng_target_spec", "talysurf_ng_drawing_spec", "talysurf_over_target", "talysurf_under_target",
        ];

        // map ข้อมูลเป็นแถว ๆ
        const rows = products.map((item) => ({
            Barcode: item.barcode ?? "-",
            Date: item.createdAt
                ? new Date(item.createdAt).toLocaleString("en-GB", { hour12: false, timeZone: "Asia/Bangkok" })
                : "-",
            Name: item.name ?? "-",
            Shift: item.shift ?? "-",
            Machine: item.machine ?? "-",
            Model: item.model ?? "-",
            Process: item.process ?? "-",
            "Tool No.": joinTools(item) ?? "-",
            "Case": item.tool_change_case ?? "-",
            Remark: item.remark ?? "",

            AF1: item.afterset ?? "-",
            "Setter After1": item.nameafterset ?? "-",
            AF2: item.afterset2 ?? "-",
            "Setter After2": item.nameafterset2 ?? "-",
            AF3: item.afterset3 ?? "-",
            "Setter After3": item.nameafterset3 ?? "-",
            AF4: item.afterset4 ?? "-",
            "Setter After4": item.nameafterset4 ?? "-",
            AF5: item.afterset5 ?? "-",
            "Setter After5": item.nameafterset5 ?? "-",

            // Contour
            contour_ng_target_spec: item.contour_ng_target_spec ?? "-",
            contour_ng_drawing_spec: item.contour_ng_drawing_spec ?? "-",
            contour_over_target: item.contour_over_target ?? "-",
            contour_under_target: item.contour_under_target ?? "-",

            // Sulfcom
            sulfcom_ng_target_spec: item.sulfcom_ng_target_spec ?? "-",
            sulfcom_ng_drawing_spec: item.sulfcom_ng_drawing_spec ?? "-",
            sulfcom_over_target: item.sulfcom_over_target ?? "-",
            sulfcom_under_target: item.sulfcom_under_target ?? "-",

            // Roncom
            roncom_ng_target_spec: item.roncom_ng_target_spec ?? "-",
            roncom_ng_drawing_spec: item.roncom_ng_drawing_spec ?? "-",
            roncom_over_target: item.roncom_over_target ?? "-",
            roncom_under_target: item.roncom_under_target ?? "-",

            // Talysurf
            talysurf_ng_target_spec: item.talysurf_ng_target_spec ?? "-",
            talysurf_ng_drawing_spec: item.talysurf_ng_drawing_spec ?? "-",
            talysurf_over_target: item.talysurf_over_target ?? "-",
            talysurf_under_target: item.talysurf_under_target ?? "-",
        }));

        // แปลงเป็น worksheet / workbook แล้วบันทึกไฟล์
        const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CASE_TOOL_NG");

        // ตั้งชื่อไฟล์ระบุช่วงวันที่เพื่อให้ง่ายต่อการจำ
        const fname =
            startDate && endDate
                ? `case_tool_ng_${startDate}_to_${endDate}.xlsx`
                : `case_tool_ng.xlsx`;

        XLSX.writeFile(wb, fname);
    };


    return (
        <>
            {console.log(products)}{" "}
            {/* ใส่ console.log ตรงนี้เพื่อดูข้อมูลทุกครั้งที่มีการ re-render */}
            <div className="m-4 border rounded border-primary p-2 bg-secondary">
                <h1 className="text-center text-bold">RECORD CASE TOOL NG</h1>
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
                    <div className="col-3">
                        <div className="text-bold ml-2">Machine Sleeve</div>
                        <Select
                            options={machines && machines.result
                                ? machines.result.map((item) => ({
                                    value: item.Machine_Number,
                                    label: item.Machine_Number,
                                }))
                                : []}
                            onChange={(selectedOption) => {
                                setSelectedOption(selectedOption);
                            }}
                        />
                    </div>
                    <div className="col-3">
                        <div className="text-bold ml-2">Machine Shaft</div>
                        <Select
                            options={machinesShaft && machinesShaft.result
                                ? machinesShaft.result.map((item) => ({
                                    value: item.Machine_Number,
                                    label: item.Machine_Number,
                                }))
                                : []}
                            onChange={(selectedOption) => {
                                setSelectedOption(selectedOption);
                            }}
                        />
                    </div>
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
                        className="btn btn-success ml-5"
                        id="export"
                        onClick={downloadExcel}
                    >
                        <AiFillFileExcel style={{ marginRight: "5px" }} />
                        EXPORT TO EXCEL
                    </button>
                </div>
            </div>
            <div className="">
                <Link to='/settings'>
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
                        <th className="text-white">Case change</th>
                        <th className="text-white">Remark</th>
                        <th className="text-white">AF1</th>
                        <th className="text-white">Setter After1</th>
                        <th className="text-white">AF2</th>
                        <th className="text-white">Setter After2</th>
                        <th className="text-white">AF3</th>
                        <th className="text-white">Setter After3</th>
                        <th className="text-white">AF4</th>
                        <th className="text-white">Setter After4</th>
                        <th className="text-white">AF5</th>
                        <th className="text-white">Setter After5</th>
                        <th className="text-center text-white">contour_ng_target_spec</th>
                        <th className="text-center text-white">contour_ng_drawing_spec</th>
                        <th className="text-center text-white">contour_over_target</th>
                        <th className="text-center text-white">contour_under_target</th>

                        <th className="text-center text-white">sulfcom_ng_target_spec</th>
                        <th className="text-center text-white">sulfcom_ng_drawing_spec</th>
                        <th className="text-center text-white">sulfcom_over_target</th>
                        <th className="text-center text-white">sulfcom_under_target</th>

                        <th className="text-center text-white">roncom_ng_target_spec</th>
                        <th className="text-center text-white">roncom_ng_drawing_spec</th>
                        <th className="text-center text-white">roncom_over_target</th>
                        <th className="text-center text-white">roncom_under_target</th>

                        <th className="text-center text-white">talysurf_ng_target_spec</th>
                        <th className="text-center text-white">talysurf_ng_drawing_spec</th>
                        <th className="text-center text-white">talysurf_over_target</th>
                        <th className="text-center text-white">talysurf_under_target</th>

                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 && products.map((item) => (
                        <tr key={item.id}>
                            <td
                                className={`${item.barcode === "Pass" ? "bg-success" : ""} ${["Cancel", "Reject"].includes(item.barcode) ? "bg-danger" : ""
                                    }`}
                            >
                                {item.barcode}
                            </td>
                            <td>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Bangkok', hour12: false })
                                    : "-"}
                            </td>
                            <td>{item.name ?? "-"}</td>
                            <td>{item.shift ?? "-"}</td>
                            <td>{item.machine ?? "-"}</td>
                            <td>{item.model ?? "-"}</td>
                            <td>{item.process ?? "-"}</td>

                            {/* Tool No. รวม t1..t42 */}
                            <td>{joinTools(item)}</td>
                            <td>{item.tool_change_case ?? ""}</td>

                            <td className="text-danger">{item.remark ?? ""}</td>

                            {/* AF1..AF5 */}
                            <td>{item.afterset ?? "-"}</td>
                            <td>{item.nameafterset ?? "-"}</td>
                            <td>{item.afterset2 ?? "-"}</td>
                            <td>{item.nameafterset2 ?? "-"}</td>
                            <td>{item.afterset3 ?? "-"}</td>
                            <td>{item.nameafterset3 ?? "-"}</td>
                            <td>{item.afterset4 ?? "-"}</td>
                            <td>{item.nameafterset4 ?? "-"}</td>
                            <td>{item.afterset5 ?? "-"}</td>
                            <td>{item.nameafterset5 ?? "-"}</td>

                            {/* Contour */}
                            <td>{item.contour_ng_target_spec ?? "-"}</td>
                            <td>{item.contour_ng_drawing_spec ?? "-"}</td>
                            <td>{item.contour_over_target ?? "-"}</td>
                            <td>{item.contour_under_target ?? "-"}</td>

                            {/* Sulfcom */}
                            <td>{item.sulfcom_ng_target_spec ?? "-"}</td>
                            <td>{item.sulfcom_ng_drawing_spec ?? "-"}</td>
                            <td>{item.sulfcom_over_target ?? "-"}</td>
                            <td>{item.sulfcom_under_target ?? "-"}</td>

                            {/* Roncom */}
                            <td>{item.roncom_ng_target_spec ?? "-"}</td>
                            <td>{item.roncom_ng_drawing_spec ?? "-"}</td>
                            <td>{item.roncom_over_target ?? "-"}</td>
                            <td>{item.roncom_under_target ?? "-"}</td>

                            {/* Talysurf */}
                            <td>{item.talysurf_ng_target_spec ?? "-"}</td>
                            <td>{item.talysurf_ng_drawing_spec ?? "-"}</td>
                            <td>{item.talysurf_over_target ?? "-"}</td>
                            <td>{item.talysurf_under_target ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default RecordNgTool;