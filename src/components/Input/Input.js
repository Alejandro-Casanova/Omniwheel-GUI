import React from "react";
import PropTypes from "prop-types";

const Input = ({
    name,
    value,
    onChange,
    iconName = "fas fa-lock", 
    placeholderText = "Default Placeholder", 
    labelText = "Default Label",
    ariaText}) => {

    return (
        <div className="relative flex w-full flex-wrap items-stretch mb-3">
            <span className="z-10 h-full top-8 leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className={iconName}></i>
            </span>
            <label className="w-full text-gray-700">
                {labelText}
                <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholderText} aria-describedby={ariaText} className="px-3 py-3 my-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10"/>
            </label>
        </div>
    );
}

export default Input;
  
Input.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    iconName: PropTypes.string,
    placeholderText: PropTypes.string,
    labelText: PropTypes.string,
    ariaText: PropTypes.string.isRequired,
};
