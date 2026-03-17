<?php
// api/delete_registration.php
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

if (empty($id) || !is_numeric($id)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid ID']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM registrations WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration deleted.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete.']);
}

$stmt->close();
$conn->close();
?>
