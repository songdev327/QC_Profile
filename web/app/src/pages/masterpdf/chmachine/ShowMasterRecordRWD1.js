import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
// import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { Link } from "react-router-dom";
import './showMaster.css'

function ShowMasterRecordRWD1() {

    const [productImages, setProductImages] = useState([]);

    useEffect(() => {

        fetchDataProductImage();

    }, []);


    const fetchDataProductImage = async () => {
        try {
            //   const headers = config.headers(); // รับ headers เป็น object
            const response = await axios.get(config.api_path + "/productImage/getAllRWD1");

            if (response.data.message === "success") {
                setProductImages(response.data.results);
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.data.message || 'Unknown error',
                    icon: "error",
                });
            }
        } catch (e) {
            Swal.fire({
                title: "Error",
                text: e.response ? e.response.data.message : e.message,
                icon: "error",
            });
        }
    };

    return (
        <>
            <Link to="/SelectMachine" class="ml-3">
                <FactCheckIcon className="text-dark fw-bold mr-3 mt-1"
                    id="iconM" />
            </Link>
            <div className="card-header text-center">
                <div className="container-fluid" id="list-master-record-rwd1">
                    <h1 className="" style={{ marginLeft: "10px" }}>Slv. Rosewood 1D  (Final Cut)</h1>
                </div>
                <hr></hr>

                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {productImages.length > 0
                        ? productImages.map((item) => (
                            <div key={item.id} style={{ margin: '1rem' }}>
                                <iframe
                                    style={{ width: "43.75rem", height: "50rem" }}
                                    src={config.api_path + "/uploads/" + item.imageName}
                                    title={item.imageName}
                                ></iframe>
                            </div>
                        ))
                        : ""}
                </div>

            </div>

        </>
    )
}
export default ShowMasterRecordRWD1;
