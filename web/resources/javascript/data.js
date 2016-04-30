function init(assetId, tutorialId)
{
    populateTutorials();
    populateTutorial(1);               
}

function populateTutorials()
{
    <!-- Provide API Endpoint-->
    var url = "/data/tutorials.json";
    
    $.getJSON( url, function( data ) 
    {
        // define the item component
    Vue.component('item', {
      template: '#item-template',
      replace: true,
      props: {
        model: Object
      },
      data: function () {
        return {
          open: false
        }
      },
      computed: {
        isFolder: function () {
          return this.model.children &&
            this.model.children.length
        },
      },
      methods: {
        toggle: function () {
          if (this.isFolder) {
            this.open = !this.open
          }
        },
        addChild: function () {
          this.model.children.push({
            name: 'new stuff'
          })
        }
      }
    })
        
    // boot up the demo
    var demo = new Vue({
      el: '#tutorial-tree',
      data: {
        treeData: data
      }
    })
    });
}

function populateTutorial(id)
{
    hidePage();
    
    if(id != null)
    {
        <!-- Provide API Endpoint-->
        var url = "/data/tutorial.json";

        $.getJSON( url, function( data ) 
        {
            $("#asset-title").text(data.name);
            $("#asset-diagram").attr("src", data.asset.diagram);
            $("#asset-diagram-link").attr("href", data.asset.diagram);
            $("#asset-content").html(data.asset.content);
        });
    }
    
    showPage();
}

function showPage()
{
    $( ".page" ).fadeIn( 2000, function(){});
}

function hidePage()
{
    $( ".page" ).fadeOut( 100, function(){});
}
