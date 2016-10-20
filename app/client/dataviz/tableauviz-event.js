myapp.listenToMarksSelection = function() {
    _viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);


    function onMarksSelection(marksEvent) {
        return marksEvent.getMarksAsync().then(reportSelectedMarks);
    }

    function reportSelectedMarks(marks) {

        console.log("reportSelectedMarks");
        var html = [];
        var nred = 0;

        if (marks.length == 0) {
            html = ["<li>None</li>"];
        }

        for (var markIndex = 0; markIndex < marks.length; markIndex++) {
            var pairs = marks[markIndex].getPairs();
            //html.push('<li class="info-header"><b>Mark ' + markIndex + ':</b></li>');
            for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                var pair = pairs[pairIndex];
                var fieldName = pair.fieldName;
                var fieldValue = pair.value;
                //html.push("<li>" + pair.fieldName);
                //html.push("<li>" + pair.fieldName + ":" + pair.formattedValue + "</li>");
                if(fieldName.includes('Number of Records')){
                  nred += fieldValue;
                }
            }
            //console.log(html);
        }
        html.push('<li><b>'+marks.length+'</b> mark(s) selected, total number of records <b>'+nred+'</b></li>');

        $('#' + markerSelectionDiv + ' li').remove();
        $("#" + markerSelectionDiv).append(html.join(""));

    }

    function removeMarksSelectionEventListener() {
        _viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
    }
};
