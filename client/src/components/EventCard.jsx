import React from 'react';

//Компонент карточки события

const EventCard = ({event, returnValues, transactionHash, type}) => {

    if(event === "CardUpdated"){
        return (
            <tr>
                <td>{event}</td>
                <td>{transactionHash}</td>
                <td>{returnValues.to}</td>
                <td>{returnValues.from}</td>
                <td>{returnValues.previousHash}</td>
            </tr>
        );
    }else if(event === "UserAdded"){
        return (
            <tr>
                <td>{event}</td>
                <td>{transactionHash}</td>
                <td>{returnValues.from}</td>
                <td>{returnValues.userAddress}</td>
                <td>{returnValues.userName}</td>
                <td>{returnValues.userSurname}</td>
            </tr>
        )
    }else if(event === "AskForPermission"){
        const date = +returnValues.when*1000
        return (
            <tr>
                <td>{event}</td>
                <td>{transactionHash}</td>
                <td>{returnValues.from}</td>
                <td>{returnValues.to}</td>
                <td>{returnValues.permissionId}</td>
                <td>{new Date(date).getDate()+' '+ `${(new Date(date).getMonth()) + 1}`  + ' '+new Date(date).getFullYear() +' в '+new Date(date).getHours()+':'+new Date(date).getMinutes()}</td>
            </tr>
        )
    }else if(event === "GiveInformation"){
        const date = +returnValues.when*1000
        return (
            <tr>
                <td>{event}</td>
                <td>{transactionHash}</td>
                <td>{returnValues.from}</td>
                <td>{returnValues.to}</td>
                <td>{returnValues.permissionId}</td>
                <td>{new Date(date).getDate()+' '+ `${(new Date(date).getMonth()) + 1}`  + ' '+new Date(date).getFullYear() +' в '+new Date(date).getHours()+':'+new Date(date).getMinutes()}</td>
            </tr>
        )
    }
};

export default EventCard;