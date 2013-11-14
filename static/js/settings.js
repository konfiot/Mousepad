$(function(){
    $.post("../../../app/api/list.php", function(data){
            list = data;
            refresh_shortcuts();
    }, "json");
    var timezone = jstz.determine();
    $("#timezone > optgroup > option[value='" + timezone.name() + "']").attr("selected", "selected");
    $.post("../../../app/api/get_conf.php", function(data){
        for (var i in data){
            $("#" + i).val(data[i]);
        }
    }, "json");

    $("form").submit(function(event){
        event.preventDefault();
        var array = {};
        $($(this).find(":input:not(button)")).each(function(){
            array[$(this).attr("name")] = $(this).val();
        });
        if($("#password").val() !== $("#password_confirm").val()){
            $("#password_confirm").parent().attr("class", "has-error");
            $("#password_confirm + span").text("Passwords doesn't match");
        } else {
            $.post("../../../app/api/set_conf.php", {data : JSON.stringify(array)}, function(data){
            }, "json");

        }
    });
    
    $("#password").on("input", function(){
        $("#password + span").html("Even if we do our best to secure it, if someone gets access to your database, cracking this password would take " + zxcvbn($("#password").val(), ["mousepad", $("#username").val()]).crack_time_display);
    });
});