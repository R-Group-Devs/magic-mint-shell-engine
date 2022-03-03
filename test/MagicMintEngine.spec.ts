import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  MockCollection,
  MockCollection__factory,
  MockFactory,
  MockFactory__factory,
  MagicMintEngine,
} from "../typechain";

describe("MagicMintEngine", function () {
  // ---
  // fixtures
  // ---

  let MockFactory: MockFactory__factory;
  let MockCollection: MockCollection__factory;
  let accounts: SignerWithAddress[];
  let factory: MockFactory;
  let erc721: MockCollection;
  let testEngine: MagicMintEngine;
  let a0: string, a1: string, a2: string, a3: string;

  beforeEach(async () => {
    MockFactory = await ethers.getContractFactory("MockFactory");
    MockCollection = await ethers.getContractFactory("MockCollection");
    const MagicMintEngine = await ethers.getContractFactory("MagicMintEngine");
    [factory, erc721, testEngine, accounts] = await Promise.all([
      MockFactory.deploy(),
      MockCollection.deploy(),
      MagicMintEngine.deploy(),
      ethers.getSigners(),
    ]);
    [a0, a1, a2, a3] = accounts.map((a) => a.address);
    await factory.registerImplementation("erc721", erc721.address);
  });

  const createCollection = async (
    name = "Test",
    symbol = "TEST",
    engine = testEngine.address,
    owner = a0
  ): Promise<MockCollection> => {
    const trx = await factory.createCollection(
      name,
      symbol,
      "erc721",
      engine,
      owner
    );
    const mined = await trx.wait();
    const address = mined.events?.[1].args?.collection;
    const collection = MockCollection.attach(address);
    return collection;
  };

  describe("core functionality", () => {
    it("should return correct name", async () => {
      const resp = await testEngine.name();
      expect(resp).to.eq("magic-mint-v1");
    });
    it("should mint with ipfsHash", async () => {
      const collection = await createCollection();
      await testEngine.mint(collection.address, a2, "Qhash1");
      await testEngine.mint(collection.address, a3, "Qhash2");
      const uri1 = await collection.tokenURI("1");
      const uri2 = await collection.tokenURI("2");
      expect(uri1).to.equal("ipfs://ipfs/Qhash1");
      expect(uri2).to.equal("ipfs://ipfs/Qhash2");
    });
    it("should not allow minting with an invalid signature", async () => {
      // TODO
    });
  });
});
