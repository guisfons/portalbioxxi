jQuery(document).ready(function ($) {
    $('.faq__button').on('click', function () {
        let subject = $(this).data('subject');
        $(this).parent().addClass('faq--hide')
        $('.faq__container[data-subject="' + subject + '"]').addClass('faq__container--active')
    })

    $('.faq__back').on('click', function () {
        $(this).closest('.faq__container').removeClass('faq__container--active')
        $('.faq').removeClass('faq--hide')
    })

    $('.faq__card h3').on("click", function() {
        $(this).parent().toggleClass('faq__card--active');
        let panel = $(this).next();
        
        if (panel.css("max-height") !== "0px") {
            panel.css("max-height", "0");
        } else {
            panel.css("max-height", panel[0].scrollHeight + "px");
        }
    });
});