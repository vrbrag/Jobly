"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
   commonBeforeAll,
   commonBeforeEach,
   commonAfterEach,
   commonAfterAll,
   testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function () {
   let newJob = {
      companyHandle: "c1",
      title: "Test",
      salary: 100,
      equity: "0.1",
   };

   test("works", async function () {
      let job = await Job.create(newJob);
      expect(job).toEqual({
         ...newJob,
         id: expect.any(Number),
      });
   });
});

/************************************** findAll */

describe("findAll", function () {
   test("works: no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
         {
            id: testJobIds[0],
            title: "Job1",
            salary: 100,
            equity: "0.1",
            companyHandle: "c1",
            companyName: "C1",
         },
         {
            id: testJobIds[1],
            title: "Job2",
            salary: 200,
            equity: "0.2",
            companyHandle: "c1",
            companyName: "C1",
         },
         {
            id: testJobIds[2],
            title: "Job3",
            salary: 300,
            equity: "0",
            companyHandle: "c1",
            companyName: "C1",
         },
         {
            id: testJobIds[3],
            title: "Job4",
            salary: null,
            equity: null,
            companyHandle: "c1",
            companyName: "C1",
         },
      ]);
   })
})