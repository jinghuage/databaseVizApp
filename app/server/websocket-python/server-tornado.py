#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop

from router.reqrouter import reqRouter
import json

#import os
#static_path = os.path.join(os.path.dirname(__file__), "web")

import sys
from os import path
#sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
#parentPath = path.abspath("..")
#print "parentPath is : ", parentPath

mypath = path.abspath(__file__)
if mypath not in sys.path:
    sys.path.insert(0, mypath)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/ws", WebSocketHandler),
            #(r'/web/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),
            #(r"/", IndexHandler),
        ]

        settings = {
            #"template_path": Settings.TEMPLATE_PATH,
            #"static_path": Settings.STATIC_PATH,
            #"static_path": os.path.join(os.path.dirname(__file__), "web")
        }
        tornado.web.Application.__init__(self, handlers, **settings)


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("web/index-aflvis.html")


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    #Variables declared inside the class definition, but not inside a method are class or static variables:
    # class variables can be accessed directly using class.var , or through instance, such as self.var
    clients = set()
    my_router = reqRouter()

    def open(self):
        print "New client connected"
        self.clients.add(self)
        self.write_message("You are connected")

    def on_message(self, message):
        print "Message received:", message

        def handle_result(result):
            print "Send back result"
            self.write_message(result)

        req = json.loads(message)
        #print req
        if req['server-app'] == 'echo' or req['message'] == 'disconnect':
            self.write_message('you sent:' + req['message'])
        else:
            #async dispatch function, take a callback (handle_result)
            #self.my_router.dispatch_async(req, handle_result)
            result = self.my_router.apply_router(req)
            self.write_message(result)


    # this is for broadcasting a message to all clients (I think)
    @classmethod
    def dispatch_message(cls, message):
        #print "Processing ... %s" % message
        for client in cls.clients:
            msg = "message for this client" + client
            client.write_message(msg)
            #you can also implement dispatch different message to different client later...

    def on_close(self):
        print "Client disconnected"

    #http://stackoverflow.com/questions/24800436/under-tornado-v4-websocket-connections-get-refused-with-403
    #http://stackoverflow.com/questions/24851207/tornado-403-get-warning-when-opening-websocket
    def check_origin(self, origin):
        return True
        # #return bool(re.match(r'^.*?\.mydomain\.com', origin))
        # import re
        # print origin
        # return bool(re.match(r'^.*?localhost', origin))

application = tornado.web.Application([
    (r"/ws", WebSocketHandler),
    #(r"/", IndexHandler),
    #(r'/web/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),
], autoreload=True)



if __name__ == "__main__":
    application.listen(9999)


    import logging
    logging.getLogger().setLevel(logging.DEBUG)

    #create_zmqsock_sub()

    tornado.ioloop.IOLoop.instance().start()
