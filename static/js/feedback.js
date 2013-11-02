$(document).ajaxStart(function() {
    NProgress.start();
});
$(document).ajaxStop(function() {
    NProgress.done();
});
$(document).ajaxError(function() {
    alertify.error("Server error, try again or report it");
});
$(document).ajaxSuccess(function(event, xhr) {
    var json = JSON.parse(xhr.responseText);
    if (typeof(json["error"]) !== "undefined"){
        alertify.error("Error : " + json["error"]);
        document.location.href = '/';

    }
});