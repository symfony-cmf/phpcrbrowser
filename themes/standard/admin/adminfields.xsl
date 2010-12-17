<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:php="http://php.net/xsl"
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns="http://www.w3.org/1999/xhtml"
>

    <xsl:template match="field[@type='select']">
        <p class="inputfield">
            <h2 class="page">
                <i18n:text><xsl:value-of select="@name"/></i18n:text>
            </h2>
      <xsl:if test="@img">
       
      <!-- needed for theme selector siteoptions -->
      
    <img onmouseout="document.getElementById('_mouseover').style.display = 'none';"
    onmouseover="document.getElementById('_mouseover').style.display = 'block';"
    style="position: absolute; left: 310px; padding-top: 10px; " height="60" width="100" id="{@img}"
    src="/themes/{option[@selected = 'selected']/@name}/preview/{substring-before(option/field/option[@selected = 'selected']/@name,'.css')}.jpg"
    />    
   
    <div id="_mouseover" style="display: none;">
      <img style="position: absolute; top: 34px; left: 410px;" id="{@img}_gross" 
      src="/themes/{option[@selected = 'selected']/@name}/preview/{substring-before(option/field/option[@selected = 'selected']/@name,'.css')}.jpg"
      />
    </div>
    
    
    </xsl:if>

            
  <xsl:if test="help">
                <p style="padding-left: 20px; font-style: italic;">
                   
                    <xsl:value-of disable-output-escaping="yes" select="help"/>
                   
                    </p>
            </xsl:if>
         
            <select name="bx[plugins][{$pluginName}][{@name}]">
                 <xsl:if test="option/field[@type='select']">
                 <xsl:attribute name="onchange">onChangeSelect(this,'bx[plugins][<xsl:value-of select="$pluginName"/>][<xsl:value-of select="option/field[@type='select']/@name"/>]')</xsl:attribute>
                 </xsl:if>
                <xsl:for-each select="option">

                    <option value="{@value}">
                        <xsl:copy-of select="@selected"/>
                        <i18n:text><xsl:value-of select="@name"/></i18n:text>
                    </option>

                </xsl:for-each>

            </select>
            <xsl:if test="option/field[@type='select']">
                <select name="bx[plugins][{$pluginName}][{option/field[@type='select']/@name}]" >
                 <xsl:attribute name="onchange">onChangeSubSelect(this,'bx[plugins][<xsl:value-of select="$pluginName"/>][<xsl:value-of select="@name"/>]')</xsl:attribute>
              
                <xsl:for-each select="option/field[@type='select']">
                        <xsl:for-each select="option">
                            <option value="{@value}" parentName="{../../@name}" >
                                <xsl:attribute name="style">
                                    <xsl:choose>
                                        <xsl:when test="../../@selected = 'selected'" >display: block; </xsl:when>
                                        <xsl:otherwise> display: none; color: #dddddd;			</xsl:otherwise>
                                    </xsl:choose>
                                </xsl:attribute>
                                <xsl:copy-of select="@selected"/>
<xsl:choose>
<xsl:when  test="../../@selected = 'selected'" ><xsl:value-of select="@name"/></xsl:when>
<xsl:otherwise> (from another theme)</xsl:otherwise>
</xsl:choose>
                            </option>
                        </xsl:for-each>
                    </xsl:for-each>
                </select>
            </xsl:if>

        </p>
        
    </xsl:template>

    <xsl:template match="field[@type='text']">
        <p class="inputfield">
            <h2 class="page">
                <i18n:text><xsl:value-of select="@name"/></i18n:text>
            </h2>
            <xsl:if test="help">
                <p style="padding-left: 20px; font-style: italic;">
                    <xsl:value-of disable-output-escaping="yes" select="help"/>
                </p>
            </xsl:if>
            <xsl:if test="@textBefore">
                <xsl:value-of select="@textBefore"/>
            </xsl:if>
            <input type="text" name="bx[plugins][{$pluginName}][{@name}]" value="{@value}">
		<xsl:choose>
                <xsl:when test="@size">
                    <xsl:attribute name="size">
                        <xsl:value-of select="@size"/>
                    </xsl:attribute>
                </xsl:when>
		<xsl:otherwise>
                    <xsl:attribute name="size">40</xsl:attribute>
		</xsl:otherwise>
		</xsl:choose>
            </input>

        </p>
    </xsl:template>

    <xsl:template match="field[@type='textarea']">
        <p class="inputfield">
            <h2 class="page">
                <i18n:text><xsl:value-of select="@name"/></i18n:text>
            </h2>
            <xsl:if test="help">
                <p style="padding-left: 20px; font-style: italic;">
                    <xsl:value-of disable-output-escaping="yes" select="help"/>
                </p>
            </xsl:if>
            <xsl:if test="@textBefore">
                <xsl:value-of select="@textBefore"/>
            </xsl:if>
            <textarea name="bx[plugins][{$pluginName}][{@name}]" cols="40">
                <xsl:if test="@size">
                    <xsl:attribute name="size">
                        <xsl:value-of select="@size"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:value-of select="@value"/>
            </textarea>


        </p>
    </xsl:template>
    
     <xsl:template match="field[@type='textarealarge']">
        <p class="inputfield">
            <h2 class="page">
                <i18n:text><xsl:value-of select="@name"/></i18n:text>
            </h2>
            <xsl:if test="help">
                <p style="padding-left: 20px; font-style: italic;">
                    <xsl:value-of disable-output-escaping="yes" select="help"/>
                </p>
            </xsl:if>
            <xsl:if test="@textBefore">
                <xsl:value-of select="@textBefore"/>
            </xsl:if>
            <textarea name="bx[plugins][{$pluginName}][{@name}]" cols="80" rows="10">
                <xsl:if test="@size">
                    <xsl:attribute name="size">
                        <xsl:value-of select="@size"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:value-of select="@value"/>
            </textarea>


        </p>
    </xsl:template>
     


    <xsl:template match="field[@type='checkbox']">
        <p class="inputfield">
            <h2 class="page">
                <i18n:text><xsl:value-of select="@name"/></i18n:text>
            </h2>
            <xsl:if test="help">
                <p style="padding-left: 20px; font-style: italic;">
                     <xsl:value-of disable-output-escaping="yes" select="help"/>
                </p>
            </xsl:if>
            <xsl:if test="@textBefore">
                <xsl:value-of select="@textBefore"/>
            </xsl:if>
            <input type="checkbox" name="bx[plugins][{$pluginName}][{@name}]">
                <xsl:copy-of select="@checked"/>
            </input>


        </p>
    </xsl:template>


    <xsl:template match="field[@type='hidden']">

        <input type="hidden" name="bx[plugins][{$pluginName}][{@name}]" value="{@value}"/>

    </xsl:template>


    <xsl:template match="field[@type='file']">
        <p class="inputfield">
            <h2 class="page">
                <i18n:text><xsl:value-of select="@name"/></i18n:text>
            </h2>
            <xsl:if test="help">
                <p style="padding-left: 20px; font-style: italic;">
                     <xsl:value-of disable-output-escaping="yes" select="help"/>
                </p>
            </xsl:if>
            <input type="file" name="bx[plugins][{$pluginName}][{@name}]" value="{@value}"/>
            <br/>(Max upload size: 
             <xsl:value-of select="php:functionString('ini_get','upload_max_filesize')"/>)
        </p>
    </xsl:template>


</xsl:stylesheet>
