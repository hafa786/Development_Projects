<?php 
// The main API file to run
require('register.php'); 
require('posts.php'); 
// main class Api
Class Api{
    // get token //
    public function run(){
        $register = new Register();
        $posts = new Posts();
        // get token //
        $results = $register->register_token();
        // get posts testing it for a single page //
        $posts_result = $posts->get_posts($results, 1);
        // processing the post data
        $results = $posts->processing($posts_result);
        return json_encode($results);
    }
    
}
// calling API 
$api = new Api();
$response = $api->run();
print_r($response);
?>