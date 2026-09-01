<?php
/**
 * VAN Crops PDF ZIP Download Endpoint
 * Production version - ready to deploy
 */

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Parse JSON request
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['crops']) || !is_array($input['crops']) || empty($input['crops'])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid request: crops array required']);
    exit;
}

// Validate crop count
if (count($input['crops']) > 3) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Maximum 3 crops allowed']);
    exit;
}

// Map crop names to PDF paths
$cropPDFMap = [
    'wheat' => 'plans/Wheat-Nutrition-Plan.pdf',
    'cotton' => 'plans/Cotton-Nutrition-Plan.pdf',
    'rice-basmati' => 'plans/Rice-Basmati-Nutrition-Plan.pdf',
    'rice-hybrid' => 'plans/Rice-Hybrid-Nutrition-Plan.pdf',
    'sugarcane' => 'plans/Sugarcane-Nutrition-Plan.pdf',
    'sugarcane-ratoon' => 'plans/Sugarcane-Ratoon-Nutrition-Plan.pdf',
    'maize' => 'plans/Maize-Nutrition-Plan.pdf',
    'potato' => 'plans/Potato-Nutrition-Plan.pdf',
    'onion' => 'plans/Onion-Nutrition-Plan.pdf',
    'garlic' => 'plans/Garlic-Nutrition-Plan.pdf',
    'chickpea' => 'plans/Chickpea-Nutrition-Plan.pdf',
    'lentil' => 'plans/Lentil-Nutrition-Plan.pdf',
    'mungbean-mash' => 'plans/Mungbean-Mash-Nutrition-Plan.pdf',
    'soybean' => 'plans/Soybean-Nutrition-Plan.pdf',
    'sunflower' => 'plans/Sunflower-Nutrition-Plan.pdf',
    'sesame' => 'plans/Sesame-Nutrition-Plan.pdf',
    'canola' => 'plans/Canola-Nutrition-Plan.pdf',
    'tomato' => 'plans/Tomato-Nutrition-Plan.pdf',
    'chili' => 'plans/Chili-Nutrition-Plan.pdf',
    'strawberry' => 'plans/Strawberry-Nutrition-Plan.pdf',
    'mango' => 'plans/Mango-Nutrition-Plan.pdf',
    'citrus' => 'plans/Citrus-Nutrition-Plan.pdf',
    'guava' => 'plans/Guava-Nutrition-Plan.pdf',
    'date-palm' => 'plans/Date-Palm-Nutrition-Plan.pdf',
    'banana-year1' => 'plans/Banana-Year1-Nutrition-Plan.pdf',
    'banana-year2' => 'plans/Banana-Year2-Nutrition-Plan.pdf',
    'watermelon' => 'plans/Watermelon-Nutrition-Plan.pdf',
    'turmeric' => 'plans/Turmeric-Nutrition-Plan.pdf'
];

// Validate all crops exist
$invalidCrops = array_diff($input['crops'], array_keys($cropPDFMap));
if (!empty($invalidCrops)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid crops: ' . implode(', ', $invalidCrops)]);
    exit;
}

// Check if ZIP extension is available
if (!extension_loaded('zip')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'ZIP extension not available']);
    exit;
}

// Create temporary ZIP
$zipFile = tempnam(sys_get_temp_dir(), 'van_') . '.zip';
$zip = new ZipArchive();

if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Failed to create ZIP']);
    exit;
}

// Add each PDF to ZIP
$baseDir = $_SERVER['DOCUMENT_ROOT'];
foreach ($input['crops'] as $crop) {
    $pdfPath = $cropPDFMap[$crop];
    $fullPath = $baseDir . '/' . $pdfPath;
    
    if (file_exists($fullPath)) {
        $filename = ucwords(str_replace('-', ' ', $crop)) . ' Nutrition Plan.pdf';
        $zip->addFile($fullPath, $filename);
    }
}

$zip->close();

// Send ZIP file
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="VAN-Crop-Plans.zip"');
header('Content-Length: ' . filesize($zipFile));
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');

readfile($zipFile);
unlink($zipFile);
exit;
