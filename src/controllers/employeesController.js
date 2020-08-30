const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const jsonFile = path.join(__dirname, "../db.json");

const readJsonFile = () => {
    return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
}

const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFile, JSON.stringify(data), "utf-8");
}

const getEmployees = (req, res) => {
    const employeesList = readJsonFile().employees;
    res.render("admin/employees/list", { title: "Employees list", data: employeesList });
}

const getEmployeeById = (req, res) => {
    const employeesList = readJsonFile().employees;
    const { id } = req.params;
    let employee = null;
    employeesList.forEach(e => e.id == id ? employee = e : null);
    res.render("admin/employees/details", { title: "Employee details", data: employee });
}

const addEmployee = (req, res) => {
    res.render("admin/employees/add", { title: "Add employee" });
}

const confirmAddEmployee = (req, res) => {
    const json = readJsonFile();
    const { name, position, email, phone, description } = req.body;
    let filename = "";
    if (req.files)
        filename = req.files.file[0].filename
    const newEmployee = {
        id: uuid(),
        name: name,
        position: position,
        email: email,
        phone: phone,
        description: description,
        imgPath: "/public/upload/img/" + filename
    };
    json.employees.push(newEmployee);
    writeJsonFile(json);
    res.redirect("/admin/employees");
}

const updateEmployee = (req, res) => {
    const employeesList = readJsonFile().employees;
    const { id } = req.params;
    let employee = null;
    employeesList.forEach(e => e.id == id ? employee = e : null);
    res.render("admin/employees/update", { title: "Update employee", data: employee });
}

const confirmUpdateEmployee = (req, res) => {
    const json = readJsonFile();
    const { id, name, position, email, phone, description } = req.body;
    let employee = null;
    json.employees.forEach(e => e.id == id ? employee = e : null);
    if (req.file) {
        fs.unlinkSync(path.join(__dirname, "..", employee.imgPath));
        employee.imgPath = "/public/upload/img/" + req.files.file[0].filename;
    }
    employee.name = name;
    employee.position = position;
    employee.email = email;
    employee.phone = phone;
    employee.description = description;
    writeJsonFile(json);
    res.redirect("/admin/employees");
}

const deleteEmployee = (req, res) => {
    const employeesList = readJsonFile().employees;
    const { id } = req.params;
    let employee = null;
    employeesList.forEach(e => e.id == id ? employee = e : null);
    res.render("admin/employees/delete", { title: "Delete employee", data: employee });
}

const confirmDeleteEmployee = (req, res) => {
    const json = readJsonFile();
    const { id } = req.params;
    const employees = [];
    json.employees.forEach(e => {
        if (e.id != id)
            employees.push(e);
        else
            fs.unlinkSync(path.join(__dirname, "..", e.imgPath));
    });
    json.employees = employees;
    writeJsonFile(json);
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
