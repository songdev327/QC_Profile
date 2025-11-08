//admin/adminDashboard
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './admin.css';
import './adminDashboard.css';
// import AdminHeader from './AdminHeader';
import UndoIcon from '@mui/icons-material/Undo';
import axios from "axios";
import config from "../../config";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { ComposedChart } from 'recharts'; // เพิ่มตรงนี้
import _ from 'lodash'; // ต้องติดตั้ง lodash หรือจัดกลุ่มเองก็ได้

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LabelList } from 'recharts';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const AdminDashboard = () => {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalChange: 0, // ✅ เพิ่มตรงนี้

    });

    const [chartDataFullDate, setChartDataFullDate] = useState([]);
    const [chartView] = useState("month");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0 = Jan
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [years, setYears] = useState([]);

    const [oilVsFilterData, setOilVsFilterData] = useState([]);

    const [yearlyRequests, setYearlyRequests] = useState([]);

    const [af7DailyMax, setAf7DailyMax] = useState([]);

    const [aftersetSummary, setAftersetSummary] = useState([]);

    const [selectedAFDay, setSelectedAFDay] = useState(null); // รายการที่คลิก
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [aftersetBySetter, setAftersetBySetter] = useState([]);

    const [aftersetBySetterNew, setAftersetBySetterNew] = useState([]);
    const [aftersetBySetterNew1, setAftersetBySetterNew1] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterWeek, setFilterWeek] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("");

    const [filterWeek1, setFilterWeek1] = useState("");
    const [filterMonth1, setFilterMonth1] = useState("");
    const [filterYear1, setFilterYear1] = useState("");

    const [selectedName, setSelectedName] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [summaryData, setSummaryData] = useState([]);

    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);

    const [filterMachine1, setFilterMachine1] = useState("");

    const [selectedBarData, setSelectedBarData] = useState(null);
    const [isModalOpenNew, setIsModalOpenNew] = useState(false);

    const [selectedBarDataDaily, setSelectedBarDataDaily] = useState(null);
    const [isModalOpenNewDaily, setIsModalOpenNewDaily] = useState(false);
    // ด้านบน
    const [countdown, setCountdown] = useState(300); // 300 วินาที = 5 นาที


    const [filterMachine, setFilterMachine] = useState('');

    const [chartDataSetterChange, setChartDataSetterChange] = useState([]); // ไม่ควรเป็น object
    const [selectedCauseBar, setSelectedCauseBar] = useState(null);
    const [isCauseModalOpen, setIsCauseModalOpen] = useState(false);

    const [chartDataStackedAF, setChartDataStackedAF] = useState([]);

    const [selectedBarDataStackedAF, setSelectedBarDataStackedAF] = useState(null);
    const [isModalOpenStackedAF, setIsModalOpenStackedAF] = useState(false);

    const [filterMonthCause, setFilterMonthCause] = useState(new Date().getMonth() + 1); // เริ่มที่เดือนปัจจุบัน 1-12
    const [filterYearCause, setFilterYearCause] = useState(new Date().getFullYear());

    const [filterMachineCause, setFilterMachineCause] = useState("");
    const [filterMonthCauseLeft, setFilterMonthCauseLeft] = useState(new Date().getMonth() + 1);
    const [filterYearCauseLeft, setFilterYearCauseLeft] = useState(new Date().getFullYear());

    const [yearsAdd, setYearsAdd] = useState([]);
    const [userName, setUserName] = useState("");

    const [filterModel, setFilterModel] = useState("");
    const [modelList, setModelList] = useState([]);

    // const [modelShaftList, setModelShaftList] = useState([]); //---- เพิ่ม Model shaft -----
    // const [filterModelShaft, setFilterModelShaft] = useState(""); //---- เพิ่ม Model shaft -----


    const [selectedYearStatus, setSelectedYearStatus] = useState(new Date().getFullYear());
    const [showStatusTable, setShowStatusTable] = useState(false);
    const [statusMonthlyData, setStatusMonthlyData] = useState([]);
    const [selectedMachineStatus, setSelectedMachineStatus] = useState(""); // ✅ เก็บค่า machine
    const [chartStatusData, setChartStatusData] = useState([]);



    useEffect(() => {
        const fetchStatusMonthly = async () => {
            try {
                const response = await axios.post(`${config.api_path}/getStatusMonthly`, {
                    year: selectedYearStatus,
                    machine: selectedMachineStatus,
                });

                const rawData = response.data || [];

                // ✅ คำนวณค่า other และบันทึกใหม่
                const mappedData = rawData.map(item => {
                    const total = item.total || 0;
                    const pass = item.pass || 0;
                    const af = item.af || 0;

                    return {
                        ...item,
                        pass,
                        af,
                        total, // ใช้สำหรับเส้นหรือแท่งรวม
                    };
                });

                setStatusMonthlyData(mappedData);
                setChartStatusData(mappedData); // ✅ อัปเดต chart ด้วยข้อมูลใหม่
            } catch (error) {
                console.error("❌ Failed to fetch monthly status:", error);
            }
        };

        if (showStatusTable) {
            fetchStatusMonthly();
        }
    }, [selectedYearStatus, selectedMachineStatus, showStatusTable]);

    const handleModelChange = (e) => {
        setFilterModel(e.target.value);

    };

    const navigate = useNavigate();

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    // const years = [2024, 2025]; // หรือใช้ปีที่มีข้อมูลจาก DB
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];


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

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    //-------- Start Dayly -----------------------------------------------------------------------------
    // ฟังก์ชันกรองข้อมูล
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];

        const latestDates = {};
        aftersetBySetterNew.forEach(item => {
            if (!latestDates[item.name] || new Date(item.date) > new Date(latestDates[item.name])) {
                latestDates[item.name] = item.date;
            }
        });

        // 🔹 กรองตาม filter ต่างๆ
        const filtered = aftersetBySetterNew.filter((item) => {
            const date = new Date(item.date);
            const week = Math.ceil(date.getDate() / 7);
            const hasFilter =
                filterName || filterDate || filterWeek || filterMonth || filterYear || filterMachine;

            return (
                (!filterMachine || item.machine?.startsWith(filterMachine)) &&
                (!filterName || item.name === filterName) &&
                (!filterDate || item.date === filterDate) &&
                (!filterWeek || week === parseInt(filterWeek)) &&
                (!filterMonth || date.getMonth() + 1 === parseInt(filterMonth)) &&
                (!filterYear || date.getFullYear() === parseInt(filterYear)) &&
                (!hasFilter ? item.date === today : true)
            );
        });

        // 🔹 รวม value ถ้า name ซ้ำ
        const grouped = {};
        filtered.forEach(item => {
            if (!grouped[item.name]) {
                grouped[item.name] = {
                    name: item.name,
                    value: 0,
                    machine: item.machine,
                    latestDate: item.date,
                };
            }
            grouped[item.name].value += item.value;

            // อัปเดตวันที่ล่าสุด (ใช้ใน tooltip)
            if (new Date(item.date) > new Date(grouped[item.name].latestDate)) {
                grouped[item.name].latestDate = item.date;
            }
        });

        const merged = Object.values(grouped);

        setFilteredData(merged);
    }, [aftersetBySetterNew, filterName, filterDate, filterWeek, filterMonth, filterYear, filterMachine]);

    //-------- End Dayly -----------------------------------------------------------------------------------

    //-------- Start Week , Month , Year --------------------------------------------------------------------

    useEffect(() => {
        const weekFiltered = aftersetBySetterNew1.filter(item => {
            const date = new Date(item.date);
            const week = Math.ceil(date.getDate() / 7);
            return (
                (!filterMachine1 || item.machine?.startsWith(filterMachine1)) && // ✅ เพิ่มเงื่อนไขเครื่อง
                (!filterWeek1 || week === parseInt(filterWeek1)) &&
                (!filterMonth1 || date.getMonth() + 1 === parseInt(filterMonth1)) &&
                (!filterYear1 || date.getFullYear() === parseInt(filterYear1))
            );
        });

        const groupedByName = {};
        weekFiltered.forEach(item => {
            const name = item.name;
            if (!groupedByName[name]) {
                groupedByName[name] = {
                    name,
                    value: 0,
                    latestDate: item.date
                };
            }

            groupedByName[name].value += item.value;

            if (new Date(item.date) > new Date(groupedByName[name].latestDate)) {
                groupedByName[name].latestDate = item.date;
            }
        });

        const result = Object.values(groupedByName);
        setWeekData(result);
        setMonthData(result);
        setYearData(result);
    }, [aftersetBySetterNew1, filterWeek1, filterMonth1, filterYear1, filterMachine1]);

    useEffect(() => {
        if (filterMachine1) {
            fetchAftersetBySetterNew1();
        }
    }, [filterMachine1]);


    //-------- End Week , Month , Year --------------------------------------------------------------------


    useEffect(() => {
        fetchYearlyRequests(); // ✅ เรียกตอนโหลดครั้งแรก
    }, []);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await axios.get(`${config.api_path}/getUniqueModels`, config.headers());
                setModelList(res.data.data || []);
            } catch (err) {
                console.error("Error fetching model list:", err);
            }
        };
        fetchModels();
    }, []);



    // สำหรับซ่อน/แสดงแต่ละส่วน
    const [visibleSections, setVisibleSections] = useState({
        statsRow1: true,
        statsRow2: true,
        charts: true,
        tables: true,
        shortcuts: true,
        activity: true,
        realtime: true
    });

    // ฟังก์ชันสลับการแสดงผลส่วนต่างๆ
    const toggleSection = (section) => {
        setVisibleSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // สำหรับกราฟและข้อมูลเพิ่มเติม
    const [chartData, setChartData] = useState({
        dailyMOs: [],
        monthlyRequests: [], // ✅ เพิ่มค่านี้เพื่อป้องกัน .map undefined
        modelDistribution: [],
        machineUsage: [],
        ngTypes: [],
        recentMOs: [],
        recentNGs: []
    });

    const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const sortedMonthlyRequests = [...chartData.monthlyRequests].sort(
        (a, b) => (a.month || "").localeCompare(b.month || "")
    );
    // สำหรับการแจ้งเตือน
    const [alerts, setAlerts] = useState([]);

    // สำหรับการโหลดข้อมูล
    const [loading, setLoading] = useState({
        stats: true,
        charts: true,
        tables: true,
        alerts: true
    });

    // สีสำหรับชาร์ต
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const currentYear = new Date().getFullYear();

    const filteredChartDataSetterChange = chartDataSetterChange.filter(item => {
        const d = item.details?.[0]?.date ? new Date(item.details[0].date) : null;
        return (!filterMachine || item.machine?.startsWith(filterMachine)) &&
            (!filterMonthCause || (d && d.getMonth() + 1 === parseInt(filterMonthCause))) &&
            (!filterYearCause || (d && d.getFullYear() === parseInt(filterYearCause))) &&
            (!filterModel || item.model === filterModel); // ✅ เงื่อนไขกรอง Model;
    });

    // ✅ ฟังก์ชันสร้างสีเฉพาะแต่ละชื่อ
    const getColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 100%, 45%)`; // 🔥 สีฉูดฉาด: Saturation 90%, Lightness 45%
    };

    const vibrantColors = [
        "#FF1493", // ชมพูสด (Deep Pink)
        "#FF4500", // ส้มแดง (Orange Red)
        "#8A2BE2", // ม่วงเข้ม (Blue Violet)
        "#FF69B4", // ชมพูอ่อนสด (Hot Pink)
        "#FF8C00", // ส้มเข้ม (Dark Orange)
        "#9400D3", // ม่วงเข้ม (Dark Violet)
        "#FF00FF", // Magenta
        "#FF6347", // Tomato
        "#FF00AF", // Pink Neon
        "#D2691E", // Chocolate (ส้ม-น้ำตาล)
    ];

    const getColorFromName1 = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % vibrantColors.length;
        return vibrantColors[index];
    };

    const grouped = _.groupBy(filteredData, 'date');
    const groupedData = Object.entries(grouped).map(([date, records]) => {
        const entry = { date };
        records.forEach(r => {
            entry[r.name] = r.value;
        });
        return entry;
    });

    const allNames = useMemo(() => {
        if (groupedData.length === 0) return [];
        return Object.keys(groupedData[0]).filter(key => key !== "date");
    }, [groupedData]);

    useEffect(() => {
        fetchAvailableYears(); // ✅ โหลดปีจาก DB
        fetchAllData();
    }, []);

    useEffect(() => {
        fetchAF7DailyMax();
        fetchAftersetSummary();
        fetchAftersetBySetter();
        fetchAftersetBySetterNew();
        fetchAftersetBySetterNew1();
        fetchSetterCause();
        fetchChartStackedAF();
    }, []);

    useEffect(() => {
        fetchSetterCause();
    }, [filterMachine, filterMonthCause, filterYearCause, filterModel]);

    useEffect(() => {
        fetchChartStackedAF();
    }, [filterMachine, filterMonthCause, filterYearCause, filterModel]);

    useEffect(() => {
        if (filterMachine) {
            fetchAftersetBySetterNew();
        }
    }, [filterMachine]);

    useEffect(() => {
        // console.log("🔍 aftersetBySetterNew:", aftersetBySetterNew);
    }, [aftersetBySetterNew]);

    useEffect(() => {
        // console.log("🔍 chartDataStackedAF:", chartDataStackedAF);

    }, [chartDataStackedAF]);



    useEffect(() => {
        if (selectedBarDataStackedAF) {
            // console.log("🔍 Filtered items for modal:");
            const filtered = aftersetBySetterNew.filter(item =>
                item.name === selectedBarDataStackedAF.name
            );
            console.log(filtered); // ดูว่า barcode มีค่าเป็นอะไร
        }
    }, [selectedBarDataStackedAF]);

    const handleBarClickNewDaily = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setSelectedBarDataDaily(data.activePayload[0].payload);
            setIsModalOpenNewDaily(true);
        }
    };
    const handleBarClickNew = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            setSelectedBarData(data.activePayload[0].payload);
            setIsModalOpenNew(true);
        }
    };

    const handleCauseBarClick = (data) => {
        if (data && data.activeLabel) {
            const found = chartDataSetterChange.find(d => d.name === data.activeLabel);
            if (found) {
                setSelectedCauseBar(found); // ← ตอนนี้จะมี `details` แน่นอน
                setIsCauseModalOpen(true);
            }
        }
    };

    const handleBarClickStackedAF = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const clickedData = data.activePayload[0].payload;
            // console.log("🟩 Clicked bar:", clickedData); // 👈 เพิ่ม debug ตรงนี้
            setSelectedBarDataStackedAF(clickedData);
            setIsModalOpenStackedAF(true);
        }
    };

    const fetchAllData = async () => {
        try {
            // สร้าง cache ชั่วคราวเพื่อป้องกันการเรียก API ซ้ำ
            const apiCache = new Set();

            // เรียกเฉพาะฟังก์ชันที่จำเป็นโดยไม่ซ้ำซ้อนกัน
            await Promise.all([
                fetchBasicStats(apiCache),  // ส่ง cache ไปกับทุกฟังก์ชัน
                fetchChartData(apiCache),
                fetchMonthlyRequests(), // ✅ เรียกแยกต่างหาก

            ]);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const fetchBasicStats = async () => {
        try {
            setLoading(prev => ({ ...prev, stats: true }));

            // ดึงผู้ใช้งาน
            const userRes = await axios.post(config.api_path + "/checkTotalUsers", {}, config.headers());
            const usersData = userRes.data;

            // ดึง Request ทั้งหมด (MO)
            const reQuest = await axios.post(config.api_path + "/checkTotalRequest", {}, config.headers());
            const mosData = reQuest.data;


            setStats(prevStats => ({
                ...prevStats,
                totalUsers: usersData.totalUsers || 0,
                totalChange: mosData.totalChange || 0,
                totalRequestFinish: mosData.finish || 0,
                totalRequestCancel: mosData.cancel || 0,
                totalRequestReject: mosData.reject || 0,
                totalRequestInProgress: mosData.in_progress || 0,

            }));

            setLoading(prev => ({ ...prev, stats: false }));
        } catch (error) {
            console.error("❌ Error fetching basic stats:", error);
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };
    //โหลดข้อมูลกราฟ
    const fetchChartData = async () => {
        try {
            setLoading(prev => ({ ...prev, charts: true }));

            const dailyRes = await axios.post(config.api_path + "/getDailyRequests", {});
            const dailyMOs = Array.isArray(dailyRes.data?.dailyRequests)
                ? dailyRes.data.dailyRequests.map(entry => ({
                    ...entry,
                    finish: entry.finish ?? 0,
                    in_progress: entry.in_progress ?? 0
                }))
                : [];

            // console.log("📈 chartData.dailyMOs:", dailyMOs);

            setChartData(prev => ({
                ...prev,
                dailyMOs: dailyMOs,
            }));

            setLoading(prev => ({ ...prev, charts: false }));
        } catch (error) {
            console.error("❌ Error fetching chart data:", error);
            setChartData(prev => ({
                ...prev,
                dailyMOs: []
            }));
            setLoading(prev => ({ ...prev, charts: false }));
        }
    };

    const fetchAvailableYears = async () => {
        try {
            const res = await axios.get(config.api_path + "/getAvailableYears");
            setYears(res.data.years || []);
        } catch (err) {
            console.error("❌ Error fetching years:", err);
            setYears([]);
        }
    };

    const fetchMonthlyRequests = async () => {
        try {
            const res = await axios.post(config.api_path + "/getMonthlyRequestsNew", {});
            const monthlyRequests = Array.isArray(res.data?.monthlyRequests)
                ? res.data.monthlyRequests.map(entry => ({
                    month: entry.month,
                    total: entry.total,
                    pass: entry.pass,
                    cancel: entry.cancel,
                    reject: entry.reject
                }))
                : [];

            setChartData(prev => ({
                ...prev,
                monthlyRequests
            }));
        } catch (error) {
            console.error("❌ Error fetching monthly requests:", error);
            setChartData(prev => ({
                ...prev,
                monthlyRequests: []
            }));
        }
    };

    const fetchYearlyRequests = async () => {
        try {
            const res = await axios.post(config.api_path + "/getYearlyRequests", {});
            const data = Array.isArray(res.data?.yearlyRequests) ? res.data.yearlyRequests : [];
            setYearlyRequests(data);
        } catch (err) {
            // console.error("❌ Error fetching yearlyRequests:", err);
            setYearlyRequests([]);
        }
    };


    const toggleButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        color: '#333',
        padding: '0',
        marginLeft: 'auto'
    };
    // CSS สำหรับส่วนหัวของ section
    const sectionHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    };


    const fetchAF7DailyMax = async () => {
        try {
            const res = await axios.post(config.api_path + "/getDailyAFxAll", {}, config.headers());
            const raw = res.data.afxRaw || [];

            // ✅ กลุ่มข้อมูลแบบ nested { [date]: { AF1: count, AF2: count, ... } }
            const grouped = {};

            raw.forEach(entry => {
                const { date, afterset, machine, nameafterset } = entry;

                if (!grouped[date]) grouped[date] = {};
                if (!grouped[date][afterset]) {
                    grouped[date][afterset] = {
                        value: 0,
                        machines: [],
                        nameafterset
                    };
                }

                grouped[date][afterset].value += 1;
                grouped[date][afterset].machines.push(machine);
            });

            // ✅ แปลงเป็น array พร้อมใช้ใน LineChart
            const chartData = Object.entries(grouped).map(([date, aftersets]) => {
                const row = { name: date };

                for (const af of ['AF1', 'AF2', 'AF3', 'AF4', 'AF5', 'AF6', 'AF7']) {
                    if (aftersets[af]) {
                        row[af] = aftersets[af].value;
                        row[`${af}_machines`] = aftersets[af].machines.join(", ");
                        row[`${af}_name`] = aftersets[af].nameafterset;
                    } else {
                        row[af] = 0;
                        row[`${af}_machines`] = "";
                        row[`${af}_name`] = "";
                    }
                }

                return row;
            });

            setAf7DailyMax(chartData); // สามารถเปลี่ยนชื่อ state ให้เหมาะสม เช่น setAfData
        } catch (error) {
            // console.error("❌ Error loading AFx data:", error);
            setAf7DailyMax([]);
        }
    };

    const fetchAftersetSummary = async () => {
        try {
            const res = await axios.post(config.api_path + "/getDailyAftersetSummary", {}, config.headers());
            setAftersetSummary(res.data.aftersetSummary || []);
        } catch (err) {
            // console.error("❌ Error loading afterset summary:", err);
            setAftersetSummary([]);
        }
    };

    const fetchAftersetBySetter = async () => {
        try {
            const res = await axios.post(config.api_path + "/getAftersetBySetter", {}, config.headers());
            setAftersetBySetter(res.data.data || []);
        } catch (error) {
            // console.error("❌ Error fetching:", error);
        }
    };

    const fetchAftersetBySetterNew = async () => {
        try {
            const res = await axios.post(
                config.api_path + "/getAftersetBySetterNew",
                { machineType: filterMachine }, // 👈 ส่ง machine filter ไป
                config.headers()
            );
            setAftersetBySetterNew(res.data.data || []);
        } catch (err) {
            // console.error("❌ Error loading afterset by setter:", err);
            setAftersetBySetterNew([]);
        }
    };


    const fetchAftersetBySetterNew1 = async () => {
        try {
            const res = await axios.post(
                config.api_path + "/getAftersetBySetterNew1",
                { machineType: filterMachine1 }, // 👈 ส่งไปใน body
                config.headers()
            );
            setAftersetBySetterNew1(res.data.data || []);
        } catch (err) {
            // console.error("❌ Error loading afterset by setter:", err);
            setAftersetBySetterNew1([]);
        }
    };

    //------ Start Add Model SLV & SFT --------------------------

    useEffect(() => {
        fetchModelList();
    }, []);

    // useEffect(() => {
    //     fetchModelShaftList();
    // }, []);

    const fetchModelList = async () => {
        try {
            const response = await axios.get(`${config.api_path}/getPartModel`, config.headers());
            const models = response.data.result.map(item => item.Partname_Model).filter(Boolean);
            const uniqueModels = [...new Set(models)];
            setModelList(uniqueModels);
        } catch (error) {
            console.error("❌ Error fetching model list:", error);
        }
    };


    const fetchSetterCause = async () => {
        try {

            const res = await axios.post(`${config.api_path}/getAftersetBySetterCause`, {
                machineType: filterMachine,
                month: filterMonthCause,
                year: filterYearCause,
                model: filterModel, // ✅ เพิ่มตรงนี้
                // modelShaft: filterModelShaft, // ✅ model shaft ใหม่
            }, config.headers());

            // console.log("📥 response from API:", res.data);
            setChartDataSetterChange(res.data.data || []);
        } catch (err) {
            // console.error("❌ Error fetching cause chart:", err);
            setChartDataSetterChange([]);
        }
    };

    useEffect(() => {
        fetchAvailableYearsAdd();
    }, []);

    const fetchAvailableYearsAdd = async () => {
        try {
            const res = await axios.get(config.api_path + "/getAvailableYearsAdd");
            setYearsAdd(res.data.years || []);
        } catch (err) {
            // console.error("❌ Error fetching years:", err);
            setYearsAdd([]);
        }
    };


    const fetchChartStackedAF = async () => {
        try {
            const res = await axios.post(
                `${config.api_path}/getSetterChangeStacked`,
                {
                    machineType: filterMachine,
                    month: filterMonthCause,
                    year: filterYearCause,
                    model: filterModel, // ✅ เพิ่มตรงนี้
                },
                config.headers()
            );
            setChartDataStackedAF(res.data.data || []);
            console.log("📥 Fetched stacked data:", res.data.data);
        } catch (err) {
            // console.error("❌ Error fetching stacked AF chart:", err);
        }
    };

    const handleDownloadExcelNewDaily = () => {
        const dataToExport = aftersetBySetterNew
            .filter(item => item.name === selectedBarDataDaily.name)
            .map(item => ({
                Date: new Date(item.date).toLocaleDateString('th-TH'),
                Machine: item.machine,
                Model: item.model || "—",
                NameChange: item.nameChange || "—",
                AF: item.af,
                AftersetBy: item.name
            }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Afterset Details");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(file, `AftersetDetails_${selectedBarDataDaily.name}.xlsx`);
    };
    const handleDownloadExcelNew = () => {
        const dataToExport = aftersetBySetterNew1
            .filter(item => item.name === selectedBarData.name)
            .map(item => ({
                Date: new Date(item.date).toLocaleDateString('th-TH'),
                Machine: item.machine,
                Model: item.model || "—",
                NameChange: item.nameChange || "—",
                AF: item.af,
                AftersetBy: item.name
            }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Afterset Details");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(file, `AftersetDetails_${selectedBarData.name}.xlsx`);
    };

    const handleDownloadExcelNameChange = () => {
        if (!selectedCauseBar || !selectedCauseBar.details) return;

        const rows = selectedCauseBar.details.map((item, index) => ({
            "วันที่": new Date(item.date).toLocaleDateString("th-TH"),
            "Machine": item.machine,
            "Model": item.model || "—",
            "AF": item.af,
            "Name After": item.nameAfter,
            "Name change": selectedCauseBar.name  // ✅ เพิ่ม Name change ที่นี่
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Details');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(blob, `AF_Details_${selectedCauseBar.name}.xlsx`);
    };

    const handleDownloadExcelQuantity = () => {
        if (!selectedBarDataStackedAF || !selectedBarDataStackedAF.details) return;

        const rows = selectedBarDataStackedAF.details.map(item => ({
            "วันที่": new Date(item.date).toLocaleDateString('th-TH'),
            "Name change": selectedBarDataStackedAF.name,  // ✅ เพิ่มบรรทัดนี้
            "Shift": item.shift || "—",
            "Machine": item.machine || "—",
            "Model": item.model || "—",
            "AF1": item.afterset ? `AF1: ${item.nameafterset}` : "—",
            "AF2": item.afterset2 ? `AF2: ${item.nameafterset2}` : "",
            "AF3": item.afterset3 ? `AF3: ${item.nameafterset3}` : "",
            "AF4": item.afterset4 ? `AF4: ${item.nameafterset4}` : "",
            "AF5": item.afterset5 ? `AF5: ${item.nameafterset5}` : ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "T Number Pass");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(file, `TNumber_Pass_${selectedBarDataStackedAF.name}.xlsx`);
    };



    const currentMonth = new Date().getMonth() + 1; // เช่น เม.ย. = 4
    const currentYearMonth = new Date().getFullYear();   // เช่น 2025

    const filteredMonthlyRequests = chartData.monthlyRequests.filter(item => {
        if (!item.month) return false;
        const [year, month] = item.month.split('-').map(Number); // แยก "2025-04"
        return year === currentYearMonth && month === currentMonth;
    });

    const handleDownloadStatusExcel = () => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const exportData = months.map((monthName) => {
            const row = statusMonthlyData.find(r => r.month === monthName); // ✅ ใช้ชื่อเดือน
            return {
                Year: selectedYearStatus,
                Month: monthName,
                "Total Change": row?.total || 0,
                Pass: row?.pass || 0,
                AF: row?.af || 0,
                "%AF": `${(row?.percent_af || 0).toFixed(1)}%`,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Status Summary");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        const filename = `Status_Summary_${selectedYearStatus}_${selectedMachineStatus || "All"}.xlsx`;
        saveAs(blob, filename);
    };


    return (
        <>
                   
                    <div className="admin-container">
                        <div className="admin-dashboard">
                            {/* <AdminHeader countdown={countdown} /> */}

                            <div className="admin-header" id="admin-header">
                                <h1 id="text-h1">
                                    CHANGE TOOL DASHBOARD ⏱<span className='text-black'>{formatTime(countdown)}</span>
                                </h1>
                                <div className="admin-info">
                                    <span className="text-white">Hello {userName}</span> {/* ✅ เปลี่ยนเป็น userName */}
                                    <Link to="/settings">
                                        <button
                                            className="btn btn-danger"> <UndoIcon />
                                            Back
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <Link to="/AdminDashboardSelect">
                                <button className='btn btn-primary'
                                >
                                    <KeyboardBackspaceIcon className='mr-3'/>
                                    Dashboard by machine
                                </button>
                                </Link>
                            </div>

                            <div className="section-container">
                                <div style={sectionHeaderStyle}>
                                    <button
                                        style={toggleButtonStyle}
                                        onClick={() => toggleSection('statsRow1')}
                                    >
                                        {visibleSections.statsRow1 ? '🔽' : '▶️'}
                                    </button>
                                </div>

                                {visibleSections.statsRow1 && (
                                    <div className="dashboard-stats">
                                        <div id="stat-card-request">
                                            <h3 id="text-h3">CHANGE TOOL ALL</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalChange?.toLocaleString()} <ReceiptLongIcon className='icon-request' />
                                            </p>
                                        </div>

                                        <div id="stat-card-pass">
                                            <h3 id="text-h3">PASS</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestFinish?.toLocaleString()} <CheckBoxIcon className='icon-request' />
                                            </p>
                                        </div>

                                        <div id="stat-card-cancel">
                                            <h3 id="text-h3">CANCEL</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestCancel?.toLocaleString()} <DisabledByDefaultIcon className='icon-request' />
                                            </p>
                                        </div>

                                        <div id="stat-card-reject">
                                            <h3 id="text-h3">REJECT</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalRequestReject?.toLocaleString()}  <DisabledByDefaultIcon className='icon-request' />
                                            </p>
                                        </div>
                                        <div id="stat-card-user">
                                            <h3 id="text-h3">USER</h3>
                                            <p className="stat-value" id="stat-card-text">
                                                {stats.totalUsers?.toLocaleString()} <AccountBoxIcon className='icon-request' />
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="charts-section">
                                <div className="charts-row">
                                    <div className="chart-container half-width">
                                        <div id="stat-card-status" >
                                            <h3
                                                id="text-h3-status"
                                                onClick={async () => {
                                                    setShowStatusTable(!showStatusTable);

                                                    if (!showStatusTable) {
                                                        const response = await axios.post(`${config.api_path}/getStatusMonthly`, {
                                                            year: selectedYearStatus,
                                                            machine: selectedMachineStatus,
                                                        });
                                                        const data = response.data || [];
                                                        setStatusMonthlyData(data);
                                                        setChartStatusData(data); // 🎯 ใช้ข้อมูลเดียวกับตาราง
                                                    }
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                STATUS
                                            </h3>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className='span-status'>Change tool</span>
                                                    <div style={{
                                                        background: 'rgb(255, 119, 255)',
                                                        height: '0.625rem',
                                                        width: '100%',
                                                        maxWidth: '30rem',
                                                        borderRadius: '5px',
                                                        marginLeft: '0.65rem'
                                                    }}>
                                                    </div>
                                                    <span style={{ marginLeft: '0.625rem', color: '#ffffff' }}>
                                                        {stats.totalChange?.toLocaleString()} (100%)
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className='span-status'>Pass</span>
                                                    <div style={{ flexGrow: 1, backgroundColor: '#3c3c3c', borderRadius: '5px', margin: '0 0.6rem', height: '0.625rem' }}>
                                                        <div style={{
                                                            background: 'rgb(14, 165, 0)',
                                                            height: '100%',
                                                            width: `${(stats.totalRequestFinish / stats.totalChange) * 100 || 0}%`,
                                                            borderRadius: '5px'
                                                        }}></div>
                                                    </div>
                                                    <span style={{ color: '#ffffff' }}>
                                                        {stats.totalRequestFinish?.toLocaleString()} ({((stats.totalRequestFinish / stats.totalChange) * 100 || 0).toFixed(1)}%)
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className='span-status'>Cancel</span>
                                                    <div style={{
                                                        background: 'rgb(255, 9, 9)',
                                                        height: '0.625rem',
                                                        width: `${(stats.totalRequestCancel / stats.totalChange) * 100 || 0}%`,
                                                        maxWidth: '5rem',
                                                        borderRadius: '5px',
                                                        marginLeft: '0.65rem'
                                                    }}></div>
                                                    <span style={{ marginLeft: '0.625rem', color: '#ffffff' }}>
                                                        {stats.totalRequestCancel?.toLocaleString()} ({((stats.totalRequestCancel / stats.totalChange) * 100 || 0).toFixed(1)}%)
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className='span-status'>Reject</span>
                                                    <div style={{
                                                        background: 'rgb(255, 9, 9)',
                                                        height: '0.625rem',
                                                        width: `${(stats.totalRequestReject / stats.totalChange) * 100 || 0}%`,
                                                        maxWidth: '5rem',
                                                        borderRadius: '5px',
                                                        marginLeft: '0.65rem'
                                                    }}></div>
                                                    <span style={{ marginLeft: '0.625rem', color: '#ffffff' }}>
                                                        {stats.totalRequestReject?.toLocaleString()} ({((stats.totalRequestReject / stats.totalChange) * 100 || 0).toFixed(1)}%)
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className='span-status'>In progress</span>
                                                    <div style={{
                                                        background: 'rgb(255, 255, 0)',
                                                        height: '0.625rem',
                                                        width: `${(stats.totalRequestInProgress / stats.totalChange) * 100 || 0}%`,
                                                        maxWidth: '5rem',
                                                        borderRadius: '5px',
                                                        marginLeft: '0.65rem'
                                                    }}></div>
                                                    <span style={{ marginLeft: '0.625rem', color: '#ffffff' }}>
                                                        {stats.totalRequestInProgress?.toLocaleString()} ({((stats.totalRequestInProgress / stats.totalChange) * 100 || 0).toFixed(1)}%)
                                                    </span>
                                                </div>
                                            </div>
                                            {showStatusTable && (
                                                <>
                                                    <div style={{
                                                        padding: "1rem",
                                                        borderRadius: "10px",
                                                    }}>
                                                        <div className="row mb-2">
                                                            <div className="col-6">
                                                                <label style={{ color: "#000" }}>Year:</label>
                                                                <select
                                                                    className="form-control text-primary"
                                                                    value={selectedYearStatus}
                                                                    onChange={(e) => setSelectedYearStatus(Number(e.target.value))}
                                                                >
                                                                    {yearsAdd.map((y) => (
                                                                        <option key={y} value={y}>{y}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="col-6">
                                                                <label style={{ color: "#000" }}>Machine:</label>
                                                                <select
                                                                    className="form-control text-primary"
                                                                    value={selectedMachineStatus}
                                                                    onChange={(e) => setSelectedMachineStatus(e.target.value)} // ✅ บันทึกค่าที่เลือก                                  
                                                                >
                                                                    <option value="">Machine</option>
                                                                    <option value="CH-">CH</option>
                                                                    <option value="CS-">CS</option>
                                                                    <option value="SB-">SB</option>
                                                                    <option value="TN-">TN</option>
                                                                    <option value="TBS-">TBS</option>
                                                                    <option value="TBM-">TBM</option>
                                                                    <option value="TTC-">TTC</option>
                                                                    <option value="TCH-">TCH</option>
                                                                    <option value="TB-">TB</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <table className="table table-bordered text-dark bg-white">
                                                            <thead>
                                                                <tr>
                                                                    <th>Year</th>
                                                                    <th>Total change</th>
                                                                    <th>Pass</th>
                                                                    <th>AF</th>
                                                                    <th>%AF</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {[
                                                                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                                                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                                                ].map((monthName) => {
                                                                    const row = statusMonthlyData.find(r => r.month === monthName); // ✅ แบบใหม่ ใช้ชื่อเดือน
                                                                    return (
                                                                        <tr key={monthName}>
                                                                            <td>{monthName}</td>
                                                                            <td>{row?.total || 0}</td>
                                                                            <td>{row?.pass || 0}</td>
                                                                            <td>{row?.af || 0}</td>
                                                                            <td>{(row?.percent_af || 0).toFixed(1)}%</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                        <div>
                                                            <button type="button"
                                                                className='btn btn-success'
                                                                onClick={handleDownloadStatusExcel}>
                                                                Download Data Table
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="chart-container half-width">

                                        {chartStatusData.length > 0 && (
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <ComposedChart
                                                    data={chartStatusData}
                                                    margin={{ top: 20, right: 3, left: -20, bottom: 0 }}
                                                    barCategoryGap="20%"
                                                    barGap={6}
                                                    barSize={32}
                                                    style={{ backgroundColor: 'rgb(255, 255, 255)' }} // ✅ เปลี่ยนสีพื้นหลัง
                                                >
                                                    <CartesianGrid stroke="rgb(149, 149, 149)" strokeDasharray="0" vertical={false} />
                                                    <XAxis dataKey="month" tick={{ fontSize: 14, fill: "rgb(0 , 0 , 0)" }} />
                                                    <YAxis tick={{ fontSize: 14, fill: "rgb(0 , 0 , 0)" }} />
                                                    <Tooltip fill="rgb(255, 255, 255)" />
                                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 15 }} />

                                                    <Bar dataKey="total" fill="rgb(0, 4, 255)" name="Total Change">
                                                        <LabelList
                                                            dataKey="total"
                                                            content={({ x, y, width, height, value }) => (
                                                                <text
                                                                    x={x + width / 2}
                                                                    y={y + height / 2}
                                                                    fill="white"
                                                                    fontSize={12}
                                                                    textAnchor="middle"
                                                                    dominantBaseline="middle"
                                                                    transform={`rotate(-90, ${x + width / 2}, ${y + height / 2})`}
                                                                >
                                                                    {value}
                                                                </text>
                                                            )}
                                                        />
                                                    </Bar>
                                                    <Bar dataKey="pass" fill="#0ea500" name="Pass">
                                                        <LabelList
                                                            dataKey="pass"
                                                            content={({ x, y, width, height, value }) => (
                                                                <text
                                                                    x={x + width / 2}
                                                                    y={y + height / 2}
                                                                    fill="white"
                                                                    fontSize={12}
                                                                    textAnchor="middle"
                                                                    dominantBaseline="middle"
                                                                    transform={`rotate(-90, ${x + width / 2}, ${y + height / 2})`}
                                                                >
                                                                    {value}
                                                                </text>
                                                            )}
                                                        />
                                                    </Bar>
                                                    <Bar dataKey="af" fill="#ff0000" name="AF">
                                                        <LabelList
                                                            dataKey="af"
                                                            content={({ x, y, width, height, value }) => (
                                                                <text
                                                                    x={x + width / 2}
                                                                    y={y + height / 2}
                                                                    fill="white"
                                                                    fontSize={12}
                                                                    textAnchor="middle"
                                                                    dominantBaseline="middle"
                                                                    transform={`rotate(-90, ${x + width / 2}, ${y + height / 2})`}
                                                                >
                                                                    {value}
                                                                </text>
                                                            )}
                                                        />
                                                    </Bar>

                                                    <Line
                                                        type="monotone"
                                                        dataKey="af"
                                                        stroke="rgb(255, 0, 0)"
                                                        strokeWidth={2}
                                                        dot={{ r: 3 }}
                                                        activeDot={{ r: 5 }}
                                                        name="AF Line"
                                                    >
                                                        <LabelList dataKey="af" position="top" fill="rgb(0,0,0)" fontSize={12} />
                                                    </Line>
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        )}


                                    </div>

                                </div>
                            </div>


                            <div className="charts-section">

                                {/*---------- Start AF Month ALL MC -----------------------------------------------------------------------*/}

                                <div className="charts-row">
                                    <div className="chart-container half-width">
                                        <h2>Change tool by month</h2>
                                        {chartData.monthlyRequests.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart
                                                    data={chartData.monthlyRequests.filter(item => {
                                                        if (!item.month) return false;
                                                        const [year, month] = item.month.split('-').map(Number);
                                                        return year === new Date().getFullYear() && month === new Date().getMonth() + 1;
                                                    })}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="month"    // ✅ หรือ "name" แล้วแต่ field
                                                        angle={-45}        // ✅ เอียง 45 องศา
                                                        textAnchor="end"   // ✅ ชิดขวา
                                                        height={60}        // ✅ เพิ่มความสูงให้ไม่ชน
                                                    />
                                                    <YAxis />
                                                    <Tooltip content={({ active, payload, label }) => {
                                                        if (active && payload && payload.length) {
                                                            const data = payload[0].payload;
                                                            return (
                                                                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                                                                    <p><strong>{label}</strong></p>
                                                                    <p>Total Change: {data.total}</p>
                                                                    <p>Pass: {data.pass}</p>
                                                                    <p>Cancel: {data.cancel}</p>
                                                                    <p>Reject: {data.reject}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }} />
                                                    <Legend />
                                                    <Bar dataKey="total" fill="rgb(114, 0, 180)">
                                                        <LabelList dataKey="total" position="center" style={{ fill: 'white', fontWeight: 'bold' }} />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p style={{ textAlign: 'center' }}>ไม่มีข้อมูลรายเดือน</p>
                                        )}
                                    </div>

                                    <div className="chart-container half-width">
                                        <h2>Change tool by year</h2>
                                        {yearlyRequests.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={yearlyRequests}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        angle={-45}        // ✅ เอียง 45 องศา
                                                        textAnchor="end"   // ✅ ชิดขวา
                                                        height={10}        // ✅ เพิ่มความสูงให้ไม่ชน
                                                    />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend
                                                        verticalAlign="bottom"  // ให้ไปอยู่ล่างสุด
                                                        align="center"          // ให้อยู่ตรงกลาง
                                                        wrapperStyle={{
                                                            paddingTop: 20        // หรือเพิ่ม Padding ข้างบน
                                                        }}
                                                    />
                                                    <Bar dataKey="value" fill="rgb(255, 0, 128)">
                                                        {/* ✅ เพิ่มตรงนี้ */}
                                                        <LabelList dataKey="value" position="center" style={{ fill: 'black', fontWeight: 'bold' }} />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p style={{ textAlign: 'center' }}>ไม่มีข้อมูลรายปี</p>
                                        )}
                                    </div>
                                </div>

                                {/*---------- End AF Month ALL MC -----------------------------------------------------------------------*/}

                                {/*---------- Start AF CH Chart Daily-----------------------------------------------------------------------*/}
                                <div className="charts-row">

                                    <div className="chart-container half-width">
                                        <h5 id="text-h5">
                                            Daily AF By Setter ({filterMachine || "CH"}) {filterDate ? new Date(filterDate).toLocaleDateString("th-TH") : new Date().toLocaleDateString("th-TH")}
                                        </h5>

                                        <div className="col-3 mb-2">
                                            <select
                                                className="form-control text-primary"
                                                onChange={(e) => setFilterMachine(e.target.value)}
                                            >
                                                <option value="">Machine</option>
                                                <option value="CH-">CH</option>
                                                <option value="CS-">CS</option>
                                                <option value="SB-">SB</option>
                                                <option value="TN-">TN</option>
                                                <option value="TBS-">TBS</option>
                                                <option value="TBM-">TBM</option>
                                                <option value="TTC-">TTC</option>
                                                <option value="TCH-">TCH</option>
                                                <option value="TB-">TB</option>
                                            </select>
                                        </div>

                                        <div className="row mb-2">
                                            <div className="col">
                                                <select className="form-control text-primary" onChange={(e) => setFilterName(e.target.value)}>
                                                    <option value="">Name</option>
                                                    {[...new Set(aftersetBySetterNew.map(d => d.name))].map(name => (
                                                        <option key={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col">
                                                <select className="form-control text-primary" onChange={(e) => setFilterDate(e.target.value)}>
                                                    <option value="">Date</option>
                                                    {[...new Set(aftersetBySetterNew.map(d => d.date))]
                                                        .sort((a, b) => new Date(a) - new Date(b)) // ✅ เรียงก่อน
                                                        .map(date => (
                                                            <option key={date} value={date}>
                                                                {date}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>

                                        {aftersetBySetterNew.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <ComposedChart data={filteredData} onClick={handleBarClickNewDaily}> {/* เพิ่ม onClick */}
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        interval={0}
                                                        height={60}
                                                    />
                                                    <YAxis allowDecimals={false} />
                                                    <Tooltip
                                                        content={({ active, payload, label }) => {
                                                            if (active && payload && payload.length) {
                                                                const data = payload[0].payload;
                                                                return (
                                                                    <div style={{ backgroundColor: "white", padding: 10, border: "1px solid #ccc" }}>
                                                                        <p><strong>Name: {label}</strong></p>
                                                                        <p>Quantity: {data.value}</p>
                                                                        <p>Last date: {data.latestDate ? new Date(data.latestDate).toLocaleDateString('th-TH') : "Null"}</p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar dataKey="value" name="จำนวนการ After Set">
                                                        {filteredData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={getColorFromName(entry.name)} />
                                                        ))}
                                                        {/* ✅ เพิ่ม LabelList ตรงนี้ */}
                                                        <LabelList dataKey="value" position="center" style={{ fill: 'rgb(0, 0, 0)', fontWeight: 'bold' }} />
                                                    </Bar>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        name="Trend"
                                                        stroke="rgb(255, 8, 8)"
                                                        strokeWidth={3}
                                                        dot={{ r: 4 }}
                                                        activeDot={{ r: 5 }}
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p style={{ textAlign: "center" }}>ไม่มีข้อมูล</p>
                                        )}
                                    </div>
                                    {isModalOpenNewDaily && selectedBarDataDaily && (
                                        <div className="modal-overlay-box">
                                            <div className="modal-content-box">
                                                <h3>รายละเอียด After Set: {selectedBarDataDaily.name}</h3>
                                                <ul>
                                                    {selectedBarDataDaily && aftersetBySetterNew
                                                        .filter(item => {
                                                            const itemDate = new Date(item.date).toISOString().split("T")[0];
                                                            const selectedDate = filterDate ? new Date(filterDate).toISOString().split("T")[0] : null;

                                                            return (
                                                                item.name === selectedBarDataDaily.name &&
                                                                (!filterDate || itemDate === selectedDate)
                                                            );
                                                        })
                                                        .map((item, index) => (
                                                            <li key={index}>
                                                                • วันที่: {new Date(item.date).toLocaleDateString('th-TH')},
                                                                Machine: {item.machine},
                                                                Model: {item.model || "—"},
                                                                Name change: {item.nameChange || "—"},
                                                                <strong> {item.af} </strong>,
                                                                By <strong> {item.name} </strong>
                                                            </li>
                                                        ))}
                                                </ul>
                                                <button className="btn btn-danger" onClick={() => setIsModalOpenNewDaily(false)}>
                                                    Close
                                                </button>
                                                <button className="btn btn-success ml-3" onClick={handleDownloadExcelNewDaily}>
                                                    Download excel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/*---------- End AF CH Chart Daily --------------------------------------------------------------------------*/}

                                {/*---------- Start AF CH Chart Week , Month , Year -----------------------------------------------------------------------*/}
                                <div className="charts-row">
                                    <div className="chart-container half-width">
                                        <h5 id="text-h5">
                                            Filter Week/Month/Year AF By Setter ({filterMachine1 || "CH"})
                                        </h5>
                                        <div className="col-3 mb-2">
                                            <select className="form-control text-primary" onChange={(e) => setFilterMachine1(e.target.value)}>
                                                <option value="">Machine</option>
                                                <option value="CH-">CH</option>
                                                <option value="CS-">CS</option>
                                                <option value="SB-">SB</option>
                                                <option value="TN-">TN</option>
                                                <option value="TBS-">TBS</option>
                                                <option value="TBM-">TBM</option>
                                                <option value="TTC-">TTC</option>
                                                <option value="TCH-">TCH</option>
                                                <option value="TB-">TB</option>
                                            </select>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col">
                                                <select className="form-control text-primary" onChange={(e) => setFilterWeek1(e.target.value)}>
                                                    <option value="">Week</option>
                                                    {[1, 2, 3, 4, 5].map(w => (
                                                        <option key={w} value={w}>{w}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col">
                                                <select className="form-control text-primary" onChange={(e) => setFilterMonth1(e.target.value)}>
                                                    <option value="">Month</option>
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col">
                                                <select className="form-control text-primary" onChange={(e) => setFilterYear1(e.target.value)}>
                                                    <option value="">Year</option>
                                                    {[...new Set(aftersetBySetterNew1.map(d => new Date(d.date).getFullYear()))].map(y => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {weekData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <ComposedChart data={weekData} onClick={handleBarClickNew}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        interval={0}
                                                        height={60}
                                                    />
                                                    <YAxis allowDecimals={false} />
                                                    <Tooltip
                                                        content={({ active, payload, label }) => {
                                                            if (active && payload && payload.length) {
                                                                const data = payload[0].payload;
                                                                return (
                                                                    <div style={{ backgroundColor: "white", padding: 10, border: "1px solid #ccc" }}>
                                                                        <p><strong>Name: {label}</strong></p>
                                                                        <p>Quantity: {data.value}</p>
                                                                        <p>Last date: {data.latestDate ? new Date(data.latestDate).toLocaleDateString('th-TH') : "Null"}</p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar dataKey="value"
                                                        name="จำนวนการ After Set" className="bar-shadow-1"
                                                    >
                                                        {weekData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={getColorFromName1(entry.name)} />
                                                        ))}
                                                        <LabelList dataKey="value" position="center" style={{ fill: 'rgb(0, 0, 0)', fontWeight: 'bold' }} />
                                                    </Bar>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        name="Trend"
                                                        stroke="rgb(255, 8, 8)"
                                                        strokeWidth={3}
                                                        dot={{ r: 4 }}
                                                        activeDot={{ r: 5 }}
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p style={{ textAlign: "center" }}>ไม่มีข้อมูล</p>
                                        )}
                                    </div>
                                    {isModalOpenNew && selectedBarData && (
                                        <div className="modal-overlay-box">
                                            <div className="modal-content-box">
                                                <h3>รายละเอียด After Set: {selectedBarData.name}</h3>
                                                <ul>
                                                    {aftersetBySetterNew1
                                                        .filter(item => item.name === selectedBarData.name)
                                                        .map((item, index) => (
                                                            <li key={index}>
                                                                • วันที่: {new Date(item.date).toLocaleDateString('th-TH')}
                                                                , Machine: {item.machine}
                                                                , Model: {item.model || "—"}
                                                                , Name change: {item.nameChange || "—"}
                                                                , <strong>{item.af}</strong>
                                                                , By <strong>{item.name}</strong>
                                                            </li>
                                                        ))}
                                                </ul>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => setIsModalOpenNew(false)}>
                                                    Close
                                                </button>
                                                <button
                                                    className="btn btn-success ml-3"
                                                    onClick={handleDownloadExcelNew}
                                                >
                                                    Download excel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                {/*---------- End AF CH Chart Week , Month , Year -----------------------------------------------------------------------*/}


                                {/*---------- Start Name change -----------------------------------------------------------------------*/}
                                <div className="charts-row">
                                    <div className="chart-container half-width">
                                        <h5 id="text-h5">Total Setter change/% Afterset</h5>
                                        <div className="row mb-2">
                                            <div className="col-3">
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    value={filterMachine}
                                                    onChange={(e) => setFilterMachine(e.target.value)}
                                                >
                                                    <option value="">Machine</option>
                                                    <option value="CH-">CH</option>
                                                    <option value="CS-">CS</option>
                                                    <option value="SB-">SB</option>
                                                    <option value="TN-">TN</option>
                                                    <option value="TBS-">TBS</option>
                                                    <option value="TBM-">TBM</option>
                                                    <option value="TTC-">TTC</option>
                                                    <option value="TCH-">TCH</option>
                                                    <option value="TB-">TB</option>
                                                </select>
                                            </div>

                                            <div className="col-2">
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    value={filterMonthCause}
                                                    onChange={(e) => setFilterMonthCause(e.target.value)}
                                                >
                                                    <option value="">เดือนปัจจุบัน ({months[new Date().getMonth()]})</option>
                                                    {months.map((m, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-2">
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    value={filterYearCause}
                                                    onChange={(e) => setFilterYearCause(Number(e.target.value))}
                                                >
                                                    <option value="">ปีปัจจุบัน ({currentYear})</option>
                                                    {yearsAdd.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                            <div className="col-5">
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    value={filterModel}
                                                    onChange={(e) => setFilterModel(e.target.value)}
                                                >
                                                    <option value="">Model</option>
                                                    {modelList.map((model, index) => (
                                                        <option key={index} value={model}>
                                                            {model}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <ComposedChart
                                                data={chartDataStackedAF}
                                                className="custom-chart"
                                                onClick={handleBarClickStackedAF}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" className="grid-shadow" />
                                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} className="axis-shadow" />
                                                <YAxis className="axis-shadow" />
                                                <Tooltip
                                                    formatter={(value, name, props) => {
                                                        if (name === "Trend") {
                                                            return ["-", name]; // ✅ เปลี่ยนค่าที่แสดงเป็น -
                                                        }
                                                        if (name === "Change Tool") {
                                                            return [`${value}`, "Change Tool"];
                                                        }
                                                        if (name === "After set") {
                                                            return [`${value}`, "After set"];
                                                        }
                                                        return [value, name];
                                                    }}
                                                    labelFormatter={(label) => label}
                                                />
                                                <Legend />

                                                {/* กราฟแท่ง */}
                                                <Bar
                                                    dataKey="totalChanges"
                                                    name="Change Tool"
                                                    stackId="stack"
                                                    fill="rgb(232, 19, 252)"
                                                    minPointSize={1}
                                                    className="bar-shadow"
                                                >
                                                    <LabelList
                                                        dataKey="totalChanges"
                                                        position="center"
                                                        style={{ fill: "white", fontWeight: "bold" }}
                                                    />
                                                </Bar>

                                                <Bar
                                                    dataKey="afterSet"
                                                    name="After set"
                                                    stackId="stack"
                                                    fill="rgb(255, 0, 0)"
                                                    minPointSize={1}
                                                    className="bar-shadow"
                                                >
                                                    <LabelList
                                                        content={({ x, y, width, height, index }) => {
                                                            const person = chartDataStackedAF[index];
                                                            return (
                                                                <text
                                                                    x={x + width / 2}
                                                                    // y={y - 8} // ✅ แสดงข้อความด้านบนแท่ง
                                                                    y={y + height / 2}
                                                                    fill="white"
                                                                    fontSize="12"
                                                                    fontWeight="bold"
                                                                    textAnchor="middle"
                                                                    dominantBaseline="middle"

                                                                >
                                                                    {`${person.afterSet}/${person.percentAF}%`}
                                                                </text>
                                                            );
                                                        }}
                                                    />
                                                </Bar>

                                                {/* ✅ กราฟเส้น ลากที่ยอด */}
                                                <Line
                                                    type="monotone"
                                                    dataKey="totalHeight" // <-- ใช้ field ใหม่ที่สร้าง
                                                    name="Trend"
                                                    stroke="blue"
                                                    strokeWidth={3}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                    label={false}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>

                                    </div>
                                    {isModalOpenStackedAF && selectedBarDataStackedAF && (

                                        <div className="modal-overlay-box">
                                            <div className="modal-content-box">
                                                <h3>รายละเอียด T Number (Pass) ของ {selectedBarDataStackedAF.name}</h3>
                                                <p>รวมทั้งหมด: <strong>{selectedBarDataStackedAF.details?.length || 0}</strong> รายการ</p>
                                                <ul>
                                                    {selectedBarDataStackedAF.details?.length === 0 ? (
                                                        <li>ไม่พบข้อมูลที่ barcode เป็น "Pass"</li>
                                                    ) : (
                                                        selectedBarDataStackedAF.details.map((item, index) => (
                                                            <li key={index}>
                                                                • วันที่: {new Date(item.date).toLocaleDateString('th-TH')},&nbsp;
                                                                Shift: {item.shift || "—"},&nbsp;
                                                                Machine: {item.machine || "—"},&nbsp;
                                                                Model: {item.model || "—"}<br />
                                                                ➤ After set: {
                                                                    [
                                                                        item.afterset && `(${item.afterset}: ${item.nameafterset})`,
                                                                        item.afterset2 && `(${item.afterset2}: ${item.nameafterset2})`,
                                                                        item.afterset3 && `(${item.afterset3}: ${item.nameafterset3})`,
                                                                        item.afterset4 && `(${item.afterset4}: ${item.nameafterset4})`,
                                                                        item.afterset5 && `(${item.afterset5}: ${item.nameafterset5})`
                                                                    ]
                                                                        .filter(Boolean)
                                                                        .join(', ') || "—"
                                                                }
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                                <button className="btn btn-danger" onClick={() => setIsModalOpenStackedAF(false)}>
                                                    Close
                                                </button>
                                                <button className="btn btn-success ml-3" onClick={handleDownloadExcelQuantity}>
                                                    Download excel quantity name change
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="chart-container half-width">
                                        <h5 id="text-h5">Total Setter change/Have After set</h5>
                                        <div className="row mb-2">
                                            <div className='col-3'>
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    value={filterMachine}
                                                    onChange={(e) => setFilterMachine(e.target.value)}
                                                    disabled
                                                >
                                                    <option value="">Machine</option>
                                                    <option value="CH-">CH</option>
                                                    <option value="CS-">CS</option>
                                                    <option value="SB-">SB</option>
                                                    <option value="TN-">TN</option>
                                                    <option value="TBS-">TBS</option>
                                                    <option value="TBM-">TBM</option>
                                                    <option value="TTC-">TTC</option>
                                                    <option value="TCH-">TCH</option>
                                                    <option value="TB-">TB</option>
                                                </select>
                                            </div>
                                            <div className='col-3'>
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    // value={filterMonthCauseLeft}
                                                    // onChange={(e) => setFilterMonthCauseLeft(e.target.value)}
                                                    value={filterMonthCause}
                                                    onChange={(e) => setFilterMonthCause(e.target.value)}

                                                    disabled
                                                >
                                                    <option value="">เดือนปัจจุบัน ({months[new Date().getMonth()]})</option>
                                                    {months.map((m, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col-3'>
                                                <select
                                                    style={{ height: "2.6rem" }}
                                                    className="form-control text-primary"
                                                    // value={filterYearCause}
                                                    // onChange={(e) => setFilterYearCause(Number(e.target.value))}
                                                    value={filterYearCause}
                                                    onChange={(e) => setFilterYearCause(Number(e.target.value))}
                                                    disabled
                                                >
                                                    <option value="">ปีปัจจุบัน ({currentYear})</option>
                                                    {yearsAdd.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {chartDataSetterChange.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <ComposedChart
                                                    // data={filteredChartDataSetterChange.map(item => ({
                                                    //     ...item,
                                                    //     dummyForLine: item.value // ให้เส้นขึ้นไปตามยอดแท่ง
                                                    // }))}
                                                    data={filteredChartDataSetterChange} // ❗ เอา data ตรง ๆ ไม่ต้อง map dummyForLine แล้ว
                                                    onClick={handleCauseBarClick}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                                    <YAxis />
                                                    <Tooltip
                                                        formatter={(value, name, props) => {
                                                            if (name === "Trend AF") {
                                                                return [`Trend AF : ${value}`, name];
                                                            }
                                                            if (name === "AF") {
                                                                return [`AF : Total ${value}`, name];
                                                            }
                                                            return [value, name];
                                                        }}
                                                        labelFormatter={(label, payload) => {
                                                            const data = payload && payload[0] ? payload[0].payload : null;
                                                            return (
                                                                <div>
                                                                    <div><strong>{label}</strong></div>
                                                                    {data && (
                                                                        <>
                                                                            <div>AF : Total {data.value}</div> {/* 🔥 จำนวน After Set จริง */}
                                                                            <div>Trend AF : {data.value}</div>  {/* 🔥 เส้น Trend AF จริง */}
                                                                            <div>Total : Change tool {data.totalChanges || "-"}</div> {/* ✅ แสดง Change Tool */}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Legend />

                                                    {/* แท่งกราฟ */}
                                                    <Bar dataKey="value" name="AF" className="bar-shadow">
                                                        {filteredChartDataSetterChange.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill="#cc0000" />
                                                        ))}
                                                        {/* ✅ เพิ่ม LabelList */}
                                                        <LabelList
                                                            dataKey="value"
                                                            position="center"
                                                            formatter={(value) => `${value}`}
                                                            style={{ fill: "white" }}
                                                        />
                                                    </Bar>

                                                    {/* เส้นกราฟ (ปลอมตำแหน่ง แต่โชว์ค่าแท้) */}
                                                    <Line
                                                        type="monotone"
                                                        // dataKey="dummyForLine"
                                                        // name="Total"
                                                        dataKey="value"         // ✅ เปลี่ยนตรงนี้ !!
                                                        name="Trend AF"         // ✅ เปลี่ยนชื่อใน Legend
                                                        stroke="blue"
                                                        strokeWidth={3}
                                                        dot={{ r: 3 }}
                                                        activeDot={{ r: 5 }}
                                                        label={false}
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>

                                        ) : (
                                            <p style={{ textAlign: 'center' }}>ไม่มีข้อมูล</p>
                                        )}
                                    </div>

                                    {isCauseModalOpen && selectedCauseBar && (() => {
                                        const totalChanges = selectedCauseBar.totalChanges || 0;
                                        const totalAF = selectedCauseBar.value || 0;

                                        return (
                                            <div className="modal-overlay-box">
                                                <div className="modal-content-box">
                                                    <h4>Details of the person who changed T Number: {selectedCauseBar.name} and then After set</h4>

                                                    <p style={{ marginTop: '10px' }}>
                                                        จำนวนการเปลี่ยน T Number ทั้งหมด: <strong>{totalChanges}</strong> ครั้ง<br />
                                                        จำนวนครั้งที่เกิด After Set (AF): <strong>{totalAF}</strong> ครั้ง
                                                    </p>

                                                    <ul>
                                                        {selectedCauseBar.details?.length > 0 ? (
                                                            selectedCauseBar.details.map((item, index) => (
                                                                <li key={index}>
                                                                    วันที่: {new Date(item.date).toLocaleDateString("th-TH")},
                                                                    Machine: {item.machine},
                                                                    Model: {item.model || "—"},
                                                                    เกิด: <strong>{item.af}</strong> โดย: <strong>{item.nameAfter}</strong>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>ไม่พบรายละเอียด</li>
                                                        )}
                                                    </ul>

                                                    <button className="btn btn-danger" onClick={() => setIsCauseModalOpen(false)}>Close</button>
                                                    <button className="btn btn-success ml-3" onClick={handleDownloadExcelNameChange}>
                                                        Download excel Name change
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                </div>
                                {/*---------- Start Name change -----------------------------------------------------------------------*/}

                            </div>
                        </div>
                    </div>
           

        </>

    );
};

export default AdminDashboard;