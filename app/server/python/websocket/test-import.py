
if __name__ == '__main__':

    print __package__


    if __package__ is None:

        # if you are at app/server/websocket/, and do this
        # python test-import.py
        # then adding the parent path to sys.path, then import from that dir

        print "not in a package"

        import sys
        from os import path
        #sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
        parentPath = path.abspath("..")
        print "parentPath is : ", parentPath

        if parentPath not in sys.path:
            sys.path.insert(0, parentPath)

        #from app_template.aflviz import reqhandler
        import app_template.aflviz

        import importlib
        mod = importlib.import_module("app_template.aflviz")
        handler = mod.reqhandler.graph


    else:
        # if you are at app/server, and do this:
        # python -m python.websocket.test-import
        # relative import this way will work

        print "inside a package"

        #import ..app_template.aflviz #this is syntax error!
        from ..app_template.aflviz import reqhandler
