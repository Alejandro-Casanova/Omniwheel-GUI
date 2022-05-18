import React from "react";
import PropTypes from "prop-types";

const Input = ({
    iconName = "fas fa-lock", 
    placeholderText = "Default Placeholder", 
    ariaText = "Default ariaText"}) => {

    return (
        <div className="relative flex w-full flex-wrap items-stretch mb-3">
            <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className={iconName}></i>
            </span>
            <input type="text" placeholder={placeholderText} aria-describedby={ariaText} className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10"/>
        </div>
    );
}

export default Input;
  
Input.propTypes = {
    iconName: PropTypes.string,
    placeholderText: PropTypes.string,
    ariaText: PropTypes.string.isRequired,
};
