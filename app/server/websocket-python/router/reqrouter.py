# A message is a request json object, very similar to a routing url
# A example message:
# {
#     server-app: app-name at server side
#     message: {'argname1': argvalue1, 'argname2':argvalue2, ...}
# }

# So suppose the client will stringify the json object and send to
# server as a request

# reqRouter will use json package to retrieve the object
# then do an async thing to import the app and call the plot
# function, after the plot is done, return the generated html

# finally, server will send the html to client

# So, how to implement?
# check things like:
# Tornado event handling, python 2.7 async programming
# url routing
# routing config file?



import multiprocessing as mp
import time
import json
import sys
from collections import defaultdict
import re
import logging
logger = logging.getLogger('router')
logger.setLevel(logging.DEBUG)

from routeHandler import routeHandler

class reqRouter:
    def __init__(self):
        self.routers = defaultdict(lambda:None)

        self.add_router("aflviz", {
            'app': "app_template.aflviz.reqhandler"
        })

        # self.add_router("ngviz", {
        #     'app': "app_template.ngviz-bokeh"
        # })


    def dispatch_async(self, request, callback):
        # this need to be implemented as async call
        # use multiprocessing poool.apply_async()
        # http://stackoverflow.com/questions/8533318/python-multiprocessing-pool-when-to-use-apply-apply-async-or-map
        route = request['server-app']
        parameters = request['message']

        funcname = sys._getframe().f_code.co_name
        print funcname, route

        if self.routers[route]:
            pool = mp.Pool()
            pool_func = self.routers[route].handler
            pool.apply_async(pool_func,
                args = parameters,
                callback = callback)
            pool.close()
            pool.join()



    def add_router(self, symbol, config):
        print "add_router", symbol, config

        self.routers[symbol] = routeHandler(config)
        self.routers[symbol].createHandler()

        #funcname = sys._getframe().f_code.co_name
        #logger.log(logging.DEBUG, funcname + ':' + self.print_router(symbol))

    def apply_router(self, request):
        # this is sync version of dispatch_async

        funcname = sys._getframe().f_code.co_name
        route = request['server-app']
        parameters = request['message']
        print funcname, route, parameters


        msg = self.routers[route].handler(**parameters)

        #logger.log(logging.DEBUG, msg)
        return msg


    def print_router(self, symbol):
        msg = ''
        return msg

    def print_all_routers(self):
        msg = ''
        for symbol in self.routers:
            msg += self.print_router(symbol)

        return msg


    def delete_router(self, symbol):
       if symbol in self.routers:
           del self.routers[symbol]

    def delete_all_routers(self):
        for symbol in self.routers:
            self.delete_router(symbol)
