$('.navigation__link').click(function(e){
    e.preventDefault();
    var el = $(this).attr('href');
    var height = $(el).offset().top;
    var delay = height/5;
    console.log(delay);
    $('html, body').animate({
        scrollTop: height
    }, delay)
    //document.getElementById(el).scrollIntoView();
})