$('.slick-carousel').slick({
    centerMode: true,
    centerPadding: '10px',
    variableWidth: true,
    slidesToShow: 3,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '10px',
                slidesToShow: 3
            }
        },
        {
            breakpoint: 480,
            settings: {
                arrows: true,
                centerMode: true,
                centerPadding: '10px',
                slidesToShow: 1
            }
        }
    ]
});