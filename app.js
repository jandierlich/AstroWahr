(function () {
  'use strict';
  const E = window.AstroEngine;
  const STORAGE_KEYS = { profiles: 'astrowahr.profiles' };

  /* ---------------------------------------------------------------
     Stammdaten
     --------------------------------------------------------------- */
  const SIGNS_META = [
    { symbol: '♈', element: 'Feuer', quality: 'Kardinal', ruler: 'Mars',
      traits: 'Du gehst Dinge mutig und direkt an, dein Elan reißt andere mit. Achte darauf, nicht ungeduldig über die Bedürfnisse anderer hinwegzugehen.' },
    { symbol: '♉', element: 'Erde', quality: 'Fix', ruler: 'Venus',
      traits: 'Du schätzt Beständigkeit, Genuss und verlässliche Nähe. Manchmal hilft es, Gewohntes bewusst loszulassen, um Neues zuzulassen.' },
    { symbol: '♊', element: 'Luft', quality: 'Veränderlich', ruler: 'Merkur',
      traits: 'Neugier und Wortgewandtheit machen dich zum wachen Beobachter deiner Umgebung. Gib einzelnen Themen ruhig auch mal mehr Tiefe statt nur Breite.' },
    { symbol: '♋', element: 'Wasser', quality: 'Kardinal', ruler: 'Mond',
      traits: 'Du spürst Stimmungen fein und sorgst dich liebevoll um Menschen, die dir wichtig sind. Schütze dich davor, dich in fremden Gefühlen zu verlieren.' },
    { symbol: '♌', element: 'Feuer', quality: 'Fix', ruler: 'Sonne',
      traits: 'Mit Herzenswärme und Selbstbewusstsein ziehst du Aufmerksamkeit auf dich. Teile die Bühne bewusst auch mit anderen.' },
    { symbol: '♍', element: 'Erde', quality: 'Veränderlich', ruler: 'Merkur',
      traits: 'Dein Blick fürs Detail und dein Verantwortungsgefühl machen dich verlässlich. Sei nicht zu streng mit dir, wenn nicht alles perfekt läuft.' },
    { symbol: '♎', element: 'Luft', quality: 'Kardinal', ruler: 'Venus',
      traits: 'Harmonie, Ästhetik und faire Ausgewogenheit sind dir wichtig. Triff Entscheidungen ruhig auch mal aus dem Bauch statt endlos abzuwägen.' },
    { symbol: '♏', element: 'Wasser', quality: 'Fix', ruler: 'Pluto',
      traits: 'Du gehst Dingen intensiv und ehrlich auf den Grund. Vertrauen aufzubauen braucht Zeit – lass es zu, statt dich vorschnell zurückzuziehen.' },
    { symbol: '♐', element: 'Feuer', quality: 'Veränderlich', ruler: 'Jupiter',
      traits: 'Freiheitsliebe und Optimismus treiben deinen Wissensdurst an. Behalte im Blick, dass große Visionen auch kleine Schritte brauchen.' },
    { symbol: '♑', element: 'Erde', quality: 'Kardinal', ruler: 'Saturn',
      traits: 'Ehrgeiz und Disziplin bringen dich Schritt für Schritt an dein Ziel. Vergiss dabei nicht, auch mal bewusst Pausen zu genießen.' },
    { symbol: '♒', element: 'Luft', quality: 'Fix', ruler: 'Uranus',
      traits: 'Eigenständiges Denken und ein Blick fürs große Ganze zeichnen dich aus. Lass auch Nähe zu, nicht nur Ideen.' },
    { symbol: '♓', element: 'Wasser', quality: 'Veränderlich', ruler: 'Neptun',
      traits: 'Feinfühligkeit und Fantasie verbinden dich mit Menschen und Stimmungen. Achte auf klare Grenzen, damit du dich nicht verlierst.' }
  ];

  const PLANETS_META = [
    { key: 'sonne', name: 'Sonne', symbol: '☉', art: 'die', noun: 'Identität', short: 'deine Identität' },
    { key: 'mond', name: 'Mond', symbol: '☽', art: 'der', noun: 'Gefühlswelt', short: 'deine Gefühlswelt' },
    { key: 'merkur', name: 'Merkur', symbol: '☿', art: 'der', noun: 'Denken', short: 'dein Denken' },
    { key: 'venus', name: 'Venus', symbol: '♀', art: 'die', noun: 'Liebe', short: 'deine Liebe' },
    { key: 'mars', name: 'Mars', symbol: '♂', art: 'der', noun: 'Antrieb', short: 'dein Antrieb' },
    { key: 'jupiter', name: 'Jupiter', symbol: '♃', art: 'der', noun: 'Wachstum', short: 'dein Wachstum' },
    { key: 'saturn', name: 'Saturn', symbol: '♄', art: 'der', noun: 'Verantwortung', short: 'deine Verantwortung' },
    { key: 'uranus', name: 'Uranus', symbol: '♅', art: 'der', noun: 'Freiheitsdrang', short: 'dein Freiheitsdrang' },
    { key: 'neptun', name: 'Neptun', symbol: '♆', art: 'der', noun: 'Intuition', short: 'deine Intuition' },
    { key: 'pluto', name: 'Pluto', symbol: '♇', art: 'der', noun: 'Wandlungskraft', short: 'deine Wandlungskraft' }
  ];

  const ELEMENT_POOLS = {
    Feuer: [
      'Heute hast du die Energie, ein liegen gebliebenes Vorhaben entschlossen anzupacken.',
      'Ein spontaner Impuls bringt frischen Schwung in deinen Tag.',
      'Deine Tatkraft wirkt heute ansteckend auf andere.',
      'Nutze den Tag, um mutig ein Gespräch zu suchen, das du aufgeschoben hast.',
      'Etwas Bewegung tut dir gut und klärt den Kopf.',
      'Vertraue heute deinem ersten Instinkt.'
    ],
    Erde: [
      'Kleine, konkrete Schritte bringen dich heute spürbar voran.',
      'Ein ruhiger Moment mit gutem Essen oder in der Natur tut dir besonders gut.',
      'Ordnung schaffen – im Kalender oder auf dem Schreibtisch – gibt dir heute Halt.',
      'Verlässlichkeit ist heute dein größtes Plus im Umgang mit anderen.',
      'Gönn dir heute bewusst etwas Genuss, ohne schlechtes Gewissen.',
      'Geduld zahlt sich heute besonders aus.'
    ],
    Luft: [
      'Ein gutes Gespräch bringt heute überraschend neue Perspektiven.',
      'Deine Ideen finden heute offene Ohren.',
      'Es lohnt sich, heute etwas Neues zu lesen oder zu lernen.',
      'Sozialer Austausch hebt heute deine Stimmung.',
      'Bring eine Idee heute zu Papier, bevor sie wieder verfliegt.',
      'Flexibilität hilft dir heute, spontan die bessere Option zu wählen.'
    ],
    Wasser: [
      'Deine Intuition liegt heute besonders richtig – vertrau ihr.',
      'Ein ehrliches Gespräch über Gefühle bringt heute Nähe.',
      'Gönn dir heute Zeit für Rückzug und Verarbeitung.',
      'Kreative Ausdrucksformen wie Musik oder Schreiben tun dir heute gut.',
      'Achte heute besonders sensibel auf deine eigenen Grenzen.',
      'Ein Traum oder Bauchgefühl kann dir heute einen Hinweis geben.'
    ]
  };
  const FOCUS_AREAS = ['Liebe & Beziehungen', 'Beruf & Ziele', 'Gesundheit & Energie', 'Kommunikation', 'Finanzen', 'Kreativität & Ausdruck'];

  const CITY_PRESETS = [
    { name: 'Tangstedt', lat: 53.7167, lon: 10.0333 },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
    { name: 'München', lat: 48.1351, lon: 11.5820 },
    { name: 'Köln', lat: 50.9375, lon: 6.9603 },
    { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821 },
    { name: 'Stuttgart', lat: 48.7758, lon: 9.1829 },
    { name: 'Düsseldorf', lat: 51.2277, lon: 6.7735 },
    { name: 'Dortmund', lat: 51.5136, lon: 7.4653 },
    { name: 'Essen', lat: 51.4556, lon: 7.0116 },
    { name: 'Leipzig', lat: 51.3397, lon: 12.3731 },
    { name: 'Bremen', lat: 53.0793, lon: 8.8017 },
    { name: 'Dresden', lat: 51.0504, lon: 13.7373 },
    { name: 'Hannover', lat: 52.3759, lon: 9.7320 },
    { name: 'Nürnberg', lat: 49.4521, lon: 11.0767 },
    { name: 'Wien', lat: 48.2082, lon: 16.3738 },
    { name: 'Zürich', lat: 47.3769, lon: 8.5417 },
    { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'London', lat: 51.5072, lon: -0.1276 },
    { name: 'Rom', lat: 41.9028, lon: 12.4964 },
    { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 }
  ];

  const OFFSET_PRESETS = [
    { label: 'MEZ – Winterzeit Deutschland/Österreich/Schweiz (UTC+1)', value: 1 },
    { label: 'MESZ – Sommerzeit Deutschland/Österreich/Schweiz (UTC+2)', value: 2 },
    { label: 'UTC ±0 (London Winterzeit u.a.)', value: 0 }
  ];
  // Ermittelt für ein Datum (YYYY-MM-DD) automatisch, ob in DE/AT/CH an diesem Tag
  // MESZ (2) oder MEZ (1) gilt, nach der EU-Regel (letzter Sonntag im März 01:00 UTC
  // bis letzter Sonntag im Oktober 01:00 UTC). Nur als sinnvoller Vorschlagswert
  // gedacht, der Nutzer kann die Zeitzone weiterhin frei ändern.
  function euDefaultOffset(dateStr) {
    if (!dateStr) return 1;
    const parts = dateStr.split('-').map(Number);
    const year = parts[0];
    if (!year || year < 1980) return 1; // vor EU-weiter Sommerzeit-Regelung: keine verlässliche Automatik
    function lastSundayUTC(y, monthIndex) {
      const d = new Date(Date.UTC(y, monthIndex + 1, 0, 1, 0, 0)); // letzter Tag des Monats, 01:00 UTC
      const dow = d.getUTCDay();
      d.setUTCDate(d.getUTCDate() - dow);
      return d;
    }
    const dstStart = lastSundayUTC(year, 2); // März
    const dstEnd = lastSundayUTC(year, 9);   // Oktober
    const check = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
    return (check >= dstStart && check < dstEnd) ? 2 : 1;
  }
  function buildFullOffsetList() {
    const presetValues = OFFSET_PRESETS.map(function (o) { return o.value; });
    const list = [];
    for (let h = -12; h <= 14; h += 0.5) {
      if (presetValues.indexOf(h) !== -1) continue;
      const sign = h >= 0 ? '+' : '';
      list.push({ label: 'UTC' + sign + h, value: h });
    }
    return list;
  }

  /* ---------------------------------------------------------------
     ASTRO-LEXIKON – Lehrfunktion mit Erklärungen zu Planeten, Zeichen,
     Häusern, Aspekten und Grundbegriffen
     --------------------------------------------------------------- */
  const ASTRO_GLOSSARY = [
    { id: 'planet:sonne', cat: 'planet', symbol: '☉', title: 'Sonne', body: 'Die Sonne zeigt dein Grundwesen, deine Identität und die Kraft, mit der du dich im Leben zeigst. Sie steht für bewusstes Ich, Vitalität und die grundlegende Richtung, in die sich deine Persönlichkeit entwickeln will. Das Sonnenzeichen ist das bekannteste Element der Astrologie – der klassische Zeitungshoroskop-Text bezieht sich fast immer nur auf sie. Ihr Zeichen zeigt, wie sich dein Selbstausdruck färbt, ihr Haus, in welchem Lebensbereich du am meisten strahlen willst.' },
    { id: 'planet:mond', cat: 'planet', symbol: '☽', title: 'Mond', body: 'Der Mond steht für deine Gefühlswelt, deine unbewussten Bedürfnisse und das, was dir emotionale Sicherheit gibt. Während die Sonne zeigt, wer du bewusst sein willst, zeigt der Mond, wie du instinktiv fühlst und reagierst – besonders in vertrauter Umgebung. Er bewegt sich sehr schnell (ca. 13° pro Tag) und wechselt etwa alle zweieinhalb Tage das Zeichen, weshalb seine Position ohne genaue Geburtszeit am schwersten sicher zu bestimmen ist. Sein Zeichen beschreibt deinen emotionalen Grundton, sein Haus den Bereich, in dem du dich am meisten geborgen fühlst.' },
    { id: 'planet:merkur', cat: 'planet', symbol: '☿', title: 'Merkur', body: 'Merkur regiert Denken, Sprache und den Austausch von Informationen. Er zeigt, wie du Dinge verstehst, wie du kommunizierst und wie dein Verstand mit neuen Eindrücken umgeht. Da Merkur sich nie weit von der Sonne entfernt, steht er meist im gleichen oder einem benachbarten Zeichen. Sein Zeichen prägt deinen Denk- und Sprachstil, sein Haus den Bereich, in dem du am meisten kommunizierst oder lernst.' },
    { id: 'planet:venus', cat: 'planet', symbol: '♀', title: 'Venus', body: 'Venus steht für Liebe, Beziehung, Ästhetik und die Dinge, die du als wertvoll empfindest. Sie zeigt, wie du Zuneigung ausdrückst und empfängst und wonach du dich in Partnerschaften sehnst. Auch Geldwerte und Genuss fallen in ihren Bereich. Ihr Zeichen beschreibt deinen Beziehungs- und Geschmacksstil, ihr Haus den Bereich, in dem dir Harmonie besonders wichtig ist.' },
    { id: 'planet:mars', cat: 'planet', symbol: '♂', title: 'Mars', body: 'Mars ist der Planet des Antriebs, der Durchsetzungskraft und des Handelns. Er zeigt, wie du Ziele verfolgst, wie du kämpfst oder dich abgrenzt und wo deine Energie und dein Mut liegen. Er steht auch für Wut, Leidenschaft und körperliche Aktivität. Sein Zeichen prägt deinen Handlungsstil, sein Haus den Bereich, in dem du am aktivsten bist.' },
    { id: 'planet:jupiter', cat: 'planet', symbol: '♃', title: 'Jupiter', body: 'Jupiter steht für Wachstum, Optimismus, Sinnsuche und Expansion. Er zeigt, wo du über dich hinauswächst und wo dir Chancen zufallen. Er braucht etwa zwölf Jahre für einen vollen Tierkreisumlauf und bleibt daher rund ein Jahr in jedem Zeichen. Sein Zeichen zeigt, worin du optimistisch bist, sein Haus, in welchem Bereich sich Wachstum am ehesten zeigt.' },
    { id: 'planet:saturn', cat: 'planet', symbol: '♄', title: 'Saturn', body: 'Saturn steht für Struktur, Verantwortung, Disziplin und Lektionen, die durch Zeit und Ausdauer gelernt werden. Er zeigt, wo du dich anstrengen musst – und wo du langfristig echte Meisterschaft aufbauen kannst. Saturn braucht etwa 29 Jahre für einen Umlauf; die „Saturn-Rückkehr" um das 29. Lebensjahr gilt astrologisch als Reifephase. Sein Zeichen zeigt deinen Umgang mit Verantwortung, sein Haus den Bereich, in dem du am meisten gefordert wirst.' },
    { id: 'planet:uranus', cat: 'planet', symbol: '♅', title: 'Uranus', body: 'Uranus steht für Wandel, Freiheit, Originalität und plötzliche Umbrüche. Er zeigt, wo du dich von Konventionen lösen willst. Da er rund 84 Jahre für einen Umlauf braucht, bleibt er etwa sieben Jahre in einem Zeichen und prägt damit ganze Generationen ähnlich – sein Haus ist daher aussagekräftiger als sein Zeichen. Das Haus zeigt, in welchem Lebensbereich bei dir persönlich Freiheit und Wandel besonders wichtig sind.' },
    { id: 'planet:neptun', cat: 'planet', symbol: '♆', title: 'Neptun', body: 'Neptun steht für Intuition, Sehnsucht, Spiritualität und Auflösung von Grenzen – positiv als Mitgefühl und Vision, schwierig als Verwirrung oder Flucht. Mit rund 165 Jahren für einen Umlauf bleibt er etwa 14 Jahre in einem Zeichen und wirkt damit stark generationsprägend. Sein Haus zeigt, in welchem Lebensbereich du besonders empfänglich oder verträumt bist.' },
    { id: 'planet:pluto', cat: 'planet', symbol: '♇', title: 'Pluto', body: 'Pluto steht für Tiefe, Wandlung und Kräfte, die unter der Oberfläche wirken – Macht, Krisen, aber auch tiefgreifende Erneuerung. Mit etwa 248 Jahren für einen Umlauf bleibt er wegen seiner stark elliptischen Bahn teils elf, teils über zwanzig Jahre in einem Zeichen und ist damit der am stärksten generationsprägende Planet. Sein Haus zeigt, in welchem Lebensbereich bei dir besonders intensive Wandlungsprozesse stattfinden.' },

    { id: 'sign:0', cat: 'sign', symbol: '♈', title: 'Widder', body: 'Widder ist das erste Zeichen des Tierkreises – kardinal, feurig, geprägt von Mut, Tempo und dem Bedürfnis, Neues zu beginnen. Ein Planet in Widder drückt sich direkt, ungeduldig und initiativ aus. Herrscherplanet ist Mars. Die Kehrseite kann Ungeduld oder Impulsivität sein.' },
    { id: 'sign:1', cat: 'sign', symbol: '♉', title: 'Stier', body: 'Stier ist ein fixes Erdzeichen, das für Beständigkeit, Genuss und Sicherheit steht. Ein Planet in Stier drückt sich ruhig, bodenständig und beharrlich aus, oft mit Sinn für Ästhetik und Komfort. Herrscherplanet ist Venus. Die Kehrseite kann Sturheit sein.' },
    { id: 'sign:2', cat: 'sign', symbol: '♊', title: 'Zwillinge', body: 'Zwillinge ist ein veränderliches Luftzeichen, das für Neugier, Kommunikation und geistige Beweglichkeit steht. Ein Planet in Zwillinge drückt sich vielseitig, wortgewandt und wissbegierig aus. Herrscherplanet ist Merkur. Die Kehrseite kann Oberflächlichkeit sein.' },
    { id: 'sign:3', cat: 'sign', symbol: '♋', title: 'Krebs', body: 'Krebs ist ein kardinales Wasserzeichen, das für Gefühl, Fürsorge und Zugehörigkeit steht. Ein Planet in Krebs drückt sich sensibel, beschützend und stimmungsabhängig aus, oft mit starkem Familienbezug. Herrscherplanet ist der Mond. Die Kehrseite kann Rückzug sein.' },
    { id: 'sign:4', cat: 'sign', symbol: '♌', title: 'Löwe', body: 'Löwe ist ein fixes Feuerzeichen, das für Selbstausdruck, Herzlichkeit und Anerkennung steht. Ein Planet in Löwe drückt sich warmherzig, kreativ und selbstbewusst aus. Herrscherplanet ist die Sonne. Die Kehrseite kann übertriebenes Geltungsbedürfnis sein.' },
    { id: 'sign:5', cat: 'sign', symbol: '♍', title: 'Jungfrau', body: 'Jungfrau ist ein veränderliches Erdzeichen, das für Analyse, Dienst und Verbesserung steht. Ein Planet in Jungfrau drückt sich genau, pflichtbewusst und detailorientiert aus. Herrscherplanet ist Merkur. Die Kehrseite kann Perfektionismus sein.' },
    { id: 'sign:6', cat: 'sign', symbol: '♎', title: 'Waage', body: 'Waage ist ein kardinales Luftzeichen, das für Ausgleich, Beziehung und Ästhetik steht. Ein Planet in Waage drückt sich diplomatisch und beziehungsorientiert aus. Herrscherplanet ist Venus. Die Kehrseite kann Unentschlossenheit sein.' },
    { id: 'sign:7', cat: 'sign', symbol: '♏', title: 'Skorpion', body: 'Skorpion ist ein fixes Wasserzeichen, das für Intensität, Transformation und das Verborgene steht. Ein Planet in Skorpion drückt sich tiefgründig, leidenschaftlich und kompromisslos ehrlich aus. Herrscherplanet ist modern Pluto, klassisch Mars. Die Kehrseite kann Kontrollbedürfnis sein.' },
    { id: 'sign:8', cat: 'sign', symbol: '♐', title: 'Schütze', body: 'Schütze ist ein veränderliches Feuerzeichen, das für Freiheit, Sinnsuche und Optimismus steht. Ein Planet in Schütze drückt sich weitblickend und abenteuerlustig aus. Herrscherplanet ist Jupiter. Die Kehrseite kann Übertreibung sein.' },
    { id: 'sign:9', cat: 'sign', symbol: '♑', title: 'Steinbock', body: 'Steinbock ist ein kardinales Erdzeichen, das für Struktur, Ehrgeiz und Ausdauer steht. Ein Planet in Steinbock drückt sich diszipliniert und zielstrebig aus. Herrscherplanet ist Saturn. Die Kehrseite kann übermäßige Strenge sein.' },
    { id: 'sign:10', cat: 'sign', symbol: '♒', title: 'Wassermann', body: 'Wassermann ist ein fixes Luftzeichen, das für Eigenständigkeit, Gemeinschaft und Innovation steht. Ein Planet in Wassermann drückt sich unabhängig und ideenreich aus. Herrscherplanet ist modern Uranus, klassisch Saturn. Die Kehrseite kann Distanziertheit sein.' },
    { id: 'sign:11', cat: 'sign', symbol: '♓', title: 'Fische', body: 'Fische ist ein veränderliches Wasserzeichen, das für Mitgefühl, Intuition und Auflösung von Grenzen steht. Ein Planet in Fische drückt sich feinfühlig und fantasievoll aus. Herrscherplanet ist modern Neptun, klassisch Jupiter. Die Kehrseite kann Wirklichkeitsflucht sein.' },

    { id: 'house:1', cat: 'house', symbol: '1', title: '1. Haus', body: 'Das 1. Haus zeigt dein Auftreten, deinen ersten Eindruck auf andere und wie du grundsätzlich ins Leben gehst. Es beginnt exakt beim Aszendenten.' },
    { id: 'house:2', cat: 'house', symbol: '2', title: '2. Haus', body: 'Das 2. Haus steht für materielle Sicherheit, Besitz, Einkommen und deinen Selbstwert – was dir wirklich etwas „wert" ist.' },
    { id: 'house:3', cat: 'house', symbol: '3', title: '3. Haus', body: 'Das 3. Haus betrifft Kommunikation, Nahbereich (Geschwister, Nachbarschaft), Alltagsdenken und kurze Wege oder Lernen.' },
    { id: 'house:4', cat: 'house', symbol: '4', title: '4. Haus', body: 'Das 4. Haus steht für Zuhause, Familie, Wurzeln und dein inneres Fundament – das gefühlte „Zuhause" in dir.' },
    { id: 'house:5', cat: 'house', symbol: '5', title: '5. Haus', body: 'Das 5. Haus betrifft Kreativität, Selbstausdruck, Romantik, Spiel und – klassisch – Kinder.' },
    { id: 'house:6', cat: 'house', symbol: '6', title: '6. Haus', body: 'Das 6. Haus steht für Alltag, Arbeit, Gesundheit und Routinen – wie du dich um dich selbst und deine Aufgaben kümmerst.' },
    { id: 'house:7', cat: 'house', symbol: '7', title: '7. Haus', body: 'Das 7. Haus betrifft Partnerschaft auf Augenhöhe – feste Beziehungen, aber auch offene Gegner oder Verträge. Es beginnt exakt gegenüber dem Aszendenten.' },
    { id: 'house:8', cat: 'house', symbol: '8', title: '8. Haus', body: 'Das 8. Haus steht für Transformation, Intimität, gemeinsame Ressourcen und alles, was unter die Oberfläche geht – von tiefer Bindung bis zu Krisen und Neuanfängen.' },
    { id: 'house:9', cat: 'house', symbol: '9', title: '9. Haus', body: 'Das 9. Haus betrifft Weltanschauung, Studium, Reisen und den großen Sinnhorizont – alles, was deinen Blick weitet.' },
    { id: 'house:10', cat: 'house', symbol: '10', title: '10. Haus', body: 'Das 10. Haus steht für Berufung, Status und öffentliches Ansehen – wofür du in der Welt stehst. Es beginnt beim Medium Coeli.' },
    { id: 'house:11', cat: 'house', symbol: '11', title: '11. Haus', body: 'Das 11. Haus betrifft Freundschaften, Netzwerke, Gruppen und Zukunftsvisionen – dein Wirken über den eigenen Kreis hinaus.' },
    { id: 'house:12', cat: 'house', symbol: '12', title: '12. Haus', body: 'Das 12. Haus steht für das Unbewusste, Rückzug, Spiritualität und Loslassen – Themen, die oft im Verborgenen wirken, bevor sie bewusst werden.' },

    { id: 'aspect:Konjunktion', cat: 'aspect', symbol: '☌', title: 'Konjunktion (0°)', body: 'Bei einer Konjunktion stehen zwei Planeten nahezu am gleichen Punkt. Ihre Energien verschmelzen und wirken wie eine Einheit – je nach beteiligten Planeten kann das enorm verstärkend oder auch innerlich widersprüchlich sein, da beide Themen gleichzeitig „laut" sind.' },
    { id: 'aspect:Sextil', cat: 'aspect', symbol: '⚹', title: 'Sextil (60°)', body: 'Beim Sextil unterstützen sich zwei Planeten sanft und harmonisch. Es öffnet Chancen und Talente, die aber – anders als beim Trigon – meist aktiv genutzt werden müssen, um sich zu zeigen.' },
    { id: 'aspect:Quadrat', cat: 'aspect', symbol: '□', title: 'Quadrat (90°)', body: 'Beim Quadrat stehen zwei Planeten in innerer Spannung zueinander. Das erzeugt Reibung und Herausforderung, ist aber oft der stärkste Antrieb für Wachstum, weil es zum Handeln zwingt.' },
    { id: 'aspect:Trigon', cat: 'aspect', symbol: '△', title: 'Trigon (120°)', body: 'Beim Trigon fließen zwei Planeten mühelos zusammen. Es zeigt natürliche Begabung und Leichtigkeit – die Kehrseite kann sein, dass dieses Potenzial nie bewusst gefördert wird, weil es sich „von selbst" anfühlt.' },
    { id: 'aspect:Opposition', cat: 'aspect', symbol: '☍', title: 'Opposition (180°)', body: 'Bei der Opposition stehen sich zwei Planeten exakt gegenüber. Sie zeigt ein Spannungsfeld zweier Pole, die einen bewussten Ausgleich suchen – oft erlebt man dieses Thema zuerst im Außen, etwa in einer anderen Person, bevor die eigene Beteiligung erkennbar wird.' },

    { id: 'element:Feuer', cat: 'element', symbol: '🔥', title: 'Element Feuer', body: 'Feuerzeichen (Widder, Löwe, Schütze) stehen für Tatkraft, Spontaneität und Begeisterung. Sie handeln aus Instinkt und Inspiration heraus.' },
    { id: 'element:Erde', cat: 'element', symbol: '🌍', title: 'Element Erde', body: 'Erdzeichen (Stier, Jungfrau, Steinbock) stehen für Bodenständigkeit, Praxis und Beständigkeit. Sie handeln aus konkreter, greifbarer Erfahrung heraus.' },
    { id: 'element:Luft', cat: 'element', symbol: '💨', title: 'Element Luft', body: 'Luftzeichen (Zwillinge, Waage, Wassermann) stehen für Denken, Austausch und Ideen. Sie handeln aus gedanklicher Distanz und sozialem Kontext heraus.' },
    { id: 'element:Wasser', cat: 'element', symbol: '💧', title: 'Element Wasser', body: 'Wasserzeichen (Krebs, Skorpion, Fische) stehen für Gefühl, Intuition und Tiefe. Sie handeln aus emotionaler Resonanz heraus.' },

    { id: 'quality:Kardinal', cat: 'quality', symbol: '◆', title: 'Qualität Kardinal', body: 'Kardinale Zeichen (Widder, Krebs, Waage, Steinbock) markieren den Beginn einer Jahreszeit und stehen für Initiative – sie starten gerne Neues.' },
    { id: 'quality:Fix', cat: 'quality', symbol: '◆', title: 'Qualität Fix', body: 'Fixe Zeichen (Stier, Löwe, Skorpion, Wassermann) stehen mitten in einer Jahreszeit und für Beständigkeit – sie halten durch und vertiefen.' },
    { id: 'quality:Veränderlich', cat: 'quality', symbol: '◆', title: 'Qualität Veränderlich', body: 'Veränderliche Zeichen (Zwillinge, Jungfrau, Schütze, Fische) beschließen eine Jahreszeit und stehen für Anpassung – sie bereiten den Übergang vor.' },

    { id: 'general:aszendent', cat: 'general', symbol: '✦', title: 'Aszendent', body: 'Der Aszendent ist der Tierkreispunkt, der zum Zeitpunkt deiner Geburt gerade im Osten aufging. Er zeigt dein spontanes Auftreten und markiert zugleich den Beginn des 1. Hauses. Anders als das Sonnenzeichen wechselt er sehr schnell – etwa alle zwei Stunden –, weshalb eine genaue Geburtszeit für seine Berechnung unverzichtbar ist.' },
    { id: 'general:mc', cat: 'general', symbol: '✦', title: 'Medium Coeli (MC)', body: 'Das Medium Coeli („Himmelsmitte") ist der höchste Punkt der Ekliptik zum Geburtszeitpunkt und markiert den Beginn des 10. Hauses. Es steht für Berufung, öffentliches Ansehen und die Richtung, in die du dich in der Welt entwickeln willst.' },
    { id: 'general:radix', cat: 'general', symbol: '✦', title: 'Radix / Geburtshoroskop', body: 'Radix (lat. „Wurzel") ist der Fachbegriff für dein Geburtshoroskop – die Momentaufnahme des Himmels zum Zeitpunkt und Ort deiner Geburt. Es gilt als lebenslange Grundstruktur, auf die sich weitere Techniken wie Transite beziehen.' },
    { id: 'general:transit', cat: 'general', symbol: '✦', title: 'Transit', body: 'Ein Transit ist die aktuelle Position eines Planeten am Himmel im Vergleich zu deinem Geburtshoroskop. Bildet ein aktuell wandernder Planet einen Aspekt zu einem deiner Geburtsplaneten, gilt dieses Thema für die Dauer des Transits als besonders aktiviert.' },
    { id: 'general:synastrie', cat: 'general', symbol: '✦', title: 'Synastrie', body: 'Synastrie ist der Vergleich zweier Geburtshoroskope, um die astrologische Dynamik zwischen zwei Menschen zu betrachten – etwa wo sich Planeten harmonisch ergänzen oder spannungsreich berühren.' },
    { id: 'general:orb', cat: 'general', symbol: '✦', title: 'Orb', body: 'Der Orb ist die erlaubte Abweichung vom exakten Aspektwinkel, innerhalb derer ein Aspekt noch als wirksam gilt. Ein engerer Orb (kleinere Abweichung) gilt astrologisch meist als stärker wirksam als ein weiter.' },
    { id: 'general:haussystem', cat: 'general', symbol: '✦', title: 'Häusersystem', body: 'Ein Häusersystem legt fest, wie der Tierkreis in die 12 Häuser eingeteilt wird. AstroWahr nutzt das gleichweite System (Equal House), bei dem jedes Haus exakt 30° ab dem Aszendenten umfasst – einfach nachvollziehbar und robust, auch wenn andere Systeme wie Placidus unterschiedlich breite Häuser berechnen.' },
    { id: 'general:sternzeichen', cat: 'general', symbol: '✦', title: 'Sternzeichen vs. Aszendent', body: 'Das „Sternzeichen" aus Zeitungshoroskopen ist eigentlich nur dein Sonnenzeichen – einer von vielen Faktoren im Chart. Der Aszendent gilt oft als ebenso prägend fürs Auftreten, braucht aber eine genaue Geburtszeit. Ein vollständiges Geburtshoroskop mit allen Planeten, Häusern und Aspekten liefert ein deutlich differenzierteres Bild als das Sonnenzeichen allein.' },
    { id: 'general:tarot', cat: 'general', symbol: '✦', title: 'Was ist Tarot?', body: 'Tarot ist ein 78-Karten-Deck aus 22 Trümpfen (Große Arkana, für große Lebensthemen) und 56 Farbkarten (Kleine Arkana, für Alltagsthemen), das als Reflexionswerkzeug genutzt wird. Beim Legen wählst du bewusst oder zufällig Karten zu einer Frage und deutest sie als Denkanstoß – nicht als feststehende Vorhersage.' },
    { id: 'general:arkana', cat: 'general', symbol: '✦', title: 'Große vs. Kleine Arkana', body: 'Die 22 Karten der Großen Arkana (Trümpfe wie „Der Narr" oder „Der Tod") stehen für große, archetypische Lebensthemen und Entwicklungsschritte. Die 56 Karten der Kleinen Arkana sind in vier Farben zu je 14 Karten unterteilt (Stäbe/Feuer, Kelche/Wasser, Schwerter/Luft, Münzen/Erde) und beschreiben konkretere Alltagssituationen im jeweiligen Lebensbereich.' },
    { id: 'general:umgekehrt', cat: 'general', symbol: '✦', title: 'Umgekehrte Karten', body: 'Eine umgekehrt gezogene Tarotkarte wird oft als Blockade, Innenschau oder abgeschwächte/verzerrte Form der aufrechten Bedeutung gedeutet – z. B. als Warnsignal oder als Aufforderung, ein Thema erst innerlich zu klären, bevor es sich nach außen zeigt.' }
  ];
  function glossaryEntry(id) { return ASTRO_GLOSSARY.find(function (g) { return g.id === id; }); }

  /* ---------------------------------------------------------------
     WELTRAUMKUNDE – Sterne, Universum, Sonnensystem-Vertiefung,
     Raumfahrt. Eigenständig formulierte Fakten, keine Bildinhalte.
     --------------------------------------------------------------- */
  const SPACE_GLOSSARY = [
    { id: 'star:was-ist-ein-stern', cat: 'star', symbol: '⭐', title: 'Was ist ein Stern?', body: 'Ein Stern ist eine riesige, selbstleuchtende Kugel aus Plasma, in deren Kern durch Kernfusion Wasserstoff zu Helium verschmilzt. Die dabei freiwerdende Energie erzeugt einen Strahlungsdruck, der die eigene Schwerkraft des Sterns ausgleicht – ein Stern befindet sich sein Leben lang im Gleichgewicht zwischen Gravitation (nach innen) und Fusionsdruck (nach außen). Unsere Sonne ist ein ganz gewöhnlicher Stern mittlerer Größe.' },
    { id: 'star:entstehung', cat: 'star', symbol: '🌫️', title: 'Sternentstehung', body: 'Sterne entstehen in riesigen Gas- und Staubwolken (Nebeln), wenn Bereiche höherer Dichte unter ihrer eigenen Schwerkraft kollabieren. Dabei erhitzt sich der entstehende Kern (Protostern) immer weiter, bis im Zentrum Temperaturen erreicht werden, bei denen die Kernfusion zündet – damit ist ein neuer Stern „geboren". Der Prozess dauert je nach Sternmasse einige hunderttausend bis mehrere Millionen Jahre.' },
    { id: 'star:hauptreihe', cat: 'star', symbol: '☀️', title: 'Hauptreihenstern', body: 'Den größten Teil seines Lebens verbringt ein Stern als „Hauptreihenstern" – in dieser stabilen Phase fusioniert er kontinuierlich Wasserstoff zu Helium. Unsere Sonne befindet sich seit etwa 4,6 Milliarden Jahren in diesem Stadium und wird darin voraussichtlich noch etwa 5 Milliarden weitere Jahre bleiben.' },
    { id: 'star:roter-riese', cat: 'star', symbol: '🔴', title: 'Roter Riese', body: 'Geht dem Kern eines sonnenähnlichen Sterns der Wasserstoff aus, beginnt die Fusion in einer Hülle um den Kern, während sich der Stern stark aufbläht und abkühlt – er wird zu einem Roten Riesen, oft hundertfach größer als zuvor. Unsere Sonne wird in dieser Phase vermutlich bis zur Erdbahn anschwellen.' },
    { id: 'star:weisser-zwerg', cat: 'star', symbol: '⚪', title: 'Weißer Zwerg', body: 'Kann ein Stern wie unsere Sonne am Ende seines Lebens keine Fusion mehr aufrechterhalten, stößt er seine äußeren Hüllen ab und übrig bleibt ein extrem dichter, erdgroßer Kern aus entartetem Material – ein Weißer Zwerg. Er kühlt über Milliarden Jahre langsam aus, ohne weitere Energie zu erzeugen.' },
    { id: 'star:supernova', cat: 'star', symbol: '💥', title: 'Supernova', body: 'Sehr massereiche Sterne (mehr als etwa das Achtfache der Sonnenmasse) enden nicht als Weißer Zwerg, sondern kollabieren nach dem Ende der Fusion schlagartig und explodieren als Supernova – eine der energiereichsten Explosionen im Universum, die für kurze Zeit heller strahlen kann als eine ganze Galaxie.' },
    { id: 'star:neutronenstern', cat: 'star', symbol: '🌟', title: 'Neutronenstern', body: 'Übersteht der Kern eines explodierten massereichen Sterns die Supernova, kann daraus ein Neutronenstern entstehen: ein nur etwa 20 Kilometer großer, aber so dichter Körper, dass ein Teelöffel seiner Materie mehrere Milliarden Tonnen wiegen würde. Rotierende Neutronensterne, die man als Radiopulse registriert, heißen Pulsare.' },
    { id: 'star:schwarzes-loch', cat: 'star', symbol: '🕳️', title: 'Schwarzes Loch (stellar)', body: 'Ist der kollabierende Kern eines sehr massereichen Sterns noch schwerer als bei einem Neutronenstern, hält keine bekannte Kraft der weiteren Kontraktion stand – es entsteht ein Schwarzes Loch, dessen Schwerkraft so stark ist, dass innerhalb eines bestimmten Radius (Ereignishorizont) nicht einmal Licht entkommen kann.' },
    { id: 'star:spektralklassen', cat: 'star', symbol: '🌈', title: 'Spektralklassen', body: 'Sterne werden anhand ihrer Oberflächentemperatur und Farbe in die Spektralklassen O, B, A, F, G, K, M eingeteilt (heißeste bis kühlste). O-Sterne sind blau-weiß und extrem heiß, M-Sterne rötlich und vergleichsweise kühl. Unsere Sonne gehört mit rund 5.500 °C Oberflächentemperatur zur Klasse G.' },
    { id: 'star:doppelsterne', cat: 'star', symbol: '✨', title: 'Doppel- und Mehrfachsterne', body: 'Mehr als die Hälfte aller Sterne existiert nicht allein, sondern in Doppel- oder Mehrfachsystemen, die sich gegenseitig umkreisen. Unsere Sonne ist damit eher untypisch als Einzelstern unterwegs.' },
    { id: 'star:bekannte-sterne', cat: 'star', symbol: '💫', title: 'Bekannte Sterne', body: 'Sirius im Sternbild Großer Hund ist der hellste Stern am Nachthimmel. Der Polarstern (Polaris) steht nahe am Nordhimmelspol und dient seit jeher zur Orientierung. Beteigeuze im Orion ist ein Roter Überriese, der irgendwann als Supernova enden wird – wann genau, ist unbekannt. Proxima Centauri ist mit rund 4,2 Lichtjahren der sonnennächste bekannte Stern.' },

    { id: 'universe:urknall', cat: 'universe', symbol: '💫', title: 'Urknall', body: 'Nach dem heutigen Stand der Kosmologie begann das Universum vor rund 13,8 Milliarden Jahren mit dem Urknall – einem extrem heißen, dichten Zustand, aus dem sich Raum, Zeit und Materie ausdehnten und abkühlten. Der Urknall war keine Explosion in einem bereits vorhandenen Raum, sondern die Ausdehnung des Raumes selbst.' },
    { id: 'universe:expansion', cat: 'universe', symbol: '↔️', title: 'Expansion des Universums', body: 'Das Universum dehnt sich fortlaufend aus – entfernte Galaxien bewegen sich im Mittel von uns weg, und zwar umso schneller, je weiter sie entfernt sind (Hubble-Gesetz). Diese Expansion wurde in den 1920er-Jahren durch Edwin Hubbles Beobachtungen entdeckt und gilt als eine der zentralen Grundlagen der modernen Kosmologie.' },
    { id: 'universe:galaxie', cat: 'universe', symbol: '🌌', title: 'Galaxie', body: 'Eine Galaxie ist ein durch Schwerkraft gebundenes System aus Milliarden bis Billionen Sternen, dazu Gas, Staub und Dunkler Materie. Das beobachtbare Universum enthält schätzungsweise hunderte Milliarden Galaxien.' },
    { id: 'universe:milchstrasse', cat: 'universe', symbol: '🌠', title: 'Milchstraße', body: 'Unsere Heimatgalaxie, die Milchstraße, ist eine Balkenspiralgalaxie mit schätzungsweise 100 bis 400 Milliarden Sternen. Unser Sonnensystem liegt in einem der äußeren Spiralarme, etwa 26.000 Lichtjahre vom Zentrum entfernt, um das die Sonne rund alle 230 Millionen Jahre einmal kreist.' },
    { id: 'universe:andromeda', cat: 'universe', symbol: '🌀', title: 'Andromeda-Galaxie', body: 'Die Andromeda-Galaxie ist mit rund 2,5 Millionen Lichtjahren Entfernung die nächste große Nachbargalaxie der Milchstraße und mit bloßem Auge als schwacher Fleck sichtbar. Beide Galaxien nähern sich einander an und könnten in mehreren Milliarden Jahren verschmelzen.' },
    { id: 'universe:galaxientypen', cat: 'universe', symbol: '🔄', title: 'Galaxientypen', body: 'Galaxien werden grob in Spiralgalaxien (mit Armen wie die Milchstraße), elliptische Galaxien (kugel- bis eiförmig, ohne Spiralstruktur) und irreguläre Galaxien (ohne klare Form, oft nach Kollisionen) unterteilt.' },
    { id: 'universe:dunkle-materie', cat: 'universe', symbol: '⚫', title: 'Dunkle Materie', body: 'Dunkle Materie ist eine bisher nicht direkt nachgewiesene Form von Materie, deren Existenz aus ihrer Schwerkraftwirkung geschlossen wird – etwa daraus, dass sich Galaxien schneller drehen, als es die sichtbare Materie allein erklären könnte. Sie macht schätzungsweise rund 27 % des Universums aus, sichtbare Materie dagegen nur etwa 5 %.' },
    { id: 'universe:dunkle-energie', cat: 'universe', symbol: '🌑', title: 'Dunkle Energie', body: 'Dunkle Energie ist der Platzhalter-Begriff für das, was die beschleunigte Expansion des Universums antreibt. Sie macht nach aktuellem Verständnis den größten Anteil (rund 68 %) des gesamten Energieinhalts des Universums aus, ihre genaue Natur ist aber noch ungeklärt.' },
    { id: 'universe:lichtjahr', cat: 'universe', symbol: '📏', title: 'Lichtjahr & kosmische Entfernungen', body: 'Ein Lichtjahr ist die Strecke, die Licht in einem Jahr zurücklegt – rund 9,46 Billionen Kilometer. Es ist ein Entfernungsmaß, keine Zeitangabe. Da Licht eine endliche Geschwindigkeit hat, sehen wir entfernte Objekte immer so, wie sie in der Vergangenheit aussahen: Das Licht der Sonne ist rund 8 Minuten zu uns unterwegs, das der Andromeda-Galaxie rund 2,5 Millionen Jahre.' },
    { id: 'universe:hintergrundstrahlung', cat: 'universe', symbol: '📡', title: 'Kosmische Hintergrundstrahlung', body: 'Die kosmische Hintergrundstrahlung ist ein schwaches Mikrowellen-„Nachglühen" des heißen, jungen Universums, etwa 380.000 Jahre nach dem Urknall entstanden, als das Universum erstmals durchsichtig wurde. Sie ist heute aus fast jeder Richtung des Himmels messbar und gilt als eine der wichtigsten Bestätigungen der Urknalltheorie.' },

    { id: 'solar:zwergplaneten', cat: 'solar', symbol: '🪐', title: 'Zwergplaneten', body: 'Ein Zwergplanet umkreist die Sonne und ist durch seine eigene Schwerkraft näherungsweise rund geformt, hat aber – anders als ein „echter" Planet – seine Umlaufbahn nicht von anderen größeren Körpern freigeräumt. Neben Pluto zählen Ceres (im Asteroidengürtel), sowie Eris, Makemake und Haumea (alle jenseits von Neptun) zu den offiziell anerkannten Zwergplaneten.' },
    { id: 'solar:asteroidenguertel', cat: 'solar', symbol: '☄️', title: 'Asteroidengürtel', body: 'Zwischen den Bahnen von Mars und Jupiter befindet sich der Asteroidengürtel, eine Zone mit Millionen Gesteinsbrocken unterschiedlichster Größe – Überreste aus der Frühzeit des Sonnensystems, die sich wegen Jupiters Schwerkraft nie zu einem Planeten formen konnten. Der größte Körper darin ist der Zwergplanet Ceres.' },
    { id: 'solar:kuiperguertel', cat: 'solar', symbol: '🧊', title: 'Kuipergürtel', body: 'Jenseits der Neptunbahn liegt der Kuipergürtel, eine Zone mit unzähligen eisigen Kleinkörpern – darunter Pluto, Eris und Makemake. Er gilt als Ursprungsort vieler kurzperiodischer Kometen.' },
    { id: 'solar:kometen', cat: 'solar', symbol: '☄️', title: 'Kometen', body: 'Kometen sind kleine, eisig-staubige Körper, die auf oft stark elliptischen Bahnen die Sonne umkreisen. Nähern sie sich der Sonne, verdampft Eis von ihrer Oberfläche und bildet die charakteristische Koma und den Schweif, der immer von der Sonne weg zeigt.' },
    { id: 'solar:grosse-monde', cat: 'solar', symbol: '🌕', title: 'Große Monde des Sonnensystems', body: 'Titan (Saturn) ist der einzige Mond mit einer dichten Atmosphäre und flüssigen Methan-Seen auf seiner Oberfläche. Europa und Ganymed (beide Jupiter) verbergen vermutlich flüssige Wasserozeane unter ihrer Eiskruste – Europa gilt als einer der aussichtsreichsten Orte für mögliches außerirdisches Leben im Sonnensystem. Io (Jupiter) ist wegen extremer Gezeitenkräfte der vulkanisch aktivste Körper im Sonnensystem. Enceladus (Saturn) schleudert Eisfontänen aus einem unterirdischen Ozean ins All.' },
    { id: 'solar:oortsche-wolke', cat: 'solar', symbol: '🌫️', title: 'Oortsche Wolke', body: 'Die Oortsche Wolke ist eine hypothetische, kugelförmige Ansammlung eisiger Kleinkörper, die das Sonnensystem in großer Entfernung umgibt und als Ursprung langperiodischer Kometen gilt. Sie wurde bisher nicht direkt beobachtet, sondern aus der Umlaufbahn solcher Kometen erschlossen.' },

    { id: 'space:rakete', cat: 'space', symbol: '🚀', title: 'Wie funktioniert eine Rakete?', body: 'Eine Rakete fliegt nach dem Rückstoßprinzip: Verbranntes Treibstoffgas wird mit hoher Geschwindigkeit nach hinten ausgestoßen, wodurch die Rakete nach vorne beschleunigt wird – anders als ein Flugzeug braucht sie dafür keine umgebende Luft und funktioniert auch im Vakuum des Weltraums.' },
    { id: 'space:traegerrakete', cat: 'space', symbol: '🛰️', title: 'Trägerrakete & Nutzlast', body: 'Eine Trägerrakete transportiert ihre eigentliche Fracht – die Nutzlast, etwa einen Satelliten oder eine Raumkapsel – in den Weltraum. Meist besteht sie aus mehreren Stufen, die nacheinander ausgebrannten Treibstoff und ihr eigenes Gewicht abwerfen, um die verbleibende Rakete leichter und effizienter zu machen.' },
    { id: 'space:erdumlaufbahn', cat: 'space', symbol: '🌍', title: 'Erdumlaufbahnen', body: 'Der niedrige Erdorbit (LEO, bis etwa 2.000 km Höhe) beherbergt unter anderem die ISS und die meisten Erdbeobachtungssatelliten. Der geostationäre Orbit (GEO, rund 35.786 km Höhe) lässt einen Satelliten exakt mit der Erdrotation mitlaufen, sodass er scheinbar über einem festen Punkt am Himmel „stehen" bleibt – ideal für Kommunikations- und Wettersatelliten.' },
    { id: 'space:sputnik', cat: 'space', symbol: '📡', title: 'Sputnik 1', body: 'Am 4. Oktober 1957 startete die Sowjetunion mit Sputnik 1 den ersten künstlichen Erdsatelliten der Geschichte und leitete damit das Weltraumzeitalter ein. Der etwa fußballgroße Satellit sendete rund drei Wochen lang Funksignale, bevor seine Batterien erschöpft waren.' },
    { id: 'space:gagarin', cat: 'space', symbol: '👨‍🚀', title: 'Juri Gagarin & Wostok 1', body: 'Am 12. April 1961 wurde der sowjetische Kosmonaut Juri Gagarin mit Wostok 1 der erste Mensch im Weltraum. Sein Flug umrundete die Erde einmal und dauerte etwa 108 Minuten.' },
    { id: 'space:apollo11', cat: 'space', symbol: '🌕', title: 'Apollo 11 & die Mondlandung', body: 'Am 20. Juli 1969 betraten mit Neil Armstrong und Buzz Aldrin erstmals Menschen die Mondoberfläche, während Michael Collins im Kommandomodul in der Mondumlaufbahn wartete. Es war der Höhepunkt des US-amerikanischen Apollo-Programms und bislang die einzige bemannte Mission, die je einen anderen Himmelskörper erreicht hat.' },
    { id: 'space:spaceshuttle', cat: 'space', symbol: '🛸', title: 'Space Shuttle', body: 'Das US-amerikanische Space-Shuttle-Programm (1981–2011) setzte erstmals teilweise wiederverwendbare Raumfähren ein, die wie ein Flugzeug landen konnten. Über 30 Jahre flogen die Shuttles unter anderem Bauteile der ISS und das Hubble-Weltraumteleskop ins All.' },
    { id: 'space:iss', cat: 'space', symbol: '🛰️', title: 'Internationale Raumstation (ISS)', body: 'Die ISS ist ein gemeinsames Projekt mehrerer Raumfahrtagenturen und wird seit November 2000 ununterbrochen von wechselnden Besatzungen bewohnt. Sie umkreist die Erde in rund 400 km Höhe etwa alle 90 Minuten einmal und dient vor allem der Forschung unter Schwerelosigkeit.' },
    { id: 'space:sonden', cat: 'space', symbol: '🔭', title: 'Raumsonden', body: 'Unbemannte Raumsonden erkunden das Sonnensystem, ohne dass Menschen an Bord sind. Die Voyager-Sonden (Start 1977) verließen als erste menschengemachte Objekte das Sonnensystem in Richtung interstellarem Raum. New Horizons flog 2015 als erste Sonde am Pluto vorbei.' },
    { id: 'space:bemannt-unbemannt', cat: 'space', symbol: '🧑‍🚀', title: 'Bemannte vs. unbemannte Raumfahrt', body: 'Bemannte Missionen transportieren Menschen und benötigen aufwendige Lebenserhaltungssysteme, sind dafür aber flexibel vor Ort einsetzbar. Unbemannte Missionen (Sonden, Satelliten, Rover) sind günstiger, können auch lebensfeindliche Umgebungen erreichen und stellen daher den weit größeren Teil aller Weltraummissionen.' },
    { id: 'space:wiederverwendbarkeit', cat: 'space', symbol: '♻️', title: 'Wiederverwendbare Raketen', body: 'Klassische Trägerraketen wurden nach einem Start verworfen. Seit den 2010er-Jahren gibt es Raketenstufen, die kontrolliert zur Erde zurückkehren und erneut gestartet werden können – ein Konzept, das die Kosten pro Start deutlich senken kann und heute von mehreren Anbietern eingesetzt wird.' }
  ];
  function spaceEntry(id) { return SPACE_GLOSSARY.find(function (g) { return g.id === id; }); }
  const RULER_TO_PLANET_KEY = { 'Mars': 'mars', 'Venus': 'venus', 'Merkur': 'merkur', 'Mond': 'mond', 'Sonne': 'sonne', 'Jupiter': 'jupiter', 'Saturn': 'saturn', 'Uranus': 'uranus', 'Neptun': 'neptun', 'Pluto': 'pluto' };
  function glossLink(id, label) { return '<span class="gloss-link" data-glossary="' + id + '">' + esc(label) + '</span>'; }
  function infoBtn(id) { return '<button type="button" class="info-btn" data-glossary="' + id + '">i</button>'; }
  function showGlossary(id) {
    const g = glossaryEntry(id);
    if (!g) return;
    openTextModal(g.symbol + ' ' + g.title, '<p style="font-size:.9rem; line-height:1.65; color:var(--text-dim);">' + esc(g.body) + '</p>');
  }

  /* ---------------------------------------------------------------
     Modal / Lightbox (vergrößerbar & schließbar)
     --------------------------------------------------------------- */
  let zoomState = { scale: 1, tx: 0, ty: 0 };
  let currentZoomStage = null;
  function openTextModal(title, bodyHtml) {
    const content = document.getElementById('modalContent');
    content.className = 'modal-content';
    content.innerHTML = '<h3>' + title + '</h3>' + bodyHtml;
    document.getElementById('modalZoomControls').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('show');
    currentZoomStage = null;
  }
  function openImageModal(svgHtml) {
    const content = document.getElementById('modalContent');
    content.className = 'modal-content zoom-mode';
    zoomState = { scale: 1, tx: 0, ty: 0 };
    content.innerHTML = '<div class="zoom-stage" id="zoomStage">' + svgHtml + '</div>';
    document.getElementById('modalZoomControls').style.display = 'flex';
    document.getElementById('modalOverlay').classList.add('show');
    currentZoomStage = document.getElementById('zoomStage');
    applyZoomTransform();
    bindZoomStage(currentZoomStage);
  }
  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('modalContent').innerHTML = '';
    currentZoomStage = null;
  }
  function applyZoomTransform() {
    if (!currentZoomStage) return;
    currentZoomStage.style.transform = 'translate(' + zoomState.tx + 'px,' + zoomState.ty + 'px) scale(' + zoomState.scale + ')';
  }
  function bindZoomStage(stage) {
    const pointers = new Map();
    let startDist = 0, startScale = 1, dragStart = null;
    stage.addEventListener('pointerdown', function (e) {
      stage.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragStart = { x: e.clientX, y: e.clientY, tx: zoomState.tx, ty: zoomState.ty };
      } else if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        startDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
        startScale = zoomState.scale;
        dragStart = null;
      }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        zoomState.scale = Math.min(4, Math.max(1, startScale * (dist / startDist)));
        applyZoomTransform();
      } else if (pointers.size === 1 && dragStart && zoomState.scale > 1) {
        zoomState.tx = dragStart.tx + (e.clientX - dragStart.x);
        zoomState.ty = dragStart.ty + (e.clientY - dragStart.y);
        applyZoomTransform();
      }
    });
    function endPointer(e) { pointers.delete(e.pointerId); if (pointers.size === 0) dragStart = null; }
    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);
    let lastTap = 0;
    stage.addEventListener('pointerup', function () {
      const now = Date.now();
      if (now - lastTap < 300) {
        zoomState.scale = zoomState.scale > 1 ? 1 : 2.2;
        zoomState.tx = 0; zoomState.ty = 0;
        applyZoomTransform();
      }
      lastTap = now;
    });
  }

  /* ---------------------------------------------------------------
     WILLKOMMENS-TOUR
     --------------------------------------------------------------- */
  const ONBOARD_KEY = 'astrowahr.onboarded';
  const TOUR_SLIDES = [
    { icon: '✨', title: 'Willkommen bei AstroWahr', body: 'Eine App für zwei verwandte, aber unterschiedliche Blicke auf den Himmel – komplett offline berechnet, ohne Server, ohne Tracking.' },
    { icon: '🔀', title: 'Zwei klar getrennte Bereiche', body: 'Die Startseite führt dich bewusst zu zwei getrennten Bereichen: Astronomie liefert reine, überprüfbare Fakten. Astrologie legt darüber eine symbolische Deutungsebene. Beide nutzen dieselben berechneten Positionen – aber sie beantworten unterschiedliche Fragen.' },
    { icon: '🔭', title: 'Astronomie – Fakten pur', body: 'Live-Positionen und Entfernungen, eine Sternenhimmelkarte für deinen Standort, physikalische Planeten-Steckbriefe, Sonnenauf-/-untergang, ein Jahreszeiten-Rechner und die Erklärung, warum Tierkreiszeichen nicht mit den echten Sternbildern übereinstimmen. Keine Deutung, nur Berechnung.' },
    { icon: '🔮', title: 'Astrologie – Deutung & Reflexion', body: 'Geburtshoroskop, Tageshoroskop, Transite, Kompatibilität und Tarot – als Werkzeug zur Selbstreflexion und Unterhaltung gedacht, nicht als wissenschaftlich belegte Aussage. Das Astro-Lexikon erklärt alle Begriffe im Detail.' },
    { icon: '🔍', title: 'Los geht\'s', body: 'Über das Lupensymbol oben findest du jederzeit alles per Suche – über beide Bereiche hinweg, aber klar mit Astronomie oder Astrologie beschriftet. Diese Tour findest du jederzeit erneut unter Anleitung.' }
  ];
  let tourState = { index: 0 };
  function openTour() {
    tourState.index = 0;
    document.getElementById('modalZoomControls').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('show');
    renderTourSlide();
  }
  function renderTourSlide() {
    const content = document.getElementById('modalContent');
    content.className = 'modal-content tour-mode';
    const slide = TOUR_SLIDES[tourState.index];
    let html = '<div class="tour-icon">' + slide.icon + '</div>';
    html += '<h3>' + esc(slide.title) + '</h3>';
    html += '<p style="color:var(--text-dim); font-size:.88rem; line-height:1.6;">' + esc(slide.body) + '</p>';
    html += '<div class="tour-dots">' + TOUR_SLIDES.map(function (s, i) { return '<span class="tour-dot' + (i === tourState.index ? ' active' : '') + '"></span>'; }).join('') + '</div>';
    html += '<div style="display:flex; gap:10px; margin-top:18px;">';
    if (tourState.index > 0) html += '<button class="btn secondary" id="tourBackBtn" style="flex:1;">Zurück</button>';
    if (tourState.index < TOUR_SLIDES.length - 1) html += '<button class="btn" id="tourNextBtn" style="flex:2;">Weiter</button>';
    else html += '<button class="btn" id="tourDoneBtn" style="flex:2;">Los geht\'s!</button>';
    html += '</div>';
    if (tourState.index < TOUR_SLIDES.length - 1) html += '<button class="btn ghost small" id="tourSkipBtn" style="width:100%; margin-top:8px;">Überspringen</button>';
    content.innerHTML = html;
    const backBtn = document.getElementById('tourBackBtn');
    if (backBtn) backBtn.addEventListener('click', function () { tourState.index--; renderTourSlide(); });
    const nextBtn = document.getElementById('tourNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', function () { tourState.index++; renderTourSlide(); });
    const doneBtn = document.getElementById('tourDoneBtn');
    if (doneBtn) doneBtn.addEventListener('click', finishTour);
    const skipBtn = document.getElementById('tourSkipBtn');
    if (skipBtn) skipBtn.addEventListener('click', finishTour);
  }
  function finishTour() {
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (e) {}
    closeModal();
  }

  /* ---------------------------------------------------------------
     GLOBALE SUCHE
     --------------------------------------------------------------- */
  const TOOL_SHORTCUTS = [
    { label: 'Himmel jetzt', domain: 'astro', tab: 'astro-live' },
    { label: 'Sternenhimmelkarte', domain: 'astro', tab: 'astro-skymap' },
    { label: 'Planeten-Steckbriefe', domain: 'astro', tab: 'astro-planets' },
    { label: 'Sonnenauf-/-untergang', domain: 'astro', tab: 'astro-sun' },
    { label: 'Jahreszeiten-Rechner', domain: 'astro', tab: 'astro-seasons' },
    { label: 'Sternbilder & Präzession', domain: 'astro', tab: 'astro-precession' },
    { label: 'Mondkalender', domain: 'astro', tab: 'mond' },
    { label: 'Weltraumkunde', domain: 'astro', tab: 'weltraum' },
    { label: 'Sternentwicklung', domain: 'astro', tab: 'weltraum-sterne' },
    { label: 'Raumfahrt-Zeitstrahl', domain: 'astro', tab: 'weltraum-zeitstrahl' },
    { label: 'Geburtshoroskop', domain: 'astrologie', tab: 'chart' },
    { label: 'Tageshoroskop', domain: 'astrologie', tab: 'horoskop' },
    { label: 'Transite', domain: 'astrologie', tab: 'transite' },
    { label: 'Kompatibilität', domain: 'astrologie', tab: 'kompat' },
    { label: 'Astro-Lexikon', domain: 'astrologie', tab: 'astrolex' },
    { label: 'Tarot', domain: 'tarot', tab: 'tarot' },
    { label: 'Anleitung', domain: 'general', tab: 'anleitung' },
    { label: 'Einstellungen', domain: 'general', tab: 'einstellungen' },
    { label: 'Rechtliches', domain: 'general', tab: 'rechtliches' },
    { label: 'Impressum', domain: 'general', tab: 'impressum' },
    { label: 'Datenschutz', domain: 'general', tab: 'datenschutz' }
  ];
  const DOMAIN_META = {
    astro: { icon: '🔭', label: 'Astronomie' },
    astrologie: { icon: '🔮', label: 'Astrologie' },
    tarot: { icon: '🃏', label: 'Tarot' },
    general: { icon: '⚙️', label: 'App' }
  };
  let searchResultCache = [];
  function openSearchModal() {
    document.getElementById('modalZoomControls').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('show');
    const content = document.getElementById('modalContent');
    content.className = 'modal-content search-mode';
    content.innerHTML = '<div class="field" style="margin-bottom:4px;"><input type="text" id="globalSearchInput" placeholder="Suche über Astronomie & Astrologie…" autocomplete="off"></div><div id="globalSearchResults"></div>';
    setTimeout(function () { const el = document.getElementById('globalSearchInput'); if (el) el.focus(); }, 50);
    document.getElementById('globalSearchInput').addEventListener('input', function (e) {
      const pos = e.target.selectionStart;
      renderSearchResults(e.target.value);
      const el = document.getElementById('globalSearchInput');
      if (el) { el.focus(); el.setSelectionRange(pos, pos); }
    });
  }
  function runGlobalSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const results = [];
    TOOL_SHORTCUTS.forEach(function (s) {
      if (s.label.toLowerCase().indexOf(q) !== -1) {
        results.push({ domain: s.domain, label: s.label, sub: 'Direkt öffnen', action: function () { closeModal(); navigate(s.tab); } });
      }
    });
    ASTRO_GLOSSARY.forEach(function (g) {
      if (g.title.toLowerCase().indexOf(q) !== -1 || g.body.toLowerCase().indexOf(q) !== -1) {
        results.push({ domain: 'astrologie', label: g.title, sub: 'Astro-Lexikon', action: function () { closeModal(); astrolexState = { filter: '', cat: 'all', openId: g.id }; navigate('astrolex'); } });
      }
    });
    if (window.CARDS) {
      window.CARDS.forEach(function (c) {
        if (c.name.toLowerCase().indexOf(q) !== -1 || c.keywords.join(' ').toLowerCase().indexOf(q) !== -1) {
          results.push({ domain: 'tarot', label: c.name, sub: 'Tarot-Lexikon', action: function () { closeModal(); tarotState.view = 'lexikon'; tarotState.lex = { filter: '', arcana: 'all', favOnly: false, openId: c.id }; navigate('tarot'); } });
        }
      });
    }
    PLANET_FACTS.forEach(function (p) {
      if (p.name.toLowerCase().indexOf(q) !== -1 || p.fact.toLowerCase().indexOf(q) !== -1) {
        results.push({ domain: 'astro', label: p.name, sub: 'Planeten-Steckbrief', action: function () { closeModal(); navigate('astro-planets'); } });
      }
    });
    SPACE_GLOSSARY.forEach(function (g) {
      if (g.title.toLowerCase().indexOf(q) !== -1 || g.body.toLowerCase().indexOf(q) !== -1) {
        results.push({ domain: 'astro', label: g.title, sub: 'Weltraumkunde-Lexikon', action: function () { closeModal(); weltraumLexState = { filter: '', cat: 'all', openId: g.id }; navigate('weltraum-lexikon'); } });
      }
    });
    return results.slice(0, 40);
  }
  function renderSearchResults(query) {
    const box = document.getElementById('globalSearchResults');
    if (!box) return;
    const results = runGlobalSearch(query);
    searchResultCache = results;
    if (!query.trim()) { box.innerHTML = '<p class="hint">Mindestens 2 Zeichen eingeben – durchsucht Werkzeuge, Astro-Lexikon, Tarot-Lexikon und Planeten-Steckbriefe.</p>'; return; }
    if (query.trim().length < 2) { box.innerHTML = '<p class="hint">Bitte mindestens 2 Zeichen eingeben.</p>'; return; }
    if (!results.length) { box.innerHTML = '<div class="empty-state"><span class="glyph">🔍</span>Keine Treffer.</div>'; return; }
    const grouped = {};
    results.forEach(function (r, i) {
      r._idx = i;
      if (!grouped[r.domain]) grouped[r.domain] = [];
      grouped[r.domain].push(r);
    });
    let html = '';
    ['astro', 'astrologie', 'tarot', 'general'].forEach(function (dom) {
      if (!grouped[dom]) return;
      const meta = DOMAIN_META[dom];
      html += '<div class="search-domain-label">' + meta.icon + ' ' + meta.label + '</div>';
      grouped[dom].forEach(function (r) {
        html += '<div class="search-result-row" data-idx="' + r._idx + '"><div class="search-result-icon">' + DOMAIN_META[r.domain].icon + '</div><div class="search-result-text"><b>' + esc(r.label) + '</b><span>' + esc(r.sub) + '</span></div></div>';
      });
    });
    box.innerHTML = html;
    box.querySelectorAll('[data-idx]').forEach(function (row) {
      row.addEventListener('click', function () {
        const r = searchResultCache[parseInt(row.dataset.idx, 10)];
        if (r) r.action();
      });
    });
  }

  /* ---------------------------------------------------------------
     Hilfsfunktionen
     --------------------------------------------------------------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDeg(x) { return x.toFixed(1) + '°'; }
  function localDateKey(d) {
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function seedFromString(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }
  function mulberry32(seed) {
    let a = seed;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededRand(str) {
    const seedFn = seedFromString(str);
    return mulberry32(seedFn());
  }

  let toastTimer = null;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------------------------------------------------------------
     Profil-Speicherung
     --------------------------------------------------------------- */
  function getProfiles() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.profiles) || '[]'); }
    catch (e) { return []; }
  }
  function saveProfiles(list) { localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(list)); }
  function addProfile(p) {
    const list = getProfiles();
    p.id = 'p' + Date.now() + Math.floor(Math.random() * 1000);
    list.push(p);
    saveProfiles(list);
    return p;
  }
  function updateProfile(id, patch) {
    const list = getProfiles();
    const idx = list.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch, { id: id });
    saveProfiles(list);
    return list[idx];
  }
  function deleteProfile(id) {
    saveProfiles(getProfiles().filter(function (p) { return p.id !== id; }));
  }
  function getProfile(id) { return getProfiles().find(function (p) { return p.id === id; }); }

  /* ---------------------------------------------------------------
     Chart-Berechnung
     --------------------------------------------------------------- */
  function utcDateFromProfile(p) {
    const parts = p.date.split('-').map(Number);
    let hh = 12, mi = 0;
    if (!p.timeUnknown && p.time) {
      const tp = p.time.split(':').map(Number);
      hh = tp[0]; mi = tp[1];
    }
    const utcMs = Date.UTC(parts[0], parts[1] - 1, parts[2], hh, mi) - (p.utcOffset || 0) * 3600000;
    return new Date(utcMs);
  }

  function computeChart(p) {
    const utcDate = utcDateFromProfile(p);
    const positions = E.computePositions(utcDate);
    let asc = null, mc = null, houses = null;
    if (!p.timeUnknown) {
      const am = E.ascendantMC(utcDate, p.lat, p.lon);
      asc = am.asc; mc = am.mc;
      houses = E.equalHouses(asc);
    }
    const planets = PLANETS_META.map(function (meta) {
      const pos = positions[meta.key];
      const sign = E.lonToSign(pos.lon);
      const house = houses ? E.houseOfLongitude(pos.lon, houses) : null;
      return { key: meta.key, meta: meta, lon: pos.lon, sign: sign, house: house };
    });
    const aspects = [];
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const a = E.findAspect(planets[i].lon, planets[j].lon, 1);
        if (a) aspects.push({ a: planets[i], b: planets[j], aspect: a });
      }
    }
    aspects.sort(function (x, y) { return x.aspect.orb - y.aspect.orb; });
    return { utcDate: utcDate, positions: positions, planets: planets, asc: asc, mc: mc, houses: houses, aspects: aspects };
  }

  function aspectConnector(name, shortA, shortB) {
    switch (name) {
      case 'Konjunktion': return shortA + ' und ' + shortB + ' verschmelzen hier eng ineinander – beide Kräfte wirken wie eins.';
      case 'Sextil': return shortA + ' und ' + shortB + ' unterstützen sich und eröffnen leicht nutzbare Chancen.';
      case 'Quadrat': return shortA + ' und ' + shortB + ' erzeugen produktive Reibung, die zum Wachsen herausfordert.';
      case 'Trigon': return shortA + ' und ' + shortB + ' fließen mühelos zusammen – wie eine natürliche Begabung.';
      case 'Opposition': return shortA + ' und ' + shortB + ' stehen sich gegenüber und suchen einen bewussten Ausgleich.';
      default: return '';
    }
  }

  /* ---------------------------------------------------------------
     SVG-Radkarte
     --------------------------------------------------------------- */
  function polar(cx, cy, r, lon, rotate) {
    const screenAngle = 180 - (lon - rotate);
    const rad = screenAngle * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  function buildWheelSVG(chart) {
    const cx = 180, cy = 180, rOuter = 168, rZodiac = 148, rHouse = 128, rPlanet = 104, rInner = 60;
    const rotate = chart.asc !== null ? chart.asc : 0;
    let svg = '<svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuter + '" fill="#12173a" stroke="#2a3260" stroke-width="1.5"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rZodiac + '" fill="none" stroke="#2a3260" stroke-width="1"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInner + '" fill="#0e1230" stroke="#2a3260" stroke-width="1"/>';

    for (let i = 0; i < 12; i++) {
      const lon0 = i * 30;
      const p1 = polar(cx, cy, rOuter, lon0, rotate);
      const p2 = polar(cx, cy, rZodiac, lon0, rotate);
      svg += '<line x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '" stroke="#3a4380" stroke-width="1"/>';
      const mid = polar(cx, cy, (rOuter + rZodiac) / 2, lon0 + 15, rotate);
      svg += '<text x="' + mid.x.toFixed(1) + '" y="' + (mid.y + 5).toFixed(1) + '" font-size="13" fill="#ffd27a" text-anchor="middle">' + SIGNS_META[i].symbol + '</text>';
    }

    if (chart.houses) {
      for (let i = 0; i < 12; i++) {
        const lon0 = chart.houses[i];
        const p1 = polar(cx, cy, rZodiac, lon0, rotate);
        const p2 = polar(cx, cy, rInner, lon0, rotate);
        const isAngle = (i === 0 || i === 3 || i === 6 || i === 9);
        svg += '<line x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '" stroke="' + (isAngle ? '#b892ff' : '#2a3260') + '" stroke-width="' + (isAngle ? 1.6 : 0.8) + '"/>';
        const lbl = polar(cx, cy, rZodiac - 14, lon0 + 4, rotate);
        svg += '<text x="' + lbl.x.toFixed(1) + '" y="' + (lbl.y + 3).toFixed(1) + '" font-size="8" fill="#7680a8" text-anchor="middle">' + (i + 1) + '</text>';
      }
    }

    // Aspektlinien im Innenkreis
    chart.aspects.forEach(function (item) {
      if (item.aspect.name === 'Konjunktion') return;
      const p1 = polar(cx, cy, rInner, item.a.lon, rotate);
      const p2 = polar(cx, cy, rInner, item.b.lon, rotate);
      const color = item.aspect.name === 'Trigon' ? '#7ee0c9' : item.aspect.name === 'Sextil' ? '#7ee0c9' : item.aspect.name === 'Quadrat' ? '#ff7a7a' : '#ffd27a';
      svg += '<line x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '" stroke="' + color + '" stroke-width="0.7" opacity="0.55"/>';
    });

    chart.planets.forEach(function (pl) {
      const pos = polar(cx, cy, rPlanet, pl.lon, rotate);
      svg += '<circle cx="' + pos.x.toFixed(1) + '" cy="' + pos.y.toFixed(1) + '" r="10" fill="#161c38" stroke="#b892ff" stroke-width="1"/>';
      svg += '<text x="' + pos.x.toFixed(1) + '" y="' + (pos.y + 4).toFixed(1) + '" font-size="11" fill="#eef0fb" text-anchor="middle">' + pl.meta.symbol + '</text>';
    });

    if (chart.asc !== null) {
      const ascP = polar(cx, cy, rOuter + 10, chart.asc, rotate);
      svg += '<text x="' + ascP.x.toFixed(1) + '" y="' + (ascP.y + 4).toFixed(1) + '" font-size="10" fill="#b892ff" text-anchor="middle" font-weight="bold">ASC</text>';
      const mcP = polar(cx, cy, rOuter + 10, chart.mc, rotate);
      svg += '<text x="' + mcP.x.toFixed(1) + '" y="' + (mcP.y + 4).toFixed(1) + '" font-size="10" fill="#ffd27a" text-anchor="middle" font-weight="bold">MC</text>';
    }

    svg += '</svg>';
    return svg;
  }

  /* ---------------------------------------------------------------
     Navigation
     --------------------------------------------------------------- */
  const SECTION_ROOTS = ['start', 'astronomie', 'astrologie', 'mehr'];
  let navHistory = ['start'];
  let chartState = { view: 'list', activeId: null, editId: null };
  let transiteState = { activeId: null };
  let kompatState = { idA: null, idB: null };
  let tarotState = { view: 'start', spread: null, question: '', drawn: [], revealed: [], lex: { filter: '', arcana: 'all', favOnly: false, openId: null } };

  function navigate(tab) {
    if (SECTION_ROOTS.indexOf(tab) !== -1) {
      navHistory = [tab];
    } else if (navHistory[navHistory.length - 1] !== tab) {
      navHistory.push(tab);
    }
    renderActiveTab(tab);
  }
  function goBack() {
    if (navHistory.length > 1) {
      navHistory.pop();
      renderActiveTab(navHistory[navHistory.length - 1]);
    }
  }
  function renderActiveTab(tab) {
    document.querySelectorAll('section.tab').forEach(function (s) { s.classList.remove('active'); });
    const el = document.getElementById('tab-' + tab);
    if (el) el.classList.add('active');
    document.querySelectorAll('nav.bottom-nav button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === navHistory[0]);
    });
    const backBtn = document.getElementById('backBtn');
    const brand = document.getElementById('brandHeader');
    const h1 = brand.querySelector('h1');
    if (navHistory.length > 1) {
      backBtn.style.display = 'flex';
      h1.textContent = (el && el.dataset.title) || 'AstroWahr';
    } else {
      backBtn.style.display = 'none';
      h1.textContent = 'AstroWahr';
    }
    document.getElementById('view').scrollTop = 0;
    renderTab(tab);
  }

  function renderTab(tab) {
    if (tab === 'start') renderStart();
    else if (tab === 'astrologie') renderAstrologie();
    else if (tab === 'astronomie') renderAstronomie();
    else if (tab === 'astro-live') renderAstroLive();
    else if (tab === 'astro-planets') renderAstroPlanets();
    else if (tab === 'astro-sun') renderAstroSun();
    else if (tab === 'astro-precession') renderAstroPrecession();
    else if (tab === 'astro-seasons') renderAstroSeasons();
    else if (tab === 'astro-skymap') renderAstroSkymap();
    else if (tab === 'weltraum') renderWeltraum();
    else if (tab === 'weltraum-lexikon') renderWeltraumLexikon();
    else if (tab === 'weltraum-sterne') renderWeltraumSterne();
    else if (tab === 'weltraum-zeitstrahl') renderWeltraumZeitstrahl();
    else if (tab === 'horoskop') renderHoroskop();
    else if (tab === 'chart') renderChart();
    else if (tab === 'transite') renderTransite();
    else if (tab === 'kompat') renderKompat();
    else if (tab === 'mond') renderMond();
    else if (tab === 'tarot') renderTarot();
    else if (tab === 'astrolex') renderAstrolex();
    else if (tab === 'mehr') renderMehr();
    else if (tab === 'anleitung') renderAnleitung();
    else if (tab === 'einstellungen') renderEinstellungen();
    else if (tab === 'rechtliches') renderRechtliches();
    else if (tab === 'impressum') renderImpressumInline();
    else if (tab === 'datenschutz') renderDatenschutzInline();
  }

  /* ---------------------------------------------------------------
     START (Weiche: Astronomie / Astrologie)
     --------------------------------------------------------------- */
  function renderStart() {
    const now = new Date();
    document.getElementById('heroDate').textContent = now.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const positions = E.computePositions(now);
    const sunSign = E.lonToSign(positions.sonne.lon);
    const moonSign = E.lonToSign(positions.mond.lon);
    const phase = E.moonPhase(now);
    document.getElementById('heroSky').innerHTML =
      '<div class="hero-sky-item"><div class="glyph">' + SIGNS_META[sunSign.index].symbol + '</div><div class="label">Sonnenzeichen</div><div class="value">' + esc(sunSign.sign) + '</div></div>' +
      '<div class="hero-sky-item"><div class="glyph">' + SIGNS_META[moonSign.index].symbol + '</div><div class="label">Mondzeichen</div><div class="value">' + esc(moonSign.sign) + '</div></div>' +
      '<div class="hero-sky-item"><div class="glyph">' + moonPhaseGlyph(phase) + '</div><div class="label">Mondphase</div><div class="value">' + esc(phase.phaseName) + '</div></div>';

    const root = document.getElementById('forkBento');
    root.innerHTML =
      '<div class="tile wide fork-tile" data-goto="astronomie"><div class="tile-badge" style="background:var(--grad-3);">🔭</div><div><div class="tile-title">Astronomie</div><div class="tile-sub">Live-Himmel, Planeten-Steckbriefe, Sonnenauf-/-untergang, Sternbilder & Präzession</div></div></div>' +
      '<div class="tile wide fork-tile" data-goto="astrologie"><div class="tile-badge" style="background:var(--grad-1);">🔮</div><div><div class="tile-title">Astrologie</div><div class="tile-sub">Geburtshoroskop, Tageshoroskop, Transite, Kompatibilität, Tarot & mehr</div></div></div>';
    bindTiles('forkBento');
  }

  /* ---------------------------------------------------------------
     ASTROLOGIE (Hub)
     --------------------------------------------------------------- */
  function renderAstrologie() {
    document.getElementById('astrologieBento').innerHTML =
      tile('grad-1', '🪐', 'Geburtshoroskop', 'Dein vollständiges Radix mit Planeten, Häusern & Aspekten', 'chart') +
      tile('grad-2', '🔮', 'Tageshoroskop', 'Täglicher Impuls für dein Sternzeichen', 'horoskop') +
      tile('grad-3', '🌠', 'Transite', 'Aktuelle Planetenstände auf dein Chart', 'transite') +
      tile('grad-1', '💞', 'Kompatibilität', 'Zwei Charts im Vergleich (Synastrie)', 'kompat') +
      tile('grad-3', '🌙', 'Mondkalender', 'Mondphase, Beleuchtung & nächster Vollmond', 'mond') +
      tile('grad-2', '🃏', 'Tarot', 'Legen & Lexikon', 'tarot') +
      tile('grad-1', '🎓', 'Astro-Lexikon', 'Planeten, Zeichen, Häuser & Aspekte im Detail', 'astrolex');
    bindTiles('astrologieBento');

    const profiles = getProfiles();
    const box = document.getElementById('astrologieProfiles');
    if (!profiles.length) {
      box.innerHTML = '<div class="empty-state"><span class="glyph">✨</span>Noch keine Geburtsdaten gespeichert.<br>Lege im Chart-Bereich dein erstes Geburtshoroskop an.</div>';
    } else {
      box.innerHTML = profiles.slice(-3).reverse().map(function (p) {
        return profileRowHTML(p, 'chart');
      }).join('');
      bindProfileRows(box, 'chart');
    }
  }

  const PLANET_FACTS = [
    { key: 'sonne', name: 'Sonne', symbol: '☉', type: 'Stern (Gelber Zwerg, Spektralklasse G2V)', diameter: '1.392.700 km (rund 109× Erddurchmesser)', distance: 'Zentrum des Sonnensystems', orbitPeriod: '–', rotation: '~27 Tage (Äquator, differenziell)', moons: '–', fact: 'Die Sonne enthält etwa 99,8 % der Masse des gesamten Sonnensystems. Ihr Licht braucht rund 8 Minuten bis zur Erde.' },
    { key: 'merkur', name: 'Merkur', symbol: '☿', type: 'Gesteinsplanet', diameter: '4.879 km', distance: '57,9 Mio. km (0,39 AE) von der Sonne', orbitPeriod: '88 Tage', rotation: '58,6 Tage', moons: '0', fact: 'Merkur hat die stärksten Temperaturschwankungen aller Planeten: bis zu 430 °C am Tag, bis zu -180 °C in der Nacht, da er praktisch keine Atmosphäre besitzt.' },
    { key: 'venus', name: 'Venus', symbol: '♀', type: 'Gesteinsplanet', diameter: '12.104 km', distance: '108,2 Mio. km (0,72 AE) von der Sonne', orbitPeriod: '224,7 Tage', rotation: '243 Tage (rückläufig)', moons: '0', fact: 'Venus dreht sich rückläufig und so langsam, dass ihr Tag länger ist als ihr Jahr. Mit rund 465 °C Oberflächentemperatur ist sie wegen ihrer dichten CO₂-Atmosphäre der heißeste Planet – heißer als der sonnennähere Merkur.' },
    { key: 'erde', name: 'Erde', symbol: '⊕', type: 'Gesteinsplanet', diameter: '12.742 km', distance: '149,6 Mio. km (1 AE) von der Sonne', orbitPeriod: '365,25 Tage', rotation: '23h 56min', moons: '1 (der Mond)', fact: 'Die Erde ist der einzige bekannte Planet mit flüssigem Oberflächenwasser und bestätigtem Leben.' },
    { key: 'mars', name: 'Mars', symbol: '♂', type: 'Gesteinsplanet', diameter: '6.779 km', distance: '227,9 Mio. km (1,52 AE) von der Sonne', orbitPeriod: '687 Tage', rotation: '24h 37min', moons: '2 (Phobos, Deimos)', fact: 'Der Mars beherbergt mit Olympus Mons den höchsten bekannten Vulkan des Sonnensystems – rund 22 km hoch, fast dreimal so hoch wie der Mount Everest.' },
    { key: 'jupiter', name: 'Jupiter', symbol: '♃', type: 'Gasriese', diameter: '139.820 km', distance: '778,5 Mio. km (5,20 AE) von der Sonne', orbitPeriod: '11,86 Jahre', rotation: '9h 56min', moons: 'über 110 bekannte Monde (Stand 2026, laufend neue Entdeckungen)', fact: 'Jupiter ist mit Abstand der massereichste Planet – mehr als doppelt so massereich wie alle anderen Planeten zusammen. Sein „Großer Roter Fleck" ist ein Sturm, der seit Jahrhunderten tobt.' },
    { key: 'saturn', name: 'Saturn', symbol: '♄', type: 'Gasriese', diameter: '116.460 km', distance: '1,43 Mrd. km (9,58 AE) von der Sonne', orbitPeriod: '29,4 Jahre', rotation: '10h 34min', moons: 'über 290 bekannte Monde (Stand 2026, Rekordhalter im Sonnensystem)', fact: 'Saturns Ringe bestehen überwiegend aus Eispartikeln und sind trotz ihres riesigen Durchmessers erstaunlich dünn – im Schnitt nur wenige Zehnermeter dick.' },
    { key: 'uranus', name: 'Uranus', symbol: '♅', type: 'Eisriese', diameter: '50.724 km', distance: '2,87 Mrd. km (19,2 AE) von der Sonne', orbitPeriod: '84 Jahre', rotation: '17h 14min', moons: '28 bekannte Monde', fact: 'Uranus rotiert quer „liegend" mit einer Achsneigung von rund 98° – vermutlich Folge einer gewaltigen Kollision in der Frühzeit des Sonnensystems.' },
    { key: 'neptun', name: 'Neptun', symbol: '♆', type: 'Eisriese', diameter: '49.244 km', distance: '4,50 Mrd. km (30,05 AE) von der Sonne', orbitPeriod: '165 Jahre', rotation: '16h 6min', moons: '16 bekannte Monde', fact: 'Neptun hat die stärksten Winde des Sonnensystems – Böen von bis zu 2.100 km/h wurden gemessen.' },
    { key: 'pluto', name: 'Pluto', symbol: '♇', type: 'Zwergplanet (seit 2006)', diameter: '2.377 km', distance: '~5,9 Mrd. km (39,5 AE, stark elliptische Bahn)', orbitPeriod: '248 Jahre', rotation: '6,4 Tage', moons: '5 (größter: Charon)', fact: 'Pluto und sein großer Mond Charon umkreisen einander so eng, dass ihr gemeinsamer Schwerpunkt außerhalb von Pluto liegt.' },
    { key: 'mond', name: 'Mond (Erdmond)', symbol: '☽', type: 'Natürlicher Satellit der Erde', diameter: '3.474 km', distance: '~384.400 km von der Erde', orbitPeriod: '27,3 Tage (siderisch) / 29,5 Tage (synodisch)', rotation: 'gebunden – zeigt der Erde immer dieselbe Seite', moons: '–', fact: 'Der Mond entfernt sich jedes Jahr um rund 3,8 cm von der Erde – gemessen mit Reflektoren, die Apollo-Astronauten hinterlassen haben.' }
  ];

  const ZODIAC_CONSTELLATIONS = [
    { sign: 'Widder', dateRange: '21.3. – 19.4.', constellation: 'Fische', note: 'Die Sonne steht zu dieser Zeit astronomisch bereits im Sternbild Fische.' },
    { sign: 'Stier', dateRange: '20.4. – 20.5.', constellation: 'Widder', note: '' },
    { sign: 'Zwillinge', dateRange: '21.5. – 20.6.', constellation: 'Stier', note: '' },
    { sign: 'Krebs', dateRange: '21.6. – 22.7.', constellation: 'Zwillinge', note: '' },
    { sign: 'Löwe', dateRange: '23.7. – 22.8.', constellation: 'Krebs', note: '' },
    { sign: 'Jungfrau', dateRange: '23.8. – 22.9.', constellation: 'Löwe', note: '' },
    { sign: 'Waage', dateRange: '23.9. – 22.10.', constellation: 'Jungfrau', note: '' },
    { sign: 'Skorpion', dateRange: '23.10. – 21.11.', constellation: 'Waage', note: '' },
    { sign: 'Schütze', dateRange: '22.11. – 21.12.', constellation: 'Skorpion / Schlangenträger', note: 'Die Sonne durchquert hier auch das 13. Sternbild Ophiuchus (Schlangenträger).' },
    { sign: 'Steinbock', dateRange: '22.12. – 19.1.', constellation: 'Schütze', note: '' },
    { sign: 'Wassermann', dateRange: '20.1. – 18.2.', constellation: 'Steinbock', note: '' },
    { sign: 'Fische', dateRange: '19.2. – 20.3.', constellation: 'Wassermann', note: '' }
  ];

  /* ---------------------------------------------------------------
     ASTRONOMIE (Hub + Unterseiten)
     --------------------------------------------------------------- */
  function renderAstronomie() {
    document.getElementById('astronomieBento').innerHTML =
      tile('grad-3', '🌠', 'Himmel jetzt', 'Aktuelle Positionen, Entfernungen & Rückläufigkeit in Echtzeit', 'astro-live') +
      tile('grad-2', '🧭', 'Sternenhimmelkarte', 'Wohin schauen? Kompassansicht für deinen Standort', 'astro-skymap') +
      tile('grad-1', '🪐', 'Planeten-Steckbriefe', 'Größe, Entfernung, Umlaufzeit, Monde – reine Fakten', 'astro-planets') +
      tile('grad-2', '🌅', 'Sonnenauf-/-untergang', 'Für jeden Ort berechnet, inkl. Taglänge', 'astro-sun') +
      tile('grad-1', '🍂', 'Jahreszeiten-Rechner', 'Exakte Äquinoktien & Sonnwenden für jedes Jahr', 'astro-seasons') +
      tile('grad-3', '✨', 'Sternbilder & Präzession', 'Warum dein Tierkreiszeichen nicht am Himmel steht', 'astro-precession') +
      tile('grad-2', '🔭', 'Weltraumkunde', 'Sterne, Universum, Sonnensystem & Raumfahrt', 'weltraum') +
      tile('grad-1', '🌙', 'Mondkalender', 'Mondphase, Beleuchtung & nächster Vollmond', 'mond');
    bindTiles('astronomieBento');
  }

  function renderAstroLive() {
    const root = document.getElementById('astroLiveRoot');
    const now = new Date();
    const positions = E.computePositions(now);
    const retro = E.retrogradeStatus(now);
    const sunEq = E.sunEquatorial(now);

    let html = '<p class="hint">Echte, auf deinem Gerät berechnete Positionen und Entfernungen – kein Blick durchs Teleskop, sondern Daten aus der astronomischen Berechnung.</p>';
    html += '<table class="data-table"><thead><tr><th></th><th>Körper</th><th>Länge</th><th>Entfernung</th><th></th></tr></thead><tbody>';
    PLANETS_META.forEach(function (meta) {
      const pos = positions[meta.key];
      const sign = E.lonToSign(pos.lon);
      let dist;
      if (meta.key === 'sonne') dist = (pos.dist * 149597870.7 / 1000000).toFixed(1) + ' Mio. km';
      else if (meta.key === 'mond') dist = Math.round(pos.dist * 6371) + ' km';
      else dist = pos.dist.toFixed(2) + ' AE';
      const isRetro = retro[meta.key];
      html += '<tr><td class="glyph-cell">' + meta.symbol + '</td><td>' + glossLink('planet:' + meta.key, meta.name) + '</td><td>' + fmtDeg(sign.degree) + ' ' + sign.sign + '</td><td>' + dist + '</td><td>' + (isRetro ? '<span title="Rückläufig">℞</span>' : '') + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<p class="hint">℞ = die scheinbare Bewegung des Planeten ist aktuell rückläufig (er bewegt sich, von der Erde aus gesehen, für einige Wochen entgegen seiner sonst üblichen Richtung durch den Tierkreis – eine reine Perspektiventäuschung durch die unterschiedlichen Umlaufgeschwindigkeiten von Erde und Planet, keine tatsächliche Kursänderung).</p>';

    html += '<h2 class="section-title">Sichtbarkeit</h2><div class="card">';
    ['merkur', 'venus'].forEach(function (key) {
      const meta = PLANETS_META.find(function (m) { return m.key === key; });
      const elong = E.angleDiffSigned(positions[key].lon, positions.sonne.lon);
      const absElong = Math.abs(elong);
      let text;
      if (absElong < 8) text = 'aktuell zu nah an der Sonne, um sichtbar zu sein';
      else if (elong < 0) text = 'derzeit ' + glossLink('planet:' + key, 'Morgenstern') + ' – vor Sonnenaufgang im Osten sichtbar (Winkelabstand zur Sonne: ' + absElong.toFixed(0) + '°)';
      else text = 'derzeit Abendstern – nach Sonnenuntergang im Westen sichtbar (Winkelabstand zur Sonne: ' + absElong.toFixed(0) + '°)';
      html += '<div class="aspect-row"><div class="aspect-symbol">' + meta.symbol + '</div><div class="aspect-text"><b>' + meta.name + '</b><br>' + text + '</div></div>';
    });
    ['mars', 'jupiter', 'saturn'].forEach(function (key) {
      const meta = PLANETS_META.find(function (m) { return m.key === key; });
      const elong = Math.abs(E.angleDiffSigned(positions[key].lon, positions.sonne.lon));
      let text;
      if (elong < 20) text = 'nahe der Sonne, kaum beobachtbar';
      else if (elong > 150) text = 'nahe Opposition – die ganze Nacht sichtbar, günstigste Beobachtungszeit';
      else text = 'am Abend- oder Morgenhimmel sichtbar (Winkelabstand zur Sonne: ' + elong.toFixed(0) + '°)';
      html += '<div class="aspect-row"><div class="aspect-symbol">' + meta.symbol + '</div><div class="aspect-text"><b>' + meta.name + '</b><br>' + text + '</div></div>';
    });
    html += '</div>';
    html += '<div class="disclaimer-box">Sichtbarkeitsangaben sind grobe Näherungen anhand des Winkelabstands zur Sonne (Elongation) – tatsächliche Sichtbarkeit hängt zusätzlich von Horizonthöhe, Tageszeit, Wetter und Lichtverschmutzung an deinem Standort ab.</div>';
    root.innerHTML = html;
  }

  function renderAstroPlanets() {
    const root = document.getElementById('astroPlanetsRoot');
    let html = '<p class="hint">Reine astronomische Fakten – unabhängig von der astrologischen Bedeutung im Astro-Lexikon.</p>';
    html += PLANET_FACTS.map(function (p) {
      return '<div class="card">' +
        '<div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><span style="font-size:1.5rem;">' + p.symbol + '</span><div><div style="font-weight:700;">' + esc(p.name) + '</div><div style="font-size:.76rem; color:var(--text-faint);">' + esc(p.type) + '</div></div></div>' +
        '<table class="data-table"><tbody>' +
        '<tr><td>Durchmesser</td><td>' + esc(p.diameter) + '</td></tr>' +
        '<tr><td>Entfernung</td><td>' + esc(p.distance || '') + '</td></tr>' +
        (p.orbitPeriod && p.orbitPeriod !== '–' ? '<tr><td>Umlaufzeit</td><td>' + esc(p.orbitPeriod) + '</td></tr>' : '') +
        '<tr><td>Rotation</td><td>' + esc(p.rotation) + '</td></tr>' +
        '<tr><td>Monde</td><td>' + esc(p.moons) + '</td></tr>' +
        '</tbody></table>' +
        '<p style="font-size:.84rem; color:var(--text-dim); margin-top:8px; margin-bottom:0;">' + esc(p.fact) + '</p>' +
        '</div>';
    }).join('');
    root.innerHTML = html;
  }

  let astroSunState = { lat: null, lon: null, place: '', offset: null, date: null };
  function renderAstroSun() {
    const root = document.getElementById('astroSunRoot');
    const today = new Date();
    if (!astroSunState.date) astroSunState.date = localDateKey(today);
    if (astroSunState.offset === null) astroSunState.offset = euDefaultOffset(astroSunState.date);
    const offsets = OFFSET_PRESETS.concat(buildFullOffsetList());
    let html = '<p class="hint">Berechnet Sonnenauf-/-untergang, Sonnenmittag und Taglänge für einen beliebigen Ort und ein beliebiges Datum – ohne Standortabfrage, per manueller Eingabe.</p>';
    html += '<div class="field"><label>Ort (Tippen zum Suchen oder frei eintragen)</label><input type="text" id="sunPlace" list="cityListSun" placeholder="z. B. Tangstedt" autocomplete="off" value="' + esc(astroSunState.place) + '"><datalist id="cityListSun">' + CITY_PRESETS.map(function (c) { return '<option value="' + esc(c.name) + '">'; }).join('') + '</datalist></div>';
    html += '<div class="field"><div class="row2"><div><label>Breitengrad (Lat)</label><input type="number" step="0.0001" id="sunLat" value="' + (astroSunState.lat !== null ? astroSunState.lat : '') + '"></div><div><label>Längengrad (Lon)</label><input type="number" step="0.0001" id="sunLon" value="' + (astroSunState.lon !== null ? astroSunState.lon : '') + '"></div></div></div>';
    html += '<div class="field"><label>Zeitzone</label><select id="sunOffset">' + offsets.map(function (o) { return '<option value="' + o.value + '"' + (astroSunState.offset === o.value ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select></div>';
    html += '<div class="field"><label>Datum</label><input type="date" id="sunDate" value="' + astroSunState.date + '"></div>';
    html += '<button class="btn" id="sunComputeBtn">Berechnen</button>';
    html += '<div id="sunResult"></div>';
    root.innerHTML = html;

    document.getElementById('sunPlace').addEventListener('input', function (e) {
      const match = CITY_PRESETS.find(function (c) { return c.name.toLowerCase() === e.target.value.trim().toLowerCase(); });
      if (match) { document.getElementById('sunLat').value = match.lat; document.getElementById('sunLon').value = match.lon; }
    });
    document.getElementById('sunDate').addEventListener('change', function (e) {
      const offsetSelect = document.getElementById('sunOffset');
      const wasAutoValue = parseFloat(offsetSelect.value) === euDefaultOffset(astroSunState.date);
      if (wasAutoValue) offsetSelect.value = euDefaultOffset(e.target.value);
      astroSunState.date = e.target.value;
    });
    document.getElementById('sunComputeBtn').addEventListener('click', function () {
      const lat = parseFloat(document.getElementById('sunLat').value);
      const lon = parseFloat(document.getElementById('sunLon').value);
      const offset = parseFloat(document.getElementById('sunOffset').value);
      const dateStr = document.getElementById('sunDate').value;
      const place = document.getElementById('sunPlace').value.trim();
      if (isNaN(lat) || isNaN(lon) || isNaN(offset) || !dateStr) { toast('Bitte Ort/Koordinaten, Zeitzone und Datum angeben'); return; }
      astroSunState = { lat: lat, lon: lon, place: place, offset: offset, date: dateStr };
      renderSunResult();
    });
    if (astroSunState.lat !== null && astroSunState.lon !== null && astroSunState.offset !== null) renderSunResult();
  }
  function renderSunResult() {
    const box = document.getElementById('sunResult');
    if (!box) return;
    const parts = astroSunState.date.split('-').map(Number);
    const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const t = E.sunTimes(localDate, astroSunState.lat, astroSunState.lon, astroSunState.offset);
    function fmtTime(d) {
      if (!d) return '–';
      const local = new Date(d.getTime() + astroSunState.offset * 3600000);
      return String(local.getUTCHours()).padStart(2, '0') + ':' + String(local.getUTCMinutes()).padStart(2, '0') + ' Uhr';
    }
    let html = '<div class="bento">';
    html += '<div class="tile"><div class="tile-title">🌅 Sonnenaufgang</div><div class="tile-sub">' + (t.polarDay ? 'Polartag – Sonne geht nicht unter' : t.polarNight ? 'Polarnacht – Sonne geht nicht auf' : fmtTime(t.sunrise)) + '</div></div>';
    html += '<div class="tile"><div class="tile-title">🌇 Sonnenuntergang</div><div class="tile-sub">' + (t.polarDay ? 'Polartag – Sonne geht nicht unter' : t.polarNight ? 'Polarnacht – Sonne geht nicht auf' : fmtTime(t.sunset)) + '</div></div>';
    html += '<div class="tile"><div class="tile-title">☀️ Sonnenmittag</div><div class="tile-sub">' + fmtTime(t.solarNoon) + '</div></div>';
    html += '<div class="tile"><div class="tile-title">⏱️ Taglänge</div><div class="tile-sub">' + (t.polarDay ? '24 Std.' : t.polarNight ? '0 Std.' : Math.floor(t.dayLengthHours) + ' Std. ' + Math.round((t.dayLengthHours % 1) * 60) + ' Min.') + '</div></div>';
    html += '</div>';
    html += '<p class="hint">Werte sind auf wenige Minuten genau (vereinfachtes Berechnungsverfahren, Standardrefraktion berücksichtigt); lokale Horizontverdeckung durch Berge/Gebäude ist nicht enthalten.</p>';
    box.innerHTML = html;
  }

  function renderAstroPrecession() {
    const root = document.getElementById('astroPrecessionRoot');
    let html = '<div class="card">';
    html += '<p style="font-size:.9rem; line-height:1.6; margin:0;">Die Tierkreiszeichen der Astrologie (Widder bis Fische) sind an die <b>Jahreszeiten</b> gekoppelt: Widder beginnt fest am Frühlingsäquinoktium. Die <b>Sternbilder</b> am Himmel dagegen sind ausgedehnte, unterschiedlich große Flächen mit festen Grenzen. Vor rund 2.000 Jahren, als das astrologische System entstand, deckten sich beide noch ungefähr. Seitdem hat sich die Erdachse durch die sogenannte <b>Präzession</b> (ein rund 26.000 Jahre dauerndes „Taumeln" der Erdachse) um etwa ein Tierkreiszeichen weitergedreht – die Sonne steht an deinem Geburtstag heute astronomisch meist im <i>vorherigen</i> Sternbild.</p>';
    html += '</div>';
    html += '<table class="data-table"><thead><tr><th>Tierkreiszeichen</th><th>Astrologischer Zeitraum</th><th>Sonne astronomisch aktuell im Sternbild</th></tr></thead><tbody>';
    ZODIAC_CONSTELLATIONS.forEach(function (z) {
      html += '<tr><td>' + esc(z.sign) + '</td><td>' + esc(z.dateRange) + '</td><td>' + esc(z.constellation) + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<div class="disclaimer-box">Die westliche Astrologie arbeitet bewusst mit dem <b>tropischen</b> Tierkreis (an die Jahreszeiten gekoppelt), nicht mit den tatsächlichen Sternbildern – das ist kein Fehler, sondern eine andere Definition von „Zeichen" als in der beobachtenden Astronomie. Ein 13. Sternbild, der Schlangenträger (Ophiuchus), wird von der Ekliptik ebenfalls durchquert, ist in der westlichen Astrologie aber traditionell nicht als eigenes Zeichen enthalten.</div>';
    root.innerHTML = html;
  }

  /* ---------------------------------------------------------------
     WELTRAUMKUNDE (Hub + Lexikon + Sternentwicklung + Zeitstrahl)
     --------------------------------------------------------------- */
  function renderWeltraum() {
    const root = document.getElementById('weltraumRoot');
    let html = '<p class="hint">Sterne, das Universum im Großen, die Feinheiten unseres Sonnensystems und die Geschichte der Raumfahrt – als eigener Wissensbereich innerhalb der Astronomie, unabhängig von jeder Deutung.</p>';
    html += '<div class="bento" id="weltraumBento"></div>';
    root.innerHTML = html;
    document.getElementById('weltraumBento').innerHTML =
      tile('grad-1', '📚', 'Lexikon', 'Sterne, Universum, Sonnensystem & Raumfahrt durchsuchen', 'weltraum-lexikon') +
      tile('grad-3', '⭐', 'Sternentwicklung', 'Vom Nebel zum Weißen Zwerg, Neutronenstern oder Schwarzen Loch', 'weltraum-sterne') +
      tile('grad-2', '🚀', 'Raumfahrt-Zeitstrahl', 'Meilensteine von Sputnik bis heute', 'weltraum-zeitstrahl');
    bindTiles('weltraumBento');
  }

  const SPACE_CATS = [['all', 'Alle'], ['star', 'Sterne'], ['universe', 'Universum'], ['solar', 'Sonnensystem'], ['space', 'Raumfahrt']];
  let weltraumLexState = { filter: '', cat: 'all', openId: null };
  function renderWeltraumLexikon() {
    const root = document.getElementById('weltraumLexikonRoot');
    let html = '<h2 class="section-title">Weltraumkunde-Lexikon</h2>';
    html += '<div class="field"><input type="text" id="wxSearch" placeholder="Begriff suchen…" autocomplete="off" value="' + esc(weltraumLexState.filter) + '"></div>';
    html += '<div class="pill-select">' + SPACE_CATS.map(function (c) {
      return '<div class="pill' + (weltraumLexState.cat === c[0] ? ' active' : '') + '" data-wxcat="' + c[0] + '">' + c[1] + '</div>';
    }).join('') + '</div>';

    if (weltraumLexState.openId) {
      const g = spaceEntry(weltraumLexState.openId);
      if (g) {
        html += '<button class="btn ghost small" id="wxBackBtn" style="margin:8px 0;">← Zur Übersicht</button>';
        html += '<div class="card"><div style="font-size:1.6rem; margin-bottom:6px;">' + g.symbol + '</div><h2 class="section-title" style="margin-top:0;">' + esc(g.title) + '</h2><p style="font-size:.9rem; line-height:1.65; color:var(--text-dim);">' + esc(g.body) + '</p></div>';
        root.innerHTML = html;
        bindWeltraumLexControls(root);
        document.getElementById('wxBackBtn').addEventListener('click', function () { weltraumLexState.openId = null; renderWeltraumLexikon(); });
        return;
      }
    }

    const q = weltraumLexState.filter.toLowerCase();
    const filtered = SPACE_GLOSSARY.filter(function (g) {
      if (weltraumLexState.cat !== 'all' && g.cat !== weltraumLexState.cat) return false;
      if (!q) return true;
      return g.title.toLowerCase().indexOf(q) !== -1 || g.body.toLowerCase().indexOf(q) !== -1;
    });
    html += '<div class="card">' + filtered.map(function (g) {
      return '<div class="aspect-row" data-wxopen="' + g.id + '" style="cursor:pointer;"><div class="aspect-symbol">' + g.symbol + '</div><div class="aspect-text"><b>' + esc(g.title) + '</b><br><span style="color:var(--text-faint); font-size:.78rem;">' + esc(g.body.slice(0, 70)) + '…</span></div></div>';
    }).join('') + '</div>';
    if (!filtered.length) html += '<div class="empty-state"><span class="glyph">🔍</span>Keine Treffer.</div>';
    root.innerHTML = html;
    bindWeltraumLexControls(root);
    root.querySelectorAll('[data-wxopen]').forEach(function (row) {
      row.addEventListener('click', function () { weltraumLexState.openId = row.getAttribute('data-wxopen'); renderWeltraumLexikon(); });
    });
  }
  function bindWeltraumLexControls(root) {
    const search = document.getElementById('wxSearch');
    if (search) search.addEventListener('input', function (e) {
      const pos = e.target.selectionStart;
      weltraumLexState.filter = e.target.value;
      renderWeltraumLexikon();
      const el = document.getElementById('wxSearch');
      if (el) { el.focus(); el.setSelectionRange(pos, pos); }
    });
    root.querySelectorAll('[data-wxcat]').forEach(function (p) {
      p.addEventListener('click', function () { weltraumLexState.cat = p.getAttribute('data-wxcat'); weltraumLexState.openId = null; renderWeltraumLexikon(); });
    });
  }

  function renderWeltraumSterne() {
    const root = document.getElementById('weltraumSterneRoot');
    let html = '<p class="hint">Wie ein Stern sein Leben verbringt, hängt fast ausschließlich von seiner Masse ab. Eigene, vereinfachte Darstellung – keine Fotografie.</p>';
    html += '<div class="card" style="text-align:center;">';
    html += '<div style="font-size:1.6rem;">🌫️ → ⭐</div><div style="font-weight:700; margin:4px 0;">' + esc(spaceEntry('star:entstehung').title) + ' → ' + esc(spaceEntry('star:hauptreihe').title) + '</div>';
    html += '<p style="font-size:.82rem; color:var(--text-dim);">Jeder Stern beginnt als kollabierende Gaswolke und verbringt danach den größten Teil seines Lebens stabil auf der Hauptreihe.</p>';
    html += '</div>';

    html += '<div class="bento">';
    html += '<div class="tile" style="grid-column:1/-1;"><div class="tile-title">☀️ Sonnenähnliche Sterne (leicht bis mittelschwer)</div><div class="tile-sub">Hauptreihe → ' + esc(spaceEntry('star:roter-riese').title) + ' → ' + esc(spaceEntry('star:weisser-zwerg').title) + '</div></div>';
    html += '<div class="tile" style="grid-column:1/-1;"><div class="tile-title">💥 Massereiche Sterne (ab ca. 8 Sonnenmassen)</div><div class="tile-sub">Hauptreihe → Roter Überriese → ' + esc(spaceEntry('star:supernova').title) + ' → ' + esc(spaceEntry('star:neutronenstern').title) + ' oder ' + esc(spaceEntry('star:schwarzes-loch').title) + '</div></div>';
    html += '</div>';

    html += '<h2 class="section-title">Die Stationen im Detail</h2><div class="card">';
    ['star:entstehung', 'star:hauptreihe', 'star:roter-riese', 'star:weisser-zwerg', 'star:supernova', 'star:neutronenstern', 'star:schwarzes-loch'].forEach(function (id) {
      const g = spaceEntry(id);
      html += '<div class="aspect-row" data-wxopen2="' + g.id + '" style="cursor:pointer;"><div class="aspect-symbol">' + g.symbol + '</div><div class="aspect-text"><b>' + esc(g.title) + '</b><br><span style="color:var(--text-faint); font-size:.78rem;">' + esc(g.body.slice(0, 80)) + '…</span></div></div>';
    });
    html += '</div>';
    html += '<div class="disclaimer-box">Stark vereinfachtes Schema für den Überblick – tatsächlich hängt der genaue Verlauf zusätzlich von Faktoren wie Doppelsternpartnern oder chemischer Zusammensetzung ab.</div>';
    root.innerHTML = html;
    root.querySelectorAll('[data-wxopen2]').forEach(function (row) {
      row.addEventListener('click', function () { weltraumLexState = { filter: '', cat: 'all', openId: row.getAttribute('data-wxopen2') }; navigate('weltraum-lexikon'); });
    });
  }

  const SPACE_TIMELINE = [
    { year: '1957', id: 'space:sputnik' },
    { year: '1961', id: 'space:gagarin' },
    { year: '1969', id: 'space:apollo11' },
    { year: '1981–2011', id: 'space:spaceshuttle' },
    { year: 'seit 2000', id: 'space:iss' },
    { year: 'seit 1977', id: 'space:sonden' },
    { year: 'seit 2010er', id: 'space:wiederverwendbarkeit' }
  ];
  function renderWeltraumZeitstrahl() {
    const root = document.getElementById('weltraumZeitstrahlRoot');
    let html = '<p class="hint">Ausgewählte Meilensteine der Raumfahrtgeschichte – für Details antippen.</p>';
    html += '<div class="card">';
    SPACE_TIMELINE.forEach(function (item, i) {
      const g = spaceEntry(item.id);
      html += '<div class="aspect-row" data-wxopen3="' + g.id + '" style="cursor:pointer;"><div class="aspect-symbol">' + g.symbol + '</div><div class="aspect-text"><b>' + esc(item.year) + ' – ' + esc(g.title) + '</b><br><span style="color:var(--text-faint); font-size:.78rem;">' + esc(g.body.slice(0, 90)) + '…</span></div></div>';
    });
    html += '</div>';
    html += '<div class="disclaimer-box">Auswahl bekannter Meilensteine, keine vollständige Raumfahrtgeschichte. Reine Textdarstellung ohne Missionslogos oder Fotografien.</div>';
    root.innerHTML = html;
    root.querySelectorAll('[data-wxopen3]').forEach(function (row) {
      row.addEventListener('click', function () { weltraumLexState = { filter: '', cat: 'all', openId: row.getAttribute('data-wxopen3') }; navigate('weltraum-lexikon'); });
    });
  }

  /* ---------------------------------------------------------------
     ASTRONOMIE: JAHRESZEITEN-RECHNER
     --------------------------------------------------------------- */
  let astroSeasonsState = { year: new Date().getFullYear(), offset: null };
  function renderAstroSeasons() {
    const root = document.getElementById('astroSeasonsRoot');
    if (astroSeasonsState.offset === null) astroSeasonsState.offset = 1;
    const offsets = OFFSET_PRESETS.concat(buildFullOffsetList());
    let html = '<p class="hint">Die exakten astronomischen Zeitpunkte, an denen die Jahreszeiten beginnen – berechnet aus dem Sonnenstand, nicht aus dem Kalender. Diese Momente bilden zugleich die Grundlage für den in der Astrologie verwendeten tropischen Tierkreis (siehe „Sternbilder & Präzession"), werden hier aber rein astronomisch betrachtet.</p>';
    html += '<div class="field row2" style="display:flex; gap:10px;">';
    html += '<div style="flex:1;"><label style="display:block; font-size:.8rem; color:var(--text-dim); margin-bottom:5px; font-weight:600;">Jahr</label><input type="number" id="seasonYear" value="' + astroSeasonsState.year + '" style="width:100%; background:var(--card-2); border:1px solid var(--border); border-radius:10px; padding:11px 12px; font-size:.92rem; color:var(--text); height:44px;"></div>';
    html += '<div style="flex:1;"><label style="display:block; font-size:.8rem; color:var(--text-dim); margin-bottom:5px; font-weight:600;">Zeitzone</label><select id="seasonOffset" style="width:100%; background:var(--card-2); border:1px solid var(--border); border-radius:10px; padding:11px 12px; font-size:.92rem; color:var(--text); height:44px;">' + offsets.map(function (o) { return '<option value="' + o.value + '"' + (astroSeasonsState.offset === o.value ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select></div>';
    html += '</div>';
    html += '<button class="btn" id="seasonComputeBtn">Berechnen</button>';
    html += '<div id="seasonResult"></div>';
    root.innerHTML = html;
    document.getElementById('seasonComputeBtn').addEventListener('click', function () {
      astroSeasonsState.year = parseInt(document.getElementById('seasonYear').value, 10) || new Date().getFullYear();
      astroSeasonsState.offset = parseFloat(document.getElementById('seasonOffset').value);
      renderSeasonResult();
    });
    renderSeasonResult();
  }
  function renderSeasonResult() {
    const box = document.getElementById('seasonResult');
    if (!box) return;
    const y = astroSeasonsState.year, off = astroSeasonsState.offset;
    const events = [
      { label: 'Frühlings-Tagundnachtgleiche', glyph: '🌱', lon: 0 },
      { label: 'Sommersonnenwende', glyph: '☀️', lon: 90 },
      { label: 'Herbst-Tagundnachtgleiche', glyph: '🍂', lon: 180 },
      { label: 'Wintersonnenwende', glyph: '❄️', lon: 270 }
    ];
    function fmtLocal(d) {
      const local = new Date(d.getTime() + off * 3600000);
      return String(local.getUTCDate()).padStart(2, '0') + '.' + String(local.getUTCMonth() + 1).padStart(2, '0') + '.' + local.getUTCFullYear() + ', ' + String(local.getUTCHours()).padStart(2, '0') + ':' + String(local.getUTCMinutes()).padStart(2, '0') + ' Uhr';
    }
    let html = '<div class="bento">';
    events.forEach(function (ev) {
      const d = E.findSolarLongitudeCrossing(y, ev.lon);
      html += '<div class="tile"><div class="tile-title">' + ev.glyph + ' ' + ev.label + '</div><div class="tile-sub">' + fmtLocal(d) + '</div></div>';
    });
    html += '</div>';
    html += '<p class="hint">Zeitpunkte auf etwa eine Viertelstunde genau (vereinfachtes Berechnungsverfahren ohne Nutations- und Störungsterme). Nordhalbkugel-Bezeichnungen – auf der Südhalbkugel sind Sommer- und Wintersonnenwende sowie die beiden Äquinoktien-Jahreszeiten vertauscht.</p>';
    box.innerHTML = html;
  }

  /* ---------------------------------------------------------------
     ASTRONOMIE: STERNENHIMMELKARTE
     --------------------------------------------------------------- */
  let astroSkymapState = { lat: null, lon: null, place: '', hourOffset: 0 };
  function renderAstroSkymap() {
    const root = document.getElementById('astroSkymapRoot');
    if (astroSkymapState.lat === null && astroSunState.lat !== null) {
      astroSkymapState = { lat: astroSunState.lat, lon: astroSunState.lon, place: astroSunState.place, hourOffset: 0 };
    }
    let html = '<p class="hint">Zeigt, in welcher Himmelsrichtung und wie hoch über dem Horizont Sonne, Mond und Planeten stehen – wie ein Kompass, keine Sternkarte mit einzelnen Sternen. Mit dem Regler lässt sich der Himmel für andere Uhrzeiten desselben Tages ansehen.</p>';
    html += '<div class="field"><label>Ort (Tippen zum Suchen oder frei eintragen)</label><input type="text" id="skyPlace" list="cityListSky" placeholder="z. B. Tangstedt" autocomplete="off" value="' + esc(astroSkymapState.place) + '"><datalist id="cityListSky">' + CITY_PRESETS.map(function (c) { return '<option value="' + esc(c.name) + '">'; }).join('') + '</datalist></div>';
    html += '<div class="field"><div class="row2"><div><label>Breitengrad (Lat)</label><input type="number" step="0.0001" id="skyLat" value="' + (astroSkymapState.lat !== null ? astroSkymapState.lat : '') + '"></div><div><label>Längengrad (Lon)</label><input type="number" step="0.0001" id="skyLon" value="' + (astroSkymapState.lon !== null ? astroSkymapState.lon : '') + '"></div></div></div>';
    html += '<button class="btn" id="skyComputeBtn">Himmelsansicht anzeigen</button>';
    html += '<div id="skyResult"></div>';
    root.innerHTML = html;
    document.getElementById('skyPlace').addEventListener('input', function (e) {
      const match = CITY_PRESETS.find(function (c) { return c.name.toLowerCase() === e.target.value.trim().toLowerCase(); });
      if (match) { document.getElementById('skyLat').value = match.lat; document.getElementById('skyLon').value = match.lon; }
    });
    document.getElementById('skyComputeBtn').addEventListener('click', function () {
      const lat = parseFloat(document.getElementById('skyLat').value);
      const lon = parseFloat(document.getElementById('skyLon').value);
      const place = document.getElementById('skyPlace').value.trim();
      if (isNaN(lat) || isNaN(lon)) { toast('Bitte Ort oder Koordinaten angeben'); return; }
      astroSkymapState.lat = lat; astroSkymapState.lon = lon; astroSkymapState.place = place; astroSkymapState.hourOffset = 0;
      renderSkymapResult();
    });
    if (astroSkymapState.lat !== null && astroSkymapState.lon !== null) renderSkymapResult();
  }
  function renderSkymapResult() {
    const box = document.getElementById('skyResult');
    if (!box) return;
    const off = astroSkymapState.hourOffset || 0;
    const now = new Date(Date.now() + off * 3600000);
    const positions = E.computePositions(now);
    const bodies = PLANETS_META.map(function (meta) {
      const pos = positions[meta.key];
      const eq = E.equatorialFromEcliptic(pos.lon, pos.lat, now);
      const aa = E.altAz(eq.ra, eq.dec, now, astroSkymapState.lat, astroSkymapState.lon);
      return { meta: meta, alt: aa.alt, az: aa.az };
    });
    const above = bodies.filter(function (b) { return b.alt > 0; });
    const below = bodies.filter(function (b) { return b.alt <= 0; });

    const cx = 150, cy = 150, r = 130;
    let svg = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#0a1c22" stroke="#1f4a4a" stroke-width="1.5"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.5) + '" fill="none" stroke="#1f4a4a" stroke-width="0.7" stroke-dasharray="3,4"/>';
    const dirs = [['N', 0], ['O', 90], ['S', 180], ['W', 270]];
    dirs.forEach(function (d) {
      const rad = (d[1] - 90) * Math.PI / 180;
      const x = cx + (r + 14) * Math.cos(rad), y = cy + (r + 14) * Math.sin(rad);
      svg += '<text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" font-size="13" fill="#5ed3c9" text-anchor="middle" font-weight="bold">' + d[0] + '</text>';
      const x2 = cx + r * Math.cos(rad), y2 = cy + r * Math.sin(rad);
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#1f4a4a" stroke-width="0.6"/>';
    });
    svg += '<text x="' + cx + '" y="' + (cy + 4) + '" font-size="9" fill="#4f7a78" text-anchor="middle">Zenit</text>';
    above.forEach(function (b) {
      const radius = r * (1 - b.alt / 90);
      const rad = (b.az - 90) * Math.PI / 180;
      const x = cx + radius * Math.cos(rad), y = cy + radius * Math.sin(rad);
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" fill="#0e2626" stroke="#5ed3c9" stroke-width="1"/>';
      svg += '<text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" font-size="12" fill="#eef0fb" text-anchor="middle">' + b.meta.symbol + '</text>';
    });
    svg += '</svg>';

    let html2 = '<div class="chart-wrap">' + svg + '</div>';
    html2 += '<p id="skyTimeLabel" style="text-align:center; font-size:.82rem; color:var(--text-dim); margin:2px 0 6px;">Ansicht für ' + (off === 0 ? 'jetzt' : (off > 0 ? '+' : '') + off + ' Std.') + ' – ' + now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr (deine Geräte-Zeitzone)</p>';
    html2 += '<div class="field" style="margin-bottom:4px;"><input type="range" id="skyTimeSlider" min="-12" max="12" step="1" value="' + off + '" style="width:100%;"></div>';
    html2 += '<div style="display:flex; justify-content:space-between; font-size:.68rem; color:var(--text-faint); margin-bottom:10px;"><span>-12 Std.</span><span>Jetzt</span><span>+12 Std.</span></div>';
    html2 += '<h2 class="section-title">Über dem Horizont (' + above.length + ')</h2>';
    if (!above.length) {
      html2 += '<p class="hint">Aktuell steht kein Planet und weder Sonne noch Mond über dem Horizont dieses Ortes.</p>';
    } else {
      html2 += '<table class="data-table"><thead><tr><th></th><th>Körper</th><th>Höhe</th><th>Richtung</th></tr></thead><tbody>';
      above.sort(function (a, b) { return b.alt - a.alt; }).forEach(function (b) {
        html2 += '<tr><td class="glyph-cell">' + b.meta.symbol + '</td><td>' + esc(b.meta.name) + '</td><td>' + b.alt.toFixed(0) + '°</td><td>' + compassLabel(b.az) + '</td></tr>';
      });
      html2 += '</tbody></table>';
    }
    if (below.length) {
      html2 += '<h2 class="section-title">Unter dem Horizont (' + below.length + ')</h2>';
      html2 += '<p class="hint">' + below.map(function (b) { return b.meta.symbol + ' ' + b.meta.name; }).join(', ') + ' – zu diesem Zeitpunkt nicht sichtbar.</p>';
    }
    html2 += '<div class="disclaimer-box">Vereinfachte Kompassdarstellung ohne Refraktionskorrektur und ohne Berücksichtigung von Horizontverdeckung (Gebäude, Berge, Bäume) oder Dämmerungshelligkeit. Für sehr niedrig stehende Objekte (unter ca. 5°) ist die tatsächliche Sichtbarkeit oft eingeschränkt.</div>';
    box.innerHTML = html2;
    const slider = document.getElementById('skyTimeSlider');
    if (slider) {
      slider.addEventListener('input', function (e) {
        const h = parseInt(e.target.value, 10);
        const label = document.getElementById('skyTimeLabel');
        if (label) label.textContent = 'Ansicht für ' + (h === 0 ? 'jetzt' : (h > 0 ? '+' : '') + h + ' Std.') + ' …';
      });
      slider.addEventListener('change', function (e) {
        astroSkymapState.hourOffset = parseInt(e.target.value, 10);
        renderSkymapResult();
        const s = document.getElementById('skyTimeSlider');
        if (s) s.focus();
      });
    }
  }
  function compassLabel(az) {
    const labels = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
    return labels[Math.round(az / 45) % 8];
  }


  function moonPhaseGlyph(phase) {
    const map = { 'Neumond': '🌑', 'Zunehmende Sichel': '🌒', 'Erstes Viertel': '🌓', 'Zunehmender Mond': '🌔', 'Vollmond': '🌕', 'Abnehmender Mond': '🌖', 'Letztes Viertel': '🌗', 'Abnehmende Sichel': '🌘' };
    return map[phase.phaseName] || '🌙';
  }

  function tile(grad, glyph, title, sub, tabTarget, wide) {
    return '<div class="tile' + (wide ? ' wide' : '') + '" data-goto="' + tabTarget + '">' +
      '<div class="tile-badge" style="background:var(--' + grad + ')">' + glyph + '</div>' +
      '<div><div class="tile-title">' + esc(title) + '</div><div class="tile-sub">' + esc(sub) + '</div></div></div>';
  }
  function bindTiles(containerId) {
    document.getElementById(containerId).querySelectorAll('[data-goto]').forEach(function (el) {
      el.addEventListener('click', function () { navigate(el.dataset.goto); });
    });
  }

  function profileRowHTML(p, context) {
    const dateStr = p.date.split('-').reverse().join('.');
    return '<div class="profile-row" data-id="' + p.id + '">' +
      '<div><div class="pname">' + esc(p.label) + '</div><div class="pmeta">' + dateStr + (p.timeUnknown ? '' : ', ' + esc(p.time) + ' Uhr') + ' · ' + esc(p.place || '') + '</div></div>' +
      '<div class="pactions"><button class="icon-btn" data-act="open" data-ctx="' + context + '">→</button>' +
      '<button class="icon-btn" data-act="del">🗑</button></div></div>';
  }
  function bindProfileRows(container, defaultCtx) {
    container.querySelectorAll('.profile-row').forEach(function (row) {
      const id = row.dataset.id;
      row.querySelectorAll('[data-act="open"]').forEach(function (b) {
        b.addEventListener('click', function () {
          const ctx = b.dataset.ctx || defaultCtx;
          if (ctx === 'chart') { chartState = { view: 'result', activeId: id }; navigate('chart'); }
        });
      });
      row.querySelectorAll('[data-act="del"]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (confirm('Dieses Profil wirklich löschen?')) { deleteProfile(id); toast('Profil gelöscht'); renderTab(currentTabName()); }
        });
      });
    });
  }
  function currentTabName() {
    const active = document.querySelector('section.tab.active');
    return active ? active.id.replace('tab-', '') : 'start';
  }

  /* ---------------------------------------------------------------
     TAGESHOROSKOP
     --------------------------------------------------------------- */
  let selectedHoroskopSign = 0;
  function renderHoroskop() {
    const grid = document.getElementById('horoskopSignGrid');
    grid.innerHTML = SIGNS_META.map(function (s, i) {
      return '<div class="sign-tile' + (i === selectedHoroskopSign ? ' selected' : '') + '" data-idx="' + i + '"><span class="glyph">' + s.symbol + '</span><span class="name">' + E.SIGNS[i] + '</span></div>';
    }).join('');
    grid.querySelectorAll('.sign-tile').forEach(function (t) {
      t.addEventListener('click', function () { selectedHoroskopSign = parseInt(t.dataset.idx, 10); renderHoroskop(); });
    });
    renderHoroskopResult(selectedHoroskopSign);
  }
  function renderHoroskopResult(idx) {
    const now = new Date();
    const dateKey = localDateKey(now);
    const rand = seededRand(dateKey + '-astrowahr-' + idx);
    const meta = SIGNS_META[idx];
    const pool = ELEMENT_POOLS[meta.element];
    const impulsText = pool[Math.floor(rand() * pool.length)];
    const focus = FOCUS_AREAS[Math.floor(rand() * FOCUS_AREAS.length)];

    const positions = E.computePositions(now);
    const sunSign = E.lonToSign(positions.sonne.lon);
    const moonSign = E.lonToSign(positions.mond.lon);
    let sonnenSaison = '';
    if (sunSign.index === idx) {
      sonnenSaison = '<div class="disclaimer-box" style="border-color:rgba(184,146,255,.35); background:rgba(184,146,255,.08);">☉ Du hast gerade Sonnensaison – ein besonders guter Zeitraum für Neuanfänge in deinem Bereich.</div>';
    }

    document.getElementById('horoskopResult').innerHTML =
      '<div class="card">' +
      '<div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;"><span style="font-size:1.8rem;">' + meta.symbol + '</span><div><div style="font-weight:700;">' + glossLink('sign:' + idx, E.SIGNS[idx]) + '</div><div class="pmeta" style="color:var(--text-dim); font-size:.78rem;">' + glossLink('element:' + meta.element, meta.element) + ' · ' + glossLink('quality:' + meta.quality, meta.quality) + ' · Herrscher ' + glossLink('planet:' + (RULER_TO_PLANET_KEY[meta.ruler] || ''), meta.ruler) + '</div></div></div>' +
      '<p style="font-size:.9rem; line-height:1.5;">' + esc(meta.traits) + '</p>' +
      '<p style="font-size:.9rem; line-height:1.5;"><b>Heutiger Impuls:</b> ' + esc(impulsText) + '</p>' +
      '<p style="font-size:.85rem; color:var(--text-dim);"><b>Fokus heute:</b> ' + esc(focus) + '</p>' +
      '<p style="font-size:.78rem; color:var(--text-faint);">Der Mond steht heute real in ' + glossLink('sign:' + moonSign.index, E.SIGNS[moonSign.index]) + ' (' + fmtDeg(moonSign.degree) + ').</p>' +
      sonnenSaison +
      '</div>' +
      '<div class="disclaimer-box">Astrologische Impulse dienen der Unterhaltung und Selbstreflexion – sie ersetzen keine medizinische, psychologische, rechtliche oder finanzielle Beratung.</div>';
  }

  /* ---------------------------------------------------------------
     GEBURTSHOROSKOP (Chart)
     --------------------------------------------------------------- */
  function renderChart() {
    const root = document.getElementById('chartRoot');
    if (chartState.view === 'form') { renderChartForm(root); return; }
    if (chartState.view === 'result' && chartState.activeId) { renderChartResult(root, chartState.activeId); return; }
    renderChartList(root);
  }

  function renderChartList(root) {
    const profiles = getProfiles();
    let html = '<h2 class="section-title">Geburtshoroskope</h2>';
    html += '<p class="hint">Lege ein Geburtshoroskop mit Datum, Uhrzeit und Geburtsort an – die Planetenpositionen werden direkt auf deinem Gerät berechnet.</p>';
    html += '<button class="btn" id="chartNewBtn">+ Neues Geburtshoroskop</button>';
    if (profiles.length) {
      html += '<h2 class="section-title">Gespeichert</h2>';
      html += profiles.slice().reverse().map(function (p) { return profileRowHTML(p, 'chart'); }).join('');
    } else {
      html += '<div class="empty-state" style="margin-top:20px;"><span class="glyph">🪐</span>Noch keine Profile vorhanden.</div>';
    }
    root.innerHTML = html;
    document.getElementById('chartNewBtn').addEventListener('click', function () { chartState = { view: 'form', activeId: null }; navigate('chart'); });
    bindProfileRows(root, 'chart');
  }

  function renderChartForm(root) {
    const offsets = OFFSET_PRESETS.concat(buildFullOffsetList());
    const editing = !!chartState.editId;
    const existing = editing ? getProfile(chartState.editId) : null;
    let html = '<button class="btn ghost small" id="chartBackBtn" style="margin-bottom:12px;">← Zurück</button>';
    html += '<h2 class="section-title">' + (editing ? 'Geburtshoroskop bearbeiten' : 'Neues Geburtshoroskop') + '</h2>';
    html += '<div class="field"><label>Bezeichnung (z. B. dein Name)</label><input type="text" id="fLabel" placeholder="z. B. Jan" autocomplete="off" data-lpignore="true" value="' + esc(existing ? existing.label : '') + '"></div>';
    html += '<div class="field"><label>Geburtsdatum</label><input type="date" id="fDate" value="' + (existing ? existing.date : '') + '"></div>';
    html += '<div class="checkbox-row"><input type="checkbox" id="fTimeUnknown" ' + (existing && existing.timeUnknown ? 'checked' : '') + '><label for="fTimeUnknown">Geburtszeit unbekannt (dann ohne Aszendent/Häuser)</label></div>';
    html += '<div class="field" id="fTimeField" style="display:' + (existing && existing.timeUnknown ? 'none' : 'block') + ';"><label>Geburtsuhrzeit</label><input type="time" id="fTime" value="' + (existing && existing.time ? existing.time : '') + '"></div>';
    const fOffsetDefault = existing ? existing.utcOffset : euDefaultOffset(existing ? existing.date : localDateKey(new Date()));
    html += '<div class="field"><label>Zeitzone bei der Geburt</label><select id="fOffset">' + offsets.map(function (o) { return '<option value="' + o.value + '"' + (fOffsetDefault === o.value ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select></div>';
    html += '<div class="field"><label>Geburtsort (Tippen zum Suchen oder frei eintragen)</label><input type="text" id="fPlace" list="cityList" placeholder="z. B. Tangstedt oder eigener Ortsname" autocomplete="off" value="' + esc(existing ? existing.place || '' : '') + '"><datalist id="cityList">' + CITY_PRESETS.map(function (c) { return '<option value="' + esc(c.name) + '">'; }).join('') + '</datalist></div>';
    html += '<div class="field"><div class="row2"><div><label>Breitengrad (Lat)</label><input type="number" step="0.0001" id="fLat" placeholder="z. B. 53.7167" value="' + (existing ? existing.lat : '') + '"></div><div><label>Längengrad (Lon)</label><input type="number" step="0.0001" id="fLon" placeholder="z. B. 10.0333" value="' + (existing ? existing.lon : '') + '"></div></div></div>';
    html += '<p class="hint">Ort per Tastatur eingeben – bei bekannten Städten erscheinen Vorschläge mit automatischen Koordinaten, jede andere Ortsangabe kannst du frei eintippen und die Koordinaten manuell ergänzen (z. B. von einer Karten-App).</p>';
    html += '<p class="hint">Ohne genaue Uhrzeit lassen sich Aszendent, Häuser und die exakte Mondposition nicht zuverlässig berechnen – Sonnenzeichen und die meisten Planetenzeichen bleiben aber gültig.</p>';
    html += '<button class="btn" id="fSubmit">' + (editing ? 'Änderungen speichern' : 'Berechnen & speichern') + '</button>';
    root.innerHTML = html;

    document.getElementById('chartBackBtn').addEventListener('click', function () {
      chartState = editing ? { view: 'result', activeId: chartState.editId } : { view: 'list', activeId: null };
      navigate('chart');
    });
    document.getElementById('fTimeUnknown').addEventListener('change', function (e) {
      document.getElementById('fTimeField').style.display = e.target.checked ? 'none' : 'block';
    });
    if (!editing) {
      document.getElementById('fDate').addEventListener('change', function (e) {
        const offsetSelect = document.getElementById('fOffset');
        const prevDefault = euDefaultOffset(offsetSelect.dataset.lastDate || '');
        const wasAutoValue = offsetSelect.dataset.lastDate === undefined || parseFloat(offsetSelect.value) === prevDefault;
        if (wasAutoValue) offsetSelect.value = euDefaultOffset(e.target.value);
        offsetSelect.dataset.lastDate = e.target.value;
      });
    }
    document.getElementById('fPlace').addEventListener('input', function (e) {
      const match = CITY_PRESETS.find(function (c) { return c.name.toLowerCase() === e.target.value.trim().toLowerCase(); });
      if (match) { document.getElementById('fLat').value = match.lat; document.getElementById('fLon').value = match.lon; }
    });
    document.getElementById('fSubmit').addEventListener('click', function () {
      const label = document.getElementById('fLabel').value.trim() || 'Ohne Namen';
      const date = document.getElementById('fDate').value;
      const timeUnknown = document.getElementById('fTimeUnknown').checked;
      const time = document.getElementById('fTime').value;
      const offset = parseFloat(document.getElementById('fOffset').value);
      const lat = parseFloat(document.getElementById('fLat').value);
      const lon = parseFloat(document.getElementById('fLon').value);
      const place = document.getElementById('fPlace').value.trim();
      if (!date) { toast('Bitte ein Geburtsdatum angeben'); return; }
      if (!timeUnknown && !time) { toast('Bitte eine Uhrzeit angeben oder "unbekannt" wählen'); return; }
      if (isNaN(lat) || isNaN(lon)) { toast('Bitte Breiten- und Längengrad angeben'); return; }
      const data = { label: label, date: date, time: timeUnknown ? null : time, timeUnknown: timeUnknown, utcOffset: offset, lat: lat, lon: lon, place: place };
      let p;
      if (editing) { p = updateProfile(chartState.editId, data); toast('Änderungen gespeichert'); }
      else { p = addProfile(data); toast('Gespeichert'); }
      chartState = { view: 'result', activeId: p.id };
      navigate('chart');
    });
  }

  function renderChartResult(root, id) {
    const p = getProfile(id);
    if (!p) { chartState = { view: 'list', activeId: null }; renderChartList(root); return; }
    const chart = computeChart(p);
    let html = '<button class="btn ghost small" id="chartBackBtn2" style="margin-bottom:12px;">← Zurück</button>';
    html += '<h2 class="section-title">' + esc(p.label) + '</h2>';
    html += '<p class="hint">' + p.date.split('-').reverse().join('.') + (p.timeUnknown ? ' · Uhrzeit unbekannt' : ' · ' + p.time + ' Uhr') + ' · ' + esc(p.place || '') + '</p>';
    html += '<div class="chart-wrap">' + buildWheelSVG(chart) + '</div>';
    html += '<div style="text-align:center;"><button class="zoom-btn" id="chartZoomBtn">🔍 Chart vergrößern</button></div>';
    if (p.timeUnknown) html += '<div class="disclaimer-box">Ohne Geburtszeit werden Aszendent, Häuser und die Mondposition nur näherungsweise angezeigt (auf 12:00 Uhr berechnet).</div>';

    html += '<h2 class="section-title">Planeten</h2>';
    html += '<table class="data-table"><thead><tr><th></th><th>Planet</th><th>Zeichen</th><th>Grad</th>' + (chart.houses ? '<th>Haus ' + infoBtn('general:haussystem') + '</th>' : '') + '</tr></thead><tbody>';
    chart.planets.forEach(function (pl) {
      html += '<tr><td class="glyph-cell">' + pl.meta.symbol + '</td><td>' + glossLink('planet:' + pl.key, pl.meta.name) + '</td><td>' + SIGNS_META[pl.sign.index].symbol + ' ' + glossLink('sign:' + pl.sign.index, pl.sign.sign) + '</td><td>' + fmtDeg(pl.sign.degree) + '</td>' + (chart.houses ? '<td>' + (pl.house ? glossLink('house:' + pl.house, String(pl.house)) : '–') + '</td>' : '') + '</tr>';
    });
    if (chart.asc !== null) {
      const ascSign = E.lonToSign(chart.asc), mcSign = E.lonToSign(chart.mc);
      html += '<tr><td class="glyph-cell">AC</td><td>' + glossLink('general:aszendent', 'Aszendent') + '</td><td>' + SIGNS_META[ascSign.index].symbol + ' ' + glossLink('sign:' + ascSign.index, ascSign.sign) + '</td><td>' + fmtDeg(ascSign.degree) + '</td><td>1</td></tr>';
      html += '<tr><td class="glyph-cell">MC</td><td>' + glossLink('general:mc', 'Medium Coeli') + '</td><td>' + SIGNS_META[mcSign.index].symbol + ' ' + glossLink('sign:' + mcSign.index, mcSign.sign) + '</td><td>' + fmtDeg(mcSign.degree) + '</td><td>10</td></tr>';
    }
    html += '</tbody></table>';

    html += '<h2 class="section-title">Aspekte (' + chart.aspects.length + ') ' + infoBtn('general:orb') + '</h2>';
    if (chart.aspects.length) html += '<p class="hint">Sortiert nach Orb – die exaktesten Aspekte stehen oben.</p>';
    if (!chart.aspects.length) {
      html += '<p class="hint">Keine Aspekte innerhalb der verwendeten Orben gefunden.</p>';
    } else {
      html += '<div class="card">' + chart.aspects.map(function (item) {
        const text = aspectConnector(item.aspect.name, capitalize(item.a.meta.short), item.b.meta.short);
        return '<div class="aspect-row"><div class="aspect-symbol">' + item.aspect.symbol + '</div><div class="aspect-text"><b>' + glossLink('planet:' + item.a.key, item.a.meta.name) + ' ' + glossLink('aspect:' + item.aspect.name, item.aspect.name) + ' ' + glossLink('planet:' + item.b.key, item.b.meta.name) + '</b><br>' + esc(text) + '<div class="aspect-meta">Orb ' + item.aspect.orb.toFixed(1) + '°</div></div></div>';
      }).join('') + '</div>';
    }

    html += '<div class="field row2" style="display:flex; gap:10px; margin-top:6px;">';
    html += '<button class="btn secondary" id="chartEditBtn">Bearbeiten</button>';
    html += '<button class="btn danger" id="chartDelBtn">Löschen</button></div>';
    root.innerHTML = html;
    document.getElementById('chartBackBtn2').addEventListener('click', function () { chartState = { view: 'list', activeId: null }; navigate('chart'); });
    document.getElementById('chartEditBtn').addEventListener('click', function () { chartState = { view: 'form', activeId: null, editId: id }; navigate('chart'); });
    document.getElementById('chartZoomBtn').addEventListener('click', function () { openImageModal(buildWheelSVG(chart)); });
    document.getElementById('chartDelBtn').addEventListener('click', function () {
      if (confirm('Dieses Profil wirklich löschen?')) { deleteProfile(id); chartState = { view: 'list', activeId: null }; navigate('chart'); toast('Profil gelöscht'); }
    });
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------------------------------------------------------------
     TRANSITE
     --------------------------------------------------------------- */
  function renderTransite() {
    const root = document.getElementById('transiteRoot');
    const profiles = getProfiles();
    let html = '<h2 class="section-title">Transite</h2>';
    html += '<p class="hint">Vergleicht die aktuellen Planetenstände mit deinem Geburtshoroskop und zeigt, welche Aspekte gerade aktiv sind.</p>';
    if (!profiles.length) {
      html += '<div class="empty-state"><span class="glyph">🌠</span>Lege zuerst im Chart-Tab ein Geburtshoroskop an.</div>';
      root.innerHTML = html; return;
    }
    html += '<div class="pill-select" id="transitePills">' + profiles.map(function (p) {
      return '<div class="pill' + (p.id === transiteState.activeId ? ' active' : '') + '" data-id="' + p.id + '">' + esc(p.label) + '</div>';
    }).join('') + '</div>';
    html += '<div id="transiteResult"></div>';
    root.innerHTML = html;
    root.querySelectorAll('.pill').forEach(function (pill) {
      pill.addEventListener('click', function () { transiteState.activeId = pill.dataset.id; renderTransite(); });
    });
    if (!transiteState.activeId && profiles.length) transiteState.activeId = profiles[profiles.length - 1].id;
    if (transiteState.activeId) renderTransiteResult(transiteState.activeId);
  }

  function renderTransiteResult(id) {
    const box = document.getElementById('transiteResult');
    if (!box) return;
    const p = getProfile(id);
    if (!p) return;
    const natal = computeChart(p);
    const now = new Date();
    const transitPositions = E.computePositions(now);
    const transitPlanets = PLANETS_META.map(function (meta) {
      const pos = transitPositions[meta.key];
      return { meta: meta, lon: pos.lon, sign: E.lonToSign(pos.lon) };
    });

    const hits = [];
    transitPlanets.forEach(function (tp) {
      natal.planets.forEach(function (np) {
        const a = E.findAspect(tp.lon, np.lon, 0.4);
        if (a) hits.push({ tp: tp, np: np, aspect: a });
      });
    });
    hits.sort(function (x, y) { return x.aspect.orb - y.aspect.orb; });

    let html = '<h2 class="section-title">Aktuelle Stellungen</h2>';
    html += '<table class="data-table"><thead><tr><th></th><th>Planet</th><th>Zeichen</th><th>Grad</th></tr></thead><tbody>';
    transitPlanets.forEach(function (tp) {
      html += '<tr><td class="glyph-cell">' + tp.meta.symbol + '</td><td>' + tp.meta.name + '</td><td>' + SIGNS_META[tp.sign.index].symbol + ' ' + tp.sign.sign + '</td><td>' + fmtDeg(tp.sign.degree) + '</td></tr>';
    });
    html += '</tbody></table>';

    html += '<h2 class="section-title">Aktive Transit-Aspekte (' + hits.length + ') ' + infoBtn('general:transit') + '</h2>';
    if (hits.length) html += '<p class="hint">Sortiert nach Orb, mit engerem Toleranzbereich als im Geburtshoroskop.</p>';
    if (!hits.length) {
      html += '<p class="hint">Aktuell steht kein transitierender Planet in engem Aspekt (enger Orb) zu einem Geburtsplaneten.</p>';
    } else {
      html += '<div class="card">' + hits.map(function (h) {
        const text = aspectConnector(h.aspect.name, capitalize(h.tp.meta.art + ' transitierende ' + h.tp.meta.name), h.np.meta.short + ' im Geburtshoroskop');
        return '<div class="aspect-row"><div class="aspect-symbol">' + h.aspect.symbol + '</div><div class="aspect-text"><b>Transit-' + glossLink('planet:' + h.tp.meta.key, h.tp.meta.name) + ' ' + glossLink('aspect:' + h.aspect.name, h.aspect.name) + ' Geburts-' + glossLink('planet:' + h.np.meta.key, h.np.meta.name) + '</b><br>' + esc(text) + '<div class="aspect-meta">Orb ' + h.aspect.orb.toFixed(1) + '°</div></div></div>';
      }).join('') + '</div>';
    }
    html += '<div class="disclaimer-box">Transite zeigen aktuelle astronomische Stellungen im Vergleich zu deinem Geburtshoroskop – sie dienen der Reflexion, nicht der Vorhersage konkreter Ereignisse.</div>';
    box.innerHTML = html;
  }

  /* ---------------------------------------------------------------
     KOMPATIBILITÄT (Synastrie)
     --------------------------------------------------------------- */
  function renderKompat() {
    const root = document.getElementById('kompatRoot');
    const profiles = getProfiles();
    let html = '<h2 class="section-title">Kompatibilität</h2>';
    html += '<p class="hint">Vergleicht zwei gespeicherte Geburtshoroskope (Synastrie) und zeigt die Aspekte zwischen beiden Planetenbildern.</p>';
    if (profiles.length < 2) {
      html += '<div class="empty-state"><span class="glyph">💞</span>Für einen Vergleich werden zwei gespeicherte Geburtshoroskope benötigt.<br>Lege sie im Chart-Tab an.</div>';
      root.innerHTML = html; return;
    }
    html += '<div class="field"><label>Person A</label><select id="kA">' + profiles.map(function (p) { return '<option value="' + p.id + '">' + esc(p.label) + '</option>'; }).join('') + '</select></div>';
    html += '<div class="field"><label>Person B</label><select id="kB">' + profiles.map(function (p) { return '<option value="' + p.id + '">' + esc(p.label) + '</option>'; }).join('') + '</select></div>';
    html += '<button class="btn" id="kCompute">Vergleichen</button>';
    html += '<div id="kompatResult"></div>';
    root.innerHTML = html;
    if (kompatState.idA) document.getElementById('kA').value = kompatState.idA;
    if (kompatState.idB) document.getElementById('kB').value = kompatState.idB;
    else document.getElementById('kB').selectedIndex = Math.min(1, profiles.length - 1);
    document.getElementById('kCompute').addEventListener('click', function () {
      kompatState.idA = document.getElementById('kA').value;
      kompatState.idB = document.getElementById('kB').value;
      renderKompatResult();
    });
    if (kompatState.idA && kompatState.idB) renderKompatResult();
  }

  function renderKompatResult() {
    const box = document.getElementById('kompatResult');
    if (!box) return;
    const pA = getProfile(kompatState.idA), pB = getProfile(kompatState.idB);
    if (!pA || !pB) return;
    if (pA.id === pB.id) { box.innerHTML = '<p class="hint">Bitte zwei unterschiedliche Profile wählen.</p>'; return; }
    const cA = computeChart(pA), cB = computeChart(pB);
    const hits = [];
    cA.planets.forEach(function (a) {
      cB.planets.forEach(function (b) {
        const asp = E.findAspect(a.lon, b.lon, 0.75);
        if (asp) hits.push({ a: a, b: b, aspect: asp });
      });
    });
    hits.sort(function (x, y) { return x.aspect.orb - y.aspect.orb; });
    const top = hits.slice(0, 16);

    let html = '<h2 class="section-title">' + esc(pA.label) + ' & ' + esc(pB.label) + '</h2>';
    html += '<div class="card"><table class="data-table"><tbody>' +
      '<tr><td>' + esc(pA.label) + '</td><td>' + SIGNS_META[cA.planets[0].sign.index].symbol + ' Sonne in ' + cA.planets[0].sign.sign + '</td><td>' + SIGNS_META[cA.planets[1].sign.index].symbol + ' Mond in ' + cA.planets[1].sign.sign + '</td></tr>' +
      '<tr><td>' + esc(pB.label) + '</td><td>' + SIGNS_META[cB.planets[0].sign.index].symbol + ' Sonne in ' + cB.planets[0].sign.sign + '</td><td>' + SIGNS_META[cB.planets[1].sign.index].symbol + ' Mond in ' + cB.planets[1].sign.sign + '</td></tr>' +
      '</tbody></table></div>';

    html += '<h2 class="section-title">Stärkste Verbindungen (' + top.length + ' von ' + hits.length + ') ' + infoBtn('general:synastrie') + '</h2>';
    html += '<p class="hint">Sortiert nach Orb – die exaktesten Aspekte zwischen beiden Charts stehen oben.</p>';
    if (!top.length) {
      html += '<p class="hint">Innerhalb der verwendeten Orben wurden keine Aspekte zwischen beiden Charts gefunden.</p>';
    } else {
      html += '<div class="card">' + top.map(function (h) {
        const text = aspectConnector(h.aspect.name, esc(pA.label) + 's ' + h.a.meta.noun, esc(pB.label) + 's ' + h.b.meta.noun);
        return '<div class="aspect-row"><div class="aspect-symbol">' + h.aspect.symbol + '</div><div class="aspect-text"><b>' + glossLink('planet:' + h.a.key, h.a.meta.name) + ' ' + glossLink('aspect:' + h.aspect.name, h.aspect.name) + ' ' + glossLink('planet:' + h.b.key, h.b.meta.name) + '</b><br>' + text + '<div class="aspect-meta">Orb ' + h.aspect.orb.toFixed(1) + '°</div></div></div>';
      }).join('') + '</div>';
    }
    html += '<div class="disclaimer-box">Synastrie beschreibt astrologische Resonanzen zwischen zwei Menschen – sie ist eine Reflexionshilfe, kein Urteil über eine Beziehung.</div>';
    box.innerHTML = html;
  }

  /* ---------------------------------------------------------------
     MONDKALENDER
     --------------------------------------------------------------- */
  function renderMond() {
    const root = document.getElementById('mondRoot');
    const now = new Date();
    const phase = E.moonPhase(now);
    const positions = E.computePositions(now);
    const moonSign = E.lonToSign(positions.mond.lon);

    // nächster Voll-/Neumond suchen (Tagesschritte)
    function findNext(targetAgeLow, targetAgeHigh) {
      for (let i = 0; i < 40; i++) {
        const d = new Date(now.getTime() + i * 86400000);
        const ph = E.moonPhase(d);
        if (ph.age >= targetAgeLow && ph.age <= targetAgeHigh) return d;
      }
      return null;
    }
    const nextFull = findNext(14.5, 15.5);
    const nextNew = phase.age < 1 ? now : findNext(0, 0.9) || findNext(29, 29.6);

    let html = '<h2 class="section-title">Mondkalender</h2>';
    html += '<div class="card" style="text-align:center;">' +
      '<div style="font-size:3.4rem; line-height:1;">' + moonPhaseGlyph(phase) + '</div>' +
      '<div style="font-weight:700; font-size:1.1rem; margin-top:6px;">' + esc(phase.phaseName) + '</div>' +
      '<div class="pmeta" style="color:var(--text-dim); font-size:.82rem; margin-top:4px;">Zyklustag ' + Math.floor(phase.age) + ' von ' + phase.synodic.toFixed(1) + ' · Beleuchtung ' + (phase.illumination * 100).toFixed(0) + '%</div>' +
      '<div class="pmeta" style="color:var(--text-dim); font-size:.82rem;">Mond aktuell in ' + SIGNS_META[moonSign.index].symbol + ' ' + moonSign.sign + ' (' + fmtDeg(moonSign.degree) + ')</div>' +
      '</div>';

    html += '<div class="bento">' +
      '<div class="tile"><div class="tile-title">🌕 Nächster Vollmond</div><div class="tile-sub">' + (nextFull ? nextFull.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' }) : '–') + '</div></div>' +
      '<div class="tile"><div class="tile-title">🌑 Nächster Neumond</div><div class="tile-sub">' + (nextNew ? nextNew.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' }) : '–') + '</div></div>' +
      '</div>';

    html += '<h2 class="section-title">Nächste 7 Tage</h2><div class="card">';
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      const ph = E.moonPhase(d);
      html += '<div class="aspect-row"><div class="aspect-symbol">' + moonPhaseGlyph(ph) + '</div><div class="aspect-text"><b>' + d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }) + '</b> – ' + esc(ph.phaseName) + '<div class="aspect-meta">Beleuchtung ' + (ph.illumination * 100).toFixed(0) + '%</div></div></div>';
    }
    html += '</div>';
    html += '<p class="hint">Die Mondphase ist rein astronomisch (Erdschatten/Beleuchtungswinkel) und global identisch – kein Standortbezug nötig.</p>';
    root.innerHTML = html;
  }

  /* ---------------------------------------------------------------
     ASTRO-LEXIKON (Anzeige)
     --------------------------------------------------------------- */
  let astrolexState = { filter: '', cat: 'all', openId: null };
  const ASTROLEX_CATS = [['all', 'Alle'], ['planet', 'Planeten'], ['sign', 'Zeichen'], ['house', 'Häuser'], ['aspect', 'Aspekte'], ['grund', 'Grundlagen']];
  function renderAstrolex() {
    const root = document.getElementById('astrolexRoot');
    let html = '<h2 class="section-title">Astro-Lexikon</h2>';
    html += '<p class="hint">Nachschlagewerk für Planeten, Zeichen, Häuser und Aspekte – auch direkt aus deinem Chart über die kleinen ⓘ-Symbole und unterstrichenen Begriffe erreichbar.</p>';
    html += '<div class="field"><input type="text" id="axSearch" placeholder="Begriff suchen…" autocomplete="off" value="' + esc(astrolexState.filter) + '"></div>';
    html += '<div class="pill-select">' + ASTROLEX_CATS.map(function (c) {
      return '<div class="pill' + (astrolexState.cat === c[0] ? ' active' : '') + '" data-cat="' + c[0] + '">' + c[1] + '</div>';
    }).join('') + '</div>';

    if (astrolexState.openId) {
      const g = glossaryEntry(astrolexState.openId);
      if (g) {
        html += '<button class="btn ghost small" id="axBackBtn" style="margin:8px 0;">← Zur Übersicht</button>';
        html += '<div class="card"><div style="font-size:1.6rem; margin-bottom:6px;">' + g.symbol + '</div><h2 class="section-title" style="margin-top:0;">' + esc(g.title) + '</h2><p style="font-size:.9rem; line-height:1.65; color:var(--text-dim);">' + esc(g.body) + '</p></div>';
        root.innerHTML = html;
        bindAstrolexControls(root);
        document.getElementById('axBackBtn').addEventListener('click', function () { astrolexState.openId = null; renderAstrolex(); });
        return;
      }
    }

    const isStart = astrolexState.cat === 'all' && !astrolexState.filter;
    if (isStart) {
      html += '<div class="bento">' + ASTROLEX_CATS.slice(1).map(function (c) {
        const count = ASTRO_GLOSSARY.filter(function (g) { return c[0] === 'grund' ? (g.cat === 'general' || g.cat === 'element' || g.cat === 'quality') : g.cat === c[0]; }).length;
        const grad = c[0] === 'planet' ? 'grad-1' : c[0] === 'sign' ? 'grad-2' : c[0] === 'house' ? 'grad-3' : c[0] === 'aspect' ? 'grad-1' : 'grad-3';
        return '<div class="tile" data-open-cat="' + c[0] + '"><div class="tile-badge" style="background:var(--' + grad + ');">✦</div><div><div class="tile-title">' + c[1] + '</div><div class="tile-sub">' + count + ' Einträge</div></div></div>';
      }).join('') + '</div>';
      root.innerHTML = html;
      bindAstrolexControls(root);
      root.querySelectorAll('[data-open-cat]').forEach(function (t) {
        t.addEventListener('click', function () { astrolexState.cat = t.getAttribute('data-open-cat'); renderAstrolex(); });
      });
      return;
    }

    const q = astrolexState.filter.toLowerCase();
    const filtered = ASTRO_GLOSSARY.filter(function (g) {
      const catMatch = astrolexState.cat === 'all' ? true : (astrolexState.cat === 'grund' ? (g.cat === 'general' || g.cat === 'element' || g.cat === 'quality') : g.cat === astrolexState.cat);
      if (!catMatch) return false;
      if (!q) return true;
      return g.title.toLowerCase().indexOf(q) !== -1 || g.body.toLowerCase().indexOf(q) !== -1;
    });
    html += '<div class="card">' + filtered.map(function (g) {
      return '<div class="aspect-row" data-open="' + g.id + '" style="cursor:pointer;"><div class="aspect-symbol">' + g.symbol + '</div><div class="aspect-text"><b>' + esc(g.title) + '</b><br><span style="color:var(--text-faint); font-size:.78rem;">' + esc(g.body.slice(0, 70)) + '…</span></div></div>';
    }).join('') + '</div>';
    if (!filtered.length) html += '<div class="empty-state"><span class="glyph">🔍</span>Keine Treffer.</div>';
    root.innerHTML = html;
    bindAstrolexControls(root);
    root.querySelectorAll('[data-open]').forEach(function (row) {
      row.addEventListener('click', function () { astrolexState.openId = row.dataset.open; renderAstrolex(); });
    });
  }
  function bindAstrolexControls(root) {
    const search = document.getElementById('axSearch');
    if (search) search.addEventListener('input', function (e) {
      const pos = e.target.selectionStart;
      astrolexState.filter = e.target.value;
      renderAstrolex();
      const el = document.getElementById('axSearch');
      if (el) { el.focus(); el.setSelectionRange(pos, pos); }
    });
    root.querySelectorAll('[data-cat]').forEach(function (p) {
      p.addEventListener('click', function () { astrolexState.cat = p.dataset.cat; astrolexState.openId = null; renderAstrolex(); });
    });
  }

  /* ---------------------------------------------------------------
     MEHR
     --------------------------------------------------------------- */
  function renderMehr() {
    document.getElementById('mehrBento').innerHTML =
      tile('grad-2', '📖', 'Anleitung', 'Begriffe, Sitemap & Funktionsweise erklärt', 'anleitung') +
      tile('grad-1', '⚙️', 'Einstellungen', 'Backup, Profile, Erscheinungsbild', 'einstellungen') +
      tile('grad-3', '📜', 'Rechtliches', 'Impressum & Datenschutz', 'rechtliches');
    bindTiles('mehrBento');
  }

  /* ---------------------------------------------------------------
     TAROT – Start, Legen, Lexikon
     --------------------------------------------------------------- */
  const TAROT_STORAGE = { favorites: 'astrowahr.tarot.favorites', stats: 'astrowahr.tarot.stats' };
  const TAROT_SPREADS = {
    tage: { label: 'Tageskarte', desc: 'Eine einzelne Karte als Impuls für den Tag – gut geeignet, um morgens kurz innezuhalten, ohne eine konkrete Frage zu stellen.', positions: ['Impuls für heute'] },
    drei: { label: 'Drei-Karten', desc: 'Die klassische Universallegung: die 1. Karte zeigt die aktuelle Situation, die 2. Karte die Herausforderung darin, die 3. Karte einen Rat oder möglichen nächsten Schritt. Passt auf fast jede Frage.', positions: ['Situation', 'Herausforderung', 'Rat'] },
    kreuz: { label: 'Keltisches Kreuz', desc: 'Die ausführlichste Legung mit zehn Karten für eine vielschichtige Betrachtung einer Lebenslage – von der Gegenwart über Vergangenheit und nahe Zukunft bis zum möglichen Ergebnis. Nimm dir dafür etwas mehr Zeit.', positions: ['Gegenwärtige Situation', 'Herausforderung', 'Bewusste Grundlage', 'Unbewusste Grundlage', 'Vergangenheit', 'Nahe Zukunft', 'Deine Haltung', 'Umfeld & Einflüsse', 'Hoffnung oder Furcht', 'Ergebnis'] }
  };
  function tarotFavorites() { try { return JSON.parse(localStorage.getItem(TAROT_STORAGE.favorites) || '[]'); } catch (e) { return []; } }
  function tarotToggleFavorite(id) {
    let favs = tarotFavorites();
    if (favs.indexOf(id) === -1) favs.push(id); else favs = favs.filter(function (x) { return x !== id; });
    localStorage.setItem(TAROT_STORAGE.favorites, JSON.stringify(favs));
  }
  function tarotStats() { try { return JSON.parse(localStorage.getItem(TAROT_STORAGE.stats) || '{}'); } catch (e) { return {}; } }
  function tarotBumpStats(patch) {
    const s = Object.assign({ draws: 0 }, tarotStats());
    Object.keys(patch).forEach(function (k) { s[k] = (s[k] || 0) + patch[k]; });
    localStorage.setItem(TAROT_STORAGE.stats, JSON.stringify(s));
    return s;
  }

  function renderTarot() {
    const root = document.getElementById('tarotRoot');
    let html = '<div class="pill-select" id="tarotPills">' +
      ['start', 'legen', 'lexikon'].map(function (v) {
        const labels = { start: '✦ Start', legen: '🔮 Legen', lexikon: '📚 Lexikon' };
        return '<div class="pill' + (tarotState.view === v ? ' active' : '') + '" data-view="' + v + '">' + labels[v] + '</div>';
      }).join('') + '</div>';
    html += '<div id="tarotSub"></div>';
    root.innerHTML = html;
    root.querySelectorAll('.pill').forEach(function (p) {
      p.addEventListener('click', function () { tarotState.view = p.dataset.view; renderTarot(); });
    });
    if (tarotState.view === 'legen') renderTarotLegen();
    else if (tarotState.view === 'lexikon') renderTarotLexikon();
    else renderTarotStart();
  }

  function renderTarotStart() {
    const box = document.getElementById('tarotSub');
    const stats = Object.assign({ draws: 0 }, tarotStats());
    let html = '<div class="hero-card" style="padding:18px;">';
    html += '<div style="font-weight:700; font-size:1.1rem; margin-bottom:6px;">🃏 Tarot</div>';
    html += '<p style="font-size:.88rem; color:#a6adcf; line-height:1.6; margin:0;">' + glossaryEntry('general:tarot').body + ' ' + glossaryEntry('general:arkana').body + '</p>';
    html += '</div>';
    html += '<div class="bento">';
    html += '<div class="tile wide" data-goto-view="legen"><div class="tile-badge" style="background:var(--grad-1);">🔮</div><div><div class="tile-title">Karten legen</div><div class="tile-sub">Tageskarte, Drei-Karten oder Keltisches Kreuz – mit optionaler Frage</div></div></div>';
    html += '<div class="tile wide" data-goto-view="lexikon"><div class="tile-badge" style="background:var(--grad-3);">📚</div><div><div class="tile-title">Kartenlexikon</div><div class="tile-sub">Alle 78 Karten durchsuchen, favorisieren und nachlesen</div></div></div>';
    html += '</div>';
    html += '<p class="hint">Bisher ' + stats.draws + ' Legung' + (stats.draws === 1 ? '' : 'en') + ' gezogen. Mehr zu Großer/Kleiner Arkana und umgekehrten Karten im ' + glossLink('general:umgekehrt', 'Astro-Lexikon') + '.</p>';
    html += '<div class="disclaimer-box">Tarot dient der Selbstreflexion und Unterhaltung, nicht der Vorhersage konkreter Ereignisse.</div>';
    box.innerHTML = html;
    box.querySelectorAll('[data-goto-view]').forEach(function (t) {
      t.addEventListener('click', function () { tarotState.view = t.getAttribute('data-goto-view'); renderTarot(); });
    });
  }

  function tarotCardFace(card, reversed, small, zoomable) {
    const art = window.generateCardArt(card);
    const zoomAttrs = zoomable ? ' data-zoom-card="' + card.id + '" data-zoom-rev="' + (reversed ? '1' : '0') + '"' : '';
    return '<div class="tarot-card-face' + (small ? ' small' : '') + '">' +
      '<div class="tarot-card-art' + (reversed ? ' reversed' : '') + (zoomable ? ' zoomable' : '') + '"' + zoomAttrs + '>' + art + '</div>' +
      '<div class="tarot-card-name">' + esc(card.name) + (reversed ? ' <span class="tarot-rev-tag">Umgekehrt</span>' : '') + '</div></div>';
  }

  function renderTarotLegen() {
    const box = document.getElementById('tarotSub');
    let html = '<p class="hint">Wähle eine Legeart. Jede Legeart erklärt sich direkt darunter.</p>';
    html += '<div class="pill-select">' + Object.keys(TAROT_SPREADS).map(function (k) {
      return '<div class="pill' + (tarotState.spread === k ? ' active' : '') + '" data-spread="' + k + '">' + TAROT_SPREADS[k].label + '</div>';
    }).join('') + '</div>';

    if (!tarotState.spread) {
      box.innerHTML = html + '<div class="empty-state"><span class="glyph">🃏</span>Wähle oben eine Legeart, um zu starten.</div>';
      bindTarotSpreadPicker(box);
      return;
    }

    html += '<div class="card" style="font-size:.85rem; color:var(--text-dim); line-height:1.5;">' + esc(TAROT_SPREADS[tarotState.spread].desc) + '</div>';

    if (!tarotState.drawn.length) {
      html += '<div class="field"><label>Deine Frage (optional)</label><textarea id="tarotQuestion" placeholder="Worum geht es dir gerade?">' + esc(tarotState.question) + '</textarea></div>';
      html += '<button class="btn" id="tarotDrawBtn">Karten mischen &amp; legen</button>';
      box.innerHTML = html;
      bindTarotSpreadPicker(box);
      document.getElementById('tarotDrawBtn').addEventListener('click', function () {
        tarotState.question = document.getElementById('tarotQuestion').value.trim();
        drawTarotSpread(tarotState.spread);
      });
      return;
    }

    const positions = TAROT_SPREADS[tarotState.spread].positions;
    html += tarotState.question ? '<div class="card" style="margin-top:10px;"><b>Frage:</b> ' + esc(tarotState.question) + '</div>' : '';
    if (!tarotState.revealed.every(Boolean)) html += '<p class="hint">Tippe nacheinander auf die verdeckten Karten, um sie aufzudecken.</p>';
    html += '<div class="tarot-spread-grid tarot-grid-' + tarotState.spread + '">';
    tarotState.drawn.forEach(function (d, i) {
      const revealed = tarotState.revealed[i];
      html += '<div class="tarot-slot" data-idx="' + i + '">' +
        '<div class="tarot-pos-label">' + esc(positions[i]) + '</div>' +
        (revealed ? tarotCardFace(d.card, d.reversed, true, true) : '<div class="tarot-card-back"></div>') +
        '</div>';
    });
    html += '</div>';
    if (tarotState.revealed.every(Boolean)) {
      html += '<h2 class="section-title">Deutung</h2><div class="card">';
      tarotState.drawn.forEach(function (d, i) {
        const text = d.reversed ? d.card.reversed : d.card.upright;
        html += '<div class="aspect-row"><div class="aspect-symbol">' + (i + 1) + '</div><div class="aspect-text"><b>' + esc(positions[i]) + ' – ' + esc(d.card.name) + (d.reversed ? ' ' + glossLink('general:umgekehrt', '(umgekehrt)') : '') + '</b><br>' + esc(text) + '</div></div>';
      });
      html += '</div>';
      if (tarotState.spread === 'tage') {
        html += '<div class="disclaimer-box"><b>Reflexionsfrage:</b> ' + esc(tarotState.drawn[0].card.advice) + '</div>';
      }
    }
    html += '<button class="btn secondary" id="tarotResetBtn" style="margin-top:12px;">Neue Legung</button>';
    html += '<div class="disclaimer-box">Tarot dient der Selbstreflexion und Unterhaltung, nicht der Vorhersage konkreter Ereignisse.</div>';
    box.innerHTML = html;
    bindTarotSpreadPicker(box);

    box.querySelectorAll('.tarot-slot').forEach(function (slot) {
      slot.addEventListener('click', function () {
        const idx = parseInt(slot.dataset.idx, 10);
        if (!tarotState.revealed[idx]) { tarotState.revealed[idx] = true; renderTarotLegen(); }
      });
    });
    const resetBtn = document.getElementById('tarotResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      tarotState.drawn = []; tarotState.revealed = []; tarotState.question = '';
      renderTarotLegen();
    });
  }
  function bindTarotSpreadPicker(box) {
    box.querySelectorAll('[data-spread]').forEach(function (p) {
      p.addEventListener('click', function () {
        if (tarotState.drawn.length && p.dataset.spread !== tarotState.spread) {
          if (!confirm('Aktuelle Legung verwerfen und neue Legeart wählen?')) return;
        }
        tarotState.spread = p.dataset.spread;
        tarotState.drawn = []; tarotState.revealed = []; tarotState.question = '';
        renderTarotLegen();
      });
    });
  }
  function drawTarotSpread(spreadKey) {
    const n = TAROT_SPREADS[spreadKey].positions.length;
    const pool = window.CARDS.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    tarotState.drawn = pool.slice(0, n).map(function (c) { return { card: c, reversed: Math.random() < 0.35 }; });
    tarotState.revealed = new Array(n).fill(false);
    tarotBumpStats({ draws: 1 });
    renderTarotLegen();
  }

  function renderTarotLexikon() {
    const box = document.getElementById('tarotSub');
    const favs = tarotFavorites();
    let html = '<div class="field"><input type="text" id="lexSearch" placeholder="Karte oder Stichwort suchen…" autocomplete="off" value="' + esc(tarotState.lex.filter) + '"></div>';
    const arcanaOpts = [['all', 'Alle'], ['major', 'Große Arkana'], ['staebe', 'Stäbe'], ['kelche', 'Kelche'], ['schwerter', 'Schwerter'], ['muenzen', 'Münzen']];
    html += '<div class="pill-select">' + arcanaOpts.map(function (o) {
      return '<div class="pill' + (tarotState.lex.arcana === o[0] ? ' active' : '') + '" data-arc="' + o[0] + '">' + o[1] + '</div>';
    }).join('') + '<div class="pill' + (tarotState.lex.favOnly ? ' active' : '') + '" id="lexFavToggle">★ Favoriten</div></div>';

    const q = tarotState.lex.filter.toLowerCase();
    const filtered = window.CARDS.filter(function (c) {
      if (tarotState.lex.favOnly && favs.indexOf(c.id) === -1) return false;
      const arcMatch = tarotState.lex.arcana === 'all' ? true : (tarotState.lex.arcana === 'major' ? c.arcana === 'major' : c.suit === tarotState.lex.arcana);
      if (!arcMatch) return false;
      if (!q) return true;
      return c.name.toLowerCase().indexOf(q) !== -1 || c.keywords.join(' ').toLowerCase().indexOf(q) !== -1;
    });

    if (tarotState.lex.openId !== null) {
      const card = window.getCard(tarotState.lex.openId);
      if (card) {
        html += '<button class="btn ghost small" id="lexBackBtn" style="margin:10px 0;">← Zur Übersicht</button>';
        html += '<div class="card">';
        html += tarotCardFace(card, false, false, true);
        html += '<p style="font-size:.8rem; color:var(--text-dim); margin-top:8px;">' + card.keywords.map(esc).join(' · ') + '</p>';
        html += '<p style="font-size:.88rem;"><b>Aufrecht:</b> ' + esc(card.upright) + '</p>';
        html += '<p style="font-size:.88rem;"><b>Umgekehrt:</b> ' + esc(card.reversed) + '</p>';
        html += '<p style="font-size:.82rem; color:var(--text-dim);"><b>Reflexionsfrage:</b> ' + esc(card.advice) + '</p>';
        html += '<button class="btn secondary small" id="lexFavBtn">' + (favs.indexOf(card.id) !== -1 ? '★ Favorit entfernen' : '☆ Als Favorit merken') + '</button>';
        html += '</div>';
        box.innerHTML = html;
        document.getElementById('lexBackBtn').addEventListener('click', function () { tarotState.lex.openId = null; renderTarotLexikon(); });
        document.getElementById('lexFavBtn').addEventListener('click', function () { tarotToggleFavorite(card.id); renderTarotLexikon(); });
        bindLexikonControls(box);
        return;
      }
    }

    html += '<div class="tarot-lex-grid">' + filtered.map(function (c) {
      return '<div class="tarot-lex-item" data-id="' + c.id + '">' + tarotCardFace(c, false, true) + '</div>';
    }).join('') + '</div>';
    if (!filtered.length) html += '<div class="empty-state"><span class="glyph">🔍</span>Keine Karten gefunden.</div>';
    box.innerHTML = html;
    bindLexikonControls(box);
    box.querySelectorAll('.tarot-lex-item').forEach(function (item) {
      item.addEventListener('click', function () { tarotState.lex.openId = parseInt(item.dataset.id, 10); renderTarotLexikon(); });
    });
  }
  function bindLexikonControls(box) {
    const search = document.getElementById('lexSearch');
    if (search) search.addEventListener('input', function (e) {
      const pos = e.target.selectionStart;
      tarotState.lex.filter = e.target.value;
      renderTarotLexikon();
      const el = document.getElementById('lexSearch');
      if (el) { el.focus(); el.setSelectionRange(pos, pos); }
    });
    box.querySelectorAll('[data-arc]').forEach(function (p) {
      p.addEventListener('click', function () { tarotState.lex.arcana = p.dataset.arc; renderTarotLexikon(); });
    });
    const favToggle = document.getElementById('lexFavToggle');
    if (favToggle) favToggle.addEventListener('click', function () { tarotState.lex.favOnly = !tarotState.lex.favOnly; renderTarotLexikon(); });
  }

  /* ---------------------------------------------------------------
     ANLEITUNG
     --------------------------------------------------------------- */
  function renderSitemapHTML() {
    const order = ['astro', 'astrologie', 'tarot', 'general'];
    let html = '';
    order.forEach(function (dom) {
      const items = TOOL_SHORTCUTS.filter(function (s) { return s.domain === dom; });
      if (!items.length) return;
      const meta = DOMAIN_META[dom];
      html += '<div class="search-domain-label">' + meta.icon + ' ' + meta.label + '</div>';
      items.forEach(function (s) {
        html += '<div class="search-result-row" data-nav="' + s.tab + '"><div class="search-result-icon">' + meta.icon + '</div><div class="search-result-text"><b>' + esc(s.label) + '</b></div></div>';
      });
    });
    return html;
  }
  function bindSitemapClicks(container) {
    container.querySelectorAll('[data-nav]').forEach(function (row) {
      row.addEventListener('click', function () { navigate(row.getAttribute('data-nav')); });
    });
  }

  function renderAnleitung() {
    document.getElementById('anleitungRoot').innerHTML =
      '<h3>Direkt weiter zu</h3>' +
      '<div class="bento" id="anleitungBento"></div>' +
      '<h3>Astronomie oder Astrologie?</h3>' +
      '<p>AstroWahr trennt bewusst zwei Bereiche: <b>Astronomie</b> liefert reine, unabhängig überprüfbare Fakten und Berechnungen (Positionen, Entfernungen, Sonnenzeiten, physikalische Planetendaten) ohne Deutung. <b>Astrologie</b> nutzt dieselben berechneten Positionen, legt aber zusätzlich eine symbolische, nicht wissenschaftlich belegte Deutungsebene darüber (Geburtshoroskop, Tageshoroskop, Tarot). Die Startseite führt zu beiden Bereichen.</p>' +
      '<h3>Alle Bereiche im Überblick</h3>' +
      '<p style="font-size:.84rem; color:var(--text-dim);">Vollständige Übersicht aller Seiten – zum direkten Aufrufen antippen.</p>' +
      '<div class="card" id="anleitungSitemap"></div>' +
      '<h3>Direkt nachschlagen</h3>' +
      '<p>Unterstrichene Begriffe und kleine ⓘ-Symbole sind überall in der App antippbar und öffnen eine kurze Erklärung. Für die ausführliche Übersicht gibt es das <b>Astro-Lexikon</b> mit allen Planeten, Zeichen, Häusern und Aspekten – durchsuchbar und nach Kategorie filterbar. Chart-Grafik und Tarotkarten lassen sich zudem antippen, um sie vergrößert und mit Zoom/Pan-Steuerung anzuzeigen; ein Tipp daneben oder das × schließt die Ansicht wieder.</p>' +
      '<h3>Wie AstroWahr rechnet</h3>' +
      '<p>Alle Planetenpositionen werden direkt auf deinem Gerät aus astronomischen Bahnelementen berechnet (Kepler-Formeln) – ohne Internetverbindung, ohne externen Server. Die Genauigkeit liegt bei wenigen Bogenminuten und reicht für die astrologische Zeichen- und Gradbestimmung sowie für die astronomischen Übersichten.</p>' +
      '<h3>Weltraumkunde</h3>' +
      '<p>Der Bereich Weltraumkunde (Astronomie → Weltraumkunde) ergänzt die berechneten Positionen um Hintergrundwissen: Sterne und ihre Entwicklung, das Universum im Großen, vertiefte Sonnensystem-Themen (Zwergplaneten, Asteroiden- und Kuipergürtel, große Monde) sowie eine Auswahl an Meilensteinen der Raumfahrtgeschichte. Alle Texte sind eigenständig formuliert; es werden keine Fotografien, Missionslogos, Illustrationen oder sonstigen Bilder Dritter verwendet, sondern ausschließlich einzelne Unicode-Symbole (Emoji) zur Orientierung. Einzelne Zahlenangaben (z. B. Monde der Gasplaneten) ändern sich mit neuen Entdeckungen und sind entsprechend gekennzeichnet.</p>' +
      '<h3>Rückläufigkeit (℞)</h3>' +
      '<p>Ein Planet erscheint „rückläufig", wenn er sich – von der Erde aus gesehen – für einige Wochen scheinbar entgegen seiner üblichen Richtung durch den Tierkreis bewegt. Das ist eine reine Perspektiventäuschung durch die unterschiedlichen Umlaufgeschwindigkeiten von Erde und Planet, keine tatsächliche Kursänderung. Zu sehen ist die Kennzeichnung im Astronomie-Bereich unter „Himmel jetzt".</p>' +
      '<h3>Sonnenauf-/-untergang</h3>' +
      '<p>Die Berechnung nutzt ein Standardverfahren (Zeitgleichung + Stundenwinkel bei -0,833° Höhe, inklusive Standardrefraktion) und ist auf wenige Minuten genau. Lokale Horizontverdeckung durch Berge oder Gebäude ist nicht enthalten. Nahe der Polarkreise kann die Sonne ganztägig auf- oder untergehen (Polartag/Polarnacht) – das wird entsprechend angezeigt.</p>' +
      '<h3>Sternbilder vs. Tierkreiszeichen</h3>' +
      '<p>Die Astrologie nutzt den <b>tropischen</b> Tierkreis (fest an die Jahreszeiten gekoppelt), nicht die tatsächlichen, unterschiedlich großen Sternbilder am Himmel. Durch die Präzession der Erdachse hat sich seit Entstehung des Systems vor rund 2.000 Jahren eine Verschiebung von etwa einem Zeichen ergeben – nachzulesen im Astronomie-Bereich unter „Sternbilder & Präzession".</p>' +
      '<h3>Die Chart-Grafik lesen</h3>' +
      '<p>Der äußere Ring zeigt die zwölf Tierkreiszeichen. Ist eine Geburtszeit bekannt, markieren dünne Speichen die zwölf Häuser (die vier dickeren, violetten Linien sind die Hauptachsen Aszendent/Deszendent und MC/IC). Die Symbole im inneren Bereich sind die Planeten an ihrer jeweiligen Tierkreisposition. Farbige Linien zwischen den Planeten zeigen Aspekte: Türkis für Trigon/Sextil (harmonisch), Rot für Quadrat (spannungsreich), Gold für Opposition (Ausgleich gesucht) – Konjunktionen werden nicht extra verbunden, da die Planeten dafür nah beieinanderstehen.</p>' +
      '<h3>Aszendent & Häuser</h3>' +
      '<p>Für Aszendent, Medium Coeli (MC) und die 12 Häuser werden Geburtsdatum, -uhrzeit, -zeitzone und -ort benötigt. AstroWahr nutzt das gleichweite Häusersystem (Equal House) ab dem Aszendenten. Ohne bekannte Geburtszeit lassen sich diese Werte nicht seriös berechnen – die App zeigt dann nur die Zeichenpositionen der Planeten.</p>' +
      '<h3>Zeitzone</h3>' +
      '<p>Bitte gib die tatsächlich gültige Zeitzone an (in Deutschland z. B. MEZ = UTC+1 im Winter, MESZ = UTC+2 im Sommer). Das gilt für Geburtsdaten ebenso wie für den Sonnenauf-/-untergangsrechner. Eine falsche Zeitzone verschiebt vor allem Aszendent, Mondposition und Sonnenzeiten.</p>' +
      '<h3>Aspekte, Orb und die Reihenfolge der Listen</h3>' +
      '<p>Aspekte sind bestimmte Winkelbeziehungen zwischen zwei Planeten: Konjunktion (0°), Sextil (60°), Quadrat (90°), Trigon (120°) und Opposition (180°), jeweils mit einem Toleranzbereich (Orb). Aspektlisten sind nach Orb sortiert – die exaktesten (stärksten) Aspekte stehen oben. Bei Transiten wird ein deutlich engerer Orb verwendet als im Geburtshoroskop, da dort nur gerade aktuell wirksame Aspekte relevant sind; bei der Kompatibilität ein etwas weiterer, da hier zwei komplette Planetenbilder verglichen werden.</p>' +
      '<h3>Mondkalender-Begriffe</h3>' +
      '<p>„Zyklustag" zählt die Tage seit dem letzten Neumond (ein voller Zyklus dauert rund 29,5 Tage). „Beleuchtung" gibt an, wie viel Prozent der Mondscheibe von der Erde aus gesehen gerade sichtbar beleuchtet sind – 0 % beim Neumond, 100 % beim Vollmond.</p>' +
      '<h3>Tarot</h3>' +
      '<p>Der Tarot-Bereich bietet eine Startseite mit Kurzerklärung, drei Legearten (Tageskarte, Drei-Karten-Legung, Keltisches Kreuz – jeweils mit Erklärtext direkt bei der Auswahl) sowie ein durchsuchbares Kartenlexikon mit Favoriten. Kartentexte und Kartenbilder sind eigene Erstellungen und bilden kein bestehendes Tarot-Deck (z. B. Rider-Waite-Smith) nach – weder inhaltlich noch bildlich.</p>' +
      '<h3>Erscheinungsbild</h3>' +
      '<p>Unter Einstellungen lässt sich zwischen Hell, Dunkel und „System" (folgt automatisch der Geräteeinstellung) wechseln. Die Wahl wird lokal gespeichert und beim nächsten Start automatisch wieder angewendet.</p>' +
      '<h3>Suche & Tour</h3>' +
      '<p>Das Lupensymbol oben rechts durchsucht Werkzeuge, Astro-Lexikon, Tarot-Lexikon und Planeten-Steckbriefe gleichzeitig – jeder Treffer ist klar mit Astronomie, Astrologie, Tarot oder App beschriftet. Die Einführungs-Tour lässt sich hier jederzeit erneut aufrufen.</p>' +
      '<button class="btn secondary" id="replayTourBtn" style="margin-bottom:8px;">Tour erneut ansehen</button>' +
      '<h3>Deine Daten</h3>' +
      '<p>Alle Geburtsprofile werden ausschließlich lokal auf deinem Gerät gespeichert (localStorage). Es gibt keine Server-Anbindung, kein Tracking und keine Weitergabe an Dritte.</p>' +
      '<div class="disclaimer-box">Der Astronomie-Bereich bildet den aktuellen wissenschaftlichen Kenntnisstand vereinfacht ab; der Astrologie- und Tarot-Bereich dient der Unterhaltung und Selbstreflexion. Astrologische und Tarot-Aussagen sind nicht wissenschaftlich belegt und ersetzen keine medizinische, psychologische, rechtliche oder finanzielle Beratung.</div>';
    document.getElementById('anleitungBento').innerHTML =
      tile('grad-3', '🔭', 'Astronomie', 'Live-Himmel, Planeten-Fakten, Sonnenzeiten', 'astronomie') +
      tile('grad-1', '🎓', 'Astro-Lexikon', 'Planeten, Zeichen, Häuser & Aspekte im Detail', 'astrolex') +
      tile('grad-2', '🃏', 'Tarot', 'Startseite, Legen & Lexikon', 'tarot');
    bindTiles('anleitungBento');
    const sitemapBox = document.getElementById('anleitungSitemap');
    sitemapBox.innerHTML = renderSitemapHTML();
    bindSitemapClicks(sitemapBox);
    document.getElementById('replayTourBtn').addEventListener('click', openTour);
  }

  /* ---------------------------------------------------------------
     EINSTELLUNGEN
     --------------------------------------------------------------- */
  const THEME_KEY = 'astrowahr.theme';
  function getThemePref() { try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch (e) { return 'dark'; } }
  function applyTheme(pref) {
    const effective = pref === 'system' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : pref;
    if (effective === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', effective === 'light' ? '#f4f2fb' : '#0b0e1f');
  }
  function setThemePref(pref) {
    try { localStorage.setItem(THEME_KEY, pref); } catch (e) {}
    applyTheme(pref);
  }

  function renderEinstellungen() {
    const root = document.getElementById('einstellungenRoot');
    const count = getProfiles().length;
    const favCount = tarotFavorites().length;
    const themePref = getThemePref();
    root.innerHTML =
      '<h2 class="section-title">Erscheinungsbild</h2>' +
      '<div class="pill-select" id="themePills">' +
      [['dark', '🌙 Dunkel'], ['light', '☀️ Hell'], ['system', '⚙️ System']].map(function (o) {
        return '<div class="pill' + (themePref === o[0] ? ' active' : '') + '" data-theme-pref="' + o[0] + '">' + o[1] + '</div>';
      }).join('') + '</div>' +
      '<h2 class="section-title">Daten &amp; Backup</h2>' +
      '<p class="hint">' + count + ' gespeicherte' + (count === 1 ? 's Geburtshoroskop' : ' Geburtshoroskope') + ' · ' + favCount + ' Tarot-Favorit' + (favCount === 1 ? '' : 'en') + '. Das Backup umfasst Geburtshoroskope sowie Tarot-Favoriten und -Statistik.</p>' +
      '<button class="btn secondary" id="exportBtn">Backup exportieren (JSON)</button>' +
      '<div style="height:10px;"></div>' +
      '<label class="btn secondary" style="cursor:pointer; text-align:center;">Backup importieren<input type="file" id="importFile" accept="application/json" style="display:none;"></label>' +
      '<div style="height:16px;"></div>' +
      '<button class="btn danger" id="wipeBtn">Alle Profile löschen</button>';

    document.getElementById('themePills').querySelectorAll('[data-theme-pref]').forEach(function (p) {
      p.addEventListener('click', function () { setThemePref(p.getAttribute('data-theme-pref')); renderEinstellungen(); });
    });

    document.getElementById('exportBtn').addEventListener('click', function () {
      const bundle = { astrowahrBackup: 1, profiles: getProfiles(), tarotFavorites: tarotFavorites(), tarotStats: tarotStats() };
      const data = JSON.stringify(bundle, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'astrowahr-backup.json'; a.click();
      URL.revokeObjectURL(url);
      toast('Backup heruntergeladen');
    });
    document.getElementById('importFile').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const data = JSON.parse(reader.result);
          if (Array.isArray(data)) {
            saveProfiles(data);
          } else if (data && typeof data === 'object') {
            if (Array.isArray(data.profiles)) saveProfiles(data.profiles);
            if (Array.isArray(data.tarotFavorites)) localStorage.setItem(TAROT_STORAGE.favorites, JSON.stringify(data.tarotFavorites));
            if (data.tarotStats && typeof data.tarotStats === 'object') localStorage.setItem(TAROT_STORAGE.stats, JSON.stringify(data.tarotStats));
          } else { throw new Error('invalid'); }
          toast('Backup importiert');
          renderEinstellungen();
        } catch (err) { toast('Ungültige Backup-Datei'); }
      };
      reader.readAsText(file);
    });
    document.getElementById('wipeBtn').addEventListener('click', function () {
      if (confirm('Wirklich ALLE gespeicherten Geburtshoroskope löschen? Das kann nicht rückgängig gemacht werden.')) {
        saveProfiles([]);
        toast('Alle Profile gelöscht');
        renderEinstellungen();
      }
    });
  }

  /* ---------------------------------------------------------------
     RECHTLICHES / IMPRESSUM / DATENSCHUTZ
     --------------------------------------------------------------- */
  function renderRechtliches() {
    document.getElementById('rechtlichesRoot').innerHTML =
      '<div class="bento">' +
      tile('grad-1', '📄', 'Impressum', 'Anbieterkennzeichnung', 'impressum') +
      tile('grad-3', '🔒', 'Datenschutz', 'Wie AstroWahr mit Daten umgeht', 'datenschutz') +
      '</div>';
    bindTiles('rechtlichesRoot');
  }

  const IMPRESSUM_HTML =
    '<h3>Impressum</h3>' +
    '<p><b>Angaben gemäß § 5 DDG</b></p>' +
    '<p>Jan Dierlich<br>Steenacker 33<br>25499 Tangstedt<br>Deutschland</p>' +
    '<p><b>Kontakt</b><br>E-Mail: jandierlich@googlemail.com</p>' +
    '<p><b>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</b><br>Jan Dierlich (Anschrift wie oben)</p>' +
    '<h3>Haftungshinweis</h3>' +
    '<p>AstroWahr wird unentgeltlich und ohne Gewähr für private Nutzung zur Verfügung gestellt. Alle Inhalte sind unterhaltend gemeint; für Vollständigkeit oder Richtigkeit der berechneten astronomischen bzw. astrologischen Angaben wird keine Haftung übernommen.</p>';

  const DATENSCHUTZ_HTML =
    '<h3>Datenschutzerklärung</h3>' +
    '<p><b>Verantwortlicher</b><br>Jan Dierlich, Steenacker 33, 25499 Tangstedt, Deutschland, jandierlich@googlemail.com</p>' +
    '<h3>Keine Server-Übertragung</h3>' +
    '<p>AstroWahr ist eine reine Web-App (PWA), die vollständig lokal auf deinem Gerät läuft. Es findet keine Übertragung deiner Geburtsdaten oder anderer Eingaben an einen Server, an den Betreiber oder an Dritte statt. Es gibt kein Tracking, keine Analyse-Tools und keine Werbung.</p>' +
    '<h3>Lokale Speicherung (localStorage)</h3>' +
    '<p>Folgende Daten werden ausschließlich lokal in deinem Browser gespeichert (Schlüssel-Präfix „astrowahr."):</p>' +
    '<ul><li>Gespeicherte Geburtshoroskope: Bezeichnung, Geburtsdatum, Geburtsuhrzeit (falls angegeben), Zeitzone, geografische Koordinaten des Geburtsorts und Ortsname</li>' +
    '<li>Tarot-Bereich: als Favorit markierte Karten sowie anonyme Zähler zu gezogenen Legungen (keine Inhalte oder Ergebnisse einzelner Legungen)</li></ul>' +
    '<p>Diese beiden Kategorien verlassen dein Gerät nur, wenn du sie selbst über die Backup-Export-Funktion als Datei speicherst und weitergibst.</p>' +
    '<p>Zusätzlich wird deine Auswahl beim Erscheinungsbild (Hell/Dunkel/System) lokal gespeichert; diese ist nicht Teil des Backups, da sie jederzeit ohne Datenverlust neu gewählt werden kann.</p>' +
    '<p>Ebenfalls lokal gespeichert wird ein einzelnes Flag, ob die Einführungs-Tour bereits gesehen wurde – ohne weitere Inhalte.</p>' +
    '<h3>Keine Standortabfrage</h3>' +
    '<p>AstroWahr fragt keine Geräte-Standortdaten (Geolocation) ab. Geburtsorte werden manuell über eine Ortsauswahl oder durch Eingabe von Koordinaten festgelegt.</p>' +
    '<h3>Löschung</h3>' +
    '<p>Du kannst einzelne Profile jederzeit über den Papierkorb-Button oder alle Profile gesammelt über „Einstellungen → Alle Profile löschen" entfernen. Eine vollständige Löschung aller App-Daten ist zusätzlich über die Browser- bzw. iOS/Android-Systemeinstellungen möglich (App-Daten/Website-Daten löschen).</p>' +
    '<h3>Hosting</h3>' +
    '<p>Die App-Dateien werden über GitHub Pages ausgeliefert. Beim Aufruf verarbeitet GitHub als Hosting-Anbieter technisch bedingt IP-Adressen im Rahmen des Seitenaufrufs; nähere Informationen dazu stellt GitHub in seiner eigenen Datenschutzerklärung bereit.</p>';

  function renderImpressumInline() { document.getElementById('impressumInline').innerHTML = IMPRESSUM_HTML; }
  function renderDatenschutzInline() { document.getElementById('datenschutzInline').innerHTML = DATENSCHUTZ_HTML; }

  /* ---------------------------------------------------------------
     Init
     --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getThemePref());
    if (getThemePref() === 'system' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
        if (getThemePref() === 'system') applyTheme('system');
      });
    }
    document.querySelectorAll('nav.bottom-nav button').forEach(function (b) {
      b.addEventListener('click', function () { navigate(b.dataset.tab); });
    });
    document.getElementById('backBtn').addEventListener('click', goBack);
    document.getElementById('searchBtn').addEventListener('click', openSearchModal);

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', function (e) { if (e.target.id === 'modalOverlay') closeModal(); });
    document.getElementById('zoomInBtn').addEventListener('click', function () { zoomState.scale = Math.min(4, zoomState.scale + 0.4); applyZoomTransform(); });
    document.getElementById('zoomOutBtn').addEventListener('click', function () { zoomState.scale = Math.max(1, zoomState.scale - 0.4); applyZoomTransform(); });
    document.getElementById('zoomResetBtn').addEventListener('click', function () { zoomState = { scale: 1, tx: 0, ty: 0 }; applyZoomTransform(); });

    document.getElementById('view').addEventListener('click', function (e) {
      const gEl = e.target.closest('[data-glossary]');
      if (gEl) { showGlossary(gEl.dataset.glossary); return; }
      const zEl = e.target.closest('[data-zoom-card]');
      if (zEl) {
        const card = window.getCard(parseInt(zEl.dataset.zoomCard, 10));
        if (card) {
          const rev = zEl.dataset.zoomRev === '1';
          const art = window.generateCardArt(card);
          openImageModal(rev ? '<div style="transform:rotate(180deg);">' + art + '</div>' : art);
        }
        return;
      }
    });

    navigate('start');

    let onboarded = null;
    try { onboarded = localStorage.getItem(ONBOARD_KEY); } catch (e) {}
    if (!onboarded) { setTimeout(openTour, 300); }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    }
  });
})();
