const path = require("path");
const fs = require("fs");

const Employee = require("../models/Employee");

const jsonFile = path.join(__dirname, "../db.json");

const readJsonFile = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
}

const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFile, JSON.stringify(data), "utf-8");
}

const getEmployees = async (req, res) => {

    const employeesList = await Employee.find();

    res.render("admin/employees/list", { title: "Employees list", data: employeesList });
}

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.render("admin/employees/details", { title: "Employee details", data: employee });
}

const addEmployee = (req, res) => {
    res.render("admin/employees/add", { title: "Add employee" });
}

const confirmAddEmployee = async (req, res) => {
    const { name, position, email, phone, description } = req.body;
    let filename = "";
    if (req.files)
        filename = req.files.file[0].filename
    const newEmployee = {
        name: name,
        position: position,
        email: email,
        phone: phone,
        description: description,
        imgPath: "/public/upload/img/" + filename
    };
    const employee = new Employee(newEmployee);
    await employee.save();

    res.redirect("/admin/employees");
}

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    let employee = await Employee.findById(id);
    res.render("admin/employees/update", { title: "Update employee", data: employee });
}

const confirmUpdateEmployee = async (req, res) => {
    const { id, name, position, email, phone, description } = req.body;
    let employee = await Employee.findById(id);

    if (req.files) {
        fs.unlinkSync(path.join(__dirname, "..", employee.imgPath));
        employee.imgPath = "/public/upload/img/" + req.files.file[0].filename;
    }

    employee.name = name;
    employee.position = position;
    employee.email = email;
    employee.phone = phone;
    employee.description = description;

    await Employee.updateOne({ _id: id }, employee);

    res.redirect("/admin/employees");
}

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    let employee = await Employee.findById(id);
    res.render("admin/employees/delete", { title: "Delete employee", data: employee });
}

const confirmDeleteEmployee = async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    fs.unlinkSync(path.join(__dirname, "..", employee.imgPath));

    await Employee.deleteOne({ _id: id });
    res.redirect("/admin/employees");
}

module.exports = {
    getEmployees: getEmployees,
    getEmployeeById: getEmployeeById,
    addEmployee: addEmployee,
    confirmAddEmployee: confirmAddEmployee,
    updateEmployee: updateEmployee,
    confirmUpdateEmployee: confirmUpdateEmployee,
    deleteEmployee: deleteEmployee,
    confirmDeleteEmployee: confirmDeleteEmployee
};
