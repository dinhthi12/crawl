<?php

// URL của trang web bạn muốn cào dữ liệu
$url = 'https://example.com';

// Khởi tạo cURL session
$ch = curl_init($url);

// Thiết lập các tùy chọn cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CAINFO, './cacert.pem'); // Đường dẫn đến tệp chứng chỉ CA của bạn

// Thực hiện request và lưu nội dung vào biến
$html = curl_exec($ch);

// Kiểm tra xem request có thành công không
if ($html === false) {
    die('cURL error: ' . curl_error($ch));
}

// Đóng cURL session
curl_close($ch);

// Lưu mã HTML vào tệp output.html
file_put_contents('output.html', $html);

// Hiển thị thông báo
echo 'Mã HTML đã được lưu vào tệp output.html';
