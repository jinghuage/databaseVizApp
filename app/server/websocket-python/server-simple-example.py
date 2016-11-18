# https://github.com/dpallot/simple-websocket-server

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

# this is a group chat handler - messages are broadcasted to all clients
clients = []
class SimpleChat(WebSocket):

    def handleMessage(self):
       for client in clients:
          if client != self:
             client.sendMessage(self.address[0] + u' - ' + self.data)

    def handleConnected(self):
       print self.address, 'connected'
       for client in clients:
          client.sendMessage(self.address[0] + u' - connected')
       clients.append(self)

    def handleClose(self):
       clients.remove(self)
       print self.address, 'closed'
       for client in clients:
          client.sendMessage(self.address[0] + u' - disconnected')

server = SimpleWebSocketServer('', 9999, SimpleChat)
server.serveforever()
