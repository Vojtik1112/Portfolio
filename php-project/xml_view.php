<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Náhled XML</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>Náhled Produktu (XML)</h2>
        <?php
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);

        $file = __DIR__ . '/data/garment.xml';
        if (file_exists($file)) {
            $content = file_get_contents($file);
            
            // Manual parsing fallback since simplexml might be missing
            $species = '';
            if (preg_match('/<species>\s*(.*?)\s*<\/species>/s', $content, $matches)) {
                $species = trim($matches[1]);
            }
            
            $name = '';
            if (preg_match('/<name>\s*(.*?)\s*<\/name>/s', $content, $matches)) {
                $name = trim($matches[1]);
            }
            
            $size = '';
            if (preg_match('/<size>\s*(.*?)\s*<\/size>/s', $content, $matches)) {
                $size = trim($matches[1]);
            }
            
            $color = '';
            if (preg_match('/<color>\s*(.*?)\s*<\/color>/s', $content, $matches)) {
                $color = trim($matches[1]);
            }
            
            $props = [];
            if (preg_match_all('/<prop>\s*(.*?)\s*<\/prop>/s', $content, $matches)) {
                $props = array_map('trim', $matches[1]);
            }

            echo "<table>";
            echo "<tr><th>Vlastnost</th><th>Hodnota</th></tr>";
            echo "<tr><td>Druh</td><td>" . $species . "</td></tr>";
            echo "<tr><td>Název</td><td>" . $name . "</td></tr>";
            
            echo "<tr><td>Vlastnosti</td><td>";
            echo implode(", ", $props);
            echo "</td></tr>";

            echo "<tr><td>Velikost</td><td>" . $size . "</td></tr>";
            echo "<tr><td>Barva</td><td>" . $color . "</td></tr>";
            echo "</table>";
        } else {
            echo "<p>Soubor data/garment.xml nebyl nalezen (Cesta: $file).</p>";
        }
        ?>
        <br>
        <button onclick="window.close()" class="btn">Zavřít</button>
    </div>
</body>
</html>
