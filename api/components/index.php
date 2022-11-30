<?php 
/**
 * Return all components
 */

require_once '../setup.php';

require_once './Component.php';

if(empty($_GET['category_id'])) {
    echo json_encode(array('error' => 'No category id provided'));
    exit;
}

$Component = new Component($pdo); 

$category_id = $_GET['category_id'];

$components = $Component->getComponents($category_id);

echo json_encode($components);
exit;