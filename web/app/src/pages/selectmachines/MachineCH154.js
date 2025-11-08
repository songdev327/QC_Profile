import { Link } from "react-router-dom";
import './selectMachine.css'
import TemplateQC from "../components/TemplateQC";

function MachineCH154() {
    return (
      <>
        <TemplateQC>
          <div className="content-wrapper">
            <div className="container-fluid" id="list-master-record">
              <h1 className="" style={{ marginLeft: "10px" }}>
                {" "}
                CH-154 List Master Record Change Tool PDF
              </h1>
            </div>
            <hr></hr>
            <div style={{ marginLeft: "10px", marginTop: "5px" }}>
              <div className="row">
                <div className="col-12">
                  <Link to="/ShowMasterRecordRWD1">
                    <button className="btn" id="button-machine">
                      SLV RWD1
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordRWD2">
                    <button className="btn ml-2" id="button-machine">
                      SLV RWD2
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordSKB1D">
                    <button className="btn ml-2" id="button-machine">
                      SLV SKB1D
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordX1780">
                    <button className="btn ml-2" id="button-machine">
                      SLV X1780
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordX1930">
                    <button className="btn ml-2" id="button-machine">
                      SLV X1930
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordX2676">
                    <button className="btn ml-2" id="button-machine">
                      SLV X2676
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordX2867">
                    <button className="btn ml-2" id="button-machine">
                      SLV X2867
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordX2977">
                    <button className="btn ml-2" id="button-machine">
                      SLV X2977
                    </button>
                  </Link>
                </div>
                <div className="col-12">
                  <Link to="/ShowMasterRecordAssyCMR4B">
                    <button className="btn mt-5" id="button-machine">
                      SLV Assy CMR4B
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordAssyV112B">
                    <button className="btn mt-5 ml-2" id="button-machine">
                      SLV Assy V112B
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordBushingX1780">
                    <button className="btn mt-5 ml-2" id="button-machine">
                      Bushing X1780
                    </button>
                  </Link>
                  <Link to="/ShowMasterRecordBushingX2867">
                    <button className="btn mt-5 ml-2" id="button-machine">
                      Bushing X2867
                    </button>
                  </Link>
                  <Link to="/ShowMasetRecordAssyV112B1stCut">
                    <button className="btn mt-5 ml-2" id="button-machine">
                      SLV Assy V112B 1st-cut 
                    </button>
                  </Link>
                  <Link to="/ShowMasetRecordAssyCMR4B1stCut">
                    <button className="btn mt-5 ml-2" id="button-machine">
                      SLV Assy CMR4B 1st-cut 
                    </button>
                  </Link>
                  <Link to="/ShowMasetRecordInnerRing">
                    <button className="btn mt-5 ml-2" id="button-machine">
                      Inner Ring 
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
export default MachineCH154;