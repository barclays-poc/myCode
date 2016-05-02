function initialize()
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
            populateAsset( data );
            populateRequirements( data );
            populateCode( data );
        });
        
        $( ".page" ).fadeIn( 1250, function(){});
        
        return false;
    }
}

/* Section Population */
function populateAsset(data)
{
    $("#asset-title").text(data.name);
    $("#asset-diagram").attr("src", data.asset.diagram);
    $("#asset-diagram-link").attr("href", data.asset.diagram);
    $("#asset-content").html(data.asset.content);
    $("#asset-links" ).empty();
    data.asset.resources.forEach(addAssetLink);
}

function addAssetLink(resource)
{
    var div = document.getElementById("asset-links");
    var anchor = document.createElement("a");
    anchor.setAttribute("href", resource.url);
    anchor.setAttribute("target", resource.target);
    anchor.innerHTML = resource.title;
    div.appendChild(anchor);
}

function populateRequirements(data)
{   
    $("#requirement-new-text").html(data.requirement.new);
    $("#requirement-example-text").html(data.requirement.example);
}

function populateCode(data)
{
    $("#tutorial-code" ).empty();
    $("#example-code" ).empty();
    data.code.segments.forEach(addSegment)
}

function addSegment(segment)
{    
    addCodeEditor(segment, "#tutorial-code", "tutorial", false);
    addCodeEditor(segment, "#example-code", "example", true);
}

function addCodeEditor(segment, selector, type, isExample)
{
    var id = type + "-editor-" + segment.id;
    var mode = "ace/mode/" + segment.mode;
    var text = isExample ? segment.example : "";
    
    jQuery('<div/>', {
        id: id,
        class: "code",
        text: text
    }).appendTo(selector);
    
    var editor = ace.edit(id);
    editor.setTheme("ace/theme/textmate");
    editor.setReadOnly(isExample);
    editor.getSession().setMode(mode);
}