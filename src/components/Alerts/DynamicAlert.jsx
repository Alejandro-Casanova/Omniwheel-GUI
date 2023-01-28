////////////////////////////////////////////////////////////////////////////
// Displays different alert type depending on argument "type" //////////////
////////////////////////////////////////////////////////////////////////////

import React from "react";
import PropTypes from "prop-types";
import ErrorAlert from "./Basic_Alerts/ErrorAlert";
import InfoAlert from "./Basic_Alerts/InfoAlert";
import SuccessAlert from "./Basic_Alerts/SuccessAlert"
import WarningAlert from "./Basic_Alerts/WarningAlert"

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
