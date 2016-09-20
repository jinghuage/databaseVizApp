
# coding: utf-8

# In[5]:

import numpy as np
import pandas as pd
from bokeh.charts import Horizon, output_file, show
from bokeh.io import output_notebook

output_notebook()


# In[6]:

#import pandas.io.data as web
import pandas_datareader.data as web
import datetime
start = datetime.datetime(2007, 4, 18)
end = datetime.datetime(2016, 5, 16)
ung = web.DataReader("UNG", 'yahoo', start, end)
ugaz = web.DataReader("UGAZ",'yahoo',start,end)
#ung.ix['2010-01-04']
ung[-40:-35]
#ugaz.head(5)


# In[16]:

ung.columns


# In[17]:

spot_price = pd.read_csv('csv/HenryHub-spotprice-daily.csv',
                         parse_dates={'datetime':['Date']}, 
                         index_col='datetime',
                         keep_date_col=True) 
#index_col='Date', parse_dates=True)
spot_price.head(5)


# In[9]:

spot=spot_price.ix['2007-04-18':]
spot.tail(5)


# In[10]:

spot.shape


# In[11]:

#ung has 2287 rows, while spot has 2297 rows
#compare ung.index and spot.index
spot[~spot.index.isin(ung.index)]


# In[12]:

filled_ung = ung.reindex(spot.index, method='bfill') #fill_value=0)
filled_ung[~spot.index.isin(ung.index)]


# In[13]:

import datetime
import calendar
calendar.day_name[datetime.datetime.today().weekday()]
calendar.day_name[datetime.datetime(2016,3,25).weekday()]


# In[14]:

from bokeh.plotting import figure, output_file, show
from bokeh.models import CustomJS, ColumnDataSource, Slider
from bokeh.models import HoverTool

output_file("ngspot_ung.html")

TOOLS="crosshair,pan,wheel_zoom,box_zoom,reset,hover,previewsave"

source = ColumnDataSource(data=dict(
    Date=spot.index,
    DateLabel=spot['Date'],
    Data=spot['Henry Hub Natural Gas Spot Price (Dollars per Million Btu)'],
    AdjData=spot['Henry Hub Natural Gas Spot Price (Dollars per Million Btu)']*10,
))

source_2 = ColumnDataSource(data=dict(
    Date=spot.index,
    DateLabel=spot['Date'],
    Data=filled_ung['Close'],
    AdjData=filled_ung['Adj Close'],
))

# create a new plot with a a datetime axis type
p = figure(width=800, height=350, x_axis_type="datetime", tools=TOOLS)
p.line('Date', 'AdjData',
    source=source, color='navy',legend="spot*10")

#p2 = figure(width=800, height=350, x_axis_type="datetime", tools=TOOLS)
p.line('Date', 'AdjData',
    source=source_2, color='red',legend="ung")

# NEW: customize by setting attributes
p.title = "NG Spot and UNG tick Price"
p.legend.location = "top_right"
p.grid.grid_line_alpha=0
p.xaxis.axis_label = 'Date'
p.yaxis.axis_label = 'Price($)'
p.ygrid.band_fill_color="olive"
p.ygrid.band_fill_alpha = 0.1

#hover = p.select_one(HoverTool).tooltips = [
#    ("Date", "@DateLabel"),
#    ("Price", "@Data"),
#]

p.select_one(HoverTool).tooltips =         """
        <div>
            <div>
                <span style="font-size: 17px; font-weight: bold;">Date:</span>
                <span style="font-size: 15px; color: #966;">@DateLabel</span>
            </div>
            <div>
                <span style="font-size: 15px;">Price:</span>
                <span style="font-size: 10px; color: #696;">@Data</span>
            </div>
        </div>
        """


# show the results
show(p)
#show(p2)



# In[ ]:



