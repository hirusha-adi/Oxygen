function promalert() {
    swal({
        title: "Add New Videos",
        text: "Enter video URLs in seperate lines",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "URLs..."
    },

        function (inputValue) {
            if (inputValue === false)
                return false;
            if (inputValue === "") {
                swal.showInputError("Please enter a URL");
                return false;
            }
            urlCount = inputValue.split(/\r?\n/);

            if (urlCount.length == 1) {
                correct_tense = " URL"
            } else {
                correct_tense = " URLs"
            }
            swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
        });
}

$(document).ready(function () {

    // enter link
    $(document).on("click", "a#addNewVideoButton, a#addNewVideoDropdown",
        function () {
            promalert();
        }
    )

    // paste link
    $(document).on("click", "",
        function () {
            return true;
        }
    )

})