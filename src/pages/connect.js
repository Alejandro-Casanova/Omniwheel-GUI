// Connect page, no longer used

import React from "react";
import ProxyConnectionState from "../components/Cards/ProxyConnectionState/ProxyConnectionState.jsx";
import ConnectForm from "../components/Input/ConnectForm.js";

const Connect = () => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full xl:w-6/12 px-4">
                {/* <ConnectForm /> */}
                <ProxyConnectionState color="dark" />
            </div>
        </div>
  );
}

export default Connect;
