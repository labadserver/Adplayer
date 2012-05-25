module("$ADP.Util.JSON");

test("Default JSON Stringify", function() {
  var testobj = [{"title":"Title","text":"text","url":"http://url/","linkText":"linkText"}]
  var expectedString = '[{"title":"Title","text":"text","url":"http://url/","linkText":"linkText"}]';
  
  ok( true, expectedString == $ADP.Util.JSON.stringify(testobj));
});

test("Fallback JSON Stringify Test", function() {
  function stringify(obj) {
    function s(a,b,c){
      for(b in(c=a==''+{}&&[])&&a)
        c.push(s(b)+':'+s(a[b]));
      return ''+a===a?'"'+a.replace(/[\x00-\x19\\]/g,function(x){return'\\x'+x.charCodeAt().toString(16)})+'"':a&&a.length?'['+m(a)+']':c?'{'+c+'}':a
    }

    function m(a) {
        var o= new Array(a.length);
        for (var i= 0, n=a.length; i<n; i++) o[i]= s(a[i]);
        return o;
    }
    return s(obj);
  }
  var testobj = [{"title":"Title","text":"text","url":"http://url/","linkText":"linkText"}]
  var expectedString = '[{"title":"Title","text":"text","url":"http://url/","linkText":"linkText"}]';
  ok( true, expectedString == stringify(testobj));
});

test("Full Conversion Test (OBJ -> STRING -> OBJ -> STRING)", function() {
  var testobj = [{"title":"Title","text":"text","url":"http://url/","linkText":"linkText"}]
  var expectedString = '[{"title":"Title","text":"text","url":"http://url/","linkText":"linkText"}]';
  
  ok( true, expectedString == $ADP.Util.JSON.stringify($ADP.Util.JSON.parse($ADP.Util.JSON.stringify(testobj))));
});
