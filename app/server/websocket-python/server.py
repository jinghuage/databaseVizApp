import tornado.web
import tornado.websocket
import tornado.ioloop

#import msgfilter

#import Settings
#import tornado.web
import tornado.httpserver

# to test the websocket directly:
# uncomment the IndexHandler part of code, line 20, and 73
# open localhost:9999 to test the client

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
        self.render("websocket.html")


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    clients = set()

    def open(self):
        print "New client connected"
        self.clients.add(self)
        self.write_message("You are connected")

    def on_message(self, message):
        #msg = self.myfilter.process_cmd(message)
        msg="you sent:"+message
        self.write_message(msg)


    @classmethod
    def dispatch_message(cls, message):
        #print "Processing ... %s" % message
        #filtered_msg = cls.myfilter.apply_filter(message[0])
        msg = "dispatched:"+message
        for client in cls.clients:
            client.write_message(msg)
            #you can also implement dispatch different message to different client later...

    def on_close(self):
        print "Client disconnected"

    #http://stackoverflow.com/questions/24800436/under-tornado-v4-websocket-connections-get-refused-with-403
    #http://stackoverflow.com/questions/24851207/tornado-403-get-warning-when-opening-websocket
    def check_origin(self, origin):
        #return True
        #return bool(re.match(r'^.*?\.mydomain\.com', origin))
        import re
        print origin
        return bool(re.match(r'^.*?localhost', origin))

application = tornado.web.Application([
    (r"/ws", WebSocketHandler),
    #(r"/", IndexHandler),
    #(r'/web/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),
])


if __name__ == "__main__":
    application.listen(9999)

    import logging
    logging.getLogger().setLevel(logging.DEBUG)

    tornado.ioloop.IOLoop.instance().start()
