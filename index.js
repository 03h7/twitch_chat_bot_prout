const tmi = require('tmi.js');
const pb = require("@madelsberger/pausebuffer");

const { Pool, Client } = require('pg');

//import * as cooldownManager from './cooldownManager.mjs';

const pool = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

const insertNewUser = 'INSERT INTO scoreboard(username, score) VALUES($1, $2) RETURNING *'
const insertNewScore0 = 'UPDATE scoreboard SET score = score - 10 WHERE username = $1 RETURNING *'
const insertNewScore1 = 'UPDATE scoreboard SET score = score + 1 WHERE username = $1 RETURNING *'
const insertNewScore2 = 'UPDATE scoreboard SET score = score + 2 WHERE username = $1 RETURNING *'
const insertNewScore3 = 'UPDATE scoreboard SET score = score + 3 WHERE username = $1 RETURNING *'
const insertNewScore4 = 'UPDATE scoreboard SET score = score + 6 WHERE username = $1 RETURNING *'
const insertNewScore5 = 'UPDATE scoreboard SET score = score + 10 WHERE username = $1 RETURNING *'
const insertNewScore6= 'UPDATE scoreboard SET score = 0, goat=1 WHERE username = $1 RETURNING *'
const updateLastUser = 'UPDATE lastUser set username=$1, time=$2 returning *'

//var animaux = ['🐒','🐈','🦛','🐕','🐀','🐢','🐓','🐘','🐅','🐃','🐖','🐄','🐏','🐁','🐋','🐎','🐪','🦙','🦨','🐊','🦖','🐛','🏃','PEEPEES','🐡','🐌','🦕','🦗','🦃','🐦','🦘','🦜']

var animalst0 = ['kamelKot '] // -10 points 1%
var animalst1 = ['🐈','🐀','🐢','🐓','🐅','🐃','🐏','🐪','🦙','🐊','🦖','🐡','🐌','🦕','🦗','🦃','🐦','🦘','🦜','🏃'] // 1 point 67,7%
var animalst2 = ['🐘','🐕','🐄','🐎','🐛','🐋','🦨'] // 2 points 15%
var animalst3 = ['🦛','🐖','🐁'] // 3 points 10%
var animalst4 = ['🐒'] // 6 points 5%
var animalst5 = ['kamelPIPI '] // +10 points 1%
var animalst6 = ['🐐'] // Score remis à 0 0.3%

var weight = {0:0.01, 1:0.677, 2:0.15, 3:0.10, 4:0.05, 5:0.01, 6:0.003};


var cooldownManager = {
    cooldownTime: 5000,
    timeout : 5000,
    store: {
        '!prout': 1643904928876,
        'username': []
    },

    canUse: function(commandName) {
        // Check if the last time you've used the command + 30 seconds has passed
        // (because the value is less then the current time)
        return this.store[commandName] + this.cooldownTime < Date.now();
    },

    touch: function(commandName) {
        // Store the current timestamp in the store based on the current commandName
        this.store[commandName] = Date.now();
    },

    addUser: function(user) {
        if(this.store['username'].indexOf(user)>=0){
            return ;
        }else{
            this.store['username'].push(user);
        }
    },

    emptyUser: function() {
        this.store['username'] = [];
    },

    getUsers: function(){
        return this.store['username'];
    },

    setCooldown: function(time) {
        this.cooldownTime = time * 1000;
    }
}

opts = ({
	options: { 
        debug: false, 
        skipMembership: true, 
        skipUpdatingEmotesets: true, 
        joinInterval: 300, 
        updateEmotesetsTimer: 0
    },
	identity: {
		username: '03h8',
		password: process.env.TWITCH_OAUTH_TOKEN
	},
    connection: {
        secure: true,
        reconnect: true
    },
	channels: ['03h7', 'kamet0']
});

let client = pb.wrap(new tmi.Client(opts));

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	//if(self) return;
    var msg = message.trim();
    var name = `@${tags.username}`;
    var weightedRandom;
    var parsedWeightedRandom;

    if(msg.toLowerCase() === '!prout' ) {
        if(cooldownManager.canUse('!prout') &&  !checkUsername(cooldownManager.getUsers(), tags.username)) {
            weightedRandom = weightedRand(weight);
            parsedWeightedRandom = Number.parseInt(weightedRandom);

            switch(parsedWeightedRandom) {
                case 0:
                    let animalt0 = animalst0[Math.floor(Math.random() * animalst0.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt0} 💨`, 0);       
                    break;                 
                case 1:
                    let animalt1 = animalst1[Math.floor(Math.random() * animalst1.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt1}💨`, 0);
                    break;
                case 2:
                    let animalt2 = animalst2[Math.floor(Math.random() * animalst2.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt2}💨`, 0);
                    break;
                case 3:
                    let animalt3 = animalst3[Math.floor(Math.random() * animalst3.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt3}💨`, 0);
                    break;
                case 4:
                    let animalt4 = animalst4[Math.floor(Math.random() * animalst4.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt4}💨`, 0);
                    break;
                case 5:
                    let animalt5 = animalst5[Math.floor(Math.random() * animalst5.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt5} 💨`, 0);
                    break;
                case 6:
                    let animalt6 = animalst6[Math.floor(Math.random() * animalst6.length)];
                    client.say(channel,`@${tags.username}` + ", " + `${animalt6} 💨`, 0);
                    break;
            }
            
            let dd = new Date();
            let ddMonth = dd.getMonth()+1;
            lastTime = dd.getDate() + "/"+ ddMonth + " à " + increaseHour(dd.getHours()) +"h"+ dd.getMinutes() + "m";
            updateLastUserQuery(updateLastUser, [name, lastTime])
            var randomDelay = getRandomInt();
            console.log("Délai: " + randomDelay+"s");
            cooldownManager.setCooldown(randomDelay);
            cooldownManager.touch('!prout');
            cooldownManager.emptyUser();
        }else{
            cooldownManager.addUser(tags.username);
            //console.log("Usernames: "+cooldownManager.getUsers());
            return ;
        }
        //let animal = animaux[Math.floor(Math.random() * animaux.length)];
        //client.say(channel,`@${tags.username}` + ", " + `${animal}💨`, 0);
        //client.say(channel,`${animal}💨`, 0);
    }
            
    if(name==="@03h8"){
        var tier = 0;                
                
        let messageName = message.substring(
            message.indexOf("@") + 1, 
            message.lastIndexOf(",")
        );

        var d = new Date();
        console.log(messageName+ " : " + d);
        var messageNameArray = messageName.split();
                
        for(let i=0;i<=animalst1.length;i++){ 
            if(msg.indexOf('kamelKot')>0){
                //console.log("in 4");
                console.log("Tier "+0);
                tier=0;
                break;
            }
            if(msg.indexOf([animalst1[i]])>0){
                //console.log("in 1");
                console.log("Tier "+1);
                tier=1;
                break;
            }
            if(msg.indexOf([animalst2[i]])>0){
                //console.log("in 2");
                console.log("Tier "+2);
                tier=2;
                break;
            }
            if(msg.indexOf([animalst3[i]])>0){
                //console.log("in 3");
                console.log("Tier "+3);
                tier=3;
                break;
            }
            if(msg.indexOf([animalst4[i]])>0){
                //console.log("in 4");
                console.log("Tier "+4);
                tier=4;
                break;
            }
            if(msg.indexOf('kamelPIPI')>0){
                //console.log("in 4");
                console.log("Tier "+5);
                tier=5;
                break;
            }
            if(msg.indexOf([animalst6[i]])>0){
                //console.log("in 4");
                console.log("Tier "+6);
                tier=6;
                break;
            }
        }   
        //
        // ça marche bizarrement 
        //
        
        if(!insertNewUserQuery(insertNewUser, [messageNameArray[0],0])){
            switch(tier){
                case 0:
                    insertScoreQuery(insertNewScore0, [messageNameArray[0]])
                    break;
                case 1:
                    insertScoreQuery(insertNewScore1, [messageNameArray[0]])
                    break;
                case 2:
                    insertScoreQuery(insertNewScore2, [messageNameArray[0]])
                    break;
                case 3:
                    insertScoreQuery(insertNewScore3, [messageNameArray[0]])
                    break;
                case 4:
                    insertScoreQuery(insertNewScore4, [messageNameArray[0]])
                    break;
                case 5:
                    insertScoreQuery(insertNewScore5, [messageNameArray[0]])
                    break;
                case 6:
                    insertScoreQuery(insertNewScore6, [messageNameArray[0]])
                    break;
            }
        }else{
            return ;
        }
    }

});

function checkUsername(userArray, username){
    //console.log(userArray + " / " + username)
    if(userArray.indexOf(username)>=0){
        return true;
    }
    return false;
}

function weightedRand(spec) {
  var i, sum=0, r=Math.random();
  for (i in spec) {
    sum += spec[i];
    if (r <= sum) return i;
  }
}

function getRandomInt() {
    min = Math.ceil(180);
    max = Math.floor(1200);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function insertScoreQuery(text,val){
    pool.query(text, val, (err, res) => {
        if (err) {
            console.log("insert score")
            console.log(err.stack)
        } else {
            //console.log(res.rows[0])
        }
    })
}

/*
function getScoreQuery(text, val){
    pool.query(text,val, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res.rows[0])
        }
      })
}
*/

function insertNewUserQuery(text,val){
    pool.query(text, val, (err, res) => {
        if (err) {
            return false;
            console.log("insert user")
            console.log(err)
        } else {
            //console.log(res.rows[0])
            return true;
        }
    })
}

function updateLastUserQuery(text,val){
    pool.query(text, val, (err, res) => {
        if (err) {
            //return false;
            console.log("insert user")
            console.log(err)
        } else {
            //console.log(res.rows[0])
            //return true;
        }
    })
}

function increaseHour(hour){
    let hplus = hour+1;
    if(hplus==24){
        return '00';
    }
    return hplus;
}