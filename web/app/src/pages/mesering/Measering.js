import Template from "../components/Template";
import { Link } from "react-router-dom";
import Image1 from "./Capture-snap.PNG";
import BalanceIcon from "@mui/icons-material/Balance";
import "./styleM.css";

function Measering() {

  return (
    <>
      <Template>
        <div className="signup_container d-flex justify-content-center mt-2">
          {/* <div className="register-box"> */}
          <div className="signup_form w-50">
            <div className="card card-outline card-success">
              <div className="card-header text-center" id="">
                <div className="card">
                  <div className="card-header">
                    <h3 className="">
                      <BalanceIcon
                        className="text-dark fw-bold mr-3"
                        id="iconM"
                      />
                      <b className="fw-bold">MEASURING TYPE ACCURACY</b>
                      <img
                        src={Image1}
                        width={600}
                        height={300}
                        className="eqm mt-3"
                      />
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <div className="form-group clearfix">
                          <div className="icheck-primary d-inline">
                            <Link to="/contour" className="nav-link">
                              <button
                                type="button"
                                className="btn mt-3"
                                id="contourM"
                              >
                                CONTOUR
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="form-group clearfix">
                          <div className="icheck-primary d-inline">
                            <Link to="/surfcom" className="nav-link">
                              <button
                                type="button"
                                className="btn mt-3"
                                id="sulfcomM"
                              >
                                SULFCOM
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="form-group clearfix">
                          <div className="icheck-primary d-inline">
                            <Link to="/roncom" className="nav-link">
                              <button
                                type="button"
                                className="btn btn-danger mt-3"
                                id="roncomM"
                              >
                                RONCOM
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="form-group clearfix">
                          <div className="icheck-primary d-inline">
                            <Link to="/talysurf" className="nav-link">
                              <button
                                type="button"
                                className="btn btn-success mt-3"
                                id="talysurfM"
                              >
                                TALYSURF
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </>
  );
}

export default Measering;
