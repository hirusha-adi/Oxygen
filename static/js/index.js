var URL_TEXT = false;

function inputVideoURLs() {
    swal(
        {
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
            URL_TEXT = inputValue
            urlCount = inputValue.split(/\r?\n/);
            if (urlCount.length == 1) {
                correct_tense = " URL"
            } else {
                correct_tense = " URLs"
            }
            swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
        }
    );

}

function getClipboard(show_popups = false) {
    try {
        navigator.clipboard.read()
            .then(text => {
                urlCount = text.split(/\r?\n/);
                if (urlCount.length == 1) {
                    correct_tense = " URL"
                } else {
                    correct_tense = " URLs"
                }
                if (show_popups == true) {
                    swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
                }
                return text;
            })
            .catch(err => {
                if (show_popups == true) {
                    swal("an Error has occured", err, "error");
                }
                return false;
            });
    } catch (e) {
        if (e instanceof TypeError) {
            if (show_popups == true) {
                swal("Clipboard Access Blocked", e, "error");
            }
        }
        return false;
    }
}

function pasteURLs() {
    text = getClipboard(show_popups = true)
    if (URL_TEXT != false) {
        URL_TEXT = text;
    }
}

$(document).ready(function () {

    // enter link
    $(document).on("click", "a#addNewVideoButton, a#addNewVideoDropdown",
        function () {
            inputVideoURLs();
            console.log(URL_TEXT)
        }
    )

    // paste link
    $(document).on("click", "a#pasteVideoLinkButton, a#pasteVideoLinkDropdown",
        function () {
            pasteURLs();
            console.log(URL_TEXT);
        }
    )

})