var URL_TEXT = false;
var URL_TEXT_last = false;

var CLIPBOARD_URL_TEXT = false;
var CLIPBOARD_URL_TEXT_last = false;

var autoImportingStatus = false;

var ADDED_LIST = []

// put input to main variable
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
            if (inputValue.startsWith("http") == true) {
                URL_TEXT = inputValue
                urlCount = inputValue.split(/\r?\n/);
                if (urlCount.length == 1) {
                    correct_tense = " URL"
                } else {
                    correct_tense = " URLs"
                }
                swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
            } else {
                swal("an Error has occured", "Invalid URLs. All URLs must start with 'http' at front", "error");
            }
        }
    );
}



// return value of clipboard
function getClipboard(show_popups = false) {
    try {
        navigator.clipboard.readText()
            .then(text => {
                text = String(text)
                urlCount = text.split(/\r?\n/);
                if (urlCount.length == 1) {
                    correct_tense = " URL"
                } else {
                    correct_tense = " URLs"
                }

                if (text.startsWith('http') == true) {
                    if (show_popups == true) {
                        swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
                    }
                    console.log(text)
                    return text;
                } else {
                    swal("an Error has occured", "Invalid URLs. All URLs must start with 'http' at front", "error");
                    console.log(text)
                }
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


// put clipboard value to main variable
function pasteURLs() {
    text = getClipboard(show_popups = true)
    if (URL_TEXT != false) {
        URL_TEXT = text;
    }
    return text
}

// monitor the clipboard for changes and if a url, add it
function autoImportURLsFunc() {
    if (autoImportingStatus == true) {
        console.log('Auto On')
        CLIPBOARD_URL_TEXT = getClipboard(show_popups = false)
        if (CLIPBOARD_URL_TEXT_last == false) {
            CLIPBOARD_URL_TEXT_last = CLIPBOARD_URL_TEXT
        } else if (CLIPBOARD_URL_TEXT == CLIPBOARD_URL_TEXT_last) {
            return false
        } else {
            CLIPBOARD_URL_TEXT_last = CLIPBOARD_URL_TEXT
            if (CLIPBOARD_URL_TEXT.startsWith("http") == true) {
                // ADD VIDEO
            } else {
                return false
            }
        }
    } else {
        return false
    }
}

// keep running auto import urls in background
var autoImportURLs = setInterval(
    autoImportURLsFunc,
    3000
)

function processVideoURLSandAdd(text_ = "") {
    if (text_ == "") {
        // use text_
    } else {
        if (URL_TEXT == false) {
            // no input given yet
        } else {
            // try to split for multiple urls by new lines
            // for each each url
            //      if url not in already added list
            //          add url to added list
            //          add url to temp list to add at the end of this function
        }
    }

    // for each url in temp list
    //      add URL to download list

    return 0;
}

// main jquery code
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

    // auto paste link
    $(document).on("click", "a#autoImportURLsButton, a#autoImportURLsDropdown",
        function () {
            if (autoImportingStatus === true) {
                $("a#autoImportURLsDropdown").text("Start auto-importing URLs from Clipboard")
                autoImportingStatus = false;
            } else {
                $("a#autoImportURLsDropdown").text("Stop auto-importing URLs from Clipboard")
                autoImportingStatus = true;
            }
        }
    )

})
