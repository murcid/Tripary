// scripts.js
var d = document;

/*----------------Compass------------------*/
function SetUpCompass() {
    d.addEventListener('deviceready', function () {
        var watchId = 0;

        $('#BtnCompass').bind('touchstart', function () {
            var options = null;
            if (watchId == 0) {
                options = { frequency: 100 };
                watchId = navigator.compass.watchHeading(function (heading) {
                    var rotation = Math.round(heading.magneticHeading) + 'deg';

                    $('#TbnHeading').attr('value', heading.magneticHeading);
                    $('#imgNeedle').css('-webkit-transform', 'rotate( ' + rotation + ' )');
                }, function (error) {
                    console.log('Error');
                }, options);

                $(this).html('Stop Watching');

            } else {
                navigator.compass.clearWatch(watchId);
                watchId = 0;

                $(this).html('Watch Heading');
            }
        })
    })
}

/*----------------Camera------------------*/

//function capturePhoto() {
//    navigator.camera.getPicture(uploadPhoto, null, { sourceType: 1, quality: 60 });
//}

//d.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {
//    //document.getElementById("DivButtons").style.display = "block";
//    console.log(navigator.camera);
//}

function SetUpCamera() {
    //camera
    d.getElementById("BtnCamera").addEventListener("click", function () {
        // start video capture
        navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 1 });
    });
}

// capture callback
var captureSuccess = function (mediaFiles) {
    var i, path, len, html;
    html = "";
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        html += "<p>" + path + "</p>";
    }
    d.getElementById("DivOutput").innerHTML = html;
};

// capture error callback
var captureError = function (error) {
    d.getElementById("DivOutput").innerHTML = 'Capture Error Code: ' + error.code;
};


/*----------------Geolocation------------------*/
var map;

function initMap() {
    map = new google.maps.Map(d.getElementById('map'), {
        center: { lat: 43, lng: -76 },
        zoom: 7
    });
}

function getPos() {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, function () {
        alert("Geolocations error")
    });
}

var recPos;

function geolocationSuccess(position) {

    //var infoWindow = new google.maps.InfoWindow({ map: map });

    var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    map.setCenter(pos);

    var infowindow = new google.maps.InfoWindow({
        content: "<div id='DivInfo'><b><u>Location</u></b><br /><b>Lat:</b> " + position.coords.latitude + "<br /><b>Longitude:</b> " + position.coords.longitude + "</div>"
    });

    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Add New Location'
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
    recPos = pos;
}

$("#BtnSave").on("click", function (e) {
    if (recPos == null) {
        alert("You Have not selected your Location");
    }
    else {
        loadStorage($("#TBDate").val(), $("#TADescription").val());
        $("#TBDate").val("");
        $("#TADescription").val("");
        initMap();
    }
    return false;
})

$("#BtnClear").on("click", function () {
    $("#TBDate").val("");
    $("#TADescription").val("");
    initMap();
})


/*----------------History------------------*/
//object
function Entree(id, edate, desc, lat, lng) {
    this.id = id;
    this.edate = edate;
    this.desc = desc;
    this.lat = lat;
    this.lng = lng;
}

//local storage
function loadStorage(edate, desc) {
    var id = localStorage.length + 1;
    localStorage.setItem(id, JSON.stringify(new Entree(id, edate, desc, recPos.lat, recPos.lng)));
}

//Display List
function DisplayList() {
    var html = "<br /><br /><br />";
    var pointsToPlot = new Array();
    try {
        if (localStorage.length > 0) {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var item = JSON.parse(localStorage.getItem(key));
                pointsToPlot.push(item);
                html += "<div id='" + item.id + "'>Date: " + item.edate + " Item: " + item.desc + " Lat:" + item.lat + " Long:" + item.lng + "</div>";
            }
            PlotPoints(pointsToPlot);
        } else {
            html += "<h3>There are no locations saved.</h3>";
        }
    } catch (ex) {
        html += "<h3>Some error occurred with record retrieval.</h3>";
    }
    $("#DivList").html(html);
}

function PlotPoints(list) {

}