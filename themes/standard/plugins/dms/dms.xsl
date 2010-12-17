<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:blog="http://bitflux.org/doctypes/blog" xmlns:bxf="http://bitflux.org/functions" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" xmlns:php="http://php.net/xsl" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rss="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="xhtml">

    
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    
    <xsl:template name="html_head">
        <script type="text/javascript" src="{$webroot}webinc/js/dms.js"></script>
    </xsl:template>
    
    <xsl:template name="content">
        <xsl:call-template name="dms"/>
        
    </xsl:template>
    
    <xsl:template name="dms">
    <xsl:variable name="dms" select="/bx/plugin[@name='dms']/dms"/>
    <div align="center">
        <xsl:value-of select="$dms/dir"/>
        <br/>
        <a href="{$dms/parentdirlink}"><xsl:value-of select="$dms/parentdir"/></a>
        <table align="center">
        <tr>
            <td width="20px">Icon</td>
            <td width="100px">Name</td>
            <td width="100px">Size</td>
            <td width="50px">Type</td>
            <td width="100px">Download als ZIP</td>
            <td width="100px">Status</td>
        </tr>
        <xsl:for-each select="$dms/item">
        
        <xsl:if test="file">
            <xsl:choose>
                <xsl:when test="$dms[@type='file']">
                    <xsl:call-template name="singlefile"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="file"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
        
        <xsl:if test="folder">
            <xsl:call-template name="folder"/>
        </xsl:if>
        
        </xsl:for-each>
        </table>
            <xsl:choose>
                <xsl:when test="$dms/item/file/realfilelink">
                    <xsl:call-template name="edit"/>
                </xsl:when>
                <xsl:otherwise>
                            <xsl:call-template name="uploadform"/>
                </xsl:otherwise>
            </xsl:choose>
        <a href="{$dms/parentdirlink}">back</a>
        <br/>
        <a href="{$dms/trashdir}">Trash</a>
            <div>
                <xsl:call-template name="logs"/>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template name="uploadform">
        <form enctype="multipart/form-data" action="{/bx/plugin[@name='dms']/dms/dir}" method="post">
            <input name="uploadedfile" type="file"/>
            <input name="path" type="hidden" value="{/bx/plugin[@name='dms']/dms/realdir}"/>
            <br/>
            Log Comment
            <br/>
            <textarea type="text" name="bx[plugins][dms][logcomment]"/>
            <br/>
            <input type="submit" value="Send File" name="bx[plugins][dms][upload]"/>
        </form>                                                                                 
        <a onclick="mkdir('{/bx/plugin[@name='dms']/dms/dir}');">Create New Directory</a><br/>
    </xsl:template>
    
    <xsl:template name="edit">
        <xsl:if test="/bx/plugin[@name='dms']/dms/item/file">
            <div>
            Comments:<br/>
            <xsl:for-each select="/bx/plugin[@name='dms']/dms/item/file/comments/comment">
                <u><xsl:value-of select="title"/> from <xsl:value-of select="author"/> at <xsl:value-of select="date"/></u>
                <p><xsl:value-of select="content"/></p>
            </xsl:for-each>
            </div>
            <a onclick="del('{/bx/plugin[@name='dms']/dms/item/file/filelink}');">delete</a><br/>
            <a onclick="copy('/dms{/bx/plugin[@name='dms']/dms/dir}');">copy</a><br/>
            <a onclick="move('/dms{/bx/plugin[@name='dms']/dms/dir}');">move</a><br/>
            <a onclick="openclose('filecomments');">Make a comment</a><br/>
            <div id="filecomments" style="display:none; ">
                
                <form action="{$webroot}dms{/bx/plugin[@name='dms']/dms/dir}" method="post">
                    <p>Comment</p>
                    <textarea type="text" name="bx[plugins][dms][comment]"/><br/>
                    <input type="hidden" value="{$webroot}dms{/bx/plugin[@name='dms']/dms/dir}" name="bx[plugins][dms][uri]"/>
                    <input type="submit" value="Submit Comment" name="bx[plugins][dms][commentbutton]"/>
                </form>
                
            </div>
            
            <a onclick="openclose('filetags');">Make a tag</a><br/>
            <div id="filetags" style="display:none; ">
                
                <form action="{$webroot}dms{/bx/plugin[@name='dms']/dms/dir}" method="post">
                    <p>Tags (Leerschlag zum unterteilen verwenden)</p>
                    <textarea type="text" name="bx[plugins][dms][tag]"/><br/>
                    <input type="hidden" value="{$webroot}dms{/bx/plugin[@name='dms']/dms/dir}" name="bx[plugins][dms][uri]"/>
                    <input type="submit" value="Submit Tags" name="bx[plugins][dms][tagbutton]"/>
                </form>
                
            </div>
            <form action="{/bx/plugin[@name='dms']/dms/parentdirlink}{/bx/plugin[@name='dms']/dms/item/file/filename}" method="post">
                <select name="statusselection">
                    <option>in progress</option>
                    <option>finished</option>
                    <option>new</option>
                </select>
                <input type="submit" name="statusbutton" value="send"/>
            </form>
         </xsl:if>
    </xsl:template>
    
    <xsl:template name="folder">
        <tr bgcolor="#ededed">
            <td width="20px">
                <img alt="file" src="{folder/img}"/>&#160;
            </td>
            <td width="100px" align="left">
                <a href="{folder/folderlink}"><xsl:value-of select="folder/foldername"/></a>
            </td>
            <td></td>
            <td width="50px" align="right">
                <xsl:value-of select="folder/filetype"/>
            </td>
            <td width="100px" align="right">
                <a href="{../dir}?zipdownload={folder/foldername}">download</a>
            </td>
            <td width="100px" align="right"></td>
        </tr>
    </xsl:template>
    
    <xsl:template name="logs">
        <xsl:for-each select="/bx/plugin[@name='dms']/dms/logs/log">
            <a href="{../item/  realfilelink}?cat={rev}"><xsl:value-of select="rev"/></a> 
            <xsl:value-of select="author"/> // 
            <xsl:value-of select="msg"/> // 
            <xsl:value-of select="date"/>
            <br/>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template name="file">
        <tr bgcolor="#ededed">
                <td width="20px">
                    <img alt="file" src="{file/img}"/>
                </td>
                <td width="100px">
                    <a href="{file/filelink}"><xsl:value-of select="file/filename"/></a>
                </td>
                <td width="100px" align="right">
                    <xsl:value-of select="file/filesize"/> Bytes
                </td>
                <td width="50px" align="right">
                    <xsl:value-of select="file/filetype"/>
                </td>
                <td width="100px" align="right"></td>
                <td width="100px" align="right"><xsl:value-of select="file/filestatus"/></td>
            </tr>
    </xsl:template>
    
    <xsl:template name="singlefile">
            <br/>Current File
            <tr bgcolor="#ededed">
                <td width="20px">
                    <img alt="file" src="{file/img}"/>
                </td>
                <td width="100px">
                    <a href="{file/realfilelink}"><xsl:value-of select="file/filename"/></a>
                </td>
                <td width="100px" align="right">
                    <xsl:value-of select="file/filesize"/> Bytes
                </td>
                <td width="100px" align="right">
                    <xsl:value-of select="file/filetype"/>
                </td>
                <td width="100px" align="right"></td>
                <td width="100px" align="right">
                    <xsl:value-of select="file/filestatus"/>
                </td>
            </tr>
    </xsl:template>
    
</xsl:stylesheet>
