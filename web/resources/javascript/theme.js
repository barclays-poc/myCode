function setStylesheet()
{
    var style = document.createElement('link');
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "themes/" + config.theme + "/style.css";
    document.getElementsByTagName("head")[0].appendChild(style);
};

function setFavicon()
{
    /* Adds the favicon */
    var fav = document.createElement('link');
    fav.type = "image/x-icon";
    fav.rel = "shortcut icon";
    fav.href = "themes/" + config.theme + "/favicon.ico";
    document.getElementsByTagName("head")[0].appendChild(fav);
};

function setLogo()
{
    /* Sets the logo image */
    var logo = document.getElementById("logo");
    logo.src = "themes/" + config.theme + "/logo.png";
};

function setTitle()
{
    /* Sets the logo image */
    var title = document.getElementById("title");
    title.innerHTML = config.title;
};