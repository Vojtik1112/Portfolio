<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$file = __DIR__ . '/data/saved_text.txt';
$message = "";
$currentText = "";

// Handle Save
if (isset($_POST['save'])) {
    $textToSave = $_POST['text'] ?? '';
    file_put_contents($file, $textToSave);
    $message = "Text byl uložen.";
    $currentText = $textToSave;
}

// Handle Load
if (isset($_POST['load'])) {
    if (file_exists($file)) {
        $currentText = file_get_contents($file);
        $message = "Text byl načten.";
    } else {
        $message = "Uložený soubor neexistuje.";
    }
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Textový Editor</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container" style="width: 500px;">
        <h1>Textový Editor</h1>
        <?php if ($message): ?>
            <p style="color: #4ade80; margin-bottom: 1rem;"><?php echo $message; ?></p>
        <?php endif; ?>

        <form method="post">
            <textarea name="text" placeholder="Zde pište text..."><?php echo htmlspecialchars($currentText); ?></textarea>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button type="submit" name="save" class="btn">Uložit do souboru</button>
                <button type="submit" name="load" class="btn" style="background-color: #f59e0b;">Načíst ze souboru</button>
            </div>
        </form>
        <br>
        <button onclick="location.href='index.php'" class="btn" style="background-color: #6b7280;">Zpět do Menu</button>
    </div>
</body>
</html>
