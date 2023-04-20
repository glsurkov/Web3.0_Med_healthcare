import React, {useContext, useEffect, useState} from 'react';
import Header from "../UI/Header";
import Button from "../UI/Button";
import CreateForm from "../components/CreateForm";
import PatientMiniCard from "../components/PatientMiniCard";
import {AuthContext} from "../context";

const DoctorsList = () => {

    const {contract,currentAccount} = useContext(AuthContext)

    const [doctors,setDoctors] = useState([])
    const [doctorsAccounts,setAccounts] = useState([])

    useEffect(() => {
        fetchDoctors()
    },[])


    const fetchDoctors = async () =>{
        try{
            const doctors = await contract.methods.getFullDoctors().call()
            const accounts = await contract.methods.getOnlyDoctors().call()
            // console.log(accounts)
            // console.log(users)
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
                {/*<div>*/}
                {/*    <Link className="back" to="/"> Back </Link>*/}
                {/*</div>*/}
                {doctors.map((doctor,index) =>
                    <PatientMiniCard key = {doctorsAccounts[index]} patient = {doctor} account = {doctorsAccounts[index]} list = {"/doctors"}/>
                )}
            </main>
        </>
    );
};

export default DoctorsList;