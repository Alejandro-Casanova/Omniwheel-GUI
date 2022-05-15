import React from "react";
//import PropTypes from "prop-types";

const ConnectForm = () => {
    return (
        
            <form className="relative flex flex-wrap items-baseline p-6 rounded-lg shadow-lg bg-white w-full">
                <div className="m-4">
                    <label htmlFor="InputIP" className="inline-block mb-2 text-gray-700">
                        IP Address
                        <input type="text" 
                            className="inline-block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            mt-2
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                            id="InputIP"
                            aria-describedby="ipAddressHelp" 
                            placeholder="Enter IP Address"
                        />
                    </label>
                </div>
                <div className="m-4">
                    <label htmlFor="InputPort" className="inline-block mb-2 text-gray-700">
                        Port Number
                        <input type="text" className="block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            mt-2
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                            id="InputPort"
                            aria-describedby="portNumberHelp" 
                            placeholder="Port Number"
                        />
                    </label>
                </div>
                
                <button type="submit" className="
                    px-6
                    m-4
                    py-2.5
                    bg-blue-600
                    text-white
                    font-medium
                    text-xs
                    leading-tight
                    uppercase
                    rounded
                    shadow-md
                    hover:bg-blue-700 hover:shadow-lg
                    focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                    active:bg-blue-800 active:shadow-lg
                    transition
                    duration-150
                    ease-in-out">
                        Connect
                </button>
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
