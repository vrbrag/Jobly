const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// companyUpdateSchema has no required fields
// This function, allows you to use the 'update' method in Class Company with varying data to update.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // return an ARRAY of req.body keys
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  // return setCols: array of sql UPDATE SET (at most)['"name"=$1, "description"=$2, "num_Employees"=$3, "logo_url"=$4']
  // values: array of req.body values (at most) ["Airbnb", "Home rentals", 1000, "airBnb"]
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
