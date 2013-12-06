$(document).ajaxStart(function() {
    window.NProgress.start();
});
$(document).ajaxStop(function() {
    window.NProgress.done();
});
$(document).ajaxError(function() {
    window.alertify.error("Server error, try again or report it");
});
$(document).ajaxSuccess(function(event, xhr) {
    var json = JSON.parse(xhr.responseText);
    if (typeof(json.error) !== "undefined"){
        window.alertify.error("Error : " + json.error);
        document.location.href = '/';

    }
});