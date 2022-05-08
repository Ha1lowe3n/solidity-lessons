const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", () => {
    let acc1, acc2, payments;

    beforeEach(async () => {
        // получаем аккаунты для транзакций, вего их 20
        [acc1, acc2] = await ethers.getSigners();

        // настройка смарт-контракта
        const Payments = await ethers.getContractFactory("Payments", acc1);

        // деплой смарт-контракта, отправка транзакции
        payments = await Payments.deploy();

        // ожидание завершения транзакции
        await payments.deployed();

        console.log(payments.address);
    });

    it("should be deployed", () => {
        expect(payments.address).to.be.properAddress;
    });

    it("should be 0 ether by default", async () => {
        const balance = await payments.getCurrentBalance();
        expect(balance).to.eq(0);
    });

    it("should be possible to send money", async () => {
        const msg = "hello from hardhat";
        const sum = 100;
        const transaction = await payments.connect(acc2).pay(msg, { value: sum });

        await expect(() => transaction).to.changeEtherBalances([acc2, payments], [-sum, sum]);
        await transaction.wait();

        // const balance = await payments.getCurrentBalance();
        // expect(balance).to.eq(sum);

        const newPayment = await payments.getPayment(acc2.address, 0);
        console.log(newPayment);
        expect(newPayment.message).to.eq(msg);
        expect(newPayment.amount).to.eq(sum);
        expect(newPayment.from).to.eq(acc2.address);
    });
});
