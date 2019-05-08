$(function() {
    // Hide load overlay
    $('#loadOverlay').css('display','none');

    // Password generator
    var lowerString = 'abcdefghjkmnpqrstuvwxyz';
    var upperString = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    var specialString = ',;:!?.$/*-+&@_+;./*&?$-!,';
    var numberString = '234567892345678923456789';
    var lowerLength = 4;
    var upperLength = 4;
    var specialLength = 4;
    var numberLength = 4;

    function UpdatePasswordButton() {
        var passwordLength = lowerLength + upperLength + specialLength + numberLength;
        $('#generate-password').html('Générer un mot de passe de ' + passwordLength +' charactères');
    }

    function GeneratePassword() {
        if ( lowerLength == 0 && upperLength == 0 && specialLength == 0 && numberLength == 0 ) {
            return '*facepalm*';
        }
        var password = '';
        for (var i = lowerLength; i > 0; --i) password += lowerString[Math.floor(Math.random() * lowerString.length)];
        for (var i = upperLength; i > 0; --i) password += upperString[Math.floor(Math.random() * upperString.length)];
        for (var i = specialLength; i > 0; --i) password += specialString[Math.floor(Math.random() * specialString.length)];
        for (var i = numberLength; i > 0; --i) password += numberString[Math.floor(Math.random() * numberString.length)];
        var i, passwordShuffled = '';
        const len = password.length - 1;
        for (i = 0; i < len; i ++) {
            const r = Math.random() * password.length | 0;
            passwordShuffled += password[r];
            password = password.slice(0, r) + password.slice(r + 1);
        }
        return passwordShuffled;
    }

    $('#lower-slider').slider({
        animate: 'fast',
        min: 0,
        max: 20,
        change: function(event, ui) {
            $('#lower-length').html(ui.value);
            lowerLength = ui.value;
            UpdatePasswordButton();
        },
        slide: function(event, ui) {
            $('#lower-length').html(ui.value);
            lowerLength = ui.value;
            UpdatePasswordButton();
        },
        value: 4
    });

    $('#upper-slider').slider({
        animate: 'fast',
        min: 0,
        max: 20,
        change: function(event, ui) {
            $('#upper-length').html(ui.value);
            upperLength = ui.value;
            UpdatePasswordButton();
        },
        slide: function(event, ui) {
            $('#upper-length').html(ui.value);
            upperLength = ui.value;
            UpdatePasswordButton();
        },
        value: 4
    });

    $('#special-slider').slider({
        animate: 'fast',
        min: 0,
        max: 20,
        change: function(event, ui) {
            $('#special-length').html(ui.value);
            specialLength = ui.value;
            UpdatePasswordButton();
        },
        slide: function(event, ui) {
            $('#special-length').html(ui.value);
            specialLength = ui.value;
            UpdatePasswordButton();
        },
        value: 4
    });

    $('#number-slider').slider({
        animate: 'fast',
        min: 0,
        max: 20,
        change: function(event, ui) {
            $('#number-length').html(ui.value);
            numberLength = ui.value;
            UpdatePasswordButton();
        },
        slide: function(event, ui) {
            $('#number-length').html(ui.value);
            numberLength = ui.value;
            UpdatePasswordButton();
        },
        value: 4
    });

    $('#generate-password').click(function() {
        $('#the-password').fadeOut({
            duration: 200,
            done: function(){
                $(this).html(GeneratePassword()).fadeIn({
                    duration: 200,
                    queue: true
                });
            }
        });
    });

    // Bulma navbar burger
    $('.navbar-burger').click(function() {
        $('.navbar-burger').toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });

    // Init Higlight
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    // Modal logic
    function ModalToggleClass(modal) {
        modal = '#' + modal;
        if ($(modal).hasClass('is-active')) {
            $('html').removeClass('is-clipped');
            $(modal).removeClass('is-active');
        } else {
            $('html').addClass('is-clipped');
            $(modal).addClass('is-active');
        }
    }

    $('button[data-modal], div.modal-background').click(function() {
        var modal = $(this).attr('data-modal');
        ModalToggleClass(modal);
    });

    // Cookie consent
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#353331",
                "text": "#cccccc"
            },
            "button": {
                "background": "#0eb2bb",
                "text": "#363636"
            }
        },
        "position": "bottom-right",
        "content": {
            "message": "Ce site n'utilise pas de cookie, ni de solution d'analyse de mesure d'audience.",
            "dismiss": "Ben ferme la alors!",
            "link": "Info sur les cookies (CNIL)",
            "href": "//www.cnil.fr/fr/cookies-comment-mettre-mon-site-web-en-conformite"
        }
        });
});