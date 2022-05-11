import React from "react";
import PropTypes from "prop-types";

const Input = ({}) => {
    return (
        <div></div>
    );
}

export default Input;

Input.defaultProps = {
    iconName: "fas fa-lock",
};
  
Input.propTypes = {
    iconName: PropTypes.string,
};
