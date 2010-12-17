cat \
mozile/mozWrappers.js \
js/widget.js \
mozile/eDOM.js \
js/bxeConfig.js \
mozile/eDOMXHTML.js \
js/bxeXMLNode.js \
js/bxeNodeElements.js \
js/bxeXMLDocument.js \
mozile/mozileTransportDriver.js \
mozile/td/http.js \
mozile/domlevel3.js \
mozile/mozCE.js \
mozile/mozIECE.js \
js/eDOMEvents.js \
js/bxeFunctions.js \
js/i18n.js \
js/table.js \
mozile/jsdav.js \
mozile/td/webdav.js \
mozile/mozilekb.js \
relaxng/AttributeVDOM.js \
relaxng/NodeVDOM.js \
relaxng/DocumentVDOM.js \
relaxng/ElementVDOM.js \
relaxng/DocumentVAL.js \
relaxng/NodeVAL.js \
relaxng/ElementVAL.js \
relaxng/RelaxNG.js > bxeAll.js 

 java -jar yuicompressor-2.2.5.jar  --line-break 0 --charset utf-8 bxeAll.js > bxeAll-min.js

rm bxeAll.js
