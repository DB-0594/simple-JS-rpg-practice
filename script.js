let xp = 0;
let health = 100;
let gold = 50;
let currentFeather = 0;
let tickling;
let monsterHealth;
let inventory = ["semiplume"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'semiplume', power: 5 },
  { name: 'hackle feather', power: 30 },
  { name: 'sickle feather', power: 50 },
  { name: 'Ultimate Golden Feather 2000', power: 100 }
];
const monsters = [
  {
    name: "fairy",
    level: 2,
    health: 15
  },
  {
    name: "deer friend",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to meadow", "Tickle dragon"],
    "button functions": [goStore, goMeadow, tickleDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "meadow",
    "button text": ["Tickle fairy", "Tickle deer friend", "Go to town square"],
    "button functions": [tickleFairy, tickleDeer, goTown],
    text: "You walk through the meadow. You see some creatures."
  },
  {
    name: "tickle",
    "button text": ["Tickle", "Dodge", "Prance away"],
    "button functions": [tickle, dodge, goTown],
    text: "You are tickling a creature."
  },
  {
    name: "tickle creature",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The creature laughs out loud "Ha ha!" as it wets itself. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You got tickled back, loser, and you soiled yourself. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You tickled the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goMeadow;
button3.onclick = tickleDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goMeadow() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentFeather < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentFeather++;
      goldText.innerText = gold;
      let newFeather = weapons[currentFeather].name;
      text.innerText = "You now have a " + newFeather + ".";
      inventory.push(newFeather);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentFeather = inventory.shift();
    text.innerText = "You sold a " + currentFeather + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function tickleFairy() {
  tickling = 0;
  goTickle();
}

function tickleDeer() {
  tickling = 1;
  goTickle();
}

function tickleDragon() {
  tickling = 2;
  goTickle();
}

function goTickle() {
  update(locations[3]);
  monsterHealth = monsters[tickling].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[tickling].name;
  monsterHealthText.innerText = monsterHealth;
}

function tickle() {
  text.innerText = "The " + monsters[tickling].name + " attacks.";
  text.innerText += " You tickle it with your " + weapons[currentFeather].name + ".";
  health -= getMonsterTickleValue(monsters[tickling].level);
  if (isMonsterTickled()) {
    monsterHealth -= weapons[currentFeather].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (tickling === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentFeather--;
  }
}

function getMonsterTickleValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterTickled() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the tickle from the " + monsters[tickling].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[tickling].level * 6.7);
  xp += monsters[tickling].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentFeather = 0;
  inventory = ["semiplume"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
