Backend Configuration:
======================
For your Windows + WAMP setup, here is the proper Laravel Virtual Host configuration so you can access:

Step 1 — Open Virtual Host File
Open:
    C:\wamp64\bin\apache\apache2.4.x\conf\extra\httpd-vhosts.conf

Step 2 — Add Virtual Host
    Add this at bottom:
    <VirtualHost *:80>
        ServerName timelog-api.local
        DocumentRoot "C:/wamp64/www/timelog-system/backend/public"

        <Directory "C:/wamp64/www/timelog-system/backend/public">
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>
    </VirtualHost>

Step 3 — Enable Virtual Hosts
 Open: C:\wamp64\bin\apache\apache2.4.x\conf\httpd.conf
    Find:
    #Include conf/extra/httpd-vhosts.conf
    Remove #:
    Include conf/extra/httpd-vhosts.conf

Step 4 — Enable mod_rewrite
    In same httpd.conf, ensure this is enabled:
    LoadModule rewrite_module modules/mod_rewrite.so
    (no #)

Step 5 — Update Hosts File
    Open Notepad as Administrator.
    Open file:
    C:\Windows\System32\drivers\etc\hosts
    Add:
    127.0.0.1 timelog-api.local
    Save.

Step 6 — Restart WAMP
    Left click WAMP icon
    Restart All Services

    Wait until icon becomes green.

Step 7 — Laravel .env

Update:
    APP_URL=http://timelog-api.local