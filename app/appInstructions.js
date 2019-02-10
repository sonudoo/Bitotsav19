
$(window).on("load", function(){

  $('.init-load-screen').hide(0);
  setTimeout(function(){
    $('.back').css('filter', 'blur(3px)');
    $('.front').show(0);
  }, 1500);

  $.get('https://pantheon17.in/api/announcements/getAnnouncements', function(data) {
    for( var i = 0; i < data.length; i++) {
      $('.announcements').append(`
        <h3 align="center">${ data[i].title }</h3>
        <p style="font-size: 120%;">${ data[i].message }</p>
        <h6 align="right" style="font-size: 110%;">${ moment(data[i].date).format("Do MMM, h:mm a") }</h6>
        <hr>
      `);
    }
  });

  $.get('https://pantheon17.in/api/teams/getLeaderboard', function(data) {
    console.log(data);
    var rank = 0;
    var points = 100000;
    for(var i = 0; i < data.length; i++) {
      if (data[i].points < points) {
        ++rank;
        points = data[i].points;
      }
      $('.table').append(`
        <div class="row team" onclick="fetchTeam('${ data[i].teamName }', '${ rank }')">
          <div class="col-sm-4" align="center"><h4>${ rank }</h4></div>
          <div class="col-sm-4" align="center"><h4>${ data[i].teamName }</h4></div>
          <div class="col-sm-4" align="center"><h4>${ data[i].points }</h4></div>
        </div>
      `);
    }
  });

  $('.team').click(function(){
    alert($(this).attr('teamName'));
  });

  setTimeout(function(){
    $('.header').show(0);
  }, 1700);

  setTimeout(function(){
    $('.container').show(0);
  }, 2500);

});

function fetchTeam(teamName, rank) {
  $('.modal-title').html('<i class="fa fa-spinner fa-pulse fa-fw"></i> Fetching Data From Memory');
  $('.modal-body').html('');
  $('#myModal').modal('show');
  $.post("https://pantheon17.in/api/applicants/getApplicantsByTeam", { eventName: 'formalinformal', teamName: teamName })
    .done(function( data ) {
      console.log(data);
      var html = `
        <div class="row" style="text-align: center; display: block;">
          <div class="col-sm-6">
            <p>Rank: ${ rank }</p>
          </div>
          <div class="col-sm-6">
            <p>Points: ${ data.points }</p>
          </div>
        </div>
        <h3 align="center" style="color: red">Team Members</h3>
        `;
        for( var i = 0; i < data.members.length; i++) {
          html += `<div style="display: inline-block; padding: 15px;">${ toTitleCase(data.members[i].name) }</div>`;
        }
      setTimeout(function(){
        $('.modal-title').html(`Team ${ teamName }`);
        $('.modal-body').append(html);
      },300);
    });
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}