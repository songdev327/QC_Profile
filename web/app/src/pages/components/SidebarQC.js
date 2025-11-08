import { Link } from "react-router-dom";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import "../../Style.css";

function SidebarQC() {
  return (
    <>
      <aside class="main-sidebar sidebar-white elevation-4" id="sidebar-qc">
        <a href=" " class="brand-link" id="pos-on-qc1">
          {/* <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: '.8'}} /> */}
          <span class="brand-text text-dark fw-bold">
            QC EQUIPMENT SYSTEM
          </span>
        </a>

        <div class="sidebar">
          <nav class="mt-2">
            <ul
              class="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/homeqc" className="nav-link">
                  <i className="text-dark nav-icon fas fa-home" id="iconM" />
                  <p className="text-dark fw-bold ml-3">HOME</p>
                </Link>
              </li>
          
              <li class="nav-item mt-1">
                <Link to="/qcSelectCheck" class="nav-link">
                  <DomainVerificationIcon className="text-dark fw-bold mr-3" id="iconM" />
                  <p className="text-dark fw-bold mr-3">SELECT CHECK</p>
                </Link>
              </li>
           
              <li class="nav-item mt-1">
                <Link to="/SelectMachine" class="nav-link">
                  <FactCheckIcon
                    className="text-dark fw-bold mr-3"
                    id="iconM"
                  />
                  <p className="text-dark fw-bold mr-3">MASTER MODEL</p>
                </Link>
              </li>
              <li class="nav-item mt-4">
                <Link to="/toolQCSearch" class="nav-link">
                  <ManageSearchIcon
                    className="text-dark fw-bold mr-3"
                    id="iconM"
                  />
                  <p className="text-dark fw-bold mr-3">HISTORY SLEEVE</p>
                </Link>
              </li>
              <li class="nav-item mt-1">
                <Link to="/toolQCSearchShaft" class="nav-link">
                  <ManageSearchIcon
                    className="text-dark fw-bold mr-3"
                    id="iconM"
                  />
                  <p className="text-dark fw-bold mr-3">HISTORY SHAFT</p>
                </Link>
              </li>
            
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default SidebarQC;
