const cloudinary = require("cloudinary").v2;

const Employee = require("../models/Employee");

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
    const { file } = req.files;

    let url = "";

    if (file) {

        try {
            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            url = cloudinaryRespose.url;
        } catch (err) {
            throw new Error(err);
        }        

    }

    const newEmployee = {
        name: name,
        position: position,
        email: email,
        phone: phone,
        description: description,
        imgPath: url
    };

    const employee = new Employee(newEmployee);
    await employee.save();

    req.flash("success_message", "Datos agregados exitosamente");

    res.redirect("/admin/employees/add");
}

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    let employee = await Employee.findById(id);
    res.render("admin/employees/update", { title: "Update employee", data: employee });
}

const confirmUpdateEmployee = async (req, res) => {
    const { id, name, position, email, phone, description } = req.body;
    const { file } = req.files;
    let employee = await Employee.findById(id);

    if (file) {
        if (employee.imgPath != "") {
            const cloudinaryRespose = await cloudinary.uploader.upload(file[0].path, { secure: true });
            await cloudinary.uploader.destroy(employee.imgPath.split("/").pop().split(".")[0]);
            employee.imgPath = cloudinaryRespose.url;
        }
    }

    employee.name = name;
    employee.position = position;
    employee.email = email;
    employee.phone = phone;
    employee.description = description;

    await Employee.updateOne({ _id: id }, employee);

    req.flash("success_message", "Datos actualizados exitosamente");

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

    if (employee.imgPath != "")
        await cloudinary.uploader.destroy(employee.imgPath.split("/").pop().split(".")[0]);

    await Employee.deleteOne({ _id: id });

    req.flash("success_message", "Datos eliminados exitosamente");

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
