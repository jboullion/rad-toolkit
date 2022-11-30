<?php 
/**
 * Return all categories
 */

require_once '../setup.php';

require_once './Component.php';

$Component = new Component($pdo); 

$categories = $Component->getCategories();

echo json_encode($categories);
exit;