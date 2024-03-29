# Veb aplikacija za rezervaciju termina u restoranima

Broj indeksa: 2018200292

Ime i prezime: Nikola Petkovic

Školska godina: 2022/2023

## Projektni zahtev

Aplikacija treba da omogući menadžerima restorana da se registruju i da dodaju svoj restoran u bazu. Svaki restoran ima naziv, opis, fotografiju, adresu i mesto. Osim ovih podataka, menadžer mora da navede za svaki radni dan u nedelji vreme otvaranja i vreme zatvaranja restorana. Za svaki restoran, menadžer može da u kalendar neradnih dana unese datum kada će restoran biti zatvoren i da upiše tekst razloga, npr. u kada je državni praznik ili renoviranje itd. Restoran može imati evidentirane stolove koji su na raspolaganju za rezervacije. Prilikom unosa u evidenciju stolova, menadžer unosi naziv stola (npr. separe, pored prozora, na sred sale, u romantičnom ćošku itd), broj mesta za stolom i maksimalan broj sati trajanja rezervacije (1 sat, 2 sata, 3 sata ili 4 sata). Posetilac sajta može da pretražuje restorane ili da vidi spisak restorana po mestu u kojem se nalaze (npr. Restorani u Beogradu, Restorani u Pančevu, Restorani u Novom Sadu, Restorani u Čačku itd). U prikazu restorana mora da bude prikazano da li je restoran otvoren u tom trenutku (npr. restoran se zatvara danas u 23.00, ako je restoran tog dana u nedelji otvoren u to vreme ili restoran se otvara u ponedeljak u 10.00, ako je u trenutku prikaza subota u 23.00, a restoran ne radi nedeljom, a subotom se zatvarao u 20.00). Voditi računa o tome da treba prikazati da je restoran zatvoren onim danima za koje je menadžer uneo podatak da restoran tog datuma neće raditi. Posetilac može da izvrši rezervaciju stola u restoranu. Prilikom vršenja rezervacije, unosi svoje ime, prezime, kontakt telefon i adresu elektronske pošte, bira planirano vreme dolaska i sajt mu prikazuje spisak stolova koji su po rasporedu u tom trenutku slobodni (ne postoji ni jedna druga potvrđena rezervacija za taj termin). Za svaki slobodan sto prikazuje ime, broj mesta i najduže vreme trajanja rezervacije. Voditi računa da vreme trajanja može da bude i kraće od onog koje je menadžer za taj sto uneo, ako postoji za isti sto rezervacija tog dana u kasnijem terminu, npr. za 2 sata od vremena planiranog dolaska u restoran, pa u tom slučaju treba da bude prikazano da je najduže vreme ostanka 2 sata, a ne 4 koliko bi inače za taj sto bilo najviše dozvoljeno. Vremena su sa rezolucijom od po 30 minuta, tj. na pola sata. Kada posetilac pošalje rezervaciju, dobija poruku da će mu se menadžer javiti da rezervaciju potvrdi. Po prijemu rezervacije, aplikacija šalje menadžeru mejl. Menadžer u svom panelu za administraciju može da vidi sve neobrađene rezervacije i može da ih obeleži kao odbijene ili kao potvrđene. Kada menadžer obeleži rezervaciju kao odbijenu ili potvrđenu, adekvatan mejl se šalje posetiocu na adresu e-pošte koju je upisao prilikom popunjavanja forme rezervacije. Grafički interfejs sajta treba da bude realizovan sa responsive dizajnom.

## Tehnička ograničenja

- Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke. Aplikacija mora da bude podeljena u dve nezavisne celine: back-end veb servis (API) i front-end (GUI aplikacija). Sav kôd aplikacije treba da bude organizovan u jednom Git spremištu u okviru korisničkog naloga za ovaj projekat, sa podelom kao u primeru zadatka sa vežbi.
- Baza podataka mora da bude relaciona i treba koristiti MySQL ili MariaDB sistem za upravljanje bazama podataka (RDBMS) i u spremištu back-end dela aplikacije mora da bude dostupan SQL dump strukture baze podataka, eventualno sa inicijalnim podacima, potrebnim za demonstraciju rada projekta.
- Back-end i front-end delovi projekta moraju da budi pisani na TypeScript jeziku, prevedeni TypeScript prevodiocem na adekvatan JavaScript. Back-end deo aplikacije, preveden na JavaScript iz izvornog TypeScript koda se pokreće kao Node.js aplikacija, a front-end deo se statički servira sa rute statičkih resursa back-end dela aplikacije i izvršava se na strani klijenta. Za postupak provere identiteta korisnika koji upućuje zahteve back-end delu aplikacije može da se koristi mehanizam sesija ili JWT (JSON Web Tokena), po slobodnom izboru.
- Sav generisani HTML kôd koji proizvodi front-end deo aplikacije mora da bude 100% validan, tj. da prođe proveru W3C Validatorom (dopuštena su upozorenja - Warning, ali ne i greške - Error). Grafički korisnički interfejs se generiše na strani klijenta (client side rendering), korišćenjem React biblioteke, dok podatke doprema asinhrono iz back-end dela aplikacije (iz API-ja). Nije neophodno baviti se izradom posebnog dizajna grafičkog interfejsa aplikacije, već je moguće koristiti CSS biblioteke kao što je Bootstrap CSS biblioteka. Front-end deo aplikacije treba da bude realizovan tako da se prilagođava različitim veličinama ekrana (responsive design).
- Potrebno je obezbediti proveru podataka koji se od korisnika iz front-end dela upućuju back-end delu aplikacije. Moguća su tri sloja zaštite i to: (1) JavaScript validacija vrednosti na front-end-u; (2) Provera korišćenjem adekvatnih testova ili regularnih izraza na strani servera u back-end-u (moguće je i korišćenjem izričitih šema - Schema za validaciju ili drugim pristupima) i (3) provera na nivou baze podataka korišćenjem okidača nad samim tabelama baze podataka.
- Neophodno je napisati prateću projektnu dokumentaciju o izradi aplikacije koja sadrži (1) model baze podataka sa detaljnim opisom svih tabela, njihovih polja i relacija; (2) dijagram baze podataka; (3) dijagram organizacije delova sistema, gde se vidi veza između baze, back-end, front-end i korisnika sa opisom smera kretanja informacija; (4) popis svih aktivnosti koje su podržane kroz aplikaciju za sve uloge korisnika aplikacije prikazane u obliku Use-Case dijagrama; kao i (5) sve ostale elemente dokumentacije predviđene uputstvom za izradu dokumentacije po ISO standardu.
- Izrada oba dela aplikacije (projekata) i promene kodova datoteka tih projekata moraju da bude praćene korišćenjem alata za verziranje koda Git, a kompletan kôd aplikacije bude dostupan na javnom Git spremištu, npr. na besplatnim GitHub ili Bitbucket servisima, jedno spremište za back-end projekat i jedno za front-end projekat. Ne može ceo projekat da bude otpremljen u samo nekoliko masovnih Git commit-a, već mora da bude pokazano da je projekat realizovan u kontinuitetu, da su korišćene grane (branching), da je bilo paralelnog rada u više grana koje su spojene (merging) sa ili bez konflikata (conflict resolution).

## Uloge korisnika

**Manager**

- Prijava
- Listanje restorana
- Izmena restorana
- Dodavanje restorana
- Izmena radnog vremena restorana
- Izmena neradnih dana
- Dodavanje stolova
- Listanje svih rezervacija
- Promena statusa rezervacije

**Posetilac sajta**

- Prijava
- Registracija

**Korisnik**

- Prikaz svih restorana
- Listanje restorana po lokaciji
- Promena datuma rezervacije
- Promena trajanja rezervacije
- Listanje svih slobodnih stolova
- Pravljenje rezervacije

**Administrator**

- Prikaz svih lokacija
- Dodavanje lokacije
- Izmena lokacije

**Demo Administrator**

- username: admin
- passoword: admin123

**Demo Manager**

- email: lola@gmail.com
- passoword: Lola123
