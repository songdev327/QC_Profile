import { Link } from "react-router-dom";
import './selectMachine.css'
import Template from "../components/Template";

function SelectMachineForProduct() {
    return (
        <>
            <Template>
                <div className="content-wrapper">
                    <div className="container-fluid" id="list-master">
                        <h1 className="" style={{ marginLeft: "10px" }}>LIST MASTER RECORD CHANGE TOOL PDF ( SLEEVE )</h1>
                    </div>
                    <hr></hr>
                    <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                        <Link to="/MachineCHForProduct">
                            <button
                                className="btn btn-primary" id="button-slv-rwd1">Machine CH154
                            </button>
                        </Link>
                        <Link to="/MachineCSForProduct">
                            <button
                                className="btn btn-primary ml-3" id="button-slv-rwd1">Machine CS
                            </button>
                        </Link>
                        <Link to="/MachineSBForProduct">
                            <button
                                className="btn btn-primary ml-3" id="button-slv-rwd1">Machine SB
                            </button>
                        </Link>
                        <Link to="/MachineTNForProduct">
                            <button
                                className="btn btn-primary ml-3" id="button-slv-rwd1">Machine TN
                            </button>
                        </Link>
                        {/* <Link to="/MachineCH">
                            <button
                                className="btn btn-primary ml-3" id="button-slv-rwd1">Machine CH
                            </button>
                        </Link> */}
                    </div>
                </div>

                <div className="content-wrapper mt-5">
                    <div className="container-fluid" id="list-master">
                        <h1 className="" style={{ marginLeft: "10px" }}>LIST MASTER RECORD CHANGE TOOL PDF ( SHAFT )</h1>
                    </div>
                    <hr></hr>
                    <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                        <Link to="/MachineTBSForProduct">
                            <button
                                className="btn btn-secondary" id="button-slv-rwd1">Machine TBS
                            </button>
                        </Link>
                        <Link to="/MachineTBMForProduct">
                            <button
                                className="btn btn-secondary ml-3" id="button-slv-rwd1">Machine TBM
                            </button>
                        </Link>
                        <Link to="/MachineTTCForProduct">
                            <button
                                className="btn btn-secondary ml-3" id="button-slv-rwd1">Machine TTC
                            </button>
                        </Link>
                        <Link to="/MachineTBForProduct">
                            <button
                                className="btn btn-secondary ml-3" id="button-slv-rwd1">Machine TB
                            </button>
                        </Link>
                        <Link to="/MachineTCHForProduct">
                            <button
                                className="btn btn-secondary ml-3" id="button-slv-rwd1">Machine TCH
                            </button>
                        </Link>
                    </div>
                </div>

            </Template>


        </>
    )
}
export default SelectMachineForProduct;