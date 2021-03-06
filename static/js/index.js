/*
Sweet Alert v1 Docs - https://sweetalert.js.org/guides/ 
*/

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
function getClipboard(show_popups = false, add_url = false) {
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
                    URL_TEXT = text
                    if (add_url == true) {
                        processVideoURLSandAdd(text_ = URL_TEXT, show_popups = true)
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
    text = getClipboard(show_popups = true, add_url = true)
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
            processVideoURLSandAdd(text_ = URL_TEXT, show_popups = false)
        }
    }
}


// keep running auto import urls in background
var autoImportURLs = setInterval(
    autoImportURLsFunc,
    5000
)


// add video to ui
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
            if (data['site'] == 'youtube') {
                $("div#vli-videos").append(`
                <div class="video-con" video="${data['url']}" id="main${data['url']}">
                    <div class="index title">${ADDED_LIST.length + 1}</div>
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
                            &nbsp;|&nbsp;
                            <a class="channel" 
                                onclick="viewMoreDetailsOnVideo(this);"
                                id="child${data['url']}" 
                                byid="${data['by']['id']}"
                                byimage="${data['by']['image']}"
                                byname="${data['by']['name']}"
                                count="${data['count']}"
                                description="${data['description']}"
                                duration="${data['duration_human']}"
                                id="${data['id']}"
                                published="${data['published']}"
                                site="${data['site']}"
                                thumbnail="${data['thumbnail']}"
                                title="${data['title'].replace(/"/g, "'")}"
                                views="${data['views']}"
                                >
                                    View More
                            </a>
                            &nbsp;|&nbsp;
                            <a class="channel" 
                                vlink="${data['url']}" 
                                vtitle="${data['title'].replace(/"/g, "'")}"
                                onclick="selectQualityAndDownload(this)"
                                >
                                    Download
                            </a>
                        </div>
                </div>
                `)
            }


        }
    )
}


// process video and add
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


// view additional video information
function viewMoreDetailsOnVideo(identifier) {

    const count = $(identifier).attr('count')
    const id = $(identifier).attr('id')
    const title = $(identifier).attr('title')
    const thumbnail = $(identifier).attr('thumbnail')

    const site = $(identifier).attr('site')

    if (site == 'youtube') {
        const byid = $(identifier).attr('byid')
        const byname = $(identifier).attr('byname')
        const byimage = $(identifier).attr('byimage')
        const description = $(identifier).attr('description')
        const duration = $(identifier).attr('duration')
        const published = $(identifier).attr('published')
        const views = $(identifier).attr('views')
        swal(
            {
                title: `${count} | ${title}`,
                text:
                    `Uploaded by: ${byname}
                    Duration: ${duration}
                    Uploaded on: ${published}
                    Views: ${views}

                    Description: 
                    ${description}`,
                icon: thumbnail,
            }
        );
    }



}

// quality select in popup and download
function selectQualityAndDownload(identifier) {
    const vlink = $(identifier).attr('vlink')
    const vtitle = $(identifier).attr('vtitle')

    swal(
        {
            title: "Select Download Quality",
            text: "1 - 240p\n2 - 360p\n3 - 480p\n4 - 720p\n5 - 1080p\n6 - 1440p\n7 - 2160p\nmp3",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "1, 2, 3, 4, 5, 6, 7"
        },
        function (inputValue) {
            inputValue = String(inputValue)

            const validInputs = ["1", "2", "3", "4", "5", "6", "7", "8"]
            const qualities = ["240p", "360p", "480p", "720p", "1080p", "1440p", "2160p", "music", "song", "mp3", "mp4", "audio"]
            const qualitiesP = ["240", "360", "480", "720", "1080", "1440", "2160"]

            if (inputValue === false)
                return false;
            // (validInputs.includes(inputValue) == false) || (qualities.includes(inputValue) == false) || (qualitiesP.includes(inputValue) == false)
            if (1 == 5) {
                swal.showInputError("Please enter a valid number!");
                return false;
            } else {
                let quality = ""
                // if number is entered - validInputs
                if (validInputs.includes(inputValue) == true) {
                    switch (inputValue) {
                        case "1":
                            quality = "240p"
                            break;
                        case "2":
                            quality = "360p"
                            break;
                        case "3":
                            quality = "480p"
                            break;
                        case "4":
                            quality = "720p"
                            break;
                        case "5":
                            quality = "1080p"
                            break;
                        case "6":
                            quality = "1440p"
                            break;
                        case "7":
                            quality = "2160p"
                            break;
                        default:
                            quality = "720p"
                            swal("Invalid input", "Defaulting to default quality: 720p", "info");
                    }
                } else if (qualities.includes(inputValue) == true) {
                    switch (inputValue) {
                        case "240p":
                            quality = "240p"
                            break;
                        case "360p":
                            quality = "360p"
                            break;
                        case "480p":
                            quality = "480p"
                            break;
                        case "720p":
                            quality = "720p"
                            break;
                        case "1080p":
                            quality = "1080p"
                            break;
                        case "1440p":
                            quality = "1440p"
                            break;
                        case "2160p":
                            quality = "2160p"
                            break;
                        case "mp4":
                            quality = "720p"
                            break;
                        case "music":
                            quality = "audio"
                            break;
                        case "song":
                            quality = "audio"
                            break;
                        case "mp3":
                            quality = "audio"
                            break;
                        case "audio":
                            quality = "audio"
                            break;
                        default:
                            quality = "720p"
                            swal("Invalid input", "Defaulting to default quality: 720p", "info");
                    }
                } else if ((qualitiesP).includes(inputValue) == true) {
                    switch (inputValue) {
                        case "240p":
                            quality = "240p"
                            break;
                        case "360p":
                            quality = "360p"
                            break;
                        case "480p":
                            quality = "480p"
                            break;
                        case "720p":
                            quality = "720p"
                            break;
                        case "1080p":
                            quality = "1080p"
                            break;
                        case "1440p":
                            quality = "1440p"
                            break;
                        case "2160p":
                            quality = "2160p"
                            break;
                        default:
                            quality = "720p"
                            swal("Invalid input", "Defaulting to default quality: 720p", "info");
                    }
                } else {
                    swal("Invalid input", "Defaulting to default quality: 720p", "info");
                    quality = "720p"
                }
                swal("Downloading!", "Downloading video with " + quality, "success");
                $(identifier).text('Downloading...')
                downloadVideoWithFinalQuality(url_ = vlink, quality_ = quality)
            }
        }
    );

    // send request to backend and start downloading the video
    // change the download text to downloading...
}

function downloadVideoWithFinalQuality(url_, quality_) {
    $.post(
        '/download',
        {
            "url": url_,
            "quality": quality_
        },
    )
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
