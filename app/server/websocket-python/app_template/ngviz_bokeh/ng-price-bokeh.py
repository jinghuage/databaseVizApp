
import numpy as np
import pandas as pd
from bokeh.charts import Horizon
from bokeh.plotting import figure, output_file, show
from bokeh.models import CustomJS, ColumnDataSource, Slider
from bokeh.models import HoverTool
import pandas_datareader.data as web
import datetime
import os
import calendar
#calendar.day_name[datetime.datetime.today().weekday()]
#calendar.day_name[datetime.datetime(2016,3,25).weekday()]

# helper func
def read_csvfile(filename, datecol):
    if os.path.isfile(filename) == False:
        print filename + " does not exist"
        return None

    return pd.read_csv(filename,
                        parse_dates={'datetime':[datecol]},
                        index_col='datetime',
                        keep_date_col=True)
                        #index_col='Date', parse_dates=True)



class graph:

    # class vars
    dir_path = os.path.dirname(os.path.realpath(__file__))
    NG_datadesc = {
    'HenryHub-spotprice':
        {'filename': dir_path+'/csv/HenryHub-spotprice-daily-Sep12-2016.csv',
        'datecol': 'Date',
        'freq': 'daily',
        'datacol': 'Henry Hub Natural Gas Spot Price (Dollars per Million Btu)'},

    'Storage': {'filename':dir_path+'/csv/ng-storage-weekly.csv',
        'datecol': 'Week ending',
        'freq': 'weekly',
        'datacol':'Total Lower 48'},

    'Production':{'filename':dir_path+'/csv/ng-consumption-monthly.csv',
        'datecol': 'Date',
        'freq': 'monthly',
        'datacol':'U.S. Natural Gas Total Consumption (MMcf)'},
    }


    def __init__(self):
        self.alldata = {}
        self.timerange = []
        self.symbols = {}
        self.datafiles = {}


    def update_config(self, **kwargs):
        print '***'
        print 'graph.update_config()', kwargs
        print '***'

        # print datetime.datetime.strptime('20170101', '%Y%m%d')
        # s = pd.Series(['3/11/2000', '3/12/2000', '3/13/2000']*10)
        # print pd.to_datetime(s,infer_datetime_format=True)
        # print pd.to_datetime('20170101', infer_datetime_format=True)
        # print pd.to_datetime('2017-09-09', infer_datetime_format=True)
        # print datetime.datetime.today()

        for key, value in kwargs.items():
            if key == 'timerange':
                value = map(lambda x: datetime.datetime.today() if x =='today' else pd.to_datetime(x, infer_datetime_format=True), value)
                self.timerange = value
                print self.timerange
            elif key == 'symbols':
                self.symbols = value
                print self.symbols
            elif key == 'datafiles':
                self.datafiles = value
                print self.datafiles



    def get_data_by_symbol(self):
        print '***'
        print 'graph.get_data_by_symbol()'
        print '***'

        start = datetime.datetime(2007, 4, 18)
        end = datetime.datetime.today()

        # if self.timerange:
        #     start = self.timerange[0]
        #     end = self.timerange[1]

        for s in self.symbols:
            if s not in self.alldata:
                self.alldata[s] = web.DataReader(s, 'yahoo', start, end)
            print s, map(lambda x:datetime.datetime.strftime(x,'%Y-%m-%d'), [start, end]), self.alldata[s].shape

        #ung = web.DataReader("UNG", 'yahoo', start, end)
        #ugaz = web.DataReader("UGAZ",'yahoo',start,end)
        #ung.ix['2010-01-04']
        #print ung[-5:]
        #print ugaz.columns
        #print ung.shape
        #ugaz.head(5)

    def get_data_by_file(self):
        print '***'
        print 'graph.get_data_by_file()'
        print '***'

        for d in self.datafiles:
            if d not in self.alldata:
                filename = self.NG_datadesc[d]['filename']
                datecol = self.NG_datadesc[d]['datecol']
                print filename, datecol
                self.alldata[d] = read_csvfile(filename, datecol)
            print d, self.alldata[d].shape


    def check_data(self, k):
        print '***'
        print 'graph.check_data() ', k
        print '***'

        start = self.timerange[0]
        end = self.timerange[1]
        print map(lambda x:datetime.datetime.strftime(x,'%Y-%m-%d'), [start, end])

        rng = pd.date_range(start, end, freq='B')
        print 'count of weekdays: ', rng.size

        d = self.alldata[k][start:end+pd.Timedelta(days=1)]
        print d.shape

        print "extra data in", k, "but not in timerange. these will be dropped"
        df = d[~d.index.isin(rng)]
        print df

        d_fill = d.reindex(rng, method='bfill', copy=False) #fill_value=0)
        print "filled data in", k, "according to timerange"
        print d_fill[~rng.isin(d.index)]

        self.alldata[k] = d_fill


    def check_all_data(self):
        print '***'
        print 'graph.check_all_data() '
        print '***'

        for s in self.symbols:
            check_data(s)

        for d in self.datafiles:
            check_data(d)



    def plot(self):
        print '***'
        print 'graph.plot()'
        print '***'

        plotfilename = self.dir_path+"/ngspot_ung.html"
        output_file(plotfilename)

        # create a new plot with a a datetime axis type
        TOOLS="crosshair,pan,wheel_zoom,box_zoom,reset,hover,previewsave"
        p = figure(width=800, height=350, x_axis_type="datetime", tools=TOOLS)

        start = self.timerange[0]
        end = self.timerange[1]
        #days = (end-start).days + 1
        graphDate_daily = pd.date_range(start, end, freq='B')
        print graphDate_daily.size

        for s,m in self.symbols.items():
            sdata = self.alldata[s][start:end]
            print sdata.shape

            source = ColumnDataSource(data=dict(
                Date=graphDate_daily,
                DateLabel=map(lambda x:datetime.datetime.strftime(x,'%Y-%m-%d'), sdata.index),
                Data=sdata['Close'],
                AdjData=sdata['Adj Close'] * m,
            ))
            p.line('Date', 'AdjData',
                source=source, color='navy',legend=s+"*"+str(m))

        for d,m in self.datafiles.items():
            ddata = self.alldata[d][start:end]
            print ddata.shape

            ddate = self.NG_datadesc[d]['datecol']
            dd = self.NG_datadesc[d]['datacol']

            source = ColumnDataSource(data=dict(
                Date=graphDate_daily,
                DateLabel=ddata[ddate],
                Data=ddata[dd],
                AdjData=ddata[dd]*m,
            ))

            p.line('Date', 'AdjData', source=source, color='red',legend=d+"*"+str(m))

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
        #show(p)
        #show(p2)
        with open(plotfilename, "r") as fh:
            return fh.read()
            #return fh.readlines()


    def request_graph(self, **kwargs):
        mygraph.update_config(**kwargs)
        mygraph.get_data_by_symbol()
        mygraph.get_data_by_file()

        mygraph.check_all_data()
        plothtml = mygraph.plot()
        return plothtml


if __name__ == '__main__':

    mygraph = graph()

    kwargs = {'timerange':['2012-06-10', '2016-09-05'],
                'symbols':{'ung':1.0},
                'datafiles':{'HenryHub-spotprice':5.0}
                }

    plothtml = mygraph.request_graph(**kwargs)
    #print plothtml[5:15]
