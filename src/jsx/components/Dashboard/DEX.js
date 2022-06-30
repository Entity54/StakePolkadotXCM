import React,{useState, useContext, useEffect} from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import { Card,  Tab, Nav } from "react-bootstrap";

import QuickTrade from '../Boltz/Home/ntt54_QuickTrade';
import UI from '../Boltz/Home/ntt54_UI';
import BasiliskUI from '../Boltz/Home/ntt54_RococoBasilisk_UI';
import PolkadotUI from '../Boltz/Home/ntt54_Polkadot_UI';



import { getAvailableBalancePOLKADOT, getAvailableBalance, getRococo_AvailableBalance } from '../../../Setup.js';
 
 
const DEX = ({ setupSpecs, relaySpecs, karuraAlphaSpecs, blockHeader, accountList, polakdotAccountSigner }) => {
    
	const [tokenSelected, setTokenSelected] = useState("Token");
	const [originChainSelected, setOriginChainSelected] = useState("Origin Chain");
	const [destinationChainSelected, setDestinationChainSelected] = useState("Target Chain");
	const [targetAccount, setTargetAccount] = useState("");

	const [accountFormats, setAccountFormats] = useState("");

	const [balancesKSM,  setBalancesKSM]  = useState("");
	const [balancesKAR,  setBalancesKAR]  = useState("");
	const [balancesMOVR, setBalancesMOVR] = useState("");
	const [balancesKINT, setBalancesKINT] = useState("");
	const [balancesPHA,  setBalancesPHA]  = useState("");
	const [balancesAUSD, setBalancesAUSD] = useState("");
	const [balancesKBTC, setBalancesKBTC] = useState("");

	const [balancesDOT,  setBalancesDOT]  = useState("");
	const [balancesACA,  setBalancesACA]  = useState("");
	const [balancesGLMR,  setBalancesGLMR]  = useState("");
	const [balancesPAUSD,  setBalancesPAUSD]  = useState("");

	const [availableAmountToTransfer, setAvailableAmountToTransfer] = useState("");

	const [resetState, setResetState] = useState(false);
	const [selectedAction, setSelectedAction] = useState("");    

	//Rococo
	const [rococoBalancesBSX, setRococoBalancesBSX]  = useState("");
	const [rococoBalancesPHA, setRococoBalancesPHA] = useState("");
	// const [rococoBalancesKAR, setRococoBalancesKAR]  = useState("");

	const [ecosystem, setEcosystem] = useState("Polkadot");    //Polkadot, Kusama, Rococo


	const getBalancesAndAccountFormatsPolkadot = async (account, token=null, metamaskAccount=null, network=null ) => {
		console.log(`Getting Polkadot account formats for account: ${account} and balance for token: ${token} metamaskAccount: ${metamaskAccount} for network:${network} (if null we get balances for all supported networks)`);
		const response = await getAvailableBalancePOLKADOT(account, token, metamaskAccount, network);
		return response;
	}

	const getBalancesAndAccountFormats = async (account, token=null, metamaskAccount=null, network=null ) => {
		console.log(`Getting account formats for account: ${account} and balance for token: ${token} metamaskAccount: ${metamaskAccount} for network:${network} (if null we get balances for all supported networks)`);
		const response = await getAvailableBalance(account, token, metamaskAccount, network);
		return response;
	}

	const getROCOCO_BalancesAndAccountFormats = async (account, token=null, metamaskAccount=null, network=null ) => {
		console.log(`Getting ROCOCO account formats for account: ${account} and balance for token: ${token} metamaskAccount: ${metamaskAccount} for network:${network} (if null we get balances for all supported networks)`);
		const response = await getRococo_AvailableBalance(account, token, metamaskAccount, network);
		return response;
	}

	const getAllBalancesAndAccountFormatsPolkadot = async (account, metamaskAccount) => {
		const polkadotResponse = await getBalancesAndAccountFormatsPolkadot(account, "DOT", metamaskAccount);
		if (polkadotResponse)
		{
			const {accounts, balances: balanceDOT} = polkadotResponse;
			const {balances: balanceACA}           = await getBalancesAndAccountFormatsPolkadot(account, "ACA", metamaskAccount);
			const {balances: balanceGLMR}          = await getBalancesAndAccountFormatsPolkadot(account, "GLMR", metamaskAccount);
			const {balances: balancePAUSD}          = await getBalancesAndAccountFormatsPolkadot(account, "AUSD", metamaskAccount);
			setAccountFormats(accounts);
			setBalancesDOT(balanceDOT);
			setBalancesACA(balanceACA);
			setBalancesGLMR(balanceGLMR);
			setBalancesPAUSD(balancePAUSD);
			return { DOT:balanceDOT, ACA: balanceACA, GLMR: balanceGLMR, AUSD:balancePAUSD };
		} else { console.log(`Some API Sockets are not ready`); return }
	}

	const getAllBalancesAndAccountFormats = async (account, metamaskAccount) => {
		const kusamaResponse = await getBalancesAndAccountFormats(account, "KSM", metamaskAccount);
		if (kusamaResponse)
		{
			const {accounts, balances: balancesKSM} = kusamaResponse;
			const {balances: balancesKAR}           = await getBalancesAndAccountFormats(account, "KAR", metamaskAccount);
			const {balances: balancesMOVR}          = await getBalancesAndAccountFormats(account, "MOVR", metamaskAccount);
			const {balances: balancesKINT}          = await getBalancesAndAccountFormats(account, "KINT", metamaskAccount);
			const {balances: balancesPHA}           = await getBalancesAndAccountFormats(account, "PHA", metamaskAccount);
			const {balances: balancesAUSD}          = await getBalancesAndAccountFormats(account, "AUSD", metamaskAccount);
			const {balances: balancesKBTC}          = await getBalancesAndAccountFormats(account, "KBTC", metamaskAccount);
			setAccountFormats(accounts);
			setBalancesKSM(balancesKSM);
			setBalancesKAR(balancesKAR);
			setBalancesMOVR(balancesMOVR);
			setBalancesKINT(balancesKINT);
			setBalancesPHA(balancesPHA);
			setBalancesAUSD(balancesAUSD);
			setBalancesKBTC(balancesKBTC);
			return { KSM:balancesKSM, KAR: balancesKAR, MOVR: balancesMOVR, KINT:balancesKINT, PHA:balancesPHA, AUSD:balancesAUSD, KBTC:balancesKBTC};
		} else { console.log(`Some API Sockets are not ready`); return }
	}

	const getROCOCO_AllBalancesAndAccountFormats = async (account, metamaskAccount) => {
		const basiliskResponse = await getROCOCO_BalancesAndAccountFormats(account, "BSX", metamaskAccount);
		if (basiliskResponse)
		{
			const {accounts, balances: balancesBSX} = basiliskResponse;
			const {balances: balancesPHA}           = await getROCOCO_BalancesAndAccountFormats(account, "PHA", metamaskAccount);
			// const {balances: balancesKAR}           = await getROCOCO_BalancesAndAccountFormats(account, "KAR", metamaskAccount);
			
			setAccountFormats(accounts);
			
			setRococoBalancesBSX(balancesBSX);
			setRococoBalancesPHA(balancesPHA);
			// setRococoBalancesKAR(balancesKAR);
			return { BSX:balancesBSX, KAR: null, PHA:balancesPHA,};
			// return { BSX:balancesBSX, KAR: balancesKAR, PHA:balancesPHA,};
		} else { console.log(`getROCOCO_AllBalancesAndAccountFormats Some API Sockets are not ready`); return }
	}


	useEffect(() => {
		console.log(`E C O S Y S T E M: `,ecosystem);	

		const updateBalances = async () => {
			if (polakdotAccountSigner.address!==null && setupSpecs) 
			{
				console.log(`New Polkadot account has been chosen polakdotAccountSigner.address:${polakdotAccountSigner.address} or new MeataMask address:${setupSpecs.walletAddress}`);
				
				if (ecosystem==="Kusama")
				{
					const balanceObj = await getAllBalancesAndAccountFormats(polakdotAccountSigner.address, setupSpecs.walletAddress);
					if (tokenSelected!=="Token" && originChainSelected!=="Origin Chain" && tokenSelected!=="LKSM=>KSM")
					{
						const availableToTransfer = (balanceObj[`${tokenSelected}`])[`${originChainSelected}`];
						setAvailableAmountToTransfer(availableToTransfer);
					}
				}
				else if (ecosystem==="Polkadot")
				{
					const balanceObj = await getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, setupSpecs.walletAddress);
					if (tokenSelected!=="Token" && originChainSelected!=="Origin Chain" && tokenSelected!=="LDOT=>DOT")
					{
						const availableToTransfer = (balanceObj[`${tokenSelected}`])[`${originChainSelected}`];
						setAvailableAmountToTransfer(availableToTransfer);
					}
				}
				else if (ecosystem==="Rococo")
				{
					const balanceObj = await getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, setupSpecs.walletAddress);
					if (tokenSelected!=="Token" && originChainSelected!=="Origin Chain")
					{
						const availableToTransfer = (balanceObj[`${tokenSelected}`])[`${originChainSelected}`];
						setAvailableAmountToTransfer(availableToTransfer);
					}

				}

			}
		}
		updateBalances();
	}, [polakdotAccountSigner, setupSpecs, ecosystem]);


	const selectedActionfunction = (action) => {
		console.log(`DEX Selected Action is: ${action}`);
		setSelectedAction(action);
	};

	const selectedTokenfunction = (tokenString) => {
		console.log(`DEX SelectedToken is: ${tokenString}`);
		setTokenSelected(tokenString);
	};

	const selectedOriginChainfunction = async (chainString) => {
		console.log(`DEX SelectedOriginChain is: ${chainString}  tokenSelected:${tokenSelected}`);
		setOriginChainSelected(chainString);

		if ( chainString!=="Origin Chain" && tokenSelected!=="Token" )
		{

			if (ecosystem==="Kusama")
			{
				const balanceObj = await getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); //accountList[0] is setupSpecs.walletAddress
				const availableToTransfer = (balanceObj[`${tokenSelected}`])[`${chainString}`];
				setAvailableAmountToTransfer(availableToTransfer);
			}
			else if (ecosystem==="Polkadot")
			{
				const balanceObj = await getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); 
				const availableToTransfer = (balanceObj[`${tokenSelected}`])[`${chainString}`];
				setAvailableAmountToTransfer(availableToTransfer);
			}
			else if (ecosystem==="Rococo")
			{
				const balanceObj = await getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
				console.log(`ROCOCO ====> balanceObj: `,balanceObj,`  <============ tokenSelected: ${tokenSelected} originChainSelected: ${chainString}`);

				const availableToTransfer = (balanceObj[`${tokenSelected}`])[`${chainString}`];
				setAvailableAmountToTransfer(availableToTransfer);

				console.log(`ROCOCO ====> availableToTransfer: `,availableToTransfer,"  <============");
			}
			
		}

	};

	const selectedDestinationChainfunction = (chainString) => {
		console.log(`DEX SelectedDestinationChain is: ${chainString}`);
		setDestinationChainSelected(chainString);
	};

	const resetTargetAccount = (trgtAccount) => {
		setTargetAccount(trgtAccount);
	};

	const resetAll = () => {
		resetState?setResetState(false):setResetState(true);
	};

	const { changeBackground, background } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
	}, []);
	
	return(
		<>
				<div className="col-xl-12">
					<div className="row"> 

						{/* LEFT PART OF THE SCREEN START */}
						<div className="col-xl-6 col-xxl-12">
							<br/>

							<Card>
								<Card.Body>
								<div className="custom-tab-1">
									<Tab.Container defaultActiveKey={"Polkadot"}>
										<Nav as="ul" className="nav-tabs" style={{fontSize:"18px",cursor:"pointer"}}>
												<Nav.Item as="li">
													<Nav.Link eventKey="Polkadot" onClick={() => {
															setEcosystem("Polkadot");
															resetAll();
														}
													}>
														<i className={`la la-home me-2`} />
														Polkadot
													</Nav.Link>
												</Nav.Item>

										        <Nav.Item as="li">
													<Nav.Link eventKey="Kusama" onClick={() => {
															setEcosystem("Kusama");
															resetAll();
														}
													}>
														<i className={`la la-home me-2`} />
														Kusama
													</Nav.Link>
												</Nav.Item>
										        {/* <Nav.Item as="li">
													<Nav.Link eventKey="Rococo" onClick={() => {
															setEcosystem("Rococo");
															resetAll();
														}
													}>
														<i className={`la la-home me-2`} />
														Rococo
													</Nav.Link>
												</Nav.Item> */}
										</Nav> 

										<Tab.Content className="pt-4">

											<Tab.Pane eventKey="Kusama">
												<UI resetState={resetState} selectedActionfunction={selectedActionfunction} 
													resetTargetAccount={resetTargetAccount} destinationChainSelected={destinationChainSelected} originChainSelected={originChainSelected} selectedDestinationChainfunction={selectedDestinationChainfunction} selectedOriginChainfunction={selectedOriginChainfunction} selectedTokenfunction={selectedTokenfunction} setupSpecs={setupSpecs} portfolio={"portfolio"} oracleData={"oracleData"} accountList={accountList} blockHeader={blockHeader} 
													accountFormats={accountFormats} balancesKSM={balancesKSM} balancesKAR={balancesKAR} balancesMOVR={balancesMOVR} balancesKINT={balancesKINT} balancesPHA={balancesPHA} balancesAUSD={balancesAUSD} balancesKBTC={balancesKBTC}
												/>
											</Tab.Pane>

											{/* <Tab.Pane eventKey="Rococo">
												<BasiliskUI resetState={resetState} selectedActionfunction={selectedActionfunction}
													resetTargetAccount={resetTargetAccount} destinationChainSelected={destinationChainSelected} originChainSelected={originChainSelected} selectedDestinationChainfunction={selectedDestinationChainfunction} selectedOriginChainfunction={selectedOriginChainfunction} selectedTokenfunction={selectedTokenfunction} setupSpecs={setupSpecs} 
													accountList={accountList} blockHeader={blockHeader} 
													rococoBalancesBSX={rococoBalancesBSX} rococoBalancesPHA={rococoBalancesPHA} 
												/>
											</Tab.Pane> */}

											<Tab.Pane eventKey="Polkadot">
												{/* <h4>Work in Progress</h4> */}
												<PolkadotUI 
													resetState={resetState} selectedActionfunction={selectedActionfunction} 
													resetTargetAccount={resetTargetAccount} destinationChainSelected={destinationChainSelected} originChainSelected={originChainSelected} selectedDestinationChainfunction={selectedDestinationChainfunction} selectedOriginChainfunction={selectedOriginChainfunction} selectedTokenfunction={selectedTokenfunction} 
													balancesDOT={balancesDOT} balancesACA={balancesACA} balancesGLMR={balancesGLMR} balancesPAUSD={balancesPAUSD} 
													// setupSpecs={setupSpecs} accountList={accountList} blockHeader={blockHeader} accountFormats={accountFormats} 
												/>
											</Tab.Pane>

										</Tab.Content>

									</Tab.Container>

								</div>
								</Card.Body>
							</Card>

						</div>
						{/* LEFT PART OF THE SCREEN END */}


						{/* RIGHT PART OF THE SCREEN START */}
						<div className="col-xl-6 col-xxl-12">
						    <QuickTrade 
							    resetAll={resetAll} selectedAction={selectedAction} targetAccount={targetAccount} setupSpecs={setupSpecs} 
								destinationChainSelected={destinationChainSelected} originChainSelected={originChainSelected} tokenSelected={tokenSelected} 
								relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} blockHeader={blockHeader}  
								accountList={accountList} polakdotAccountSigner={polakdotAccountSigner} 
								accountFormats={accountFormats} availableAmountToTransfer={availableAmountToTransfer} 
								getAllBalancesAndAccountFormatsPolkadot={getAllBalancesAndAccountFormatsPolkadot}
								getAllBalancesAndAccountFormats={getAllBalancesAndAccountFormats}
								getROCOCO_AllBalancesAndAccountFormats={getROCOCO_AllBalancesAndAccountFormats}
							/>
						</div>
						{/* RIGHT PART OF THE SCREEN END*/}

					</div>

				</div>
		</>
	)
}
export default DEX;