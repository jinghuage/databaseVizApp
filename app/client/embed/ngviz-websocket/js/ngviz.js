// assets/js/aflvis.js

$( document ).ready(function() {



    var datafiles = ['HenryHub-spotprice', 'Storage', 'Consumption', 'Production', 'Export', 'Import'];

    $.each(datafiles, function(i, s){

    });

    function add_symbol(value){
      console.log("add symbol: ", value)

      var symbollist = $("#plotsymbols").val();
      var arr = symbollist.split(',');
      if(arr.length==1 && arr[0]=="") arr=[];

      console.log(symbollist, arr);



      var isin = false;
      $.each(arr, function(index, a){
        if(a.indexOf(value) != -1){
          isin = true;
          return false;
        }
      });

      if(!isin){
        arr.push(value+'*1.0');
        symbollist = arr.join(',');

        $("#plotsymbols").val(symbollist);
      }
    }

    function delete_symbol(value){
      console.log("delete symbol: ", value)

      var symbollist = $("#plotsymbols").val();
      var arr = symbollist.split(',');
      if(arr.length==1 && arr[0]=="") arr=[];
      console.log(symbollist, arr);

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
        symbollist = arr.join(',');
        $("#plotsymbols").val(symbollist);
      }
    }


    for (var i = 0; i <= 3; i++) {
      var id = "#symbol"+i;
      $(id).change(function() {
        var val = $(this).val();
        if ($(this).is(':checked')) {
            add_symbol(val);
        } else delete_symbol(val);
      });
    }



    // initialize the console and the Handler
    var C = new Console($("#console"));
    var F = new Figure($("#figs"));
    var Handler = new WebSocketHandler(C, F);

    // load the saved serverURI into the serveruri input
    //var server = localStorage.getItem(KEY_SERVER_URI);


    var server = "ws://localhost:9999/ws";
    console.log(server);

    var Socket = new WebSocketClient(server, Handler);

    $("#plot").click(function(e) {
        //var year = years[$("#year").val()];
        var symbols = [];
        symbols.push[document.myform.symbol1.value];

        var message = {
          'server-app':'ngviz',
          'message':{'timerange':['2012-06-10', '2016-09-05'],
                        'symbols':{'ung':1.0},
                        'datafiles':{'HenryHub-spotprice':5.0}
                        }
        };

        Socket.send(JSON.stringify(message));
        e.preventDefault();
    });


});
