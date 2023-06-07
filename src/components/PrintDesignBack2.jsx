import React, { useEffect, useState } from 'react';
import samplePrint from "../json/Sample_print.json";
import printData from "../json/print_2.json";

const PrintDesign2 = () => {
    const [val, setVal] = useState("1");
    const [space, setSpace] = useState(0);
    const [count, setCount] = useState(0);
    const [background, setBackground] = useState("");
    useEffect(() => {
        let len = 0;
        if (printData[1].length < 15) {
            len = 15 - printData[1].length
            setCount(len)
        } else {
            setCount(0)
        }
        if (printData[0]["PRIORITY"] === "LOW") {
            setBackground("green")
        }
        if (printData[0]["PRIORITY"] === "NORMAL") {
            setBackground("blue")
        }
        if (printData[0]["PRIORITY"] === "HIGH") {
            setBackground("red")
        }
    }, [])

    const handleChange = (e) => {
        setVal(e.target.value)
    }

    useEffect(() => {
        { setSpace(`<div className="container ml_5 border mb_10"></div>`) } { setSpace(+val) }
    }, [val])

    const handleClick = (e) => {
        window.print();
    }


    return (
        <>
            <div className="d_flex m_5 select_box">
                <select onChange={handleChange} value={val}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>
                <button className="m_5" onClick={handleClick}>Print</button>
            </div>
            <div className="d_flex flex_wrap m_5 print_section bag_design_2">
                {Array.from({ length: space }, (_, index) => (
                    index > 0 && <div key={index} className="container_2 ml_2 mb_2 mt_2 pt_2 "></div>
                ))}
                <div className="container_2 ml_2 mb_2 mt_2 pt_2 bag_2">
                    <div className="print_2">
                        <table className="border_collapse print_design_2">
                            <thead>
                                <tr>
                                    <th colSpan={2} className="text_start">ORD: <span style={{ fontWeight: "normal" }}>{printData[0]["Order"]}</span></th>
                                    <th colSpan={2} className="text_start" style={{ color: "red" }}>DUE: <span style={{ fontWeight: "normal" }}>{printData[0]["DUE"]}</span></th>
                                    <th className="text_end"><span style={{ fontWeight: "normal", paddingRight: "5px" }}>1/109925</span></th>
                                    <th colSpan={3} rowSpan={12} style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000" }} className="text_start"><img src={require("../assets/images/LE-3.jpg")} alt="" className="main_img_2" /></th>
                                </tr>
                                <tr>
                                    <th colSpan={5} style={{ height: "2px" }} className="text_start"></th>
                                </tr>
                                <tr>
                                    <th colSpan={3} className="text_start">PARTY: <span style={{ fontWeight: "normal" }} className="text_start">{printData[0]["PARTY"]}</span><span style={{ fontWeight: "normal" }}></span></th>
                                    <th colSpan={2} style={{ paddingRight: "5px", textAlign: "right" }}>{printData[0]["Metal Info"]}</th>
                                </tr>
                                <tr>
                                    <th colSpan={5} style={{ height: "2px" }} className="text_start"></th>
                                </tr>
                                <tr>
                                    <th colSpan={3} className="text_start">DGN: <span style={{ fontWeight: "normal" }}>{printData[0]["Design Info"]}</span><span style={{ fontWeight: "normal" }}></span></th>
                                    <th colSpan={2} className="text_start" style={{ textAlign: "right", paddingRight: "5px" }}>ORD NO:- <span style={{ fontWeight: "normal" }}>{printData[0]["ORD NO"]}</span></th>
                                </tr>
                                <tr>
                                    <th colSpan={5} style={{ height: "2px" }} className="text_start"></th>
                                </tr>
                                <tr>
                                    <th colSpan={1} className="text_start border_bottom">SIZE:<span style={{ fontWeight: "normal" }}>{printData[0]["SIZE"]}</span></th>
                                    <th colSpan={2} className="text_start border_bottom">Order Type: <span style={{ fontWeight: "normal" }}>{printData[0]["ORDER Type"]}</span></th>
                                    <th colSpan={2} className="text_start border_bottom" style={{ background: `${background}`, "textAlign": "center", color: "#fff" }}>{printData[0]["PRIORITY"]}</th>
                                </tr>
                                <tr>
                                    <td className="border_right border_bottom" style={{ width: "200px" }}><span style={{ fontWeight: "bold" }}>NET WT:</span></td>
                                    <td className="border_right border_bottom" style={{ textAlign: "right", width: "150px" }}><span style={{ fontWeight: "normal" }}>{printData[0]["NET WT:"]}</span></td>
                                    <td className="border_right border_bottom" style={{ width: "300px" }}><span style={{ fontWeight: "bold" }}>GR WT</span></td>
                                    <td className="border_bottom" colSpan={2} style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{printData[0]["GR WT:"]}</span></td>
                                </tr>
                                <tr>
                                    <td className="border_right border_bottom"><span style={{ fontWeight: "bold" }}>DIA PCS:</span></td>
                                    <td className="border_right border_bottom" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{printData[0]["DIA PCS:"]}</span></td>
                                    <td className="border_right border_bottom"><span style={{ fontWeight: "bold" }}>DIA WT:</span></td>
                                    <td className="border_bottom" colSpan={2} style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{printData[0]["DIA WT:"]}</span></td>
                                </tr>
                                <tr>
                                    <td className="border_right border_bottom"><span style={{ fontWeight: "bold" }}>CLR PCS:</span></td>
                                    <td className="border_right border_bottom" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{printData[0]["CLR PCS:"]}</span></td>
                                    <td className="border_right border_bottom"><span style={{ fontWeight: "bold" }}>CLR WT:</span></td>
                                    <td className="border_bottom" colSpan={2} style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{printData[0]["CLR WT:"]}</span></td>
                                </tr>
                                <tr>
                                    <td className="border_right border_bottom"><span style={{ fontWeight: "bold" }}>QT NO:</span></td>
                                    <td className="border_right border_bottom" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{printData[0]["QT NO:"]}</span></td>
                                    <td className="border_right border_bottom"><span style={{ fontWeight: "bold" }}>CREAT BY:</span></td>
                                    <td className="border_bottom" colSpan={2}><span style={{ fontWeight: "normal" }}>{printData[0]["CREAT BY:"]}</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border_right border_bottom" style={{ fontWeight: "bold" }}>RM TYPE</td>
                                    <td className="border_right border_bottom" style={{ fontWeight: "bold" }}>QUALITY</td>
                                    <td className="border_right border_bottom" style={{ fontWeight: "bold" }}>COLOR</td>
                                    <td className="border_right border_bottom" style={{ fontWeight: "bold", width: "150px" }}>SIZE</td>
                                    <td className="border_right border_bottom" colSpan={2} style={{ textAlign: "center", fontWeight: "bold" }}>ACTUAL</td>
                                    <td className="border_right border_bottom" style={{ fontWeight: "bold", width: "230px" }}>WT</td>
                                    <td className=" border_bottom position_relative" rowSpan={16} style={{ padding: "0" }}><img src={require("../assets/images/barcode_2.jpg")} className="barcode_2" /></td>
                                </tr>

                                {printData[1].map((e, i) => {
                                    return <tr>
                                        <td className="border_right border_bottom">{e["RM TYPE"]}</td>
                                        <td className="border_right border_bottom">{e["Qulity"]}</td>
                                        <td className="border_right border_bottom">{e["COLOR"]}</td>
                                        <td className="border_right border_bottom">{e["SIZE"]}</td>
                                        <td className="border_right border_bottom">{e["ACTUAL"]}</td>
                                        <td className="border_right border_bottom" style={{ fontWeight: "bold", width: "230px" }}></td>
                                        <td className="border_right border_bottom">{e["WT"]}</td>
                                    </tr>
                                })}
                                {
                                    Array.from({ length: count }, (_, index) => (

                                        <tr>
                                            <td className="border_right border_bottom"></td>
                                            <td className="border_right border_bottom"></td>
                                            <td className="border_right border_bottom"></td>
                                            <td className="border_right border_bottom"></td>
                                            <td className="border_right border_bottom"></td>
                                            <td className="border_right border_bottom" style={{ fontWeight: "bold", width: "230px" }}></td>
                                            <td className="border_right border_bottom"></td>
                                        </tr>
                                    ))
                                }


                            </tbody>
                            <tfoot className="bag_footer_border_remove">
                                <tr className="bag_footer">
                                    <td className="border_right border_bottom bag_td"></td>
                                    <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold" }}>GRAND</td>
                                    <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold" }}>FILLING</td>
                                    <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold" }}>EPD</td>
                                    <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold" }}>P.P.</td>
                                    <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold", width: "200px" }}>SET.</td>
                                    <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold" }}>F.P.</td>
                                    <td className="border_bottom bag_td" style={{ fontWeight: "bold" }}>RHD-QC</td>
                                </tr>
                                {printData[2].map((e, i) => {
                                    return <tr className="bag_footer">
                                        <td className="border_right border_bottom bag_td" style={{ fontWeight: "bold" }}>{e["0"]}</td>
                                        <td className="border_right border_bottom bag_td">{e["GRAND"]}</td>
                                        <td className="border_right border_bottom bag_td">{e["FILLING"]}</td>
                                        <td className="border_right border_bottom bag_td">{e["EPD"]}</td>
                                        <td className="border_right border_bottom bag_td">{e["P.P"]}</td>
                                        <td className="border_right border_bottom bag_td">{e["SET"]}</td>
                                        <td className="border_right border_bottom bag_td">{e["F.P"]}</td>
                                        <td className=" border_bottom bag_td">{e["RHD-QC"]}</td>
                                    </tr>
                                })}
                            </tfoot>
                        </table>
                    </div>
                </div>
              
            </div>
        </>
    )
}

export default PrintDesign2;






/* @font-face {
  font-family: "arial";
  src: url(./assets/fonts/arial);
  font-weight: 100;
}

@font-face {
  font-family: "arial";
  src: url(./assets/fonts/Roboto-Light.ttf);
  font-weight: 300;
}

@font-face {
  font-family: "arial";
  src: url(./assets/fonts/Roboto-Medium.ttf);
  font-weight: 500;
}

@font-face {
  font-family: "arial";
  src: url(./assets/fonts/Roboto-Bold.ttf);
  font-weight: 700;
}

@font-face {
  font-family: "arial";
  src: url(./assets/fonts/Roboto-Regular.ttf);
  font-weight: 400;
}

@font-face {
  font-family: "arial";
  src: url(./assets/fonts/Roboto-Black.ttf);
  font-weight: 900;
} */

/* @font-face {
  font-family: "roboto";
  src: url(./assets/fonts/Roboto-Thin.ttf);
  font-weight: 100;
}

@font-face {
  font-family: "roboto";
  src: url(./assets/fonts/Roboto-Thin.ttf);
  font-weight: 100;
}

@font-face {
  font-family: "roboto";
  src: url(./assets/fonts/Roboto-Thin.ttf);
  font-weight: 100;
} */

// *{
//     box-sizing: border-box;
//   }
  
//   body,
//   p,
//   h1,
//   h2,
//   h3,
//   h4,
//   h5,
//   h6,
//   a,
//   ul,
//   ol {
//     margin: 0;
//     padding: 0;
//     text-decoration: unset;
//     font-size: 8px;
//   }
  
//   img {
//     width: 100%;
//   }
  
//   .align_center {
//     align-items: center;
//   }
  
//   .text_end{
//     text-align: end;
//   }
  
//   p.w_33.bold, .job_no_center > p, .center_item >p {
//     font-size: 11px;
//   }
  
//   .pl_3 {
//     padding-left: 3px;
//   }
  
//   .container {
//     width: 90mm;
//     height: 98mm;
//   }
  
//   .container_2 {
//     width: 95mm;
//     height: 96mm;
//   }
  
//   .m_5 {
//     margin: 5px;
//   }
  
//   .mb_10 {
//     margin-bottom: 10px;
//   }
  
//   .p_3 {
//     padding: 3px;
//   }
//   .p_1 {
//     padding: 1px;
//   }
  
//   .d_flex {
//     display: flex;
//   }
  
//   .justify_content_between {
//     justify-content: space-between;
//   }
  
//   .bold {
//     font-weight: 900;
//   }
  
//   .border {
//     border: 1px solid #000;
//     border-radius: 5px;
//   }
  
//   .print_2 {
//     border: 1px solid #000;
//     border-bottom: 0;
//     border-radius: 5px;
//   }
  
//   .print_text {
//     width: 68mm;
//   }
  
//   .print_photo {
//     width: 23mm;
//   }
  
//   .printhead {
//     height: 5mm;
//     display: flex;
//     border-bottom: 1px solid #000;
//     align-items: center;
//   }
  
//   .printhead_2 {
//     height: 9mm;
//   }
  
//   .w_25 {
//     width: 25%;
//   }
  
//   .w_32_p{
//     width: 32%
//   }
  
//   .w_35_p{
//     width: 35%
//   }
  
//   .semibold{
//     font-weight: 600;
//   }
  
//   .printhead.d_flex > p {
//     font-size: 11px;
//   }
  
//   .w_37_p{
//     width: 37%;
//   }
  
//   .w_13_p{
//     width: 13%;
//   }
  
//   .w-50 {
//     width: 50%;
//   }
  
//   .mt_1 {
//     margin-top: -1px;
//   }
  
//   .w-75 {
//     width: 75%;
//   }
  
//   .medium{
//     font-weight: 500 !important;
//   }
  
//   .bag_footer_border_remove tr:nth-last-child(-n+3) td{
//     border-right: unset;
//   }
  
//   .bag_footer_border_remove tr:nth-last-child(-n+3) td:first-child{
//     color: red;
//   }
  
//   .w-100 {
//     width: 100%;
//   }
  
//   .w_98 {
//     width: 98%;
//   }
  
//   .w_33 {
//     width: 33.33%;
//   }
  
//   .w_20 {
//     width: 20%;
//   }
  
//   .w_50 {
//     width: 50%;
//   }
  
//   .w_30 {
//     width: 30%;
//   }
  
  
  
//   .w_10 {
//     width: 10%;
//   }
  
//   .w_80 {
//     width: 80%;
//   }
  
//   .border_right {
//     border-right: 1px solid #000;
//   }
  
//   .border_bottom {
//     border-bottom: 1px solid #000;
//   }
  
//   .border_top {
//     border-top: 1px solid #000;
//   }
  
//   .border_left {
//     border-left: 1px solid #000;
//   }
  
//   .print_photo img {
//     display: block;
//     width: 86px;
//     height: 86px;
//     border-radius: 5px;
//   }
  
//   .print_table {
//     width: 84mm;
//     height: 59.5mm;
//   }
  
//   .barcode {
//     width: 7mm;
//     height: 59.5mm;
//     position: relative;
//   }
  
//   .print_table table {
//     border-collapse: collapse;
//   }
  
//   .code {
//     width: 34mm;
//   }
  
//   .size {
//     width: 15mm;
//   }
  
//   .pcs {
//     width: 7mm;
//   }
  
//   .wt {
//     width: 8mm;
//   }
  
//   .pcs_2 {
//     width: 9mm;
//   }
  
//   .wt_2 {
//     width: 9.4mm;
//   }
  
//   .footer .upper {
//     height: 5.9mm;
//   }
  
//   .footer .lower {
//     height: 6.9mm;
//   }
  
//   .w_12mm {
//     width: 12mm;
//   }
  
//   .w_10_5mm {
//     width: 10.5mm;
//   }
  
//   .w_42{
//     width: 42%;
//   }
  
//   .w_10 {
//     width: 10mm;
//   }
  
//   .w_13 {
//     width: 13mm;
//   }
  
//   .w_9 {
//     width: 9mm;
//   }
  
//   .h_5 {
//     height: 5mm;
//   }
  
//   .pt_2{
//     padding-top: 2px
//   }
  
//   .align_center{
//     display: flex;
//     align-items: center;
//   }
  
//   .w_12_5mm {
//     width: 12.5mm;
//   }
  
//   .text_center {
//     text-align: center;
//   }
  
//   .text_start {
//     text-align: start;
//   }
  
//   .center_item {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
  
//   .ml_5 {
//     margin-left: 5px;
//   }
  
//   .side_1 {
//     width: 61mm;
//   }
  
//   .side_2 {
//     width: 30mm;
//   }
//   table {
//     position: relative;
//   }
  
//   .border_position {
//     position: absolute;
//     width: 73.8%;
//     height: 1px;
//     left: 0;
//   }
  
//   .border_collapse {
//     border-collapse: collapse;
//   }
  
//   .print_design_2 td,
//   .print_design_2 th {
//     height: 10px;
//     font-size: 6px;
//   }
  
//   /* .barcode img{
//     width: 48px;
//     transform: rotate(90deg) translate(-50%, 0);
//     position: absolute;
//     top: 50%;
//     left: -11px;
//   } */
  
//   .barcode img {
//     width: 139px;
//     height: 23.75px;
//     transform: rotate(90deg) translate(-50%, 0);
//     position: absolute;
//     top: 74%;
//     left: -56.8px;
//   }
  
//   .black{
//     color: #000;
//   }
  
//   .side_2 img {
//     width: 30mm;
//     height: 35.8mm;
//     border-top-right-radius: 5px;
//     position: relative;
//     z-index: 3;
//   }
  
//   .width_66 {
//     width: 20px;
//   }
  
//   .job_no_center {
//     align-items: center;
//     display: flex;
//     padding-left: 3px;
//   }
  
//   .width_6 {
//     width: calc(100% / 6);
//   }
  
//   .h_5 {
//     height: 5mm;
//   }
  
//   .h_88 {
//     height: 7.62mm;
//   }
  
//   .h_8 {
//     height: 8mm;
//   }
  
//   .cvd {
//     width: 23mm;
//     height: 12mm;
//   }
  
//   .dept {
//     width: 84mm;
//   }
  
//   .width_dept {
//     width: 30px;
//   }
  
//   .tr_template_columns{
//     display: grid;
//     grid-template-columns: 105px 41px 30px 50px 50px 50px;
//   }
  
//   .mt_2 {
//     margin-top: -2px;
//   }
  
//   .h_4_5 {
//     height: 4.7mm;
//   }
  
//   .position_relative {
//     position: relative;
//   }
  
//   .barcode_second {
//     position: absolute;
//     height: 59.7mm;
//     right: 0;
//     bottom: 0;
//     width: 7mm;
//     border-left: 1px solid #000;
//     background: #fff;
//     border-bottom-right-radius: 10px;
//   }
  
//   .barcode_second img {
//     transform: rotate(90deg) translate(-50%, 0);
//     width: 141px;
//     height: 23.75px;
//     position: relative;
//     top: 71%;
//     left: -57px;
//   }
  
//   .flex_wrap {
//     flex-wrap: wrap;
//   }
  
//   .h_4 > div {
//     height: 4.04mm;
//     font-size: 9px;
//     font-weight: 700;
//   }
  
//   .mt_10 {
//     margin-top: 15px;
//   }
  
//   .ml_2 {
//     margin-left: 2mm;
//   }
  
//   .bag_design_2 .container_2:nth-child(even){
//     margin-left: 4mm;
//   }
  
//   .bag_design_2 .container_2{
//     margin-bottom: 4mm;
//   }
  
//   .mb_2 {
//     margin-bottom: 2mm;
//   }
  
//   .mt_2 {
//     margin-top: 2mm;
//   }
  
//   .mt_3 {
//     margin-top: 3mm;
//   }
  
//   .pt_2 {
//     padding-top: 2mm;
//   }
  
//   .main_img_2 {
//     width: 91%;
//     margin: 0 auto;
//     display: block;
//   }
  
//   .bag_design_2{
//     margin:  10px;
//   }
  
  
//   .bag_2 .bag_footer > .bag_td {
//     width: 41.73875px;
//     max-width: 41.73875px;
//     min-width: 41.7375px;
//   }
  
//   .grey{
//     color: #8585858a;
//   }
  
//   @media print {
//     .select_box {
//       display: none;
//     }
//   }
  
//   .barcode_2 {
//     transform: rotate(90deg);
//     width: 109px;
//     position: absolute;
//     top: 66px;
//     left: -34px;
//   }
  