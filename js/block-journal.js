document.getElementById('submitBtn').addEventListener("click", function() {
    console.log("hiii submit butn pressed from blocked-journal.js");
    window.location.href=getBeforeLocation();
})


/**
 * Back to URL
 */
function getBeforeLocation() {
    return location.search != '' ? decodeURIComponent(location.search.replace('?url=', '')) : false;
}

