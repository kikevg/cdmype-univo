
$(window).on("load", function () {
    let $grid = $('.grid-isotope').isotope({
        itemSelector: '.grid-isotope-item',
        layoutMode: 'fitRows',
    });

    $('.filter-button-group').on('click', 'button', function () {
        let filterValue = $(this).attr('data-filter');
        console.log(filterValue);
        $grid.isotope({ filter: filterValue });
    });
});