USE railway;

DROP TABLE IF EXISTS codeQuestions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
   id int PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) NOT NULL,
   email VARCHAR(50) NOT NULL,
   password_hash VARCHAR(100) NOT NULL,
   created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) NULL
);

CREATE TABLE IF NOT EXISTS categories(
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL UNIQUE, -- 1. lägga till kategorinamn
     handout TEXT -- 2. handout för varje kategori
);
-- Lägger till direkt i backend, inte i frontend
INSERT IGNORE INTO categories(name, handout) -- handout text kort
VALUES
(
'Konstanter',
'
Konstanter i JavaScript deklareras med nyckelordet **const**.
En konstant är en variabel vars referens **inte kan ändras efter att den har skapats**.
Det betyder att du inte kan tilldela ett nytt värde till variabeln efter att den har deklarerats.

Konstanter används ofta för värden som inte ska förändras under programmets körning, till exempel konfigurationsvärden eller matematiska konstanter.

## Grundläggande exempel

    const age = 25;

Om man försöker ändra värdet:

    age = 30;

kommer JavaScript kasta ett fel eftersom `const` inte får tilldelas ett nytt värde.

## Varför använda const?

Att använda `const` gör koden mer förutsägbar och minskar risken för buggar.
Om du deklarerar något som konstant visar du tydligt för andra utvecklare att värdet inte ska ändras.

Exempel:

    const PI = 3.14159;

## const måste alltid få ett värde

Till skillnad från `let` måste en konstant **initialiseras direkt när den deklareras**.

Fel:

    const x;

Korrekt:

    const x = 10;

## const med objekt

`const` låser **referensen**, inte innehållet i objektet.

Det betyder att man fortfarande kan ändra egenskaper i objektet.

    const user = {
      name: "Sara",
      age: 25
    };

    user.age = 26;

Men detta fungerar inte:

    user = {};

## const med arrayer

Arrayer fungerar på samma sätt.

    const numbers = [1,2,3];

    numbers.push(4);

Det går alltså att ändra innehållet i arrayen, men inte själva referensen.

Fel:

    numbers = [5,6,7];

## Tumregel

I modern JavaScript används:

- **const** som standard
- **let** endast när ett värde verkligen behöver ändras

Detta gör kod mer stabil och lättare att förstå.'
),

(
'Loopar',
'
Loopar används för att **upprepa kod flera gånger**.
De är ett av de viktigaste verktygen i programmering eftersom de gör det möjligt att arbeta med listor, data och repetitiva uppgifter.

Istället för att skriva samma kod många gånger kan man använda en loop.

## For-loop

Den vanligaste loopen i JavaScript är **for-loopen**.

    for (let i = 0; i < 5; i++) {
      console.log(i);
    }

Denna kod skriver ut siffrorna 0 till 4.

Delarna betyder:

- `i = 0` startvärde
- `i < 5` villkor
- `i++` ökning efter varje varv

## When to use for-loop

For-loopar används ofta när man vet **hur många gånger** något ska köras.

Till exempel:

- loopa genom en lista
- upprepa en beräkning ett visst antal gånger

## While-loop

While-loopen körs så länge villkoret är sant.

    let i = 0;

    while (i < 5) {
      console.log(i);
      i++;
    }

Den används ofta när man **inte vet exakt hur många gånger loopen ska köras**.

## do...while

Denna loop kör **minst en gång** innan villkoret kontrolleras.

    let i = 0;

    do {
      console.log(i);
      i++;
    } while (i < 5);

## Loopar över arrayer

När man arbetar med arrayer används ofta:

    for (const value of arr) {
      console.log(value);
    }

eller

    arr.forEach(value => console.log(value));

Loopar används ofta för att bearbeta stora mängder data.'
),

(
'TypeScript',
'
TypeScript är ett **superset av JavaScript** som lägger till statisk typning.
Det betyder att man kan ange vilken typ en variabel ska ha.

Det hjälper utvecklare att upptäcka fel tidigare i utvecklingsprocessen.

## Exempel

    let age: number = 25;

Här talar vi om för TypeScript att `age` måste vara ett nummer.

Om man försöker sätta ett värde som inte är ett nummer kommer TypeScript visa ett fel.

## Vanliga typer

- string
- number
- boolean
- array
- object

Exempel:

    let name: string = "Anna";
    let isActive: boolean = true;

## Arrayer

Man kan ange vilken typ en array ska innehålla.

    let numbers: number[] = [1,2,3];

Det betyder att arrayen endast får innehålla nummer.

## Egna typer

Man kan skapa egna typer med `type`.

    type Person = {
      name: string;
      age: number;
    };

Sedan kan man använda typen:

    const user: Person = {
      name: "Sara",
      age: 25
    };

## Varför använda TypeScript?

Fördelar:

- hittar fel tidigare
- bättre autocompletion i editorn
- tydligare kod
- enklare att underhålla stora projekt'
),

(
'Metoder',
'
Metoder är funktioner som finns på objekt eller arrayer.
De används för att manipulera eller analysera data.

JavaScript har många inbyggda metoder som gör programmering enklare.

## includes()

Kontrollerar om ett värde finns i en array.

    fruits.includes("mango")

Returnerar `true` eller `false`.

## sort()

Sorterar en array.

    letters.sort()

## reverse()

Vänder ordningen på elementen i en array.

    numbers.reverse()

## Vanliga array-metoder

- map()
- filter()
- forEach()
- reduce()

Dessa används ofta i funktionell programmering.

## Exempel

    numbers.forEach(n => console.log(n));

Metoder gör kod kortare, tydligare och mer deklarativ.'
),

(
'Variabler',
'
Variabler används för att lagra data i ett program.
De är en av de mest grundläggande byggstenarna i programmering.

I JavaScript finns tre sätt att deklarera variabler:

- var
- let
- const

## let

`let` används när värdet kan ändras.

    let count = 0;
    count = count + 1;

## const

`const` används när värdet inte ska ändras.

    const name = "Anna";

## var

`var` är äldre syntax och används sällan i modern JavaScript eftersom den kan skapa problem med scope.

## Scope

Scope beskriver **var en variabel kan användas i koden**.

Variabler som deklareras inne i ett block finns bara tillgängliga där.

Variabler är grunden i nästan all programmering eftersom de gör det möjligt att lagra och manipulera data.'
),

(
'Funktioner',
'
Funktioner är återanvändbar kod.
De gör det möjligt att samla logik i ett block som kan köras flera gånger.

Det gör koden mer organiserad och minskar duplicering.

## Vanlig funktion

    function add(a, b) {
      return a + b;
    }

Denna funktion tar två parametrar och returnerar summan.

## Arrow function

    const add = (a, b) => {
      return a + b;
    };

Arrow functions är en kortare syntax för funktioner.

## När används funktioner?

Funktioner används för att:

- dela upp kod i mindre delar
- återanvända logik
- göra kod mer läsbar
- organisera program

Funktioner är en central del av nästan all JavaScript-kod.'
),

(
'Arrayer',
'
Arrayer används för att lagra flera värden i en lista.

Det är en av de vanligaste datastrukturerna i JavaScript.

## Exempel

    const numbers = [1,2,3,4];

## Index

Man kan komma åt värden via index.

    numbers[0]

Index börjar alltid på **0**, vilket betyder att första elementet ligger på position 0.

## Vanliga operationer

- lägga till värden
- ta bort värden
- loopa igenom listor
- filtrera data

## Vanliga metoder

    numbers.push(5)
    numbers.pop()
    numbers.map()
    numbers.filter()

Arrayer används ofta tillsammans med loopar och metoder för att hantera stora mängder data.'
),

(
'Objekt',
'
Objekt används för att lagra data i form av **nyckel-värde par**.

De används ofta för att representera mer komplex data.

## Exempel

    const user = {
      name: "Sara",
      age: 25
    };

Här är `name` och `age` egenskaper på objektet.

## Åtkomst

Man kan komma åt värden så här:

    user.name

eller

    user["name"]

## Ändra värden

    user.age = 26;

## Varför använda objekt?

Objekt används för att representera strukturerad data i applikationer, till exempel:

- användare
- produkter
- inställningar
- API-svar

De är en av de viktigaste datastrukturerna i JavaScript.'
);

-- Lägg till flera kategorier
CREATE TABLE IF NOT EXISTS codeQuestions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Tog bort codeTitle, ta bort i frontend
    categoryId INT,
    codeQuestion VARCHAR(100) NOT NULL,
    codeAnswer VARCHAR(150) NOT NULL,

    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);
-- Lägg till en fråga i varje kategori för att testa
INSERT IGNORE INTO codeQuestions(categoryId, codeQuestion, codeAnswer)
VALUES
    -- 1. Konstanter
    (1, 'Tilldela konstanter (a, b, c) med värdena (1, 2, 3). Använd bara const en gång', 'const a = 1, b = 2, c = 3'),
    (1, 'Initiera en tom array "arr" med let', 'let arr = []'),
    (1, 'Initiera ett nytt Map objekt som konstanten "map"', 'const map = new Map()'),

    -- 2. Loopar
    (2, 'Skriv en enkel for-loop, som loggar från 0-4', 'for (let i = 0; i < 5; i++) { console.log(i) }'),
    (2, 'Deklarera "i" till 0, och gör en do-while loop där du konsol-loggar i 5 gånger. Använd i++ inom loggen.', 'let i = 0 do { console.log(i++) } while (i < 5)'),
    (2, 'Du har redan en array "arr" med värden [3, 5, 7], konsol-logga värdena med en for...in med konstanten "i"', 'for (const i in arr) { console.log(i) }'),
    (2, 'Du har en array "dogs" med hundraser. Använd array-metoden forEach() på arrayen med en arrow-funktion som loggar varje "dog"', 'dogs.forEach(dog => console.log(dog))'),

    -- 3. TypeScript (blandat)
    (3, 'Gör en type "Person", med egenskaper namn och ålder med rätt datatyper', 'type Person = { name: string; age: number; }'),
    (3, 'Initiera en tom array "arr" som ska bara ska innehålla siffror', 'let arr: number[] = []'),
    (3, 'Deklarera "isActive" som sann med let', 'let isActive: boolean = true'),
    (3, 'Gör en konstant "add", gör den till en arrow-funktion med "a" och "b" som parametrar. Ge parametrar och returresultat till typen  number.', 'const add = (a: number, b: number): number => a + b'),

    -- 4. Metoder (blandade datatyper)
    (4, 'Du har redan en array "fruits" med frukter. Frukten mango finns i arrayen. Använd array-metoden includes() och få tillbaks en boolean som bevis att den finns i arrayen.', 'fruits.includes("mango")'),
    (4, 'Du har redan en osorterad array "bokstäver". Använd en metod för att sortera arrayen i bokstavsordning', 'bokstäver.sort()'),
    (4, 'Du har en array "numbers" med värden [3, 5, 7]. Använd en metod som vänder ordningen på värdena i arrayen till [7, 5, 3]', 'numbers.reverse()'),
    (4, 'Gör en konstant "add", använd en arrow-funktion för att addera "x" med "x"', 'const add = x => x + x'),
    (4, 'Gör en konstant "hello", använd en parameterfri arrow-funktion som konsol-loggar "hello there"', 'const hello = () => console.log("hello")')
;
-- Junction table : bara om kategorier koppas till flera frågor
# CREATE TABLE IF NOT EXISTS categories_codeQuestions(
#     categoryId INT, -- ökar redan i FK
#     questionId INT, -- ökar reda i FK
#
#     PRIMARY KEY (categoryId, questionId),
#     FOREIGN KEY (categoryId) REFERENCES categories(id),
#     FOREIGN KEY (questionId) REFERENCES codeQuestions(id)
# );
