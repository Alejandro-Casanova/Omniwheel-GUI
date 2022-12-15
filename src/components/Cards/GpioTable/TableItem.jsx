import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image"

import TableDropdown from "./TableDropdown";
import { useStore } from "../../Store/Store.jsx";
import useWebSocket from "../../WebSocket/useWebSocket";

const TableItem = ({
    color,
    gpioName,
    gpioNumber,
    gpioStatus,
  }) => {
    
    [_dispatch_txData] = useWebSocket()
    
    return (
      <tr>

        {/* GPIO NAME */}
        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <span
              className={
              "ml-3 font-bold object-left " +
              (color === "light" ? "text-blueGray-500" : "text-white")
              }
          >
              {gpioName}
          </span>
        </th>
  
        {/* GPIO NUMBER */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          {gpioNumber}
        </td>

        {/* GPIO STATUS */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <i className={"fas fa-circle " + (gpioStatus == 1 ? "text-green-500" : "text-red-500") + " mr-2"}></i>{(gpioStatus == 1 ? "HIGH" : "LOW")}
        </td>
  
        {/* TOGGLE */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        <button type="submit" 
          onClick={e => {
              e.preventDefault();
              if(deviceId !== null){
                  _dispatch_txData({
                      msg_type: "command",
                      payload: {
                          rw: "w",
                          cmd_type: "MOT",
                          device_id: deviceId,
                          data: {
                              value1: 0,
                              value2: 0,
                              value3: 0
                          }
                      }
                  })
              }
          }}
          className="                        
              pt-4
              pb-4
              px-4
              mx-4

              text-lg
              font-bold
              text-white
              
              rounded
              shadow-md
              bg-red-700
              hover:bg-red-800 hover:shadow-lg
              focus:bg-red-800 focus:shadow-lg focus:outline-none focus:ring-0
              active:bg-red-900 active:shadow-lg
              transition
              duration-300
              ease-in-out" 
      >
          TOGGLE
      </button>
        </td>
  
        {/* DROP-DOWN */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
          <TableDropdown />
        </td>
  
      </tr>
    )
  }
  
  TableItem.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
    gpioName: PropTypes.string.isRequired,
    gpioNumber: PropTypes.number.isRequired,
    gpioStatus: PropTypes.number.isRequired,
  };

  export default TableItem;