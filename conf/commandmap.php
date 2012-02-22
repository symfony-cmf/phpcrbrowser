<?php
$m = new api_routing();
/* $m->route('webdav/*path')
  ->config(array(
    'command' => 'webdav',
    'method' => 'index',
    'view' => array('xsl' => 'webdav.xsl','class'=>'noview')));


$m->route('edit/*path')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'index',
    'view' => array('xsl' => 'default.xsl')));
*/
$m->route('__json__/tree/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'tree',
    'view' => array('class' => 'txt')));

  $m->route('__json__/properties/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'properties',
    'view' => array('class' => 'txt')));


    $m->route('__json__/versions/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'versions',
    'view' => array('class' => 'txt')));

    $m->route('__json__/restore/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'restore',
    'view' => array('class' => 'txt')));


      $m->route('__json__/nodetypes/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'nodetypes',
    'view' => array('class' => 'txt')));


      $m->route('__json__/addnode/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'addnode',
    'view' => array('class' => 'txt')));

	
      $m->route('__json__/removenode/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'removenode',
    'view' => array('class' => 'txt')));

	
      $m->route('__json__/delcache/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'delcache',
    'view' => array('class' => 'txt')));


        $m->route('__json__/createversion/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'createversion',
    'view' => array('class' => 'txt')));


        $m->route('__json__/setproperty/')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'setproperty',
    'view' => array('class' => 'txt')));


  $m->route('*path')
  ->config(array(
    'command' => 'crbrowser',
    'method' => 'index',
    'view' => array('xsl' => 'crbrowser2.xsl')));

  /*$m->route('*path')
  ->config(array(
    'command' => 'lxcr',
    'method' => 'put',
    'view' => array('class' => 'lxcr','xsl' => 'default.xsl')))
    ->when(array('verb' => 'PUT'));


  $m->route('*path')
  ->config(array(
    'command' => 'lxcr',
    'method' => 'index',
    'view' => array('class' => 'lxcr','xsl' => 'default.xsl')));
    
    */
