<?php
// api/update_status.php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

include 'db_connect.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? ($_POST['id'] ?? 0);
$status = $input['status'] ?? ($_POST['status'] ?? '');

if (empty($id) || !is_numeric($id) || !in_array($status, ['Pending', 'Confirmed'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$stmt = $conn->prepare("UPDATE registrations SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Status updated.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update.']);
}

$stmt->close();
$conn->close();
?>
