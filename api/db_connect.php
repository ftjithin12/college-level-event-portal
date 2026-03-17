<?php
// api/db_connect.php

$servername = "localhost";
$username = "root"; // Default XAMPP/WAMP username
$password = "";     // Default XAMPP/WAMP password (usually empty)
$dbname = "event_portal";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}
?>
