import importlib
import sys

class routeHandler:
    def __init__(self, config):
        self.app = config['app']
        self.handler = None

    def createHandler(self):
        print "import", self.app

        mod = importlib.import_module(self.app)
        self.handler = mod.graph
