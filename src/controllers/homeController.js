
const home = (req, res) => {
    res.render("admin/home", { title: "Home" });
}

module.exports = {
    home: home
};
