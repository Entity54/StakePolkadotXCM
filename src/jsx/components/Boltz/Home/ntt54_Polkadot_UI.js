import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Row, Col, Card, Dropdown,DropdownButton, ButtonGroup, SplitButton, } from "react-bootstrap";

    
import ausd100 from '../../../../icons/crypto/ausd100.png';
import dot100 from '../../../../icons/crypto/dot100.png';
import aca100 from '../../../../icons/crypto/aca100.png';
import glmr100 from '../../../../icons/crypto/glmr100.png';

import { getSelectedCandidates, getDelegatorState, scheduleRevokeDelegatinFromCandidate, cancelDelegationRequstFromCandidate, executeDelegationRequestAfterDelayPassed }  from '../../../../Setup.js';


const Polkadot = ({ 
  resetTargetAccount, originChainSelected, destinationChainSelected, selectedTokenfunction, selectedDestinationChainfunction, selectedOriginChainfunction, 
  resetState, balancesDOT, balancesPAUSD, balancesACA, balancesGLMR, selectedActionfunction, resetCollatorAccount,
  accountList, passUnstakeActionMessageFunction
}) => {

      const [action, setAction] = useState("");    
      const [instructionStatus, setInstructionStatus] = useState("");     

      const [stateOfMatrix, setStateOfMatrix] = useState("none");     
      const [stateOfDOT , setStateOfDOT]  = useState("none");     
      const [stateOfAUSD, setStateOfAUSD] = useState("none");     
      const [stateOfACA , setStateOfACA]  = useState("none");     
      const [stateOfGLMR, setStateOfGLMR] = useState("none");     

      const [rowDOT, setRowDOT] = useState({opacity: 1, clickable: "" })
      const [rowAUSD, setRowAUSD] = useState({opacity: 1, clickable: "" })
      const [rowACA, setRowACA] = useState({opacity: 1, clickable: "" })
      const [rowGLMR, setRowGLMR] = useState({opacity: 1, clickable: "" })
      
      const [selectedCandidates, setSelectedCandidates] = useState([]); 
      const [candidate, setCandidate] = useState("");  
      const [unstakingInfoDiv, setUnstakingInfoDiv] = useState("");  

      const colorOriginChain      =  "#FF5F1F";
      const colorDestinationChain =  "#FF5F1F";



      //#region  UnstakeActionClicked
      const unstakeActionClicked = async (candidateAddress, unstakeAction, amountStakedWithCandidate) => {
          console.log(`unstakeActionClicked => CALLED fr ${candidateAddress} with ACTION: ${unstakeAction}`);
          //"Unstake"  "Cancel" "Claim"
          // unstakeActionClicked(candiddateObj.candidateAddress, unstakeAction, candiddateObj.amountStakedWithCandidate);
          selectedTokenfunction(unstakeAction);
          passUnstakeActionMessageFunction(candidateAddress, unstakeAction, amountStakedWithCandidate);
      }
      //#endregion



      //#region Element Properties
      const [elemDOT, setElemDOT] = useState(
        [
          { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      )
      const [elemAUSD, setElemAUSD] = useState(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      )
      const [elemACA, setElemACA] = useState(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      )
      const [elemGLMR, setElemGLMR] = useState(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      )
      //#endregion

          
      //#region
      const actionModuleClicked = async (choice) => {
        console.log(`User has chosen: ${choice}`)
        setAction(choice);
        selectedActionfunction(choice);  //Informs XCM Transfer Center

        if (choice==="autostakeDOTtoAcala")
        {
          tokenClicked("DOT");
          setStateOfAUSD("none");  setStateOfACA("none");  setStateOfGLMR("none");   
          setInstructionStatus("DOTstaking");
          setElemDOT((result) => [ result[0], { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: "none" }, result[2] ] );
        }
        else if (choice==="autostakeGLMRtoMoonbeam")
        {
          tokenClicked("GLMR");
          setStateOfDOT("none"); setStateOfAUSD("none");  setStateOfACA("none"); 
          setInstructionStatus("GLMRstaking");
          setElemGLMR((result) => [ result[0], { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: "none" } ] );
        }
        else if (choice==="XCMtransfer")
        {
          setStateOfDOT("auto"); setStateOfAUSD("auto");  setStateOfACA("auto");  setStateOfGLMR("auto");   
          setInstructionStatus("Step1");
        }
        else if (choice==="unstakeDOTfromLDOTatAcala")
        {
          setInstructionStatus("DOTunstaking");
          selectedTokenfunction("LDOT=>DOT")
          selectedOriginChainfunction("Acala");
          selectedDestinationChainfunction("Acala");
        }
        else if (choice==="unstakeGLMRfromMoonbeam")
        {
          setInstructionStatus("GLMRunstaking");
          selectedTokenfunction("unstake GLMR")
          selectedOriginChainfunction("Collator");
          selectedDestinationChainfunction("Moonbeam");

          // const delegatorState_JSON = await getDelegatorState( accountList[0] );
          const unstakingCandidatesArray = await getDelegatorState( accountList[0] );
          console.log(`|||||>>>> unstakingCandidatesArray: `,unstakingCandidatesArray);
          setUnstakingInfoDiv(
          // unstakingInfoDiv = (
//             (2) [{…}, {…}]
// 0:
// amountStakedWithCandidate: "1.0"
// candidateAddress: "0x0CFB2bdD20C5EdeeeEd2D2FbDDb9697F0441668A" candiddateObj.candidateAddress
// delegation_request_is_pending: true    candiddateObj.delegation_request_is_pending
// readyToExecuteUnstakingBlokcNumber: 0   candiddateObj.readyToExecuteUnstakingBlokcNumber
// revokeAmount: "1.0"          candiddateObj.revokeAmount
// roundBlockLength: 600
// roundFristBlokc: 2434200
// roundNumber: 4058
// whenExecutable: 4016

            unstakingCandidatesArray.map((candiddateObj, index) => {
              return (


              <div className="row" key={index} style={{ marginTop:"10px", cursor:"pointer"}}>

                 {
                  index===0?
                  (
                    <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfDOT}`}} onClick={() => tokenClicked("DOT")}>
                      <div className="row">
                        <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                        <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                          <div className="widget-stat card" style={{backgroundColor: `${rowDOT.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                            <div className="card-body  p-2" style={{ width:"100%"}}>
                              <div className="media" style={{height:"60px"}}>
                                <div className="media-body text-white text-center">
                                  {/* <h2 className="text-white" onClick={() => tokenClicked("DOT")}>GLMR</h2> */}
                                  <h2 className="text-white">GLMR</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  :
                  (
                    <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px",  pointerEvents: `${stateOfAUSD}`}} onClick={() => tokenClicked("AUSD")}>
                      <div className="row">
                        <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                        <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                        </div>
                      </div>
                  </div>
                  )
                 }

                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowDOT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowDOT.clickable}`}}  onClick={() => DOT_chainTabClicked("Polkadot")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemDOT[0].activebackgroundColor}`,  opacity: `${elemDOT[0].opacity}`, transition:"opacity 1s",  width:"100%", }}>
                      <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                        <div className="media" style={{height: "50px"}}>
                          <img src={glmr100} style={{width: "50px", height: "50px"}}></img>
                          <div className="media-body text-end me-3">
                            <p className="mb-0 text-white">{`${candiddateObj.candidateAddress.substring(0,6)}...${candiddateObj.candidateAddress.substring(candiddateObj.candidateAddress.length-4)}`}</p>
                            {/* <h4 className="mb-0 text-white"> {balancesDOT? balancesDOT.Polkadot : ""}</h4>  */}
                            <h4 className="mb-0 text-white"> {candiddateObj.amountStakedWithCandidate}</h4> 

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px",  }}  onClick={() => {
                      const unstakeAction = candiddateObj.delegation_request_is_pending? 
                                            (candiddateObj.readyToExecuteUnstakingBlokcNumber > 0? "Cancel" : "Claim")
                                            : 
                                            "Unstake"
                      unstakeActionClicked(candiddateObj.candidateAddress, unstakeAction, candiddateObj.amountStakedWithCandidate);
                      }
                    }
                    >
                    <div className="widget-stat card " style={{ height:"100%",  width:"100%",    backgroundColor:  elemDOT[1].activebackgroundColor 
                    // backgroundColor:`${
                    //     candiddateObj.delegation_request_is_pending? 
                    //     (candiddateObj.readyToExecuteUnstakingBlokcNumber > 0? "#FCFCFC" : "#6EFF33")
                    //     : 
                    //     elemDOT[1].activebackgroundColor
                    //   }`
                    }}>
                      <div className="card-body  p-2"  >
                        <div className="media" style={{height: "50px" }}>
                          <div className="media-body text-center">
                            {/* <h4 className="mb-0 text-white">{balancesDOT? balancesDOT.Acala : ""}</h4> */}
                            <h4 className="mb-0 text-white">
                              <span style={{color: `${
                                        candiddateObj.delegation_request_is_pending? 
                                        (candiddateObj.readyToExecuteUnstakingBlokcNumber > 0? "#FCFCFC" : "#6EFF33")
                                        : 
                                        "white"

                                   }`
                              }}
                              >
                                { 
                                    candiddateObj.delegation_request_is_pending? 
                                    (candiddateObj.readyToExecuteUnstakingBlokcNumber > 0? "Cancel" : "Claim")
                                    : 
                                    "Unstake"
                                }
                              </span>
                                
                            </h4>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px",}} >
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor:"#3a3f49", width:"100%", }}>
                      <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                        <div className="media" style={{height: "50px"}}>
                          <div className="media-body text-center">
                            <h4 className="mb-0 text-white">{(candiddateObj.readyToExecuteUnstakingBlokcNumber)!==null? ((candiddateObj.readyToExecuteUnstakingBlokcNumber)===0?"Ready To Claim":candiddateObj.readyToExecuteUnstakingBlokcNumber ) : "Not Initiated"}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

              </div> 

            )

           })

          );


        }

        setStateOfMatrix("auto");
      }
      //#endregion


      //#region
      const DOT_chainTabClicked = (choice) => {
        console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
        setStateOfAUSD("none");  setStateOfACA("none");  setStateOfGLMR("none");   

        if (originChainSelected==="Origin Chain") 
        {
          // setInstructionStatus("Step3");

          selectedOriginChainfunction(choice);
          switch (choice) {
            case "Polkadot":
              setElemDOT((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
              break;
            case "Acala":
              setElemDOT((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
              break;
            case "Moonbeam":
              setElemDOT((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
              break;
          }

          if (action==="XCMtransfer") setInstructionStatus("Step3");

        }
        else if (destinationChainSelected==="Target Chain") 
        {
          selectedDestinationChainfunction(choice);
          switch (choice) {
            case "Polkadot":
              setElemDOT((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2] ] );
              break;
            case "Acala":
              setElemDOT((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2] ] );
              break;
            case "Moonbeam":
              setElemDOT((result) => [ result[0], result[1],  { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
              break;
          }
        }
        else tokenClicked();

      }
      //#endregion

      //#region
      const AUSD_chainTabClicked = (choice) => {
      console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
      setStateOfDOT("none");  setStateOfACA("none");  setStateOfGLMR("none");   

      if (originChainSelected==="Origin Chain") 
      {
        setInstructionStatus("Step3");

        selectedOriginChainfunction(choice);
        switch (choice) {
          case "Acala":
            setElemAUSD((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1] ] );
            break;
          case "Moonbeam":
            setElemAUSD((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
      }
      }
      else if (destinationChainSelected==="Target Chain") 
      {
        selectedDestinationChainfunction(choice);
        switch (choice) {
          case "Acala":
            setElemAUSD((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1] ] );
            break;
          case "Moonbeam":
            setElemAUSD((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
        }
      }
      else tokenClicked();

    }
    //#endregion

    //#region
    const ACA_chainTabClicked = (choice) => {
      console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
      setStateOfAUSD("none");  setStateOfDOT("none");  setStateOfGLMR("none");   

      if (originChainSelected==="Origin Chain") 
      {
        setInstructionStatus("Step3");

        selectedOriginChainfunction(choice);
        switch (choice) {
          case "Acala":
            setElemACA((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1] ] );
            break;
          case "Moonbeam":
            setElemACA((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
      }
      }
      else if (destinationChainSelected==="Target Chain") 
      {
        selectedDestinationChainfunction(choice);
        switch (choice) {
          case "Acala":
            setElemACA((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1] ] );
            break;
          case "Moonbeam":
            setElemACA((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
        }
      }
      else tokenClicked();

    }
    //#endregion

    //#region
    const GLMR_chainTabClicked = async (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfAUSD("none");  setStateOfACA("none");  setStateOfDOT("none");   

    if (originChainSelected==="Origin Chain") 
    {
      // setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
        case "Acala":
          setElemGLMR((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1] ] );
          break;
        case "Moonbeam":
          setElemGLMR((result) => [ result[0],  { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }

      if (action==="XCMtransfer") setInstructionStatus("Step3")
      else if (action==="autostakeGLMRtoMoonbeam") 
      {
        const selected_Candidates = await getSelectedCandidates();
        setSelectedCandidates(selected_Candidates);
        setInstructionStatus("ChooseCollator");
      }


    }
    else if (destinationChainSelected==="Target Chain") 
    {
      selectedDestinationChainfunction(choice);
      switch (choice) {
        case "Acala":
          setElemGLMR((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,} , result[1] ] );
          break;
        case "Moonbeam":
          setElemGLMR((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }
    }
    else tokenClicked();

  }
  //#endregion
	 
	
	
	const tokenClicked = (assetClicked) => {
    setInstructionStatus("Step2");

		console.log(`Asset ${assetClicked} was clicked`);
		if (assetClicked==="DOT")
		{
      setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowACA({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowGLMR({opacity: 0, clickable: "none", backgroundColor:"black"  });   
			selectedTokenfunction("DOT");
			setRowDOT({opacity: 1, clickable: "" , backgroundColor: colorOriginChain});
      resetTargetAccount("DOT");
		}
		else if (assetClicked==="AUSD")
		{
      setRowDOT({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowACA({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowGLMR({opacity: 0, clickable: "none", backgroundColor:"black"  });   
			selectedTokenfunction("AUSD");
			setRowAUSD({opacity: 1, clickable: "" , backgroundColor: colorOriginChain});
      resetTargetAccount("AUSD");
		}
    else if (assetClicked==="ACA")
		{
      setRowDOT({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowGLMR({opacity: 0, clickable: "none", backgroundColor:"black"  });   
			selectedTokenfunction("ACA");
			setRowACA({opacity: 1, clickable: "" , backgroundColor: colorOriginChain});
      resetTargetAccount("ACA");
    }
    else if (assetClicked==="GLMR")
		{
      setRowDOT({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowACA({opacity: 0, clickable: "none", backgroundColor:"black"  });   
			selectedTokenfunction("GLMR");
			setRowGLMR({opacity: 1, clickable: "" , backgroundColor:colorOriginChain});
      resetTargetAccount("GLMR");
		}
		else 
		{
      setRowDOT({opacity: 1, clickable: "none", backgroundColor:"black" }); setRowAUSD({opacity: 1, clickable: "none", backgroundColor:"black" }); setRowACA({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowGLMR({opacity: 1, clickable: "none", backgroundColor:"black"  });   
			selectedTokenfunction("Token");
      selectedOriginChainfunction("Origin Chain");
      selectedDestinationChainfunction("Target Chain");

      resetTargetAccount("");

      setElemDOT(
        [
          { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1, clickable: ""},
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      );
      setElemAUSD(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      );
      setElemACA(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      );
      setElemGLMR(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
        ]
      );

      setStateOfMatrix("none");
      setAction("");
      setInstructionStatus("");
      setStateOfDOT("none"); setStateOfAUSD("none");  setStateOfACA("none");  setStateOfGLMR("none");   
      setCandidate(""); resetCollatorAccount(""); selectedActionfunction("");
		}

	}

  useEffect(() => {
		tokenClicked("");
	}, [resetState]);

  useEffect(() => {
    if (action==="autostakeDOTtoAcala" && originChainSelected!=="Origin Chain") DOT_chainTabClicked("Acala")
    else if (action==="autostakeGLMRtoMoonbeam" && originChainSelected!=="Origin Chain") GLMR_chainTabClicked("Moonbeam")
	}, [originChainSelected, action]);
   


	return(
		<>

  <div>
    <div className="card" style={{color:"#9E38FF"}}>
      <div className=" d-block p-1">

      {action===""? (

        <div className="row" style={{ marginTop:"0px"}}>
          <div className="col-xl-12 col-xxl-4 col-lg-6 col-sm-6 p-0 m-0" >
            <div>
              <p className="fs-28 text-center text-white">What Would You Like To Do?</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
              <button type="button" className="btn btn-outline-warning btn-sm mx-4 py-1"  onClick={() => actionModuleClicked("XCMtransfer")}>Use XCM To Make A Cross Chain Transfer</button>
            </div> 
            <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
              <button type="button" className="btn btn-outline-danger btn-sm mx-4 py-1"  onClick={() => actionModuleClicked("autostakeDOTtoAcala")}>Use XCM To Autostake DOT Onto Acala</button>
            </div> 
            <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
              <button type="button" className="btn btn-outline-primary btn-sm mx-4 py-1"  onClick={() => actionModuleClicked("autostakeGLMRtoMoonbeam")}>Use XCM To AutoStake GLMR Onto Moonbeam</button>
            </div> 
          </div>
          <div className="row">
            <div className="col-xl-5 col-xxl-4 col-lg-6 col-sm-6"></div>
            <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6">
              <button type="button" className="btn btn-outline-danger btn-sm btn-block mt-2 py-1"><span style={{fontSize:"14px"}}onClick={() => actionModuleClicked("unstakeDOTfromLDOTatAcala")}>UnStake DOT</span></button>
            </div> 
            <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6"></div>
            <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6">
              <button type="button" className="btn btn-outline-primary btn-sm btn-block mt-2 py-1"><span style={{fontSize:"14px"}}  onClick={() => actionModuleClicked("unstakeGLMRfromMoonbeam")}>UnStake GLMR</span></button>
            </div> 
          </div>
        </div>
      )
      :
      (
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
          :  instructionStatus==="DOTstaking"? (
            <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Select The <span style={{color:"yellow"}}>Origin Chain DOT Balance </span> To Transfer And Stake</span></h4>
          )
          :  instructionStatus==="GLMRstaking"? (
            <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Select The <span style={{color:"yellow"}}>Origin Chain GLMR Balance </span> To Transfer And Stake</span></h4>
          )
          :  instructionStatus==="ChooseCollator"? (
            <div className="row">
              <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6"></div>
              <div className="col-xl-8 col-xxl-4 col-lg-6 col-sm-6">
              {/* <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6"> */}
                <p className="fs-30 text-center mt-2"><span style={{color:"white"}}>Choose a <span style={{color:"yellow"}}>Collator </span> from the Candidate List</span></p>
              </div>

              <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6">
              {/* <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6"> */}
                  <div className="basic-dropdown">
                    <Dropdown>
                      <Dropdown.Toggle variant="primary">
                          {candidate===""?"Candidate List": `${candidate.substring(0,6)}...${candidate.substring(candidate.length-4)}` }
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{maxHeight:"420px", overflowY:"scroll"}}>
                        <h2 className="dropdown-header fs-18">Active Collators</h2>
                        {
                          selectedCandidates.map((candid, index) => {
                            return (
                                      <Dropdown.Item key={index} onClick={() => {
                                          setCandidate(candid);
                                          resetCollatorAccount(candid);
                                        }
                                      }>{candid}</Dropdown.Item>
                                   )
                            })
                        }
                      </Dropdown.Menu>

                    </Dropdown>

                        {/* <Dropdown.Item href="#">Collator 1</Dropdown.Item>
                        <Dropdown.Item href="#">Collator 10</Dropdown.Item> */}

                  </div>
              </div>
            </div>
          )


          :  instructionStatus==="DOTunstaking"? (
            <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Unstaking <span style={{color:"yellow"}}>DOT from LDOT </span>and depositing at Acala</span></h4>
          )
          :  instructionStatus==="GLMRunstaking"? (
            <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Unstaking <span style={{color:"yellow"}}>GLMR </span>and depositing at Moonbeam</span></h4>
          )
          : <></>
        }
      </div> 
      )
      }

      </div>
    </div>
  </div>


    <div style={{pointerEvents: `${stateOfMatrix}`}}>

{ action!=="unstakeGLMRfromMoonbeam"? 
(


      <div className="card" style={{backgroundColor:"171622", color:"#9E38FF"}}>
        <div className="card-body" style={{marginLeft:"-50px", marginBottom:"-10px", marginTop:"-10px"}}>
          <div className="basic-form">
            <form className="form-wrapper">
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
                            <h2 className="text-warning" ><span style={{color:"orange"}} onClick={() => tokenClicked("RESET")}>RESET</span></h2>
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
                       <h4 className="text-white">POLKADOT</h4>
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
                        <h4 className="text-white">ACALA</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#0E86D4", width:"100%", }}>
                  <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                    <div className="media" style={{height:"40px"}}>
                      <div className="media-body text-white text-center">
                        <h4 className="text-white">MOONBEAM</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* ------------------2nd ROW------------------- */}


            <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfDOT}`}} onClick={() => tokenClicked("DOT")}>
                  <div className="row">
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                      <div className="widget-stat card" style={{backgroundColor: `${rowDOT.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                        <div className="card-body  p-2" style={{ width:"100%"}}>
                          <div className="media" style={{height:"60px"}}>
                            <div className="media-body text-white text-center">
                              <h2 className="text-white" onClick={() => tokenClicked("DOT")}>DOT</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowDOT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowDOT.clickable}`}}  onClick={() => DOT_chainTabClicked("Polkadot")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemDOT[0].activebackgroundColor}`,  opacity: `${elemDOT[0].opacity}`, transition:"opacity 1s",  width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={dot100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white"> {balancesDOT? balancesDOT.Polkadot : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowDOT.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemDOT[1].clickable==="none" || rowDOT.clickable==="none")?"none":""}` }}  onClick={() => DOT_chainTabClicked("Acala")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemDOT[1].activebackgroundColor}`,  opacity: `${elemDOT[1].opacity}`,  transition:"opacity 1s",  width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={dot100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesDOT? balancesDOT.Acala : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowDOT.opacity}`, transition:"opacity 1s",  pointerEvents:`${(elemDOT[2].clickable==="none" || rowDOT.clickable==="none")?"none":""}` }}  onClick={() => DOT_chainTabClicked("Moonbeam")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemDOT[2].activebackgroundColor}`,  opacity: `${elemDOT[2].opacity}`, transition:"opacity 1s", width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={dot100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesDOT? balancesDOT.Moonbeam : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------3rd ROW------------------- */}

              <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px",  pointerEvents: `${stateOfAUSD}`}} onClick={() => tokenClicked("AUSD")}>
                  <div className="row">
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                      <div className="widget-stat card" style={{backgroundColor:  `${rowAUSD.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                        <div className="card-body  p-2" style={{ width:"100%"}}>
                          <div className="media" style={{height:"60px"}}>
                            <div className="media-body text-white text-center">
                              <h2 className="text-white" onClick={() => tokenClicked("AUSD")}>AUSD</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${rowAUSD.clickable}`}}>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${rowAUSD.clickable}`}} onClick={() => AUSD_chainTabClicked("Acala")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemAUSD[0].activebackgroundColor}`,  opacity: `${elemAUSD[0].opacity}`,  transition:"opacity 1s", width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={ausd100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesPAUSD? balancesPAUSD.Acala : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemAUSD[1].clickable==="none" || rowAUSD.clickable==="none")?"none":""}` }}  onClick={() => AUSD_chainTabClicked("Moonbeam")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemAUSD[1].activebackgroundColor}`,  opacity: `${elemAUSD[1].opacity}`, transition:"opacity 1s",  width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={ausd100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesPAUSD? balancesPAUSD.Moonbeam : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ------------------4th ROW------------------- */}
                
              <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfACA}`}} onClick={() => tokenClicked("ACA")}>
                  <div className="row">
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                      <div className="widget-stat card" style={{backgroundColor:`${rowACA.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                        <div className="card-body  p-2" style={{ width:"100%"}}>
                          <div className="media" style={{height:"60px"}}>
                            <div className="media-body text-white text-center">
                              <h2 className="text-white" onClick={() => tokenClicked("ACA")}>ACA</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowACA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowACA.clickable}`}}>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowACA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowACA.clickable}`}}  onClick={() => ACA_chainTabClicked("Acala")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemACA[0].activebackgroundColor}`,  opacity: `${elemACA[0].opacity}`,  transition:"opacity 1s", width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={aca100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesACA? balancesACA.Acala : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowACA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowACA.clickable}`}}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemACA[1].activebackgroundColor}`,  opacity: `${elemACA[1].opacity}`, transition:"opacity 1s",  width:"100%",  clickable:`${elemACA[1].clickable}` }}  onClick={() => ACA_chainTabClicked("Moonbeam")}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={aca100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesACA? balancesACA.Moonbeam : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* ------------------5th ROW------------------- */}
                
              </div>
              <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px",  pointerEvents: `${stateOfGLMR}` }} onClick={() => tokenClicked("GLMR")}>
                  <div className="row">
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" ></div>
                    <div className="col-xl-6 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px",  }}>
                      <div className="widget-stat card" style={{backgroundColor: `${rowGLMR.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                        <div className="card-body  p-2" style={{ width:"100%"}}>
                          <div className="media" style={{height:"60px"}}>
                            <div className="media-body text-white text-center">
                              <h2 className="text-white" onClick={() => tokenClicked("GLMR")}>GLMR</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowGLMR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowGLMR.clickable}`}}>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowGLMR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowGLMR.clickable}`}} onClick={() => GLMR_chainTabClicked("Acala")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemGLMR[0].activebackgroundColor}`,  opacity: `${elemGLMR[0].opacity}`,  transition:"opacity 1s", width:"100%", }}>
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={glmr100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesGLMR? balancesGLMR.Acala : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowGLMR.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemGLMR[1].clickable==="none" || rowGLMR.clickable==="none")?"none":""}` }}  onClick={() => GLMR_chainTabClicked("Moonbeam")}>
                  <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemGLMR[1].activebackgroundColor}`,  opacity: `${elemGLMR[1].opacity}`, transition:"opacity 1s",  width:"100%" }}  >
                    <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                      <div className="media" style={{height: "50px"}}>
                        <img src={glmr100} style={{width: "50px", height: "50px"}}></img>
                        <div className="media-body text-end me-3">
                          <p className="mb-0 text-white">Balance</p>
                          <h4 className="mb-0 text-white">{balancesGLMR? balancesGLMR.Moonbeam : ""}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
						</div>
					</form>
				</div>
			</div>
		</div>
  )
:
  (
    <div className="card" style={{backgroundColor:"171622", color:"#9E38FF"}}>
    <div className="card-body" style={{marginLeft:"-50px", marginBottom:"-10px", marginTop:"-10px"}}>
      <div className="basic-form">
        <form className="form-wrapper">
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
                        <h2 className="text-warning" ><span style={{color:"orange"}} onClick={() => tokenClicked("RESET")}>RESET</span></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
            <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#0E86D4", width:"100%", }}>
              <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                <div className="media" style={{height:"40px"}}>
                  <div className="media-body text-white text-center">
                   <h4 className="text-white">COLLATOR</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
            <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#0E86D4", width:"100%", }}>
              <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                <div className="media" style={{height:"40px"}}>
                  <div className="media-body text-white text-center">
                    <h4 className="text-white">ACTION</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
            <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#0E86D4", width:"100%", }}>
              <div className="card-body  p-2"  style={{ backgroundColor:"", }}>
                <div className="media" style={{height:"40px"}}>
                  <div className="media-body text-white text-center">
                    <h4 className="text-white">WAIT PERIOD</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------2nd ROW------------------- */}

{unstakingInfoDiv}

        </div>
      </form>
    </div>
  </div>
</div>
  )
}
	</div>
	</>
	)
}
export default Polkadot;