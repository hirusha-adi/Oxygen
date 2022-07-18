$(document).ready(function () {
    $('#navigationMenu .dropdown-toggle').dropdown({ popperConfig: { placement: 'bottom-start', modifiers: { computeStyle: { gpuAcceleration: false } } } });
    $(document).on('click', '.navigationMenu-navbar-collapse.show', function (e) {
        if ($(e.target).is('a') && ($(e.target).attr('class') != 'dropdown-toggle')) {
            $(this).collapse('hide');
        }
    });
    $('#ThemeableMenu1 .dropdown-toggle').dropdown({ popperConfig: { placement: 'bottom-start', modifiers: { computeStyle: { gpuAcceleration: false } } } });
    $(document).on('click', '.ThemeableMenu1-navbar-collapse.show', function (e) {
        if ($(e.target).is('a') && ($(e.target).attr('class') != 'dropdown-toggle')) {
            $(this).collapse('hide');
        }
    });
});