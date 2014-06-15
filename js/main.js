(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };

}(this, this.document));
function loadGists() {
  var els = $('code[gist]'), gists = {}, code = [], stylesheets = [];
  // Get elements referencing a gist and build a gists hash referencing the elements that use it
  els.each(function(idx, rawEl) {
    var el = $(rawEl), gist = el.attr('gist');
    rawEl.gist = gist;
    rawEl.file = el.attr('file');
    gists[gist] = gists[gist] || { targets: [] };
    gists[gist].targets.push(el);
  });
  // Load the gists
  $.each(gists, function(name, data) {
    $.getJSON(name + '?callback=?', function(data) {
      var gist = gists[name];
      gist.data = data;
      // Only insert the stylesheets once
      if(stylesheets.indexOf(gist.data.stylesheet) < 0) {
        stylesheets.push(gist.data.stylesheet);
        $('head').append('<link rel="stylesheet" href="' + gist.data.stylesheet + '" />');
      }
      gist.files = $(gist.data.div).find('.gist-file');
      gist.outer = $(gist.data.div).first().html('');
      // Iterate elements refering to this gist
      $(gist.targets).each(function(idx, target) {
        var file = target.get(0).file;
        if(file) {
          var o = gist.outer.clone();
          var c = '<div class="gist-file">' + $(gist.files.get(gist.data.files.indexOf(file))).html() + '</div>';
          o.html(c);
          target.replaceWith(o);
        }
        else {
          target.replaceWith(gist.data.div);
        }
      });
    });
  });
}
// Load them on document ready
$(loadGists);