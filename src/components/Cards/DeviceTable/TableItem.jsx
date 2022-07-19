import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image"

import TableDropdown from "./TableDropdown";
import { useStore } from "../../Store/Store.jsx";

const TableItem = ({
    color,
    deviceName,
    status,
    batteryLevel,
    //imageName, // With extension
    deviceID,
    deviceType,
    //listKey,
  
  }) => {
    const { setSelectedDevice } = useStore();

    const imageDataNodes = useStaticQuery(
      graphql`
          {
            allFile(filter: {relativeDirectory: {eq: "devices"}}) {
              nodes {
                childImageSharp {
                  gatsbyImageData
                }
                base
              }
            }
          }
      `
    ).allFile.nodes
    
    const imageName = (deviceType === "Omniwheel" ? "omniwheel1.jpg" : (deviceType === "Arduino") ? "arduino-mkr-wifi-1010.jpg" : "unknown.jpg")
    const imageData = imageDataNodes.find(element => element.base === imageName);
    //console.log(imageData)
    const imageUnknown = imageDataNodes.find(element => element.base === "unknown.jpg");
    //console.log(imageUnknown)
    //console.log(color)
    
    return (
      <tr>
        <th className=""
            onClick={() => setSelectedDevice((state) => deviceID)}
            //key={listKey}
        >
            <Link 
                className="w-full cursor-pointer border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
                to="/robots"
                //onMouseEnter={() => setExpandShow("")}
                // onMouseLeave={() => setExpandShow("hidden")}
            >

                {/* <img
                    src={require("../../assets/img/arduino-mkr-wifi-1010.jpg").default}
                    className="h-12 w-12 bg-white rounded-full border"
                    alt="..."
                ></img>{" "} */}
                <GatsbyImage
                    //src="../../images/unknown.jpg"
                    //data={imageData}
                    image={(imageData === undefined ? imageUnknown.childImageSharp.gatsbyImageData : imageData.childImageSharp.gatsbyImageData)}
                    className="h-12 w-12 bg-white rounded-full border"
                    //imgClassName="h-12 w-12 bg-white rounded-full border"
                    alt="Device Image"
                    placeholder="blurred"
                    //layout="fullWidth"
                    loading ='eager'
                    // width={1024}
                    // height={1024}
                />
                <span
                    className={
                    "ml-3 font-bold object-left " +
                    (color === "light" ? "text-blueGray-500" : "text-white")
                    }
                >
                    {deviceName}
                </span>

            </Link>
        </th>
  
        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          $2,500 US
          D
        </td> */}
        {/* STATUS */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <i className={"fas fa-circle " + (status === "online" ? "text-green-500" : status === "offline" ? "text-red-500" : "text-blueGray-500") + " mr-2"}></i> {status}
        </td>
  
        {/* BATTERY */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
          <div className="flex items-center">
            <span className="mr-2">{batteryLevel + "%"}</span>
            <div className="relative w-full">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                <div
                  style={{ width: batteryLevel + "%" }}
                  className={"shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center "
                  + ( batteryLevel > 30 ? (batteryLevel > 70 ? "bg-green-500" : "bg-orange-500") : "bg-red-500" )}
                ></div>
              </div>
            </div>
          </div>
        </td>
  
        {/* DROP-DOWN */}
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
          <TableDropdown />
        </td>
  
      </tr>
    )
  }
  
  TableItem.defaultProps = {
    color: "dark",
    deviceName: "defaultName",
    status: "offline",
    batteryLevel: 50,
    //imageName: "unknown.jpg",
    deviceID: -1,
    deviceType: "unknown"
  };
  
  TableItem.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
    deviceName: PropTypes.string,
    status: PropTypes.oneOf(["online", "offline", "unknown"]),
    batteryLevel: PropTypes.number,
    //imageName: PropTypes.string,
    deviceID: PropTypes.number,
    deviceType: PropTypes.string,
    //listKey: PropTypes.number.isRequired,
  };

  export default TableItem;