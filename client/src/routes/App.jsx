import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "./Login";
import PersonCard from "./PersonCard";
import PatientsList from "./PatientsList";
import '../styles/styles.css'
import Web3 from "web3";
import {ethers} from 'ethers';
import {AuthContext} from "../context";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "../contracts/contract";
import DoctorsList from "./DoctorsList";
import OrganizationsList from "./OrganizationsList";

//Корневой компонент React приложения

const App = () => {

    const [isConnected,setIsConnected] = useState(false)
    const [currentAccount, setCurrentAccount] = useState(undefined)
    const [provider,setCurrentProvider] = useState(null)
    const [contract, setContract] = useState(undefined)
    const [userRole, setUserRole] = useState(undefined)
    const [defaultUser, setUser] = useState({})
    const [webInst, setWebInst] = useState(undefined)
    const [ethersSigner, setEthersSigner] = useState(undefined)
    const [ethersContract, setEthersContract] = useState(undefined)
    const [secret, setSecret] = useState("")


    //Функция, определяющая сущность провайдера в браузере (MetaMask)

    const defineCurrentProvider = () => {
        if(window.ethereum){
            setCurrentProvider(Web3.givenProvider);
        }else{
            console.log('Please install Metamask')
        }
    }

    //Handler смены аккаунта в MetaMask

    const accountChangedHandler = (newAccount) =>{
        setCurrentAccount(newAccount)
    }

    //Функция, инициализирующая провайдера, подписанта, акакунт пользователя, смарт-контракт
    // (вызывается далее как колбэк при первом рендере в useEffect)

    const onConnect = async () => {
        try {
            await defineCurrentProvider()
            if(Web3.givenProvider){
                const web3 = new Web3(Web3.givenProvider);
                setWebInst(web3)
                const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = ethersProvider.getSigner()
                setEthersSigner(signer)
                const userAccount = await web3.eth.getAccounts();
                const contract2 = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
                setEthersContract(contract2)
                const controlContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
                if(userAccount[0]){
                    accountChangedHandler(userAccount[0])
                }
                if(controlContract){
                    setContract(controlContract)
                }
                if(userAccount[0] === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){
                    setUserRole('ORGANIZATION')
                    setUser({
                        userName:"ORGANIZATION",
                        userSurname:"ORGANIZATION",
                        userAge:0,
                        userRole:"ORGANIZATION",
                        userCard:{
                            jsonHash:"xxx",
                            lastUpate:"xxx",
                            encrypted:false
                        }
                    })
                    setIsConnected(true)
                }else{
                    const user = await contract.methods.getSpecificUser(userAccount[0]).call()
                    setUser(user)
                    setUserRole(user.userRole)
                    if(user[0] !== ""){
                        setIsConnected(true)
                    }
                }
            }
        }catch (err){
            console.log("Ошибка  ",err)
        }
    }

    //Прослушивание события смены аккаунта в MetaMask с вызовом соответствующего колбэка

    window.ethereum.on('accountsChanged', () => {setIsConnected(false);onConnect()})

    useEffect(() => {
            onConnect()
            console.log(defaultUser.userCard)
        },[])


    return (
        <AuthContext.Provider value={{
            secret,
            setSecret,
            ethersContract,
            web3: webInst,
            provider,
            currentAccount,
            isConnected,
            contract,
            userRole,
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element ={<Navigate to = "/login"/>} />
                    <Route
                        path="/login"
                        element={ isConnected ? <Navigate to={`/card/${currentAccount}`} /> : <Login onConnect = {onConnect} isConnected = {isConnected}/>}
                    />
                    <Route path={`/card/*`} element={ isConnected ? <PersonCard account={currentAccount} patient = {{
                        name:defaultUser.userName,
                        surname:defaultUser.userSurname,
                        age:defaultUser.userAge,
                        role:defaultUser.userRole,
                        card:defaultUser.userCard,
                    }}/> : <Navigate to = "/login"/>}/>
                    <Route path="/patients" element={ (isConnected && (userRole === 'DOCTOR' || userRole === "ORGANIZATION")) ? <PatientsList/> : <Navigate to={`/card/${currentAccount}`}/>}/>
                    <Route path="/doctors" element={(isConnected) ? <DoctorsList/> : <Navigate to = "/login"/>}/>
                    <Route path="/organizations" element={(isConnected) ? <OrganizationsList/> : <Navigate to = "/login"/>}/>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;