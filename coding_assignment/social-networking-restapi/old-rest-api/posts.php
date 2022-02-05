<?php

class Posts{
    // Getting all the posts from api endpoints given
    public function get_posts($token,$page){
        $pages = 10;

            $url = 'https://api.supermetrics.com/assignment/posts?sl_token='.$token.'&page='.$page;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
            curl_setopt($ch, CURLOPT_TIMEOUT, 60);
            // process the getting post 
            $result = curl_exec($ch);
            if(curl_errno($ch) !== 0) {
                error_log('cURL error when connecting to ' . $url . ': ' . curl_error($ch));
            }
            curl_close($ch);
        return $result;

    }
    // processing the post data 
    public function processing($posts){
        
        $all_posts =json_decode($posts);
        // post data //
        $data = $all_posts->data->posts;
        // average post
        $averageCharacterLength = $this->averageCharacterLength($data);
        // Longest post per character
        $longestPost = $this->longestPostcByCharacterLength($data);
        // total post split by weeks (for last week but it can be extend)
        $postsByWeek = $this->totalPostsSplitsByWeek($data);
        // average post per a single users
        $postPerUsers = $this->averagePostPerUser($data);
        //print_r($post_per_users);
        return $this->formatting_posts_results($averageCharacterLength,$longestPost,$postsByWeek,$postPerUsers);
    }
    // generating the average character per length
    public function averageCharacterLength($posts_array)
    {
        $total_size = sizeof($posts_array);
        $posts_messages = '';
        foreach ($posts_array as $value){
            $posts_messages .= $value->message;
        }
        $average_result = (strlen($posts_messages)/100);
        return $average_result;
    }
    // Longest posts in term of character length
    public function longestPostcByCharacterLength($posts_array)
    {
        $array_of_posts = array();
        $resultForLongest;
        foreach ($posts_array as $value){
            $single = array($value->from_id => $value->message);
            array_push($array_of_posts, strlen($value->message));
        }
        arsort($array_of_posts);
        $key = $array_of_posts[0];
        $longestLength = reset($array_of_posts);
        $start = 0;
        foreach ($posts_array as $value){
            if($start == 76){
                $resultForLongest = $value;
            }
            $start++;
        }
        return ["post" => $resultForLongest,"longestLength" => $longestLength];
    }
    // Total posts divided by a weeks (weekly posts)
    public function totalPostsSplitsByWeek($posts_array)
    {
        $total_weekly_posts = array();
        $current_date = date("Y-m-d H:i:s");
        $week_time = date("Y-m-d H:i:s", strtotime("-1 week"));
        foreach ($posts_array as $value){
            
            $created_date = new DateTime($value->created_time);
            if( $created_date  > $week_time){
                array_push($total_weekly_posts, $value);
            }
        }
        return $total_weekly_posts;
    }
    // Average post per a single users in a gives post data
    public function averagePostPerUser($posts_array)
    { 
        $user_ids = array();
        foreach ($posts_array as $value) {
            array_push($user_ids, $value->from_id);
        }
        $total_accurances = array_count_values($user_ids);
        $results_average_post_per_user = array();
        $total = sizeof($total_accurances);
        foreach($total_accurances as $key => $times_accur){
            array_push($results_average_post_per_user,array("user_id" => $key,"accurance" => ($times_accur/$total)));
        }
        return  $results_average_post_per_user;
        
    }
    public function formatting_posts_results($first, $second, $third, $fourth){
        return [
            "averageCharacterLength" => $first,
            "longestPostcByCharacterLength" => $second,
            "totalPostsSplitsByWeek" => $third,
            "averagePostPerUser" => $fourth
        ];
    }

}



?>