import {recoverTypedSignature} from "@metamask/eth-sig-util";
import { Buffer } from "buffer";
import Web3 from "web3";


window.Buffer = window.Buffer || Buffer;

const Sign = async (currentAccount, provider, sender) => {

    const msgParams = JSON.stringify({
        domain: {
            // Define chain ID
            chainId: "5",
            // Contract that user is going to sign
            name: 'Ether Mail',
            // If name isn't enough add verifying contract
            verifyingContract: '0x3331e1',
            version: '1',
        },

        // Defining the message signing data content.
        message: {
            contents: 'Update your med card',
            from: {
                name: 'Dr.Floyd',
                wallets: [
                    sender,
                ],
            },
            to: [
                {
                    name: 'Will Smith',
                    wallets: [
                        '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                    ],
                },
            ],
        },
        // Refers to the keys of the *types* object below.
        primaryType: 'Notification',
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Group: [
                { name: 'name', type: 'string' },
                { name: 'members', type: 'User[]' },
            ],
            User: [
                { name: 'name', type: 'string' },
                { name: 'wallets', type: 'address[]' },
            ],
            Notification: [
                { name: 'from', type: 'User' },
                { name: 'to', type: 'User[]' },
                { name: 'contents', type: 'string' },
            ],
        },
    });


    try{
        const web3 = new Web3(provider);
        const params = [currentAccount, msgParams];
        const method = 'eth_signTypedData_v4';

        const sign = await provider.sendAsync(
            {
                method,
                params,
                from: currentAccount,
            },
            function (err, result) {
                if (err) return console.dir(err);
                if (result.error) {
                    alert(result.error.message);
                }
                if (result.error) return console.error('ERROR', result);
                console.log('TYPED SIGNED:' + JSON.stringify(result.result));

                const recovered = recoverTypedSignature({
                    data: JSON.parse(msgParams),
                    signature: result.result,
                    version: "V4"
                })

                if (
                    web3.utils.toChecksumAddress(recovered) === web3.utils.toChecksumAddress(currentAccount)
                ) {
                    alert('Successfully recovered signer as ' + currentAccount);
                } else {
                    alert(
                        'Failed to verify signer when comparing ' + result + ' to ' + currentAccount
                    );
                }
            }
        );
        console.log(sign)
    }catch (err){
        console.log(err)
    }

}

export default Sign;