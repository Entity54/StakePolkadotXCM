import React,{useState,useEffect} from 'react';
 
import pha100 from '../../../../icons/crypto/pha100.png';
import bsx100 from '../../../../icons/crypto/bsx100.png';
import kar100 from '../../../../icons/crypto/kar100.png';


const Rococo = ({
  resetTargetAccount, originChainSelected, destinationChainSelected, selectedTokenfunction, selectedDestinationChainfunction, selectedOriginChainfunction, resetState, 
  rococoBalancesBSX, rococoBalancesPHA
  //rococoBalancesKAR
}) => {
	 
    const [instructionStatus, setInstructionStatus] = useState("Step1");     
    const [stateOfMatrix, setStateOfMatrix] = useState("auto");   

    const [stateOfBSX , setStateOfBSX]  = useState("auto");  
    const [stateOfPHA , setStateOfPHA]  = useState("auto");    
    const [stateOfKAR , setStateOfKAR]  = useState("auto");     
    
    const [rowBSX, setRowBSX] = useState({opacity: 1, clickable: "" })
    const [rowPHA, setRowPHA] = useState({opacity: 1, clickable: "" })
    const [rowKAR, setRowKAR] = useState({opacity: 1, clickable: "" })

    const colorOriginChain      =  "#FF5F1F";
    const colorDestinationChain =  "#FF5F1F";


    //#region Element Properties
    const [elemBSX, setElemBSX] = useState(
      [
        { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
        { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      ]
    )
    const [elemPHA, setElemPHA] = useState(
      [
        { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
        { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      ]
    )
    const [elemKAR, setElemKAR] = useState(
      [
        { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
        { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      ]
    )
    //#endregion


    //#region
    const BSX_chainTabClicked = (choice) => {
        console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
        setStateOfPHA("none");  setStateOfKAR("none");  

        if (originChainSelected==="Origin Chain") 
        {
          setInstructionStatus("Step3");

          selectedOriginChainfunction(choice);
          switch (choice) {
            case "Basilisk":
              setElemBSX((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
              break;
            case "Phala":
              setElemBSX((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
              break;
            case "Karura":
              setElemBSX((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
              break;
        }
      }
      else if (destinationChainSelected==="Target Chain") 
      {
        selectedDestinationChainfunction(choice);
        switch (choice) {
          case "Basilisk":
            setElemBSX((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
            break;
          case "Phala":
            setElemBSX((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
            break;
          case "Karura":
            setElemBSX((result) => [ result[0], result[1],  { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
        }
      }
      else tokenClicked();

    }
    //#endregion

    //#region
    const PHA_chainTabClicked = (choice) => {
      console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
      setStateOfBSX("none");  setStateOfKAR("none");  

      if (originChainSelected==="Origin Chain") 
      {
        setInstructionStatus("Step3");

        selectedOriginChainfunction(choice);
        switch (choice) {
          case "Basilisk":
            setElemPHA((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
            break;
          case "Phala":
            setElemPHA((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
            break;
          case "Karura":
            setElemPHA((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
      }
    }
    else if (destinationChainSelected==="Target Chain") 
    {
      selectedDestinationChainfunction(choice);
      switch (choice) {
        case "Basilisk":
          setElemPHA((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
          break;
        case "Phala":
          setElemPHA((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
          break;
        case "Karura":
          setElemPHA((result) => [ result[0], result[1],  { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }
    }
    else tokenClicked();
    }
    //#endregion

    //#region
    const KAR_chainTabClicked = (choice) => {
      console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
      setStateOfPHA("none");  setStateOfBSX("none");  

      if (originChainSelected==="Origin Chain") 
      {
        setInstructionStatus("Step3");

        selectedOriginChainfunction(choice);
        switch (choice) {
          case "Basilisk":
            setElemKAR((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
            break;
          case "Phala":
            setElemKAR((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
            break;
          case "Karura":
            setElemKAR((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
        }
      }
      else if (destinationChainSelected==="Target Chain") 
      {
        selectedDestinationChainfunction(choice);
        switch (choice) {
          case "Basilisk":
            setElemKAR((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
            break;
          case "Phala":
            setElemKAR((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
            break;
          case "Karura":
            setElemKAR((result) => [ result[0], result[1],  { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
        }
      }
      else tokenClicked();

    }
    //#endregion

	
	const tokenClicked = (assetClicked) => {
    setInstructionStatus("Step2");

		// console.log(`Asset ${assetClicked} was clicked`);
    if (assetClicked==="BSX")
		{
			setRowPHA({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowKAR({opacity: 0, clickable: "none", backgroundColor:"black"  }); 
			selectedTokenfunction("BSX");
			setRowBSX({opacity: 1, clickable: "" , backgroundColor:"orange"})
      resetTargetAccount("BSX");
		}
    else if (assetClicked==="PHA")
		{
			setRowBSX({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowKAR({opacity: 0, clickable: "none", backgroundColor:"black"  }); 
			selectedTokenfunction("PHA");
			setRowPHA({opacity: 1, clickable: "" , backgroundColor:"orange"})
      resetTargetAccount("PHA");
		}
    else if (assetClicked==="KAR")
		{
			setRowPHA({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowBSX({opacity: 0, clickable: "none", backgroundColor:"black"  }); 
			selectedTokenfunction("KAR");
			setRowKAR({opacity: 1, clickable: "" , backgroundColor:"orange"})
      resetTargetAccount("KAR");
		}
    else 
		{
			setRowBSX({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowKAR({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 1, clickable: "none", backgroundColor:"black"  });
			selectedTokenfunction("Token");
      selectedOriginChainfunction("Origin Chain");
      selectedDestinationChainfunction("Target Chain");
      resetTargetAccount("");
  
      setElemBSX(
        [
          { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
        ]
      );
      setElemPHA(
        [
          { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
        ]
      );
 
      setElemKAR(
        [
          { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
        ]
      );
      setStateOfMatrix("auto");
      setInstructionStatus("Step1");
      setStateOfBSX("auto"); setStateOfPHA("auto");  setStateOfKAR("auto");  
		}

	}
  
	useEffect(() => {
		tokenClicked("");
	}, [resetState]);


	return(
		<>
          <div>
            <div className="card" style={{color:"#9E38FF"}}>
              <div className=" d-block p-1">
                <div className="row" style={{ marginTop:"10px"}}>
                  <div className="col-xl-12 col-xxl-4 col-lg-6 col-sm-6" >
                    <div>
                      <div>
                          { instructionStatus==="Step1"? (
                              <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Step 1 - Select The <span style={{color:"yellow"}}>Asset</span> To Transfer</span></h4>
                            )
                            : instructionStatus==="Step2"? (
                              <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Step 2 - Select The <span style={{color:"yellow"}}>Origin Chain</span> Balance To <span style={{color:"yellow"}}>Transfer From</span></span></h4>
                            )
                            :  instructionStatus==="Step3"? (
                              <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Step 3 - Select The <span style={{color:"yellow"}}>Destination Chain</span> Balance To <span style={{color:"yellow"}}>Transfer To</span></span></h4>
                            )
                            : <></>
                          }
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{pointerEvents: `${stateOfMatrix}`}}>
            <div className="card mb-0" style={{paddingRight:"",backgroundColor:"",color:"#9E38FF"}}>
              <div className="card-body mt-0 p-0" style={{backgroundColor:"",marginLeft:"-50px", marginBottom:"-10px", marginTop:"-10px"}}>
                <div className="basic-form"style={{backgroundColor:""}}>
                  <form className="form-wrapper mb-0">
                    <div className="form-group mb-0">
                      {/* ------------------Parachain Title Row------------------- */}
                      <div className="row" style={{ marginTop:"10px"}}>
                            <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6 px-3" style={{height:"50px", padding:"2px", cursor:"pointer"}} onClick={() => tokenClicked("")}>
                              <div className="row">
                                  <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                                  <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"75px"}}>
                                    <div className="widget-stat card" style={{backgroundColor: "black", borderWidth: "1px", borderColor: "#5685e6"}}>
                                      <div className="card-body  p-2" style={{ width:"100%"}}>
                                        <div className="media" style={{height:"35px"}}>
                                          <div className="media-body text-warning text-center">
                                          <h2 className="text-warning" ><span style={{color:"orange"}} onClick={() => tokenClicked("BSX")}>RESET</span></h2>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                            <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                              <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#3a3f49", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                    <div className="media" style={{height:"40px"}}>
                                <div className="media-body text-white text-center">
                                  <h4 className="text-white">BASILISK</h4>
                                </div>
                                      </div>
                                </div>
                              </div>
                          </div>
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                              <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#8fcb02", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                    <div className="media" style={{height:"40px"}}>
                                <div className="media-body text-white text-center">
                                  <h4 className="text-white">PHALA</h4>
                                </div>
                                      </div>
                                </div>
                              </div>
                          </div>
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                              <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#890000", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                    <div className="media" style={{height:"40px"}}>
                                      <div className="media-body text-white text-center">
                                        <h4 className="text-white">KARURA</h4>
                                      </div>
                                    </div>
                                </div>
                              </div>
                          </div>
                      </div>
                      {/* ------------------2nd ROW------------------- */}
                      <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                          <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfBSX}`}} onClick={() => tokenClicked("BSX")}>
                            <div className="row">
                                <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                                <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                                  <div className="widget-stat card" style={{backgroundColor: `${rowBSX.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                                    <div className="card-body  p-2" style={{ width:"100%"}}>
                                      <div className="media" style={{height:"60px"}}>
                                      <div className="media-body text-white text-center">
                                        <h2 className="text-white" onClick={() => tokenClicked("BSX")}>BSX</h2>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowBSX.opacity}`, transition:"opacity 1s", pointerEvents:`${rowBSX.clickable}`}} onClick={() => BSX_chainTabClicked("Basilisk")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemBSX[0].activebackgroundColor}`,  opacity: `${elemBSX[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{ height: "50px"}}>
                                      <img src={bsx100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white"> {rococoBalancesBSX? rococoBalancesBSX.Basilisk : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowBSX.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemBSX[1].clickable==="none" || rowBSX.clickable==="none")?"none":""}` }}  onClick={() => BSX_chainTabClicked("Phala")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemBSX[1].activebackgroundColor}`,  opacity: `${elemBSX[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{height: "50px"}}>
                                      <img src={bsx100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white">{rococoBalancesBSX? rococoBalancesBSX.Phala : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowBSX.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemBSX[2].clickable==="none" || rowBSX.clickable==="none")?"none":""}` }} onClick={() => BSX_chainTabClicked("Karura")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemBSX[2].activebackgroundColor}`,  opacity: `${elemBSX[2].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{height: "50px"}}>
                                      <img src={bsx100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white">{rococoBalancesBSX? rococoBalancesBSX.Karura : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
                      {/* ------------------3rd ROW------------------- */}
                      <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                          <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfPHA}`}} onClick={() => tokenClicked("PHA")}>
                            <div className="row">
                                <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                                <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                                  <div className="widget-stat card" style={{backgroundColor: `${rowPHA.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                                    <div className="card-body  p-2" style={{ width:"100%"}}>
                                      <div className="media" style={{height:"60px"}}>
                                      <div className="media-body text-white text-center">
                                        <h2 className="text-white" onClick={() => tokenClicked("PHA")}>PHA</h2>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}} onClick={() => PHA_chainTabClicked("Basilisk")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemPHA[0].activebackgroundColor}`,  opacity: `${elemPHA[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{ height: "50px"}}>
                                      <img src={pha100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white"> {rococoBalancesPHA? rococoBalancesPHA.Basilisk : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>

                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemPHA[1].clickable==="none" || rowPHA.clickable==="none")?"none":""}` }}  onClick={() => PHA_chainTabClicked("Phala")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemPHA[1].activebackgroundColor}`,  opacity: `${elemPHA[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{height: "50px"}}>
                                      <img src={pha100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white">{rococoBalancesPHA? rococoBalancesPHA.Phala : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </div>

                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}}>
                                <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: "#5685e6", backgroundColor: "#1e1e2a", width:"100%", }}>
                                  <div className="card-body  p-3"  style={{ backgroundColor:"", }}>
                                    <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                                    <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                                  </div>
                                </div>
                          </div>
                      </div>
                      
                      {/* ------------------4th ROW------------------- KAR not available and XCM transfers not possible YET */}
                      {/* <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>

                          <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfKAR}`}} onClick={() => tokenClicked("KAR")}>
                            <div className="row">
                                <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                                <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                                  <div className="widget-stat card" style={{backgroundColor: `${rowKAR.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                                    <div className="card-body  p-2" style={{ width:"100%"}}>
                                      <div className="media" style={{height:"60px"}}>
                                      <div className="media-body text-white text-center">
                                        <h2 className="text-white" onClick={() => tokenClicked("KAR")}>KAR</h2>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>

                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKAR.clickable}`}}>
                                <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: "#5685e6", backgroundColor: "#1e1e2a", width:"100%", }}>
                                  <div className="card-body  p-3"  style={{ backgroundColor:"", }}>
                                    <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                                    <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                                  </div>
                                </div>
                          </div>

                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKAR[1].clickable==="none" || rowKAR.clickable==="none")?"none":""}` }}  onClick={() => KAR_chainTabClicked("Phala")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemKAR[1].activebackgroundColor}`,  opacity: `${elemKAR[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{height: "50px"}}>
                                      <img src={kar100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white">{rococoBalancesKAR? rococoBalancesKAR.Phala : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKAR[2].clickable==="none" || rowKAR.clickable==="none")?"none":""}` }} onClick={() => KAR_chainTabClicked("Karura")}>
                              <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKAR[2].activebackgroundColor}`,  opacity: `${elemKAR[2].opacity}`, transition:"opacity 1s", width:"100%", }}>
                                <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                                  <div className="media" style={{height: "50px"}}>
                                      <img src={kar100} style={{width: "50px", height: "50px"}}></img>
                                    <div className="media-body text-end me-3">
                                      <p className="mb-0 text-white">Balance</p>
                                      <h4 className="mb-0 text-white">{rococoBalancesKAR? rococoBalancesKAR.Karura : ""}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                      </div> */}

							      </div>
						      </form>
					      </div>
				      </div>
			      </div>
			    </div>

			    <div></div>
		</>
	)
}
export default Rococo;