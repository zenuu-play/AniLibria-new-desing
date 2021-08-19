<?php

if($_SERVER['REQUEST_URI'] === '/'){
    require 'index.html';
}
else if(strpos($_SERVER['REQUEST_URI'], '/release') === 0){
    require 'release.html';
}else{
    require '404.html';
}
