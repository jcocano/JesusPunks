const deploy = async () => {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account::", deployer.address);

    const JesusPunks = await ethers.getContractFactory("JesusPunks");
    const deployed = await JesusPunks.deploy(256);

    console.log("Jesus Punks is deployed at:", deployed.address);
};

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    }) 