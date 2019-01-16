$(document).ready(function () {
    var s = skrollr.init();
});
let countries = ["None", "India", "China", "Russia"]
let countriesX = [0, 550, 800, 650];
let countriesY = [0, 700, 500, 200];
let order = [0];
for (let i = 0; i < 10; i++) {
    let r = order[order.length - 1];
    while (r == order[order.length - 1] || r == 0) {
        r = parseInt(Math.random() * 100000) % countries.length;
    }
    order.push(r);
}
for (let i = 0; i < order.length; i++) {
    $("#image").attr("data-" + i * 4000, "background-position: -" + countriesX[order[i]] + "px -" + countriesY[order[i]] + "px;");
    $("#plane").attr("data-" + i * 4000, "height: 10%; width: 10%;");
    $("#plane").attr("data-" + (i * 4000 + 2000), "height: 25%; width: 25%;");
}
let currentCountry = 0;
let lastScroll = 0;
let offset = 0;
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if (scroll > lastScroll) {
        if (scroll >= (currentCountry + 1) * 4000) {
            currentCountry++;
        }
        let fx = countriesX[order[currentCountry]];
        let gx = countriesX[order[currentCountry + 1]];
        let fy = countriesY[order[currentCountry]];
        let gy = countriesY[order[currentCountry + 1]];
        let angle = Math.atan2((gy - fy), (gx - fx)) * (180 / Math.PI) - offset;
        console.log("Angle between " + countries[order[currentCountry]] + " and " + countries[order[currentCountry + 1]] + " is " + (angle - offset));
        $("#plane").css('transform', 'rotate(' + angle + 'deg)');
    }
    else {
        if (scroll < (currentCountry) * 4000) {
            currentCountry--;
        }
        let gx = countriesX[order[currentCountry]];
        let fx = countriesX[order[currentCountry + 1]];
        let gy = countriesY[order[currentCountry]];
        let fy = countriesY[order[currentCountry + 1]];
        let angle = Math.atan2((gy - fy), (gx - fx)) * (180 / Math.PI) - offset;
        console.log("Angle between " + countries[order[currentCountry + 1]] + " and " + countries[order[currentCountry]] + " is " + (angle + offset));
        $("#plane").css('transform', 'rotate(' + angle + 'deg)');
    }
    lastScroll = scroll;
});


function next() {
    let newScrollVal = 0;
    if ((lastScroll + 4000) % 4000 == 0) {
        newScrollVal = lastScroll + 4000;
    }
    else {
        newScrollVal = parseInt((lastScroll + 4000) / 4000) * 4000;
    }
    $('html, body').animate({
        scrollTop: newScrollVal,
        scrollLeft: 0
    }, 2000);
}

function previous() {
    let newScrollVal = 0;
    if ((lastScroll - 4000) % 4000 == 0) {
        newScrollVal = lastScroll - 4000;
    }
    else {
        newScrollVal = parseInt((lastScroll - 4000) / 4000) * 4000 + 4000;
    }
    $('html, body').animate({
        scrollTop: newScrollVal,
        scrollLeft: 0
    }, 2000);
}

const requrl = "https://bitotsav.in";

function showEvents(){
    $("#event-category").hide(500);
    $("#event-home").show(500);
    $("#event-back").hide(500);
    $("#event-details").hide(500);
}

function showEventDetails(eventId){
    $("#event-category").hide(500);
    $.ajax({
        type: 'POST',
        url: requrl + '/api/events/getEventById',
        data: {
            "eventId": eventId
        }
    })
        .done((result) => {
            if (result.success === 'fail') {
                location.reload(true);
            }
            else {
                result = JSON.parse(result);
                result = result[0];
                let tmp = `
                <p><b>Event Name: </b> ${result.eventName}</p>
                <p><b>Event Venue: </b> ${result.eventVenue}</p>
                <p><b>Event Time: </b> ${result.eventTime}</p>
                <p><b>Description: </b></p><p> ${result.eventDescription}</p>
                <p><b>Rules: </b></p><p>
                <ul style="color: #FFF;">`;
                let rules = result.eventRules.split('\n');
                for(let i in rules){
                    tmp += `<li><p>`+rules[i]+`</p></li>`;
                }
                tmp += `
                </ul></p>
                `
                $("#event-details").html(tmp);
                $("#event-details").show(500);
            }
        })

        .fail((err) => {
            alert('Some error occured.Please try again.');
        });
}

$(document).ready(function () {

    $("#music").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Music"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Music</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })

    $("#dance").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Dance"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Dance</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })

    // console.log("fejejwfbh");

    $("#dramatics").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Dramatics"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Dramatics</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })

    $("#speakingarts").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Speaking Arts"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Speaking Arts</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                window.location.href = 'event.html';
            });
    })


    $("#digitalarts").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Digital Arts"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Digital Arts</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })


    $("#finearts").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Fine Arts"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Fine Arts</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })


    $("#fashion").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Fashion"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Fashion</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })

    $("#literaryarts").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Literary Arts"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Literary Arts</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })



    $("#journalism").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Journalism"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Journalism</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
                location.reload(true);
            });
    })


    $("#informals").click(function (e) {
        e.preventDefault();
        $("#event-home").hide(500);
        $("#event-category").show(500);
        $("#event-back").show(500);
        $.ajax({
            type: 'POST',
            url: requrl + '/api/events/getEventByCategory',
            data: {
                "category": "Informals"
            }
        })
            .done((result) => {
                if (result.success === 'fail') {
                    location.reload(true);
                }
                else {
                    let tmp = `
                    <div class="row text-center">
                    <div class="col-md-12">
                        <h3 style="color: #FFF; ">Informals</h3>
                    </div><div class="col-md-1"></div>
                `;
                    for (var i = 0; i < result.length; i++) {
                        tmp += `
                        <div class="col-md-2">
                        <div class="event-item text-center">
                            <i class="fa fa-music fa-5x" aria-hidden="true" id="event-${result[i].eventId}" onclick="showEventDetails(${result[i].eventId})"></i>
                            <p>${result[i].eventName}</p>
                        </div>
                    </div>
                        `;
                    }
                    tmp += `</div>`;
                    $("#event-category").html(tmp);
                }
            })

            .fail((err) => {
                alert('Some error occured.Please try again.');
            });
    })

});



$("#event-back").hide();
$("#event-details").hide();
