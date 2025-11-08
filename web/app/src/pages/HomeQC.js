import TemplateQC from "./components/TemplateQC"
import Image1 from "./Capture-snap.PNG";
import "../App.css";

function HomeQC(){
    return(
        <>
          <TemplateQC>
          
          {/* <div className="signup_container d-flex justify-content-center mt-2"> */}
          {/* <div className="register-box"> */}
          {/* <div className="signup_form w-50"> */}
            {/* <div className="card card-outline card-success"> */}
            <div className="content-wrapper">
              <div className="card-header text-center" id="">
                {/* <div className="card"> */}
                  {/* <div className="card-header"> */}
                    <h3 className="">
                      <img
                        src={Image1}
                        width={850}
                        height={570}
                        className="eqm mt-3"
                      />
                    </h3>
                
                  <div className="card-footer"></div>
                </div>
           
        </div>

          </TemplateQC>
        </>
    )
}

export default HomeQC