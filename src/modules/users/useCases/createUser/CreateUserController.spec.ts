jest.useRealTimers();

import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create a new User", () => {

  beforeAll(async () => {

    connection = await createConnection();

    await connection
      .query(`CREATE TABLE users
    (id INTEGER PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     password VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT now() NOT NULL,
     updated_at TIMESTAMP)`);
  });

  afterAll(async () => {

    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able create a new User", async () => {

    const requireResponse = await request(app)
      .post("/api/v1/users")
      .send({ name: "admin", email: "admin@gmail.com", password: "mabel_2022" });

    const requireResponseStatus = requireResponse.status;

    expect(requireResponseStatus)
      .toBe(201);
  });
});