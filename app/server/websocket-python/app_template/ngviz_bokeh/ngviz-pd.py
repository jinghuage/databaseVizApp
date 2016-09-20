
# coding: utf-8

# In[2]:

import pandas as pd
from bokeh.charts import Horizon, output_file, show
from bokeh.io import output_notebook

output_notebook()


# In[45]:

#storage = pd.read_csv('csv/ng-storage-weekly.csv',index_col='Week ending',parse_dates=True)
storage = pd.read_csv('csv/ng-storage-weekly.csv')#,parse_dates={'datetime':['Week ending']})
storage.tail(5)


# In[54]:

infile='csv/ng-storage-weekly.csv'
storage = pd.read_csv(infile, parse_dates={'datetime':['Week ending']}, keep_date_col=True)
storage.head(5)


# In[38]:

#storage.index.rename('Date',inplace=True)
#storage[0:5]


# In[39]:

get_ipython().magic(u'matplotlib inline')

import matplotlib.pyplot as plt
figure, ax = plt.subplots()
storage.plot(ax=ax,x='Week ending',y='Total Lower 48')
ax.axhline(y=3000,xmin=0,xmax=1,c="red",linewidth=0.5,zorder=0)
#ax.hlines(y=3000,xmin=0,xmax=storage.shape[0],colors="darkgoldenrod",linewidth=0.5,zorder=0)


# In[97]:

production_df = pd.read_csv('csv/ng-marketproduction-monthly.csv',parse_dates={'datetime':['Date']}, index_col='datetime',
                         keep_date_col=True)
production_df.rename(columns={'U.S. Natural Gas Marketed Production (MMcf)':'production'},inplace=True)
production_df[0:5]


# In[98]:

production=production_df.loc['2010-01-01':]


# In[106]:

production.head(5)


# In[105]:

production['production'] = production['production'].apply(lambda x:x/1000)


# In[87]:




# In[118]:

from bokeh.plotting import figure, output_file, show
from bokeh.models import CustomJS, ColumnDataSource, Slider
from bokeh.models import HoverTool

TOOLS="crosshair,pan,wheel_zoom,box_zoom,reset,hover,previewsave"

source = ColumnDataSource(data=dict(
    Date=storage['datetime'],
    DateLabel=storage['Week ending'],
    Data=storage['Total Lower 48'],
))

source_2 = ColumnDataSource(data=dict(
    Date=production.index,
    DateLabel=production['Date'],
    Data=production['production'],
))

# create a new plot with a a datetime axis type
p = figure(width=800, height=350, x_axis_type="datetime", tools=TOOLS)
p.line('Date', 'Data',
    source=source, color='navy')

#p2 = figure(width=800, height=350, x_axis_type="datetime", tools=TOOLS)
p.line('Date', 'Data',
    source=source_2, color='red')

# NEW: customize by setting attributes
p.title = "Total Lower 48 NG storage"
p.legend.location = "top_left"
p.grid.grid_line_alpha=0
p.xaxis.axis_label = 'Date'
p.yaxis.axis_label = 'Volume(Bcf)'
p.ygrid.band_fill_color="olive"
p.ygrid.band_fill_alpha = 0.1

hover = p.select_one(HoverTool).tooltips = [
    ("Date", "@DateLabel"),
    ("Volume", "@Data"),
]
# show the results
show(p)
#show(p2)


# In[73]:

get_ipython().system(u"head -n 5 'csv/ng-export-monthly.csv'")


# In[16]:

import_df = pd.read_csv('csv/ng-import-monthly.csv',index_col='Date', parse_dates=True)
import_df[0:5]


# In[17]:

export_df = pd.read_csv('csv/ng-export-monthly.csv',index_col='Date', parse_dates=True)
export_df[0:5]


# In[18]:

import_export = pd.concat([import_df, export_df], axis=1, join_axes=[import_df.index])
import_export[0:5]                       


# In[19]:

import_export.plot()


# In[20]:

production_df = pd.read_csv('csv/ng-marketproduction-monthly.csv',index_col='Date', parse_dates=True)
production_df[0:5]


# In[21]:

consumption_df = pd.read_csv('csv/ng-consumption-monthly.csv',index_col='Date', parse_dates=True)
consumption_df[0:5]


# In[22]:

import_export_production = pd.concat([import_df, export_df, production_df], axis=1, join_axes=[import_df.index])
import_export_production[0:5]                       


# In[23]:

import_export_production.columns=['import','export','production']
import_export_production = import_export_production/1000
import_export_production.loc['2010-1-1':].plot()


# In[13]:

consumption_production = pd.concat([consumption_df, production_df], axis=1, join_axes=[consumption_df.index])
consumption_production = consumption_production/1000
consumption_production.columns=['consumption','production']
consumption_production.loc['2010-1-1':].plot()


# In[14]:

import pandas.io.data as web
import datetime
start = datetime.datetime(2010, 1, 1)
end = datetime.datetime(2016, 5, 13)
ung = web.DataReader("UNG", 'yahoo', start, end)
#ung.ix['2010-01-04']
ung[0:5]


# In[15]:

ung['Adj Close'].plot()


# In[16]:

combine_df = pd.concat([storage, ung['Adj Close']], axis=1, join_axes=[storage.index])


# In[22]:

combine_df[0:5]


# In[16]:

import_export = pd.concat([import_df, export_df], axis=1, join_axes=[import_df.index])
import_export = import_export/1000


# In[80]:

import matplotlib.pyplot as plt
from datetime import datetime

plt.figure(figsize=(10,10))

start_date = '2012-1-1'
end_date = '2016-5-20'

nrows=4
ncols=1

ax = plt.subplot2grid((nrows,ncols),(0, 0),colspan=1, rowspan=2)
# set shareX to False avoid plot index errors
# because data index as X axis are different among data to be plotted in subplots
storage.loc[start_date:end_date].plot(ax=ax,sharex=False, sharey=False); 
consumption_production.loc[start_date:end_date].plot(ax=ax, legend=False)
import_export.loc[start_date:].plot(ax=ax, legend=False)
ax.xaxis.set_ticklabels([])
ax.set_ylabel('NG Volume(Bcf)')
ax.set_ylim(0, 4000)
ax.set_yticks([1000, 2000, 3000, 4000])
fillcolor = 'darkgoldenrod'
ax.axhline(2742, 0, 1, color=fillcolor) 
ax.text(0.025, 0.9, 'Storage', va='top', color='blue',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.6, 'Consumption', va='top', color='green',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.45, 'Production', va='top', color='red',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.14, 'Import', va='top', color='cyan',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.08, 'Export', va='top', color='purple',transform=ax.transAxes, fontsize=10)

ax2 = plt.subplot2grid((nrows,ncols),(2, 0),colspan=1, rowspan=1)
ung['Adj Close'].loc[start_date:end_date].plot(ax=ax2,sharex=False, sharey=False); 
ax2.xaxis.set_ticklabels([])
ax2.set_ylabel('UNG price($)')
ax2.set_ylim(0, 30)
ax2.set_yticks([10, 20, 25])

ax3 = plt.subplot2grid((nrows,ncols),(3, 0),colspan=1, rowspan=1)
spot_price.loc[start_date:end_date].plot(ax=ax3,sharex=False, sharey=False, legend=False); 
ax3.axvline(datetime(2012,4,10), 0, 1, color="darkgoldenrod") 
dates = [pd.Timestamp('2012-05-01'), pd.Timestamp('2013-05-02'), pd.Timestamp('2014-05-03')]
ymin, ymax = ax3.get_ylim()
ax3.vlines(x=dates, ymin=ymin, ymax=ymax, color='r')
ax3.set_ylabel('NG spot price($)')
ax3.set_ylim(0, 9)
ax3.set_yticks([2, 4, 6, 8])

plt.subplots_adjust(wspace=0.5, hspace=0.0);



# In[69]:

from datetime import datetime
datetime(2012,5,1)


# In[ ]:

storage.loc[start_date:].plot(ax=ax,sharex=True, sharey=False); 
consumption_production.loc[start_date:].plot(ax=ax, legend=False)
import_export.loc[start_date:].plot(ax=ax, legend=False)

ax.set_ylabel('Volume(Bcf)')
ax.set_ylim(0, 4000)
ax.set_yticks([1000, 2000, 3000, 4000])
fillcolor = 'darkgoldenrod'
ax.axhline(2000, 0, 1, color=fillcolor) 
ax.axhline(2742, 0, 1, color=fillcolor) 

#ax.set_title('Storage');
ax.text(0.025, 0.9, 'Storage', va='top', color='blue',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.6, 'Consumption', va='top', color='green',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.45, 'Production', va='top', color='red',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.14, 'Import', va='top', color='cyan',transform=ax.transAxes, fontsize=10)
ax.text(0.025, 0.08, 'Export', va='top', color='purple',transform=ax.transAxes, fontsize=10)
#ax.xaxis.set_ticklabels([])
#for label in ax.get_xticklabels():
#    label.set_visible(False)


# In[ ]:

ung['Adj Close'].loc[start_date:].plot(ax=ax2,sharex=True, sharey=False); 
ax2.set_ylabel('Price(Dollar)')
ax2.text(0.025, 0.9, 'UNG stock price', va='top', color='blue',transform=ax2.transAxes, fontsize=10)
#ax.set_title('UNG stock price');


# In[ ]:

spot_price.loc[start_date:].plot(ax=ax3,sharex=True, sharey=False, legend=False); 
#ax.axvline(100, 0, 1, color=fillcolor) 
ax3.set_ylabel('Price(Dollar)')
ax3.text(0.025, 0.9, 'NG spot price', va='top', color='blue',transform=ax3.transAxes, fontsize=10)
#ax.set_title('NG spot price');


# In[24]:

import_price = pd.read_csv('csv/ng-importprice-monthly.csv',index_col='Date', parse_dates=True)
import_price.head(5)


# In[26]:

spot_price = pd.read_csv('csv/HenryHub-spotprice-daily.csv',index_col='Date', parse_dates=True)
spot_price.tail(15)


# In[27]:

export_price = pd.read_csv('csv/ng-exportprice-monthly.csv',index_col='Date', parse_dates=True)
export_price.head(5)


# In[28]:

import_export_spot = pd.concat([import_price, export_price, spot_price], axis=1, join_axes=[import_price.index])
import_export_spot.tail(5)


# In[29]:

import_export_spot.columns=['import','export','spot']
import_export_spot.loc['2010-1-1':].plot(title='ng price')


# In[42]:

ax1 = plt.subplot2grid((3,3), (0,0), colspan=3)
ax2 = plt.subplot2grid((3,3), (1,0), colspan=2)
ax3 = plt.subplot2grid((3,3), (1, 2), rowspan=2)
ax4 = plt.subplot2grid((3,3), (2, 0))
ax5 = plt.subplot2grid((3,3), (2, 1))


# In[43]:

ax2 = plt.subplot2grid((3,3), (1, 0), colspan=2)
ax3 = plt.subplot2grid((3,3), (1, 2), rowspan=2)


# In[46]:

ax = plt.subplot2grid((4,1),(0, 0),colspan=1, rowspan=2)
ax2 = plt.subplot2grid((4,1),(2, 0),colspan=1, rowspan=2)
plt.subplots_adjust(wspace=0.5, hspace=0.0);


# In[ ]:



