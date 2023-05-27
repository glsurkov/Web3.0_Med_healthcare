import React, {useContext, useEffect, useState} from 'react';
import Header from "../UI/Header";
import PatientMiniCard from "../components/PatientMiniCard";
import {AuthContext} from "../context";

//Компонент представляющий список организаций

const OrganizationsList = () => {

    const {contract,currentAccount} = useContext(AuthContext)

    const [orgs,setOrgs] = useState([])
    const [orgsAccounts,setAccounts] = useState([])

    useEffect(() => {
        fetchOrgs()
    },[])

    //Функция, получающая список организаций из смарт-контракта

    const fetchOrgs = async () =>{
        try{
            const orgs = await contract.methods.getFullOrgs().call({from: currentAccount})
            const accounts = await contract.methods.getOnlyOrgs().call({from: currentAccount})
            setOrgs([...orgs])
            setAccounts([...accounts])
        }catch (err){
            console.log(err)
        }
    }


    return (
        <>
            <Header/>
            <main className='menu-patients'>
                {orgs.map((org,index) =>
                    <PatientMiniCard key = {orgsAccounts[index]} patient = {org} account = {orgsAccounts[index]} list = {"/organizations"}/>
                )}
            </main>
        </>
    );
};

export default OrganizationsList;