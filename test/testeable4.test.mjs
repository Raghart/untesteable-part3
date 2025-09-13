import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { PasswordServiceFixed, PostgresUserFixed } from "../src/testable4.mjs";
import argon2 from "@node-rs/argon2";

describe("testable4: enterprise application", () => {
    let testUser = { userId: 123, passwordHash: "hash123" };
    let service;

    beforeEach(async () => {
        service = new PostgresUserFixed;
        await service.save(testUser);
    });

    afterEach(() => {
        service.clearTable();
        service.close();
    });

    test("it inserts in the database the password hash", async () => {
        const userDB = await service.getByID(123);
        expect(userDB).to.deep.equal(testUser);
    });

    test("it updates the password hash if there is already a user with the same id", async () => {
        const newUserPassword = { userId: 123, passwordHash: "hash456" };
        await service.save(newUserPassword);

        const modifiedUser = await service.getByID(123);
        expect(modifiedUser).to.deep.equal(newUserPassword);
    });

    test("it returns null if trying to get an id that doesn't exist in the database", async () => {
        const nullUser = await service.getByID(999999);
        expect(nullUser).to.be.null;
    });
});

describe("the passwordServiceFixed change the password of a user", () => {
    let dao;
    let passwordService;
    const TEST_USER = { userId: 123, passwordHash: argon2.hashSync("hash123") };

    beforeEach(async () => {
        dao = new PostgresUserFixed();
        passwordService = new PasswordServiceFixed(dao);
        await dao.save(TEST_USER);
    });

    afterEach(async () => {
        await dao.clearTable();
        await dao.close();
    });
    
    test("the passwordService change the password of the user for a new one", async () => {
        await passwordService.changeUserPassword(TEST_USER.userId,"hash123","hash321");
        const newUserPassword = await dao.getByID(TEST_USER.userId);
        expect(await argon2.verify(newUserPassword.passwordHash,"hash321")).be.true;
    });

    test("the passwordService throws an error if the password doesn't match", async () => {
        await expect(passwordService.changeUserPassword(TEST_USER.userId,"wrongPassword","hash321")).rejects.
        toThrow("wrong old password");
    });

    test("the passwordService throws an error when the userId wasn't found in the database", async () => {
        const inexistantID = 99999; 
        await expect(passwordService.changeUserPassword(inexistantID,"oldPassword","newPassword")).rejects.
        toThrow(`The user with the id: ${inexistantID} wasn't found.`)
    });
});