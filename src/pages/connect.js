import React from "react";
import { Link } from "gatsby";

import Layout from "../layouts/layout1.js";
import ConnectForm from "../components/Input/ConnectForm.js";

const Connect = () => {
    return (
        <Layout>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <ConnectForm />
                </div>
            </div>
        </Layout>
  );
}

export default Connect;
