import Template from "./components/Template";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"

function ProductSelect() {

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center">
          <div className="signup_form w-50" id="record-change-tool-1">
            <div className="card card-outline card-warnig">
              <div className="card-header text-center" id="record-change-tool">
                <div className="card-title fw-bold">SELECT COMPONENT RECORD CHANGE TOOL</div>
              </div>
              <div className="card-body">
              <Link to="/product">
                <button
                  className="btn btn-primary"
                >
                  SLEEVE BUSHING CONE
                  <i
                    className="fa fa-cash-register"
                    style={{ marginLeft: "0.625rem" }}
                  ></i>
                </button>
                </Link>
                <Link to="/productShaft">
                  <button
                    className="btn btn-primary ml-3"
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

      </Template>
    </>
  );
}

export default ProductSelect;