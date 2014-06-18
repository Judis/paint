var TITLE = ' - Пейнтбольный клуб «Гангстер»';
var background, content, vkAPI;


var routes = {
  ""           : "news",
  "news"       : "news",
  "price"      : "price",
  "photos"     : "photos",
  "contacts"   : "contacts",
  "events"     : "events",
  "poligons"   : "poligons",
  "photos/:id" : "album"
}


var scrollHeader = function(position) {
  background.animate({
    'background-position-x' : position+'px'
  }, 2000);
}


var loadTemplate = function(template) {
  return $.get('/templates/'+template+'.hbs');
}


var _leadZeroDate = function(date) {
  date = new Date(date*1000);
  day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
  month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1;
  year = date.getFullYear();

  return day+'.'+month+'.'+year;
}


var _loadPage = function(page) {
  content.html('');
  id = page.split('/')[1];
  page = pages[routes[_prepairPath(page)]];

  window.document.title = page.title + TITLE;

  scrollHeader(page.header);

  if (page.loader) {
    page.loader(id);
  } else {
    page.content(id);
  }
}


var _prepairPath = function(path) {
  path = path.replace('#', '');
  if (path.indexOf('/') > -1) {
    path = path.split('/');
    path = path[0]+'/:id';
  }

  return path;
}


var pages = {
  "news" : {
    header   : -520,
    title    : 'Новости',
    template : 'news',
    loader   : function() {
      vkAPI.getNews(pages["news"].content);
    },
    content  : function(data) {
      loadTemplate(pages["news"].template)
      .done(function(template) {
        template = Handlebars.compile(template);

        $.each(data, function(index, item) {
          if (typeof(item) == 'object' && item.attachment.type != 'video') {
            item.date = _leadZeroDate(item.date);
            content.append(template(item));
          }
        });
      });
    }
  },

  "price" : {
    header   : -520,
    title    : 'Цены',
    template : 'prices',
    content  : function() {
      loadTemplate(pages["price"].template)
      .done(function(template) {
        template = Handlebars.compile(template);

        content.append(template());
      });
    }
  },

  "photos" : {
    header   : 1160,
    title    : 'Фотографии',
    template : 'albums',
    loader   : function() {
      vkAPI.getAlbums(pages["photos"].content);
    },
    content  : function(data) {
      loadTemplate(pages["photos"].template)
      .done(function(template) {
        template = Handlebars.compile(template);

        $.each(data, function(index, item) {
          content.append(template(item));
        });
      });
    }
  },

  "album" : {
    header   : -520,
    title    : 'Альбом',
    template : 'photos',
    loader   : function(id) {
      vkAPI.getPhotos(id, pages["album"].content);
    },
    content  : function(data) {
      loadTemplate(pages["album"].template)
      .done(function(template) {
        template = Handlebars.compile(template);
        content.append('<div class="album"></div>');
        album = content.find('.album');

        $.each(data, function(index, item) {
          album.append(template(item));
        });

        $('.content .album').magnificPopup({
          delegate: 'a',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function(item) {
              return item.el.attr('title') + '<small>Пейнтбольный клуб "Гансгстер"</small>';
            }
          }
        });

      });
    }
  },

  "contacts" : {
    header   : 1000,
    title    : 'Контакты',
    template : 'contacts',
    content  : function() {
      loadTemplate(pages["contacts"].template)
      .done(function(template) {
        template = Handlebars.compile(template);

        content.append(template());
      });
    }
  },

  "events" : {
    header   : 2380,
    title    : 'Мероприятия',
    template : 'events',
    content  : function() {
      loadTemplate(pages["events"].template)
      .done(function(template) {
        template = Handlebars.compile(template);

        content.append(template());
      });
    }
  },

  "poligons" : {
    header   : 1000,
    title    : 'Площадки',
    template : 'poligons',
    content  : function() {
      loadTemplate(pages["poligons"].template)
      .done(function(template) {
        template = Handlebars.compile(template);

        content.append(template());
      });
    }
  }
}


$(function() {
  background = $('.background');
  content = $('.content');
  vkAPI = new VKLoader();

  $(window).on('hashchange',function(){
    _loadPage(window.location.hash.replace('#', ''));
  });

  _loadPage(window.location.hash.replace('#', ''));
});