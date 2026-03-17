<?php
// api/get_registrations.php
header('Content-Type: application/json');

include 'db_connect.php';

$sql = "SELECT * FROM registrations ORDER BY created_at DESC";
$result = $conn->query($sql);

$registrations = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }
}

echo json_encode([
    'status' => 'success',
    'data' => $registrations
]);

$conn->close();
?>
