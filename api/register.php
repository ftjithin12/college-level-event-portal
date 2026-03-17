<?php
// api/register.php
header('Content-Type: application/json');

include 'db_connect.php';

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO registrations (full_name, email, branch, semester, phone, event_id) VALUES (?, ?, ?, ?, ?, ?)");

// Basic error checking on prepare
if (!$stmt) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Prepare statement failed: ' . $conn->error
    ]));
}

$stmt->bind_param("ssssss", $fullName, $email, $branch, $semester, $phone, $eventId);

// Get POST data (From FormData via fetch)
$fullName = $_POST['fullName'] ?? '';
$email    = $_POST['email'] ?? '';
$branch   = $_POST['branch'] ?? '';
$semester = $_POST['semester'] ?? '';
$phone    = $_POST['phone'] ?? '';
$eventId  = $_POST['event'] ?? '';

// Basic validation
if (empty($fullName) || empty($email) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
