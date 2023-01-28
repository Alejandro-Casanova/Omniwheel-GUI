import React from "react";
import PropTypes from "prop-types";

const component = ({}) => {
    return (
        <div></div>
    );
}

export default component;

component.defaultProps = {
    iconName: "fas fa-lock",
};
  
component.propTypes = {
    iconName: PropTypes.string,
};
