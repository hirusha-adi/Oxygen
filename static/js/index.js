function promalert() {
    swal({
        title: "Require Email!",
        text: "Enter your email address:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Your Email address"
    },

        function (inputValue) {
            if (inputValue === false)
                return false;
            if (inputValue === "") {
                swal.showInputError("Please enter email!");
                return false
            }
            swal("Action Saved!", "You entered following email: " + inputValue, "success");
        });
}

$(document).ready(function () {

    $(document).on("click", "button#testing123",
        function () {
            promalert();
        }
    )

})