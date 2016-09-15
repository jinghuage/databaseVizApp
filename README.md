# gp41_genbank_sample

Sep 6, 2016 log:
-----------------

git branch: step-0

Rewrite standalone application with nodejs application structure:

  - package management : npm, bower
  - testing: mocha, chai, and sinon?
  - server side : may need to connect to database directly for query
  - server side : may need to handle user login
  - client side : use bootstrap for html layout
  - client side : thought about angularjs but don't think need it at this stage.


Git Repo:

  - git: https://github.com/jinghuage/gp41_genbank_sample.git
  - branch: step-0 for empty project structure


Sep 8, 2016 log:
-----------------

git branch: step-1

Use AngularJS for a locally routed app:

  - view #1: Basic header and footer, and show list of databases, for each database, provide link to their visualization page, which is view #2 routed by AngularRoute. Contains a side bar for search, and a main body for list view.
  - view #2: visualization page for a database, pull viz from tableau public. Has a navbar which can navigate through available views. Contains side bar for tools, and main body for viz view.


Sep 13, 2016 log:
-------------------

git branch: step-2

fixes:

  - tableau viz sidebar buttons and user selection works now
  - refined GP41 tableau viz dashboard

Sep 14, 2016 log:
------------------

git branch step-3

Now the tableau viz page works. Think about making the webapp a hosting strategy for my viz apps in general. So:

  - How about d3 app? e.g.  ~/Documents/javascript/charts/nfl/
  - And python app? e.g. ~/Documents/python/vizwebapp/aflviz-websocket/
  - And bokeh app? e.g. ~/Documents/python/vizwebapp/ngviz-bokeh/

The development roadmap might be complex:

  - Can all d3 and python apps organized or abstracted to have the same level of uniformity as the tableau app? Can be hosted on server and have a javascript API to retrieve the viz? Python or bokeh have to run on server obviously. But D3 doesn't.

  - Think about the python app first. The aflviz app natually have three plots you can request (team performance heat square map, plot all games as subplots, and plot a single game). So they can be anaglous as tableau dashboards. Suppose we have a pythonapp javascript api already, when this api new the viz, it can request a dashboard from the server, the server will call python function, create matplotlib graph, then use mpld3 exportor to generate html, and use websocket to send to the api call. This seems ok. Also the dashboard should include controls, like html widgets. Bokeh does this from the python code as well, so we don't need to manually merge use interface html to the graph html. So maybe instead of matplotlib and mpld3, we can use bokeh instead, for both widgets and plots. This has to be implemented and test first. The other app, stockviz, might be a little complex in user interface side, have to think about that later.


  - Now lets think about d3 apps. they are html and js files already, not need to generate them, just copy them to somewhere, and load the necessary html/js into the viz placeholder div, same as tableau load their viz into a viz placeholder div.

  - About bokeh apps: don't bokeh already have a bokeh javascript api? -- seems like a different model tho, BokehJS is used to directly write javascript to produce bokeh plots. Bokeh plots can naturally be saved into html and run on client side -- so don't need server to generate plot everytime. Not sure it's true. but if so can be treated same as d3. So the conclusion is, if you are using BokehJS to write javascript code directly, then same as d3. But if you are using bokeh as a python package, then it should be same as python. I am going to assume that we will use bokeh as python package, so treat as python. Bokeh use their own plot to html export code, so not the same as mpld3.

  - So, when tableau viz is embeded, where's user interaction happening? Does server transfer data back to client to plot, or server generate plot and send image back to client to display? -- Because the tableau viz is fully interactive on client side use hovering, tooltip, html widget click, etc. can't be images, must be the same as mpld3 and bokeh does -- which is to save the plot into html+javascript. So it's svg elements (lines, rects, circles, etc. ) and data used to create these svg elements, plus html widgets.


  Sep 15, 2016 log:
  ------------------

  git branch step-3

  - Use iframe for d3viz, works well.
  - inject $timeout to database-viz controller, so can use $timeout() to set nav style after the templated has rendered. -- so far didn't find any event that will catch the template-rendered event. Before used a last div with ng-view set to be a checkme function, that worked as well, but iframe seems to break it -- may need further exploration.



  
