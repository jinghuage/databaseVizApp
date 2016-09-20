
# entry point to use this app
import aflstatsgraph, aflsubgraphs


def graph(**kwargs):


    print "aflviz.reqHandler.graph"

    style = kwargs.get('style')
    year = kwargs.get('year')

    exkwargs = kwargs.get('exarg')

    print year, style, exkwargs

    plotid=''
    fightml=''
    if style=='all' or style=='summary':
        plotid, fightml = aflstatsgraph.request_graph(year, style)
    else:
        plotid, fightml = aflsubgraphs.request_graph(year, style, **exkwargs)
    msg = 'plotid:'+ plotid
    msg += ('fightml:<p> Graph style: ' +style+'</p>\n'+ fightml)


    return msg


if __name__ == '__main__':

    html = reqHandler({'year':'2013', 'style': 'all', 'exarg': {}})
