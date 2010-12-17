<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
 xmlns:error="http://apache.org/cocoon/error/2.0"
 xmlns:php="http://php.net/xsl"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
  <xsl:param name="requestUri"/>
    <xsl:output encoding="utf-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
    <xsl:template name="content">
       <h1>Page Not Allowed</h1>
       <p>
		 <xsl:value-of select="$webroot"/><xsl:value-of select="/bx/error:notify/error:message"/>
         </p>
		
        <p>
        <xsl:variable name="username"><xsl:value-of select="php:functionString('bx_helpers_perm::getUsername')"/></xsl:variable>
        
        <xsl:choose>
       <xsl:when test="$username != ''">
       You're already logged in as <xsl:value-of select="$username"/>, but this page is still not accessible for you.
       <br/><br/>
       This means almost certainly, that you're not allowed to view this page.<br/><br/>
       
           <a href="/admin/?back={php:functionString('bx_helpers_uri::getRequestUri')}&amp;logout">Logout</a>
       </xsl:when>
       <xsl:otherwise>
           
        <xsl:choose>
            <xsl:when test="/bx/error:notify/error:extra[@description='userInfo']">
            <p style="color: red;">
            <xsl:value-of select="/bx/error:notify/error:extra[@description='userInfo']"/>
            </p>
            </xsl:when>
            <xsl:otherwise>
           <p>
             You're not logged in.
             </p>
        </xsl:otherwise>
        </xsl:choose>
            
<div class="form">
       Please login:
         <form method="post" action="/admin/?back={php:functionString('bx_helpers_uri::getRequestUri')}">
        <table border="0" cellpadding="2" cellspacing="0" summary="login form">
          <tr>
            <td colspan="2" bgcolor="#eeeeee"><b> Login</b></td>
          </tr>

          <tr>
            <td>Username:</td>
            <td><input type="text" name="username" value=""/></td>
          </tr>
          <tr>
            <td>Password:</td>
            <td><input type="password" name="password"/></td>
          </tr>

          <tr>
            <td colspan="2" bgcolor="#eeeeee"><input type="submit" value="login"/></td>
          </tr>
        </table>
      </form>
  </div>
    </xsl:otherwise>
      </xsl:choose>
         </p>
        
    </xsl:template>
</xsl:stylesheet>
