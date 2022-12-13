import React, { useCallback, useReducer } from "react";
import PropTypes from "prop-types";
import Input from "./Input";
import useWebSocket from "../WebSocket/useWebSocket";
//import { useStore } from "../Store/Store.jsx";

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

const CartesianForm = ({
    titleText = "Default Title",
    subTitleText = "Default Subtitle",
    formName,
    variableName = "Default",
    cmd_name, // Important: command type sent to proxy
    deviceId = null,
    sentCommandDispatcher,
    

}) => {
    //const {setTxCmdData} = useStore();

    const [state, dispatch] = useReducer(reducer, initialState);
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
                    value1: (state.x_value == "" ? 0 : state.x_value),
                    value2: (state.y_value == "" ? 0 : state.y_value),
                    value3: (state.z_value == "" ? 0 : state.z_value)
                }
            }
        }

        _dispatch_txData(cmd_to_send)
        sentCommandDispatcher({
            cmd_name: cmd_name,
            cmd_text: titleText,
            val1: (state.x_value == "" ? 0 : state.x_value),
            val2: (state.y_value == "" ? 0 : state.y_value),
            val3: (state.z_value == "" ? 0 : state.y_value),
        })
        
    }

    const onChange = useCallback((e) => {
        dispatch({field: e.target.name, value: e.target.value});
    }, []);

    return (
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
    );
}

CartesianForm.propTypes = {
    titleText: PropTypes.string,
    subTitleText: PropTypes.string,
    formName: PropTypes.string.isRequired,
    variableName: PropTypes.string,
    cmd_name: PropTypes.string.isRequired,
    deviceId: PropTypes.number,
    sentCommandDispatcher: PropTypes.func.isRequired,
}

export default CartesianForm;