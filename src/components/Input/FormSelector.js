/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Instantiates several Cartesian Forms and allows selection to send different commands /////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import PropTypes from "prop-types";
import CartesianForm from "./CartesianForm";

const FormSelector = ({
    forms = ["Motor Speeds", "Robot Speeds", "Robot Position", "Robot Cartesian Position"],
    formData = [
        {cmd_name: "MOT",  formName: "mot",  variableName: "Speed (rad/s)",     titleText: "Motor Speeds",              subTitleText: ""},
        {cmd_name: "VEL",  formName: "vel",  variableName: "Speed (mm/s)",      titleText: "Robot Speeds",              subTitleText: ""},
        {cmd_name: "POS",  formName: "pos",  variableName: "Position (mm)",     titleText: "Robot Relative Position",   subTitleText: ""},
        {cmd_name: "POSC", formName: "posc", variableName: "Position (mm)",     titleText: "Robot Absolute Position",   subTitleText: ""},
    ], 
    deviceId = null,
}) => {
    const [openTab, setOpenTab] = React.useState(1);

    console.log("Form Data: ", formData);
    console.log("Forms: ", forms);
    return (
        // <>
        <div className="flex flex-wrap">
            <div className="w-full z-20">
                <div
                    className="flex flex-wrap flex-row gap-2 mb-0 list-none pb-4"
                    role="tablist"
                >   
                    {
                        forms.map((currentValue, index) => (
                            <div key={index}  className="-mb-px mr-0 flex-initial text-center">
                                <a
                                    className={
                                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal outline-none " +
                                        (openTab === (index + 1)
                                            ? "text-white bg-blue-600 //bg-lightBlue-800"
                                            //: "text-lightBlue-600 bg-white"
                                            : "text-blueGray-300 bg-myGray-3"
                                        )
                                    }
                                    onClick={e => {
                                        e.preventDefault();
                                        setOpenTab(index + 1);
                                    }}
                                    data-toggle="tab"
                                    href={"#link" + (index + 1)}
                                    role="tablist"
                                >
                                    {currentValue}
                                </a>
                            </div>
                        ))
                    }
                    
                </div>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg rounded">
                    <div className="flex-auto">
                        <div className="tab-content tab-space">
                            {
                                formData.map((currentValue, index) => (
                                    <div key={index} className={openTab === (index + 1) ? "block" : "hidden"} id={"link" + (index + 1)}>
                                        <CartesianForm cmd_name={currentValue.cmd_name} formName={currentValue.formName} 
                                            variableName={currentValue.variableName} titleText={currentValue.titleText}
                                            subTitleText={currentValue.subTitleText} 
                                            deviceId={deviceId}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormSelector;
  
FormSelector.propTypes = {
    forms: PropTypes.arrayOf(PropTypes.string),
    formData: PropTypes.arrayOf(PropTypes.object),
    deviceId: PropTypes.number,
};

