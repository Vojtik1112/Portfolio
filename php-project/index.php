<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Projekt - Menu</title>
    <link rel="stylesheet" href="style.css">
    <script>
        function openPopup(url) {
            window.open(url, "popupWindow", "width=600,height=600,scrollbars=yes");
        }
    </script>
</head>
<body>
    <div class="container">
        <h1>PHP Projekt - Menu</h1>
        <div class="menu">
            <button onclick="openPopup('xml_view.php')" class="btn">Náhled XML (Bunda)</button>
            <button onclick="openPopup('json_view.php')" class="btn">Náhled JSON (Bunda)</button>
            <button onclick="location.href='editor.php'" class="btn">Textový Editor</button>
        </div>
    </div>
</body>
</html>
