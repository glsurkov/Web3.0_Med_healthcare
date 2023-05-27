import React, {useState, useContext, useEffect} from 'react';
import PatientMiniCard from "../components/PatientMiniCard";
import Header from "../UI/Header";
import Button from "../UI/Button";
import CreateForm from "../components/CreateForm";
import {AuthContext} from "../context";
import {create as ipfsHttpClient} from "ipfs-http-client";
import authorization from "../keys";

//Компонент представляющий список пациентов

const PatientsList = () => {

    //Клиент IPFS

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001",
        headers: {
            authorization,
        },
    });

    const {contract,currentAccount} = useContext(AuthContext)

    const [patients,setPatients] = useState([])
    const [patientsAccounts,setAccounts] = useState([])
    const [createForm, setCreateForm] = useState(false)
    const [form, setForm] = useState(undefined)
    const when = Date.now()
    const encrypted = false

    useEffect(() => {
        fetchUsers()
    },[])


    //Функция создания пользователя

    const createUser = async () =>{
        try{
            let newCard
            if(form.role === "ORGANIZATION"){
                newCard = {
                    userAddress: form.address,
                    illnesses: []
                }
            }else{
                newCard = {
                    userAddress: form.address,
                    illnesses: []
                }
            }
            const newCardHash = await ipfs.add(JSON.stringify(newCard))
            const user = await contract.methods.addUser(form.address,form.name,form.surname,form.age,form.role,[newCardHash.path,when,encrypted]).send({from:currentAccount})
        }catch (err){
            console.log(err)
        }
    }

    //Функция, получающая список организаций из смарт-контракта

    const fetchUsers = async () =>{
        try{
            const users = await contract.methods.getFullUsers().call({from: currentAccount})
            const accounts = await contract.methods.getOnlyUsers().call({from: currentAccount})
            setPatients([...users])
            setAccounts([...accounts])
        }catch (err){
            console.log(err)
        }
    }

    //Handler, активирующий форму создания

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
            <main className='menu-patients' onClick={() => {
                setCreateForm(false)
            }}>
                <Button classes={"custom-button custom-button--margin_top custom-button--image custom-button--transparent" } onClick={activeCreateForm} title={""}/>
                <CreateForm createUser = {createUser} fetchUsers = {fetchUsers} setForm = {setForm} state = {createForm}/>
                {patients.map((patient,index) =>
                    <PatientMiniCard key = {patientsAccounts[index]} patient = {patient} account = {patientsAccounts[index]} list = {"/patients"}/>
                )}
            </main>
        </>
    );
};

export default PatientsList;