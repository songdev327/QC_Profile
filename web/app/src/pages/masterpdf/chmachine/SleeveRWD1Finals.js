import Template from "../../components/Template";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import Modal from "../../components/Modal";
import { Link } from "react-router-dom";
import './showMaster.css'


function SleeveRWD1Finals() {

    const [productImage, setProductImage] = useState({});
    const [productImages, setProductImages] = useState([]);

    const [toolnumber, setToolnumber] = useState('');


    useEffect(() => {

        fetchDataProductImage();

    }, []);

    const handleChangeFile = (files) => {
        // setProductImage(files[0]); ใช้สำหรับ img
        const selectedFile = files[0];
        console.log(files);
        if (selectedFile && selectedFile.type === "application/pdf") {
            setProductImage(selectedFile);
        } else {
            alert("Please select a PDF file.");
        }
    };

    const handleUpload = () => {

        Swal.fire({
            title: "Upload profile",
            text: "โปรดยืนยันการ Up Load file",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {

                    const _config = {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem(config.token_name),
                            "Content-Type": "multipart/form-data",
                        },
                    };

                    const formData = new FormData();
                    formData.append("productImage", productImage);
                    formData.append("productImageName", productImage.name);
                    formData.append("toolnumber", toolnumber);

                    await axios
                        .post(config.api_path + "/productImage/insertRWD1", formData, _config)
                        .then((res) => {
                            if (res.data.message === "success") {
                                Swal.fire({
                                    title: "Upload Profile",
                                    text: "Upload Profile Ok",
                                    icon: "success",
                                    timer: 2000,
                                });
                                window.location.reload();
                                // console.log(formData);
                            }
                        })
                        .catch((err) => {
                            throw err.response.data;
                        });
                } catch (e) {
                    Swal.fire({
                        title: "Error",
                        text: e.message,
                        icon: "error",
                    });
                }
            }
        });
    };
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

    const handleDelete = (item) => {
        console.log('Item to delete:', item);

        if (!item || !item.id) {
            Swal.fire({
                title: 'Error',
                text: 'Invalid item ID',
                icon: 'error'
            });
            return;
        }

        Swal.fire({
            title: 'ลบข้อมูล',
            text: 'ยืนยันการลบข้อมูลออกจากระบบ',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/productImage/deleteRWD1/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'ลบข้อมูล',
                                text: 'ลบข้อมูลแล้ว',
                                icon: 'success',
                                timer: 2000
                            });
                            window.location.reload();
                        }
                    });
                } catch (e) {
                    Swal.fire({
                        title: 'Error',
                        text: e.message,
                        icon: 'error'
                    });
                }
            }
        });
    }


    return (
        <>
            <Template>
                <div className="signup_container d-flex justify-content-center">
                    <div className="signup_form w-50">
                        <div className="card card-outline card-success">
                            <div className="card-header text-center">
                                <div className="card">
                                    <div className="card-header">
                                        <h3>
                                            <b className="fw-bold">Add record PDF sleeve RWD1 Final Cut</b>
                                        </h3>
                                    </div>
                                    <div className="card-footer">
                                        <div className="row">
                                            <div className="col-3">
                                                <button
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#modalProductImage"
                                                    // onClick={handleUpload}
                                                    className="btn btn-success mr-4"
                                                >
                                                    ADD PDF
                                                </button>
                                            </div>

                                            <div className="col-3">
                                                <button
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#modalShowProductImage"
                                                    // onClick={handleUpload}
                                                    className="btn btn-primary ml-5"
                                                >
                                                    OPEN PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-wrapper">
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
                    <table
                        className="mt-3 table table-bordered table-striped"
                        id="table-qc-search"
                    >
                        <thead className="bg-dark" id="table-qc">
                            <tr>
                                <th className="text-white text-center">Date Input</th>
                                <th className="text-white text-center">Tool Number</th>
                                <th className="text-white text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productImages.length > 0
                                ? productImages.map((item) => (
                                    <tr>
                                        <td className="text-center">{item.createdAt.replace("T", " ").substring(0, 16)}</td>
                                        <td className="text-center">{item.toolnumber}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={(e) => handleDelete(item)}
                                                type="button"
                                                className="btn btn-danger"
                                            >
                                                <i className="fa fa-trash mr-2"></i>
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                                : ""}
                        </tbody>
                    </table>
                </div>
            </Template>
            <Modal id="modalProductImage" title="" modalSize="modal-lg">
                <div className="col-12 mb-3" id="add-record-master-pdf">
                    <h3 className="h3">
                        <b className="ml-3">ADD RECORD MASTER PDF RWD1</b>
                    </h3>
                </div>
                <div className="row">
                    <div className="col-2 mt-3">
                        <div className="text-bold pl-2" id="box-2">
                            Tool Number
                        </div>
                        <input
                            onChange={(e) => setToolnumber(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="select..."
                        />
                    </div>

                    <div className="col-7 ml-2 mt-3" id="box-2">
                        <div className="text-bold pl-1 ">Add PDF</div>
                        <input
                            onChange={(e) => handleChangeFile(e.target.files)}
                            type="file"
                            //   accept=".pdf"
                            // name="pdfName"
                            accept="application/pdf"
                            name="imageName1"
                            className="form-control"
                        />
                    </div>

                    {/* {productImage.name !== undefined ? (
            <div>File: {productImage.name}</div>
          ) : (
            ""
          )} */}
                </div>
                <div className="mt-3">
                    <button onClick={handleUpload} className="btn btn-success">
                        Upload PDF
                        <i className="fa fa-cloud-arrow-up ml-3"></i>
                    </button>
                </div>
                <hr className="mt-5">

                </hr>
                {/* <div className="row">
                    {productImages.length > 0
                        ? productImages.map((item) => (
                            <div className="col-12" key={item.imageName1}>

                                <button
                                    className="col-2 btn mt-3 mt-1 ms-5"
                                    id="delete-img"
                                >
                                    Delete PDF
                                </button>

                                <div>
                                    <iframe
                                        style={{ width: "43.75rem", height: "50rem" }}
                                        src={config.api_path + "/uploads/" + item.imageName1}
                                        alt=""
                                    ></iframe>
                                </div>
                            </div>
                        ))
                        : ""}
                </div> */}
            </Modal>
            <Modal id="modalShowProductImage" title="" modalSize="modal-lg">
                <div className="col-12 mb-3" id="add-record-master-pdf">
                    <h3 className="h3">
                        <b className="ml-3">RECORD MASTER PDF RWD1</b>
                    </h3>
                </div>
                <hr className="mt-5">

                </hr>
                <div className="row">
                    {productImages.length > 0
                        ? productImages.map((item) => (
                            <div className="col-12" key={item.imageName}>
                                <div>
                                    <iframe
                                        style={{ width: "43.75rem", height: "50rem" }}
                                        src={config.api_path + "/uploads/" + item.imageName}
                                        alt="">
                                    </iframe>
                                </div>
                            </div>
                        ))
                        : ""}
                </div>
            </Modal>
        </>
    )
}
export default SleeveRWD1Finals;