import Template from "./components/Template";
import Image2 from "./setter3.png";
import "../App.css";

function Home() {
 
  return (
    <>
      <Template>
      <div className="content-wrapper">
              <div className="card-header text-center" id="">
                {/* <div className="card"> */}
                  {/* <div className="card-header"> */}
                    <h3 className="">
                      <img
                        src={Image2}
                        width={1000}
                        height={400}
                        className="eqm1 mt-3"
                        alt=""
                      />
                    </h3>
                  <div className="card-footer"></div>
                </div>
        </div>
      

      </Template>
    </>
  );
}

export default Home;