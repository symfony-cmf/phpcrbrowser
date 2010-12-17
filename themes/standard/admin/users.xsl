<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" 
	xmlns:php="http://php.net/xsl"
    xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
    xmlns="http://www.w3.org/1999/xhtml"
    > 
    <xsl:param name="webroot" value="'/'"/>
    <xsl:variable name="pluginName" select="/bx/plugin/@name"/>
     <xsl:variable name="showAdvancedView" select="php:functionString('bx_helpers_globals::COOKIE','userAdvancedView')"/> 
    
     <xsl:template match="/">
		<html>
		<head>
			<link type="text/css" href="{$webroot}themes/standard/admin/css/formedit.css" rel="stylesheet"/>
			<xsl:text>
			</xsl:text>
			<link type="text/css" href="{$webroot}themes/standard/admin/css/blog.css" rel="stylesheet"/>
			<xsl:text>
			</xsl:text>
			
			<script type="text/javascript" src="{$webroot}webinc/plugins/blog/common.js"></script>
			<xsl:text>
			</xsl:text>
			
		</head>
		<body>
			<xsl:apply-templates mode="xhtml" />
		</body>
		</html>
     </xsl:template>
     
	 
	 <xsl:template match="useradministration/authservices" mode="xhtml">
	 </xsl:template>
	 
	 <xsl:template match="useradministration/groups" mode="xhtml">
	 </xsl:template>
	 
	 <xsl:template match="plugin[@name='admin_users']/useradministration/users" mode="xhtml">
	 	<h2 class="userPage">
			Users
		</h2>
		<div id='users'>
		<table cellpadding="5" border="0" class="bigUglyEditTable" id="posts">
		<tr>
			<th>
			</th>
			<th style="width:100px;">
				Username
			</th>
			<th style="width:100px;">
				Fullname
			</th>
			<th style="width:100px;">
				Mail
			</th>
		</tr>
		<xsl:for-each select="user">
			<tr>
			
			<xsl:choose>
            <xsl:when test="position() mod 2= 0">
            <xsl:attribute name="class">uneven</xsl:attribute>
            </xsl:when>
            </xsl:choose>
			
				<td style="width:20px;">
					<a href="?delete={id}">
						<img style='border:0px;' src='http://fluxcms/admin/webinc/img/icons/delete.gif'/> 
					</a>
				</td>
				<td style="width:80px;">
					<a href="edit/?id={id}"><xsl:value-of select="username"/></a>
				</td>
				<td style="width:80px;">
					<xsl:value-of select="fullname"/>
				</td>
				<td style="width:80px;">
					<xsl:value-of select="mail"/>
				</td>
			</tr>
		</xsl:for-each>
		</table>
		<br/>
		<a href="{$webroot}admin/users/edit/">
			<input type="button" value="Add a new user"/>
		</a>
		
		</div>
	 </xsl:template>
	 
	 <xsl:template match="/bx/plugin[@name='admin_users']/useradministration/user | /bx/plugin[@name='admin_users']/useradministration/new" mode="xhtml">
	 <h2 class="userPage">
			User 
			<xsl:if test="username/text()">
				| <xsl:value-of select="username"/>
			</xsl:if>
		</h2>
		<div id='usersdiv'>
		<h3 class="userPage">
			General
		</h3>
		<form name="adminform" action="" method="POST" enctype="multipart/form-data">
		<ul>
		<li>
			Username<br/>
			<input type="text" value="{username}" name="bx[plugins][admin_users][username]"/>
		</li>
		<li>
			Fullname<br/>
			<input type="text" value="{fullname}" name="bx[plugins][admin_users][fullname]"/>
		</li>
		<li>
			Mail Adress<br/>
			<input type="text" value="{mail}" name="bx[plugins][admin_users][mail]"/>
		</li>
		<li>
			Sprache<br/>
			<input type="text" value="{user_adminlang}" name="bx[plugins][admin_users][lang]"/>
		</li>
		
		<xsl:choose>
		<xsl:when test="/bx/plugin[@name='admin_users']/useradministration/groups/group">
			<h3 class="userPage">
				User Groups
			</h3>
			<li>
				<xsl:variable name="usergroups" select="/bx/plugin[@name='admin_users']/useradministration/user/groups"/>
				<xsl:for-each select="/bx/plugin[@name='admin_users']/useradministration/groups/group">
					<xsl:variable name="id" select="group-id"/>
					<xsl:variable name="name" select="group-name"/>
					
							<input style="width:15px;" type="checkbox" name="bx[plugins][admin_users][{$name}]">
							<xsl:if test="$usergroups/group/id/text() = $id">
							<xsl:attribute name="checked">checked</xsl:attribute>
							</xsl:if>
							
							</input>
							
							<xsl:value-of select="$name"/><br/>
							<br/>
					
				</xsl:for-each>
				
			</li>
		</xsl:when>
		<xsl:otherwise>
			<li>
				Gid<br/>
				<input type="text" value="{user_gupi}" name="bx[plugins][admin_users][gid]"/>
			</li>
		</xsl:otherwise>
		</xsl:choose>
		
		<li>
		<img src="http://fluxcms/admin/webinc/img/closed_klein.gif" id="advanced_triangle" onclick="toggleUserAdvanced();">
			<xsl:attribute name="src">
				   <xsl:choose>
					   <xsl:when test="$showAdvancedView = 'true'"><xsl:value-of select="$webroot"/>admin/webinc/img/open_klein.gif</xsl:when>
						<xsl:otherwise><xsl:value-of select="$webroot"/>admin/webinc/img/closed_klein.gif</xsl:otherwise>
					 </xsl:choose>
			 </xsl:attribute>
		</img>
		More options (click to expand)
		<br/><br/>
		</li>
		<div id="user" style="display:none;">
		<xsl:call-template name="displayOrNot"/>
		<h3 class="userPage">
			Plazes
		</h3>
		<li>
			 Plazes Username<br/>
		
			<input type="text" value="{plazes_username}" name="bx[plugins][admin_users][plazes_username]"/>
		</li>
		<li>
			 Plazes Password<br/>
		
			<input type="text" value="{plazes_password}" name="bx[plugins][admin_users][plazes_pwd]"/>
		</li>
		<xsl:if test="/bx/plugin[@name='admin_users']/useradministration/authservices/authservice">
			<h3 class="userPage">
				Authservices
			</h3>
			<li>
			<xsl:variable name="userservices" select="/bx/plugin[@name='admin_users']/useradministration/user/services"/>
				
				<xsl:for-each select="/bx/plugin[@name='admin_users']/useradministration/authservices/authservice">
							<xsl:variable name="name" select="authservice-name"/>
							
							<xsl:value-of select="$name"/><br/>
							<input type="text" name="bx[plugins][admin_users][{$name}]">
							<xsl:if test="$userservices/service/servicename/text() = $name">
							<xsl:attribute name="value">
								<xsl:value-of select="$userservices/service[servicename = $name]/account/text()"/>
							</xsl:attribute>
							</xsl:if>
							
							</input>
							
							<br/>
					
				</xsl:for-each>
		</li>
		</xsl:if>
		</div>
		
			<hr/>
		
		
		<li>
			New Password
		<br/>
			<input type="text" value="{password}" name="bx[plugins][admin_users][new_pwd]"/>
		</li>
		<li>
				<i18n:text>Retype New Password</i18n:text>
		<br/>
			<input type="text" value="{password}" name="bx[plugins][admin_users][new_pwd_re]"/>
		</li>
		<li style="color:red;">
			Password
		<br/>
			<input type="text" value="{password}" name="bx[plugins][admin_users][pwd]"/>
		</li>
		<li>
			<input type="submit" value="Send"/>
		
			<a href="{$webroot}admin/users/">
			<input type="button" value="Back"/>
			</a>
		</li>
		</ul>
		</form>
		</div>
	 </xsl:template>
	 
	 <xsl:template name="displayOrNot">
     <xsl:attribute name="style">
           <xsl:choose>
               <xsl:when test="$showAdvancedView = 'true'">
                </xsl:when>
                <xsl:otherwise>display: none;</xsl:otherwise>
             </xsl:choose>
     </xsl:attribute>
    </xsl:template>
	 
</xsl:stylesheet>
