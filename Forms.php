<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'ajax_greeting') {
  $rawName = trim($_POST['name'] ?? '');
  $safeName = $rawName === '' ? 'Neznamy' : htmlspecialchars($rawName, ENT_QUOTES, 'UTF-8');

  header('Content-Type: application/json; charset=UTF-8');
  echo json_encode(['message' => 'Ahoj, ' . $safeName . '!']);
  exit;
}

function h(?string $value): string
{
  return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

$preferredLanguage = $_COOKIE['preferred_language'] ?? '';
$loggedInUser = $_SESSION['username'] ?? null;

$formValues = [
  'name' => '',
  'quantity' => '',
  'color' => '',
  'language' => $preferredLanguage,
  'login_name' => ''
];

$flashMessages = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? 'order';

  switch ($action) {
    case 'order':
      $formValues['name'] = trim($_POST['name'] ?? '');
      $formValues['quantity'] = trim($_POST['quantity'] ?? '');
      $formValues['color'] = trim($_POST['color'] ?? '');

      if ($formValues['name'] === '' || $formValues['quantity'] === '' || $formValues['color'] === '') {
        $flashMessages[] = ['type' => 'error', 'text' => 'Vyplnte prosim vsechna pole.'];
      } elseif (!ctype_digit($formValues['quantity']) || (int) $formValues['quantity'] <= 0) {
        $flashMessages[] = ['type' => 'error', 'text' => 'Pocet musi byt kladne cele cislo.'];
      } else {
        $flashMessages[] = [
          'type' => 'success',
          'text' => 'Objednavka: ' . h($formValues['quantity']) . ' ks tuzek (' . h($formValues['color']) . ') pro ' . h($formValues['name']) . '. '
        ];
        $formValues['quantity'] = '';
        $formValues['color'] = '';
      }
      break;

    case 'set_language':
      $formValues['language'] = trim($_POST['language'] ?? '');

      if ($formValues['language'] === '') {
        $flashMessages[] = ['type' => 'error', 'text' => 'Zadejte jazyk, ktery chcete ulozit.'];
      } else {
        setcookie('preferred_language', $formValues['language'], time() + 60 * 60 * 24 * 30, '/');
        $preferredLanguage = $formValues['language'];
        $flashMessages[] = ['type' => 'success', 'text' => 'Preferovany jazyk byl ulozen.'];
      }
      break;

    case 'login':
      $formValues['login_name'] = trim($_POST['login_name'] ?? '');

      if ($formValues['login_name'] === '') {
        $flashMessages[] = ['type' => 'error', 'text' => 'Zadejte prosim uzivatelske jmeno.'];
      } else {
        session_regenerate_id(true);
        $_SESSION['username'] = $formValues['login_name'];
        $loggedInUser = $formValues['login_name'];
        $flashMessages[] = ['type' => 'success', 'text' => 'Prihlaseni probehlo v poradku.'];
        $formValues['login_name'] = '';
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
      $flashMessages[] = ['type' => 'success', 'text' => 'Byl jste odhlasen.'];
      break;
  }
}

$preferredLanguageDisplay = $preferredLanguage === '' ? 'neni nastaven' : h($preferredLanguage);

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
  <link rel="icon" type="image/png" href="assets/images/vojta-novak.png">
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      color: #1f2933;
    }

    header {
      background: #111827;
      color: #f9fafb;
      padding: 1.5rem;
      text-align: center;
    }

    a {
      color: inherit;
    }

    main {
      max-width: 960px;
      margin: 2rem auto;
      padding: 0 1rem 3rem;
    }

    .layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }

    h1 {
      margin: 0 0 0.75rem;
      font-size: 1.75rem;
    }

    h2 {
      margin: 0 0 1rem;
      font-size: 1.25rem;
      color: #111827;
    }

    p {
      margin: 0 0 1rem;
      line-height: 1.6;
    }

    form {
      display: grid;
      gap: 0.75rem;
    }

    label {
      font-size: 0.9rem;
      font-weight: bold;
      color: #111827;
    }

    input[type="text"],
    input[type="number"],
    button,
    input[type="submit"] {
      font: inherit;
      padding: 0.65rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #cbd5f5;
    }

    input[type="text"],
    input[type="number"] {
      background: #f9fafb;
    }

    input[type="text"]:focus,
    input[type="number"]:focus {
      outline: 2px solid #6366f1;
      outline-offset: 1px;
    }

    button,
    input[type="submit"] {
      cursor: pointer;
      background: #111827;
      color: #f9fafb;
      border-color: #111827;
      transition: background 0.2s ease-in-out;
    }

    button:hover,
    input[type="submit"]:hover {
      background: #1f2937;
    }

    .notice-list {
      list-style: none;
      margin: 1.5rem auto;
      padding: 0;
      max-width: 960px;
    }

    .notice {
      margin-bottom: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid transparent;
    }

    .notice--error {
      background: #fee2e2;
      border-color: #fca5a5;
      color: #991b1b;
    }

    .notice--success {
      background: #dcfce7;
      border-color: #86efac;
      color: #166534;
    }

    .grid-compact {
      display: grid;
      gap: 0.5rem;
    }

    .ajax-box {
      margin-top: 1.5rem;
    }

    #ajax-result {
      min-height: 1.5rem;
      font-weight: bold;
    }

    footer {
      text-align: center;
      font-size: 0.85rem;
      padding: 2rem 1rem 3rem;
      color: #4b5563;
    }

    @media (max-width: 600px) {
      header {
        padding: 1rem;
      }

      main {
        margin: 1.5rem auto;
      }
    }
  </style>
</head>

<body>
  <header>
    <h1>Jednoducha mini aplikace s formulari</h1>
    <p>Objednavka, cookies, prihlaseni i maly AJAX pozdrav. Bez knihoven, jen PHP a vanilla JS.</p>
    <p><a href="index.html" style="text-decoration: underline;">Zpet na hlavni stranku</a></p>
  </header>

  <?php if (!empty($flashMessages)) { ?>
    <ul class="notice-list">
      <?php foreach ($flashMessages as $flash) { ?>
        <li class="notice notice--<?php echo $flash['type'] === 'error' ? 'error' : 'success'; ?>">
          <?php echo $flash['text']; ?>
        </li>
      <?php } ?>
    </ul>
  <?php } ?>

  <main>
    <section class="layout">
      <article class="card">
        <h2>Objednavka tuzek</h2>
        <p>Vyplnte zakladni udaje. Odpoved se po odeslani vrati na tuto stranku.</p>
        <form method="post" class="grid-compact">
          <input type="hidden" name="action" value="order">
          <label for="order-name">Jmeno</label>
          <input id="order-name" type="text" name="name" placeholder="Jmeno" value="<?php echo h($formValues['name']); ?>">
          <label for="order-quantity">Pocet kusu</label>
          <input id="order-quantity" type="number" name="quantity" placeholder="Pocet kusu" min="1" value="<?php echo h($formValues['quantity']); ?>">
          <label for="order-color">Barva tuzek</label>
          <input id="order-color" type="text" name="color" placeholder="Barva tuzek" value="<?php echo h($formValues['color']); ?>">
          <input type="submit" value="Objednat">
        </form>
      </article>

      <article class="card">
        <h2>Preferovany jazyk</h2>
        <p>Aktualni hodnota: <strong><?php echo $preferredLanguageDisplay; ?></strong></p>
        <form method="post" class="grid-compact">
          <input type="hidden" name="action" value="set_language">
          <label for="language-input">Jazyk</label>
          <input id="language-input" type="text" name="language" placeholder="Napiste jazyk" value="<?php echo h($formValues['language']); ?>">
          <input type="submit" value="Ulozit jazyk">
        </form>
      </article>

      <article class="card">
        <h2>Prace se sessions</h2>
        <?php if ($loggedInUser !== null) { ?>
          <p>Prihlasen uzivatel: <strong><?php echo h($loggedInUser); ?></strong></p>
          <form method="post">
            <input type="hidden" name="action" value="logout">
            <input type="submit" value="Odhlasit">
          </form>
        <?php } else { ?>
          <p>Zadejte testovaci jmeno a ulozime ho do session.</p>
          <form method="post" class="grid-compact">
            <input type="hidden" name="action" value="login">
            <label for="login-name">Uzivatelske jmeno</label>
            <input id="login-name" type="text" name="login_name" placeholder="Uzivatelske jmeno" value="<?php echo h($formValues['login_name']); ?>">
            <input type="submit" value="Prihlasit">
          </form>
        <?php } ?>
      </article>
    </section>

    <section class="card ajax-box">
      <h2>AJAX Pozdrav</h2>
      <p>Vyzkousejte jednoduchy fetch POST pozadavek bez obnovení stranky.</p>
      <label for="ajax-name">Zadejte jmeno</label>
      <input type="text" id="ajax-name" placeholder="Napiste jmeno">
      <button type="button" id="ajax-submit">Odeslat pozdrav</button>
      <p id="ajax-result" aria-live="polite"></p>
    </section>
  </main>

  <footer>
    Stranka pro demonstraci zakladnich postupu s formulary v PHP. Bez databaze, jen sessions & cookies.
  </footer>

  <script>
    (function() {
      const nameInput = document.getElementById('ajax-name');
      const resultEl = document.getElementById('ajax-result');
      const button = document.getElementById('ajax-submit');

      if (!nameInput || !resultEl || !button) {
        return;
      }

      const setBusy = (isBusy) => {
        button.disabled = isBusy;
        button.textContent = isBusy ? 'Odesilam...' : 'Odeslat pozdrav';
      };

      button.addEventListener('click', async () => {
        const params = new URLSearchParams();
        params.set('action', 'ajax_greeting');
        params.set('name', nameInput.value.trim());

        resultEl.textContent = 'Zpracovavam...';
        setBusy(true);

        try {
          const response = await fetch('Forms.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: params.toString()
          });

          if (!response.ok) {
            throw new Error('Server vratil chybu');
          }

          const data = await response.json();
          resultEl.innerHTML = data.message ?? 'Chyba zpracovani odpovedi.';
        } catch (error) {
          resultEl.textContent = 'Nepodarilo se odeslat pozadavek.';
          console.error('AJAX pozdrav selhal', error);
        } finally {
          setBusy(false);
        }
      });
    })();
  </script>
</body>

</html>
