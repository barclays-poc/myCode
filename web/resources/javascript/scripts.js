/* Global variable holding the tutorial */
var tutorial = null;

function initialize()
{
    /* Populates the Tutorial tree */
    populateTutorials();
    
    /* Pre-populates for testing */
    /*populateTutorial(1);*/
    
    /* Fades the body in once content loaded */
    $(document).ready(function()
    {
       $("body").fadeIn(1000);
    });
    
    /* Associates smooth scrolling */
    smoothScroll();
}

function populateTutorials()
{   
    /* $("#tutorials-tree").empty(); */
    
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
                }
              },
              methods: {
                select: function () {
                    
                    closeTutorials();
                    populateTutorial(this.model.id);
                },
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
        
        // Populate the tree
        var demo = new Vue({
          el: '#tutorials-tree',
          data: {
            treeData: data
          }
        });
        
        /* Smooth scrolling */
        smoothScroll();
    });
}

function closeTutorials()
{
    var div = document.getElementById("tutorial-id-0");
    div.click();
}

function populateTutorial(id)
{
    /* Retrieves the tutorial if an id is provided */
    if(id != null)
    {
        /* Provide API Endpoint */
        var url = "/data/tutorial.json";
        
        /* Retrieves the API data and populates */ 
        $.getJSON( url, function( data ) 
        {
            populateAsset( data );
            populateRequirements( data );
            populateCode( data );
            populateTest( data);
            
            /* adds as global variable */
            tutorial = data;
        });
        
        /* Fades the new content in */
        $( ".page" ).fadeIn(1000, function(){});
        return false;
    }
}

/* Section Population */
function populateAsset(data)
{
    /* Populates the core asset information */
    $("#asset-title").text(data.name);
    $("#asset-diagram").attr("src", data.asset.diagram);
    $("#asset-diagram-link").attr("href", data.asset.diagram);
    $("#asset-content").html(data.asset.content);
    
    /* Populates the asset resource links */
    $("#asset-links" ).empty();
    data.asset.resources.forEach(addAssetLink);
}

function addAssetLink(resource)
{
    /* Adds the asset link */
    jQuery('<a/>', {
        href: resource.url,
        target: resource.target,
        text: resource.title
    }).appendTo("#asset-links");
}

function populateRequirements(data)
{   
    /* Adds the example and new requirements */
    $("#requirement-new-text").html(data.requirement.new);
    $("#requirement-example-text").html(data.requirement.example);
}

function populateCode(data)
{
    /* Clears the dynamic code content */
    $("#code-commands").empty();
    $("#tutorial-code").empty();
    $("#example-code").empty();
    
    /* Adds the dynamic code content */
    data.code.segments.forEach(addCodeCommand)
    data.code.segments.forEach(addCodeSegment)
}

function addCodeCommand(segment)
{
    /* Add a command into the list */
    jQuery('<p/>', {
        text: segment.command
    }).appendTo("#code-commands");
}

function addCodeSegment(segment)
{   
    /* Creates the tutorial editable input */
    addCodeEditor(segment, "#tutorial-code", "tutorial-code", false);
    
    /* Creates the example readonly input */
    addCodeEditor(segment, "#example-code", "example-code", true);
}

function populateTest(data)
{
    /* Clears the dynamic test content */
    $("#test-commands").empty();
    $("#tutorial-test" ).empty();
    $("#example-test" ).empty();
    
    /* Dynamically adds the test segments */
    data.test.segments.forEach(addTestCommand)
    data.test.segments.forEach(addTestSegment);
}

function addTestCommand(segment)
{
    /* Add a command into the list */
    jQuery('<p/>', {
        text: segment.command
    }).appendTo("#test-commands");
}

function addTestSegment(segment)
{    
    /* Creates the tutorial editable input */
    addCodeEditor(segment, "#tutorial-test", "tutorial-test", false);
    
    /* Creates the example readonly input */
    addCodeEditor(segment, "#example-test", "example-test", true);
}

function addCodeEditor(segment, selector, type, isExample)
{
    /* Calculates the attributes for teh editor */
    var id = type + "-" + segment.id;
    var mode = "ace/mode/" + segment.mode;
    var text = isExample ? segment.example : "";
    
    /* Creates a code editor dynamically */
    jQuery('<div/>', {
        id: id,
        class: "code",
        text: text
    }).appendTo(selector);
    
    /* Initializes the dynamically created editor */
    var editor = ace.edit(id);
    editor.setTheme("ace/theme/textmate");
    editor.setReadOnly(isExample);
    editor.getSession().setMode(mode);
}

function execute()
{   
    var hasErrors = false;
    var errorAnchor = "#code-section"
    
    /* checks that all segments have code */
    for ( var i in tutorial.code.segments)
    {
        var segment = tutorial.code.segments[i]
        var id = "tutorial-code-" + segment.id;
        var editor = ace.edit(id);
        var value = editor.getValue().trim();
        if( value == null || value == "")
        {
            hasErrors = true;
            editor.setTheme("ace/theme/textmate-error");
            editor.getSession().setMode(segment.mode);
        }
    };
    
    if(hasErrors) 
    {        
        return true;
    }
    else
    {    
        location.assign("result.html");
    }
}

function smoothScroll()
{
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
}