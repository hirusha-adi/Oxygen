var URL_TEXT = false;

var CLIPBOARD_URL_TEXT = false;
var CLIPBOARD_URL_TEXT_last = false;

var autoImportingStatus = false;

var ADDED_LIST = []


// put input to main variable
// set value to URL_TEXT
function inputVideoURLs() {
    $.post(
        '/log/debug',
        { "message": "Asking for URL" }
    )
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
                $.post(
                    '/log/error',
                    { "message": "User has NOT entered anything!" }
                )
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
                $.post(
                    '/log/debug',
                    { "message": "User has entered " + urlCount.length + correct_tense }
                )
                swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
                processVideoURLSandAdd(text_ = URL_TEXT, show_popups = true);
            } else {
                $.post(
                    '/log/error',
                    { "message": "User has not enetered a URL" }
                )
                swal("an Error has occured", "Invalid URLs. All URLs must start with 'http' at front", "error");
            }
        }
    );
}



// return value of clipboard
// does NOT set to any var, just returns
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
                    $.post(
                        '/log/debug',
                        { "message": "You entered " + urlCount.length + correct_tense }
                    )
                    if (show_popups == true) {
                        swal("Video URLs", "You entered " + urlCount.length + correct_tense, "success");
                    }
                    return text;
                } else {
                    $.post(
                        '/log/error',
                        { "message": "Invalid URLs. All URLs must start with 'http' at front" }
                    )
                    if (show_popups == true) {
                        swal("an Error has occured", "Invalid URLs. All URLs must start with 'http' at front", "error");
                    }
                }
            })
            .catch(err => {
                if (show_popups == true) {
                    $.post(
                        '/log/error',
                        { "message": err }
                    )
                    swal("an Error has occured", err, "error");
                }
                return false;
            });
    } catch (e) {
        if (e instanceof TypeError) {
            if (show_popups == true) {
                $.post(
                    '/log/error',
                    { "message": "Clipboard Access Blocked: " + e }
                )
                swal("Clipboard Access Blocked", e, "error");
            }
        }
        return false;
    }
}


// put clipboard value to main variable
// if the output is correct
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
        CLIPBOARD_URL_TEXT = getClipboard(show_popups = false)

        if (CLIPBOARD_URL_TEXT_last == false) {
            CLIPBOARD_URL_TEXT_last = CLIPBOARD_URL_TEXT
        } else if (CLIPBOARD_URL_TEXT == undefined) {
            // ERROR GETTING CLIPBOARD CONTENT PROPERLY
            // console.log('old ' + CLIPBOARD_URL_TEXT_last + ' new ' + CLIPBOARD_URL_TEXT_last)
        } else {
            CLIPBOARD_URL_TEXT_last = CLIPBOARD_URL_TEXT
            $.post(
                '/log/debug',
                { "message": "New Clipboard Content" + CLIPBOARD_URL_TEXT }
            )
            processVideoURLSandAdd(CLIPBOARD_URL_TEXT)
        }
    }
}


// keep running auto import urls in background
var autoImportURLs = setInterval(
    autoImportURLsFunc,
    5000
)

function addUrl(_url) {
    $.post(
        '/log/debug',
        { "message": "Adding video: " + _url }
    )
    $.post(
        '/add/url',
        { "url": _url },
        function (data) {
            console.log(data)
            $("div#vli-videos").append(`
                <div class="video-con" video="${data['url']}">
                    <div class="index title">${data['count']}</div>
                    <div class="thumb">
                        <img src="${data['thumbnail']}" alt="">
                    </div>
                    <div class="v-titles">
                        <div class="title"> ${data['title']}</div>
                        <div class="sub-title">
                            <a href="https://www.youtube.com/channel/${data['by']['id']}" class="channel"
                                target="_blank">
                                    ${data['by']['name']}
                            </a>
                        </div>
                    </div>
                </div>
                `)
        }
    )
}

function processVideoURLSandAdd(text_ = "", show_popups = false) {
    var final_to_add = []
    var __text = ""
    if (text_ == "") {
        if (URL_TEXT == false) {
            if (show_popups == true) {
                swal("an Error has occured", "No input has been provided yet.", "error");
            }
        } else {
            __text = String(URL_TEXT)
        }
    } else {
        __text = String(text_)
    }
    __textSplitted = __text.split(/\r?\n/)
    for (i in __textSplitted) {
        if (__textSplitted[i].startsWith('http')) {
            if (ADDED_LIST.includes(__textSplitted[i]) == true) {
                if (__textSplitted.length == 1) { // Already added warning only if 1 URL
                    if (show_popups == true) {
                        swal("an Error has occured", "The URL you provided has already been added", "error");
                    }
                }
            } else {
                ADDED_LIST.push(__textSplitted[i])
                if (final_to_add.includes(__textSplitted[i]) == false) {
                    final_to_add.push(__textSplitted[i])
                }
            }
        } else {
            if (__textSplitted.length == 1) { // no proper url warning
                if (show_popups == true) {
                    swal("an Error has occured", "The URL you provided is not valid", "error");
                }
            }
        }
    }

    for (i in final_to_add) {
        addUrl(final_to_add[i])
    }

    final_to_add = []
}

// main jquery code
$(document).ready(function () {

    // enter link
    $(document).on("click", "a#addNewVideoButton, a#addNewVideoDropdown",
        function () {
            inputVideoURLs();

            // Why the F doesn't thing work? - it works when inside `inputVideoURLs()`
            // processVideoURLSandAdd(text_ = URL_TEXT, show_popups = true);
            // addUrl('')
        }
    )

    // paste link
    $(document).on("click", "a#pasteVideoLinkButton, a#pasteVideoLinkDropdown",
        function () {
            pasteURLs();
            console.log(URL_TEXT);
            // processVideoURLSandAdd(text_ = URL_TEXT, show_popups = true);
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
