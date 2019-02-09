document.getElementById('submitBtn').addEventListener("click", function() {
    console.log("hiii submit butn pressed from blocked-journal.js");

    //save the text the user added

    //continue to original destination
    //https://github.com/tetsuwo/website-blocker-chrome.ext
    window.location.href=getBeforeLocation();
})

document.getElementById('skipBtn').addEventListener("click", function() {
    console.log("hiii skip butn pressed from blocked-journal.js");

    //continue to original destination without saving
    //https://github.com/tetsuwo/website-blocker-chrome.ext
    window.location.href=getBeforeLocation();
})


/**
 * Back to URL
 * source: https://github.com/tetsuwo/website-blocker-chrome.ext
 */
function getBeforeLocation() {
    return location.search != '' ? decodeURIComponent(location.search.replace('?url=', '')) : chrome.extension.getURL('404.html');
}

