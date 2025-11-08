import { useState, useEffect } from 'react';
import SidebarDashboard from './SidebarDashboard';
import axios from "axios";
import config from "../../config";
import ModalDashboard from '../components/ModalDashboard';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, LabelList } from 'recharts';

const AdminDashboardSelect = () => {
    const [selectedTab, setSelectedTab] = useState('CH');  // กำหนดแท็บที่เลือก
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalChange: 0,
        totalRequestFinish: 0,
        totalRequestCancel: 0,
        totalRequestReject: 0,
        totalRequestInProgress: 0,
    });
    const [loading, setLoading] = useState({
        stats: true,
        charts: true,
    });

    const [monthlyData, setMonthlyData] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // default: ปี-เดือนปัจจุบัน
    });

    const [setterStats, setSetterStats] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [changeToolData, setChangeToolData] = useState([]);

    const [selectedSetter, setSelectedSetter] = useState(null);
    const [setterDetailData, setSetterDetailData] = useState([]);
    const [showSetterModal, setShowSetterModal] = useState(false);

    const [countdown, setCountdown] = useState(300); // 300 วินาที = 5 นาที


    const getMonthOptions = () => {
        const now = new Date();
        const year = now.getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return Array.from({ length: 12 }, (_, i) => {
            const month = String(i + 1).padStart(2, '0');
            const monthLabel = monthNames[i]; // Jan, Feb, ...
            return { value: `${year}-${month}`, label: `${monthLabel}-${year}` };
        });
    };

    const getMonthName = (monthStr) => {
        const [year, month] = monthStr.split("-");
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(month, 10) - 1]} ${year.slice(2)}`;
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };


    useEffect(() => {
        console.log("Updated Stats:", stats);
    }, [stats]);

    useEffect(() => {
        console.log("Updated totalChange:", stats.totalChange);  // ตรวจสอบค่าที่ได้รับ
    }, [stats.totalChange]);  // รีเฟรชเมื่อ stats.totalChange เปลี่ยนแปลง

    useEffect(() => {
        // เรียกข้อมูลและอัพเดตค่าของสถิติ
        fetchBasicStats();
        fetchMonthlyStats(); // ✅ ดึงกราฟรายเดือนด้วย
        fetchSetterStats();
        console.log("Selected Tab:", selectedTab);
    }, [selectedTab, selectedMonth]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    window.location.reload(); // 🔥 Reload หน้า
                    return 300; // 🔄 รีเซ็ตใหม่ 5 นาที
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    // ฟังก์ชันดึงข้อมูลสถิติ
    const fetchBasicStats = async () => {
        try {
            setLoading(prev => ({ ...prev, stats: true, charts: true })); // ✅ รวม charts ด้วย

            const userRes = await axios.post(config.api_path + "/checkTotalUsersBymachine", { machineType: selectedTab.split('-')[0] }, config.headers());
            const usersData = userRes.data;

            const reQuest = await axios.post(config.api_path + "/checkTotalRequestByMachine", {
                machineType: selectedTab.split('-')[0],
                month: selectedMonth
            }, config.headers());

            const mosData = reQuest.data;

            setStats({
                totalUsers: usersData.totalUsers || 0,
                totalChange: mosData.totalChange || 0,
                totalRequestFinish: mosData.finish || 0,
                totalRequestCancel: mosData.cancel || 0,
                totalRequestReject: mosData.reject || 0,
                totalRequestInProgress: mosData.in_progress || 0,
            });

            // ✅ ต้อง set charts ให้ false ด้วย เพื่อแสดงกราฟ
            setLoading(prev => ({ ...prev, stats: false, charts: false }));

        } catch (error) {
            console.error("❌ Error fetching basic stats:", error);
            setLoading(prev => ({ ...prev, stats: false, charts: false }));
        }
    };

    const fetchMonthlyStats = async () => {
        try {
            setLoading(prev => ({ ...prev, charts: true }));

            const response = await axios.post(config.api_path + "/getMonthlyChangeData", { 
                machineType: selectedTab,
            }, config.headers());
            const formatted = response.data.map(item => ({
                name: getMonthName(item.month),
                value: parseInt(item.count)
            }));


            setMonthlyData(formatted);
            setLoading(prev => ({ ...prev, charts: false }));


        } catch (error) {
            console.error("\u274C Error fetching chart data:", error);
            setMonthlyData([]);
            setLoading(prev => ({ ...prev, charts: false }));
        }
    };

    const fetchSetterStats = async () => {
        try {
            const res = await axios.post(config.api_path + "/getSetterChangeStats", {
                machineType: selectedTab,
                month: selectedMonth,
            }, config.headers());

            setSetterStats(res.data);
        } catch (error) {
            console.error("❌ Error fetching setter stats:", error);
            setSetterStats([]);
        }
    };

    const handleChangeToolClick = async () => {
        try {
            const response = await axios.post(config.api_path + "/getChangeToolList", {
                machineType: selectedTab,
                month: selectedMonth
            }, config.headers());

            // ✅ ถ้า response.data เป็น object เดียว ให้ห่อเป็น array
            const data = Array.isArray(response.data) ? response.data : [response.data];

            setChangeToolData(data);
            setShowModal(true);
        } catch (error) {
            console.error("❌ Error fetching change tool list:", error);
        }
    };

    const handleBarClick = async (data) => {
        if (!data?.name) return;

        try {
            const res = await axios.post(config.api_path + "/getSetterToolList", {
                machineType: selectedTab,
                month: selectedMonth,
                setterName: data.name,
            }, config.headers());

            setSelectedSetter(data.name);
            setSetterDetailData(res.data || []);
            setShowSetterModal(true);
        } catch (error) {
            console.error("❌ Error fetching setter details:", error);
        }
    };





    // ฟังก์ชันแสดงเนื้อหาตามแท็บที่เลือก
    const renderContent = () => {
        switch (selectedTab) {
            case 'CH':
                return <div className='fw-bold'>Status change tool monthly CH</div>;
            case 'CS':
                return <div className='fw-bold'>Status change tool monthly CS</div>;
            case 'SB':
                return <div className='fw-bold'>Status change tool monthly SB</div>;
            case 'TN':
                return <div className='fw-bold'>Status change tool monthly TN</div>;
            case 'TBM':
                return <div className='fw-bold'>Status change tool monthly TBM</div>;
            case 'TBS':
                return <div className='fw-bold'>Status change tool monthly TBS</div>;
            case 'TTC':
                return <div className='fw-bold'>Status change tool monthly TTC</div>;
            case 'TB':
                return <div className='fw-bold'>Status change tool monthly TB</div>;
            case 'TCH':
                return <div className='fw-bold'>Status change tool monthly TCH</div>;
            default:
                return <div>กรุณาเลือกแท็บ</div>;
        }
    };

    // หาค่าสูงสุดของ total
    const maxTotal = Math.max(...setterStats.map(item => item.total));

    // สร้าง ticks โดยเว้นทีละ 10 เช่น [0, 10, 20, ..., สูงสุด]
    const tickStep = 5;
    const maxTick = Math.ceil((maxTotal + 5) / tickStep) * tickStep; // เผื่อ +10

    const yTicks = Array.from(
        { length: Math.floor(maxTick / tickStep) + 1 },
        (_, i) => i * tickStep
    );

    const maxPercent = Math.max(...setterStats.map(item => item.percent));
    const percentBuffer = 10;
    const percentMaxTick = Math.ceil((maxPercent + percentBuffer) / 10) * 10;

    // ✅ ให้แน่ใจว่า 100 อยู่ใน ticks เสมอ
    const yRightTicks = [];
    for (let i = 0; i <= percentMaxTick; i += 20) {
        yRightTicks.push(i);
    }
    if (!yRightTicks.includes(100)) {
        yRightTicks.push(100); // บังคับเพิ่ม 100 ถ้ายังไม่มี
    }
    yRightTicks.sort((a, b) => a - b); // ✅ เรียงใหม่อีกครั้ง


    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("ChangeToolList");

        // Header
        worksheet.columns = [
            { header: "Barcode", key: "barcode", width: 15 },
            { header: "Date", key: "createdAt", width: 15 },
            { header: "Name", key: "name", width: 15 },
            { header: "Shift", key: "shift", width: 10 },
            { header: "Machine", key: "machine", width: 12 },
            { header: "Model", key: "model", width: 25 },
            { header: "Process", key: "process", width: 15 },
            { header: "Tool Change Case", key: "tool_change_case", width: 20 },
            { header: "AF1", key: "afterset", width: 10 },
            { header: "Name AF1", key: "nameafterset", width: 15 },
            { header: "AF2", key: "afterset2", width: 10 },
            { header: "Name AF2", key: "nameafterset2", width: 15 },
            { header: "AF3", key: "afterset3", width: 10 },
            { header: "Name AF3", key: "nameafterset3", width: 15 },
            { header: "AF4", key: "afterset4", width: 10 },
            { header: "Name AF4", key: "nameafterset4", width: 15 },
            { header: "AF5", key: "afterset5", width: 10 },
            { header: "Name AF5", key: "nameafterset5", width: 15 },
        ];

        // Data
        changeToolData.forEach((item) => {
            worksheet.addRow(item);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `ChangeToolList_${selectedMonth}.xlsx`);
    };

    const exportToExcelSetterDetails = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Setter Details');

        // หัวตาราง
        worksheet.addRow([
            'Name', 'Date', 'Shift', 'Machine', 'Model', 'Process', 'Tool Change Case',
            'AF1', 'Name AF1',
            'AF2', 'Name AF2',
            'AF3', 'Name AF3',
            'AF4', 'Name AF4',
            'AF5', 'Name AF5'
        ]);

        // เพิ่มข้อมูลจาก setterDetailData
        setterDetailData.forEach(row => {
            worksheet.addRow([
                row.name,
                row.createdAt,
                row.shift,
                row.machine,
                row.model,
                row.process,
                row.tool_change_case,
                row.afterset,
                row.nameafterset,
                row.afterset2,
                row.nameafterset2,
                row.afterset3,
                row.nameafterset3,
                row.afterset4,
                row.nameafterset4,
                row.afterset5,
                row.nameafterset5
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const fileName = `Setter_${selectedSetter}_Details.xlsx`;
        saveAs(new Blob([buffer]), fileName);
    };


    return (
        <>
            <div className="main-wrapper">
                <div className="dashboard-container" style={{ display: 'flex' }}>
                    <SidebarDashboard
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                    />
                    <div className="content">

                        <div className="stats-container" style={{ flex: 1, overflowX: 'auto' }}>
                            {loading.stats ? (
                                <p>กำลังโหลดข้อมูล...</p>
                            ) : (
                                <div>
                                    <div className="dashboard-stats-type d-flex justify-content-between align-items-center">
                                        <select
                                            style={{ backgroundColor: "rgba(67, 67, 67, 1)", color: "white" }}
                                            className='col-3 form-control'
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        >
                                            {getMonthOptions().map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <h4 id="text-h1">
                                            ⏱<span className='text-white'>{formatTime(countdown)}</span>
                                        </h4>
                                    </div>
                                    <div className="dashboard-stats-type">

                                        <div id="stat-card-request-a" onClick={handleChangeToolClick}>
                                            <h3 id="text-h31">CHANGE TOOL ALL</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalChange?.toLocaleString()} <ReceiptLongIcon className='icon-request' />
                                            </p>
                                        </div>

                                        <div id="stat-card-pass-a">
                                            <h3 id="text-h31">PASS</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestFinish?.toLocaleString()} <CheckBoxIcon className='icon-request' />
                                            </p>
                                        </div>
                                        <div id="stat-card-inprogress-a">
                                            <h3 id="text-h31">IN PROGRESS</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestInProgress?.toLocaleString()} <HourglassTopIcon className='icon-request' />
                                            </p>
                                        </div>

                                        <div id="stat-card-reject-a">
                                            <h3 id="text-h31">REJECT</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestReject?.toLocaleString()}  <DisabledByDefaultIcon className='icon-request' />
                                            </p>
                                        </div>

                                        <div id="stat-card-cancel-a">
                                            <h3 id="text-h31">CANCEL</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestCancel?.toLocaleString()} <DisabledByDefaultIcon className='icon-request' />
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        <div className="charts-container">
                            <div className="centered-text">
                                {renderContent()}
                            </div>
                            {loading.charts ? <p>loading...</p> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={monthlyData}>
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-25}      // เอียง 45 องศา (ขึ้นอยู่กับการวาง)
                                            textAnchor="end" // ชิดท้ายข้อความ จะดูสวยกว่า
                                            interval={0}     // แสดงทุกค่า ไม่ข้าม
                                            height={40}      // เพิ่มความสูงให้แกน X (สำคัญมาก)
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            className="bar-shadow"
                                            dataKey="value"
                                            fill="rgb(255, 63, 255)">
                                            <LabelList dataKey="value" position="center" />
                                        </Bar>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="charts-container mt-5">
                            <h5 className="text-center fw-bold">After set by setter - {selectedMonth}</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart
                                    data={setterStats}
                                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }} // ✅ เพิ่มระยะห่างขอบ
                                >
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-25}      // เอียง 45 องศา (ขึ้นอยู่กับการวาง)
                                        textAnchor="end" // ชิดท้ายข้อความ จะดูสวยกว่า
                                        interval={0}     // แสดงทุกค่า ไม่ข้าม
                                        height={40}      // เพิ่มความสูงให้แกน X (สำคัญมาก)
                                    // ขยับข้อความลงด้านล่าง (ปรับได้)
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        domain={[0, maxTick]}         // เช่น [0, 100]
                                        ticks={yTicks}                // เช่น [0,10,20,...,100]
                                        allowDecimals={false}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tickFormatter={(val) => `${val}%`}
                                        domain={[0, percentMaxTick]}
                                        ticks={yRightTicks}
                                        allowDecimals={false}
                                    />
                                    <Tooltip />
                                    <Legend />

                                    {/* 🔵 จำนวนเปลี่ยน Tool */}
                                    <Bar className="bar-shadow"
                                        yAxisId="left"
                                        dataKey="total"
                                        stackId="stack"
                                        fill="rgba(63, 162, 255, 1)"
                                        name="Total Change"
                                        barCategoryGap="5%" // ✅ เพิ่มช่องว่างระหว่างแท่งกับขอบ
                                        onClick={(data) => handleBarClick(data)}
                                    >
                                        <LabelList dataKey="total" position="center" fill="#fff" />
                                    </Bar>

                                    {/* 🟠 After Set (stacked bar) */}
                                    <Bar
                                        className="bar-shadow"
                                        yAxisId="left"
                                        dataKey="afterset"
                                        stackId="stack"
                                        fill="#ff9d2cff"
                                        name="After Set"
                                        onClick={(data) => handleBarClick(data)}
                                    >
                                        <LabelList dataKey="afterset" position="center" />
                                    </Bar>

                                    {/* 🔷 % After Set */}
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="percent"
                                        stroke="red"
                                        name="% After Set"
                                        dot={{ r: 3 }}
                                    >
                                        <LabelList
                                            dataKey="percent"
                                            position="left"

                                            formatter={(value) => `${value}%`}
                                        />
                                    </Line>
                                </ComposedChart>
                            </ResponsiveContainer>


                        </div>


                    </div>
                </div>
            </div>

            {showModal && (
                <ModalDashboard
                    id="changeToolModal"
                    title="List of all TOOL changes"
                    modalSize="modal-xl"
                    onClose={() => setShowModal(false)}
                >
                    <button className="btn btn-success btn-sm mb-2" onClick={exportToExcel}>
                        📥 Export Excel
                    </button>
                    <table className="table table-bordered table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Shift</th>
                                <th>Machine</th>
                                <th>Model</th>
                                <th>Process</th>
                                <th>Tool Change Case</th>
                                <th>AF1</th>
                                <th>Name AF1</th>
                                <th>AF2</th>
                                <th>Name AF2</th>
                                <th>AF3</th>
                                <th>Name AF3</th>
                                <th>AF4</th>
                                <th>Name AF4</th>
                                <th>AF5</th>
                                <th>Name AF5</th>
                            </tr>
                        </thead>
                        <tbody>
                            {changeToolData.length > 0 ? (
                                changeToolData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.barcode}</td>
                                        <td>
                                            {row.createdAt
                                                ? new Date(row.createdAt).toLocaleDateString("th-TH", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })
                                                : "-"}
                                        </td>
                                        <td>{row.name}</td>
                                        <td>{row.shift}</td>
                                        <td>{row.machine}</td>
                                        <td>{row.model}</td>
                                        <td>{row.process}</td>
                                        <td>{row.tool_change_case}</td>
                                        <td>{row.afterset}</td>
                                        <td>{row.nameafterset}</td>
                                        <td>{row.afterset2}</td>
                                        <td>{row.nameafterset2}</td>
                                        <td>{row.afterset3}</td>
                                        <td>{row.nameafterset3}</td>
                                        <td>{row.afterset4}</td>
                                        <td>{row.nameafterset4}</td>
                                        <td>{row.afterset5}</td>
                                        <td>{row.nameafterset5}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">ไม่พบข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </ModalDashboard>
            )}

            {showSetterModal && (
                <ModalDashboard
                    id="setterDetailModal"
                    title={`รายละเอียด Setter: ${selectedSetter}`}
                    modalSize="modal-xl"
                    onClose={() => setShowSetterModal(false)}
                >
                    {/* 🔻 ปุ่มโหลด Excel */}
                    <button
                        className="btn btn-success mb-3"
                        onClick={exportToExcelSetterDetails}
                    >
                        📥 Download Excel
                    </button>
                    <table className="table table-bordered table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Shift</th>
                                <th>Machine</th>
                                <th>Model</th>
                                <th>Process</th>
                                <th>Tool Change Case</th>
                                <th>AF1</th>
                                <th>Name AF1</th>
                                <th>AF2</th>
                                <th>Name AF2</th>
                                <th>AF3</th>
                                <th>Name AF3</th>
                                <th>AF4</th>
                                <th>Name AF4</th>
                                <th>AF5</th>
                                <th>Name AF5</th>
                            </tr>
                        </thead>
                        <tbody>
                            {setterDetailData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.name}</td>
                                    <td>{row.createdAt ? new Date(row.createdAt).toLocaleString('th-TH') : '-'}</td>
                                    <td>{row.shift}</td>
                                    <td>{row.machine}</td>
                                    <td>{row.model}</td>
                                    <td>{row.process}</td>
                                    <td>{row.tool_change_case}</td>
                                    <td>{row.afterset}</td>
                                    <td>{row.nameafterset}</td>
                                    <td>{row.afterset2}</td>
                                    <td>{row.nameafterset2}</td>
                                    <td>{row.afterset3}</td>
                                    <td>{row.nameafterset3}</td>
                                    <td>{row.afterset4}</td>
                                    <td>{row.nameafterset4}</td>
                                    <td>{row.afterset5}</td>
                                    <td>{row.nameafterset5}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ModalDashboard>
            )}

        </>
    );
};

export default AdminDashboardSelect;
