angular.
  module('albumView').
  component('albumView', {
    templateUrl: 'album-view/album-view.template.html',
    controller: ['$routeParams', 'Restful', '$timeout',
      function AlbumViewController($routeParams, Restful, $timeout) {
        var self = this;

        self.album = Restful.get({
          itemDir:"album",
          itemId: $routeParams.albumId}, function(album) {
            console.log(album);
            var start = album.start;
            self.showalbum = album.myalbums[start];
            self.setImage(self.showalbum.images[0]);

            $timeout(function () {
              self.applyNav(self.showalbum);
            }, 10);
        });


        self.setImage = function(image) {
          //console.log('setImage:',image);
          self.mainImage = image;
        };

        self.applyNav = function(view){
          console.log('applyNav',view);

          self.showalbum = view;
          //self.setNavStyle(self.showalbum);
          $(".active").removeClass('active');
          $("." + view.name).addClass('active');
        }


      }
    ]
  });
