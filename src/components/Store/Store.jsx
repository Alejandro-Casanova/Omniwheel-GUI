import React, {createContext} from "react";

///////////////////////////////////////////////////////////////////////
// CONTEXT HANDLING - STORE ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

const storeContext = createContext();
storeContext.displayName = 'StoreContext';

// HOC - HIGH ORDER COMPONENT (check react docs for more info) ACTS AS WRAPPER
// Used in gatsby-browser.jsx
export const withStore = ({element}) => {
  return(
    <MyStore>
      {element}
    </MyStore>
  ) 
}

export const useStore = () => {
  return React.useContext(storeContext);
}

const MyStore = ({children}) => {
  const [selectedDevice, setSelectedDevice] = React.useState(null);
  console.log("Selected device: ", selectedDevice)
  return (
    <storeContext.Provider value={{
      selectedDevice: selectedDevice,
      setSelectedDevice : setSelectedDevice
    }}>
      {children}
    </storeContext.Provider>
  )  
}