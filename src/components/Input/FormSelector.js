import React, { useReducer } from "react";
import PropTypes from "prop-types";
import CartesianForm from "./CartesianForm";
import useWebSocket from "../WebSocket/useWebSocket";

//const forms = ["Motor Speeds", "Robot Speeds", "Robot Position", "Robot Cartesian Position"]

const savedCommandsReducer = (state, action) => {
    const clonedData = [...state]

    clonedData.unshift(action)

    if(clonedData.length > 4){
        clonedData.pop();
    }

    return clonedData;
}

const savedCommandsInit = (initVal) => {
    if (initVal == null){
        return [
            // {cmd_name: "MOT",  cmd_text: "Motor Speeds",  val1: 0, val2: 0, val3: 0},
            // {cmd_name: "VEL",  cmd_text: "Robot Speeds",  val1: 0, val2: 0, val3: 0},
        ];
    }

    return null;
}

const FormSelector = ({
    forms = ["Motor Speeds", "Robot Speeds", "Robot Position", "Robot Cartesian Position"],
    formData = [
        {cmd_name: "MOT",  formName: "mot",  variableName: "Speed (rad/s)",     titleText: "Motor Speeds",             subTitleText: ""},
        {cmd_name: "VEL",  formName: "vel",  variableName: "Speed (mm/s)",     titleText: "Robot Speeds",             subTitleText: ""},
        {cmd_name: "POS",  formName: "pos",  variableName: "Position (mm)",  titleText: "Robot Relative Position",           subTitleText: ""},
        {cmd_name: "POSC", formName: "posc", variableName: "Position",  titleText: "Robot Cartesian Position", subTitleText: ""},
    ], 
    deviceId = null,
}) => {
    const [openTab, setOpenTab] = React.useState(1);
    const [savedCommands, savedCommandsDispatcher] = useReducer(savedCommandsReducer, null, savedCommandsInit)
    const [_dispatch_txData] = useWebSocket();

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
                                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
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
                    
                    {/* <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a
                            className={
                            "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                            (openTab === 1
                                ? "text-white bg-lightBlue-600"
                                : "text-lightBlue-600 bg-white")
                            }
                            onClick={e => {
                            e.preventDefault();
                            setOpenTab(1);
                            }}
                            data-toggle="tab"
                            href="#link1"
                            role="tablist"
                        >
                            Profile
                        </a>
                    </li>
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                    <a
                        className={
                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                        (openTab === 2
                            ? "text-white bg-lightBlue-600"
                            : "text-lightBlue-600 bg-white")
                        }
                        onClick={e => {
                        e.preventDefault();
                        setOpenTab(2);
                        }}
                        data-toggle="tab"
                        href="#link2"
                        role="tablist"
                    >
                        Settings
                    </a>
                    </li>
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                    <a
                        className={
                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                        (openTab === 3
                            ? "text-white bg-lightBlue-600"
                            : "text-lightBlue-600 bg-white")
                        }
                        onClick={e => {
                        e.preventDefault();
                        setOpenTab(3);
                        }}
                        data-toggle="tab"
                        href="#link3"
                        role="tablist"
                    >
                        Options
                    </a>
                    </li> */}
                </div>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-2 shadow-lg rounded">
                    <div className="flex-auto {/*px-4 py-5*/} ">
                        <div className="tab-content tab-space">
                            {
                                formData.map((currentValue, index) => (
                                    <div key={index} className={openTab === (index + 1) ? "block" : "hidden"} id={"link" + (index + 1)}>
                                        <CartesianForm cmd_name={currentValue.cmd_name} formName={currentValue.formName} 
                                            variableName={currentValue.variableName} titleText={currentValue.titleText}
                                            subTitleText={currentValue.subTitleText} 
                                            deviceId={deviceId} sentCommandDispatcher={savedCommandsDispatcher}
                                        />
                                    </div>
                                ))
                            }
                            {/* <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                <p>
                                    Collaboratively administrate empowered markets via
                                    plug-and-play networks. Dynamically procrastinate B2C users
                                    after installed base benefits.
                                    <br />
                                    <br /> Dramatically visualize customer directed convergence
                                    without revolutionary ROI.
                                </p>
                            </div>
                            <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                <p>
                                    Completely synergize resource taxing relationships via
                                    premier niche markets. Professionally cultivate one-to-one
                                    customer service with robust ideas.
                                    <br />
                                    <br />
                                    Dynamically innovate resource-leveling customer service for
                                    state of the art customer service.
                                </p>
                            </div>
                            <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                <p>
                                    Efficiently unleash cross-media information without
                                    cross-media value. Quickly maximize timely deliverables for
                                    real-time schemas.
                                    <br />
                                    <br /> Dramatically maintain clicks-and-mortar solutions
                                    without functional solutions.
                                </p>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-wrap items-center flex-row gap-2 mb-0 list-none pb-4"
                    role="tablist"
                >   
                    <div  className="flex-initial text-center">
                        <button type="submit" 
                            onClick={e => {
                                e.preventDefault();
                                if(deviceId !== null){
                                    _dispatch_txData({
                                        msg_type: "command",
                                        payload: {
                                            rw: "w",
                                            cmd_type: "MOT",
                                            device_id: deviceId,
                                            data: {
                                                value1: 0,
                                                value2: 0,
                                                value3: 0
                                            }
                                        }
                                    })
                                }
                            }}
                            // data-toggle="tab"
                            // href={"#link" + (index + 1)}
                            // role="tablist"
                            className="                        
                                pt-3.5
                                pb-3.5
                                px-4
                                mt-2

                                text-lg
                                font-bold
                                text-white
                                
                                rounded
                                shadow-md
                                bg-red-600
                                hover:bg-red-700 hover:shadow-lg
                                focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0
                                active:bg-red-800 active:shadow-lg
                                transition
                                duration-300
                                ease-in-out" 
                        >
                            STOP
                        </button>
                    </div>
                    {
                        savedCommands.map((currentValue, index) => (
                            <div key={index}  className="flex-initial text-center">
                                <button type="submit" 
                                    onClick={e => {
                                        e.preventDefault();
                                        if(deviceId !== null){
                                            _dispatch_txData({
                                                msg_type: "command",
                                                payload: {
                                                    rw: "w",
                                                    cmd_type: currentValue.cmd_name,
                                                    device_id: deviceId,
                                                    data: {
                                                        value1: currentValue.val1,
                                                        value2: currentValue.val2,
                                                        value3: currentValue.val3
                                                    }
                                                }
                                            })
                                        }
                                    }}
                                    // data-toggle="tab"
                                    // href={"#link" + (index + 1)}
                                    // role="tablist"
                                    className="                        
                                        pt-2
                                        pb-2
                                        px-2
                                        mt-2

                                        text-sm
                                        font-semibold
                                        text-white
                                        
                                        
                                        rounded
                                        shadow-md
                                        bg-blue-600
                                        hover:bg-blue-700 hover:shadow-lg
                                        focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                                        active:bg-blue-800 active:shadow-lg
                                        transition
                                        duration-300
                                        ease-in-out" 
                                >
                                    {currentValue.cmd_text}<br/>
                                    {currentValue.val1 + ":" + currentValue.val2 + ":" + currentValue.val3}
                                </button>
                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
        //</>
    );
};

export default FormSelector;
  
FormSelector.propTypes = {
    forms: PropTypes.arrayOf(PropTypes.string),
    formData: PropTypes.arrayOf(PropTypes.object),
    deviceId: PropTypes.number,
};

