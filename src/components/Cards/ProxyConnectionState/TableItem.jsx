import React from "react";
import PropTypes from "prop-types";
import TableDropdown from "./Dropdown";

const TableItem = ({
    color = "dark",
    proxyAddress = "unknown",
    connectionStatus = "unknown",
    timeout = 0
  }) => {
    
    return (
      <tr>

        {/* SERVER ADDRESS */}
        <td className="border-t-0 px-2 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
        >
            <span
              className={
                "font-bold object-left align-middle " +
                (color === "light" ? "text-blueGray-500" : "text-white")
              }
            >
              {proxyAddress}
            </span>
        </td>

        {/* CONNECTION STATUS */}
        <td className="border-t-0 px-2 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
          <i className={"fas fa-circle " + (connectionStatus === "online" ? "text-green-500" : connectionStatus === "offline" ? "text-red-500" : "text-blueGray-500") + " mr-2"}></i> {connectionStatus}
        </td>
  
        {/* LAST ONLINE */}
        <td className="border-t-0 px-2 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
          {timeout + " s"}
        </td>
  
        {/* DROP-DOWN */}
        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
          <TableDropdown />
        </td>
  
      </tr>
    )
  }
  
  TableItem.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
    proxyAddress: PropTypes.string.isRequired,
    connectionStatus: PropTypes.oneOf(["online", "offline", "unknown"]).isRequired,
    timeout: PropTypes.number.isRequired
  };

  export default TableItem;