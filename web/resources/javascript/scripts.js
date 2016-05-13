/* Global variable holding the tutorial */
var tutorial = null;
var isTest = $.QueryString["mode"] == "t";
var theme = ($.QueryString["theme"] = "undefined") ? "default" : $.QueryString["theme"];

var tutorialResult = "";
var baseUrl = "http://192.168.99.100:8080"
setTheme();

function initialize()
{
    //setTheme();
    
    /* Populates the Tutorial tree */
    populateTutorials();
    
    /* Pre-populates for testing */
    if(isTest)
    {
        populateTutorial(1);
    }
    
    /* Fades the body in once content loaded */
    $(document).ready(function()
    {
       $("body").fadeIn(1000);
    });
    
    /* Associates smooth scrolling */
    smoothScroll();
    
}

function setTheme() 
{
    var style = document.createElement('link');
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "themes/default/style.css";
    document.getElementsByTagName("head")[0].appendChild(style);
    
    /* Adds the favicon */
    var fav = document.createElement('link');
    fav.type = "image/x-icon";
    fav.rel = "shortcut icon";
    fav.href = "themes/" + theme + "/favicon.ico";
    document.getElementsByTagName("head")[0].appendChild(fav);
        
    /* Sets the logo image */
    var logo = document.getElementById("logo");
    logo.src = "themes/" + theme + "/logo.png";
    
    
};

function populateTutorials()
{   
    /* $("#tutorials-tree").empty(); */
    
    <!-- Provide API Endpoint-->
    var url = baseUrl + "/api/tutorials";
    
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
                    
                    populateTutorial(this.model.id);
                    closeTutorials();
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
        var url = baseUrl + "/api/tutorial/" + id;
        
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
    tutorialResult = '{"tutorial": [';
    
    var hasErrors = false;
    var errorAnchor = "#code-section"
    
    $('a[href^="#prevent"]').on('click',function (e) 
    {
        /* Surpresses usual behaviour */
        e.preventDefault();
    });
    
    /* checks that all segments have code */
    for ( var i in tutorial.code.segments)
    {
        
        /* local variables */
        var segment = tutorial.code.segments[i]
        var id = "tutorial-code-" + segment.id;
        var editor = ace.edit(id);
        var value = editor.getValue().trim();
        
        
        value = value.split('<').join('&lt;');
        value = value.split('>').join('&gt;');
        value = value.split('"').join('\"');
        value = value.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        value = value.replace(/\t/g, '%50%');
        value = value.replace(/\s/g,"%20%");
        
        /* Create json for each tutorial*/
        tutorialResult += '{"id" : "'+id+'",'
                            +'"command":"'+segment.command+'",'
                            +'"value" : "'+value.replace(/\s/g,"%20%")+'" },'
        
        /* Remove all line markers*/
        for(var marker in editor.session.$backMarkers) {
            if(editor.session.$backMarkers[marker]['clazz'] == 'ace_highlight') {
                editor.session.removeMarker(marker);
                hasErrors = false;
            }
        }
        
        /* Mark line where annotation is present*/
        var annot = editor.getSession().getAnnotations();
        
        for (var key in annot){
            if (annot.hasOwnProperty(key)) {
                //console.error(annot[key].text + "on line " + " " + annot[key].row);
                var Range = require("ace/range").Range
                editor.session.addMarker(new Range(annot[key].row, 0, annot[key].row, 1), 'ace_highlight', 'fullLine');
                hasErrors = true;
            }
        }
        
        
        /* Executes the tutorial if checks are passed */
        if( value == null || value == "")
        {
            hasErrors = true;
            var Range = require("ace/range").Range
            editor.session.addMarker(new Range(0, 0, 0, 1), 'ace_highlight', 'fullLine');
        }
    };
    
    tutorialResult = tutorialResult.slice(0, -1);
    tutorialResult += ']}';
    
    if(hasErrors) 
    {        
        setTimeout(function() {smoothScrolls(".ace_highlight");},100);
        return true;
    }
    else
    {   var reviewOption = tutorial['reviewSwitch'];

       if(reviewOption) { 
            formatReview(tutorialResult);
            $("#pre-view").fadeIn(2000);
       }
    }
}

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
            
            var $target = $(target);
            
            /* changes Html and bodybehaviours */
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
        });
    });
}

function smoothScrolls(target)
{

    /* changes Html and bodybehaviours */
    $('html, body').stop().animate({
        'scrollTop': ($('.ace_highlight').offset().top - 50 )
    }, 500, 'swing', function () {
        window.location.hash = target;
    });
}


function writeToFile() {

    var url = baseUrl + "/api/writeToFile";

    $.ajax({
    url: url,
    type: 'post',
    data: tutorialResult,
    headers: {"Content-Type": 'application/json' },
    dataType: 'json',
    success: function (data) {
        json = JSON.parse(data);
        alert(json['status']);  
        $("#pre-view").fadeOut(200);
    }
    });
}

function formatReview(request) {
    try{
    var json = JSON.parse(request);
    }
    catch(e) {
    console.log(request);
    }
    var final = "";
    var i ;
    
    var finalHeight = 0;
    
    $("#pre-view .prev").html("");
    
    for(i in json['tutorial']) {

        var value = json['tutorial'][i]['value'].split('%20%').join(' ');
        value = value.split('%50%').join('   ');
        
        final = "<div class='codeReview'><h2>"+json['tutorial'][i]['command']+"</h2><br><pre>"
                 +value+"</pre></div>";
        
        $("#pre-view .prev").append(final);
    }

    setTimeout(function() {
        size = $("#pre-view .prev .codeReview").size();
        
        for(id=0;id <= size; id++) {
          if((id%2) == 0) {
              
              marginAndPadding = parseInt($("#pre-view .prev .codeReview").css("padding-top")) +  
                                  parseInt($("#pre-view .prev .codeReview").css("margin-top"));
              
              console.log("Margin and Padding - "+marginAndPadding);
              
              value1 = $("#pre-view .prev .codeReview").eq(id).height();
              
              value2 = $("#pre-view .prev .codeReview").eq((id+1)).height();
              
              if(value1 > value2)
                finalHeight +=  value1 + marginAndPadding;
              else
                finalHeight +=  value2 + marginAndPadding;
          }
            
            if(id > 100) {console.error("id = "+id); break;}
        }
        
        $("#pre-view .prev").height(finalHeight);
    }, 100)
}

function cancelPrev() { $("#pre-view").fadeOut(500);$("#pre-view-dark").fadeOut(500);}