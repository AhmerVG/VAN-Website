<?php
/**
 * api/enquiry.php · van.com.pk · 26 Sep 2026 (D-190)
 *
 * The one endpoint every form on the site posts to. Contract: src/lib/forms.ts in the site source.
 *   POST JSON { form, fields{}, page, sentAt, openedMs, hp }
 *   200 {ok:true, ref}   422 {ok:false, message}   429 {ok:false}   500 {ok:false}
 * On any non-200 the page falls back to WhatsApp and email with the same message, so nothing is lost.
 *
 * What it does, in order: refuse anything but POST · drop bots silently (honeypot filled, or the form
 * was open under 2.5 s) · require a phone or an email · rate limit 5 per IP per hour · write the row
 * to a CSV OUTSIDE the web root (the record) · mail the right inbox (the alert). If the mail cannot be
 * sent the row is still on disk and the sender is told to use WhatsApp, so the enquiry exists twice
 * rather than nowhere.
 *
 * Before switching on (Ahmer): 1. open /api/ping.php and see "ok". 2. cPanel > Email > Email Routing
 * for van.com.pk must be REMOTE Mail Exchanger, because the inboxes are on Zoho; on "Local", mail()
 * reports success and the message lands in a mailbox on this server that nobody reads. 3. Create
 * website@van.com.pk on Zoho for bounces. 4. Send 1 test per form and watch it arrive.
 * Enquiries file: ~/van-enquiries/enquiries.csv (cPanel File Manager, one level above public_html).
 */
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('{"ok":false}'); }
$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) { http_response_code(422); exit(json_encode(['ok' => false, 'message' => 'Nothing arrived. Send it on WhatsApp instead.'])); }

// Inbox per form, as Tahir set them on 3 Oct 2026: dealer, partner and lab-test to partner@;
// farmer-plan and report-bag to info@.
$INBOX = ['dealer' => 'partner@van.com.pk', 'partner' => 'partner@van.com.pk',
          'lab-test' => 'partner@van.com.pk', 'farmer-plan' => 'info@van.com.pk', 'report-bag' => 'info@van.com.pk'];
$FROM  = 'website@van.com.pk';
$form  = (string)($in['form'] ?? '');
$f     = is_array($in['fields'] ?? null) ? $in['fields'] : [];
$hp    = trim((string)($in['hp'] ?? ''));
$open  = (int)($in['openedMs'] ?? 0);

// Bot checks, repeated server side. A bot is told "ok" and nothing is stored.
if ($hp !== '' || $open < 2500) exit(json_encode(['ok' => true, 'ref' => null]));
if (!isset($INBOX[$form])) { http_response_code(422); exit(json_encode(['ok' => false, 'message' => 'Unknown form.'])); }
$phone = trim((string)($f['phone'] ?? ''));
$email = trim((string)($f['email'] ?? ''));
if ($phone === '' && $email === '') { http_response_code(422); exit(json_encode(['ok' => false, 'message' => 'We need a phone number or an email to reply.'])); }
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); exit(json_encode(['ok' => false, 'message' => 'That does not look like an email address.'])); }

// Storage outside the web root. Not writable: 500, and the page falls back to WhatsApp.
$dir = dirname($_SERVER['DOCUMENT_ROOT']) . '/van-enquiries';
if (!is_dir($dir)) @mkdir($dir, 0700, true);
if (!is_dir($dir) || !is_writable($dir)) { http_response_code(500); exit('{"ok":false}'); }

// Rate limit: 5 per IP per hour, kept in 1 small JSON file.
$ip = $_SERVER['REMOTE_ADDR'] ?? '0'; $rl = "$dir/ratelimit.json"; $now = time();
$hits = is_file($rl) ? (json_decode((string)file_get_contents($rl), true) ?: []) : [];
$hits[$ip] = array_values(array_filter($hits[$ip] ?? [], function ($t) use ($now) { return $t > $now - 3600; }));
if (count($hits[$ip]) >= 5) { http_response_code(429); exit('{"ok":false}'); }
$hits[$ip][] = $now;
file_put_contents($rl, json_encode($hits), LOCK_EX);

// Clean, write the CSV row first, then mail. The row is the record; the mail is the alert.
$ref = 'ENQ-' . date('Y') . '-' . strtoupper(substr(md5($now . $ip . $form . mt_rand()), 0, 6));
$clean = [];
foreach ($f as $k => $v) $clean[preg_replace('/[^a-zA-Z0-9_]/', '', (string)$k)] = mb_substr(trim(strip_tags((string)$v)), 0, 2000);
$page = mb_substr(strip_tags((string)($in['page'] ?? '')), 0, 200);
$csv = fopen("$dir/enquiries.csv", 'a');
if (!$csv) { http_response_code(500); exit('{"ok":false}'); }
fputcsv($csv, [date('c'), $ref, $form, $page, $ip, json_encode($clean, JSON_UNESCAPED_UNICODE)]);
fclose($csv);

$body = "Form: $form\nReference: $ref\nPage: $page\nSent: " . date('c') . "\n\n";
foreach ($clean as $k => $v) $body .= "$k: $v\n";
$body .= "\nThe same enquiry is on the server in van-enquiries/enquiries.csv.\n";
$headers = "From: VAN website <$FROM>\r\nReply-To: " . ($email !== '' ? $email : $FROM) . "\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$sent = @mail($INBOX[$form], "[van.com.pk] $form enquiry $ref", $body, $headers, "-f$FROM");
if (!$sent) { file_put_contents("$dir/mail-failures.log", date('c') . " $ref\n", FILE_APPEND); http_response_code(500); exit('{"ok":false}'); }
echo json_encode(['ok' => true, 'ref' => $ref]);
