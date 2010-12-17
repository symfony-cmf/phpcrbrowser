// +--------------------------------------------------------------------------+
// | BXE                                                                      |
// +--------------------------------------------------------------------------+
// | Copyright (c) 2003,2004 Bitflux GmbH                                     |
// +--------------------------------------------------------------------------+
// | Licensed under the Apache License, Version 2.0 (the "License");          |
// | you may not use this file except in compliance with the License.         |
// | You may obtain a copy of the License at                                  |
// |     http://www.apache.org/licenses/LICENSE-2.0                           |
// | Unless required by applicable law or agreed to in writing, software      |
// | distributed under the License is distributed on an "AS IS" BASIS,        |
// | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
// | See the License for the specific language governing permissions and      |
// | limitations under the License.                                           |
// +--------------------------------------------------------------------------+
// | Author: Christian Stocker <chregu@bitflux.ch>                            |
// +--------------------------------------------------------------------------+
//
// $Id: table.js 1833 2008-02-08 14:51:02Z chregu $


Element.prototype.TableRemoveRow = function() {
	bxe_history_snapshot();
	return bxe_table_delete_row(this);
}

Element.prototype.TableRemoveCol = function() {
	bxe_history_snapshot();
	return bxe_table_delete_col(this);
}

Element.prototype.TableAppendRow = function () {
	bxe_history_snapshot();
	return bxe_table_insert_row(this);
}

Element.prototype.TableAppendCol = function () {
	bxe_history_snapshot();
	return bxe_table_insert_col(this);
	
}

Element.prototype.findPosition = function () {
	// find position
	var prevSibling = this.previousSibling;
	var pos = 1;
	while(prevSibling) {
		if (prevSibling.nodeType == 1 && (prevSibling.XMLNode.vdom.bxeTabletype == "table-cell" || prevSibling.XMLNode.vdom.bxeTabletype == "table-col")) {
			var _attr = prevSibling.getAttribute("colspan");
			if (_attr > 0) {
				pos += parseInt( _attr);
			} else {
				pos++;
			}
		}
		prevSibling = prevSibling.previousSibling;
	}
	return pos;
}

Element.prototype.TableCellMergeRight = function () {
	var positions = bxe_table_getRowAndColPosition(this);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	var thisColspan = bxe_table_getSpanCount(this.getAttribute("colspan"));
	var rightCol = matrix[rowPos][colPos+thisColspan][1];
	if (!rightCol) {
		alert(bxe_i18n.getText("There's no right cell to be merged"));
		return;
	}
	var rightRowSpanCount = bxe_table_getSpanCount(rightCol.getAttribute("rowspan"));
	var thisRowSpanCount  = bxe_table_getSpanCount(this.getAttribute("rowspan"));
	if (rightRowSpanCount != thisRowSpanCount) {
			alert(bxe_i18n.getText("Right cell's rowspan is different to this cell's rowspan, merging not possible"));
			return;
		
	}

	var child = rightCol.firstChild;
	while (child) {
		var nextchild = child.nextSibling;
		this.appendChild(child);
		child = nextchild;
	}
	this.normalize();
	rightCol.parentNode.removeChild(rightCol);
	
	this.setAttribute("colspan", thisColspan+1);
	return this.parentNode.parentNode;
}

Element.prototype.TableCellMoveRight = function () {
	var positions = bxe_table_getRowAndColPosition(this);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	
	var thisColspan = bxe_table_getSpanCount(this.getAttribute("colspan"));
	var rightCol = matrix[rowPos][colPos+thisColspan][1];
	if (!rightCol) {
		alert(bxe_i18n.getText("There's no right cell to be moved"));
		return;
	}
	
	for(var y = 1; y <= matrix[0][0][0]; y++) {
		var tmp = matrix[y][colPos] ;
		matrix[y][colPos] = matrix[y][colPos + 1]
		matrix[y][colPos + 1] = tmp;
	}
	return bxe_rebuildTableByTableMatrix(this, matrix);
	
}


Element.prototype.TableCellMoveLeft = function () {
	var positions = bxe_table_getRowAndColPosition(this);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	if (colPos == 1) {
	
		alert(bxe_i18n.getText("There's no left cell to be moved"));
		return;
	}
	
	for(var y = 1; y <= matrix[0][0][0]; y++) {
		var tmp = matrix[y][colPos] ;
		matrix[y][colPos] = matrix[y][colPos - 1]
		matrix[y][colPos -1] = tmp;
	}
	return bxe_rebuildTableByTableMatrix(this, matrix);
	
}




Element.prototype.TableCellMergeDown = function () {
	
	var positions = bxe_table_getRowAndColPosition(this);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	
	var thisRowspan = bxe_table_getSpanCount(this.getAttribute("rowspan"));
	if (!matrix[rowPos + thisRowspan]) {
		alert(bxe_i18n.getText("There's no cell below to be merged"));
		return;
	}
	var downCol = matrix[rowPos + thisRowspan][colPos][1];
	if (!downCol) {
		alert(bxe_i18n.getText("There's no cell below to be merged"));
		return;
	}
	
	var downColSpanCount = bxe_table_getSpanCount(downCol.getAttribute("colspan"));
	var thisColSpanCount = bxe_table_getSpanCount(this.getAttribute("colspan"));
	
	if (downColSpanCount != thisColSpanCount) {
			alert(bxe_i18n.getText("Down cell's colspan is different to this cell's colspan, merging not possible"));
			return;
		
	}
	
	this.setAttribute("rowspan",thisRowspan+1);	
	
	var child = downCol.firstChild;
	while (child) {
		var nextchild = child.nextSibling;
		this.appendChild(child);
		child = nextchild;
	}
	this.normalize();
	var downPar = downCol.parentNode;
	downPar.removeChild(downCol);
	// if row below does not have any children anymore, delete it
	// fix for BXEB-60
	if (downPar.XMLNode.isWhitespaceOnly) {
		downPar.parentNode.removeChild(downPar);
		var child = this.parentNode.firstChild;
		while (child) {
			var nextchild = child.nextSibling;
			if (child.nodeType == 1) {
				var _rowspan = bxe_table_getSpanCount(child.getAttribute("rowspan") );
			 	if (_rowspan > 1) {
					child.setAttribute("rowspan",_rowspan - 1);
			 	}	
			}
			child = nextchild;
		}
	}
	return this.parentNode.parentNode;
}

Element.prototype.TableCellSplitRight = function () {
	

    var first = bxe_splitAtSelection(this);	
	var colspan = parseInt(first.getAttribute("colspan"));
	if (colspan > 1) {
		first.setAttribute("colspan", colspan-1);
	} else {
		first.removeAttribute("colspan");
	}
	var nextSibling = first.nextSibling;
	while (nextSibling && nextSibling.nodeType != 1) {
		nextSibling = nextSibling.nextSibling;
		
	}
	if (nextSibling) {
		nextSibling.setAttribute("colspan","1");
		nextSibling.betterNormalize();
		if (!nextSibling.firstChild || nextSibling.firstChild.isWhitespaceOnly) {
			nextSibling.init();
			nextSibling.XMLNode.makeDefaultNodes();
		}
	}
	return first.parentNode.parentNode;
}


Element.prototype.TableCellSplitDown = function() {
	var pos = this.findPosition();
	
	
	var positions = bxe_table_getRowAndColPosition(this);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	
	
	var tr = this.parentNode;
	var first = bxe_splitAtSelection(this);	
	
	var rowspan = bxe_table_getSpanCount(first.getAttribute("rowspan"));
	if (rowspan > 1) {
		first.setAttribute("rowspan", rowspan-1);
	} else {
		first.removeAttribute("rowspan");
	}
	
	if (first.nextSibling) {
		var nextSibling = first.nextSibling;
	} 
	while (nextSibling && nextSibling.nodeType != 1) {
		nextSibling = nextSibling.nextSibling;
	}
	if (nextSibling) {
		nextSibling.setAttribute("rowspan","1");
		nextSibling.betterNormalize();
		if (!nextSibling.firstChild || nextSibling.firstChild.isWhitespaceOnly) {
			nextSibling.init();
			nextSibling.XMLNode.makeDefaultNodes();
		}
	}
	var cell = matrix[rowPos + rowspan - 1][colPos + 1];
	if (cell) {
		cell = cell[1];
	}
	if (cell) {
		cell.parentNode.insertBefore(nextSibling,cell);
	} else {
		//get next tr from first td cell of next row
		var nexttr = matrix[rowPos + rowspan - 1][1][1].parentNode;
		nexttr.appendChild(nextSibling);
	}
	return first.parentNode.parentNode;
}


Element.prototype.findCellPosition = function(pos) {
	var cell = this.firstChild;
	var nextpos = 1;
	
	while (cell) {
		if (cell.nodeType == 1 && (cell.XMLNode.vdom.bxeTabletype == "table-cell" || cell.XMLNode.vdom.bxeTabletype == "table-col" )) {
			if (nextpos >= pos) {
				return cell;
			}
			var _attr = parseInt(cell.getAttribute("colspan"));
			if (_attr >  0 ) {
				nextpos += parseInt(_attr);
			} else {
				nextpos++;
			}
		}
		cell = cell.nextSibling;
	}
	
}



// +----------------------------------------------------------------------+
// | Bitflux Editor                                                       |
// +----------------------------------------------------------------------+
// | Copyright (c) 2001,2002 Bitflux GmbH                                 |
// +----------------------------------------------------------------------+
// | This software is published under the terms of the Apache Software    |
// | License a copy of which has been included with this distribution in  |
// | the LICENSE file and is available through the web at                 |
// | http://bitflux.ch/editor/license.html                                |
// +----------------------------------------------------------------------+
// | Author: Christian Stocker <chregu@bitflux.ch>                        |
// +----------------------------------------------------------------------+
//
// $Id: table.js 1833 2008-02-08 14:51:02Z chregu $
/**
* @file
* Implements the table plugin
*
* The functions here will go into some table Class.
* we need also some kind of plugin-interface. to be defined yet
*/

var mouseX = 0;
var mouseY = 0;

//document.addEventListener("mousemove",BX_mousetrack,true);

// <cope>
// </cope>
function bxe_table_insert(id)
{
	var output = "";
	BX_popup_start("Create Table",0,90);
	
	if (BX_range)
	{
		
		output = "<form action=\"javascript:bxe_table_newtable('"+id+"');\" id='bxe_tabelle' name='tabelle'><table class=\"usual\"><tr>";
		output += "<td >"+bxe_i18n.getText("Columns")+"</td><td ><input value='5' size=\"3\" name=\"cols\" /></td>\n";
		output += "</tr><tr>\n";
		output += "<td>"+bxe_i18n.getText("Rows")+"</td><td ><input value='5' size=\"3\" name=\"rows\" /></td>\n";
		output += "</tr><tr>\n";
		output += "<td colspan='2' align='right'>\n";
		output += "<input type='submit' class=\"usual\" value='"+bxe_i18n.getText("create")+"' /> </td>";
		output += "</tr></table></form>";
		BX_popup_addHtml(output);
		
	}
	else
	{
		
		output = "<span class='usual'>"+bxe_i18n.getText("Nothing selected, please select the point, where you want the table inserted")+"</span>";
		BX_popup_addHtml(output);
		
	}
	BX_removeEvents();
	
	BX_popup_show();
	
	
}

function bxe_table_InsertTableOnNew(node) {
	return bxe_InsertTableCallback(node);
}

function bxe_table_InsertRowOnNew(node) {
	alert("bxe_table_InsertRowOnNew is deprecated!");
	var td = bxe_config.doc.createElement("td");
	td = node._node.appendChild(td);
	bxe_table_insert_row(td);
	bxe_table_delete_row(td);
	//FIXME selection after transform...
}

function bxe_table_InsertCellOnNew(node) {
	var td = node._node;
	var tr = td.parentNode;
	//find position
	var cellLeft = null;
	var pos;
	for (var i=0; i< tr.childNodes.length; i++) {
		if (tr.childNodes[i].XMLNode && tr.childNodes[i].XMLNode.vdom && (tr.childNodes[i].XMLNode.vdom.bxeTabletype == "table-cell" || tr.childNodes[i].XMLNode.vdom.bxeTabletype == "table-col")) {
			if (tr.childNodes[i] == td) {
				pos = i;
				break;
			}
		}
	}
	cellLeft = tr.childNodes[pos - 1];
	//remove inserted cell
	tr.removeChild(td);
	// and add a col on the found cell before
	if (cellLeft) {
		bxe_table_insert_col(cellLeft);
	}
}

function bxe_table_createTableFinish (te, noRows, noColumns)  { 
	//FIXME: this code should maybe use the matrix code and not something self built ...
	if((/\D+/.test(noRows)) || (/\D+/.test(noColumns)) || (noRows==0) || (noColumns==0))
		return null; // go to exception
	
	
	
	var ac = te.XMLNode.allowedChildren;
	
	
	if (ac.length >= 1)  {
		var _hasMust = false;
		for ( var i in ac) {
		
			if (!(ac[i].optional ) ) { 
				if (ac[i].vdom.bxeTabletype == "table-colgroup") {
					bxe_table_createTableFinishInitRows(te,ac[i],1, noColumns);
				} else if (ac[i].vdom.bxeTabletype == "table-row") {
					bxe_table_createTableFinishInitRows(te,ac[i],noRows, noColumns);

				} else {
				
					eDOMEventCall("appendChildNode",document,{"noTransform": true, "appendToNode": te.XMLNode, "localName":ac[i].localName,"namespaceURI":ac[i].namespaceURI});
				}
				_hasMust =true;
			}
			
		}
		if (!_hasMust) {
			bxe_context_menu.buildElementChooserPopup(this,ac);
		} else {
			ret = this;
		}
	}
	te.XMLNode.parentNode.isNodeValid(true,2,true);
	
	return te;
}
function bxe_table_createTableFinishInitRows(te,rowInfo, noRows, noColumns) {

	for(var i=0; i<noRows; i++)
	{
		
		//var tre = documentCreateXHTMLElement("tr");
		var tre = bxe_config.doc.createElementNS(rowInfo.namespaceURI, rowInfo.localName);
		te.appendChild(tre);
		tre.XMLNode = tre.getXMLNode();
		tre.XMLNode.isNodeValid(true,2);
		tre.appendChild(document.createTextNode("\n"));
		for(var j=0; j<noColumns;j++)
		{
			tre.appendChild(document.createTextNode("  "));
			var tde = tre.createNewTableCell();
			tre.appendChild(tde);
			tre.appendChild(document.createTextNode("\n"));
		}
		te.appendChild(document.createTextNode("\n"));
		tre.XMLNode.isNodeValid(true,2,true);
	}
}

function bxe_table_newtable(id)
{
	alert("bxe_table_newtable. this part is commented out. please report if still needed");
	
	
}

//no longer needed
function bxe_table_insert_row_or_col(roworcol)
{
	if(BX_popup.style.visibility== 'visible')
	{
		if (document.getElementById("bxe_tabelle").ch[0].checked)
		{
			bxe_table_insert_row();
		}
		else
		{
			bxe_table_insert_col();
		}
		BX_popup.style.visibility= 'hidden';
		BX_addEvents();
		return;
	}
	
	if (!(BX_range))
	{
		alert(bxe_i18n.getText("Nothing selected, please select a table cell"));
		return;
	}
	// <cope> changed != "entry" to "xhtml:td" in order to get the fucking col/rowspan work
	if (BX_range.startContainer.parentNode.XMLNode.vdom.bxeTabletype == "table-cell" || BX_range.startContainer.parentNode.XMLNode.vdom.bxeTabletype == "table-col")
	{
		alert(bxe_i18n.getText("No table-cell (but {0}) selected, please choose one",new Array(BX_range.startContainer.parentNode.nodeName)));
		return ;
	}
	BX_popup_start("Add Row or Col",110,90);
	var output = "";
	output += "<form action='javascript:bxe_table_insert_row_or_col();' id='bxe_tabelle' name='tabelle'><table class=\"usual\"><tr>";
	output += "<td ><input name='ch' type='radio' value='row' checked='checked' /></td><td >"+bxe_i18n.getText("add row")+"</td>\n";
	output += "</tr><tr><td ><input name='ch' type='radio' value='col' /></td><td >"+bxe_i18n.getText("add col")+"</td>\n";
	
	output += "</tr><tr><td colspan='2'><input type='submit' class=\"usual\" value='"+bxe_i18n.getText("add")+"' /> </td>";
	output += "</tr></table></form>";
	
	BX_popup_addHtml(output);
	BX_popup_show();
	BX_popup.style.top=BX_popup.offsetTop - 1 + "px";
	
}
function bxe_table_insert_row(cell)
{
	
	var positions = bxe_table_getRowAndColPosition(cell);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	//rowPos now contains the row and we can now search for the cell within the matrix
	//matrix works 1...n
	//first of all we create a new empty matrix with one more col
	var newMatrix = bxe_createInitialTableMatrix(matrix[0][0][0]-0+1, matrix[0][0][1]);
	//now we fill the new one by traversing the current
	var nx = 0;
	var ny = 0;
	var rowspan = 1;
	var colspan = 1;
	for(var y = 1; y <= matrix[0][0][0]; y++) {
		ny++;
		nx = 0;
		for(var x = 1; x <= matrix[0][0][1]; x++) {
			nx++;
			//we insert new cols after colPos!
			//we have to increase all colspans that spans the colPos!
			rowspan = 0;
			if(matrix[y][x][0] > 0 && matrix[y][x][0] < 3) {
				if((matrix[y][x][1].getAttribute("rowspan")-1 + y) > rowPos && y <= rowPos) {
					rowspan = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("rowspan"));
				}
			}
			newMatrix[ny][nx][0] = matrix[y][x][0];
			newMatrix[ny][nx][1] = matrix[y][x][1];
			newMatrix[ny][nx][2] = matrix[y][x][2];
			newMatrix[ny][nx][3] = matrix[y][x][3];
			if(rowspan) {
				//in this case, colspan spans the colPos
				newMatrix[ny][nx][0] = 2;
				newMatrix[ny][nx][1].setAttribute("rowspan", rowspan+1)
			}
			//do we have reached the position to add the new cell?
			if(y == rowPos) {
				newMatrix[ny+1][nx][0] = 1;
				//TEST
				newMatrix[ny+1][nx][1] = cell.parentNode.createNewTableCell();
				if(rowspan) {
					newMatrix[ny+1][nx][0] = 3;
					newMatrix[ny+1][nx][1] = false;
				}
				if(y+1 <= matrix[0][0][0]) {
					if(matrix[y][x][0] == 3 && matrix[y+1][x][0] == 3) {
						//we are inbetween a span! new cell is a span!
						newMatrix[ny+1][nx][0] = 3;
						newMatrix[ny+1][nx][1] = false;
					}
				}
			}
		}
		if(y == rowPos) ny++;
	}
	return bxe_rebuildTableByTableMatrix(cell, newMatrix);
	
/*	BX_range.setEnd(cell,0);
	BX_range.setStart(cell,0);
	
	BX_transform();
	*/
	// </cope>
	
}

function bxe_table_delete_row(cell)
{
	
	var positions = bxe_table_getRowAndColPosition(cell);
	var matrix = positions['matrix'];
	
    
    // very primitive check for BXEB-8
    if (matrix[0][0][0] == 1) {
       alert("Last row, deletion not possible");
       return matrix;
    }
    
    
      
    if (matrix[0][0][0] == 2 && matrix[1][1][1].parentNode.localName != matrix[2][1][1].parentNode.localName) {
       alert("Last row, deletion not possible");
       return matrix;
    }
    
    
    
    
    var rowPos = positions['row'];
	var colPos = positions['col'];
	//rowPos now contains the row and we can now search for the cell within the matrix
	//matrix works 1...n
	//first of all we create a new empty matrix with one more col
	var newMatrix = bxe_createInitialTableMatrix(matrix[0][0][0]-1, matrix[0][0][1]);
	//now we fill the new one by traversing the current
	var nx = 0;
	var ny = 0;
	var rowspan = 1;
	var colspan = 1;
    
    
    for(var y = 1; y <= matrix[0][0][0]; y++) {
		ny++;
      	nx = 0;
		for(var x = 1; x <= matrix[0][0][1]; x++) {
			nx++;
			rowspan = 0;
			if(matrix[y][x][0] > 0 && matrix[y][x][0] < 3) {
				if((bxe_table_getSpanCount(matrix[y][x][1].getAttribute("rowspan"))-1 + y) >= rowPos && y < rowPos) {
					rowspan = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("rowspan"));
				}
			}
			if(y == rowPos) {
				//we have to delete this row
				//but have to take care of deleting a cell which spans over
				var rs = 0;
				var cs = 0;
				if(matrix[y][x][0] > 0 && matrix[y][x][0] < 3) {
					rs = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("rowspan"));
					cs = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("colspan"));
				}
				if(rs > 1 || cs > 1) {
					//because we will delete this cell, we have to rebuild
					//the spaned cells!
					for(var rs_y = 0; rs_y < rs; rs_y++) {
						for(var cs_x = 0; cs_x < cs; cs_x++) {
							matrix[ny+rs_y][nx+cs_x][0] = 1;
							//TEST
							matrix[ny+rs_y][nx+cs_x][1] = cell.parentNode.createNewTableCell();
						}
					}
				}
				if(y < matrix[0][0][0]) {
					newMatrix[ny][nx][0] = matrix[y+1][x][0];
					newMatrix[ny][nx][1] = matrix[y+1][x][1];
					newMatrix[ny][nx][2] = matrix[y+1][x][2];
					newMatrix[ny][nx][3] = matrix[y+1][x][3];
				}
			} else {
				newMatrix[ny][nx][0] = matrix[y][x][0];
				newMatrix[ny][nx][1] = matrix[y][x][1];
				newMatrix[ny][nx][2] = matrix[y][x][2];
				newMatrix[ny][nx][3] = matrix[y][x][3];
				if(rowspan) {
					newMatrix[ny][nx][0] = 2;
					newMatrix[ny][nx][1].setAttribute("rowspan", rowspan-1)
				}
			}
		}
		if(y == rowPos) y++;
	}
	return bxe_rebuildTableByTableMatrix(cell, newMatrix);
	/*
	BX_range.setEnd(cell,0);
	BX_range.setStart(cell,0);
	BX_transform();
	*/
	// </cope>
	
}


function bxe_table_insert_col(cell)
{
	var positions = bxe_table_getRowAndColPosition(cell);
	var matrix = positions['matrix'];
	var rowPos = positions['row'];
	var colPos = positions['col'];
	
	//first of all we create a new empty matrix with one more col
	var newMatrix = bxe_createInitialTableMatrix(matrix[0][0][0], matrix[0][0][1]-0+1);
	//now we fill the new one by traversing the current
	var nx = 0;
	var ny = 0;
	var rowspan = 1;
	var colspan = 1;
	for(var y = 1; y <= matrix[0][0][0]; y++) {
		ny++;
		nx = 0;
		for(var x = 1; x <= matrix[0][0][1]; x++) {
			nx++;
			//we insert new cols after colPos!
			//we have to increase all colspans that spans the colPos!
			colspan = 0;
			if(matrix[y][x][0] > 0 && matrix[y][x][0] < 3) {
				if((matrix[y][x][1].getAttribute("colspan")-1 + x) > colPos && x <= colPos) {
					colspan = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("colspan"));
				}
			}
			newMatrix[ny][nx][0] = matrix[y][x][0];
			newMatrix[ny][nx][1] = matrix[y][x][1];
			newMatrix[ny][nx][2] = matrix[y][x][2];
			newMatrix[ny][nx][3] = matrix[y][x][3];
			if(colspan) {
				//in this case, colspan spans the colPos
				newMatrix[ny][nx][0] = 2;
				newMatrix[ny][nx][1].setAttribute("colspan", colspan+1)
			}
			//do we have reached the position to add the new cell?
			if(x == colPos) {
				nx++;
				newMatrix[ny][nx][0] = 1;
				//TEST
				newMatrix[ny][nx][1] = newMatrix[ny][1][1].parentNode.createNewTableCell();
				if(colspan) {
					newMatrix[ny][nx][0] = 3;
					newMatrix[ny][nx][1] = false;
				}
				if(x+1 <= matrix[0][0][1]) {
					if(matrix[y][x][0] == 3 && matrix[y][x+1][0] == 3) {
						//we are inbetween a span! new cell is a span!
						newMatrix[ny][nx][0] = 3;
						newMatrix[ny][nx][1] = false;
					}
				}
			}
		}
	}
	return bxe_rebuildTableByTableMatrix(cell, newMatrix);
	/*
	BX_range.setEnd(cell,0);
	BX_range.setStart(cell,0);
	BX_transform();*/
	// </cope>
}


function bxe_table_delete_col(cell)
{
	var positions = bxe_table_getRowAndColPosition(cell);
	var matrix = positions['matrix'];
    
     // very primitive check for BXEB-8
    if (matrix[0][0][1] == 1) {
       alert("Last col, deletion not possible");
       return matrix;
    }
    
    
      
    
	var rowPos = positions['row'];
	var colPos = positions['col'];
	//first of all we create a new empty matrix with one more col
	var newMatrix = bxe_createInitialTableMatrix(matrix[0][0][0], matrix[0][0][1]-0-1);
	//now we fill the new one by traversing the current
	var nx = 0;
	var ny = 0;
	var rowspan = 1;
	var colspan = 1;
	for(var y = 1; y <= matrix[0][0][0]; y++) {
		ny++;
		nx = 0;
		for(var x = 1; x <= matrix[0][0][1]; x++) {
			nx++;
			//we insert new cols after colPos!
			//we have to increase all colspans that spans the colPos!
			colspan = 0;
			if(matrix[y][x][0] > 0 && matrix[y][x][0] < 3) {
				if((bxe_table_getSpanCount(matrix[y][x][1].getAttribute("colspan"))-1 + x) >= colPos && x < colPos) {
					colspan = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("colspan"));
				}
			}
			//do we have reached the position to add the new cell?
			if(x == colPos) {
				//we have to delete this col
				//but have to take care of deleting a cell which spans over
				var rs = 0;
				var cs = 0;
				if(matrix[y][x][0] > 0 && matrix[y][x][0] < 3) {
					rs = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("rowspan"));
					cs = bxe_table_getSpanCount(matrix[y][x][1].getAttribute("colspan"));
				}
				if(rs > 1 || cs > 1) {
					//because we will delete this cell, we have to rebuild
					//the spaned cells!
					for(var rs_y = 0; rs_y < rs; rs_y++) {
						for(var cs_x = 0; cs_x < cs; cs_x++) {
							matrix[ny+rs_y][nx+cs_x][0] = 1;
							matrix[ny+rs_y][nx+cs_x][1] = cell.parentNode.createNewTableCell();
						}
					}
				}
				if(x < matrix[0][0][1]) {
					x++;
					newMatrix[ny][nx][0] = matrix[y][x][0];
					newMatrix[ny][nx][1] = matrix[y][x][1];
					newMatrix[ny][nx][2] = matrix[y][x][2];
					newMatrix[ny][nx][3] = matrix[y][x][3];
				}
			} else {
				newMatrix[ny][nx][0] = matrix[y][x][0];
				newMatrix[ny][nx][1] = matrix[y][x][1];
				newMatrix[ny][nx][2] = matrix[y][x][2];
				newMatrix[ny][nx][3] = matrix[y][x][3];
				if(colspan) {
					//in this case, colspan spans the colPos
					newMatrix[ny][nx][0] = 2;
					newMatrix[ny][nx][1].setAttribute("colspan", colspan-1)
				}
			}
		}
	}
	return bxe_rebuildTableByTableMatrix(cell, newMatrix);
	/*
	BX_range.setEnd(cell,0);
	BX_range.setStart(cell,0);
	BX_transform();*/
	// </cope>
}

function bxe_table_getRowAndColPosition(cell) {
	var row = cell.parentNode;
	var tbody = row.parentNode;
	var table = tbody;
	var matrix = bxe_createTableMatrix(cell);
	var colPos = 0;
	var rowPos = 0;
	var ii = 0;
	// find on which row position we are
	for (var i = 0; i < tbody.childNodes.length; i++)
	{
		if(! (tbody.childNodes[i].XMLNode  && tbody.childNodes[i].XMLNode.vdom && (tbody.childNodes[i].XMLNode.vdom.bxeTabletype == "table-row" ||  tbody.childNodes[i].XMLNode.vdom.bxeTabletype == "table-colgroup"))) { continue; }
		ii++;
		if (tbody.childNodes[i] == row)
		{
			rowPos = ii;
			break;
		}
	}
	//rowPos now contains the row and we can now search for the cell within the matrix
	//matrix works 1...n
	var matrixRowVector = matrix[rowPos];
	for (var i = 1; i < matrixRowVector.length; i++) {
		if(cell == matrixRowVector[i][1]) {
			//hui, we found the cell!
			colPos = i;
			break;
		}
	}
	if(colPos == 0) {
		alert(bxe_i18n.getText("ERROR: could not find the cell in matrix!"));
		alert(bxe_i18n.getText("rowPos: {0}",new Array(rowPos)));
		return false;
	}
	var pos = new Array();
	pos['row'] = rowPos;
	pos['col'] = colPos;
	pos['matrix'] = matrix;
	return pos;
}

function bxe_createInitialTableMatrix(rows, cols) {
	
	var table = new Array(rows+1);
	//array will be 1... n not 0... n-1!
	for(var r = 0; r <= rows; r++) {
		table[r] = new Array(cols+1);
		for(var c = 0; c <= cols; c++) {
			table[r][c] = new Array(4);
			table[r][c][0] = 0; //0=not in use, 1=td without span, 2=spaning td, 3=span area
			table[r][c][1] = false; //will contain DOM node of td-cell
			table[r][c][2] = 0; //if [0]=2, then it contains y of spaning cell
			table[r][c][3] = 0; //if [0]=2, then it contains x of spaning cell
		}
	}
	// now we store cols and rows
	table[0][0] = new Array(2);
	table[0][0][0] = rows;
	table[0][0][1] = cols;
	return table;
}

function bxe_table_getTableRowInfo(tbody, refCell) {
		// get tr field info
	var ac  = tbody.XMLNode.allowedChildren;
	if (typeof refCell != "undefined" && refCell.XMLNode.vdom.bxeTabletype == "table-col") {
		
		var celltype = 	"table-colgroup";
	} else {
		var celltype = "table-row"
	}
	
	for (var i = 0; i < ac.length; i++) {
		if (ac[i].vdom.bxeTabletype == celltype) {
			return ac[i];
		}
	}
	return null;
}

function bxe_rebuildTableByTableMatrix(td, matrix) {
	var tbody = td.parentNode.parentNode;
	var table =tbody;
	/*table.setAttribute("rows", matrix[0][0][0]);
	table.setAttribute("cols", matrix[0][0][1]);
	*/
	//remove all old rows
	while(tbody.childNodes.length) {
		tbody.removeChild(tbody.childNodes[0]);
	}
	
	var firstRowInfo = bxe_table_getTableRowInfo(tbody,matrix[1][1][1]);
	var rowInfo =  bxe_table_getTableRowInfo(tbody);
	//rebuild all rows
	for(var r = 1; r <= matrix[0][0][0]; r++) {
		if (r == 1) {
			var rowNode = bxe_config.doc.createElementNS(firstRowInfo.namespaceURI, firstRowInfo.localName);
		} else {
			var rowNode = bxe_config.doc.createElementNS(rowInfo.namespaceURI, rowInfo.localName);
		}	
		if (matrix[r][1][1].parentNode) { 
			var _attr = matrix[r][1][1].parentNode.attributes;
			for (var a = 0; a < _attr.length; a++) {
				rowNode.setAttributeNS(_attr[a].namespaceURI, _attr[a].localName,_attr[a].value); 
			}
		}
		//BX_node_insertID(rowNode);
		tbody.appendChild(rowNode);
		for(var c = 1; c <= matrix[0][0][1]; c++) {
			//only if matrix gives a cell: [0] == 1
			if(matrix[r][c][0] == 1 || matrix[r][c][0] == 2) {
				if(matrix[r][c][1] == false) {
					alert(bxe_i18n.getText("no cell node at r={0} c={1}",new Array(r,c)));
				} else {
					//a cell without a span or a spaning one
					rowNode.appendChild(matrix[r][c][1]);
				}
			}
		}
	}
	table.XMLNode.isNodeValid(true,2,true);
	bxe_history_snapshot_async()
	return table;
}

function bxe_table_getDimensions(table_node) {
	//get rows
	var rows = 0;
	var cols = 0;
	var firstRow = null;
	for(var r = 0; r < table_node.childNodes.length; r++) {
		row = table_node.childNodes[r];
		if(!(row.XMLNode && row.XMLNode.vdom && ( row.XMLNode.vdom.bxeTabletype == "table-row" ||row.XMLNode.vdom.bxeTabletype == "table-colgroup" ))) { continue; }
		if (!firstRow) { firstRow = row;}
		rows += bxe_table_getSpanCount(row.getAttribute("rowspan"));
	}
	var nodeName = "";
	for(var r = 0; r < firstRow.childNodes.length; r++) {
		cell = firstRow.childNodes[r];
		if(!(cell.XMLNode && cell.XMLNode.vdom && (cell.XMLNode.vdom.bxeTabletype == "table-cell" || cell.XMLNode.vdom.bxeTabletype == "table-col"))) { continue; }
		cols += bxe_table_getSpanCount(cell.getAttribute("colspan"));
	}
	
	
	var dim = new Array();
	dim['rows'] = rows;
	dim['cols'] = cols;
/*	bxe_dump("c: " + cols + "\n");
	bxe_dump("r: " + rows + "\n");
	*/
	return dim;
}
function bxe_createTableMatrix(td) {
	
	var tbody = td.parentNode.parentNode;
	
	if(tbody.XMLNode.vdom.bxeTabletype != "table") { alert(bxe_i18n.getText("got no table body!")); }
	return bxe_createTableMatrixFromTable(tbody);
}

function bxe_createTableMatrixFromTable(tbody) {
	
	var dim =  bxe_table_getDimensions(tbody);
	
	var cols = dim['cols'];
	var rows = dim['rows'];
	//the matrix:
	var table = bxe_createInitialTableMatrix(rows, cols);
	//as we have initialized the homogenious matrix,
	//fill it by traversing the table DOM-node:
	var tr = 0;	//matrix coordinates
	var tc = 0;
	//loop all real existing table rows
	for(var r = 0; r < tbody.childNodes.length; r++) {
		row = tbody.childNodes[r];
		debug ("hhh " + tr +"\n");
		if(! (row.XMLNode  && row.XMLNode.vdom && (row.XMLNode.vdom.bxeTabletype == "table-row" || row.XMLNode.vdom.bxeTabletype == "table-colgroup"))) { continue; }  //caution: may be there are text nodes (CRLF or whitespace)
		tr++;
		
		tc = 0;
		//loop all real existing table cells
		for(var c = 0; c < row.childNodes.length; c++) {
			cell = row.childNodes[c];
			
			if(! (cell.XMLNode  && cell.XMLNode.vdom && (cell.XMLNode.vdom.bxeTabletype == "table-cell" || cell.XMLNode.vdom.bxeTabletype == "table-col")))  {continue;} //caution: may be there are text nodes (CRLF or whitespace)
			
			tc++;
			
			if (!table[tr][tc]) {
				continue;
			}
			
			//find the homogenious matrix pos
			//alert("tr="+tr+" tc="+tc);
			while(table[tr][tc][0] > 0) {
				//matrix cell already in use. obviously spaned!
				tc++;
			}
			//2do here: check whether node is a table cell. dont know what BXE makes for fucking stuff!
			colspan = bxe_table_getSpanCount(cell.getAttribute("colspan")); //get integer!
			rowspan = bxe_table_getSpanCount(cell.getAttribute("rowspan")); //get integer!
			//fill out the spaning area
			for(var x = 0; x < colspan; x++) {
				for(var y = 0; y < rowspan; y++) {
					//x=0 y=0 will be overridden later *)
					table[tr+y][tc+x][0] = 3;
					table[tr+y][tc+x][1] = false;
					table[tr+y][tc+x][2] = tr;
					table[tr+y][tc+x][3] = tc;
				}
			}
			if(table[tr][tc][0] == 3 && (colspan > 1 || rowspan > 1)) {
				//the spaning cell itself!
				table[tr][tc][0] = 2;
			} else {
				table[tr][tc][0] = 1;
			}
			// *) rigth here by the cell itself
			//alert(tr+" "+tc);
			table[tr][tc][1] = cell;
			table[tr][tc][2] = tr;
			table[tr][tc][3] = tc;
		}
	}
	return table;
}

function bxe_table_getSpanCount (value) {

	value = parseInt(value);
    if ( !value && value != 0) {
		value = 1;
	}
	
	return value;
		
}


Element.prototype.createNewTableCell = function() {
	
	var ac  = this.XMLNode.allowedChildren;
	
	if (this.XMLNode.vdom.bxeTabletype == "table-row") {
		var celltype = "table-cell";
	} else {
		var celltype = "table-col";
	}
	
	for (var i = 0; i < ac.length; i++) {
		if (ac[i].vdom.bxeTabletype == celltype) {
			var newCell = bxe_config.doc.createElementNS(ac[i].namespaceURI,ac[i].localName);
			break;
		}
	}
	
	var textNode = bxe_config.doc.createTextNode("#");
	if (!newCell) {
		alert("no newCell in " + this.XMLNode.localName);
	}
	newCell.appendChild(textNode);
	return newCell;
}

//</cope>




