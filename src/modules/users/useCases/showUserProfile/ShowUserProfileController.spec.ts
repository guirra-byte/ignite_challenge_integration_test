jest.useRealTimers();

import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Show user Profile...", () => {

  beforeAll(async () => {

    connection = await createConnection();

    const requirePassword: string = await hash("mabel_2022", 10);

    await connection
      .query(`CREATE TABLE users
    (id INTEGER PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     password VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT now() NOT NULL,
     updated_at TIMESTAMP)`);

    await connection
      .query(`INSERT INTO users(name, email, password) 
     VALUES('admin', 'admin@gmail.com', '${requirePassword}')`);

  });

  afterAll(async () => {

    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able Show User", async () => {

    const requireToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "admin@gmail.com", password: "mabel_2022" });

    const { token } = requireToken.body;

    expect(requireToken)
      .toHaveProperty("token");

    const requireUserProfile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(requireUserProfile)
      .toHaveProperty("name");
  });
});