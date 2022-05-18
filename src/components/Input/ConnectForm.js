import React from "react";
//import PropTypes from "prop-types";
import Input from "./Input";

const ConnectForm = () => {
    return (
        
        <form className="relative flex flex-wrap p-6 rounded-lg shadow-lg bg-white w-full">
            <div className="relative flex flex-col m-4">
                <label htmlFor="InputIP" className="mb-2 text-gray-700">
                    IP Address
                </label>
                {/* <input type="text" 
                    className="
                    w-full

                    px-3
                    py-1.5
                    mt-2

                    text-base
                    font-normal
                    text-gray-700

                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                    id="InputIP"
                    aria-describedby="ipAddressHelp" 
                    placeholder="Enter IP Address"
                /> */}
                <Input iconName = "fas fa-network-wired" ariaText="ipAddressHelp" placeholderText="Enter IP Address"  />
                
            </div>
            <div className="relative flex flex-col m-4">
                <label htmlFor="InputPort" className="mb-2 text-gray-700">
                    Port Number
                </label>        
                {/* <input type="text" className="
                    w-full

                    px-3
                    py-1.5
                    mt-2
                    
                    text-base
                    font-normal
                    text-gray-700

                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                    id="InputPort"
                    aria-describedby="portNumberHelp" 
                    placeholder="Port Number"
                /> */}
                <Input iconName = "fas fa-network-wired" ariaText="portNumberHelp" placeholderText="Port Number" />
            </div>
            {/* <div className=""></div> */}
            <div className="relative flex flex-col justify-end m-4">
                <button type="submit" className="
                    
                    p-2.5 mb-3.5

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
