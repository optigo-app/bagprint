import React, { useEffect, useState } from 'react';
import samplePrint from "../json/Sample_print.json";
import BackSide from "../json/Back side.json";
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import Loader from './Loader';
import BarcodeGenerator from './BarcodeGenerator';
const PrintDesign = () => {
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
    const chunkSize = 14;
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
                    let misc = {
                        miscWt: 0
                    }
                    datas.rd1.map((e, i) => {
                        if (e.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e.MasterManagement_DiamondStoneTypeid === 3) {
                            dia.diaPcs = dia.diaPcs + e.ActualPcs;
                            dia.diaWt = dia.diaWt + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs = clr.clrPcs + e.ActualPcs;
                            clr.clrWt = clr.clrWt + e.ActualWeight;
                        } else if (e.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.miscWt = misc.miscWt + e.ActualWeight;
                        }
                    });
                    length = 14 - length;
                    let imagePath = queryParams.imagepath;
                    imagePath = atob(queryParams.imagepath);
                    let img = imagePath + datas.rd[0].ThumbImagePath;

                    const originalData = [];
                    datas.rd1.map((e, i) => {
                        if (e.Shapename !== "-") {
                            originalData.push(e);
                        }
                    })

                    let chData = [];
                  
                    for (let i = 0; i < originalData.length; i += chunkSize) {
                        let len = 15 - (originalData.slice(i, i + chunkSize)).length;
                        chData.push({ data: originalData.slice(i, i + chunkSize), length: len });
                    }
                    responseData.push({ data: datas, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc, chdata: chData } });
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
            {data.length === 0 ? <Loader /> : <div className="d_flex flex_wrap m_5 print_section">
                {Array.from({ length: space }, (_, index) => (
                    index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                ))}
                {
                    data.map((e, i) => {
                        return <div className="d_flex" key={i} >
                            {e.additional.chdata.map((chunk, index) => {
                                return <div className="container ml_2 mb_2 mt_2 pt_2" key={index}>
                                    <div className="border">
                                        <div className="print_sec d_flex">
                                            <div className="print_text border_right">
                                                <div className="printhead d_flex">
                                                    <p className="w_32_p bold pl_3">{e.data.rd[0]["serialjobno"]}</p>
                                                    <p className="w_32_p bold">{e.data.rd[0]["Designcode1"]}</p>
                                                    <p className="w_36_p bold text_end">
                                                        {e.data.rd[0]["MetalType"]}{" "}
                                                        {e.data.rd[0]["MetalColor"]}{" "}
                                                    </p>
                                                </div>
                                                <div className="printhead_2 d_flex border_bottom">
                                                    <div className="w_25 border_right p_3">
                                                        <p className="grey bold">CUST</p>
                                                        <p className="bold">{e.data.rd[0]["CustomerCode"]}</p>
                                                    </div>
                                                    <div className="w_25 border_right p_3">
                                                        <p className="grey bold">SIZE</p>
                                                        <p className="bold">{e.data.rd[0]["Size"]}</p>
                                                    </div>
                                                    <div className="w_25 border_right p_3">
                                                        <p className="grey bold">ORD.DT.</p>
                                                        <p className="bold">{e.data.rd[0]["OrderDate"]}</p>
                                                    </div>
                                                    <div className="w_25 p_3">
                                                        <p className="grey bold">DEL.DT.</p>
                                                        <p className="bold">{e.data.rd[0]["promisedate"]}</p>
                                                    </div>
                                                </div>
                                                <div className="printhead_2 border_bottom">
                                                    <p className="p_3 bold" style={{ fontSize: "10px" }}>INS : {e.data.rd[0]["QuoteRemark"]}</p>
                                                </div>
                                            </div>
                                            <div className="print_photo border_bottom">
                                                <img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} alt="" onError={e => handleImageError(e)} loading="lazy" />
                                            </div>
                                        </div>
                                        <div className="print_sec d_flex border_bottom">
                                            <div className="print_table">
                                                <div className="h_4 d_flex">
                                                    <div className="code border_right border_bottom bold pl_3">CODE</div>
                                                    <div className="size border_right border_bottom bold  text_center">SIZE</div>
                                                    <div className="pcs border_right border_bottom bold  text_center">PCS</div>
                                                    <div className="wt border_right border_bottom bold  text_center">WT</div>
                                                    <div className="pcs_2 border_right border_bottom bold  text_center">PCS</div>
                                                    <div className="wt_2  border_bottom bold  text_center">WT</div>
                                                </div>
                                                <div className='border_bottom_0'>
                                                    {chunk.data.map((e, i) => {
                                                        return <div key={i} className="h_41 d_flex">
                                                            <div className="code border_right border_bottom medium pl_3">{e.ConcatedFullShapeQualityColorCode}</div>
                                                            <div className="size border_right border_bottom medium  text_center">{e.Size_DisplayOrder}</div>
                                                            <div className="pcs border_right border_bottom medium  text_center">{e.ActualPcs}</div>
                                                            <div className="wt border_right border_bottom medium  text_center">{e.ActualWeight}</div>
                                                            <div className="pcs_2 border_right border_bottom  medium text_center"></div>
                                                            <div className="wt_2  border_bottom medium  text_center"></div>
                                                        </div>
                                                    })}
                                                    {console.log(chunk.length)}
                                                    {Array.from({ length: chunk.length }, (_, index) => (
                                                        <div key={index} className="h_41 d_flex">
                                                            <div className="code border_right bold border_bottom"></div>
                                                            <div className=" size border_right bold border_bottom"></div>
                                                            <div className="pcs border_right bold border_bottom"></div>
                                                            <div className="wt border_right bold border_bottom"></div>
                                                            <div className="pcs_2 border_right bold border_bottom"></div>
                                                            <div className="wt_2 bold border_bottom"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="barcode border_left">
                                                {e.data.rd1[0].SerialJobno !== undefined && <BarcodeGenerator data={e.data.rd1[0].SerialJobno} />}
                                            </div>
                                        </div>
                                        <div className="print-sec d_flex footer">
                                            <div className="w_12mm border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">DIAM.</p></div><div className="lower center_item bold">{+(e.additional.dia.diaPcs).toFixed(2) + "/" + +(e.additional.dia.diaWt).toFixed(2)}</div></div>
                                            <div className="w_12mm border_right"><div className="upper"></div><div className="lower"></div></div>
                                            <div className="w_10_5mm border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">CS</p></div><div className="lower center_item bold">{+(e.additional.clr.clrPcs).toFixed(2) + "/" + +(e.additional.clr.clrWt).toFixed(2)}</div></div>
                                            <div className="w_12mm border_right"><div className="upper"></div><div className="lower"></div></div>
                                            <div className="w_10 border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">METAL</p></div><div className="lower center_item bold">{e.data.rd[0]["MetalWeight"]}</div></div>
                                            <div className="w_13 border_right"><div className="upper"></div><div className="lower"></div></div>
                                            <div className="w_9 border_right"><div className="upper border_bottom text_center center_item"><p className="semibold">MISC</p></div><div className="lower center_item bold">{e.additional.misc.miscWt}</div></div>
                                            <div className="w_12_5mm"><div className="upper"></div><div className="lower"></div></div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="container ml_2 mb_2 mt_2 pt_2">
                                <div className="border">
                                    <div className="d_flex">
                                        <div className="side_1">
                                            <div className="d_flex border_bottom h_5 border_right">
                                                <div className="w_30 job_no_center"> <p className="bold">{e.data.rd[0]["serialjobno"]}</p></div>
                                                <div className="w_30 center_item"> <p className="bold">{e.data.rd[0]["Designcode1"]}</p> </div>
                                                <div className="w_42 center_item"> <p className="bold">{e.data.rd[0]["MetalType"]}
                                                    {" " + e.data.rd[0]["MetalColor"]}
                                                </p></div>
                                            </div>
                                            <div className="d_flex border_bottom h_8 border_right">
                                                <div className="w_25 border_right p_3 bold grey"><p>SALES REP.</p><p className="bold black">{e.data.rd[0]["SalesrepCode"]}</p></div>
                                                <div className="w_19_p border_right p_3 bold grey"><p>FROS</p><p className="bold black">{e.data.rd[0]["MetalFrosting"]}</p></div>
                                                <div className="w_19_p border_right p_3 bold grey"><p>LAB</p><p className="bold black">{e.data.rd[0]["MasterManagement_labname"]}</p></div>
                                                <div className="w_37_p p_3 bold grey"><p>MARKETYPE</p><p className="bold black">{e.data.rd[0]["mastermanagement_maketypename"]}</p></div>
                                            </div>
                                            <div className="border_bottom h_5 d_flex align_center pl_3 border_right">
                                                <p className="bold">{e.data.rd[0]["PO"]}</p>
                                            </div>
                                            <div className="d_flex border_bottom border_right">
                                                <div className="width_6 border_right p_3 grey bold text_center"><p>Y TR NO  </p></div>
                                                <div className="width_6 border_right p_3 grey bold text_center"><p>W TR NO  </p></div>
                                                <div className="width_6 border_right p_3 grey bold text_center"><p>P TR NO  </p></div>
                                                <div className="width_6 border_right p_3 grey bold text_center"><p>Y CST WT.</p></div>
                                                <div className="width_6 border_right p_3 grey bold text_center"><p>W CST WT.</p></div>
                                                <div className="width_6 p_3 grey bold text_center"><p>P CST WT. </p></div>
                                            </div>
                                            <div className="d_flex h_88 pl_3 border_bottom border_right">
                                                <p className="w_10 pt_2 grey bold">METAL</p>
                                                <p className="w_10 center_item">{BackSide[0]["METAL"]}</p>
                                            </div>
                                            <div className="d_flex h_88 pl_3 border_bottom border_right">
                                                <p className="w_10 pt_2 grey bold">STONE</p>
                                                <p className="w_10 center_item">{BackSide[0]["STONE"]}</p>
                                            </div>
                                            <div className="d_flex h_88 pl_3  border_right">
                                                <p className="w_10 pt_2 grey bold">VISUAL</p>
                                                <p className="w_10 center_item">{BackSide[0]["VISUAL"]}</p>
                                            </div>
                                        </div>
                                        <div className="side_2">
                                            <img src={e.additional.img !== "" ? e.additional.img : require("../assets/images/default.jpg")} alt="" onError={e => handleImageError(e)} loading="lazy" />
                                            <div className="cvd  pl_3">
                                                <p className=" bold grey">CVD TEST</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d_flex position_relative">
                                        <div className="d_flex dept">
                                            <div className="w_98">
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 border_top bold">DEPT. </div>
                                                    <div className="width_66 border_right border_top bold text_center">AP </div>
                                                    <div className="width_6 border_right border_top bold text_center">ISSUE</div>
                                                    <div className="width_6 border_right border_top bold text_center">RECIEVE</div>
                                                    <div className="width_6 border_right border_top bold text_center">SCRAP</div>
                                                    <div className="width_6 border_right border_top bold text_center">PCS</div>
                                                    <div className="width_6 border_top bold text_center">WORKER</div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">GRD.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">FIL.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">ASM.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">CNC.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">EP/PI.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">SET.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">FPL.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex border_bottom h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">PLT.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                                <div className="d_flex  h_4_5">
                                                    <div className="width_dept border_right pl_3 bold">ENM.</div>
                                                    <div className="width_66 border_right bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6 border_right pl_3 bold"></div>
                                                    <div className="width_6  pl_3 bold"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="barcode_second">
                                            {e.data.rd1[0].SerialJobno !== undefined && <BarcodeGenerator data={e.data.rd1[0].SerialJobno} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>}
        </div>
    )
}

export default PrintDesign