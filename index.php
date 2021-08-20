<?php

require_once 'router.php';


Router::route('/', function(){
   require 'index.html';
 });

Router::route('/release/(\d+)', function($release){
  //print $release;
  require 'release.html';
});

// запускаем маршрутизатор, передавая ему запрошенный адрес
Router::execute($_SERVER['REQUEST_URI']);
?>