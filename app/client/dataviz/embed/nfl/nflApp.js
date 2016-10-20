


var teamG = ['DAL', 'IND', 'PHI', 'STL', 'MIA', 'ATL', 'JAC','WAS','BUF','NE', 'SEA','SF'];
var teamH = ['NYG', 'CHI', 'CLE', 'DET', 'HOU', 'KC',  'MIN','NO', 'NYJ','TEN','ARI','GB'];
var annotationlevels = ['Default', 'Successful Play', 'Unsuccessful Play', 'Score', 'Turnover', 'Penalty'];


$.each(teamG, function(i, s){
    var optionString = '<option value=' + i + '>' + s + '</option>';
    //console.log(optionString);
    $('#teamG').append(optionString);
});

$.each(teamH, function(i, s){
    var optionString = '<option value=' + i + '>' + s + '</option>';
    //console.log(optionString);
    $("#teamH").append(optionString);
});

$.each(annotationlevels, function(i, s){
    var optionString = '<option value=' + i + '>' + s + '</option>';
    $("#teamGlevel").append(optionString);
    $("#teamHlevel").append(optionString);
});

$("#teamGannotationOff").prop("disabled", true);
$("#teamHannotationOff").prop("disabled", true);

//-----------------------------------------------------------------------------
//https://github.com/stevehebert/football_data
//-----------------------------------------------------------------------------
d3.csv("data/2012_nfl_pbp_data.csv", function(data) {

    //initialization
    var chart = d3.chart.nflChart()
        .width(800)
        .height(800);

    //init the plot with a certain gameid
    var gameid = 2;
    $("#teamG").val(gameid);
    $("#teamH").val(gameid);
    plotgame(teamG[gameid], teamH[gameid]);

    //event handlers
    $("#plotgame").click(function(e){
        var t1 = teamG[parseInt($("#teamG").val())];
        var t2 = teamH[parseInt($("#teamH").val())];
        console.log(t1, t2);
        plotgame(t1, t2);
    });
    $("#animateplay").click(function(e){
        chart.animate();
    });
    $("#teamGannotationOn").click(function(e){
        $("#teamGannotationOff").prop("disabled", false);
        var t = teamG[parseInt($("#teamG").val())];
        var l = parseInt($("#teamGlevel").val());
        chart.annotationOn(t, l);
    });
    $("#teamGannotationOff").click(function(e){
        var t = teamG[parseInt($("#teamG").val())];
        chart.annotationOff(t);
    });
    $("#teamHannotationOn").click(function(e){
        $("#teamHannotationOff").prop("disabled", false);
        var t = teamH[parseInt($("#teamH").val())];
        var l = parseInt($("#teamHlevel").val());
        chart.annotationOn(t, l);
    });
    $("#teamHannotationOff").click(function(e){
        var t = teamH[parseInt($("#teamH").val())];
        chart.annotationOff(t);
    });

    //function def
    function plotgame(t1, t2){


        var filter = t1+'@'+t2;
        function mygame(d) {
            return d.gameid.indexOf(filter) > -1;
        }

        var mydata = data.filter(mygame);
        if (mydata == undefined){
            alert("no game data found");
            return;
        }

        var title = mydata[0].gameid;
        var team2 = mydata[0].off;  //team2 kick off
        var team1 = mydata[1].off;  //team1 start offense
        var team1_OF_Array = [];
        var team2_OF_Array = [];
        var team1play = [];
        var team2play = [];
        var team1_score = {};
        var team2_score = {};

        var team1_round = 0, team2_round = 0;

        //corner case: example: line 422
        //Half time, team switch and kick start
        //d.min = 30, d.sec=0, d.description.indexOf("kick")!=-1
        //NOTE: start of the game: distinguished by d.ydline = undefined


        //corner case : example: line 470
        //If INTECEPTED and TOUCHDOWN are happening in the same play.
        //Then one more play needs to be added, with team switched, ydline reversed,
        //and INTERCEPTED and TOUCHDOWN splited

        function reversecopy(d){
            var nd = {};
            nd.off = d.def;
            nd.def = d.off;
            nd.ydline = 100 - d.ydline;
            nd.min = d.min;
            nd.sec = d.sec;
            nd.offscore = d.defscore;
            nd.defscore = d.offscore;
            nd.down = d.down;
            nd.togo = d.togo;
            nd.description = "TOUCHDOWN";
            return nd;
        }

        var nd={}, reverse_ydline=0;
        var half_rounds = [[],[]];
        var half = 0;

        mydata.forEach( function(d, i) {

            if(d.ydline == 0) console.log(d.off, "KICKSTART");

            if(d.off === team1 && d.ydline) {
               //offense change to defense, push the last round offense play
                if(team2play.length > 0){
                    //console.log(team2, team2_round);
                    half_rounds[half].push(team2_round);
                    team2_OF_Array.push(team2play);
                    team2_round++;
                    team2play = [];
                }
                //only save score play if score changed to a new value
                if(d.offscore > 0 && team1_score[d.offscore] === undefined){

                    if(reverse_ydline){
                        d.ydline = reverseydline;
                        reverse_ydline = 0;
                    }
                    team1_score[d.offscore] = {time: 3600 - ((+d.min) * 60 + (+d.sec)),
                                               ydline: 50 - (+d.ydline),
                                               round: team1_round};
                    //console.log('new score: ', team1, d.offscore, team1_score[d.offscore]);
                }

                if((d.description.indexOf('INTERCEPTED') != -1) && (d.description.indexOf('TOUCHDOWN') != -1)){

                    nd = reversecopy(d);
                    reverse_ydline = nd.ydline;
                    team2play.push(nd);
                    //console.log(team1, ' corner case, nd: ', nd);
                    //console.log('SET reverse ydline:', nd.off, reverse_ydline);

                    d.description = d.description.replace(/TOUCHDOWN/g, '');
                    //console.log(d);
                }

                if(d.down && d.togo) team1play.push(d);

            }
            else if(d.off === team2 && d.ydline) {
                if( team1play.length > 0){
                    //console.log(team1, team1_round);
                    half_rounds[half].push(team1_round);
                    team1_OF_Array.push(team1play);
                    team1_round++;
                    team1play = [];
                }
                if(d.offscore > 0 && team2_score[d.offscore] === undefined){
                    //console.log("GET reverse ydline:", reverse_ydline);

                    if(reverse_ydline){
                        d.ydline = reverse_ydline;
                        reverse_ydline = 0;
                    }
                    team2_score[d.offscore] = {time: 3600 - ((+d.min) * 60 + (+d.sec)),
                                             ydline: (+d.ydline) - 50,
                                             round: team2_round};
                    //console.log('new score: ', team2, d.offscore, team2_score[d.offscore]);

                }

                if((d.description.indexOf('INTERCEPTED') != -1) && (d.description.indexOf('TOUCHDOWN') != -1)){

                    nd = reversecopy(d);
                    reverseydline = nd.ydline;
                    team1play.push(nd);
                    //console.log(team2, ' corner case, nd: ', nd);
                    d.description = d.description.replace(/TOUCHDOWN/g, '');
                    //console.log(d);
                }

                if(d.down && d.togo) team2play.push(d);

            }

            if(d.min == 30 && d.sec == 0){
                console.log("HALF TIME", d.off, "KICKSTART");
                half=1;
            }

        });

        //console.log(team1, "score: ", team1_score);
        //console.log(team2, "score: ", team2_score);
        //console.log(half_rounds);

        var scoredata = [];
        for(var s in team1_score){
            if(s > 0) scoredata.push({team: team1, score: s, time: team1_score[s].time,
                                      round: team1_score[s].round,
                                      ydline: team1_score[s].ydline, endzone: 50});
        }

        for(var s in team2_score){
            if(s > 0) scoredata.push({team: team2, score: s, time: team2_score[s].time,
                                      round: team2_score[s].round,
                                      ydline: team2_score[s].ydline, endzone: -50});
        }

        var desc_keywords = ['pass ', 'incomplete', 'punt', 'sack', 'guard', 'tackle', 'push',
                             'field goal', 'No Good', 'TOUCHDOWN', 'REVERSED',
                             'PENALTY', 'Illegal Contact', 'Holding', 'Pass Interference', 'Neutral Zone Infraction', 'Encroachment', 'Illegal Block', 'Roughing the Passer', 'False Start', 'Offside', 'Face Mask', 'Unnecessary Roughness','Illegal Formation', 'Illegal Substitution','Illegal Cut', 'Illegal Use of Hands','12 On-field', 'Delay of Game','Personal Foul', 'enforced', 'declined',
                             'INTERCEPTED', 'FUMBLE'];
        chart.teams([team1,team2])
            .title(title)
            .x(function(d) {
                if(d.min==="") d.min="60";
                return 3600 - ((+d.min) * 60 + (+d.sec));
            })
            .y(function(d) {
                if(d.ydline==="") d.ydline="100";
                if(d.off === team1) return 50 - (+d.ydline) ;
                else return (+d.ydline - 50);
            })
            .text(function(d){
                var t = [];
                desc_keywords.forEach(function(key,ki){
                    if(d.description.search(new RegExp(key, "i")) != -1) t.push(key);
                });
                if(t.indexOf('incomplete')!=-1) t.splice(t.indexOf('pass'), 1);
                return t;
            })
            .halfrounds(half_rounds)
            .scores(scoredata);

        d3.select("#chart")
            .datum([team1_OF_Array, team2_OF_Array])
            .call(chart);

    }

});
