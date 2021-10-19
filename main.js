const {Client, Intents, RichEmbed, Presence} = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

var DOORTK_ID = '175426174564958209';
// var GUILD_ID = '260226141204250624';
//////////////////////////////////////////////////////////////////

// var guild = client.guilds.cache.get(GUILD_ID);
var minutesBetweenBreaks = 60;
var activityTypePlaying = "PLAYING";
var startTime, endTime;
var hoursPlayed = 0;
var isInGame = false;

client.once('ready', () => 
{
    console.log(`Logged in as ${client.user.tag}!`);
    init();

    client.on('presenceUpdate', (oldPresence, newPresence) => 
    {
        var isThisDoorTK = oldPresence.userId === DOORTK_ID && newPresence.userId === DOORTK_ID;

        if(isThisDoorTK)
        {
            if(oldPresence.activities.length === 0)
            {
                var newActivity = newPresence.activities[0];
                var isPlayingGame = newActivity.type === activityTypePlaying;

                if(isPlayingGame)
                {
                    init();
                    isInGame = true;
                    console.log("DoorTK has STARTED playing " + newActivity.name + " at " + startTime.toLocaleString());
                }
            }
            else
            {                
                var oldActivity = oldPresence.activities[0];
                var isPlayingGame = oldActivity.type === activityTypePlaying;

                if(isPlayingGame)
                {
                    isInGame = false;
                    endTime = new Date();                    
                    var timePlayed = (endTime.getTime() - startTime.getTime()) / 1000 / 60;

                    console.log("DoorTK has STOPPED playing " + oldActivity.name + " at " + endTime.toLocaleString()
                    + "\n You played for " + timePlayed + " minutes.");                    
                }   
            }
        }        
    });
});

function init()
{
    startTime = new Date();
    endTime = null;
    hoursPlayed = 1;
};

setInterval(messageHandler, 10000);

function messageHandler()
{
    if(isInGame)
    {
        var currentTime = new Date().getTime();
        var minutesPlayed = (currentTime - startTime.getTime()) / 1000 / 60;
        
        console.log("minutes Played: " + minutesPlayed + "|||" + (minutesBetweenBreaks * hoursPlayed));    
        if(minutesPlayed >= (minutesBetweenBreaks * hoursPlayed))
        {
            messageUser(hoursPlayed++);
        }
    }
};

function messageUser(hoursPlayed)
{
    client.users.cache.get(DOORTK_ID).send(
            "Time to take a quick break!\nYou have been playing for "
            + hoursPlayed
            + " hours!"
        );
};


//////////////////////////////////////////////////////////////////
// must be last line in file
client.login('ODk3MjYxNzIzOTMxODAzNjY5.YWTGGQ.Nz-n_2l1lyglIO5I-nPavuSzeBk');
//////////////////////////////////////////////////////////////////