const main = async () => {
    const Control = await hre.ethers.getContractFactory("Control");
    const control = await Control.deploy('MED3');

    await control.deployed();

    console.log(
        `Transactions deployed to: ${control.address}`
    );
}

const runMain = async () => {
    try{
        await main();
        process.exit(0)
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}

runMain();