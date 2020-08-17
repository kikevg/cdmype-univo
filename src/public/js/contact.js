
const submitButton = document.querySelector("#submit");
const modal = document.getElementById("modal-contact");

submitButton.addEventListener("click", function (e) {

    let contactTo = "cdmypeunivo@gmail.com";

    if (document.querySelector("#contact-to") != undefined) {
        contactTo = document.querySelector("#contact-to").value
    }

    let data = {
        contactTo: contactTo,
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        subject: document.querySelector("#subject").value,
        message: document.querySelector("#message").value,
    };

    // $.ajax({
    //     url: 'php/contact.php',
    //     dataType: 'json',
    //     data: data,
    //     success: function (res) {
    //         console.log(res);
    //     },
    //     error: function (err) {
    //         console.error(err);
    //     }
    // });

    $('#modal-contact').modal("hide")
    swal({
        title: 'Success',
        text: "Email success sended",
        icon: "success"
    });
    e.preventDefault();
});
