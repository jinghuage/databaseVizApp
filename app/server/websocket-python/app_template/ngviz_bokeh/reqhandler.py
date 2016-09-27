import re
import ngviz
mygraph = ngviz.graph()


def graph(**kwargs):


    print "ngviz-bokeh.reqHandler.graph(), ", kwargs


    mygraph.update_config(**kwargs)
    plotdiv, figscript = mygraph.plot()

    plotid = re.findall(r'.* id="(.*)".*', plotdiv)
    print plotid[0]

    msg = 'plotid:'+plotid[0]
    msg += '\n'
    msg += ('fightml:' + plotdiv + '\n' + figscript)

    return msg


if __name__ == '__main__':

    kwargs = {'timerange':['2014-09-01', '2015-12-01'],
                'symbols':{'ung':1.0, 'uso':1.0},
                'datafiles':{'HenryHub-spotprice':5.0}
                }
    html = graph(**kwargs)
