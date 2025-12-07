<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Náhled JSON</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>Náhled Produktu (JSON)</h2>
        <?php
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);

        $file = __DIR__ . '/data/garment.json';
        if (file_exists($file)) {
            $jsonContent = file_get_contents($file);
            $data = json_decode($jsonContent, true);

            echo "<table>";
            echo "<tr><th>Vlastnost</th><th>Hodnota</th></tr>";
            echo "<tr><td>Druh</td><td>" . htmlspecialchars($data['species']) . "</td></tr>";
            echo "<tr><td>Název</td><td>" . htmlspecialchars($data['name']) . "</td></tr>";
            
            echo "<tr><td>Vlastnosti</td><td>" . htmlspecialchars(implode(", ", $data['properties'])) . "</td></tr>";

            echo "<tr><td>Velikost</td><td>" . htmlspecialchars($data['size']) . "</td></tr>";
            echo "<tr><td>Barva</td><td>" . htmlspecialchars($data['color']) . "</td></tr>";
            echo "</table>";
        } else {
            echo "<p>Soubor data/garment.json nebyl nalezen (Cesta: $file).</p>";
        }
        ?>
        <br>
        <button onclick="window.close()" class="btn">Zavřít</button>
    </div>
</body>
</html>
