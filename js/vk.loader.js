var VKLoader = function() {
  var appID  = 4296717,
      pageID = -49423448;

  VK.init({
    apiId: appID
  });


  this.getNews = function(callback, offset) {
    if (offset == undefined) {offset = 0}

    VK.Api.call(
      'wall.get',
      {
        owner_id: pageID,
        offset: offset
      },
      function(r) {
        console.log(r.response);
        if(r.response) {
          callback(r.response);
        }
      }
    );
  }


  this.getAlbums = function(callback) {
    VK.Api.call(
      'photos.getAlbums',
      {
        owner_id: pageID,
        need_covers: 1
      },
      function(r) {
        if (r.response) {
          callback(r.response);
        }
      }
    );
  }


  this.getPhotos = function(id, callback) {
    VK.Api.call(
      'photos.get',
      {
        owner_id: pageID,
        album_id: id
      },
      function(r) {
        if (r.response) {
          callback(r.response);
        }
      }
    );
  }
}