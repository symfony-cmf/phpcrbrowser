

YAHOO.namespace("cr");

YAHOO.cr.tree = function(){

    var buildTree = function(){
        //create a new tree:
        tree = new YAHOO.widget.TreeView("treeDiv1");
        
        //turn dynamic loading on for entire tree:
        tree.setDynamicLoad(loadNodeData, true);
        
        //get root node for tree:
        var root = tree.getRoot();
        
        //add child nodes for tree; our top level nodes are
        //all the states in India:
        var aStates = [{
            label: "Root",
            fullpath: "/"
        }];
        
        for (var i = 0, j = aStates.length; i < j; i++) {
            var tempNode = new YAHOO.widget.TextNode(aStates[i], root, false);
        }
        
        // Use the isLeaf property to force the leaf node presentation for a given node.
        // This disables dynamic loading for the node.
        tempNode.isLeaf = false;
        
        tree.subscribe("labelClick", function(node){
            loadNodeProperties(node);
        });
        
        //render tree with these toplevel nodes; all descendants of these nodes
        //will be generated as needed by the dynamic loader.
        tree.draw();
        
        
    };
    
    var loadNodeProperties = function(node, fnLoadComplete){
    
        //Get the node's label and urlencode it; this is the word/s
        //on which we'll search for related words:
        var nodeLabel = encodeURI(node.data.fullpath);
        
        //prepare URL for XHR request:
        var sUrl = "__json__/properties/?fullpath=" + nodeLabel;
        //prepare our callback object
        //console.log(node.data.fullpath.toString()),;
        YAHOO.cr.propTable.update(nodeLabel);
        //YAHOO.cr.versionsTable.update(nodeLabel);
    
        //YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
    
    
    }
    
    var loadNodeData = function(node, fnLoadComplete){
    
        //We'll create child nodes based on what we get back when we
        //use Connection Manager to pass the text label of the 
        //expanding node to the Yahoo!
        //Search "related suggestions" API.  Here, we're at the 
        //first part of the request -- we'll make the request to the
        //server.  In our Connection Manager success handler, we'll build our new children
        //and then return fnLoadComplete back to the tree.
        
        //Get the node's label and urlencode it; this is the word/s
        //on which we'll search for related words:
        var nodeLabel = encodeURI(node.data.fullpath);
        
        //prepare URL for XHR request:
        var sUrl = "__json__/tree/?fullpath=" + nodeLabel;
        //prepare our callback object
        var callback = {
        
            //if our XHR call is successful, we want to make use
            //of the returned data and create child nodes.
            success: function(oResponse){
                YAHOO.log("XHR transaction was successful.", "info", "example");
                var oResults = eval("(" + oResponse.responseText + ")");
                if ((oResults.ResultSet.Result) && (oResults.ResultSet.Result.length)) {
                    //Result is an array if more than one result, string otherwise
                    if (YAHOO.lang.isArray(oResults.ResultSet.Result)) {
                        for (var i = 0, j = oResults.ResultSet.Result.length; i < j; i++) {
                            var tempNode = new YAHOO.widget.TextNode(oResults.ResultSet.Result[i], node, false);
                        }
                    }
                    else {
                        //there is only one result; comes as string:
                        var tempNode = new YAHOO.widget.TextNode(oResults.ResultSet.Result, node, false)
                    }
                }
                
                //When we're done creating child nodes, we execute the node's
                //loadComplete callback method which comes in via the argument
                //in the response object (we could also access it at node.loadComplete,
                //if necessary):
                oResponse.argument.fnLoadComplete();
            },
            
            //if our XHR call is not successful, we want to
            //fire the TreeView callback and let the Tree
            //proceed with its business.
            failure: function(oResponse){
                YAHOO.log("Failed to process XHR transaction.", "info", "example");
                oResponse.argument.fnLoadComplete();
            },
            
            //our handlers for the XHR response will need the same
            //argument information we got to loadNodeData, so
            //we'll pass those along:
            argument: {
                "node": node,
                "fnLoadComplete": fnLoadComplete
            },
            
            //timeout -- if more than 20 seconds go by, we'll abort
            //the transaction and assume there are no children:
            timeout: 20000
        };
        
        //With our callback object ready, it's now time to 
        //make our XHR call using Connection Manager's
        //asyncRequest method:
        YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
    }
    
    
    return {
        init: function(){
            buildTree();
        }
    }
    
    
    
}();

YAHOO.cr.propTable = function(){

    var myColumnDefs = null;
    var myDataSource = null;
    var myDataTable = null;
    var formatUrl = null;
    var myCallback = null;
    var callback1 = null;
    var initTable = function(){
        formatType = function(elCell, oRecord, oColumn, sData){
        
            switch (sData) {
                case 1:
                    type = 'STRING';
                    break;
                case 2:
                    type = 'BINARY';
                    break;
                case 3:
                    type = 'INT';
                    break;
                case 4:
                    type = 'FLOAT';
                    break;
                case 5:
                    type = 'DATE';
                    break;
                case 6:
                    type = 'BOOLEAN';
                    break;
                case 7:
                    type = 'NAME';
                    break;
                case 8:
                    type = 'PATH';
                    break;
                case 9:
                    type = 'REFERENCE';
                    break;
                    
            }
            elCell.innerHTML =  type;
            
            
        };
        var textareaedit =  new YAHOO.widget.TextareaCellEditor();
	textareaedit.textarea.style.height = "10em ! important";
        myColumnDefs = [{
            key: "name",
            label: "Name",
            sortable: true
        }, {
            key: "value",
			label: "Value",
			editor:  textareaedit
			
        }, {
            key: "type",
            formatter: formatType
        
        }];
        
        myDataSource = new YAHOO.util.DataSource("__json__/properties/?");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.connXhrMode = "queueRequests";
        myDataSource.responseSchema = {
            resultsList: "ResultSet.Result",
            fields: ["name", "value", "type"]
        };
        
        myDataTable = new YAHOO.widget.DataTable("propsTable", myColumnDefs, myDataSource, {
            initialRequest: "fullpath=/"
        });
		
		 var onCellEdit = function(oArgs) { 
              var elCell = oArgs.editor.getTdEl(); 
              var oOldData = oArgs.oldData; 
              var oNewData = oArgs.newData; 
               setProperty(YAHOO.cr.propTable.currentPath,oArgs.editor.getRecord().getData().name, oNewData)
          } 
		 // Set up editing flow 
          var highlightEditableCell = function(oArgs) { 
              var elCell = oArgs.target; 
              if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) { 
                  this.highlightCell(elCell); 
              } 
          }; 
          myDataTable.subscribe("cellMouseoverEvent", highlightEditableCell); 
          myDataTable.subscribe("cellMouseoutEvent", myDataTable.onEventUnhighlightCell); 
          myDataTable.subscribe("cellClickEvent", myDataTable.onEventShowCellEditor); 
         myDataTable.subscribe("editorSaveEvent", onCellEdit); 
		 
        myCallback = function(){
            this.set("sortedBy", null);
            this.onDataReturnInitializeTable.apply(this, arguments);
            if (YAHOO.cr.propTable.currentPath) {
                $('nodePath').firstChild.data = YAHOO.cr.propTable.currentPath;
            }
            
        };
        callback1 = {
            success: myCallback,
            failure: myCallback,
            scope: myDataTable
        };
        
    };
	var setProperty = function(path, name, value) {
		//FIX POST statt GET
		var sUrl = '__json__/setproperty/?fullpath=' + YAHOO.cr.propTable.currentPath + '&name=' + escape(name) + '&value=' + value;
            var callback1 = {
                success: function(){
                    YAHOO.cr.propTable.update(path,true)
                },
                failure: null,
                scope: myDataTable
            }
            YAHOO.util.Connect.asyncRequest('GET', sUrl, callback1);
		
	};
	
    
    return {
        init: function(){
            initTable();
        },
        update: function(fullpath,force){
            if (fullpath == '') {
                YAHOO.cr.propTable.currentPath = "/";
            }
            else {
                YAHOO.cr.propTable.currentPath = fullpath;
            }
			var d = ''
			if (force) {
				d = '&' + new Date();
				
			}
			
            myDataSource.sendRequest("fullpath=" + fullpath + d, callback1);
            YAHOO.cr.versionsTable.hide();
        },
        currentPath: null
    }
    
    
}();


YAHOO.cr.versionsTable = function(){

    var myColumnDefs = null;
    var myDataSource = null;
    var myDataSource = null;
    var formatUrl = null;
    var myCallback = null;
    var callback1 = null;
    var tableInit = false;
    var initTable = function(){
    
        formatUrl = function(elCell, oRecord, oColumn, sData){
            elCell.innerHTML = "<a href='#' onclick='YAHOO.cr.versionsTable.restore(\"" + sData + "\")'>" + sData + "</a>";
        };
        
        
        myColumnDefs = [{
            key: "name",
            label: "Name",
            sortable: true,
            formatter: formatUrl
        
        
        }, {
            key: "date"
        
        }, {
            key: "size"
        }];
        
        myDataSource = new YAHOO.util.DataSource("__json__/versions/?");
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
        myDataSource.connXhrMode = "queueRequests";
        myDataSource.responseSchema = {
            resultsList: "ResultSet.Result",
            fields: ["name", "date", "size"]
        };
        
        myDataTable = new YAHOO.widget.DataTable("versionsTable", myColumnDefs, myDataSource, {
            initialRequest: "fullpath=/"
        });
        
        myCallback = function(){
            this.set("sortedBy", null);
            this.onDataReturnInitializeTable.apply(this, arguments);
        };
        callback1 = {
            success: myCallback,
            failure: myCallback,
            scope: myDataTable
        };
        tableInit = true;
        
    };
    

    return {
        hide: function(){
            if (tableInit) {
            
                myDataTable.getContainerEl().style.display = 'none';
            }
            
        },
        init: function(){
            initTable();
        },
        update: function(fullpath){
            if (!tableInit) {
                initTable();
            }
            else {
                myDataTable.getContainerEl().style.display = 'block';
                ;
            }
            
            if (!fullpath || fullpath == 'click') {
                fullpath = YAHOO.cr.propTable.currentPath;
            }
            myDataSource.sendRequest("fullpath=" + fullpath, callback1)
        },
        restore: function(name){
            var sUrl = '__json__/restore/?fullpath=' + YAHOO.cr.propTable.currentPath + '&version=' + name;
            var callback1 = {
                success: function(){
                    YAHOO.cr.versionsTable.update(null)
                },
                failure: null,
                scope: myDataTable
            }
            YAHOO.util.Connect.asyncRequest('GET', sUrl, callback1);
            
        }, 
		createVersion: function() {
            var sUrl = '__json__/createversion/?fullpath=' + YAHOO.cr.propTable.currentPath ;
            var callback1 = {
                success: function() {
                    YAHOO.cr.versionsTable.update(null)
                },
                failure: null
                
            };
            
			YAHOO.util.Connect.asyncRequest('GET', sUrl, callback1);
            
			
		}
    }
    
    
}();



YAHOO.cr.topmenu = function(){

    /*
     Initialize and render the MenuBar when its elements are ready
     to be scripted.
     */
    var initMenu = function(){
        YAHOO.util.Event.onContentReady("topmenu", function(){
        
            /*
             Instantiate a MenuBar:  The first argument passed to the
             constructor is the id of the element in the page
             representing the MenuBar; the second is an object literal
             of configuration properties.
             */
            var oMenuBar = new YAHOO.widget.MenuBar("topmenu", {
                autosubmenudisplay: false,
                hidedelay: 750,
                lazyload: true
            });
            
            
            
            var aSubmenuData = [{
                id: "communication",
                itemdata: [[{
                    text: "Show History",
                    onclick: {
                        fn: YAHOO.cr.versionsTable.update
                    }
                },{
                    text: "Create Version",
                    onclick: {
                        fn: YAHOO.cr.versionsTable.createVersion
                    }
                }],[,  {
                    text: "Add new Node",
                    onclick: {
                        fn: YAHOO.cr.dialogNewNode.show
                    }
                }],[, {
                    text: "Delete Cache",
                    onclick: {
                        fn: deletecache
                    }
                }]]
            }];
            
            
            /*
             Subscribe to the "beforerender" event, adding a submenu
             to each of the items in the MenuBar instance.
             */
            oMenuBar.subscribe("beforeRender", function(){
            
                if (this.getRoot() == this) {
                
                    this.getItem(0).cfg.setProperty("submenu", aSubmenuData[0]);
                    
                }
                
            });
            
            
            /*
             Call the "render" method with no arguments since the
             markup for this MenuBar instance is already exists in
             the page.
             */
            oMenuBar.render();
            
            
        });
    };
    var deletecache = function() {
          var sUrl = '__json__/delcache/';
            var callback1 = {
                success: null,
                failure: null,
            }
            YAHOO.util.Connect.asyncRequest('GET', sUrl, callback1);
    };
    return {
        init: function(){
            initMenu();
        }
    }
}();


YAHOO.cr.dialogNewNode = function(){

    // Instantiate the Dialog
    
    var dialog = null;
    // Define various event handlers for Dialog
    var handleSubmit = function(){
        this.submit();
    };
    var handleCancel = function(){
        this.cancel();
    };
    
    var handleSuccess = function(o){
        var response = o.responseText;
        response = response.split("<!")[0];
        document.getElementById("resp").innerHTML = response;
    };
    
    var handleFailure = function(o){
        alert("Submission failed: " + o.status);
    };
    
    
    var initDialog = function(){
    
    
        dialog = new YAHOO.widget.Dialog("dialogNewNode", {
            width: "300px",
            fixedcenter: false,
            visible: false,
            constraintoviewport: true,
            buttons: [{
                text: "Submit",
                handler: handleSubmit,
                isDefault: true
            }, {
                text: "Cancel",
                handler: handleCancel
            }]
        });
        dialog.callback = {
            success: handleSuccess,
            failure: handleFailure
        };
        dialog.render();
        
    };
    
    var nodetypes = null;
    
    
    
    return {
        init: function(){
        
            initDialog();
        },
        show: function(){
            if (!nodetypes) {
            
                var callback = {
                    success: function(o){
                        var dNT = $('dialogNodeType');
                        var resp = YAHOO.lang.JSON.parse(o.responseText);
                        nodetypes = resp.ResultSet.Result;
						var z = 1;
						dNT.options[0].text = "  Please choose";
                        for (var i = 0; i < nodetypes.length; i++) {
						    if (nodetypes[i].isMixin == false) {
								var opt = new Option(nodetypes[i].name, nodetypes[i].name, false, true);
								dNT.options[z] = opt;
								z++;
							}
                            
                            
                        }
						dNT.selectedIndex = 0;
                    }
                    
                }
                
                YAHOO.util.Connect.asyncRequest('GET', '/__json__/nodetypes/', callback, null);
                
            }
			$('dialogNewNodeForm').action="/__json__/addnode/?fullpath=" + YAHOO.cr.propTable.currentPath;
            dialog.show();
        },
        hide: function(){
            dialog.hide();
        }
    }
    
}()


YAHOO.cr.init = function(){
    YAHOO.cr.tree.init();
    YAHOO.cr.propTable.init();
    YAHOO.cr.topmenu.init();
    YAHOO.cr.dialogNewNode.init();
    
};
