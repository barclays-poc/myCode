function populateSections()
{   
    var selector = document.getElementById( 'platform-selector' );
    var platformId = selector.options[selector.selectedIndex].value;
	
	if(platformId != null && platformId != 1)
	{
	$("#webbody").slideDown("slow");
    /* Insert API call here */
    $.getJSON("http://localhost:8888/api/contents/"+ platformId, function(data) {
    populateSection('requirements', data.requirements.content, data.requirements.information, data.requirements.additional, data.requirements.tutorial);
    populateSection('design', data.design.content, data.design.information, data.design.additional, data.design.tutorial);
    populateSection('build', data.build.content, data.build.information, data.build.additional, data.build.tutorial);
    populateSection('test', data.test.content, data.test.information, data.test.additional, data.test.tutorial);
	})}else {
		$("#webbody").slideUp("slow");
	}
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
   
   /* loops through to remove old content*/
   while (div.hasChildNodes()) {
       div.removeChild(div.lastChild);
    }
    
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