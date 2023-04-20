import React from 'react';

const EventCard = ({event, returnValues, transactionHash, type}) => {

    if(event === "CardUpdated"){
        return (
            <tr>
                <td>{event}</td>
                <td>{transactionHash}</td>
                <td>{returnValues.from}</td>
                <td>{returnValues.userAddress}</td>
                <td>{returnValues.newHash}</td>
                <td>{returnValues.previousHash}</td>
            </tr>
        );
    }else{
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
    }
};

export default EventCard;