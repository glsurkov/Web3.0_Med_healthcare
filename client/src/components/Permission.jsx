import React,{useContext,useEffect} from 'react';
import {AuthContext} from "../context";

//Компонент, отвечающий за подтверждение разрешения

const Permission = ({getInformation, giveInformation}) => {

    const {currentAccount, userRole, ethersContract} = useContext(AuthContext)

    //Прослушивание событий GiveInformation в смарт-контракте (если роль врач), и AskForPermission (если роль пациент)

    useEffect(()=>{
        console.log('RENDER')
        if(userRole === "DOCTOR"){

            const giveInfListener = (from, to, permissionId) => {
                if(to === currentAccount) {
                    console.log(`Get information to ${to}`)
                    getInformation(permissionId)
                }
            }
            ethersContract.on('GiveInformation', giveInfListener)

            return () => {
                console.log('тут')
                ethersContract.off('GiveInformation', giveInfListener)
            }
        }
        if(userRole === "USER") {

            const askForPermissionListener = (from, to, permissionId, name, surname, when) => {
                if(to === currentAccount){
                    console.log(`Ему ${to} запросили от ${from} ${name} ${surname} id ${permissionId} в ${when}`)
                    giveInformation(from, to, permissionId)
                }
            }

            ethersContract.on('AskForPermission', askForPermissionListener)

            return () => {
                ethersContract.off('AskForPermission', askForPermissionListener)
            }
        }

    },[])


    return (
        <>
        </>
    );
};

export default Permission;