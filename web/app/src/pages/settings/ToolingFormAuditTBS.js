import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import Template from "../components/Template";
import { Link } from "react-router-dom";
import UndoIcon from "@mui/icons-material/Undo";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import html2pdf from "html2pdf.js";

function ToolingFormAuditTBS() {
  const location = useLocation();
  const formRef = useRef(); // ใช้ useRef เพื่ออ้างอิงฟอร์ม
  const {
    Machine_Number = "N/A",
    Partname_Model = "N/A",
    process = "N/A",
    tool_no = "N/A",
    part_no = "N/A",
    rev_control = "N/A",
    date_control = "N/A",
    div_control = "N/A",
    specifications = [], // รับข้อมูล array ของ specifications
  } = location.state || {};

  const handleDownloadPDF = () => {
    const element = formRef.current; // อ้างอิงฟอร์มที่จะดาวน์โหลด
    const options = {
      margin: 0,
      filename: "Tooling_Form_Audit_CH.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save(); // ใช้ html2pdf.js แปลงเป็น PDF และดาวน์โหลด
  };

  return (
    <Template>
      <div
        ref={formRef}
        style={{
          padding: "10px",
          maxWidth: "800px",
          margin: "20px auto",
          border: "2px solid black", // เส้นกรอบฟอร์ม
          borderRadius: "10px", // เส้นมุมโค้งของกรอบ
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)", // เพิ่มเงาเล็กน้อยให้ฟอร์ม
          backgroundColor: "#fff", // พื้นหลังฟอร์ม
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            border: "2px solid black", // เพิ่มเส้นขอบสีดำ ความหนา 2px
          }}
        >
          DATA CONFIRM FOR TOOLING CHANGE
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
          border="1"
        >
          <tbody>
            <tr>
              <td style={{ padding: "1px", fontWeight: "bold" }}>
                DATE:___________
              </td>
              <td style={{ padding: "1px", fontWeight: "bold" }}>
                SHIFT:___________
              </td>
              <td style={{ padding: "1px", fontWeight: "bold" }}>
                REQUEST TIME:___________(By Prod.)
              </td>
            </tr>
          </tbody>
        </table>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            // marginBottom: "20px",
          }}
          border="1"
        >
          <tbody>
            <tr>
              <td style={{ padding: "1px", fontWeight: "bold" }}>
                MACHINE NO:
              </td>
              <td style={{ padding: "1px" }}>{Machine_Number}</td>
              <td style={{ padding: "1px", fontWeight: "bold" }}>PART NAME:</td>
              <td style={{ padding: "1px" }}>{Partname_Model}</td>
              <td style={{ padding: "1px", fontWeight: "bold" }}>PROCESS:</td>
              <td>{process}</td>
            </tr>
            <tr>
              <td style={{ padding: "1px", fontWeight: "bold" }}>
                TOOLING NO:
              </td>
              <td style={{ padding: "1px" }}>{tool_no}</td>
              <td style={{ padding: "1px", fontWeight: "bold" }}>Part no:</td>
              <td style={{ padding: "1px" }}>{part_no}</td>
              <td style={{ padding: "1px", fontWeight: "bold" }}>Rev:</td>
              <td style={{ padding: "1px" }}>{rev_control}</td>
            </tr>
          </tbody>
        </table>

        {/* Reason for Change Section */}
        <div style={{ marginBottom: "1px" }}>
          <h6 style={{ fontWeight: "bold", textDecoration: "underline" }}>
            สาเหตุเปลี่ยน Tooling
          </h6>
          <ul style={{ listStyle: "none", paddingLeft: "0" }}>
            <li style={{ marginBottom: "1px" }}>
              <span
                style={{
                  marginRight: "10px",
                  width: "15px", // ขนาดความกว้างของวงกลม
                  height: "15px", // ขนาดความสูงของวงกลม
                  borderRadius: "50%", // ทำให้เป็นวงกลม
                  border: "2px solid black", // เส้นขอบของวงกลม
                  display: "inline-block",
                }}
              ></span>
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "black",
                  marginRight: "10px",
                }}
              ></span>
              หัก / แตก / Burr งานตัวสุดท้าย NG หรือ sensor ไม่ alarm : งานค่า
              Abnormal
            </li>
            <li style={{ marginBottom: "1px" }}>
              <span
                style={{
                  marginRight: "10px",
                  width: "15px", // ขนาดความกว้างของวงกลม
                  height: "15px", // ขนาดความสูงของวงกลม
                  borderRadius: "50%", // ทำให้เป็นวงกลม
                  border: "2px solid black", // เส้นขอบของวงกลม
                  display: "inline-block",
                }}
              ></span>
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  border: "1px solid black",
                  marginRight: "10px",
                }}
              ></span>
              หัก / แตก / Burr sensor alarm : งานตัวสุดท้าย OK แบบใบขาว
              (ไม่ต้องแยกงาน)
            </li>
            <li style={{ marginBottom: "1px" }}>
              <span
                style={{
                  marginRight: "10px",
                  width: "15px", // ขนาดความกว้างของวงกลม
                  height: "15px", // ขนาดความสูงของวงกลม
                  borderRadius: "50%", // ทำให้เป็นวงกลม
                  border: "2px solid black", // เส้นขอบของวงกลม
                  display: "inline-block",
                }}
              ></span>
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  border: "1px solid black",
                  marginRight: "10px",
                }}
              ></span>
              แตก / Burr งานตัวสุดท้าย NG : แยกงานกลางใบ B/Sort Out Spec
            </li>
            <li style={{ marginBottom: "1px" }}>
              <span
                style={{
                  marginRight: "10px",
                  width: "15px", // ขนาดความกว้างของวงกลม
                  height: "15px", // ขนาดความสูงของวงกลม
                  borderRadius: "50%", // ทำให้เป็นวงกลม
                  border: "2px solid black", // เส้นขอบของวงกลม
                  display: "inline-block",
                }}
              ></span>
              <span style={{ marginRight: "10px" }}>
                <span>★</span>
              </span>
              ครบ Usage งานตัวสุดท้าย OK : แบบใบ Change Tool ส่ง QC
            </li>
          </ul>
        </div>

        {/* Specification Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "10px",
          }}
          border="1"
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ textAlign: "center" }}>SPECIFICATION</th>
              <th style={{ textAlign: "center" }}>QC ACTUAL DATA</th>
              <th style={{ textAlign: "center" }}>PASS</th>
              <th style={{ textAlign: "center" }}>REJECT</th>
            </tr>
          </thead>
          <tbody>
            {specifications.length > 0 ? (
              specifications.map((spec, index) => (
                <tr key={index}>
                  <td style={{ padding: "1px" }}>{spec}</td>
                  <td style={{ padding: "1px" }}>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        padding: "1px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  </td>
                  <td style={{ padding: "1px", textAlign: "center" }}>
                    <input type="checkbox" />
                  </td>
                  <td style={{ padding: "1px", textAlign: "center" }}>
                    <input type="checkbox" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ padding: "3px", textAlign: "center", color: "red" }}
                >
                  No Specifications Available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
          border="1"
        >
          <thead>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  border: "1px solid black", // เพิ่มเส้นขอบ
                  width: "38%", // กำหนดความกว้างเท่ากัน
                }}
              >
                CHANGE BY :_____________
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  border: "1px solid black", // เพิ่มเส้นขอบ
                  width: "38%", // กำหนดความกว้างเท่ากัน
                }}
              >
                QC INSPECTION BY :_____________
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  border: "1px solid black", // เพิ่มเส้นขอบ
                  width: "20%", // ปรับให้รวมพื้นที่ทั้งหมด
                }}
              >
                <div
                  style={{
                    display: "flex",
                    // justifyContent: "center",
                  }}
                >
                  {/* สี่เหลี่ยม */}
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      border: "2px solid black",
                      marginRight: "5px", // ระยะห่างระหว่างสี่เหลี่ยมกับข้อความ
                    }}
                  ></div>
                  <div>
                    QC ตรวจสอบ
                    <br />
                    <span>Abnormal Report</span>
                  </div>
                </div>
              </td>
            </tr>
          </thead>
        </table>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
          border="1"
        >
          <thead>
            <tr>
              <span className="spacing"></span>
              <span className="spacing"></span>
              <span className="spacing"></span>
              <span className="spacing"></span>
              <span className="spacing"></span>
              <td style={{ padding: "10px" }}>
                <span style={{ fontWeight: "bold" }}>
                  APPROVE BY :_____________
                </span>
              </td>
              <span className="spacing"></span>
              <span className="spacing"></span>
              <span className="spacing"></span>
              <td style={{ padding: "10px", color: "blue" }}>{date_control}</td>
            </tr>
          </thead>
        </table>

        {/* Note Section */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "12px",
            border: "1px solid black", // เพิ่มเส้นขอบสีดำ
            padding: "10px", // เพิ่ม padding เพื่อให้เนื้อหาดูเป็นระเบียบ
            borderRadius: "5px", // เพิ่มความโค้งเล็กน้อยให้กับขอบ
          }}
        >
          <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
            หมายเหตุ:
          </span>
          <p>
            <ol>
              <li>
                Specification คือ มาตรฐานจากใน Drawing
                ซึ่งเกี่ยวข้องกับการเปลี่ยน Tooling นั้น ๆ
              </li>
              <li>
                QC ต้องระบุ (Pass, Reject) ในแต่ละ Spec ทุกครั้ง / กรณี Data
                Reject ต้องส่งกลับ Production เพื่อทำการแก้ไข
              </li>
              <li>
                Data ต้องส่งกลับให้ฝ่าย Production เพื่อทำการเก็บข้อมูลอย่างน้อย
                1 เดือน
                {/* <span className="spacing">Up date</span>
                {date_control} */}
              </li>
            </ol>
          </p>
        </div>
        <div>
          <span>{div_control} Div.</span>
          <br />
          <span>เอกสารควบคุมเก็บเป็นระยะเวลา 1 เดือน</span>
        </div>
      </div>

      <div className="signup_container d-flex justify-content-center">
        <div className="signup_form w-50">
          <div className="card card-outline">
            <div className="card-header text-center" id="back-audit">
              <div className="row">
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                  }}
                >
                  RECORD : {Machine_Number}
                </span>
                <div className="col-12 mt-3">
                  <button
                    className="col-8"
                    onClick={handleDownloadPDF} // ฟังก์ชันดาวน์โหลด PDF
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Download PDF
                    <DownloadForOfflineIcon className="ml-2" />
                  </button>
                  <Link to="/settings">
                    <button
                      type="button"
                      className="btn btn-danger col-12 mt-3 mb-3"
                    >
                      <UndoIcon className="mr-1" />
                      BACK
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}

export default ToolingFormAuditTBS;
