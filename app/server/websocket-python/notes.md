Server side code:


express: express framework serves RESTful application
flask: flask app uses jinja2 template
http: simple http server

websocket-node: websocket-nodejs serves websocket server
websocket-python: tornado application serves websocket server

app-template: app code, generate html

  - aflviz: uses python, pandas and matplotlib to create plot, and mpld3 to export matplotlib plot to html.  Why the export works? Think of a matplotlib plot as an XML object describe the plot using SVG etc. Notice only plots are created here, if you need html interface, you need to creat one at client side.


  - ngviz-bokeh: use bokeh to write plot code, plus html widget code. Also bokeh will save the whole thing to html for you.

  - jinja2: html templating

  - So, after the app templates generate html, then you can serve them through a http application, or websocket server.
