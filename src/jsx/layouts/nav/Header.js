import React, { useEffect, useState, useCallback } from 'react'    
import { Dropdown } from "react-bootstrap";


const Header = ({ polakdotSignerfunction, polkadtoAccountList, evm_api_state, accountList }) => {

	const [dropdowncolor, setDropdowncolor] = useState("#DE5106");
	const [dropdownDisabled, setDropdownDisabled] = useState(true);		
	const [polkadotAccount, setPolkadotAccount] = useState("");
	const [polkadotAccountsDropDown, setPolkadotAccountsDropDown] = useState("");

  const [metamaskAccount, setMetaMaskAccount] = useState("Reading MetaMask Extension");
	const [metamaskAccountsDropDown, setMetaMaskAccountsDropDown] = useState("");
  // console.log(`metamaskAccount: `,metamaskAccount,`  setMetaMaskAccountsDropDown: `,metamaskAccountsDropDown);
  

  useEffect(() => {
    console.log(dropdownDisabled," ",dropdowncolor,"  ",)
      if (evm_api_state)
      {
        setDropdowncolor("white");
        setDropdownDisabled(false);
      } else {
        setDropdowncolor("#DE5106");
        setDropdownDisabled(true);
      }
  },[evm_api_state])

    
  useEffect(() => {
    setMetaMaskAccountsDropDown( refreshMetaMaskAccountsList(accountList) );
  },[accountList])

  //#region Polkadot Accounts Drop List
  const refreshPolkadotAccountsList = useCallback ( (tokens) => {
    if (tokens)
    {
      return tokens.map((token, index) => {
        return (
          <Dropdown.Item key={index}  onClick={() => { 
            setPolkadotAccount(token);
            polakdotSignerfunction(token);
            console.log(`Polkadot Account is: ${token}`);
        } }>{token}</Dropdown.Item>
        )
      });
    }
    else return <>Loading data...</> 
  },[polakdotSignerfunction]);

  useEffect(() => {
    setPolkadotAccountsDropDown( refreshPolkadotAccountsList(polkadtoAccountList) );
    console.log("Header polkadtoAccountList=> ",polkadtoAccountList);
    if (polkadtoAccountList.length > 0)
    {
      setPolkadotAccount(polkadtoAccountList[0]);
      polakdotSignerfunction(polkadtoAccountList[0]);
    }

  },[polkadtoAccountList, polakdotSignerfunction, refreshPolkadotAccountsList])


  
  const polokadotAccountMenu =   (			
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <Dropdown className="weather-btn mb-2" style={{backgroundColor:"#171622", marginTop:"20px",}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"650px", fontSize:"12px", color: dropdowncolor,  backgroundColor:"#171622"}}>
              <span className="fs-22 font-w650 d-flex" style={{color: dropdowncolor,  backgroundColor:"#171622"}}><i className="fa fa-google-wallet">Polkadot</i></span>
              <span className="fs-14 font-w650 d-flex" style={{color: dropdowncolor, backgroundColor:"#171622", marginRight:"10px"}}>{polkadotAccount? polkadotAccount : "Sign in to Polkadot Extension"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{height:"200px", width:"650px", overflowY: "scroll", fontSize:"14px"}}>{polkadotAccountsDropDown}</Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
          )
  //#endregion


  //#region MetaMask Accounts Drop List
  const refreshMetaMaskAccountsList = (tokens) =>{
    if (tokens)
    {
      return tokens.map((token, index) => {
        return (
          <Dropdown.Item key={index}  onClick={() => { 
            setMetaMaskAccount(token);
            console.log(`MetaMask Account is: ${token}`);
        } }>{token}</Dropdown.Item>
        )
      });
    }
    else return <>Loading data...</> 
  }
  

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">

            <div className="header-left">
                <li className="nav-item">
                  <div  style={{ width: "30vw"}}> 
                  </div>
                </li>
            </div>

            <div className="header-left">
                <Dropdown className="weather-btn mb-2" style={{backgroundColor:"#171622", fontSize:"14px", marginTop:"20px" }}>
                    <span className="fs-22 font-w650 d-flex" style={{color: dropdowncolor,  backgroundColor:"#171622"}}><i className="fa fa-google-wallet me-3 ms-3">MetaMask</i></span>
                    <span className="fs-14 font-w650 d-flex" style={{color: dropdowncolor, backgroundColor:"#171622", marginRight:"20px"}}>{accountList? accountList : "Sign in to Metamask"}</span>
                </Dropdown>  
            </div>
            <div className="header-left">
                <ul className="navbar-nav  main-notification">
                   {polokadotAccountMenu}
                </ul>
            </div>

          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
