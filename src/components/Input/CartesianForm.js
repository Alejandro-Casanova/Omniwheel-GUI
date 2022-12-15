import React, { useCallback, useReducer } from "react";
import PropTypes from "prop-types";
import Input from "./Input";
import useWebSocket from "../WebSocket/useWebSocket";
//import { useStore } from "../Store/Store.jsx";

const NUM_OF_SAVED_COMMANDS = 6

const initialState = {
    x_value: "",
    y_value: "",
    z_value: ""
}

const reducer = (state, {field, value}) => {
    return {
        ...state,
        [field]: value
    }
}

const savedCommandsReducer = (state, action) => {
    const clonedData = [...state]

    clonedData.unshift(action)

    if(clonedData.length > NUM_OF_SAVED_COMMANDS){
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

const CartesianForm = ({
    titleText = "Default Title",
    subTitleText = "Default Subtitle",
    formName,
    variableName = "Default",
    cmd_name, // Important: command type sent to proxy
    deviceId = null,
    

}) => {
    //const {setTxCmdData} = useStore();

    const [state, dispatch] = useReducer(reducer, initialState);
    
    const [savedCommands, savedCommandsDispatcher] = useReducer(savedCommandsReducer, null, savedCommandsInit)
    const [_dispatch_txData] = useWebSocket();

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert('Your favorite flavor is: ' + this.state.value);
        if(deviceId === null || deviceId === undefined){
            console.log("Could not send command, deviceId: ", deviceId);
            return;
        }
        console.log("Submited state: %s", JSON.stringify(state));

        const cmd_to_send = {
            msg_type: "command",
            payload: {
                rw: "w",
                cmd_type: cmd_name,
                device_id: deviceId,
                data: {
                    value1: (state.x_value === "" ? 0 : parseFloat(state.x_value,10)),
                    value2: (state.y_value === "" ? 0 : parseFloat(state.y_value,10)),
                    value3: (state.z_value === "" ? 0 : parseFloat(state.z_value,10))
                }
            }
        }

        console.log(cmd_to_send)

        _dispatch_txData(cmd_to_send)
        savedCommandsDispatcher({
            cmd_name: cmd_name,
            cmd_text: titleText,
            val1: (state.x_value === "" ? 0 : parseFloat(state.x_value,10)),
            val2: (state.y_value === "" ? 0 : parseFloat(state.y_value,10)),
            val3: (state.z_value === "" ? 0 : parseFloat(state.z_value,10)),
        })
        
    }

    const onChange = useCallback((e) => {
        // Remove all characters that are not numbers
        const numeric_val = e.target.value.match(/^[0-9.-]+/)
        dispatch({field: e.target.name, value: numeric_val ? numeric_val[0] : ""});
    }, []);

    return (
        <div className="flex flex-wrap">
            <div className="w-full bg-red">
                <div className = "relative flex flex-col w-full bg-myGray-2 shadow-lg rounded p-6" >
                    <form onSubmit={handleSubmit} name = {formName} className="relative flex flex-col w-full place-items-center gap-2">
                        <h2 className="text-white text-md uppercase font-bold">
                            {titleText}
                        </h2>      
                        <legend className="mb-2" >{subTitleText}</legend>
                        <fieldset className="flex flex-col flex-wrap place-content-center w-full px-8">
                            {/* <div className="flex flex-col flex-auto"> */}
                                
                            <Input value={state.x_value} onChange={onChange} name="x_value" labelText={"X " + variableName} iconName="fas fa-gear" placeholderText="X Value" ariaText="X Value" />
                                
                            {/* </div> */}
                            {/* <div className="flex flex-col flex-auto"> */}
                                
                                <Input value={state.y_value} onChange={onChange} name="y_value" labelText={"Y " + variableName} iconName="fas fa-gear" placeholderText="Y Value" ariaText="Y Value" />
                                
                            {/* </div> */}
                            {/* <div className="flex flex-col flex-auto"> */}
                                
                                <Input value={state.z_value} onChange={onChange} name="z_value" labelText={"Z " + variableName} iconName="fas fa-gear" placeholderText="Z Value" ariaText="Z Value" />
                                
                            {/* </div> */}
                            {/* <div className="flex flex-col flex-auto place-content-center" style={{"minWidth": "49%"}}> */}
                                <button type="submit" className="
                                
                                    pt-2.5
                                    pb-3
                                    px-2
                                    mt-3

                                    text-base
                                    font-semibold
                                    text-white
                                    uppercase
                                    
                                    rounded
                                    shadow-md
                                    bg-blue-600
                                    hover:bg-blue-700 hover:shadow-lg
                                    focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                                    active:bg-blue-800 active:shadow-lg
                                    transition
                                    duration-300
                                    ease-in-out" >
                                    Send
                                </button>
                                    
                            {/* </div> */}
                            
                        </fieldset>
                    </form>
                </div>

                <div
                    className="relative mb-0 bg-myGray-2 pt-2 mt-4 shadow-lg rounded"
                >  
                    <h2 className="text-white text-md uppercase font-bold w-full text-center pt-3">
                        {"Saved Commands"}
                    </h2>
                    <div
                        className="flex relative items-center flex-row gap-2 list-none pb-4 pt-4 bg-myGray-2 shadow-lg rounded px-2"
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
                                    pt-4
                                    pb-4
                                    px-4
                                    mx-4

                                    text-lg
                                    font-bold
                                    text-white
                                    
                                    rounded
                                    shadow-md
                                    bg-red-700
                                    hover:bg-red-800 hover:shadow-lg
                                    focus:bg-red-800 focus:shadow-lg focus:outline-none focus:ring-0
                                    active:bg-red-900 active:shadow-lg
                                    transition
                                    duration-300
                                    ease-in-out" 
                            >
                                STOP
                            </button>
                        </div>

                        <div
                            className="flex relative flex-wrap items-center flex-row gap-2 list-none pb-2 bg-myGray-2 pt-2 shadow-lg rounded"
                        > 
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
                                            {/* {currentValue.cmd_text}<br/> */}
                                            {currentValue.val1 + " / " + currentValue.val2 + " / " + currentValue.val3}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

CartesianForm.propTypes = {
    titleText: PropTypes.string,
    subTitleText: PropTypes.string,
    formName: PropTypes.string.isRequired,
    variableName: PropTypes.string,
    cmd_name: PropTypes.string.isRequired,
    deviceId: PropTypes.number,
}

export default CartesianForm;