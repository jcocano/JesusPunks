const { expect } = require("chai");

describe('Jesus Punks Contract', () => {

    const setup = async ({ maxSupply = 10000}) => {
        const [owner] = await ethers.getSigners();
        const JesusPunks = await ethers.getContractFactory("JesusPunks");
        
        const deployed = await JesusPunks.deploy(maxSupply);

        return {
            owner,
            deployed,
        }
    }
    describe('Deployment', () => {
        it('Sets max Supply to passed param', async () => {
            const maxSupply = 4000;

            const { deployed } = await setup({ maxSupply });

            const returnedMaxSupply = await deployed.maxSupply();
            expect(maxSupply).to.equal(returnedMaxSupply)
        })
    })

    describe('Minting', () => {
        it('Minting a new token and assigns it owner', async () =>{
            const { owner, deployed } = await setup({});

            await deployed.mint();

            const ownerOfMinted = await deployed.ownerOf(0);

            expect(ownerOfMinted).to.equal(owner.address);
        });

        it('has a minting limit', async () => {
            const maxSupply = 3

            const { deployed } = await setup({ maxSupply });

            await Promise.all([deployed.mint(), deployed.mint(), deployed.mint()]);

            await expect(deployed.mint()).to.be.revertedWith("Jesus Punks are no longer available");

        });


    });

    describe("tokenURI", () => {
        it("returns valid metadata", async () => {
          const { deployed } = await setup({});
  
          await deployed.mint();
  
          const tokenURI = await deployed.tokenURI(0);
          const stringifiedTokenURI = await tokenURI.toString();
          const [, base64JSON] = stringifiedTokenURI.split(
            "data:application/json;base64,"
          );
          const stringifiedMetadata = await Buffer.from(
            base64JSON,
            "base64"
          ).toString("ascii");
  
          const metadata = JSON.parse(stringifiedMetadata);
  
          expect(metadata).to.have.all.keys("name", "description", "image");
        });
    });
});