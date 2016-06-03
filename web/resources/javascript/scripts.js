var tutorial = null;
var buildInput = null;
var fadeIn = 1500;
var fadeOut = 100;

/* Sets the stylesheet, favicon, title */
setStylesheet();
setFavicon();
setTitle();


/* Once ocument is ready */
$(window).load(function()
{
    /* Populates the Tutorial tree */
    populateTutorials();

    /* Associates smooth scrolling */
    smoothScroll();

    /* Sets the logo based on the theme */
    setLogo();

    $("body").fadeIn(fadeIn);
});


/* Populates Tutorials menu */
function populateTutorials()
{
    var url = config.baseUrl + "/api/tutorials";

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
                    $("#tutorial-id-0").click();
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

    })
    .error(function()
     {
        onError();
    })
    .success(function()
    {
        $(".tutorials").fadeIn(fadeIn);
        $(".section-how-to").fadeIn(fadeIn);

        /* Smooth scrolling */
        smoothScroll();
    });
}


/* Error handling */
function onError()
{
    $(".errorHide").fadeOut(fadeOut, function()
    {
        $(".errorShow").fadeIn(fadeIn);
    });
}


/* Hooks up the Tutorials close button */
$(function ()
{
    $("#close-button").click(function()
    {
       $("#tutorial-id-0").click();
    });
});


/* Populates a tutorial detail */
function populateTutorial(id)
{
    var hasData = false;

    /* Only actions if actually changes */
    if( tutorial != null && id == tutorial.id) return false;

    /* Retrieves the tutorial if an id is provided */
    if(id != null)
    {
        /* Provide API Endpoint */
        var url = config.baseUrl + "/api/tutorials/" + id;

        /* Sets to be sync */
        $.ajaxSetup({
            async: false
        });

        /* Retrieves the API data and populates */
        $.getJSON( url, function( data )
        {
            if(data != null)
            {
                populateAsset( data );
                populateRequirements( data );
                populateCode( data );
                populateTest( data);

                /* adds as global variable */
                tutorial = data;
                console.log("set: " + tutorial);

                hasData = true;
            }
            else
            {
                hasData = false;
                onError();
            }

        }).error(function()
             {
                onError();
                tutorial = null;
            });

         /* Sets to be async */
        $.ajaxSetup({
            async: true
        });

        if( hasData)
        {
            $(".tutorial-content" ).fadeIn(fadeIn);
            return false;
        }
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
    data.asset.resources.forEach(addAdditionalResource);
}


/* Populates the additional resources */
function addAdditionalResource(resource)
{
    /* Adds the asset link */
    jQuery('<a/>', {
        href: resource.url,
        target: resource.target,
        text: resource.title
    }).appendTo("#asset-links");
}


/* Populates the requirements */
function populateRequirements(data)
{
    /* Adds the example and new requirements */
    $("#requirement-new-text").html(data.requirement.new);
    $("#requirement-example-text").html(data.requirement.example);
}


/* Populates the code section */
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


/* Adds a code command*/
function addCodeCommand(segment)
{
    /* Add a command into the list */
    jQuery('<p/>', {
        text: segment.command
    }).appendTo("#code-commands");
}


/* Adds the code segments */
function addCodeSegment(segment)
{
    /* Creates the tutorial editable input */
    addCodeEditor(segment, "#tutorial-code", "tutorial-code", false);

    /* Creates the example readonly input */
    addCodeEditor(segment, "#example-code", "example-code", true);
}


/*Populate Test */
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


/* Adds the Test commands */
function addTestCommand(segment)
{
    /* Add a command into the list */
    jQuery('<p/>', {
        text: segment.command
    }).appendTo("#test-commands");
}


/* Adds the Test Segment */
function addTestSegment(segment)
{
    /* Creates the tutorial editable input */
    addCodeEditor(segment, "#tutorial-test", "tutorial-test", false);

    /* Creates the example readonly input */
    addCodeEditor(segment, "#example-test", "example-test", true);
}


/* Adds the required code editor */
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
    editor.setFontSize("70%");
    editor.setTheme("ace/theme/" + config.editorTheme);
    editor.setOption("wrap", true);
    editor.setReadOnly(isExample);
    editor.getSession().on('change', function(e)
    {
        $("#review").fadeOut(fadeOut);
    });
    editor.getSession().setMode(mode);
}


/* Links up the run Run Button */
$(function()
{
    $("#run-button" ).click(function()
    {
        /* creates the result context */
        var result = { "count": 0, "anchor": "", "inputs" : []};

        /* Performs the validations */
        validateRun(result, "code", tutorial.code.segments);
        validateRun(result, "test", tutorial.test.segments);

        /* Based on results takes next action */
        if(result.count == 0)
        {
            if(tutorial.review)
            {
                /* Caches the inputs for later use */
                buildInput = result.inputs;
                displayReview(result.inputs);

                $("#review").fadeIn(fadeIn);
                smoothScrolls("#review");
            }
            else
            {
                /* Kicks off the build */
                build(result.inputs);
            }
        }
        else
        {
            /* Scroll back to error */
            smoothScrolls(result.anchor);
            return true;
        }
    });
});


/* Validates the run request */
function validateRun(result, type, segments)
{
    $.each(segments, function(index, segment)
    {
        var id = "tutorial-" + type + "-" + segment.id;
        var idHash = "#" + id;

        /* Resets background */
        removeEditorHighlight( idHash );

        /* Gets editor reference */
        var editor = ace.edit( id );

        /* Checks the input length */
        if( ! isEditorValid( editor ))
        {
            addEditorHighlight( idHash );
            result.count++;

            if( result.count == 1)
            {
                result.anchor = idHash;
            }
        }
        else
        {
            /* Constructs the input object and adds to the array */
            var input = {
                id: id,
                command: segment.command,
                value: editor.getValue()
            };

            result.inputs.push(input);
        }
    });
}


/* Sets editor background */
function addEditorHighlight(id)
{
    /* Resets background */
    $( id )
        .find(".ace_scroller")
        .css("background", config.highlight);
}


/* Sets editor background */
function removeEditorHighlight(id)
{
    /* Resets background */
    $( id )
        .find(".ace_scroller")
        .css("background", "");
}


/* Checks that an editor is actually valid */
function isEditorValid(editor)
{
    /* checks that there is something in the textarea */
    if(editor.getValue().trim().length ==0)
    {
        return false;
    }

    /* TODO: Code to go in here */
    return true;
}


/* Display the review content */
function displayReview(inputs)
{
    /* Clears previous preview */
    $("#pre-view .prev").empty();

    /* Add the code section for each input*/
    $.each(inputs, function(index, input)
    {
        final = "<h3 class='commands'>" + input.command + "...</h3><div class='code-review'>" + htmlEscape(input.value) + "<a href='#prevent' class='code-edit' onclick='javascript: editSegment(\"" + input.id + "\")'>edit</a></div>";

        $("#review-segments").append(final);
    });
}


/* handles the edit segment call */
function editSegment(id)
{
    smoothScrolls( "#" + id);
    $("#review").fadeOut(fadeOut);
}


/* Invokes the build after review*/
$(function()
{
    $("#build-button" ).click(function()
    {
        build(buildInput);
    });
 });


/* Invokes the build direct*/
function build(buildInput)
{
    var input = JSON.stringify(buildInput);
    var url = config.baseUrl + "/api/tutorials/" + tutorial.id + "/build";

    $.ajax({
    url: url,
    type: 'post',
    data: input,
    headers: {"Content-Type": 'application/json' },
    dataType: 'json',
    success: function (data) {
        json = JSON.parse(data);
        alert(json['status']);
        $("#pre-view").fadeOut(fadeOut);
    }
    });
}
