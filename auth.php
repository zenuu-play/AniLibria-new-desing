<?php
header('Content-type: application/json; charset=utf-8');




if(!isset($_COOKIE['session'])){
    $myCurl = curl_init();
    curl_setopt_array($myCurl, array(
        CURLOPT_URL => 'https://www.anilibria.tv/public/login.php',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HEADER => true,
        CURLOPT_POSTFIELDS => http_build_query(array(
            "mail" => 'zenuu-play@ya.ru',
            "passwd" => 'SWA0yIv1',
        ))
    ));
    $response = curl_exec($myCurl);
    curl_close($myCurl);
    
    //echo "Ответ на Ваш запрос: ".$response;
    
    preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $response, $matches);
    $cookies = array();
    foreach($matches[1] as $item) {
        parse_str($item, $cookie);
        $cookies = array_merge($cookies, $cookie);
    }
    echo json_encode($cookies);
    setcookie('session', $cookies['PHPSESSID'], time()+86400);
}else{
    $myCurl = curl_init();
    curl_setopt_array($myCurl, array(
        CURLOPT_URL => 'https://www.anilibria.tv/public/api/index.php',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(array(
            "query" => 'user',
            "user" => 'zenuu',
        ))
    ));
    $response = curl_exec($myCurl);
    curl_close($myCurl);

    echo $response;
    // $result = json_decode(file_get_contents("https://api.anilibria.tv/v2//v2/getFavorites?session=$_COOKIE[session]&filter=names,id,status,type,poster,updated,blocked"));
    // $data = file_get_contents("https://www.anilibria.tv/pages/cp.php");
    // echo json_encode(array(
    //     "msg" => "cookies set!",
    //     "key" => $_COOKIE['session'],
    //     "data" => $response,
    //     "favorites" => [
    //         "count" => count($result),
    //         "list" => $result
    //     ],
    // ));
}
//print_r($response);