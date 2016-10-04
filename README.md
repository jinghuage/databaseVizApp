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


  Sep 20, 2016 log:
  ------------------

  git branch step-4

  - client side : boil down to two types of viz api: tableauViz, and embedViz. the embedded viz apps can be standalone app (like d3 apps), or user interface app which connects to server side (e.g. websocket-python) for generated graph (aflviz) or just simple messaging response (chat)

  - tidy up server side structure. websocket-python has server-tornado.py, app_template folder and router folder.

    - The app_template folder hold server side viz code, use matplotlib+mpld3, or bokeh, to generate plots and output into html. Each viz app will have a "reqhandler.py" file, which define a "graph" function. The "graph" function accepts parameters (from message string loaded into json ), and call app submodules to generate graph, based on the parameters.

    - The router folder accepts the request from client, and route the request to corresponding apps. After dynamically import app.reqhandler module, then the router's handler will be set to the "graph" function of the imported module.

  Sep 21, 2016 log:
  -----------------

  git branch step-5

  work on bokeh app

  Comparison between bokeh and matplotlib+mpld3 apps:

  - bokeh can have html widgets and interaction built in -- so does that mean bokeh transfer data combined with html/js, so once transferred to client, it became a standalone app and doesn't need more request back to server??? Unless you try to change datasource?? Is this true?-- Although it's probably not a very good structure to use here, that we have to isolate the datasource change use case out, which may just cause confusion. It's better to still use the client side user-interface, and server side plot generation architecture.


  - look at the html file bokeh created, it uses "https://cdn.pydata.org/bokeh/release/bokeh-0.11.1.min.js" script to render the data object generated from the plot. This is how mpld3 works as well. Note that this script is different from BokehJS -- which is a JS library like d3, allowing users to write plotting code in javascript directly.

  - Now lets draw some analogy to tableau. the tableau embed uses 'https://public.tableau.com/javascripts/api/viz_v1.js' script to render the viz data object I Suppose? And the Tableau javascript API "http://public.tableau.com/javascripts/api/tableau-2.js" is different again. This one allows user to write javascript code to do the embedding, instead of insert embed html snippet directly. Furthermore, it returns a javascript object of the viz, and allows some interaction with the viz object. Note again this API is very limited, it won't let you create new viz elements, like d3 and bokehjs can. It merely provides some interaction within the current viz elements.

  Sep 27, 2016 log:
  -------------------

  Bokeh app works now.
  Used bokeh.embed.components(plot) to generate script and div html, then send back to client side.

  Note: Bokeh-0.11.1.js and css files must be include in the client side index.html already. Unlike mpld3, bokeh doesn't implement dynamic library loading in the html generated for each plot -- which is ok.

  Also, Bokeh-0.12.js doesn't work so far. Maybe not compatible with the bokeh python version I am using right now -- may check on this later.

  Oct 03, 2016 log:
  -----------------
  git branch step-6


  Work on Tableu filters: All filters will be retrieved and can be quickly set using sidebar.


  todo:

  - Angular dynamic html template - model connection. For example, each view will have different set of filters which need to be changed on the sidebar.


  - Tableau 10: get underlying data. -- Switched the Genbank original to Tableau 10 version. Turns our the data dialog is the same, you can always turn on "all columns" and get all data. I guess they just added the js api functions to get the data into javascript.

  - test the filter stuff to the sequence split version.

  Oct 04, 2016 log:
  -----------------
  git branch step-6

  Keep working on Tableau filters and Angular side bar

  - change: the database json file include a default list of filters for each view, so only selected filters are initialized in side bar

  - Angular will init the filters in side bar, and keep a self.filters array, which can be synced to the viz filters through buttons "GET/SET".

  - As for the mark selections, still send the div to viz and let viz handle it through the user selection event

  todo:

  - really the tableau dashboards need to be cleaned. why the bubble view is always there???

  -
