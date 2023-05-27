import CryptoJS from "crypto-js"

//Функция, осуществляющая шифрование JSON'a медицицнской карты пациента

export async function encryptText(plainText, secretPhrase){

    const start = new Date().getTime()

    const jsonString = JSON.stringify(plainText);

    const encrypted = CryptoJS.AES.encrypt(jsonString, secretPhrase).toString();

    console.log(encrypted)

    const end = new Date().getTime()

    console.log('Encrypt time of card ' + (-(start - end)))

    return encrypted
}

//Функция, осуществляющая дешифрование JSON'a медицицнской карты пациента

export async function decryptText(encryptedText, secretPhrase){

    const start = new Date().getTime()

    const decryptedBytes =  CryptoJS.AES.decrypt(encryptedText, secretPhrase);

    console.log(decryptedBytes)

    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    const decryptedObject = JSON.parse(decryptedString);

    console.log(decryptedObject)

    const end = new Date().getTime()

    console.log('Decrypt time of card ' + (-(start - end)))

    return decryptedObject
}

//Функция, осуществляющая шифрование изображений

export const imageEncrypt = async (image, encrypted, results, secret, ipfs) => {

    return new Promise((resolve,reject) => {
        const reader = new FileReader();

        reader.onload = async function () {
            const start = new Date().getTime()
            const imageData = reader.result;
            const encryptedData = await CryptoJS.AES.encrypt(imageData, secret).toString();
            encrypted.push(encryptedData)
            console.log(encryptedData)
            const result = await ipfs.add(encryptedData);
            results.push(result.path)
            resolve([
                encrypted,
                results
            ])
            const end = new Date().getTime()
            console.log('Encrypt time of image ' + (-(start - end)))
        };
        console.log(image)
        reader.readAsDataURL(image);
    })
}

//Функция, осуществляющая дешифрование изображений

export const imageDecrypt = async (encryptedImage, secret) => {

    const start = new Date().getTime()

    const decryptedData = CryptoJS.AES.decrypt(encryptedImage, secret).toString(CryptoJS.enc.Utf8);

    const end = new Date().getTime()

    console.log('Decrypt time of image ' + (-(start - end)))

    return decryptedData



}