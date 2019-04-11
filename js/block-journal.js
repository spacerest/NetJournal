//document.getElementById('submitBtn').addEventListener("click", function() {
//    console.log("hiii submit butn pressed from blocked-journal.js");

    //save the text the user added
//    download("hello", "filename.txt", 'text/plain');

//    //continue to original destination
//    //https://github.com/tetsuwo/website-blocker-chrome.ext
//    window.location.href=getBeforeLocation();
//})

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

/**
 * Download journal entry
 *
 * Function to download data to a file
 */ https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


