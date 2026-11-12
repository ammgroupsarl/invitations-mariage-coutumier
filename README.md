# 3 sites d'invitation de mariage coutumier — AMMGROUP Digital

**Mise à jour :** trois identités visuelles, menu responsive, contact des mariés ET de l'organisation, véritable PDF à télécharger pour chaque modèle, remplacement des personnages stylisés par des compositions d'alliances, tissus et ornements coutumiers.

## Ouvrir le catalogue

Ouvrir `index.html` depuis le dossier extrait. Les trois sites sont accessibles :

- `royal/index.html` — **L'Éternel**, ivoire et or ; `pdf/invitation-royal.pdf`.
- `cinema/index.html` — **Notre Histoire**, noir et bronze ; `pdf/invitation-cinema.pdf`.
- `violet/index.html` — **Nos Racines**, violet royal et or ; `pdf/invitation-violet.pdf`.

Les fichiers `invitation-royal.html`, `invitation-cinema.html` et `invitation-violet.html` livrés à part sont autonomes : ils intègrent leurs images, styles, scripts et PDF ; ils n'ont pas besoin des dossiers du projet.

## Contacts : configuration obligatoire avant publication

Les boutons **WhatsApp, Appeler, E-mail** sont disponibles pour deux destinations distinctes : **les mariés** et **l'organisation**. Ils sont volontairement désactivés tant que vous n'avez pas renseigné les coordonnées : aucun faux numéro de téléphone ni aucune fausse adresse e-mail ne sont diffusés.

Dans `assets/config.js`, compléter :

```js
contacts: {
  couple: {
    whatsapp: '243XXXXXXXXX',  // remplacer X par les vrais chiffres
    phone: '+243XXXXXXXXX',    // numéro réel de contact
    email: 'adresse-reelle@domaine.com'
  },
  organizer: {
    whatsapp: '243YYYYYYYYY',
    phone: '+243YYYYYYYYY',
    email: 'organisation@domaine.com'
  }
},
```

Ces valeurs sont **des exemples de format**, non des numéros valides. Modifier aussi `mapUrl` lorsque l'itinéraire est connu. Chaque contact peut être indépendant ; seuls les canaux renseignés deviennent actifs.

## Modifier le mariage

Dans le même fichier `assets/config.js`, personnaliser `bride`, `groom`, `familyBride`, `familyGroom`, `dateISO`, `dateText`, `timeText`, `city`, `venue`, `address`, `dressCode`, `story` et les étapes `agenda`.

Les trois sites affichent **toutes** les sections : Accueil, Notre histoire, Familles, Programme coutumier, Tenue, Galerie, Lieu, RSVP, Contact. Aucune sélection par catégorie d'invité : toute la cérémonie coutumière est visible.

## Régénérer les PDF après modification

Les PDF sont de vrais documents de **3 pages**, inclus dans le dossier `pdf`. Les données dans ces fichiers correspondent à la configuration au moment où ils ont été créés. Après modification de `assets/config.js`, **régénérez les PDF** pour y reporter les nouvelles informations :

```bash
pip install reportlab pillow beautifulsoup4
python make_pdf.py
python make_pages.py
python make_standalone.py
```

`make_pages.py` met à jour les pages en fonction des textes et de leurs thèmes ; les noms/dates/contenus de la configuration sont injectés par JavaScript au chargement. `make_standalone.py` génère les trois HTML autonomes dans le dossier **parent** du projet (donc à récupérer après reconstruction).

Les PDF peuvent également être ouverts directement depuis `pdf/`.

## Collecte RSVP

**Important :** la démonstration n'a pas de backend. Les réponses RSVP sont enregistrées uniquement dans le navigateur local de l'invité, **non transmises** aux mariés. Pour une utilisation réelle, brancher le formulaire sur une API/backend avec une base de données, une validation anti-spam et une notice de confidentialité. Les contacts WhatsApp/e-mail sont, eux, des liens directs opérationnels **dès lors que leurs coordonnées réelles sont renseignées**.

## Publication

Pour GitHub Pages : déposer tout le contenu du dossier sur la branche `main`, puis activer Pages dans `Settings → Pages` et servir le dossier racine. Le catalogue sera à l'adresse `https://UTILISATEUR.github.io/NOM-DU-DEPOT/`.

**Maquettes fictives :** Naomi & Alexandre, samedi 19 juin 2027, Lubumbashi ; pas de lieu ni de contacts réels fournis. Les photos de décoration sont des visuels artistiques générés pour la démonstration et ne représentent pas les personnes réelles.
