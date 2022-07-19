import React from "react";
import PropTypes from "prop-types";
import ErrorAlert from "./ErrorAlert";
import InfoAlert from "./InfoAlert";
import SuccessAlert from "./SuccessAlert"
import WarningAlert from "./WarningAlert"

export default function DynamicAlert({displayText, type}) {

    switch(type){
        case "Error":
            return <ErrorAlert displayText={displayText} />
        case "Info":
            return <InfoAlert displayText={displayText} />
        case "Success":
            return <SuccessAlert displayText={displayText} />
        case "Warning":
            return <WarningAlert displayText={displayText} />
        default:
            return <ErrorAlert displayText={displayText} />
    }; 
}

DynamicAlert.defaultProps = {
    displayText: "Sample text for Warning Alert!",
    type: "Info",
};
  
DynamicAlert.propTypes = {
    displayText: PropTypes.string,
    type: PropTypes.oneOf(["Error", "Info", "Success", "Warning"]),
};
