const contactButtons = document.querySelectorAll('.btn-contact');
contactButtons.forEach(b => {
    b.addEventListener("click", function () {
        let email = this.getAttribute("data-contact-to");
        document.querySelector("#email-to").value = email;
    });
});
