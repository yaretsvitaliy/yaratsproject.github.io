$('.icon-geolocation > img').click(function(){

    $('#modalMap').modal('show')
})

//$('#modalMap').on('shown.bs.modal', function(){
    function initMap() {
        var Minsk = {lat: 53.9, lng: 27.56667};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: Minsk
        });
        var marker = new google.maps.Marker({
            position: Minsk,
            map: map
        });
    }
//})

