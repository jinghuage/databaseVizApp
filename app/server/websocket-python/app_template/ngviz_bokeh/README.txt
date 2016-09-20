ng data from EIA: 
http://www.eia.gov/naturalgas/data.cfm

ng storage history data download: 
http://ir.eia.gov/ngs/ngs.html
http://ir.eia.gov/ngs/ngshistory.xls
http://ir.eia.gov/ngs/ngsstats.xls

ng dry production, import, export history data:
https://www.eia.gov/dnav/ng/hist/n9070us2M.htm
https://www.eia.gov/dnav/ng/ng_move_state_dcu_nus_a.htm


Henry hub ng spot price history data download: 
https://www.eia.gov/dnav/ng/hist/rngwhhdm.htm
https://www.eia.gov/dnav/ng/hist/rngwhhdd.htm

UNG tick price history data retrieval python code: 
quotes.py

bokeh chart examples: 
http://bokeh.pydata.org/en/latest/docs/reference/charts.html

bokeh using jupyter notebook:
http://bokeh.pydata.org/en/latest/docs/user_guide/notebook.html

bokeh using webgl: 
http://bokeh.pydata.org/en/latest/docs/user_guide/webgl.html

bokeh server:
http://bokeh.pydata.org/en/latest/docs/user_guide/server.html



ngviz vs. stockviz: 

                   ngviz                            stockviz
build viz          pandas, bokeh plotting           pandas, matplotlib
plot to html       bokeh output or curdoc           mpld3
server             bokeh serve                      tornado + websocket 
widget             bokeh widget                     client html
interaction        bokeh interaction                client javascript
deploy             reverse proxy with nginx/django  same idea but not implemented



status: 

* data: download xls, save as csv, use pandas to load and mangle
* plot: pandas + matplot subplots, axlines,

* bokeh: layout? subplot? (hplot, vplot, horizon) 
* interaction: 

  - axlines -- ray ? -- crosshair will do better
  - hover and crosshair tool (bokeh/examples/plotting/server/hover.py)
  - widget??

