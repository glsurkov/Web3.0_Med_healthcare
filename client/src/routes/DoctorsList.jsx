import React, {useContext, useEffect, useState} from 'react';
import Header from "../UI/Header";
import Button from "../UI/Button";
import CreateForm from "../components/CreateForm";
import PatientMiniCard from "../components/PatientMiniCard";
import {AuthContext} from "../context";

//Компонент, представляющий список докторов системы

const DoctorsList = () => {

    const {contract,currentAccount} = useContext(AuthContext)

    const [doctors,setDoctors] = useState([])
    const [doctorsAccounts,setAccounts] = useState([])

    useEffect(() => {
        fetchDoctors()
    },[])

    //Функция, получающая список докторов из смарт-контракта
    //(вызыватеся при первом рендере в useEffect)

    const fetchDoctors = async () =>{
        try{
            const doctors = await contract.methods.getFullDoctors().call({from: currentAccount})
            const accounts = await contract.methods.getOnlyDoctors().call({from: currentAccount})
            setDoctors([...doctors])
            setAccounts([...accounts])
        }catch (err){
            console.log(err)
        }
    }

    return (
        <>
            <Header/>
            <main className='menu-patients'>
                {doctors.map((doctor,index) =>
                    <PatientMiniCard key = {doctorsAccounts[index]} patient = {doctor} account = {doctorsAccounts[index]} list = {"/doctors"}/>
                )}
            </main>
        </>
    );
};

export default DoctorsList;