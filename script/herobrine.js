const mineflayer = require('mineflayer');
const { Vec3 } = require('vec3');

function createHerobrine(name = 'Herobrine') {
  const bot = mineflayer.createBot({
    host: 'localhost', // it:Cambia con l'IP del tuo server minecraft eng: Change it with your minecraft server IP
    port: 25565,
    username: name
  });

  const creepyMessages = [
    "I see you...",
    "I'm watching.",
    "You shouldn't be here.",
    "Run.",
    "You can't hide forever.",
    "Leave this world."
  ];

  bot.once('spawn', () => {
    console.log(`${name} è entrato...`);

   
    setInterval(() => {
      const msg = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
      bot.chat(msg);
    }, 30000);

   
    setInterval(() => {
      // Creative per teletrasporto e strutture
      bot.chat(`/gamemode creative ${bot.username}`);

      bot.chat(`/tp ${bot.username} @r`);

      // Fulmine
      setTimeout(() => {
        bot.chat(`/execute at ${bot.username} run summon lightning_bolt`);
      }, 500);


      setTimeout(() => {
        buildCross(bot);
      }, 1000);

      // TP in alto per "sparire"
      setTimeout(() => {
        bot.chat(`/tp ${bot.username} ~ ~100 ~`);
      }, 2000);


      setTimeout(() => {
        bot.chat(`/gamemode survival ${bot.username}`);
      }, 3000);

      // Sparisce e si disconnette (facoltativo)
      setTimeout(() => {
        bot.quit();
      }, 5000);

    }, 45000);


    setInterval(() => {
      const players = Object.values(bot.players).filter(p => p.username !== bot.username && p.entity);
      if (!players.length) return;

      const target = players.reduce((closest, p) => {
        const dist = bot.entity.position.distanceTo(p.entity.position);
        return dist < closest.dist ? { player: p, dist } : closest;
      }, { player: null, dist: Infinity }).player;

      if (target && target.entity) {
        bot.lookAt(target.entity.position.offset(0, 1.6, 0)); // guarda in faccia
      }
    }, 1000);

    // Attacca i player vicini
    setInterval(() => {
      const players = Object.values(bot.players).filter(p => p.username !== bot.username && p.entity);
      players.forEach(p => {
        const dist = bot.entity.position.distanceTo(p.entity.position);
        if (dist < 3) {
          bot.attack(p.entity);
          bot.chat("§4Herobrine: You can't escape.");
        }
      });
    }, 1500);


    setInterval(() => {
      bot.chat(`/execute as @e[type=!player,limit=1,sort=random] run tp ${bot.username} ~ ~ ~`);
    }, 60000);


    setInterval(() => {
      if (Math.random() < 0.5) {
        const miniName = 'MiniHerobrine_' + Math.floor(Math.random() * 10000);
        createHerobrine(miniName);
      }
    }, 90000);
  });

  // Quando scompare, ritorna dopo 15s
  bot.on('end', () => {
    console.log(`${name} è sparito...`);
    setTimeout(() => createHerobrine(name), 15000);
  });

  bot.on('error', console.log);
}

// Costruisce croce 3x3 attorno al bot
function buildCross(bot) {
  const base = bot.entity.position.offset(0, -1, 0);
  const blocks = [
    base,
    base.offset(0, 1, 0),
    base.offset(0, 2, 0),
    base.offset(1, 1, 0),
    base.offset(-1, 1, 0)
  ];
  blocks.forEach(pos => {
    bot.chat(`/setblock ${Math.floor(pos.x)} ${Math.floor(pos.y)} ${Math.floor(pos.z)} stone`);
  });
}

createHerobrine();
