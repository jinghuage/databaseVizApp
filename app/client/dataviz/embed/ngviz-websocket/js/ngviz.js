// assets/js/aflvis.js

$( document ).ready(function() {



    var datafiles = ['HenryHub-spotprice', 'Storage', 'Consumption', 'Production', 'Export', 'Import'];

    $.each(datafiles, function(i, s){

    });

    // add checked item to plotlist
    function add_plotItem(value, plotlistid){
      console.log("add plotItem: ", value, "to ", plotlistid)

      var plotItem_list = $(plotlistid).val();
      var arr = plotItem_list.split(',');
      if(arr.length==1 && arr[0]=="") arr=[];

      console.log(plotItem_list, arr);



      var isin = false;
      $.each(arr, function(index, a){
        if(a.indexOf(value) != -1){
          isin = true;
          return false;
        }
      });

      if(!isin){
        arr.push(value+'*1.0');
        plotItem_list = arr.join(',');

        $(plotlistid).val(plotItem_list);
      }
    }

    // delete unchecked value from plotlist
    function delete_plotItem(value, plotlistid){
      console.log("delete plotItem: ", value, "from ", plotlistid)

      var plotItem_list = $(plotlistid).val();
      var arr = plotItem_list.split(',');
      if(arr.length==1 && arr[0]=="") arr=[];
      console.log(plotItem_list, arr);

      var isin = false;
      var whichindex = 0;
      $.each(arr, function(index, a){
        console.log(a);
        if(a.indexOf(value) != -1){
          isin = true;
          whichindex = index;
          return false;
        }
      });

      if(isin){
        arr.splice(whichindex, 1)
        plotItem_list = arr.join(',');
        $(plotlistid).val(plotItem_list);
      }
    }

    // format the list text into json format for messaging
    function format_to_json(plotlistid) {
        console.log("format to json");

        var plotItem_list = $(plotlistid).val().replace(/ /g,'');
        var arr = plotItem_list.split(',');
        if (arr.length == 1 && arr[0] == "") arr = [];
        console.log(plotItem_list, arr);
        var jlist = {};

        $.each(arr, function(index, a){
          console.log(a);
          if(a.indexOf('*')!=-1){
            var sar = a.split('*');
            jlist[sar[0]] = sar[1];
          }
          else{
            jlist[a] = '1.0';
          }
        });


        return jlist;
    }

    // set change event to symbols checkboxes
    var nsymbols = 3;
    for (var i = 0; i <= nsymbols; i++) {
      var id = "#symbol"+i;
      $(id).change(function() {
        var val = $(this).val();
        if ($(this).is(':checked')) {
            add_plotItem(val, "#plotsymbols");
        } else delete_plotItem(val, "#plotsymbols");
      });
    }

    // set change event to datafile checkboxes
    var ndatafiles = 6;
    for (var i = 0; i <= ndatafiles; i++) {
      var id = "#df"+i;
      $(id).change(function() {
        var val = $(this).val();
        if ($(this).is(':checked')) {
            add_plotItem(val, "#plotfiles");
        } else delete_plotItem(val, "#plotfiles");
      });
    }

    // initialize the console and the Handler
    var C = new Console($("#console"));
    var F = new Figure($("#figs"));
    var Handler = new WebSocketHandler(C, F);

    // load the saved serverURI into the serveruri input
    //var server = localStorage.getItem(KEY_SERVER_URI);


    var Socket;
    $("#connect").click(function(e) {
        //var server = "ws://localhost:9999/ws";
        var server = $("#wsserver").val();
        console.log(server);

        Socket = new WebSocketClient(server, Handler);
    });


    $("#disconnect").click(function(e) {
        var message = {
          'server-app':'any',
          'message':'disconnect'
        };
        Socket.send(JSON.stringify(message));

        setTimeout(function(){Socket.disconnect()}, 1000);
    });

    $("#plot").click(function(e) {

        var date1 = $('#dailymin').val();
        var date2 = $('#dailymax').val();
        console.log(date1, date2);

        var symbollist = format_to_json("#plotsymbols");
        var filelist = format_to_json("#plotfiles");
        console.log("symbol list:", symbollist);
        console.log("datafile list:", filelist);

        // var message = {
        //   'server-app':'ngviz',
        //   'message':{'timerange':['2012-06-10', '2016-09-05'],
        //                 'symbols':{'ung':1.0},
        //                 'datafiles':{'HenryHub-spotprice':5.0}
        //                 }
        // };

        var message = {
            "server-app": "ngviz",
            "message": {
              "timerange": [date1, date2],
              "symbols": symbollist,
              "datafiles": filelist
            }
        };

        Socket.send(JSON.stringify(message));
        e.preventDefault();
    });


});
