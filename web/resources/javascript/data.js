function init(assetId, tutorialId)
{
    populatePlatforms();
    populateAsset(assetId);
    populateTutorial(tutorialId)
}


function populatePlatforms()
{
    <!-- Provide API Endpoint-->
    $('#assetTree').tree({
        dataUrl: '/data/platforms.json',
        autoOpen: 0,
        closedIcon: '+',
        openedIcon: '-'
    });
    
    // bind 'tree.click' event
    $('#assetTree').bind(
        'tree.click',
        function(event) {
            // The clicked node is 'event.node'
            var node = event.node;
            if( node.tutorialId != 'undefined')
            {
                populateAsset(node.parent.assetId);
                populateTutorial(node.tutorialId)
            }
        }
    );
}


function populateAsset(id)
{   
    if(id != null)
    {
        <!-- Provide API Endpoint-->
        var url = "/data/asset.json";

        $.getJSON( url, function( data ) 
        {
            <!-- Bind here -->
            alert(data);
        });
    }
}


function populateTutorial(id)
{   
    if(id != null)
    {
        <!-- Provide API Endpoint-->
        var url = "/data/tutorial.json";

        $.getJSON( url, function( data ) 
        {
            <!-- Bind here -->
            alert(data);
        });
    }
}