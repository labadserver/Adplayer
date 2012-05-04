$ADP.PrivacyInfo = function(args) {
    var self = arguments.callee;
    if (!self.prototype.init) {
      self.prototype.init = function(args) {
          this.valid    = args.title || args.text || args.linkText ? true : false;
          this.title    = args.title;
          this.text     = args.text;
          this.url      = args.url;
          this.linkText = args.linkText;
        };
      self.prototype.getTitle = function() {
          return this.title;
        };
      self.prototype.getText = function() {
          return this.text;
        };
      self.prototype.getURL = function() {
          return this.url;
        };
      self.prototype.getLinkText = function() {
          return this.linkText;
        };
      self.prototype.isValid = function() {
          return this.valid ? true : false;
        };
      self.prototype.render = function() {
          var title    = this.getTitle();
          var text     = this.getText();
          var linkText = this.getLinkText();
          var url      = this.getURL();
          var s = '';
          if (linkText) s += linkText;
          if (url) s = '<a href="' + url + '" target="_blank">' + s + '</a>';
          if (s) s += '<br />';
          if (text)  s = text + '<br />' + s;
          if (title) s = title + '<br />' + s;
          return s;
        };
    }

    this.init(args);
  };