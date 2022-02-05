<?php 
//echo "Hello world";
class Register{
    public function register_token(){
        $url = 'https://api.supermetrics.com/assignment/register';
        $params = array(
            'client_id' => 'ju16a6m81mhid5ue1z3v2g0uh',
            'email' => 'foo@bar.com',
            'name' => 'Firstname Lastname',
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);

        // This should be the default Content-type for POST requests
        $result = curl_exec($ch);
        if(curl_errno($ch) !== 0) {
            error_log('cURL error when connecting to ' . $url . ': ' . curl_error($ch));
        }
        curl_close($ch);

        $json_result = json_decode($result, true);
        return $json_result["data"]["sl_token"];
    }
}
?>