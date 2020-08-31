const { Schema, model } = require("mongoose");

const employeeSchema = new Schema({
    name: String,
    position: String,
    email: String,
    phone: String,
    description: String,
    imgPath: String
});

const Employee = model("employee", employeeSchema);

module.exports = Employee;
