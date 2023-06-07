import queryString from 'query-string';
import React from 'react'
import { useLocation } from 'react-router-dom';
import PrintDesign from './PrintDesign';
import PrintDesign2 from './PrintDesign2';
import Sample from './Sample';

const AllDesigns = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const printName = queryParams.printname;
  return (
    <div>
        {printName === "BagPrint17" && <PrintDesign />}
        {printName === "BagPrint16" && <PrintDesign2 />}
    </div>
  )
}

export default AllDesigns