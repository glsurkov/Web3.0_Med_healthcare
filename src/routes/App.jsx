import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "./Login";
import PersonCard from "./PersonCard";
import PatientsList from "./PatientsList";
import '../styles/styles.css'
import Web3 from "web3";
import Schedule from "./Schedule";
import {AuthContext} from "../context";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "../contracts/contract";
import DoctorsList from "./DoctorsList";


const App = () => {

    const [isConnected,setIsConnected] = useState(false)
    const [currentAccount, setCurrentAccount] = useState(undefined)
    const [provider,setCurrentProvider] = useState(null)
    const [contract, setContract] = useState(undefined)
    const [userRole, setUserRole] = useState(undefined)
    const [defaultUser, setUser] = useState({})

    const defineCurrentProvider = () => {
        if(window.ethereum){
            setCurrentProvider(Web3.givenProvider);
        }else{
            console.log('Please install Metamask')
        }
    }

    const accountChangedHandler = (newAccount) =>{
        setCurrentAccount(newAccount)
    }

    const onConnect = async () => {
        try {
            await defineCurrentProvider()
            if(Web3.givenProvider){
                const web3 = new Web3(Web3.givenProvider);
                const userAccount = await web3.eth.getAccounts();
                const controlContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
                if(userAccount[0]){
                    accountChangedHandler(userAccount[0])
                }
                if(controlContract){
                    setContract(controlContract)
                }
                if(userAccount[0] === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){
                    setUserRole('DOCTOR')
                    setUser({
                        userName:"ORGANIZATION",
                        userSurname:"ORGANIZATION",
                        userAge:11,
                        userRole:"ORGANIZATION"
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

    window.ethereum.on('accountsChanged', () => {setIsConnected(false);onConnect()})

    useEffect(() => {
            onConnect()
        },[])


    return (
        <AuthContext.Provider value={{
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
                        card:defaultUser.userCard
                    }}/> : <Navigate to = "/login"/>}/>
                    <Route path="/patients" element={ (isConnected && userRole === 'DOCTOR') ? <PatientsList/> : <Navigate to={`/card/${currentAccount}`}/>}/>
                    <Route path="/doctors" element={(isConnected) ? <DoctorsList/> : <Navigate to = "/login"/>}/>
                    {/*<Route path="/schedule" element={<Schedule/>} />*/}
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;