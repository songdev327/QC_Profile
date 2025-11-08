import { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { Link } from "react-router-dom";
import './setting.css'

function History() {

  const [product, setProduct] = useState({});
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
       const response = await axios.get(config.api_path + "/getDataMC"); // แก้ไข path ของ API ตามที่ใช้งานจริง
       setMachines(response.data); // ตั้งค่า state machines เป็นข้อมูลเครื่องที่ดึงมา
       console.log(response);
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
          config.api_path + "/product/ProductMC",
          { startDate, endDate },
          config.headers()
        )
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
          text: "ค้นหาข้อมูลที่ต้องการสำเร็จ",
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

 const downloadCSV = () => {
     if (!startDate || !endDate) {
       Swal.fire({
         title: "CONFIRM",
         text: "กรุณาใส่วันที่เริ่มและวันที่สิ้นสุด",
         icon: "warning",
       });
       return; 
     }

   const headers = [
     "Barcode",
     "Date",
     "Name",
     "Shift",
     "Machine",
     "Model",
     "Process",
     "Tool No.",
     "AF",
     "Contour",
     "Sulfcom",
     "Roncom",
     "Talysurf",
   ];

   const csvData = [
     headers.join(","),
     ...products.map((item) =>
       [
         item.barcode,
         item.createdAt.replace("T", " ").substring(0, 16),
         item.name,
         item.shift,
         item.machine,
         item.model,
         item.process,
         `${item.t1}-${item.t2}-${item.t3}-${item.t4}-${item.t5}-${item.t6}-${item.t7}-${item.t8}-${item.t9}-${item.t10}-${item.t11}-${item.t12}-${item.t13}-${item.t14}-${item.t15}-${item.t16}-${item.t17}-${item.t18}-${item.t19}-${item.t20}-${item.t21}-${item.t22}-${item.t23}-${item.t24}-${item.t25}-${item.t26}-${item.t27}-${item.t28}-${item.t29}-${item.t30}-${item.t31}-${item.t32}-${item.t33}-${item.t34}-${item.t35}-${item.t36}-${item.t37}-${item.t38}-${item.t39}-${item.t40}-${item.t41}-${item.t42}`,
         item.afterset,
         item.contour,
         item.sulfcom,
         item.roncom,
         item.talysurf,
       ].join(",")
     ),
   ].join("\n");

   const blob = new Blob([csvData], { type: "text/csv" });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.setAttribute("hidden", "");
   a.setAttribute("href", url);
   a.setAttribute("download", "products.csv");
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
 };

 const clearData =()=>{
    window.location.reload();
 }

  return (
    <>
     <div class="m-4 border rounded border-primary p-2">
        <h1 className="text-center text-bold">HISTORY CHANGE TOOL</h1>
     </div>
      <div class="m-4 border rounded border-primary p-4">
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
            <div className="text-bold ml-2">Machine</div>
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
                setProduct({ ...product, machine: selectedOption.value });
              }}
            />
          </div>
        </div>

        <div className="col-6 mt-4">
          <button
            type="button"
            className="btn btn-primary mr-3"
            id="search"
            onClick={() => {
              fetchDataSearch();
            }}
          >
            SEARCH
          </button>
          <button onClick={clearData} className="btn btn-danger ml-3" id="clear">
            CLEAR
          </button>
          <button onClick={downloadCSV} className="btn btn-warning ml-5" id="export">
            EXPORT
          </button>
        </div>
      </div>
      <div className="">
        <Link to='/settings'>
          <button
            type="button"
            className="btn btn-danger"
          >
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
            <th className="text-center text-white">Contour</th>
            <th className="text-center text-white">Sulfcom</th>
            <th className="text-center text-white">Roncom</th>
            <th className="text-center text-white">Talysurf</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0
            ? products.map((item) => (
                <tr>
                  <td
                      className={`
                              ${item.barcode === "Pass" ? "bg-success" : ""}
                              ${item.barcode === "Cancel" ? "bg-danger" : ""}
                              ${item.barcode === "Reject" ? "bg-danger" : ""}
                            `}
                  >
                    {item.barcode}
                  </td>
                  <td>{item.createdAt.replace("T", " ").substring(0, 16)}</td>
                  <td>{item.name}</td>
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
                  <td className="text-danger">{item.remark}</td>
                  <td>{item.afterset}</td>
                  <td
                    className={`${
                      item.contour === "Ok"
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
                    className={`${
                      item.sulfcom === "Ok"
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
                    className={`${
                      item.roncom === "Ok"
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
                    className={`${
                      item.talysurf === "Ok"
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
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </>
  );
}
export default History;
