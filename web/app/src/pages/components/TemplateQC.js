import NavbarQC from "./NavbarQC";
import SidebarQC from "./SidebarQC";

function TemplateQC (props) {
    return (
        <>
          <div>
            <NavbarQC />
            <SidebarQC />

            <div class="content-wrapper pt-3 ml-2">
                 <section class="content">
                     {props.children}
                 </section>
            </div>
          </div>

        </>
    )
}

export default TemplateQC;