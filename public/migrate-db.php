<?php
header('Content-Type: application/json');
$host = 'localhost';
$user = 'rggroupindia_invo_user';
$pass = '53U]MA=Ws,[^^zS7';
$db   = 'rggroupindia_invo';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit;
}

// 1. Insert Category 6: ALL IN ONE PC
$conn->query("INSERT INTO mst_category (category_id, category_name) VALUES (6, 'ALL IN ONE PC') ON DUPLICATE KEY UPDATE category_name = VALUES(category_name)");

// 2. Insert Model for ALL IN ONE PC
$conn->query("INSERT INTO mst_product_model (model_id, category_id, brand, model_no, product_name, warranty_month, status) VALUES (9, 6, 'INVO', 'INVO-AIO24', 'INVO All In One Computer 23.8\" FHD', 36, 1) ON DUPLICATE KEY UPDATE category_id = 6, model_no = VALUES(model_no), product_name = VALUES(product_name)");

// 3. Ensure all IN22I units are assigned category 6
$conn->query("UPDATE trn_inventory_unit SET category_id = 6 WHERE serial_no LIKE 'IN22I%'");

// 4. Fetch updated categories
$catResult = $conn->query("SELECT * FROM mst_category ORDER BY category_id ASC");
$categories = [];
while ($row = $catResult->fetch_assoc()) {
    $categories[] = $row;
}

echo json_encode([
    "success" => true,
    "message" => "Database successfully updated! Category 6 'ALL IN ONE PC' is now active in live database.",
    "categories" => $categories
]);
$conn->close();
?>
