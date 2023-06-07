import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PrintDesign2 from "../components/PrintDesign2";
import PrintDesign from "../components/PrintDesign";
import AllDesigns from "../components/AllDesigns";
export const router = createBrowserRouter([
 
    {
        path: "/*",
        element: <><AllDesigns /></>,
    },
   
]);