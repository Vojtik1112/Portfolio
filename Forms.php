<?php
session_start();

$name = '';
$quantity = '';
$color = '';
$message = '';
$orderSummary = '';
$languageMessage = '';
$authMessage = '';
$preferredLanguage = $_COOKIE['preferred_language'] ?? '';
$loggedInUser = $_SESSION['username'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? 'order';

  switch ($action) {
    case 'order':
      $name = trim($_POST['name'] ?? '');
      $quantity = trim($_POST['quantity'] ?? '');
      $color = trim($_POST['color'] ?? '');

      if ($name === '' || $quantity === '' || $color === '') {
        $message = 'Vyplnte vsechna pole.';
      } elseif (!ctype_digit($quantity) || (int) $quantity <= 0) {
        $message = 'Pocet musi byt kladne cislo.';
      } else {
        $orderSummary = 'Objednavka: ' . htmlspecialchars($quantity, ENT_QUOTES, 'UTF-8') . ' ks tuzek (' . htmlspecialchars($color, ENT_QUOTES, 'UTF-8') . ') pro ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '.';
      }
      break;

    case 'set_language':
      $language = trim($_POST['language'] ?? '');

      if ($language === '') {
        $languageMessage = 'Zadejte jazyk, ktery chcete ulozit.';
      } else {
        setcookie('preferred_language', $language, time() + 60 * 60 * 24 * 30, '/');
        $preferredLanguage = $language;
        $languageMessage = 'Preferovany jazyk byl ulozen.';
      }
      break;

    case 'login':
      $username = trim($_POST['login_name'] ?? '');

      if ($username === '') {
        $authMessage = 'Zadejte prosim uzivatelske jmeno.';
      } else {
        session_regenerate_id(true);
        $_SESSION['username'] = $username;
        $loggedInUser = $username;
        $authMessage = 'Prihlaseni probehlo v poradku.';
      }
      break;

    case 'logout':
      $_SESSION = [];

      if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
      }

      session_destroy();
      $loggedInUser = null;
      $authMessage = 'Byl jste odhlasen.';
      break;
  }
}

$preferredLanguageDisplay = $preferredLanguage === '' ? 'neni nastaven' : htmlspecialchars($preferredLanguage, ENT_QUOTES, 'UTF-8');

?>




<!DOCTYPE html>

<html lang="cs">



<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Objednavka tuzek</title>

  <meta name="description" content="Online objednavkovy formular na tuzky se spravou relaci, cookies a uzivatelskym prihlasenim.">
  <link rel="canonical" href="https://vojtik1112.github.io/Portfolio/Forms.php">
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/png" href="Images/vojta-novak.png">

</head>



<body>


  <form method="post">
    <input type="hidden" name="action" value="order">
    <input type="text" name="name" placeholder="Jmeno" value="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>">
    <input type="text" name="quantity" placeholder="Pocet kusu" value="<?php echo htmlspecialchars($quantity, ENT_QUOTES, 'UTF-8'); ?>">
    <input type="text" name="color" placeholder="Barva tuzek" value="<?php echo htmlspecialchars($color, ENT_QUOTES, 'UTF-8'); ?>">
    <input type="submit" value="Objednat">
  </form>


  <?php if ($message !== '') echo '<p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>'; ?>
  <?php if ($orderSummary !== '') echo '<p>' . $orderSummary . '</p>'; ?>

  <h2>Preferovany jazyk</h2>
  <p>Aktualni hodnota: <?php echo $preferredLanguageDisplay; ?></p>
  <form method="post">
    <input type="hidden" name="action" value="set_language">
    <input type="text" name="language" placeholder="Napiste jazyk" value="<?php echo htmlspecialchars($preferredLanguage, ENT_QUOTES, 'UTF-8'); ?>">
    <input type="submit" value="Ulozit jazyk">
  </form>
  <?php if ($languageMessage !== '') echo '<p>' . htmlspecialchars($languageMessage, ENT_QUOTES, 'UTF-8') . '</p>'; ?>

  <h2>Prihlaseni</h2>
  <?php if ($loggedInUser !== null) { ?>
    <p>Prihlasen uzivatel: <?php echo htmlspecialchars($loggedInUser, ENT_QUOTES, 'UTF-8'); ?></p>
    <form method="post">
      <input type="hidden" name="action" value="logout">
      <input type="submit" value="Odhlasit">
    </form>
  <?php } else { ?>
    <form method="post">
      <input type="hidden" name="action" value="login">
      <input type="text" name="login_name" placeholder="Uzivatelske jmeno">
      <input type="submit" value="Prihlasit">
    </form>
  <?php } ?>
  <?php if ($authMessage !== '') echo '<p>' . htmlspecialchars($authMessage, ENT_QUOTES, 'UTF-8') . '</p>'; ?>


</body>



</html>
