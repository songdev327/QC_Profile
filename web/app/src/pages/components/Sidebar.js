import { Link } from 'react-router-dom';
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import "../../Style.css"


function Sidebar () {

    return (
      <>
        <aside class="main-sidebar sidebar-white elevation-4" id="sidebar-product">
          <a href=" " class="brand-link" id="pos-on-qc">
            {/* <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: '.8'}} /> */}
            <span class="brand-text fw-bold">
              PRODUCTION SYSTEM
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
                  <Link to="/home" className="nav-link">
                    <i className="text-dark nav-icon fas fa-home" id="iconM" />
                    <p className="text-dark fw-bold ml-3">HOME</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/productSelect" class="nav-link">
                    <PrecisionManufacturingIcon
                      className="text-dark fw-bold mr-3"
                      id="iconM"
                    />
                    <p className="text-dark fw-bold mr-3">CHANGE TOOL</p>
                  </Link>
                </li>
                   <li class="nav-item mt-3">
                <Link to="/SelectMachineForProduct" class="nav-link">
                  <FactCheckIcon
                    className="text-dark fw-bold mr-3"
                    id="iconM"
                  />
                  <p className="text-dark fw-bold mr-3">MASTER MODEL</p>
                </Link>
              </li>
                {/* <li class="nav-item">
                  <Link to="/conditionSelect" class="nav-link">
                    <FactCheckIcon
                      className="text-dark fw-bold mr-3"
                      id="iconM"
                    />
                    <p className="text-dark fw-bold mr-3">CONDITION MC</p>
                  </Link>
                </li> */}
             
                <li class="nav-item"></li>
               
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
}

export default Sidebar;