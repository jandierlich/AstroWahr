# AstroWahr

Umfangreiche Astronomie- & Astrologie-PWA, portrait-optimiert für iOS und Android, komplett offline berechnet.

## Struktur
Die Startseite ist eine Weiche zu zwei bewusst getrennten Bereichen:
- **Astronomie**: reine, unabhängig überprüfbare Fakten und Berechnungen, ohne Deutung
- **Astrologie**: dieselben berechneten Positionen plus symbolische Deutungsebene (inkl. Tarot)

Eine Einführungs-Tour (5 Slides, beim ersten Start automatisch, jederzeit über Anleitung wiederholbar)
und eine globale Suche (Lupensymbol oben rechts) machen diese Trennung durchgängig sichtbar – jedes
Suchergebnis ist klar mit 🔭 Astronomie, 🔮 Astrologie, 🃏 Tarot oder ⚙️ App beschriftet.

## Funktionen – Astronomie
- **Himmel jetzt**: Live-Positionen, Entfernungen (AE bzw. km) und Rückläufigkeits-Kennzeichnung (℞) aller Planeten sowie grobe Sichtbarkeitshinweise (Morgen-/Abendstern, Oppositionsnähe)
- **Sternenhimmelkarte**: Kompassansicht (Höhe/Himmelsrichtung) für Sonne, Mond und alle Planeten an einem frei wählbaren Ort – bewusst anders gestaltet als das Astrologie-Rad
- **Planeten-Steckbriefe**: reale physikalische Fakten (Durchmesser, Entfernung, Umlaufzeit, Rotation, Monde) zu Sonne, allen Planeten, Pluto und Erdmond
- **Sonnenauf-/-untergang**: Sonnenaufgang, -untergang, Sonnenmittag und Taglänge für einen frei wählbaren Ort und ein frei wählbares Datum, inkl. Polartag/-nacht-Erkennung
- **Jahreszeiten-Rechner**: exakte astronomische Zeitpunkte von Äquinoktien und Sonnwenden für jedes Jahr, bewusst ohne Tierkreis-Bezeichnungen formuliert
- **Sternbilder & Präzession**: erklärt den Unterschied zwischen astrologischem (tropischem) Tierkreis und den tatsächlichen Sternbildern
- **Weltraumkunde**: eigener Wissensbereich mit durchsuchbarem Lexikon (Sterne & Sternentwicklung, Universum, Sonnensystem-Vertiefung, Raumfahrt), einer Sternentwicklungs-Übersicht und einem Raumfahrt-Zeitstrahl – rein textbasiert mit Unicode-Symbolen (Emoji), keine Fotografien, Illustrationen oder Bilder Dritter

## Funktionen – Astrologie
- **Geburtshoroskop**: Sonne bis Pluto, Aszendent, Medium Coeli, 12 Häuser (Equal House), Aspekte, grafisches Radix-Chart (SVG); Profile sind editierbar, Standort per Tastatur frei eingebbar (mit Städte-Vorschlagsliste)
- **Tageshoroskop**: pro Sternzeichen, täglich neu (datumsseeded), mit echter aktueller Mondposition
- **Transite**: aktuelle Planetenstände im Aspektvergleich zu einem gespeicherten Geburtshoroskop
- **Kompatibilität**: Synastrie-Vergleich zweier gespeicherter Geburtshoroskope
- **Mondkalender**: aktuelle Mondphase, Beleuchtung, Zyklustag, nächster Voll-/Neumond, 7-Tage-Vorschau
- **Tarot**: Startseite, Legen (Tageskarte/Drei-Karten/Keltisches Kreuz), durchsuchbares 78-Karten-Lexikon mit Favoriten – Kartendaten/-kunst aus AEVARANNA übernommen und im AstroWahr-Design dargestellt
- **Astro-Lexikon**: durchsuchbare Lehrfunktion mit ~50 Einträgen zu Planeten, Zeichen, Häusern, Aspekten, Elementen und Grundbegriffen; überall in der App direkt über unterstrichene Begriffe/ⓘ-Symbole erreichbar

## Weitere Funktionen
- **Globale Suche**: durchsucht Werkzeuge, Astro-Lexikon, Tarot-Lexikon und Planeten-Steckbriefe gleichzeitig, Ergebnisse nach Bereich gruppiert
- **Einführungs-Tour**: 5 Slides, erklärt Struktur und Astronomie/Astrologie-Trennung, wiederholbar über Anleitung
- **Vergrößerbare Ansichten**: Chart-Radgrafik und Tarotkarten lassen sich antippen und öffnen sich in einem schließbaren Zoom-Modal (Pinch-to-Zoom, Zwei-Finger-Pan, Doppeltipp, ＋/－-Buttons)
- **Hell-/Dunkelmodus**: umschaltbar zwischen Hell, Dunkel und „System" (folgt der Geräteeinstellung), unter Einstellungen

## Technik
- Vanilla HTML/CSS/JS, keine Frameworks, keine externen Bibliotheken/CDNs, keine Google Fonts (nur Systemschriften)
- Eigene astronomische Berechnungs-Engine (astro.js) nach klassischen Kepler-Bahnelementen (Methode nach Paul Schlyter) plus Sonnenauf-/-untergangsberechnung, Äquinoktien/Sonnwenden-Suche (Newton-Verfahren), Horizontkoordinaten (Alt/Az) und Rückläufigkeits-Erkennung – gegen bekannte Referenzwerte verifiziert (Äquinoktien/Sonnwenden 2024, Sonnenstand bei Auf-/Untergang und Mittag, Polarkreis-Grenzfälle)
- Alle Daten ausschließlich lokal (localStorage, Präfix „astrowahr."), kein Server, kein Tracking, keine Geolocation
- PWA: manifest.json + service-worker.js für Offline-Nutzung und "Zum Homescreen hinzufügen"

## Dateien
index.html, style.css, astro.js, tarot-cards.js, tarot-art.js, app.js, no-zoom.js,
service-worker.js, manifest.json, impressum.html, datenschutz.html,
icon-180/192/512.png, README.md

## Rechtliches
Impressum und Datenschutzerklärung sind sowohl als eigene Seiten (impressum.html, datenschutz.html)
als auch als In-App-Tabs (Mehr → Rechtliches) erreichbar und inhaltlich identisch. Der Datenschutztext
ist gegen die tatsächlich verwendeten localStorage-Keys abgeglichen (astrowahr.profiles,
astrowahr.tarot.favorites, astrowahr.tarot.stats, astrowahr.theme, astrowahr.onboarded); das Backup
(Einstellungen) exportiert/importiert Profile sowie Tarot-Favoriten/-Statistik. Alle astrologischen
und Tarot-Inhalte sind als Unterhaltung/Reflexionshilfe gekennzeichnet, nicht als wissenschaftliche,
medizinische, psychologische, rechtliche oder finanzielle Beratung; der Astronomie-Bereich bildet den
aktuellen Kenntnisstand vereinfacht ab (Sonnenzeiten und Jahreszeiten-Zeitpunkte auf wenige Minuten
genau, Mondzahlen der Gasriesen mit Stand 2026 gekennzeichnet, da sich diese durch neue Entdeckungen
laufend ändern). Tarot-Kartentexte und -Bilder sind eigene Erstellungen ohne Bezug zu bestehenden
Decks (z. B. Rider-Waite-Smith). Die Weltraumkunde-Inhalte sind eigenständig formulierte Fakten
ohne Verwendung von Fotografien, Missionslogos oder sonstigen Bildern Dritter (z. B. NASA/ESA) –
ausschließlich selbst gestaltete, vereinfachte Darstellungen. Keine externen Skripte/CDNs, keine
Analytics, keine Geolocation.
