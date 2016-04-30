$( "#works-step-1" ).fadeIn( 1000, function(){});

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
        isTutorial: function () {
          return this.model.id != 'undefined';
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
    
    $(document).ready(function(){
        $('a[href^="#"]').on('click',function (e) {
            e.preventDefault();

            var target = this.hash;
            var $target = $(target);

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
        });
    });
    });
    
    $( ".works-step-1" ).fadeIn( 1000, function(){});
}

function populateTutorial(id)
{
    $( ".page" ).fadeOut( 500, function(){});
    
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
            $("#requirement-new-text").html(data.requirement.new);
            $("#requirement-example-text").html(data.requirement.example);
        });
        
        $( ".page" ).fadeIn( 1250, function(){});
        
        return true;
    }
}