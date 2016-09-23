import ng-price-bokeh
mygraph = ng-price-bokeh.graph()


def graph(**kwargs):


    print "ngviz-bokeh.reqHandler.graph"

    fightml=''


    fightml = mygraph.request_graph(**kwargs)


    return fightml


if __name__ == '__main__':

    kwargs = {'timerange':['2012-06-10', '2016-09-05'],
                'symbols':{'ung':1.0},
                'datafiles':{'HenryHub-spotprice':5.0}
                }
    html = graph(**kwargs)
