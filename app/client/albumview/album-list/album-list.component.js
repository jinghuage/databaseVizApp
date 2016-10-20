angular.
  module('albumList').
  component('albumList', {
    templateUrl: 'album-list/album-list.template.html',
    controller: ['Restful',
      function AlbumListController(Restful) {
        var self = this;

        //this.phones = Restful.query();
        self.albums = Restful.query({
          itemDir:"album",
          itemId: "albums"
        }, function(albums){
          //console.log(albums[0]);
        });

        //console.log(self.albums);

        self.orderProp = 'class';
        self.query = '2016';
      }
    ]
  });
