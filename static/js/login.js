$("#form").submit(function(event) {
    $.post('../../app/api/login.php', $('#form').serialize(), function(data) {
        if (typeof data['error'] === 'undefined') {
            document.location.href = '../../';
        }
    }, 'json')
    event.preventDefault();
});