import React, {useState, useContext} from 'react';
import PatientMiniCard from "../components/PatientMiniCard";
import Header from "../UI/Header";
import Button from "../UI/Button";
import CreateForm from "../components/CreateForm";
import {AuthContext} from "../context";

const PatientsList = () => {

//0x5FbDB2315678afecb367f032d93F642f64180aa3


    const patients = [{
        address:'dsa4341xxasda',
        name:'George',
        surname:'Floyd',
        age:46,
    },{
        address:'d4312413dssdfs',
        name:'Will',
        surname:'Smith',
        age:54,
    },{
        address:'0xasdavadf43wdsa',
        name:'Jaden',
        surname: 'Smith',
        age:24,
    }]

    const [createForm, setCreateForm] = useState(false)

    const activeCreateForm = (e) =>{
        if(!createForm){
            setCreateForm(true)
        }else{
            setCreateForm(false)
        }
        e.stopPropagation()
    }


    return (
        <>
            <Header/>
            <main className='menu' onClick={() => {
                setCreateForm(false)
            }}>
                {/*<div>*/}
                {/*    <Link className="back" to="/"> Back </Link>*/}
                {/*</div>*/}
                <Button classes={"custom-button custom-button--green"} onClick={activeCreateForm} title={"Create"}/>
                <CreateForm state = {createForm}/>
                {patients.map((patient,index) =>
                    <PatientMiniCard key = {index} patient = {patient}/>
                )}
            </main>
        </>
    );
};

export default PatientsList;