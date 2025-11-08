import Template from "../components/TemplateQC";
import Select from "react-select";
import config from "../../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import './selectMachine.css'
import TemplateQC from "../components/TemplateQC";

function MachineTBM() {

    const [partModel, setPartModel] = useState('');
    const [process, setProcess] = useState('');
    const [toolnumber, setToolnumber] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [isSearchComplete, setIsSearchComplete] = useState(false);  // state สำหรับควบคุมการแสดงผล
    const [machine_type, setMachine_type] = useState("TBM");  // state สำหรับควบคุม

    useEffect(() => {
        getProcess();
        getToolNumber();
        getPartnameModel();
    }, []);

    const fetchDataProductImage = async () => {
        try {
            const response = await axios.post(config.api_path + "/productImage/searchTBM", {
                process: process.value,
                model: partModel.value,
                machine_type: machine_type
            });

            // ตรวจสอบผลลัพธ์การค้นหา
            if (response.data.message === "success") {
                if (response.data.results.length > 0) {
                    // ถ้ามีข้อมูลในผลลัพธ์การค้นหา
                    setProductImages(response.data.results);
                    setIsSearchComplete(true);  // ตั้งค่าเป็น true เมื่อค้นหาสำเร็จ
                } else {
                    // ถ้าไม่มีข้อมูลที่ตรงกัน ให้แสดงข้อความแจ้งเตือน
                    Swal.fire({
                        title: "No Results Found",
                        text: "ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา",
                        icon: "error",
                        timer: 4000
                    });
                    setIsSearchComplete(false); // รีเซ็ตสถานะการค้นหาให้เป็น false
                    window.location.reload();
                }
            } else {
                // กรณีมี error จากฝั่ง API
                Swal.fire({
                    title: "Error",
                    text: response.data.message || 'Unknown error',
                    icon: "error",
                });
            }
        } catch (e) {
            // กรณี error ที่เกิดจากการเรียก API หรือการเชื่อมต่อ
            Swal.fire({
                title: "Error",
                text: e.response ? e.response.data.message : e.message,
                icon: "error",
            });
        }
    };

    const getProcess = async () => {
        try {
            const response = await axios.get(config.api_path + "/getProcess");
            setProcess(response.data);
        } catch (error) {
            console.error("Error fetching process:", error);
        }
    };

    const getPartnameModel = async () => {
        try {
            const response = await axios.get(config.api_path + "/getPartModelShaft");
            setPartModel(response.data);
        } catch (error) {
            console.error("Error fetching partname:", error);
        }
    };

    const getToolNumber = async () => {
        try {
            const response = await axios.get(config.api_path + "/productImage/getToolNumberTBM");
            setToolnumber(response.data);
        } catch (error) {
            console.error("Error fetching toolnumber:", error);
        }
    };

    const HandelReset = () => {
        window.location.reload();  // รีเฟรชหน้าเพื่อล้างค่าทั้งหมด
    };

    return (
        <>
            <TemplateQC>
                <div className="content-wrapper">
                    <div className="container-fluid" id="list-master-record">
                        <h1 className="" style={{ marginLeft: "10px" }}>
                            TBM List Master Record Change Tool PDF
                        </h1>
                    </div>
                    <hr />

                    {!isSearchComplete && (  // แสดง input เฉพาะถ้ายังไม่ได้ทำการค้นหา
                        <div className="card-body" id="bodySurfcom">
                            <form>
                                <div className="input-group">
                                <div className="col-1">
                                        <label className="ml-1">MACHINE</label>
                                        <input
                                            className="form-control"
                                            value="TBM"
                                            disabled
                                        />
                                    </div>
                                    <div className="col-2">
                                        <label>PROCESS</label>
                                        <Select
                                            options={
                                                process && process.result
                                                    ? process.result.map((item) => ({
                                                        value: item.process,
                                                        label: item.process,
                                                    }))
                                                    : []
                                            }
                                            onChange={(selectedOption) => setProcess(selectedOption)}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label>MODEL</label>
                                        <Select
                                            options={
                                                partModel && partModel.result
                                                    ? partModel.result.map((item) => ({
                                                        value: item.Partname_Model,
                                                        label: item.Partname_Model,
                                                    }))
                                                    : []
                                            }
                                            onChange={(selectedOption) => setPartModel(selectedOption)}
                                        />
                                    </div>
                                    {/* <div className="col-2">
                                        <label>TOOL NUMBER</label>
                                        <Select
                                            options={
                                                toolnumber && toolnumber.result
                                                    ? toolnumber.result.map((item) => ({
                                                        value: item.toolnumber,
                                                        label: item.toolnumber,
                                                    }))
                                                    : []
                                            }
                                            onChange={(selectedOption) => setToolnumber(selectedOption)}
                                        />
                                    </div> */}
                                    <div className="col-1 mt-4">
                                        <button
                                            className="btn btn-primary mt-2"
                                            type="button"
                                            onClick={fetchDataProductImage}
                                        >
                                            Search
                                        </button>
                                    </div>
                                    <div className="col-1 mt-4">
                                        <button
                                            className="btn btn-danger mt-2"
                                            type="button"
                                            onClick={HandelReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            
                {isSearchComplete && (
                    <>
                            {/* Iterate through each product and display table header and corresponding PDF */}
                            {productImages.map((item, index) => (
                                <div key={index} className="pdf-section">
                                <div className="content-wrapper">
                                    <div className="table-wrapper">
                                        <table className="col-6 table table-bordered table-info">
                                            <thead className="bg-dark">
                                                <tr>
                                                    <th className="text-black text-center">MC</th>
                                                    <th className="text-black text-center">Process</th>
                                                    <th className="text-black text-center">Model</th>
                                                    <th className="text-black text-center">Tool Number</th>
                                                    <th className="text-black text-center">Reset</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="text-center">{item.machine_type}</td>
                                                    <td className="text-center">{item.process}</td>
                                                    <td className="text-center">{item.model}</td>
                                                    <td className="text-center">{item.toolnumber}</td>
                                                    <td className="text-center">
                                                        <button className="btn btn-danger" onClick={HandelReset}>
                                                            Reset
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Corresponding PDF viewer */}
                                    <div className="pdf-container">
                                        <iframe
                                            className="pdf-viewer"
                                            src={`${config.api_path}/uploadproduction/${item.imageName}`}
                                            title={item.imageName}
                                        ></iframe>
                                    </div>
                                </div>
                                </div>
                            ))}
                        {/* </div> */}
                    </>
                )}


            </TemplateQC>
        </>
    );
}

export default MachineTBM;