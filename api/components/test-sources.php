<?php 
/**
 * Return all Test Sources
 */

require_once '../setup.php';

require_once './Component.php';

$Component = new Component($pdo); 

$sources = $Component->getTestSources();

echo json_encode($sources);
exit;