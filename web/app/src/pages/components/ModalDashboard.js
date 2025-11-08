function ModalDashboard(props) {
  let modalSize = "modal-dialog";
  if (props.modalSize) {
    modalSize += " " + props.modalSize;
  }

  return (
    <>
      <div
        className="modal show"
        id={props.id}
        tabIndex="-1"
        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        aria-labelledby="exampleModalLabel"
        aria-hidden="false"
      >
        <div className={modalSize}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {props.title}
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={props.onClose}
              ></button>
            </div>
           {/* ✅ ให้ modal body scroll ได้ */}
            <div className="modal-body" style={{
              maxHeight: "70vh",
              overflowY: "auto"
            }}>
              {props.children}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

 export default ModalDashboard;
