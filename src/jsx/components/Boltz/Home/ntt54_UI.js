import React,{useState,useEffect} from 'react';
 
import aca100 from '../../../../icons/crypto/aca100.png';     
import ksm100 from '../../../../icons/crypto/ksm100.png'; 
import kar100 from '../../../../icons/crypto/kar100.png'; 
import movr100 from '../../../../icons/crypto/movr100.png'; 
import kint100 from '../../../../icons/crypto/kint100.png';  
import pha100 from '../../../../icons/crypto/pha100.png';
import ausd100 from '../../../../icons/crypto/ausd100.png';
import kbtc100 from '../../../../icons/crypto/kbtc100.png';
 


const QuickTrade = ({ 
  resetTargetAccount, originChainSelected, destinationChainSelected, selectedTokenfunction, selectedDestinationChainfunction, selectedOriginChainfunction, 
  resetState, balancesKSM, balancesKAR, balancesMOVR, balancesKINT, balancesPHA, balancesAUSD, balancesKBTC, selectedActionfunction,
}) => {

  const [action, setAction] = useState("");    
  const [instructionStatus, setInstructionStatus] = useState("");     

  const [stateOfMatrix, setStateOfMatrix] = useState("none");     
  const [stateOfKSM , setStateOfKSM]  = useState("none");     
  const [stateOfKAR , setStateOfKAR]  = useState("none");     
  const [stateOfMOVR, setStateOfMOVR] = useState("none");     
  const [stateOfKINT, setStateOfKINT] = useState("none");     
  const [stateOfPHA , setStateOfPHA]  = useState("none");    
  const [stateOfAUSD, setStateOfAUSD] = useState("none");     
  const [stateOfKBTC, setStateOfKBTC] = useState("none");     

	const [rowKSM, setRowKSM] = useState({opacity: 1, clickable: "" })
	const [rowKAR, setRowKAR] = useState({opacity: 1, clickable: "" })
	const [rowMOVR, setRowMOVR] = useState({opacity: 1, clickable: "" })
	const [rowKINT, setRowKINT] = useState({opacity: 1, clickable: "" })
	const [rowPHA, setRowPHA] = useState({opacity: 1, clickable: "" })
	const [rowAUSD, setRowAUSD] = useState({opacity: 1, clickable: "" })
	const [rowKBTC, setRowKBTC] = useState({opacity: 1, clickable: "" })
	
  const colorOriginChain      =  "#FF5F1F";
  const colorDestinationChain =  "#FF5F1F";


  //#region Element Properties
  const [elemKSM, setElemKSM] = useState(
    [
      { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1,},
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: "" },
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )

  const [elemKAR, setElemKAR] = useState(
    [
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1,   clickable: ""},
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )

  const [elemMOVR, setElemMOVR] = useState(
    [
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )

  const [elemKINT, setElemKINT] = useState(
    [
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )

  const [elemPHA, setElemPHA] = useState(
    [
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )

  const [elemAUSD, setElemAUSD] = useState(
    [
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )

  const [elemKBTC, setElemKBTC] = useState(
    [
      { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
      { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
      { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
      { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
    ]
  )
  //#endregion


  //#region
  const actionModuleClicked = (choice) => {
    console.log(`User has chosen: ${choice}`)
    setAction(choice);
    selectedActionfunction(choice);  //Informs XCM Transfer Center

    if (choice==="autostakeKSMtoKarura")
    {
      tokenClicked("KSM");
      setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKBTC("none");
      setInstructionStatus("KSMstaking");
      setElemKSM((result) => [ result[0], { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: "none" }, result[2], result[3], { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 0, clickable: "none" } ] );

    }
    else if (choice==="XCMtransfer")
    {
      setStateOfKSM("auto"); setStateOfKAR("auto");  setStateOfMOVR("auto");  setStateOfKINT("auto");  setStateOfPHA("auto");  setStateOfAUSD("auto"); setStateOfKBTC("auto");
      setInstructionStatus("Step1");
    }
    else if (choice==="unstakeKSMfromLKSMatKarura")
    {
      setInstructionStatus("KSMunstaking");
      selectedTokenfunction("LKSM=>KSM")
      selectedOriginChainfunction("Karura");
      selectedDestinationChainfunction("Karura");
    }

    setStateOfMatrix("auto");
  }
  //#endregion


  //#region KSM_chainTabClicked
  const KSM_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKBTC("none");

    if (originChainSelected==="Origin Chain") 
    {
      selectedOriginChainfunction(choice);
      switch (choice) {
          case "Kusama":
            setElemKSM((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2], result[3], result[4] ] );
            break;
          case "Karura":
            setElemKSM((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2], result[3], result[4] ] );
            break;
          case "Moonriver":
            setElemKSM((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,},  result[3], result[4] ] );
            break;
          case "Kintsugi":
            setElemKSM((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[4] ] );
            break;
          case "Phala":
            setElemKSM((result) => [ result[0],  { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 0, clickable: "none"},  { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 0, clickable: "none" }, { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 0, clickable: "none"}, { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
      }

      if (action==="XCMtransfer") setInstructionStatus("Step3");

    }
    else if (destinationChainSelected==="Target Chain") 
    {
      selectedDestinationChainfunction(choice);
      switch (choice) {
        case "Kusama":
          setElemKSM((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#3a3f49", opacity: 1,}, result[1], result[2], result[3], result[4] ] );
          break;
        case "Karura":
          setElemKSM((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[2], result[3], result[4] ] );
          break;
        case "Moonriver":
          setElemKSM((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,},  result[3], result[4] ] );
          break;
        case "Kintsugi":
          setElemKSM((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[4] ] );
          break;
        case "Phala":
          setElemKSM((result) => [ result[0], result[1], result[2], result[3], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }
    }
    else tokenClicked();

  }
  //#endregion

  //#region
  const KAR_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKSM("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKBTC("none");

    if (originChainSelected==="Origin Chain") 
    {
      setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
          case "Karura":
            setElemKAR((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
            break;
          case "Moonriver":
            setElemKAR((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
            break;
          case "Kintsugi":
            setElemKAR((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
            break;
          case "Phala":
            setElemKAR((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 0, clickable: "none" }, result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
            break;
      }
    }
    else if (destinationChainSelected==="Target Chain") 
    {
      selectedDestinationChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemKAR((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
          break;
        case "Moonriver":
          setElemKAR((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemKAR((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemKAR((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }
    }
    else tokenClicked();

  }
  //#endregion

  //#region
  const MOVR_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKAR("none");  setStateOfKSM("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKBTC("none");

    if (originChainSelected==="Origin Chain") 
    {
      setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemMOVR((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 0, clickable: "none"} ] );
          break;
        case "Moonriver":
          setElemMOVR((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemMOVR((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemMOVR((result) => [ { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 0, clickable: "none"}, result[1], result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
    }
  }
  else if (destinationChainSelected==="Target Chain") 
  {
    selectedDestinationChainfunction(choice);
    switch (choice) {
      case "Karura":
        setElemMOVR((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
        break;
      case "Moonriver":
        setElemMOVR((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
        break;
      case "Kintsugi":
        setElemMOVR((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
        break;
      case "Phala":
        setElemMOVR((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
        break;
    }
  }
    else tokenClicked();

  }
  //#endregion

  //#region
  const KINT_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKSM("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKBTC("none");

    if (originChainSelected==="Origin Chain") 
    {
      setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemKINT((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
          break;
        case "Moonriver":
          setElemKINT((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemKINT((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemKINT((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }
    }
    else if (destinationChainSelected==="Target Chain") 
    {
      selectedDestinationChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemKINT((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
          break;
        case "Moonriver":
          setElemKINT((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemKINT((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemKINT((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
      }
    }
    else tokenClicked();

  }
  //#endregion

  //#region
  const PHA_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfKSM("none");  setStateOfAUSD("none"); setStateOfKBTC("none");

    if (originChainSelected==="Origin Chain") 
    {
      setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemPHA((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
          break;
        case "Moonriver":
          setElemPHA((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemPHA((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemPHA((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
    }
  }
  else if (destinationChainSelected==="Target Chain") 
  {
    selectedDestinationChainfunction(choice);
    switch (choice) {
      case "Karura":
        setElemPHA((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
        break;
      case "Moonriver":
        setElemPHA((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
        break;
      case "Kintsugi":
        setElemPHA((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
        break;
      case "Phala":
        setElemPHA((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
        break;
    }
  }
    else tokenClicked();

  }
  //#endregion

  //#region
  const AUSD_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfKSM("none"); setStateOfKBTC("none");

    if (originChainSelected==="Origin Chain") 
    {
      setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemAUSD((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
          break;
        case "Moonriver":
          setElemAUSD((result) => [ result[0], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemAUSD((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemAUSD((result) => [ result[0], { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 0, clickable: "none"}, result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
    }
  }
  else if (destinationChainSelected==="Target Chain") 
  {
    selectedDestinationChainfunction(choice);
    switch (choice) {
      case "Karura":
        setElemAUSD((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
        break;
      case "Moonriver":
        setElemAUSD((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
        break;
      case "Kintsugi":
        setElemAUSD((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
        break;
      case "Phala":
        setElemAUSD((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
        break;
    }
  }
    else tokenClicked();

  }
  //#endregion

  //#region
  const KBTC_chainTabClicked = (choice) => {
    console.log(`chainTabClicked originChainSelected:${originChainSelected} destinationChainSelected:${destinationChainSelected} choice:${choice}`)
    setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKSM("none");

    if (originChainSelected==="Origin Chain") 
    {
      setInstructionStatus("Step3");

      selectedOriginChainfunction(choice);
      switch (choice) {
        case "Karura":
          setElemKBTC((result) => [ { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
          break;
        case "Moonriver":
          setElemKBTC((result) => [ { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 0, clickable: "none"}, { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
          break;
        case "Kintsugi":
          setElemKBTC((result) => [ result[0], result[1], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
          break;
        case "Phala":
          setElemKBTC((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorOriginChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
          break;
    }
  }
  else if (destinationChainSelected==="Target Chain") 
  {
    selectedDestinationChainfunction(choice);
    switch (choice) {
      case "Karura":
        setElemKBTC((result) => [ { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#890000", opacity: 1,}, result[1], result[2], result[3] ] );
        break;
      case "Moonriver":
        setElemKBTC((result) => [ result[0], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#0E86D4", opacity: 1,}, result[2], result[3] ] );
        break;
      case "Kintsugi":
        setElemKBTC((result) => [ result[0], result[1], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#394d6d", opacity: 1,},  result[3] ] );
        break;
      case "Phala":
        setElemKBTC((result) => [ result[0], result[1], result[2], { activebackgroundColor: colorDestinationChain, backgroundColorDefault: "#8fcb02", opacity: 1,} ] );
        break;
    }
  }
    else tokenClicked();

  }
  //#endregion


	const tokenClicked = (assetClicked) => {
    setInstructionStatus("Step2");

		console.log(`Asset ${assetClicked} was clicked`);
		if (assetClicked==="KSM")
		{
			setRowKAR({opacity: 0, clickable: "none", backgroundColor:"black" }); setRowMOVR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKINT({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKBTC({opacity: 0, clickable: "none", backgroundColor:"black"  });
			selectedTokenfunction("KSM");
			setRowKSM({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("KSM");
		}
		else if (assetClicked==="KAR")
		{
			setRowKSM({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowMOVR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKINT({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKBTC({opacity: 0, clickable: "none", backgroundColor:"black"  });
			selectedTokenfunction("KAR");
			setRowKAR({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("KAR");
		}
		else if (assetClicked==="MOVR")
		{
			setRowKSM({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKAR({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowKINT({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowPHA({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowAUSD({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowKBTC({opacity: 0, clickable: "none" , backgroundColor:"black" });
			selectedTokenfunction("MOVR");
			setRowMOVR({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("MOVR");
		}
		else if (assetClicked==="KINT")
		{
			setRowKSM({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKAR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowMOVR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKBTC({opacity: 0, clickable: "none" , backgroundColor:"black" });
			selectedTokenfunction("KINT");
			setRowKINT({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("KINT");
		}
		else if (assetClicked==="PHA")
		{
			setRowKSM({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKAR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowMOVR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKINT({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKBTC({opacity: 0, clickable: "none" , backgroundColor:"black" });
			selectedTokenfunction("PHA");
			setRowPHA({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("PHA");
		}
		else if (assetClicked==="AUSD")
		{
			setRowKSM({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKAR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowMOVR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKINT({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowKBTC({opacity: 0, clickable: "none" , backgroundColor:"black" });
			selectedTokenfunction("AUSD");
			setRowAUSD({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("AUSD");
		}
		else if (assetClicked==="KBTC")
		{
			setRowKSM({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowKAR({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowMOVR({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowKINT({opacity: 0, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 0, clickable: "none" , backgroundColor:"black" }); setRowAUSD({opacity: 0, clickable: "none", backgroundColor:"black"  });
			selectedTokenfunction("KBTC");
			setRowKBTC({opacity: 1, clickable: "" , backgroundColor: colorOriginChain})
      resetTargetAccount("KBTC");
		}
		else 
		{
			setRowKSM({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowKAR({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowMOVR({opacity: 1, clickable: "none", backgroundColor:"black" }); setRowKINT({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowPHA({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowAUSD({opacity: 1, clickable: "none", backgroundColor:"black"  }); setRowKBTC({opacity: 1, clickable: "none" , backgroundColor:"black" });
			selectedTokenfunction("Token");
      selectedOriginChainfunction("Origin Chain");
      selectedDestinationChainfunction("Target Chain");

      resetTargetAccount("");

      setElemKSM(
        [
          { activebackgroundColor: "#3a3f49", backgroundColorDefault: "#3a3f49", opacity: 1,},
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );
      setElemKAR(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1,  clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );
      setElemMOVR(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );
      setElemKINT(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );
      setElemPHA(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );
      setElemAUSD(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );
      setElemKBTC(
        [
          { activebackgroundColor: "#890000", backgroundColorDefault: "#890000", opacity: 1, clickable: ""},
          { activebackgroundColor: "#0E86D4", backgroundColorDefault: "#0E86D4", opacity: 1, clickable: ""},
          { activebackgroundColor: "#394d6d", backgroundColorDefault: "#394d6d", opacity: 1, clickable: ""},
          { activebackgroundColor: "#8fcb02", backgroundColorDefault: "#8fcb02", opacity: 1, clickable: ""},
        ]
      );

      setStateOfMatrix("none");
      setAction("");
      setInstructionStatus("");
      setStateOfKSM("none"); setStateOfKAR("none");  setStateOfMOVR("none");  setStateOfKINT("none");  setStateOfPHA("none");  setStateOfAUSD("none"); setStateOfKBTC("none");
		}

	}

	useEffect(() => {
		tokenClicked("");
	}, [resetState]);

  useEffect(() => {
    if (action==="autostakeKSMtoKarura" && originChainSelected!=="Origin Chain") KSM_chainTabClicked("Karura");
	}, [originChainSelected, action]);
   

	return(
		<>
			<div>
        <div className="card" style={{marginTop:"0px",paddingTop:"0px",backgroundColor:"",color:"#9E38FF"}}>
          <div className=" d-block m-0 p-0"style={{marginTop:"0px",paddingTop:"0px",backgroundColor:""}}>
            
              {action===""? (
            
                <div className="row" style={{ marginTop:"0px"}}>
                  <div className="col-xl-12 col-xxl-4 col-lg-6 col-sm-6 p-0 m-0" >
                    <div>
                      <p className="fs-28 text-center text-white">What Would You Like To Do?</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
                      <button type="button" className="btn btn-outline-warning btn-sm mx-4 py-1" onClick={() => actionModuleClicked("XCMtransfer")}>Use XCM To Make A Cross Chain Transfer</button>
                    </div> 
                    <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
                      <button type="button" className="btn btn-outline-danger btn-sm mx-4 py-1" onClick={() => actionModuleClicked("autostakeKSMtoKarura")}>Use XCM To AutoStake KSM On Karura</button>
                    </div> 
                    <div className="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
                      <button type="button" className="btn btn-outline-danger btn-sm mx-4 py-1" onClick={() => actionModuleClicked("unstakeKSMfromLKSMatKarura")}>UnStake KSM from LKSM On Karura</button>
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
                    :  instructionStatus==="KSMstaking"? (
                      <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Select The <span style={{color:"yellow"}}>Origin Chain KSM Balance </span> To Transfer And Stake</span></h4>
                    )
                    :  instructionStatus==="KSMunstaking"? (
                      <h4 className="fs-30 text-center mt-2"><span style={{color:"white"}}>Unstaking <span style={{color:"yellow"}}>KSM from LKSM </span>and depositing at Karura</span></h4>
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
        <div className="card mb-0" style={{paddingRight:"",backgroundColor:"",color:"#9E38FF"}}>
          <div className="card-body mt-0 p-0" style={{backgroundColor:"",marginLeft:"-50px", marginBottom:"-10px", marginTop:"-10px"}}>
            <div className="basic-form"style={{backgroundColor:""}}>
              <form className="form-wrapper mb-0">
                <div className="form-group mb-0">

{/* ------------------Parachain Title Row------------------- */}

                <div className="row" style={{ marginTop:"0px"}}>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6 px-3" style={{height:"50px", padding:"2px", cursor:"pointer"}} onClick={() => tokenClicked("")}>
                    <div className="row">
                      <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                      <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"75px"}}>
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
                      <div className="card-body  p-2">
                        <div className="media" style={{height:"40px"}}>
                          <div className="media-body text-white text-center">
                            <h4 className="text-white">KUSAMA</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"50px", padding:"2px" }}>
                    <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#890000", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height:"40px"}}>
                          <div className="media-body text-white text-center">
                            <h4 className="text-white">KARURA</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                    <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#0E86D4", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height:"40px"}}>
                          <div className="media-body text-white text-center">
                            <h4 className="text-white">MOONRIVER</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                    <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#394d6d", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height:"40px"}}>
                          <div className="media-body text-white text-center">
                            <h4 className="text-white">KINTSUGI</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"50px", padding:"2px" }}>
                    <div className="widget-stat card" style={{ height:"100%", backgroundColor: "#8fcb02", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height:"40px"}}>
                          <div className="media-body text-white text-center">
                            <h4 className="text-white">PHALA</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

{/* ------------------2nd ROW------------------- */}

                <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfKSM}`}} onClick={() => tokenClicked("KSM")}>
                    <div className="row">
                      <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                      <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
                        <div className="widget-stat card" style={{backgroundColor:  `${rowKSM.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                          <div className="card-body  p-2" style={{ width:"100%"}}>
                            <div className="media" style={{height:"60px"}}>
                              <div className="media-body text-white text-center">
                                <h2 className="text-white" onClick={() => tokenClicked("KSM")}>KSM</h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKSM.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKSM.clickable}`}}   onClick={() => KSM_chainTabClicked("Kusama")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKSM[0].activebackgroundColor}`,  opacity: `${elemKSM[0].opacity}`, transition:"opacity 1s",   width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{ height: "50px"}}>
                          <img src={ksm100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white"> {balancesKSM? balancesKSM.Kusama : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKSM.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKSM[1].clickable==="none" || rowKSM.clickable==="none")?"none":""}` }}  onClick={() => KSM_chainTabClicked("Karura")}>
                    <div className="widget-stat card " style={{ height:"100%",  backgroundColor: `${elemKSM[1].activebackgroundColor}`,  opacity: `${elemKSM[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={ksm100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesKSM? balancesKSM.Karura : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKSM.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKSM[2].clickable==="none" || rowKSM.clickable==="none")?"none":""}` }}  onClick={() => KSM_chainTabClicked("Moonriver")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKSM[2].activebackgroundColor}`,  opacity: `${elemKSM[2].opacity}`, transition:"opacity 1s", width:"100%",  }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={ksm100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesKSM? balancesKSM.Moonriver : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKSM.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKSM[3].clickable==="none" || rowKSM.clickable==="none")?"none":""}` }}  onClick={() => KSM_chainTabClicked("Kintsugi")}>
                    <div className="widget-stat card " style={{ height:"100%",  backgroundColor: `${elemKSM[3].activebackgroundColor}`,  opacity: `${elemKSM[3].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={ksm100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesKSM? balancesKSM.Kintsugi : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKSM.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKSM[4].clickable==="none" || rowKSM.clickable==="none")?"none":""}` }}  onClick={() => KSM_chainTabClicked("Phala")}>
                    <div className="widget-stat card " style={{ height:"100%",  backgroundColor: `${elemKSM[4].activebackgroundColor}`,  opacity: `${elemKSM[4].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={ksm100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white ">Balance</p>
                              <h4 className="mb-0 text-white">{balancesKSM? balancesKSM.Phala : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

{/* ------------------3rd ROW------------------- */}

                <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfKAR}`}} onClick={() => tokenClicked("KAR")}>
                    <div className="row">
                      <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                        <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
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
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKAR.clickable}`}}></div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKAR.clickable} `}} onClick={() => KAR_chainTabClicked("Karura")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemKAR[0].activebackgroundColor}`,  opacity: `${elemKAR[0].opacity}`, transition:"opacity 1s",  width:"100%", }} >
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={kar100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesKAR? balancesKAR.Karura : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKAR.clickable}`}} >
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKAR[1].activebackgroundColor}`,  opacity: `${elemKAR[1].opacity}`, transition:"opacity 1s", width:"100%", clickable: `${elemKAR[1].clickable}`, }} onClick={() => {  
                          if (elemKAR[1].clickable==="") KAR_chainTabClicked("Moonriver") ;
                          } 
                        }>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={kar100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesKAR? balancesKAR.Moonriver : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKAR.clickable}`}}>
                    <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: '#5685e6',  backgroundColor: "#1e1e2a", width:"100%", }}>
                      <div className="card-body  p-3">
                        <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                        <h6 className="m-0 text-white text-center">Not Available Yet</h6>                        
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKAR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKAR.clickable}`}} onClick={() => KAR_chainTabClicked("Phala")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemKAR[3].activebackgroundColor}`,  opacity: `${elemKAR[3].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={kar100} style={{width: "50px", height: "50px"}}></img>
                          <div className="media-body text-end me-3">
                            <p className="mb-0 text-white ">Balance</p>
                            <h4 className="mb-0 text-white">{balancesKAR? balancesKAR.Phala : ""}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

{/* ------------------4th ROW------------------- */}

                <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfMOVR}`}} onClick={() => tokenClicked("MOVR")}>
                    <div className="row">
                      <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                      <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
                        <div className="widget-stat card" style={{backgroundColor: `${rowMOVR.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                          <div className="card-body  p-2" style={{ width:"100%"}}>
                            <div className="media" style={{height:"60px"}}>
                              <div className="media-body text-white text-center">
                                <h2 className="text-white" onClick={() => tokenClicked("MOVR")}>MOVR</h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowMOVR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowMOVR.clickable}`}} ></div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowMOVR.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemMOVR[0].clickable==="none" || rowMOVR.clickable==="none")?"none":""}`}} onClick={() => MOVR_chainTabClicked("Karura")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemMOVR[0].activebackgroundColor}`,  opacity: `${elemMOVR[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={movr100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesMOVR? balancesMOVR.Karura : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowMOVR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowMOVR.clickable}`}} onClick={() => MOVR_chainTabClicked("Moonriver")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemMOVR[1].activebackgroundColor}`,  opacity: `${elemMOVR[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={movr100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white">Balance</p>
                              <h4 className="mb-0 text-white">{balancesMOVR? balancesMOVR.Moonriver : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowMOVR.opacity}`, transition:"opacity 1s", pointerEvents:`${rowMOVR.clickable}`}}>
                    <div className="widget-stat card " style={{ height:"100%", borderWidth: "1px", borderColor:  '#5685e6',  backgroundColor: "#1e1e2a", width:"100%", }}>
                      <div className="card-body  p-3">
                        <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                        <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowMOVR.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemMOVR[3].clickable==="none" || rowMOVR.clickable==="none")?"none":""}`}} onClick={() => MOVR_chainTabClicked("Phala")}>
                    <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemMOVR[3].activebackgroundColor}`,  opacity: `${elemMOVR[3].opacity}`, transition:"opacity 1s", width:"100%", }}>
                      <div className="card-body  p-2">
                        <div className="media" style={{height: "50px"}}>
                          <img src={movr100} style={{width: "50px", height: "50px"}}></img>
                            <div className="media-body text-end me-3">
                              <p className="mb-0 text-white ">Balance</p>
                              <h4 className="mb-0 text-white">{balancesMOVR? balancesMOVR.Phala : ""}</h4>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


{/* ------------------5th ROW------------------- */}


                 <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfKINT}`}} onClick={() => tokenClicked("KINT")}>
                      <div className="row">
                        <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                        <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
                          <div className="widget-stat card" style={{backgroundColor: `${rowKINT.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                            <div className="card-body  p-2" style={{ width:"100%"}}>
                              <div className="media" style={{height:"60px"}}>
                                <div className="media-body text-white text-center">
                                  <h2 className="text-white">KINT</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKINT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKINT.clickable}`}}></div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKINT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKINT.clickable}`}} onClick={() => KINT_chainTabClicked("Karura")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKINT[0].activebackgroundColor}`,  opacity: `${elemKINT[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={kint100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesKINT? balancesKINT.Karura : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKINT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKINT.clickable}`}} onClick={() => KINT_chainTabClicked("Moonriver")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKINT[1].activebackgroundColor}`,  opacity: `${elemKINT[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={kint100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesKINT? balancesKINT.Moonriver : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKINT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKINT.clickable}`}} onClick={() => KINT_chainTabClicked("Kintsugi")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKINT[2].activebackgroundColor}`,  opacity: `${elemKINT[2].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={kint100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesKINT? balancesKINT.Kintsugi : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKINT.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKINT.clickable}`}} >
                      <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: '#5685e6', backgroundColor: "#1e1e2a", width:"100%", }}>
                        <div className="card-body  p-3">
                          <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                          <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                        </div>
                      </div>
                    </div>
                  </div>

{/* ------------------6th ROW------------------- */}

                  <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfPHA}`}} onClick={() => tokenClicked("PHA")}>
                      <div className="row">
                        <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                        <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
                          <div className="widget-stat card" style={{backgroundColor: `${rowPHA.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                            <div className="card-body  p-2" style={{ width:"100%"}}>
                              <div className="media" style={{height:"60px"}}>
                                <div className="media-body text-white text-center">
                                  <h2 className="text-white">PHA</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}}></div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}} onClick={() => PHA_chainTabClicked("Karura")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemPHA[0].activebackgroundColor}`,  opacity: `${elemPHA[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={pha100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesPHA? balancesPHA.Karura : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}} onClick={() => PHA_chainTabClicked("Moonriver")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemPHA[1].activebackgroundColor}`,  opacity: `${elemPHA[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={pha100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesPHA? balancesPHA.Moonriver : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}} >
                      <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: "#5685e6", backgroundColor:"#1e1e2a", width:"100%", }}>
                        <div className="card-body  p-3">
                          <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                          <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowPHA.opacity}`, transition:"opacity 1s", pointerEvents:`${rowPHA.clickable}`}} onClick={() => PHA_chainTabClicked("Phala")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemPHA[3].activebackgroundColor}`,  opacity: `${elemPHA[3].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={pha100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white ">Balance</p>
                                <h4 className="mb-0 text-white">{balancesPHA? balancesPHA.Phala : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


{/* ------------------7th ROW------------------- */}


                  <div className="row" style={{ marginTop:"10px", cursor:"pointer"}}>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfAUSD}`}} onClick={() => tokenClicked("AUSD")}>
                      <div className="row">
                        <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                        <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
                          <div className="widget-stat card" style={{backgroundColor: `${rowAUSD.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                            <div className="card-body  p-2" style={{ width:"100%"}}>
                              <div className="media" style={{height:"60px"}}>
                                <div className="media-body text-white text-center">
                                  <h2 className="text-white">AUSD</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${rowAUSD.clickable}` }}></div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${rowAUSD.clickable}` }} onClick={() => AUSD_chainTabClicked("Karura")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemAUSD[0].activebackgroundColor}`,  opacity: `${elemAUSD[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={ausd100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesAUSD? balancesAUSD.Karura : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemAUSD[1].clickable==="none" || rowAUSD.clickable==="none")?"none":""}` }}  onClick={() => AUSD_chainTabClicked("Moonriver")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemAUSD[1].activebackgroundColor}`,  opacity: `${elemAUSD[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={ausd100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesAUSD? balancesAUSD.Moonriver : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${rowAUSD.clickable}` }}  >
                      <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: "#5685e6", backgroundColor:"#1e1e2a", width:"100%"}}>
                        <div className="card-body  p-3">
                          <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                          <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowAUSD.opacity}`, transition:"opacity 1s", pointerEvents:`${rowAUSD.clickable}` }}  onClick={() => AUSD_chainTabClicked("Phala")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemAUSD[3].activebackgroundColor}`,  opacity: `${elemAUSD[3].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={ausd100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white ">Balance</p>
                                <h4 className="mb-0 text-white">{balancesAUSD? balancesAUSD.Phala : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

{/* ------------------8th ROW------------------- */}

                  <div className="row" style={{marginTop:"10px", cursor:"pointer"}}>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{height:"70px", pointerEvents: `${stateOfKBTC}`}} onClick={() => tokenClicked("KBTC")}>
                      <div className="row">
                          <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" ></div>
                          <div className="col-xl-10 col-xxl-4 col-lg-6 col-sm-6" style={{height:"100px"}}>
                            <div className="widget-stat card" style={{backgroundColor: `${rowKBTC.backgroundColor}`, borderWidth: "1px", borderColor: "#5685e6"}}>
                              <div className="card-body  p-2" style={{ width:"100%"}}>
                                <div className="media" style={{height:"60px"}}>
                                <div className="media-body text-white text-center">
                                  <h2 className="text-white">KBTC</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px",  opacity:`${rowKBTC.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKBTC.clickable}`}}></div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKBTC.opacity}`, transition:"opacity 1s", pointerEvents:`${(elemKBTC[0].clickable==="none" || rowKBTC.clickable==="none")?"none":""}` }}  onClick={() => KBTC_chainTabClicked("Karura")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKBTC[0].activebackgroundColor}`,  opacity: `${elemKBTC[0].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={kbtc100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesKBTC? balancesKBTC.Karura : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKBTC.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKBTC.clickable}` }} onClick={() => KBTC_chainTabClicked("Moonriver")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor:`${elemKBTC[1].activebackgroundColor}`,  opacity: `${elemKBTC[1].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={kbtc100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesKBTC? balancesKBTC.Moonriver : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px",  opacity:`${rowKBTC.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKBTC.clickable}` }} onClick={() => KBTC_chainTabClicked("Kintsugi")}>
                      <div className="widget-stat card " style={{ height:"100%", backgroundColor: `${elemKBTC[2].activebackgroundColor}`,  opacity: `${elemKBTC[2].opacity}`, transition:"opacity 1s", width:"100%", }}>
                        <div className="card-body  p-2">
                          <div className="media" style={{height: "50px"}}>
                            <img src={kbtc100} style={{width: "50px", height: "50px"}}></img>
                              <div className="media-body text-end me-3">
                                <p className="mb-0 text-white">Balance</p>
                                <h4 className="mb-0 text-white">{balancesKBTC? balancesKBTC.Kintsugi : ""}</h4>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-xxl-4 col-lg-6 col-sm-6" style={{ height:"70px", padding:"2px", opacity:`${rowKBTC.opacity}`, transition:"opacity 1s", pointerEvents:`${rowKBTC.clickable}` }} >
                      <div className="widget-stat card " style={{height:"100%", borderWidth: "1px", borderColor: "#5685e6", backgroundColor: "#1e1e2a", width:"100%", }}>
                        <div className="card-body  p-3">
                          <h6 className="m-0 text-white text-center">Transfer Channel</h6>
                          <h6 className="m-0 text-white text-center">Not Available Yet</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
			</div>
		</>
	)
}
export default QuickTrade;