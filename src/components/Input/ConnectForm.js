import React, { useCallback, useReducer } from "react";
//import PropTypes from "prop-types";
import Input from "./Input";
//import { useStore } from "../WebSocketStore/WebSocketStore.js";

const initialState = {
    ip: "",
    port: "",
}

const reducer = (state, {field, value}) => {
    return {
        ...state,
        [field]: value
    }
}

const ConnectForm = () => {
    //const {setConnectionData} = useStore();

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSubmit = (e) => {
        //alert('Your favorite flavor is: ' + this.state.value);
        console.log("Submited state: %s", JSON.stringify(state));
        //setConnectionData(state);
        e.preventDefault();
    }

    const onChange = useCallback((e) => {
        dispatch({field: e.target.name, value: e.target.value});
    }, [])

    // useEffect(() => {
    //     console.log("Connect Form State: %s", JSON.stringify(state));
    //     //console.log(state);
        
    // }, [state]);

    return (
        
        <form onSubmit={handleSubmit} className="relative flex flex-wrap place-content-evenly p-6 rounded-lg shadow-lg bg-white w-full">
            <div className="relative lg:flex-1 mx-4 my-1">
                
                    <Input value={state.ip} onChange={onChange} name="ip" iconName="fas fa-network-wired" labelText="IP Address" ariaText="ipAddressHelp" placeholderText="Enter IP Address"  />
                
            </div>
            <div className="relative lg:flex-1 mx-4 my-1">

                    <Input value={state.port} onChange={onChange} name="port" iconName="fas fa-network-wired" labelText="Port Number" ariaText="portNumberHelp" placeholderText="Enter Port Number" />
                
            </div>
            {/* <div className=""></div> */}
            <div className="relative flex justify-center lg:flex-initial m-4 pt-2.5">
                <button type="submit" className="
                    
                    place-self-center
                    py-2.5 px-4

                    text-base
                    font-medium
                    text-white
                    uppercase
                    
                    rounded
                    shadow-md
                    bg-blue-600
                    hover:bg-blue-700 hover:shadow-lg
                    focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                    active:bg-blue-800 active:shadow-lg
                    transition
                    duration-150
                    ease-in-out">
                        Connect
                </button>
            </div>
        </form>
        
    );
}

export default ConnectForm;

// ConnectForm.defaultProps = {
//     iconName: "fas fa-lock",
// };
  
// ConnectForm.propTypes = {
//     iconName: PropTypes.string,
// };
