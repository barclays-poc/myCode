function init(assetId, tutorialId)
{
    populatePlatforms();
    populateAsset(assetId);
    populateTutorial(tutorialId)
}


function populatePlatforms()
{
    <!-- Provide API Endpoint-->
    var url = "/data/platforms.json";

    $.getJSON( url, function( data ) 
    {
        initTutorials(data);
    });
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

function initTutorials(data)
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
        }
      },
      methods: {
        toggle: function () {
          if (this.isFolder) {
            this.open = !this.open
          }
        },
        changeType: function () {
          if (!this.isFolder) {
            Vue.set(this.model, 'children', [])
            this.addChild()
            this.open = true
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
      el: '#demo',
      data: {
        treeData: data
      }
    })
}