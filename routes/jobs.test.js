"use strict";

const request = require("supertest");

const app = require("../app");

const {
   commonBeforeAll,
   commonBeforeEach,
   commonAfterEach,
   commonAfterAll,
   u1Token,
   adminToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */
describe("POST /jobs", function () {
   test("ok for admin", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send({
            title: "New Job",
            salary: 40,
            equity: "0.4",
            companyHandle: "c1"
         })
         .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
         job: {
            id: expect.any(Number),
            title: "New Job",
            salary: 40,
            equity: "0.4",
            companyHandle: "c1"
         },
      });
   });

   test("Unauthorized for non-admin", async () => {
      const resp = await request(app)
         .post('/jobs')
         .send({
            title: "New Job",
            salary: 40,
            equity: "0.4",
            companyHandle: "c1"
         })
         .set("authorization", `Bearer ${u1Token}`)
      expect(resp.statusCode).toEqual(401)
   })

   test("bad request with missing data", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send({
            companyhandle: "c1"
         })
         .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
   });

   test("bad request with invalid data", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send({
            title: "New Job",
            salary: "NaN",
            equity: "0.4",
            companyHandle: "c1"
         })
         .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
   });
});
