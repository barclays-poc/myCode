

/* Gets query string parameters */
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


/* Sets all anchor tags for smooth scrolling */
function smoothScroll()
{
    $(document).ready(function(){
        $('a[href^="#"]').on('click',function (e)
        {
            /* Surpresses usual behaviour */
            e.preventDefault();

            var target = this.hash;

            if(target == "#prevent")
                return;
            
            console.log(target);
            smoothScrolls( target );
        });
    });
}


/* Sets a particular anchor tag for smoothing scrolling */
function smoothScrolls(target)
{
    /* changes Html and bodybehaviours */
    $('html, body').stop().animate({
        'scrollTop': ($(target).offset().top - 40 )
    }, 1000, 'swing', function () {
        window.location.hash = target;
    });
}


/* Escapes Html */
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


/* Unescapes Html */
function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

/*
function windowChange()
{
    window.onorientationchange = function() 
        { 
            window.location.reload(); 
        };
}
*/
