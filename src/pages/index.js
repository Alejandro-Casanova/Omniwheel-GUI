import React from "react";

const Index = () => {

  return (

    <div className="relative flex flex-wrap">
      <div className="w-full mb-12 px-4 text-white">
        
        <h2 className="text-xl font-bold"> Welcome to the Omniwheel Robot GUI </h2>
        <br/>

        <h3 className="text-lg font-semibold"> The Main Windows are: </h3>

        <ul className="list-disc list-inside whitespace-normal">
          <li><i>Connection View:</i> used for checking the status of the connection with the robot server.</li>
          <li><i>Dashboard View:</i> used for monitoring and controlling all robots globally.</li>
          <li><i>Robot View:</i> used for monitoring and controlling a single robot individually.</li>
        </ul>
        <br/>

        <h3 className="text-lg font-semibold whitespace-normal"> Quick Start: </h3>
        

        <ol className="list-decimal list-inside whitespace-normal">
          <li>Go into the <i>Connection View</i> and check that the robot server is online.</li>
          <li>Go into the <i>Dashboard View</i> and check for available robots.</li>
          <li>Select a Robot from the <i>Available Units</i> table.</li>
          <li>Use the <i>Robot View</i> to control the selected robot.</li>
        </ol>

      </div>
    </div>
    
  )
}

export default Index;