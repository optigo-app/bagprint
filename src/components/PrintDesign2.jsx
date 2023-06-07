import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import printData from "../json/print_2.json";
import axios from 'axios';
import BarcodeGenerator from './BarcodeGenerator';
import { json, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Loader from './Loader';

const PrintDesign2 = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const [space, setSpace] = useState(0);
    let jobs = queryParams.str_srjobno;
    if (Object.keys(queryParams).length !== 0) {
        jobs = jobs.split(",");
    }
    const [print, setprint] = useState(jobs);
    const [data, setData] = useState([]);
    const [chunkedData, setChunkedData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const chunkSize = 15;
    let queries = {
        YearCode: queryParams.YearCode,
        appuserid: queryParams.appuserid,
        custid: queryParams.custid,
        ifid: queryParams.ifid,
        pid: queryParams.pid,
        printname: queryParams.printname,
        version: queryParams.version,
        url: queryParams.report_api_url,
        pageStart: +(queryParams.start_page)
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': '',
        'YearCode': queries.YearCode,
        'version': queries.version
    }
    useEffect(() => {
        setSpace(`<div class="container ml_5 border_2 mb_10"></div>`);
        setSpace(queries.pageStart);
        if (Object.keys(queryParams).length !== 0) {
            atob(queryParams.imagepath)
        }
        const fetchData = async () => {
            try {
                const responseData = [];
                for (const url of print) {
                    let p_tag = { "SerialJobno": `${url}`, "customerid": `${queries.custid}`, "BagPrintName": `${queries.printname}` };
                    let jsonString = JSON.stringify(p_tag);
                    let base64String = btoa(jsonString);
                    let Body = {
                        "con": `{\"id\":\"\",\"mode\":\"${queries.printname}\",\"appuserid\":\"${queries.appuserid}\"}`,
                        "p": `${base64String}`,
                        "f": `${queries.appuserid} ${queries.printname}`
                    }
                    let urls = atob(queries.url);
                    const response = await axios.post(urls, Body, { headers: headers });
                    let datas = JSON.parse(response.data.d);
                    let length = 0;
                    let clr = {
                        clrPcs: 0,
                        clrWt: 0
                    }
                    let dia = {
                        diaPcs: 0,
                        diaWt: 0
                    }
                    let diamondData = [];
                    let clrData = [];
                    let diamondWeight = 0;
                    let clrWeight = 0;
                    datas.rd1.map((e, i) => {
                        if (e.MasterManagement_DiamondStoneTypeid === 3 || e.MasterManagement_DiamondStoneTypeid === 4) {
                            length++;
                        }
                        if (e.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.diaPcs = dia.diaPcs + e.ActualPcs;
                            dia.diaWt = dia.diaWt + e.ActualWeight;
                            diamondData.push(e);
                            diamondWeight = diamondWeight + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr.clrPcs + e.ActualPcs;
                            clr.clrWt = clr.clrWt + e.ActualWeight;
                            clrData.push(e);
                            clrWeight = clrWeight + e.ActualWeight
                        }
                    });
                    if (diamondData.length > 0) {
                        let diamondDataObject = {
                            ActualPcs: "",
                            ActualWeight: diamondWeight,
                            ColorCode: "",
                            ColorName: "",
                            ConcatedFullShapeQualityColorCode: "",
                            ConcatedFullShapeQualityColorName: "",
                            ConcatedShapeQualityColorName: "",
                            IssuePcs: "",
                            IssueWeight: "",
                            LimitedShapeQualityColorCode: "",
                            MasterManagement_DiamondStoneTypeid: "",
                            MetalColor: "",
                            Quality: "",
                            QualityCode: "",
                            Quality_DisplayOrder: "",
                            SerialJobno: "",
                            Shapecode: "",
                            Shapename: "Total",
                            Size_DisplayOrder: "",
                            Sizename: "",
                            TruncateShapename: ""
                        }
                        diamondData.push(diamondDataObject);
                    }
                    if (clrData.length > 0) {
                        let clrDataObject = {
                            ActualPcs: "",
                            ActualWeight: clrWeight,
                            ColorCode: "",
                            ColorName: "",
                            ConcatedFullShapeQualityColorCode: "",
                            ConcatedFullShapeQualityColorName: "",
                            ConcatedShapeQualityColorName: "",
                            IssuePcs: "",
                            IssueWeight: "",
                            LimitedShapeQualityColorCode: "",
                            MasterManagement_DiamondStoneTypeid: "",
                            MetalColor: "",
                            Quality: "",
                            QualityCode: "",
                            Quality_DisplayOrder: "",
                            SerialJobno: "",
                            Shapecode: "",
                            Shapename: "Total",
                            Size_DisplayOrder: "",
                            Sizename: "",
                            TruncateShapename: ""
                        }
                        clrData.push(clrDataObject);
                    }
                    let originlData = [...diamondData, ...clrData];

                    setOriginalData(originlData);
                    let chData = [];
                    for (let i = 0; i < originlData.length; i += chunkSize) {
                        let len = 15 - (originlData.slice(i, i + chunkSize)).length;
                        chData.push({ data: originlData.slice(i, i + chunkSize), length: len });
                    }
                    setChunkedData(chData);
                    length = 13 - length;
                    let imagePath = queryParams.imagepath;
                    imagePath = atob(queryParams.imagepath);
                    let img = imagePath + datas.rd[0].ThumbImagePath;
                    responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, img: img, chdata: chData } });
                }
                setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleImageError = (e) => {
        e.target.src = require('../assets/images/default.jpg');
    }

    useEffect(() => {
        if (data.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 5000);
        }

    }, [data]);

    return (
        <div>
            {data.length === 0 ? <Loader /> : <>
                <div className="d_flex flex_wrap m_5 print_section bag_design_2"  >
                    {Array.from({ length: space }, (_, index) => (
                        index > 0 && <div key={index} className="container_2 ml_2 mb_2 mt_2 pt_2 bag_2"></div>
                    ))}
                    {data.map((e, i) => {
                        return e.additional.chdata.map((chunk, index) => {
                            return <div className="container_2 ml_2 mb_2 mt_2 pt_2 bag_2" key={index}>
                                <div className="print_2 ">
                                    <div className="border_collapse print_design_2">
                                        <div style={{ justifyContent: "space-between" }} className='d_flex'>
                                            <div className='print_design_2_head'>
                                                <div className='d_flex print_2_head'>
                                                    <div className="text_start pt_2px pl_3">ORD: <span style={{ fontWeight: "normal" }}>
                                                        {e.data.rd[0].OrderDate}
                                                    </span></div>
                                                    <div className="text_start pt_2px" style={{ color: "red" }}>DUE: <span style={{ fontWeight: "normal" }}>{e.data.rd[0].promisedate}</span></div>
                                                    <div className="text_end pt_2px pr_2"><span style={{ fontWeight: "normal", paddingRight: "5px" }}>{e.data.rd[0].serialjobno}</span></div>
                                                </div>
                                                <div className='d_flex print_2_head'>
                                                    <div className="text_start  pl_3">PARTY: <span style={{ fontWeight: "normal" }} className="text_start">{e.data.rd[0].CustomerCode}</span><span style={{ fontWeight: "normal" }}></span></div>
                                                    <div style={{ paddingRight: "5px", textAlign: "right" }}>{e.data.rd[0].MetalType} {" "} {e.data.rd[0].MetalColor}</div>
                                                </div>
                                                <div className='d_flex print_2_head'>
                                                    <div className="text_start  pl_3">DGN: <span style={{ fontWeight: "normal" }}>{e.data.rd[0].Designcode1}{`(${e.data.rd[0].Quantity}PCS)`}</span><span style={{ fontWeight: "normal" }}></span></div>
                                                    <div className="text_start" style={{ textAlign: "right", paddingRight: "5px" }}>ORD NO:- <span style={{ fontWeight: "normal" }}>{e.data.rd[0].OrderNo}</span></div>
                                                </div>
                                                <div className='d_flex print_2_head border_bottom2'>
                                                    <div className="text_start pl_3">SIZE:<span style={{ fontWeight: "normal" }}>{e.data.rd[0].Size}</span></div>
                                                    <div className="text_start">Order Type: <span style={{ fontWeight: "normal" }}>{e.data.rd[0].OrderTypeName}</span></div>
                                                    <div className="text_start" style={{ background: `${e.data.rd[0].prioritycolorcode}`, "textAlign": "center", width: "84px", display: "flex", alignItems: "center", justifyContent: "center" }}>{e.data.rd[0].prioritycode}</div>
                                                </div>
                                                <div className='d_flex print_2_head'>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2" style={{}}><span style={{ fontWeight: "bold" }}>NET WT:</span></div>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2" style={{ textAlign: "right", }}><span style={{ fontWeight: "normal" }}>{e.data.rd[0].netwt}</span></div>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2" style={{}}><span style={{ fontWeight: "bold" }}>GR WT</span></div>
                                                    <div className="pr_3 pl_3 w_25 d_flex align_center border_bottom2" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{e.data.rd[0].ActualGrossweight}</span></div>
                                                </div>
                                                <div className='d_flex print_2_head'>
                                                    <div className=" w_25 pl_3 d_flex align_center border_right2 border_bottom2"><span style={{ fontWeight: "bold" }}>DIA PCS:</span></div>
                                                    <div className=" w_25  pl_3  d_flex align_center border_right2 border_bottom2" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{e.additional.dia.diaPcs}</span></div>
                                                    <div className=" w_25  pl_3  d_flex align_center border_right2 border_bottom2"><span style={{ fontWeight: "bold" }}>DIA WT:</span></div>
                                                    <div className="pr_3   pl_3 w_25 d_flex align_center border_bottom2" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{(e.additional.dia.diaWt).toFixed(4)}</span></div>
                                                </div>
                                                <div className='d_flex print_2_head'>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2"><span style={{ fontWeight: "bold" }}>CLR PCS:</span></div>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{e.additional.clr.clrPcs}</span></div>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2"><span style={{ fontWeight: "bold" }}>CLR WT:</span></div>
                                                    <div className="w_25 pl_3 pr_3 d_flex align_center border_bottom2" style={{ textAlign: "end" }}><span style={{ fontWeight: "normal" }}>{(e.additional.clr.clrWt).toFixed(2)}</span></div>
                                                </div>
                                                <div className='d_flex print_2_head'>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2"><span style={{ fontWeight: "bold" }}>QT NO:</span></div>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2" style={{ textAlign: "right" }}><span style={{ fontWeight: "normal" }}>{e.data.rd[0].QuotationNo}</span></div>
                                                    <div className="w_25 pl_3 d_flex align_center border_right2 border_bottom2"><span style={{ fontWeight: "bold" }}>CREAT BY:</span></div>
                                                    <div className="w_25 pl_3 pr_3 text_end d_flex align_center border_bottom2" ><span style={{ fontWeight: "normal" }}>{e.data.rd[0].createby}</span></div>
                                                </div>
                                            </div>
                                            <div style={{ borderLeft: "2px solid #000", borderBottom: "2px solid #000" }} className="text_start position_relative">
                                                <img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} alt="" className="main_img_2" onError={e => handleImageError(e)} loading="lazy" />
                                            </div>
                                        </div>
                                        <div className='border_bottom_0'>
                                            <div className='d_flex'>
                                                <div className="border_right2 border_bottom2 display" style={{ height: "14px", fontWeight: "900", paddingLeft: "3px", width: "49.36px" }}>RM TYPE</div>
                                                <div className="border_right2 border_bottom2 display" style={{ height: "14px", fontWeight: "900", paddingLeft: "3px", width: "45.36px" }}>QUALITY</div>
                                                <div className="border_right2 border_bottom2 display" style={{ height: "14px", fontWeight: "900", paddingLeft: "3px", width: "45.36px" }}>COLOR</div>
                                                <div className="border_right2 border_bottom2 display" style={{ height: "14px", fontWeight: "900", paddingLeft: "3px", width: "61.36px" }}>SIZE</div>
                                                <div className="border_right2 border_bottom2 display" style={{ height: "14px", fontWeight: "900", textAlign: "center", paddingLeft: "3px", width: "71.78px" }}>ACTUAL</div>
                                                <div className="border_right2 border_bottom2 display" style={{ height: "14px", fontWeight: "900", paddingLeft: "3px", width: "39.36px" }}>WT</div>
                                                <div className=" border_bottom2 position_relative barcode_design_2" rowSpan={16} style={{ padding: "0" }}>
                                                    {e.data.rd1[0].SerialJobno !== undefined && <BarcodeGenerator data={e.data.rd1[0].SerialJobno} />}
                                                </div>
                                            </div>
                                          
                                            {chunk.data.map((e, i) => {
                                                return <div className='d_flex' key={i}>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "49.36px", fontWeight: "bold", fontSize: "7px", height: "14px", paddingRight: "5px", paddingLeft: "3px" }}>{e.Shapename}</div>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "45.36px", fontWeight: "bold", paddingRight: "3px", paddingLeft: "3px", fontSize: "7px", height: "14px", textAlign: "end", lineClamp: "1", boxOrient: 'vertical', overflow: "hidden" }}>{e.Quality}</div>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "45.36px", fontWeight: "bold", fontSize: "7px", height: "14px", textAlign: "end", paddingRight: "5px", paddingLeft: "5px" }}>{e.MetalColor}</div>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "61.36px", fontWeight: "bold", fontSize: "7px", height: "14px", textAlign: "end", paddingRight: "1.5px", paddingLeft: "1.5px", "lineHeight": "100%", display: "flex", alignItems: "center" }}>{e.Sizename}</div>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "37.89px", fontWeight: "bold", fontSize: "7px", height: "14px", textAlign: "end", paddingRight: "1px", paddingLeft: "5px" }}>{+(e.ActualWeight).toFixed(2)}</div>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "33.89px", fontWeight: "bold", fontSize: "7px", height: "14px", textAlign: "end", paddingRight: "5px", paddingLeft: "5px" }}>{ }</div>
                                                    <div className="border_right2 border_bottom2 display" style={{ width: "39.36px", fontWeight: "bold", fontSize: "7px", height: "14px", textAlign: "end", paddingRight: "5px", paddingLeft: "5px" }}></div>
                                                </div>
                                            })}
                                            {
                                                Array.from({ length: chunk.length }, (_, index) => (
                                                    <div className='d_flex ' key={index}>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "49.36px", fontSize: "7px", height: "14px" }}></div>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "45.36px", fontSize: "7px", height: "14px", display: "-webkit-box", lineClamp: "1", boxOrient: 'vertical', overflow: "hidden" }}></div>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "45.36px", fontSize: "7px", height: "14px" }}></div>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "61.36px", fontSize: "7px", height: "14px" }}></div>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "37.89px", fontSize: "7px", height: "14px" }}></div>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "33.89px", fontSize: "7px", height: "14px" }}></div>
                                                        <div className="border_right2 border_bottom2 display" style={{ width: "39.36px", fontSize: "7px", height: "14px" }}></div>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                        <div className="bag_footer_border_remove">
                                            <div className="bag_footer d_flex">
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "49.36px" }}></div>
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "45.36px" }}>GRAND</div>
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "45.36px" }}>FILLING</div>
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "61.36px" }}>EPD</div>
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "37.9px", maxWidth: "33.9px" }}>P.P.</div>
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "29.9px", width: "33.73875px" }}>SET.</div>
                                                <div className="border_top2 border_right2 border_bottom2 bag_td " style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", fontWeight: "900", minWidth: "39.36px", width: "37.36px", maxWidth: "38px" }}>F.P.</div>
                                                <div className="border_top2 border_bottom2 bag_td " style={{ paddingLeft: "3px", fontSize: "7px", height: "14px", fontWeight: "900", minWidth: "31.22px" }}>RHD-QC</div>
                                            </div>
                                            {printData[2]?.map((e, i) => {
                                                if (e["0"] !== 'DGN INS:' && e["0"] !== 'PRD INS:' && e["0"] !== 'CUST INS:') {
                                                    return <div className="bag_footer d_flex last_line" key={i}>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "49.36px" }}>{e["0"] === "0" ? "" : e["0"]}</div>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "45.36px" }}>{e["GRAND"] === "0" ? "" : e["GRAND"]}</div>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "45.36px" }}>{e["FILLING"] === "0" ? "" : e["FILLING"]}</div>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "61.36px" }}>{e["EPD"] === "0" ? "" : e["EPD"]}</div>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "37.9px", maxWidth: "33.9px" }}>{e["P.P"] === "0" ? "" : e["P.P"]}</div>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "33.9px", minWidth: "29.9px", width: "33.73875px" }}>{e["SET"] === "0" ? "" : e["SET"]}</div>
                                                        <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "39.36px", width: "37.36px", maxWidth: "38px" }}>{e["F.P"] === "0" ? "" : e["F.P"]}</div>
                                                        <div className="border_bottom2 bag_td" style={{ fontSize: "7px", paddingLeft: "3px", height: "14px", minWidth: "31.22px" }}>{e["RHD-QC"] === "0" ? "" : e["RHD-QC"]}</div>
                                                    </div>
                                                }
                                            })}
                                            <div className="bag_footer d_flex last_line">
                                                <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "100%" }}>
                                                    DGN INS: {e.data.rd[0].productinfo}
                                                </div>
                                            </div>
                                            <div className="bag_footer d_flex last_line">
                                                <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "100%" }}>
                                                    PRD INS: {e.data.rd[0].QuoteRemark}
                                                </div>
                                            </div>
                                            <div className="bag_footer d_flex last_line">
                                                <div className="border_right2 border_bottom2 bag_td" style={{ paddingLeft: "3px", height: "14px", fontSize: "7px", minWidth: "100%" }}>CUST INS: {e.data.rd[0].custInstruction}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    })}

                </div>
            </>}
        </div>
    )
}

export default PrintDesign2