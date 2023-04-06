import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Login from "./Login";
import PersonCard from "./PersonCard";
import PatientsList from "./PatientsList";
import '../styles/styles.css'
import Web3 from "web3";
import Schedule from "./Schedule";
import {AuthContext} from "../context";


const App = () => {

    const [isConnected,setIsConnected] = useState(false)
    const [currentAccount, setCurrentAccount] = useState(undefined)
    const [provider,setCurrentProvider] = useState(null)

    const defineCurrentProvider = () => {
        if(window.ethereum){
            setCurrentProvider(window.ethereum);
        }else if(window.web3){
            setCurrentProvider('Привет снюс ' + window.web3.currentProvider);
        }else{
            console.log('Please install Metamask')
        }
    }

    const onConnect = async() => {
        try {
            defineCurrentProvider()
            if(provider){
                await provider.request({method: 'eth_requestAccounts'});
                const web3 = new Web3(provider);
                const userAccount = await web3.eth.getAccounts();
                localStorage.setItem('MetaMask',userAccount[0]);
                setCurrentAccount(userAccount[0]);
                setIsConnected(true);
            }
        }catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        onConnect();
        const connection = localStorage.getItem('MetaMask');
        if(connection){
            setIsConnected(true);
            setCurrentAccount(connection)
        }
        },[])


    return (
        <AuthContext.Provider value={{
            provider,
            currentAccount,
            isConnected
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element ={<Navigate to = "/login"/>} />
                    <Route
                        path="/login"
                        element={ isConnected ? <Navigate to={`/card/${currentAccount}`} /> : <Login onConnect = {onConnect} isConnected = {isConnected}/>}
                    />
                    <Route path={`/card/*`} element={<PersonCard account={currentAccount} patient = {{name:'ME',surname:"ME",age:"infinity"}}/>}/>
                    <Route path="/patients" element={<PatientsList/>}/>
                    {/*<Route path="/schedule" element={<Schedule/>} />*/}
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;