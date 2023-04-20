import React, {useState, useContext, useEffect} from 'react';
import {AuthContext} from "../context";
import {useLocation} from "react-router-dom";
import Header from "../UI/Header";
import Avatar from "../UI/Avatar";
import image from '../images/AvatarImg.svg'
import ModalWindow from "../UI/ModalWindow";
import IllnessCard from "../components/IllnessCard";
import Button from "../UI/Button";
import AddForm from "../components/AddForm";
import Sign from "../metamask/Sign.js";
import {create as ipfsHttpClient} from "ipfs-http-client";
import authorization from "../keys";
import axios from "axios";
import EventCard from "../components/EventCard";

const PersonCard = (props) => {

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001",
        headers: {
            authorization,
        },
    });

    const {currentAccount,userRole, contract} = useContext(AuthContext)
    const [card,setCard] = useState(undefined)
    const [hash,setHash] = useState(undefined)
    const [medHistory, setHistory] = useState(true)
    const [events, setEvents] = useState([])

    const [illnesses,setIllnesses] = useState([])

    const location = useLocation()

    if(location.state){
        props = location.state
    }

    const [modal, setModal] = useState(false)
    const [addForm,setAddForm] = useState(false)

    const activateModal = (e) => {
        setModal(true)
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

    const getEvents = async () => {
        if(props.patient.role === "USER"){

            const events = await contract.getPastEvents("CardUpdated",{
                filter:{userAddress : props.account},
                fromBlock: 0,
                toBlock: "latest"
            })

            setEvents([...events])
        }else{
            const events1 = await contract.getPastEvents("CardUpdated",{
                filter:{from : props.account},
                fromBlock: 0,
                toBlock: "latest"
            })
            const events2 = await contract.getPastEvents("UserAdded",{
                filter:{from: props.account},
                fromBlock:0,
                toBlock: "latest"
            })
            const events3 = await contract.getPastEvents("UserRemoved",{
                filter:{from: props.account},
                fromBlock:0,
                toBlock: "latest"
            })

            setEvents([...events1, ...events2, ...events3])
        }
    }


    const getCard = async () =>{
        try{
            let file;
            console.log(props.patient.card)
            if(location.state === null){
                file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + props.patient.card.jsonHash)
            }else{
                file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + props.patient.card)
            }
            console.log(file.data)
            setHash(props.patient.card)
            console.log(props.patient.card)
            setCard(file.data)
            setIllnesses([...file.data.illnesses])
        }catch (err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getCard()
    },[])

    useEffect(() => {
        getEvents()
    },[card])

    // const SignInformation = (e) =>{
    //     e.preventDefault()
    //     Sign(currentAccount, provider, props.account)
    // }

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
                            {(userRole === "DOCTOR" || currentAccount === process.env.REACT_APP_OWNER_ACCOUNT) ?
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
                        </>
                        :
                        <>s
                            {events.map((el,i) => {
                                if(el.event === "CardUpdated") {
                                    return (
                                        <table key={i} className="table">
                                            <thead>
                                            <tr>
                                                <th>Event</th>
                                                <th>Transaction Hash</th>
                                                <th>From</th>
                                                <th>User Address</th>
                                                <th>Previous Card Hash</th>
                                                <th>New Card Hash</th>
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
                                }
                            })}
                        </>
                }
            </ModalWindow>
            <main className="menu">
                {/*<div>*/}
                {/*    <Link className="back" to="/"> Back </Link>*/}
                {/*</div>*/}
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
                    <div className='patient-info__field'>
                        Surname — <span className='patient-info__field patient-info__field--color'>{props.patient.surname}</span>
                    </div>
                    <div className='patient-info__field'>
                        Age — <span className='patient-info__field patient-info__field--color'>{props.patient.age}</span>
                    </div>
                    <div className='patient-info__field'>
                        Role — <span className='patient-info__field patient-info__field--color'>{props.patient.role}</span>
                    </div>
                    {
                        props.account !== process.env.REACT_APP_OWNER_ACCOUNT
                        ?
                            <>
                                <div onClick={(e) => {activateModal(e); setHistory(true)}} className="patient-info__field">
                                    <span className='patient-info__field--click'>Med history</span>
                                </div>
                                <div onClick={(e) => {activateModal(e); setHistory(false)}} className="patient-info__field">
                                    <span className='patient-info__field--click'>Update history</span>
                                </div>
                            </>
                            : null
                    }
                    {/*<Button title="Sign" classes={"custom-button custom-button--white"} onClick={SignInformation}/>*/}
                </div>
            </main>
        </div>
    );
};

export default PersonCard;