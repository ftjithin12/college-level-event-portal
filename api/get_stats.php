<?php
// api/get_stats.php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

include 'db_connect.php';

$stats = [
    'total_registrations' => 0,
    'pending_review' => 0,
    'total_feedback' => 0
];

// Total Registrations
$result = $conn->query("SELECT COUNT(*) as count FROM registrations");
if ($row = $result->fetch_assoc()) $stats['total_registrations'] = $row['count'];

// Pending Review
$result = $conn->query("SELECT COUNT(*) as count FROM registrations WHERE status = 'Pending'");
if ($row = $result->fetch_assoc()) $stats['pending_review'] = $row['count'];

// Total Feedback
$result = $conn->query("SELECT COUNT(*) as count FROM feedback");
if ($row = $result->fetch_assoc()) $stats['total_feedback'] = $row['count'];

echo json_encode(['status' => 'success', 'data' => $stats]);

$conn->close();
?>
