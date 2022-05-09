const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("demo", function () {
    let owner, another_addr, demo;

    beforeEach(async () => {
        [owner, another_addr] = await ethers.getSigners();
        const DemoContract = await ethers.getContractFactory("Storage", owner);
        demo = await DemoContract.deploy();
        await demo.deployed();
    });

    const sendMoney = async (sender) => {
        const amount = 100;
        const transactionData = {
            to: demo.address,
            value: amount,
        };

        // выполняем транзакцию
        const transaction = await sender.sendTransaction(transactionData);
        await transaction.wait();

        return [transaction, amount];
    };

    it("should allow to send money", async () => {
        const [transaction, amount] = await sendMoney(another_addr);

        await expect(() => transaction).to.changeEtherBalance(demo, amount);

        const timestamp = (await ethers.provider.getBlock(transaction.blockNumber)).timestamp;

        console.log(await ethers.provider.getBlock(0));
        console.log(await ethers.provider.getBlock(1));
        console.log(await ethers.provider.getBlock(2));
        console.log(await ethers.provider.getBlock(3));

        // тестируем порождение событий
        await expect(transaction)
            .to.emit(demo, "Paid")
            .withArgs(another_addr.address, amount, timestamp);
    });

    it("shound allow owner to withdraw funds", async function () {
        const [_, amount] = await sendMoney(another_addr);

        const tx = await demo.withdrawMoney(owner.address);

        await expect(() => tx).to.changeEtherBalances([demo, owner], [-amount, amount]);
    });

    it("shound not allow other accounts to withdraw funds", async function () {
        await sendMoney(another_addr);

        await expect(
            demo.connect(another_addr).withdrawMoney(another_addr.address)
        ).to.be.revertedWith("you are not an owner");
    });
});
