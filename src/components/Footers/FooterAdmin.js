import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="relative py-4">
        <div className="mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-blueGray-300 font-semibold py-1 text-center md:text-left">
                {/* Copyright © 2022 {" "} */}
                2022 {" "}
                <a
                  href="#inactive"
                  className="text-blueGray-300 hover:text-blueGray-500 text-sm font-semibold py-1"
                >
                  Inordine Labs
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end justify-center">
                {/* <li>
                  <a
                    href="https://www.creative-tim.com?ref=nr-footer-admin"
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                  >
                    Creative Tim
                  </a>
                </li> */}
                <li>
                  <a
                    href="#inactive"
                    className="text-blueGray-300 hover:text-blueGray-500 text-sm font-semibold block py-1 px-3"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#inactive"
                    className="text-blueGray-300 hover:text-blueGray-500 text-sm font-semibold block py-1 px-3"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#inactive"
                    className="text-blueGray-300 hover:text-blueGray-500 text-sm font-semibold block py-1 px-3"
                  >
                    MIT License
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
