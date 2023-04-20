import React, {useState, useContext, useEffect} from 'react';
import PatientMiniCard from "../components/PatientMiniCard";
import Header from "../UI/Header";
import Button from "../UI/Button";
import CreateForm from "../components/CreateForm";
import {AuthContext} from "../context";
import {create as ipfsHttpClient} from "ipfs-http-client";
import authorization from "../keys";

const PatientsList = () => {

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

    useEffect(() => {
        fetchUsers()
    },[])

    const createUser = async () =>{
        try{
            const newCard = {
                userAddress: form.address,
                illnesses: []
            }
            const newCardHash = await ipfs.add(JSON.stringify(newCard))
            console.log(newCardHash)
            const user = await contract.methods.addUser(form.address,form.name,form.surname,form.age,form.role,[newCardHash.path,when]).send({from:currentAccount})
            console.log(user)
        }catch (err){
            console.log(err)
        }
    }

    const fetchUsers = async () =>{
        try{
            const users = await contract.methods.getFullUsers().call()
            const accounts = await contract.methods.getOnlyUsers().call()
            // console.log(accounts)
            // console.log(users)
            setPatients([...users])
            setAccounts([...accounts])
        }catch (err){
            console.log(err)
        }
    }

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
                {/*<div>*/}
                {/*    <Link className="back" to="/"> Back </Link>*/}
                {/*</div>*/}
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