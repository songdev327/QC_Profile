import TemplateQC from "../components/TemplateQC";
import { Link, useNavigate } from "react-router-dom";
import "./ToolQC.css";

function QCSelectCheck() {

  return (
    <>
      <TemplateQC>
        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50" id="record-change-tool-qcCheck">
            <div className="card card-outline card-warnig">
              <div className="card-header text-center" id="record-change-tool-qcSheck">
                <div className="card-title fw-bold">SELECT COMPONENT RECORD CHANGE TOOL</div>
              </div>
              <div className="card-body">
              <Link to="/toolNumberQC">
                <button
                  className="btn btn-secondary"
                >
                  SLEEVE BUSHING CONE
                  <i
                    className="fa fa-cash-register"
                    style={{ marginLeft: "0.625rem" }}
                  ></i>
                </button>
                </Link>
                <Link to="/toolNumberQCShaft">
                  <button
                    className="btn btn-secondary ml-3"
                  >
                    SHAFT CASE
                    <i
                    className="fa fa-cash-register"
                    style={{ marginLeft: "0.625rem" }}
                  ></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </TemplateQC>
    </>
  );
}

export default QCSelectCheck;