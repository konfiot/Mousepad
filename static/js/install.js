$(function(){
    var timezone = window.jstz.determine();
    $("#timezone > optgroup > option[value='" + timezone.name() + "']").attr("selected", "selected");

    $("#form").submit(function(event){
        if($("#password").val() !== $("#password_confirm").val()){
            $("#password_confirm").parent().attr("class", "has-error");
            $("#password_confirm + span").html("<span class='help-block'>Passwords doesn't match</span>");
            event.preventDefault();
        }
    });
    $("#password").on("input", function(){
        $("#password + span").html("Even if we do our best to secure it, if someone gets access to your database, cracking this password would take " + window.zxcvbn($("#password").val(), ["mousepad", $("#username").val()]).crack_time_display);
    });
    $("#password_confirm").on("change", function(){
        if($("#password").val() !== $("#password_confirm").val()){
            $("#password_confirm").parent().attr("class", "form-group has-error");
            $("#password_confirm + .help-block").text("Passwords doesn't match");
        } else {
            $("#password_confirm").parent().attr("class", "form-group");
            $("#password_confirm + .help-block").text(" ");
        }
    });
    $("#password").on("input", function(){
        if($("#password").val() === $("#password_confirm").val()){
            $("#password_confirm").parent().attr("class", "form-group");
            $("#password_confirm + .help-block").text(" ");
            
        }
    });
    $("#password_confirm").on("input", function(){
        if($("#password").val() === $("#password_confirm").val()){
            $("#password_confirm").parent().attr("class", "form-group");
            $("#password_confirm + .help-block").text(" ");
            
        }
    });
});