angular.
  module('albumList').
  component('albumList', {
    templateUrl: 'album-list/album-list.template.html',
    controller: ['Restful','$filter',
      function AlbumListController(Restful, $filter) {
        var self = this;

        //this.phones = Restful.query();
        self.albums = Restful.query({
          itemDir:"album",
          itemId: "albums"
        }, function(albums){
          //console.log(albums[0]);
        });

        //console.log(self.albums);

        self.classYear = ['collection', 'current'];
        self.galleryCategory = ['Visualization Service', 'Other'];


        self.orderProp = 'class';
        self.query = '';

        self.applyFilter = function(q){
          //console.log(q);
          self.query = q;
          //var filtered = $filter('filter')(self.albums, q);
        };
      }
    ]
  });
