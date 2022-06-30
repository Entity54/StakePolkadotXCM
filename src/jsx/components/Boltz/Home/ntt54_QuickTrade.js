import React,{useState,useEffect,  useCallback} from 'react';
import { 
			wallet, getBalance, 
			transferFromRelayToParachain, transferFromParachainToRelay, transferFromPhalaToRelay, tranferFromRelayToRelay, 
			transfer_Asset_FromParachainToParachain, transferFromPhalaToParachain, transfer_MultipleAssets_FromParachainToParachain,
			simpleERC20Transfer, getAccountFormatsforAccountI32,
			transfer_xcKSMtoKSM, transfer_multiasset, transfer_Currency_FromParachainToParachain, transfer_MOVR_FromParachainToParachain,
			stakeKSMfromKusama, unstakeKSMfromLKSM, getBalanceinKarura, stakeKSMfromMoonriver, stakeKSMfromKintsugi,
			rococo_transfer_Asset_FromParachainToParachain, rococo_transfer_currency, rococo_transfer_currencyWithFee, rococo_transfer_multiCurrencies, 
			rococo_transfer_MultiAssetS_FromParachainToParachain, rococo_transfer_MultiAssetWithFee_FromParachainToParachain,
			transferFromPolkadotToParachain, transfer_xcDOTtoDOT, transfer_FromAcala, transfer_FromMoonbeam,
			stakeDOTfromPolkadot, stakeDOTfromMoonbeam, getBalanceinAcala, unstakeDOTfromLDOT,
	   } from '../../../../Setup.js';



//#region xcmRputes schema  Token=> OriginChain => ArrayOfTragetChains
const xcmRoutes = {
					 "KSM": {
								"Kusama"   : ["Moonriver", "Karura"   , "Kintsugi", "Phala"],	
								"Moonriver": ["Kusama"   , "Karura"   , "Kintsugi", "Phala"], 
								"Karura"   : ["Kusama"   , "Moonriver", "Kintsugi", "Phala"  ], 
								"Kintsugi" : ["Kusama"   , "Moonriver", "Karura"  , "Phala"], 
								"Phala"    : ["Kusama"], 
							},
					 "KAR": {
								"Karura"   : ["Moonriver", "Phala"],
								"Moonriver": ["Karura",  "Phala"],                   //Can KAR go from Moonriver to Kintsugi directly without going via Karura?
								"Kintsugi" : [], 
								"Phala"    : ["Karura"], 
							},
					 "AUSD": {
								"Karura"   : ["Moonriver", "Phala"],
								"Moonriver": ["Karura"   , "Phala"], 
								"Phala"    : ["Karura"],
							 },
					"KINT": {
						        "Kintsugi" : ["Karura", "Moonriver"], 
								"Karura"   : ["Kintsugi", "Moonriver"],
								"Moonriver": ["Kintsugi", "Karura"], 
							 },
					"KBTC": {
						        "Kintsugi" : ["Karura", "Moonriver"], 
								"Karura"   : ["Kintsugi", "Moonriver"],
								"Moonriver": ["Kintsugi"], 
							 },
					"PHA": {
								"Phala"    : ["Karura", "Moonriver", "Basilisk"], 
								"Karura"   : ["Phala", "Moonriver"],
								"Moonriver": ["Phala", "Karura"], 

								"Basilisk" : ["Phala"], 
							 },
					"MOVR": {
								"Moonriver": ["Karura", "Phala"], 
								"Karura"   : ["Moonriver"],
								"Phala"    : ["Moonriver"], 
							 },

					"BSX": {
						        "Basilisk" : ["Karura", "Phala"], 
								"Karura"   : ["Basilisk","Phala"],      
								"Phala"	   : ["Basilisk","Karura"], 
							 },


					"DOT": {
								"Polkadot"   : ["Acala"   , "Moonbeam"],	
								"Acala"      : ["Polkadot", "Moonbeam"], 
								"Moonbeam"   : ["Polkadot", "Acala"   ], 
							},
					"ACA": {
								"Acala"   : ["Moonbeam"],
								"Moonbeam": ["Acala"   ],                    
							},
					"GLMR": {
								"Acala"   : ["Moonbeam"],
								"Moonbeam": ["Acala"   ],                    
							},
					"PAUSD": {
								"Acala"   : ["Moonbeam"],
								"Moonbeam": ["Acala"   ],                    
							},

				};
//#endregion

//#region parachainCodes tokenList

const parachainCodes = {   
							//mainnets
							Acala    : 2000,
							Moonbeam : 2004,

							Moonriver: 2023,   
							Karura   : 2000,
							Kintsugi : 2092,
							Phala    : 2004,
							Basilisk : 2090,
							//testsnets 
							MoonbaseAlpha   : 1000,
							KaruraAlphanet  : 2000,
							Karura_Rococo   : "r2000",
							Rhala_Rococo    : "r2004",
							Basilisk_Rococo : "r2090"
						}	
						
const tokenList = [
					"KSM","KAR","AUSD","KINT","KBTC","PHA","MOVR","BSX",
					"DOT","ACA","GLMR"
				  ];
//#endregion



const QuickTrade = ({ 
	targetAccount, setupSpecs, relaySpecs, karuraAlphaSpecs, blockHeader, accountList, polakdotAccountSigner, 
	destinationChainSelected, originChainSelected, tokenSelected, resetAll,
	availableAmountToTransfer, accountFormats, selectedAction, 
	getAllBalancesAndAccountFormatsPolkadot, getAllBalancesAndAccountFormats, getROCOCO_AllBalancesAndAccountFormats,
}) => {
	
    const [inputTranferAmount, setInputTranferAmount] = useState("");
	const [sendToAddress, setSendToAddress] = useState("");	
	const [transfer_IsSubmiting, setTransfer_IsSubmiting] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState("");
    const [suggestedOriginAccount, setSuggestedOriginAccount] = useState("");

	const relayTokenPrecompileAddress = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080";  //xcUNIT or xcKSM


	useEffect(() => {
		if (accountFormats)
		{
			if (originChainSelected==="Kusama") setSuggestedOriginAccount(accountFormats.kusama_Address);
			else if (originChainSelected==="Karura") setSuggestedOriginAccount(accountFormats.karura_Address);
			else if (originChainSelected==="Kintsugi") setSuggestedOriginAccount(accountFormats.kintsugi_Address);
			else if (originChainSelected==="Phala") setSuggestedOriginAccount(accountFormats.khala_Address);
			else if (originChainSelected==="Basilisk") setSuggestedOriginAccount(accountFormats.basilisk_Address);

			else if (originChainSelected==="Polkadot") setSuggestedOriginAccount(accountFormats.polkadot_Address);
			else if (originChainSelected==="Acala") setSuggestedOriginAccount(accountFormats.acala_Address);

			else setSuggestedOriginAccount("");
		}
		 
	}, [originChainSelected, polakdotAccountSigner]);

	useEffect(() => {  
		let account_formats = accountFormats;
		if (originChainSelected==="Moonriver" || originChainSelected==="Moonbeam") account_formats = getAccountFormatsforAccountI32(polakdotAccountSigner.address);

		if (destinationChainSelected==="Kusama") setSendToAddress(account_formats.kusama_Address);
		else if (destinationChainSelected==="Karura") setSendToAddress(account_formats.karura_Address);
		else if (destinationChainSelected==="Kintsugi") setSendToAddress(account_formats.kintsugi_Address);
		else if (destinationChainSelected==="Phala") setSendToAddress(account_formats.khala_Address);
		else if (destinationChainSelected==="Moonriver") setSendToAddress(accountList[0]);
		else if (destinationChainSelected==="Basilisk") setSendToAddress(account_formats.basilisk_Address);

		else if (destinationChainSelected==="Polkadot") setSendToAddress(account_formats.polkadot_Address);
		else if (destinationChainSelected==="Acala") setSendToAddress(account_formats.acala_Address);
		else if (destinationChainSelected==="Moonbeam") setSendToAddress(accountList[0]);

		else setSendToAddress("");

	}, [destinationChainSelected, polakdotAccountSigner]);

	useEffect(() => {  
		setInputTranferAmount(availableAmountToTransfer);
	}, [availableAmountToTransfer]);

	useEffect(() => {  
		// const getLKSbalance = async () => {
		const getLiquidStakedBalance = async () => {

			if (selectedAction==="unstakeKSMfromLKSMatKarura") 
			{
			   const availableBalanceLKSM = await getBalanceinKarura(polakdotAccountSigner.address, "LKSM");
			   setInputTranferAmount(availableBalanceLKSM);
			}
			else if (selectedAction==="unstakeDOTfromLDOTatAcala") 
			{
			   const availableBalanceLDOT = await getBalanceinAcala(polakdotAccountSigner.address, "LDOT");
			   setInputTranferAmount(availableBalanceLDOT);
			}

		}
		getLiquidStakedBalance();
		// getLKSbalance();

	}, [selectedAction, polakdotAccountSigner]);





	//#region transferBalance
	const transferBalance = async (token, originChain, targetChain) => {
		// console.log(`XCMTransfer Begins transferBalance baseCurrency: `,baseCurrency,` sendToAddress: `,sendToAddress,`  inputTranferAmount: `,inputTranferAmount, ` OrginChain: ${destination} TargetChain:${targetChainDestination}`);
		const amount = inputTranferAmount.toString();
		const baseCurrency = token;
		const orginChain = originChain;
		const targetChainDestination = targetChain;
		// console.log(`ntt54_QuickTrade.js transferBalance => selectedAction: ${selectedAction}`);
		// console.log(`XCMTransfer Begins transferBalance baseCurrency: `,baseCurrency,` sendToAddress: `,sendToAddress,`  inputTranferAmount: `,inputTranferAmount, ` orginChain: ${orginChain} targetChainDestination:${targetChainDestination}`);
		

		if (amount!=="0" && sendToAddress!==""   && setupSpecs.wallet && relaySpecs.api && karuraAlphaSpecs.api)
		{
             
			//Unstaking KSM from LKSM at Karura
			if (selectedAction==="unstakeKSMfromLKSMatKarura") 
			{
			//    console.log(`Usntaking KSM from LKSM at Karura`);
			   setTransfer_IsSubmiting(true);
			   setTransactionMessage(`Unstaking KSM from LKSM at Karura, submitted.`);

			   unstakeKSMfromLKSM(amount)
			   .then((resolveMsg) => {
				//    console.log(`Usntaking KSM from LKSM at Karura Successful resolveMsg: `,resolveMsg);
				   setTransactionMessage(
					   
						resolveMsg.map((msg, index) => {
							return  <p key={index}>{msg}</p> 
						})
					   
				   );

				   getAllBalancesAndAccountFormats(polakdotAccountSigner.address , accountList[0]);
				   setTransfer_IsSubmiting(false);
				   setInputTranferAmount(""); resetAll();
			   })
			   .catch((rejectMsg) => console.log(rejectMsg));
			}
			//Unstaking DOT from LDOT at Acala
			else if(selectedAction==="unstakeDOTfromLDOTatAcala") 
			{
			   console.log(`Usntaking DOT from LDOT at Acala`);
			   setTransfer_IsSubmiting(true);
			   setTransactionMessage(`Unstaking DOT from LDOT at Acala, submitted.`);

			   unstakeDOTfromLDOT(amount)
			   .then((resolveMsg) => {
				//    console.log(`Usntaking DOT from LDOT at Acala Successful resolveMsg: `,resolveMsg);
				   setTransactionMessage(
						resolveMsg.map((msg, index) => {
							return  <p key={index}>{msg}</p> 
						})
					   
				   );

				   setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },3000);

				   setTransfer_IsSubmiting(false);
				   setInputTranferAmount(""); resetAll();
			   })
			   .catch((rejectMsg) => console.log(rejectMsg));

			}



			else  //XCM Transfers
			{
			 
					//#region XCM Transfers
					//#region baseCurrency KSM
					if (baseCurrency==="KSM")
					{
						//#region Origin Kusama
						if (orginChain==="Kusama" && targetChainDestination==="Moonriver")
						{
							console.log(`We are sending KSM from Kusama to Moonriver xcKSM inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kusama to Moonriver, submitted.`);

							transferFromRelayToParachain(relaySpecs.api, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount(""); resetAll();
						}
						else if (orginChain==="Kusama" && targetChainDestination==="Karura")
						{
							console.log(`We are sending KSM from Kusama to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kusama to Karura, submitted.`);

							if (selectedAction==="autostakeKSMtoKarura")
							{
								// console.log(`KSM will be sent from Kusama to Karura and then staked for LKSM`);
								stakeKSMfromKusama(relaySpecs.api, parachainCodes.Karura, sendToAddress, amount)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);

									getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}
							else
							{
								transferFromRelayToParachain(relaySpecs.api, parachainCodes.Karura, sendToAddress, amount)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);
	
									getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kusama" && targetChainDestination==="Kintsugi")
						{
							console.log(`We are sending KSM from Kusama to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kusama to Kintsugi, submitted.`);

							transferFromRelayToParachain(relaySpecs.api, parachainCodes.Kintsugi, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kusama" && targetChainDestination==="Phala")
						{
							console.log(`We are sending KSM from Kusama to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kusama to Phala, submitted.`);

							transferFromRelayToParachain(relaySpecs.api, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kusama" && targetChainDestination==="Kusama")
						{
							console.log(`We are sending KSM from Kusama to another Kusama Account inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM to from Kusama another Kusama account, submitted.`);
							
							await tranferFromRelayToRelay(relaySpecs.api, sendToAddress, amount);

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//#endregion
						//#region Origin Not Kusama
						else if (orginChain==="Moonriver" && targetChainDestination==="Kusama") {
							console.log(`We are sending xcKSM from Moonriver to Kusama inputTranferAmount:${amount} sendToAddress:${sendToAddress}`)
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer xcKSM from Moonriver to Kusama, submitted.`);
							
							transfer_xcKSMtoKSM(amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if ( (orginChain==="Karura" || orginChain==="Kintsugi") && targetChainDestination==="Kusama") {
							// console.log(`We are sending KSM from ${orginChain} to Kusama inputTranferAmount:${amount} sendToAddress:${sendToAddress}`)
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from ${orginChain} to Kusama, submitted.`);
							
							transferFromParachainToRelay(orginChain, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
									resolveMsg.map((msg, index) => {
										return ( <p key={index}>{msg}</p> )
									})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectObj) => console.log(rejectObj));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if ( orginChain==="Phala" && targetChainDestination==="Kusama") {
							console.log(`We are sending KSM from Phala to Kusama inputTranferAmount:${amount} sendToAddress:${sendToAddress}`)
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Phala to Kusama, submitted.`);
							
							transferFromPhalaToRelay(sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}


						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							console.log(`We are sending KSM from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Moonriver to Karura, submitted.`);

							if (selectedAction==="autostakeKSMtoKarura")
							{
								console.log(`KSM will be sent from Moonriver to Karura and then staked for LKSM`);
								stakeKSMfromMoonriver(accountList[0], parachainCodes.Karura, amount, sendToAddress)
								.then((resolveObj) => {
									setTransactionMessage(
											resolveObj.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);

									getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
								})
								.catch((rejectObj) => console.log(rejectObj));
							}
							else
							{
								transfer_multiasset("xcKSM", parachainCodes.Moonriver, parachainCodes.Karura, amount, sendToAddress)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);
	
									getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Kintsugi")
						{
							console.log(`We are sending KSM from Moonriver to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Moonriver to Kintsugi, submitted.`);

							transfer_multiasset("xcKSM", parachainCodes.Moonriver, parachainCodes.Kintsugi, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Phala")
						{
							console.log(`We are sending KSM from Moonriver to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Moonriver to Phala, submitted.`);

							transfer_multiasset("xcKSM", parachainCodes.Moonriver, parachainCodes.Phala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							console.log(`We are sending KSM from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Karura to Moonriver, submitted.`);

							transfer_Currency_FromParachainToParachain("KSM", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Kintsugi")
						{
							console.log(`We are sending KSM from Karura to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Karura to Kintsugi, submitted.`);

							transfer_Currency_FromParachainToParachain("KSM", parachainCodes.Karura, parachainCodes.Kintsugi, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Phala")
						{
							console.log(`We are sending KSM from Karura to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Karura to Phala, submitted.`);

							transfer_Currency_FromParachainToParachain("KSM", parachainCodes.Karura, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kintsugi" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KSM from Kintsugi to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kintsugi to Karura, submitted.`);

							if (selectedAction==="autostakeKSMtoKarura")
							{
								// console.log(`KSM will be sent from Kintsugi to Karura and then staked for LKSM`);
								stakeKSMfromKintsugi("KSM", parachainCodes.Kintsugi, parachainCodes.Karura, sendToAddress, amount)
								.then((resolveMsg) => {
									setTransactionMessage(
										(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
										)
									);

									getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}
							else
							{
								transfer_Asset_FromParachainToParachain("KSM", parachainCodes.Kintsugi, parachainCodes.Karura, sendToAddress, amount)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);
	
									getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kintsugi" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KSM from Kintsugi to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kintsugi to Moonriver, submitted.`);

							transfer_Asset_FromParachainToParachain("KSM", parachainCodes.Kintsugi, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kintsugi" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending KSM from Kintsugi to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KSM from Kintsugi to Phala, submitted.`);

							transfer_Asset_FromParachainToParachain("KSM", parachainCodes.Kintsugi, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//FROM PHALA TO KARURA/MOONRIVER/KINTSUGI IT IS IMPOSSIBLE AS IT IS NOT HOLDIGN FEES
						// else if (orginChain==="Phala" && targetChainDestination==="Karura")
						// {
						// 	console.log(`We are sending KSM from Phala to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
						// 	setTransfer_IsSubmiting(true);
						// 	setTransactionMessage(`Transfer KSM from Phala to Karura, submitted.`);

						// 	await transferFromPhalaToParachain("KSM", null, parachainCodes.Karura, sendToAddress, amount);

						// 	setTransfer_IsSubmiting(false);
						// 	setInputTranferAmount("");
						// }
						else if (orginChain==="Moonriver" && targetChainDestination==="Moonriver")
						{
							console.log(`We are transfering xcKSM from one Moonriver account to another account within Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer xcKSM to another Moonriver account, submitted.`);

							await getBalance(relayTokenPrecompileAddress, await wallet.getAddress())
							await simpleERC20Transfer(setupSpecs.wallet, relayTokenPrecompileAddress, sendToAddress, amount);

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//#endregion
					}
					//#endregion
					//#region baseCurrency KAR
					else if (baseCurrency==="KAR")
					{
						if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KAR from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KAR from Karura to Moonriver, submitted.`);

							transfer_Currency_FromParachainToParachain("KAR", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Phala")
						{
							console.log(`We are sending KAR from Karura to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KAR from Karura to Phala, submitted.`);

							transfer_Currency_FromParachainToParachain("KAR", parachainCodes.Karura, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");   resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KAR from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KAR from Moonriver to Karura, submitted.`);

							transfer_multiasset("xcKAR", parachainCodes.Karura, parachainCodes.Karura, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Phala" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KAR from Phala to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KAR from Phala to Karura, submitted.`);

							transferFromPhalaToParachain("KAR", parachainCodes.Karura, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending KAR from Moonriver to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KAR from Moonriver to Phala, submitted.`);

							transfer_multiasset("xcKAR", parachainCodes.Karura, parachainCodes.Phala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//NOT POSSIBLE YET
						else if (orginChain==="Phala" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KAR from Phala to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							// setTransfer_IsSubmiting(true);
							// setTransactionMessage(`Transfer KAR from Phala to Moonriver, submitted.);

							// // await transfer_Currency_FromParachainToParachain("KAR", parachainCodes.Karura, parachainCodes.Phala, sendToAddress, amount);
							// await transferFromPhalaToParachain("KAR", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount);
							
							// setTransfer_IsSubmiting(false);
							// setInputTranferAmount("");
						}
					}
					//#endregion
					//#region baseCurrency AUSD
					else if (baseCurrency==="AUSD")
					{
						//#region KUSAMA
						if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending AUSD from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Karura to Moonriver, submitted.`);

							transfer_Asset_FromParachainToParachain("KUSD", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending AUSD from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Moonriver to Karura, submitted.`);

							transfer_multiasset("xcAUSD", parachainCodes.Karura, parachainCodes.Karura, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending AUSD from Karura to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Karura to Phala, submitted.`);

							transfer_Asset_FromParachainToParachain("KUSD", parachainCodes.Karura, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Phala" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending AUSD from Phala to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Phala to Karura, submitted.`);

							transferFromPhalaToParachain("KUSD", parachainCodes.Karura, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending AUSD from Moonriver to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Moonriver to Phala, submitted.`);

							transfer_multiasset("xcAUSD", parachainCodes.Karura, parachainCodes.Phala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//NOT POSSIBLE YET
						else if (orginChain==="Phala" && targetChainDestination==="Moonriver")
						{
						}
						//#endregion KUSAMA

						//#region POLKADOT
						else if (orginChain==="Acala" && targetChainDestination==="Moonbeam")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Acala to Moonbeam, submitted.`);

							transfer_FromAcala("AUSD", parachainCodes.Moonbeam, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },3000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonbeam" && targetChainDestination==="Acala")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer AUSD from Moonbeam to Acala, submitted.`);

							transfer_FromMoonbeam("xcPAUSD", parachainCodes.Acala, parachainCodes.Acala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//#endregion POLKADOT
					}
					//#endregion
					//#region baseCurrency MOVR
					else if (baseCurrency==="MOVR")
					{
						if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending MOVR from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer MOVR from Karura to Moonriver, submitted.`);

							transfer_MOVR_FromParachainToParachain("Karura", parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}

						else if (orginChain==="Phala" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending MOVR from Phala to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer MOVR from Phala to Moonriver, submitted.`);

							transferFromPhalaToParachain("MOVR", parachainCodes.Moonriver, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//NOT POSSIBLE YET BECAUSE PHALA "NotHoldingFees"  Msg goes to Moonriver but fails in Karura
						else if (orginChain==="Phala" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending MOVR from Phala to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							// setTransfer_IsSubmiting(true);
							// setTransactionMessage(`Transfer MOVR from Phala to Karura, submitted at BlockNumber: ${blockHeader.number}`);

							// await transferFromPhalaToParachain("MOVR", parachainCodes.Moonriver, parachainCodes.Karura, sendToAddress, amount);
							
							// setTransfer_IsSubmiting(false);
							// setInputTranferAmount("");
						}
						//NOT POSSIBLE YET
						else if (orginChain==="Karura" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending MOVR from Karura to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							// setTransfer_IsSubmiting(true);
							// setTransactionMessage(`Transfer MOVR from Karura to Phala, submitted.`);

							// await transfer_Asset_FromParachainToParachain("MOVR", parachainCodes.Karura, parachainCodes.Phala, sendToAddress, amount);
							
							// setTransfer_IsSubmiting(false);
							// setInputTranferAmount("");
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending MOVR from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer MOVR from Moonriver to Karura, submitted.`);

							transfer_multiasset("MOVR", parachainCodes.Moonriver, parachainCodes.Karura, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending MOVR from Moonriver to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer MOVR from Moonriver to Phala, submitted.`);

							transfer_multiasset("MOVR", parachainCodes.Moonriver, parachainCodes.Phala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
					}
					//#endregion
					//#region baseCurrency KINT
					else if (baseCurrency==="KINT")
					{
						if (orginChain==="Kintsugi" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KINT from Kintsugi to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KINT from Kintsugi to Karura, submitted.`);

							transfer_Asset_FromParachainToParachain("KINT", parachainCodes.Kintsugi, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kintsugi" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KINT from Kintsugi to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KINT from Kintsugi to Moonriver, submitted.`);

							transfer_Asset_FromParachainToParachain("KINT", parachainCodes.Kintsugi, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Kintsugi")
						{
							// console.log(`We are sending KINT from Karura to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KINT from Karura to Kintsugi, submitted.`);

							transfer_Asset_FromParachainToParachain("KINT", parachainCodes.Karura, parachainCodes.Kintsugi, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Kintsugi")
						{
							// console.log(`We are sending KINT from Moonriver to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KINT from Moonriver to Kintsugi, submitted.`);

							transfer_multiasset("xcKINT", parachainCodes.Kintsugi, parachainCodes.Kintsugi, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KINT from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KINT from Karura to Moonriver, submitted.`);

							transfer_Asset_FromParachainToParachain("KINT", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KINT from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KINT from Moonriver to Karura, submitted.`);

							transfer_multiasset("xcKINT", parachainCodes.Kintsugi, parachainCodes.Karura, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}




					}
					//#endregion
					//#region baseCurrency KBTC
					else if (baseCurrency==="KBTC")
					{
						if (orginChain==="Kintsugi" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KBTC from Kintsugi to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KBTC from Kintsugi to Karura, submitted.`);

							transfer_Asset_FromParachainToParachain("KBTC", parachainCodes.Kintsugi, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Kintsugi" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KBTC from Kintsugi to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KBTC from Kintsugi to Moonriver, submitted.`);

							transfer_MultipleAssets_FromParachainToParachain("KBTC","KINT", parachainCodes.Kintsugi, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Kintsugi")
						{
							// console.log(`We are sending KBTC from Karura to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KBTC from Karura to Kintsugi, submitted.`);

							transfer_Asset_FromParachainToParachain("KBTC", parachainCodes.Karura, parachainCodes.Kintsugi, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending KBTC from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`NOTE: YOU MUST HAVE KINT BALANCE OF AT LEAST 0.004 TO PAY FOR THIS TRANASCTION. \n Transfer KBTC from Karura to Moonriver, submitted.`);

							transfer_MultipleAssets_FromParachainToParachain("KBTC","KINT", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Kintsugi")
						{
							console.log(`We are sending KBTC from Moonriver to Kintsugi inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer KBTC from Moonriver to Kintsugi, submitted.`);

							transfer_multiasset("xcKBTC", parachainCodes.Kintsugi, parachainCodes.Kintsugi, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//NOT SUPPORTED 
						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending KBTC from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							// setTransfer_IsSubmiting(true);
							// setTransactionMessage(`Transfer KBTC from Moonriver to Karura, submitted.`);

							// await transfer_multiasset("xcKBTC", parachainCodes.Kintsugi, parachainCodes.Karura, amount, sendToAddress);

							// setTransfer_IsSubmiting(false);
							// setInputTranferAmount("");  resetAll();
						}
					
					}
					//#endregion
					//#region baseCurrency PHA
					else if (baseCurrency==="PHA")
					{
						if (orginChain==="Phala" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending PHA from Phala to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Phala to Karura, submitted.`);

							transferFromPhalaToParachain("PHA", null, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Phala" && targetChainDestination==="Moonriver")
						{
							// console.log(`We are sending PHA from Phala to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Phala to Moonriver, submitted.`);

							transferFromPhalaToParachain("PHA", null, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Phala")
						{
							console.log(`We are sending PHA from Karura to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Karura to Phala, submitted.`);

							transfer_Currency_FromParachainToParachain("PHA", parachainCodes.Karura, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending PHA from Moonriver to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Moonriver to Phala, submitted.`);

							transfer_multiasset("xcPHA", parachainCodes.Phala, parachainCodes.Phala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonriver" && targetChainDestination==="Karura")
						{
							// console.log(`We are sending PHA from Moonriver to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Moonriver to Karura, submitted.`);

							transfer_multiasset("xcPHA", parachainCodes.Phala, parachainCodes.Karura, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Karura" && targetChainDestination==="Moonriver")
						{
							console.log(`We are sending PHA from Karura to Moonriver inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Karura to Moonriver, submitted.`);

							transfer_Currency_FromParachainToParachain("PHA", parachainCodes.Karura, parachainCodes.Moonriver, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								getAllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}


						else if (orginChain==="Phala" && targetChainDestination==="Basilisk")
						{
							// console.log(`We are sending PHA from Phala to Basilisk inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Phala to Basilisk, submitted.`);

							transferFromPhalaToParachain("PHA", null, parachainCodes.Basilisk, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));

						}
						else if (orginChain==="Basilisk" && targetChainDestination==="Phala")
						{
							// console.log(`We are sending PHA from Basilisk to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer PHA from Basilisk to Phala, submitted.`);

							rococo_transfer_currency("PHA",parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));

						}
					}
					//#endregion

					//#region baseCurrency BSX
					else if (baseCurrency==="BSX")
					{
						if (orginChain==="Basilisk" && targetChainDestination==="Phala")
						{
							console.log(`We are sending BSX from Basilisk to Phala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer BSX from Basilisk to Phala, submitted.`);

							rococo_transfer_Asset_FromParachainToParachain("BSX", parachainCodes.Basilisk_Rococo, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));

						}
						else if (orginChain==="Basilisk" && targetChainDestination==="Karura")
						{
							console.log(`We are sending BSX from Basilisk to Karura inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer BSX from Basilisk to Karura, submitted.`);

							// Equivalent for Kusama UI
							// transfer_Asset_FromParachainToParachain("BSX", parachainCodes.Basilisk_Rococo, parachainCodes.Karura, sendToAddress, amount)

							//Alternative Method1 *** tranfer ***/
							// rococo_transfer_currency("BSX", parachainCodes.Karura, sendToAddress, amount)

							//Alternative Method2 *** tranferWithFee ***/
							// rococo_transfer_currencyWithFee("BSX", parachainCodes.Karura, sendToAddress, amount, 1)

							//Alternative Method3 *** tranferMultiCurrencies ***/
							// rococo_transfer_multiCurrencies("BSX", parachainCodes.Karura, sendToAddress, amount)

							//Alternative Method4 *** tranferMultiAssets ***/
							// rococo_transfer_MultiAssetS_FromParachainToParachain("BSX", parachainCodes.Basilisk_Rococo, parachainCodes.Karura, sendToAddress, amount)

							//Alternative Method5 *** tranferMultiAssetWithFee ***/
							// rococo_transfer_MultiAssetWithFee_FromParachainToParachain("BSX", parachainCodes.Basilisk_Rococo, parachainCodes.Karura, sendToAddress, amount, 1)

							//Alternative Method0 *** tranferMultiAsset ***/
							rococo_transfer_Asset_FromParachainToParachain("BSX", parachainCodes.Basilisk_Rococo, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));
						}
						else if (orginChain==="Phala" && targetChainDestination==="Basilisk")
						{
							console.log(`We are sending BSX from Phala to Basilisk inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer BSX from Phala to Basilisk, submitted.`);

							transferFromPhalaToParachain("BSX", parachainCodes.Basilisk, parachainCodes.Basilisk, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));

						}
						else if (orginChain==="Karura" && targetChainDestination==="Basilisk")
						{
							console.log(`We are sending BSX from Karura to Basilisk inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer BSX from Karura to Basilisk, submitted.`);

							// transfer_Asset_FromParachainToParachain("BSX", parachainCodes.Karura_Rococo, parachainCodes.Basilisk, sendToAddress, amount)
							rococo_transfer_Asset_FromParachainToParachain("BSX", parachainCodes.Karura_Rococo, parachainCodes.Basilisk, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));

						}
						else if (orginChain==="Karura" && targetChainDestination==="Phala")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer BSX from Karura to Phala, submitted.`);

							rococo_transfer_Asset_FromParachainToParachain("BSX", parachainCodes.Karura_Rococo, parachainCodes.Phala, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));
						}
						else if (orginChain==="Phala" && targetChainDestination==="Karura")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer BSX from Phala to Karura, submitted.`);

							transferFromPhalaToParachain("BSX", parachainCodes.Basilisk, parachainCodes.Karura, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getROCOCO_AllBalancesAndAccountFormats(polakdotAccountSigner.address, accountList[0]); },10000);
								setTransfer_IsSubmiting(false);
								setInputTranferAmount("");  resetAll();
							})
							.catch((rejectMsg) => console.log(rejectMsg));

						}

					}
					//#endregion


					//#region baseCurrency DOT
					else if (baseCurrency==="DOT")
					{
						//#region Origin Polkadot
						if (orginChain==="Polkadot" && targetChainDestination==="Moonbeam")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer DOT from Polkadot to Moonbeam, submitted.`);

							transferFromPolkadotToParachain( parachainCodes.Moonbeam, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount(""); resetAll();
						}
						else if (orginChain==="Polkadot" && targetChainDestination==="Acala")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer DOT from Polkadot to Acala, submitted.`);

							if (selectedAction==="autostakeDOTtoAcala")
							{
								console.log(`DOT will be sent from Polkadot to Acala and then staked for LDOT`);
								stakeDOTfromPolkadot(parachainCodes.Acala, sendToAddress, amount)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);

									setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}
							else
							{
								transferFromPolkadotToParachain( parachainCodes.Acala, sendToAddress, amount)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);
	
									setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//#endregion
						//#region Origin Not Polkadot
						else if (orginChain==="Moonbeam" && targetChainDestination==="Polkadot") {
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer xcDOT from Moonbeam to Polkadot, submitted.`);
							
							transfer_xcDOTtoDOT(amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if ( (orginChain==="Acala" ) && targetChainDestination==="Polkadot") {
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer DOT from ${orginChain} to Polkadot, submitted.`);
							
							transfer_FromAcala("DOT", null, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
									resolveMsg.map((msg, index) => {
										return ( <p key={index}>{msg}</p> )
									})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectObj) => console.log(rejectObj));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonbeam" && targetChainDestination==="Acala")
						{
							console.log(`We are sending DOT from Moonbeam to Acala inputTranferAmount:${amount} sendToAddress:${sendToAddress}`);
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer DOT from Moonbeam to Acala, submitted.`);

							if (selectedAction==="autostakeDOTtoAcala")
							{
								console.log(`DOT will be sent from Moonbeam to Acala and then staked for LDOT`);
								stakeDOTfromMoonbeam(parachainCodes.Acala, amount, sendToAddress)
								.then((resolveObj) => {
									setTransactionMessage(
											resolveObj.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);

									setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
								})
								.catch((rejectObj) => console.log(rejectObj));
							}
							else
							{
								transfer_FromMoonbeam("xcDOT", parachainCodes.Moonbeam, parachainCodes.Acala, amount, sendToAddress)
								.then((resolveMsg) => {
									setTransactionMessage(
											resolveMsg.map((msg, index) => {
												return ( <p key={index}>{msg}</p> )
											})
									);
	
									setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
								})
								.catch((rejectMsg) => console.log(rejectMsg));
							}

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Acala" && targetChainDestination==="Moonbeam")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer DOT from Acala to Moonbeam, submitted.`);

							transfer_FromAcala("DOT", parachainCodes.Moonbeam, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						//#endregion

					}
					//#endregion
					//#region baseCurrency ACA
					else if (baseCurrency==="ACA")
					{
						if (orginChain==="Acala" && targetChainDestination==="Moonbeam")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer ACA from Acala to Moonbeam, submitted.`);

							transfer_FromAcala("ACA", parachainCodes.Moonbeam, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonbeam" && targetChainDestination==="Acala")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer ACA from Moonbeam to Acala, submitted.`);

							transfer_FromMoonbeam("xcACA", parachainCodes.Acala, parachainCodes.Acala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
					}
					//#endregion
					//#region baseCurrency GLMR
					else if (baseCurrency==="GLMR")
					{
						if (orginChain==="Acala" && targetChainDestination==="Moonbeam")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer GLMR from Acala to Moonbeam, submitted.`);

							transfer_FromAcala("GLMR", parachainCodes.Moonbeam, sendToAddress, amount)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));
							
							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
						else if (orginChain==="Moonbeam" && targetChainDestination==="Acala")
						{
							setTransfer_IsSubmiting(true);
							setTransactionMessage(`Transfer GLMR from Moonbeam to Acala, submitted.`);

							transfer_FromMoonbeam("GLMR", parachainCodes.Moonbeam, parachainCodes.Acala, amount, sendToAddress)
							.then((resolveMsg) => {
								setTransactionMessage(
										resolveMsg.map((msg, index) => {
											return ( <p key={index}>{msg}</p> )
										})
								);

								setTimeout(() => { getAllBalancesAndAccountFormatsPolkadot(polakdotAccountSigner.address, accountList[0]); },6000);
							})
							.catch((rejectMsg) => console.log(rejectMsg));

							setTransfer_IsSubmiting(false);
							setInputTranferAmount("");  resetAll();
						}
					}
					//#endregion








			//#endregion
			}
		
		}

		setSendToAddress("");
	};
	//#endregion


	//#region xcmTokenDiv
	const xcmTokenDiv =   (
		<div className="form-group">
			<div className="input-group input-group-lg">
				<div className="input-group-prepend" >
					<div className="input-group-text form-control default-select  "  style={{fontSize:"22px", textAlign:"center"}}>{tokenSelected}</div>
				</div>
				<div>
					<input type="text" className="form-control" value={inputTranferAmount} placeholder={"Number of tokens to send"} onChange = {(event) => setInputTranferAmount( event.target.value) } style={{color:"white", width:"450px" }} />
				</div>

			</div>
		</div>
	);
	//#endregion

	//#region tokenDiv
	const tokenDiv =   (
			<div className="form-group">
				<div className="input-group input-group-lg">
					<div className="input-group-prepend">
						<div className="input-group-text form-control default-select  "  style={{fontSize:"22px", textAlign:"center"}}>{originChainSelected}</div>
					</div>
					<input type="text" className="form-control"  readOnly
					value={`${ (originChainSelected==="Moonriver" || originChainSelected==="Moonbeam")? accountList[0] : (suggestedOriginAccount!==""? suggestedOriginAccount : polakdotAccountSigner.address) }`}   
					style={{color:"white", fontSize:"22px"}} />
				</div>
			</div>
						);
	//#endregion

	//#region stableDiv
	const stableDiv =   (			
			<div className="form-group">
				<div className="input-group input-group-lg">
					<div className="input-group-prepend">
							<div className="input-group-text form-control default-select  "  style={{fontSize:"22px", textAlign:"center"}}>{destinationChainSelected}</div>
					</div>
					<input type="text" className="form-control" value={sendToAddress} placeholder={"Destination Account Address"} onChange = {(event) => {
							setSendToAddress(event.target.value);
						}
					} style={{ color: "white"}} />
				</div>
			</div>
						);
	//#endregion

	//#endregion

	 
	useEffect(() => {
		if (targetAccount==="") setSendToAddress("");
	},[targetAccount]);
    

	return(
		<>
			<div className="card" style={{backgroundColor:"black"}}>
				<div className="card-header d-block ">
					<div>
						<h4 className="fs-36 text-black"  style={{textAlign:"center"}}>XCM Transfer Center</h4>
					</div>
				</div>
				<div className="card-body">
					<div className="basic-form">
						<form className="form-wrapper">
							<div>
								{xcmTokenDiv}
							</div>
							<div style={{marginTop:"20px"}}>
								<div className="row" style={{marginBottom:"10px"}}>
									<div className="col-xl-9 col-xxl-12"></div>
									<div className="col-xl-3 col-xxl-12">
									</div>
								</div>

								{tokenDiv}
							</div>

							<div style={{marginTop:"20px"}}>
								<div className="row" style={{marginBottom:"10px"}}>
									<div className="col-xl-9 col-xxl-12"></div>
									<div className="col-xl-3 col-xxl-12">
									</div>
								</div>

								{stableDiv}
							</div>

							<div className="row mt-4"  style={{backgroundColor:"",  }}>
									<div className="col-xl-3"   >
									</div>
									<div className="col-xl-6"  style={{marginTop:"20px", backgroundColor:""}}>
											<button type="button" className="btn btn-outline-primary btn-lg btn-block" disabled={transfer_IsSubmiting}   onClick = {() => transferBalance(tokenSelected, originChainSelected, destinationChainSelected) }>SEND</button> 
									</div>
							</div>
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							<div className="col-xl-12 text-center text-warning" >
								<div className="fs-14 text-center mt-2" style={{color:"darkorange"}}>{transactionMessage}</div>
							</div>
							<br/>
							<br/>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
export default QuickTrade;