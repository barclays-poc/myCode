function populateSections()
{   
    var data = document.getElementById( 'platform-data' ); 
    var platform = JSON.parse( data.innerHTML );

    populateSection('requirements', platform.requirements.content, platform.requirements.information,                                               platform.requirements.additional, platform.requirements.tutorial);
}

function populateSection(section, content, information, additional, tutorial)
{
    populateMenu(section + '-information-links', information);
    populateMenu(section + '-additional-links', additional);
    populateMenu(section + '-tutorial-links', tutorial);
    populateContent(section + '-content', content);
}

function populateMenu(divName, links)
{
    var div = document.getElementById( divName );  

    /* Loops the data and creates links */
    if(links!=null && links.length > 0)
    {
        for (i = 0; i < links.length; i++) 
        { 
            var anchor = document.createElement('a');
            anchor.innerHTML = links[i].title;

            anchor.setAttribute('href', links[i].url);
            if (typeof links[i].target != 'undefined')
            {
                anchor.setAttribute('target', links[i].target);    
            }
            div.appendChild( anchor );
        }
    }
}

function populateContent(divName, content)
{
    var div = document.getElementById( divName );  
    div.innerHTML = content;
}