"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
// const { ensureLoggedIn } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
// const jobUpdateSchema = require("../schemas/jobUpdate.json");
// const jobSearchSchema = require("../schemas/jobSearch.json");
const { ensureAdmin } = require("../middleware/auth");

const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { title, salary, equity, companyHandle }
 *
 * Authorization required: login
 */

router.post("/", ensureAdmin, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
         const errs = validator.errors.map(e => e.stack);
         throw new BadRequestError(errs);
      }

      const job = await Job.create(req.body);
      return res.status(201).json({ job });
   } catch (err) {
      return next(err);
   }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
   const q = req.query
   // convert query string to ints
   // if (q.minEmployees !== undefined) q.minEmployees = +q.minEmployees
   // if (q.maxEmployees !== undefined) q.maxEmployees = +q.maxEmployees

   try {
      const validator = jsonschema.validate(q, jobSearchSchema)
      if (!validator.valid) {
         const errs = validator.errors.map(e => e.stack)
         throw new BadRequestError(errs)
      }

      const jobs = await Job.findAll(q);
      return res.json({ jobs });
   } catch (err) {
      return next(err);
   }
});