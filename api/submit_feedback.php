<?php
// api/submit_feedback.php
header('Content-Type: application/json');

include 'db_connect.php';

$stmt = $conn->prepare("INSERT INTO feedback (type, subject, details) VALUES (?, ?, ?)");

if (!$stmt) {
    die(json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]));
}

$stmt->bind_param("sss", $type, $subject, $details);

$type    = $_POST['feedbackType'] ?? '';
$subject = $_POST['subject'] ?? '';
$details = $_POST['details'] ?? '';

if (empty($type) || empty($details)) {
    echo json_encode(['status' => 'error', 'message' => 'Please provide feedback details.']);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Feedback submitted successfully!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
