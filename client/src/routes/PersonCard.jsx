import React, {useState, useContext, useEffect, useRef} from 'react';
import {AuthContext} from "../context";
import {useLocation} from "react-router-dom";
import Header from "../UI/Header";
import Avatar from "../UI/Avatar";
import image from '../images/AvatarImg.svg'
import ModalWindow from "../UI/ModalWindow";
import IllnessCard from "../components/IllnessCard";
import Button from "../UI/Button";
import AddForm from "../components/AddForm";
import {create as ipfsHttpClient} from "ipfs-http-client";
import authorization from "../keys";
import axios from "axios";
import EventCard from "../components/EventCard";
import {encryptText, decryptText} from "../encryption/encrypt.mjs";
import Input from "../UI/Input";
import Permission from "../components/Permission";

//Компонент карточки пользователя

const PersonCard = (props) => {

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001",
        headers: {
            authorization,
        },
    });

    let info = {}
    const doEncryption = useRef()
    const {currentAccount,userRole, contract, setSecret, secret, web3, ethersContract} = useContext(AuthContext)
    const [card,setCard] = useState(null)
    const [hash,setHash] = useState(props.patient.card.jsonHash)
    const [medHistory, setHistory] = useState(true)
    const [events, setEvents] = useState([])
    const [input, setInput] = useState("")
    const [modalSecret,setModalSecret] = useState(false)
    const [access, setAccess] = useState(false)
    const [permissionId, setPermission] = useState(undefined)


    const [illnesses,setIllnesses] = useState([])

    const location = useLocation()

    //Определение места, из которого перешли в карточку пользователя (списка пациентов, докторов, организаций, либо личная карта пользователя)

    if(location.state){
        props = location.state
    }

    const [modal, setModal] = useState(false)
    const [addForm,setAddForm] = useState(false)
    const [encrypted, setEncrypted] = useState(props.patient.card.encrypted)

    //Обработчики модальных окон

    const activateModal = (e) => {
        setModal(true)
        e.stopPropagation()
    }

    const activateModal2 = (e) => {
        setModalSecret(true)
        e.stopPropagation()
    }

    const activeAddForm = async (e) =>{
        if(!addForm){
            setAddForm(true)
        }else{
            setAddForm(false)
        }
        e.stopPropagation()
    }

    //Функция, получающая набор событий, связанных с пользователями

    const getEvents = async () => {

        if(props.patient.role === "USER"){

            const events1 = await contract.getPastEvents("CardUpdated",{
                filter:{to : props.account},
                fromBlock: 0,
                toBlock: "latest",
                active: false
            })
            const events2 = await contract.getPastEvents("AskForPermission",{
                filter:{to : props.account},
                fromBlock: 0,
                toBlock: "latest",
                active: false
            })
            const events3 = await contract.getPastEvents("GiveInformation",{
                filter: {from : props.account},
                fromBlock: 0,
                toBlock: "latest",
                active: false
            })

            setEvents([...events1, ...events2, ...events3])

        }else if(props.patient.role === "DOCTOR"){
            const events1 = await contract.getPastEvents("CardUpdated",{
                filter:{from : props.account},
                fromBlock: 0,
                toBlock: "latest"
            })

            const events2 = await contract.getPastEvents("UserAdded",{
                filter:{from: props.account},
                fromBlock: 0,
                toBlock: "latest"
            })

            const events3 = await contract.getPastEvents("AskForPermission",{
                filter:{from : props.account},
                fromBlock: 0,
                toBlock: "latest",
                active: false
            })
            const events4 = await contract.getPastEvents("GiveInformation",{
                filter: {to : props.account},
                fromBlock: 0,
                toBlock: "latest",
                active: false
            })

            setEvents([...events1, ...events2, ...events3, ...events4])
        }
    }

    //Функция, получающая информацию о личной карте пользователя из IPFS и смарт-контракта

    const getCard = async () =>{
        console.log('GETS CARD')

        if(currentAccount === props.account){
            try{
                let file;
                console.log(hash)
                file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + hash)
                console.log(file)
                console.log(encrypted)
                if(encrypted){
                    const secret = prompt("Write down your secret phrase to decrypt")
                    setSecret(secret)
                    const Data = await decryptText(file.data, secret)
                    console.log(Data)
                    setCard(Data)
                    setIllnesses([...Data.illnesses])
                    return({
                        personCard: Data,
                        cardHash: props.patient.card.jsonHash
                    })
                }else{
                    console.log(file.data)
                    setCard(file.data)
                    setIllnesses([...file.data.illnesses])
                    return({
                        personCard: file.data,
                        cardHash: props.patient.card.jsonHash
                    })
                }
            }catch (err){
                console.log(err)
            }
        }else{
            const user = await contract.methods.getSpecificUser(props.account).call()
            let file;
            file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + user.userCard.jsonHash)
            console.log(file)
            setHash(user.userCard.jsonHash)
            const secret = prompt("Write down your secret phrase to decrypt")
            setSecret(secret)
            const Data = await decryptText(file.data, secret)
            setCard(Data)
            setIllnesses([...Data.illnesses])
        }
    }

    useEffect(()=>{
        console.log('FUNC')

        // Функция осуществляющая шифрование
       doEncryption.current = async (phrase) => {
            try{
                console.log(card)
                const encryptedText = await encryptText(card, phrase)
                const result = await ipfs.add(encryptedText);
                console.log('Удаляем')
                console.log(hash)
                if(!hash){
                    const res = await axios.post(`https://ipfs.infura.io:5001/api/v0/pin/rm?arg=${props.patient.card.jsonHash}`,{},{
                        headers:{
                            Authorization: authorization,
                        }
                    })
                    console.log(res)
                }else {
                    const res = await axios.post(`https://ipfs.infura.io:5001/api/v0/pin/rm?arg=${hash}`, {}, {
                        headers: {
                            Authorization: authorization,
                        }
                    })
                    console.log(res)
                }
                const cardix = await contract.methods.updateCard(result.path, props.account).send({from:currentAccount})
                const encrypt = await contract.methods.encrypt("Fine").send({from:currentAccount})
                const file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + result.path)
                setEncrypted(true)
                setHash(result.path)
                return {personCard:file.data, cardHash: result.path, phrase:phrase}
            }catch (err){
                console.log(err)
            }
        }
        console.log(doEncryption.current)
    }, [card,hash])


    //Функция получающая информации о паценте, при наличиии разрешения от него

    const getInformation = (permission) => {
        setAccess(true);
        setPermission(permission)
        getCard()
    }

    //Функция, запрашивающая разрешение о предоставлении информации врачу

    const askForPermission = async (e) => {
        try {
            e.preventDefault()
            const res = await contract.methods.askPermission(props.account).send({from:currentAccount})
        }catch (err){
            console.log(err)
        }
    }

    //Функция, дающая разрешение о предоставлении информации врачу

    const giveInformation = async (from, to, permissionId) => {

        let approved = false;

        contract.getPastEvents(
            "AskForPermission",
            {
                filter:{
                    to: currentAccount,
                },
                fromBlock:"latest",
                toBlock:"pending"
            },
            (error, event) => {
                if (error) {
                    console.log('Ошибка');
                }

                if(event){

                    contract.getPastEvents(
                        "GiveInformation",
                        {
                            filter:{
                                permissionId: event[0].returnValues.permissionId
                            },
                            fromBlock:0,
                            toBlock:"latest"
                        },
                        (error, event) => {
                            if(error){
                                console.log('Ошибка')
                            }

                            if(event){
                                approved = true
                            }
                        }
                    )

                    if(!approved) {
                        contract.getPastEvents(
                            "RejectPermission",
                            {
                                filter: {
                                    permissionId: event[0].returnValues.permissionId
                                },
                                fromBlock: 0,
                                toBlock: "latest",
                            },
                            (error, event) => {
                                if (error) {
                                    console.log('Ошибка')
                                }

                                if (event) {
                                    approved = true
                                }
                            }
                        )
                    }
                }

                if(!approved){
                    const permissionWindow = window.confirm(`Doctor with address ${from} asks for your card`)
                    if(permissionWindow){
                        contract.methods.giveInformation(from, "YES", permissionId).send({from:currentAccount})
                        console.log('Отправлено')
                        const phrase = window.prompt(`Write down new code phrase for doctor`);
                        console.log(phrase)
                        handleEncryption(phrase)
                    }
                }
            })
        getCard()
    }

    //Обновление карты пациента доктором

    const doctorUpdate = async (permissionId) => {

        console.log(permissionId)
        const secret = prompt("Write down your secret phrase to encrypt")
        handleEncryption(secret)
        setAccess(false)
        setModal(false)

    }

    useEffect(()=>{
        console.log('EFFECT')
        async function onLoad(){
            if(userRole === "USER"){
                await getCard()
            }
        }
        onLoad()
    },[])

    useEffect(() => {
        getEvents()
    },[card])


    let userInfo = null;

    //Handler для шифрования данных

    const handleEncryption = (input) => {
        console.log(doEncryption.current)
        if(doEncryption){
            return doEncryption.current(input)
        }
    }

    if(props.account !== process.env.REACT_APP_OWNER_ACCOUNT) {
        if (props.account === currentAccount && !encrypted) {
            userInfo = <>
                    <ModalWindow state={modalSecret} setState={setModalSecret}>
                        <div className={"encrypt-container"}>
                            <Input placeholder="Secret" value={input} classes="input-text input-text--whiteBack input-text--bottomBorder" onChange={(e) => {setInput(e.target.value)}}/>
                            <Button classes={"custom-button custom-button--margin-top"} onClick={(e) => {
                                handleEncryption(input)
                                    .then(result =>
                                    {
                                        info.cardHash = result.cardHash
                                        console.log(info.cardHash)
                                        decryptText(result.personCard, result.phrase)
                                            .then(data => {
                                                console.log(data)
                                                setCard(data)
                                                info.personCard = data
                                            })})
                                setInput("");

                            }} title={"Submit"}/>
                        </div>
                    </ModalWindow>
                    <div onClick={(e) => {
                    activateModal2(e);
                }} className="patient-info__field">
                    <span className='patient-info__field--click'>Encrypt</span>
                </div>
            </>
        } else if (props.account === currentAccount || access) {
            userInfo = <div onClick={(e) => {
                activateModal(e);
                setHistory(true)
            }} className="patient-info__field">
                <span className='patient-info__field--click'>Med history</span>
            </div>
        } else {
            userInfo = <div onClick={(e) => {askForPermission(e)}} className="patient-info__field">
                <span className='patient-info__field--click'>Get permission</span>
            </div>
        }
    }

    return (
        <div onClick={() => {
            setAddForm(false)
        }}>
            <Header/>
            <ModalWindow state = {modal} setState={setModal}>
                {
                    medHistory
                        ?
                        <>
                            {(userRole === "DOCTOR" || currentAccount === process.env.REACT_APP_OWNER_ACCOUNT || userRole === "ORGANIZATION") ?
                                <>
                                    <Button classes={"custom-button custom-button--white custom-button--image"} onClick={activeAddForm} title={""}/>
                                    <AddForm account = {props.account} card = {hash} setHash = {setHash} currentJSON = {card} setCard={setCard} illnesses={illnesses} setIllnesses = {setIllnesses} state = {addForm}/>
                                </>
                                : null
                            }
                            {illnesses.map((el,i)=>{
                                return (
                                    <IllnessCard account = {props.account} card = {hash} setHash = {setHash} currentJSON = {card} setCard={setCard} illnesses={illnesses} setIllnesses = {setIllnesses} key={i} illness={el}/>
                                )
                            })}
                            {userRole === "DOCTOR" || userRole === "ORGANIZATION" ? <Button classes={"custom-button custom-button--white custom-button--margin_top"} onClick = {() => {doctorUpdate(permissionId)}} title = {"Submit"}/> : null}
                        </>
                        :
                        <>
                            {events.map((el,i) => {
                                if(el.event === "CardUpdated") {
                                    return (
                                        <table key={i} className="table">
                                            <thead>
                                            <tr>
                                                <th>Event</th>
                                                <th>Transaction Hash</th>
                                                <th>To</th>
                                                <th>From</th>
                                                <th>Previous card hash</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <EventCard
                                                event={el.event}
                                                transactionHash={el.transactionHash}
                                                returnValues={el.returnValues}/>
                                            </tbody>
                                        </table>
                                    )
                                }else if(el.event === "UserAdded"){
                                    return (
                                        <table key={i} className="table">
                                            <thead>
                                            <tr>
                                                <th>Event</th>
                                                <th>Transaction Hash</th>
                                                <th>From</th>
                                                <th>User Address</th>
                                                <th>Name</th>
                                                <th>Surname</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <EventCard
                                                event={el.event}
                                                transactionHash={el.transactionHash}
                                                returnValues={el.returnValues}/>
                                            </tbody>
                                        </table>
                                    )
                                }else if(el.event === "AskForPermission"){
                                    return (
                                        <table key={i} className="table">
                                            <thead>
                                            <tr>
                                                <th>Event</th>
                                                <th>Transaction Hash</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Id</th>
                                                <th>When</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <EventCard
                                                event={el.event}
                                                transactionHash={el.transactionHash}
                                                returnValues={el.returnValues}/>
                                            </tbody>
                                        </table>
                                    )
                                }else if(el.event === "GiveInformation"){
                                    return(
                                        <table key={i} className="table">
                                            <thead>
                                            <tr>
                                                <th>Event</th>
                                                <th>Transaction Hash</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Id</th>
                                                <th>When</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <EventCard
                                                event={el.event}
                                                transactionHash={el.transactionHash}
                                                returnValues={el.returnValues}/>
                                            </tbody>
                                        </table>
                                    )
                                }
                            })}
                        </>
                }
            </ModalWindow>
            <main className="menu">
                <Permission doEncryption = {handleEncryption} getInformation = {getInformation} giveInformation = {giveInformation}/>
                <div className='patient-info'>
                    <div className='patient-info__field'>
                        <p>Your account — <span className='patient-info__field patient-info__field--color'>{props.account}</span></p>
                    </div>
                    <div className='patient-info__field'>
                        <Avatar image = {image}/>
                    </div>
                    <div className='patient-info__field'>
                        Name — <span className='patient-info__field patient-info__field--color'>{props.patient.name}</span>
                    </div>
                    {
                        props.patient.role !== "ORGANIZATION"
                            ?
                            <div className='patient-info__field'>
                                Surname — <span className='patient-info__field patient-info__field--color'>{props.patient.surname}</span>
                            </div>
                            : null
                    }
                    {
                        props.patient.role !== "ORGANIZATION"
                            ?
                            <div className='patient-info__field'>
                                Age — <span className='patient-info__field patient-info__field--color'>{props.patient.age}</span>
                            </div>
                            : null
                    }
                    <div className='patient-info__field'>
                        Role — <span className='patient-info__field patient-info__field--color'>{props.patient.role}</span>
                    </div>
                    {
                        props.patient.role !== "ORGANIZATION"
                        ?
                            <>
                                {userInfo}
                                <div onClick={(e) => {activateModal(e); setHistory(false)}} className="patient-info__field">
                                    <span className='patient-info__field--click'>Update history</span>
                                </div>
                            </>
                            : null
                    }
                </div>
            </main>
        </div>
    );
};

export default PersonCard;