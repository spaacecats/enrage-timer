
module.exports = function EnrageTimer(dispatch) {
	const {protocol} = require('tera-data-parser'),
		Slash = require('./slash')
	let enragedTimer = null,
		totalTimer = null,
		enragedTime = 36,
		enraged = false,
		engaged = false,
		enabled = false,
		player = null,
		boss = null,
		totalTime = 0,
		totalEnragedTime = 0,
		SEND_TO_PARTY = false
		MESSAGE_SENDER = 'E-T',
		channelNumber = 21;
	

  dispatch.hook('S_LOGIN', 1, (event) => { player = event })
 

  dispatch.hook('S_BOSS_GAGE_INFO', 1, (event) => {
    if (!enabled) return
    boss = event
	if (boss.maxHp == boss.curHp) {
	engaged = false
	totalTime = 0
		if(totalTimer)clearInterval(totalTimer)}
	if (boss.curHp !== boss.maxHp && !engaged){
		engaged = true;
		totalTimer = setInterval (() => {totalTime +=1},1000)}
    if (boss.curHp == 0) {
		totalMinute = Math.floor(totalTime / 60)
		if (totalMinute < 10){totalMinute = "0"+totalMinute;}
		totalSecond = (totalTime % 60)
		if (totalSecond < 10){totalSecond = "0"+totalSecond;}
		enragedMinute = Math.floor(totalEnragedTime / 60)
		if (enragedMinute < 10){enragedMinute = "0"+enragedMinute;}
		enragedSecond = (totalEnragedTime % 60)
		if (enragedSecond < 10){enragedSecond = "0"+enragedSecond;}
		enragedPercent = Math.floor(totalEnragedTime / (totalTime * 0.01))
	var messageString = (enraged == true) ? `Boss killed. Stopping with ${enragedTime}s of enrage time left.` : `Boss killed. Stopping Enrage Timer.`;
		sendChatMessage(messageString)
		sendChatMessage(`Boss was enraged for `+enragedMinute+`:`+enragedSecond+`/`+totalMinute+`:`+totalSecond+` (`+enragedPercent+`% of the fight).`)
		if (enragedTimer) clearInterval(enragedTimer)
		if (totalTimer) clearInterval (totalTimer)
		totalTime = 0
		totalEnragedTime = 0
		enragedTime = 36
		enraged = false
		engaged = false
    }
  })
  

  dispatch.hook('S_NPC_STATUS', 1, (event) => {
    if (enabled === false) return
    if (boss && boss.id - event.creature == 0) {
      if (event.enraged == 1 && !enraged) {
        enraged = true
        sendChatMessage(`** Boss enraged for next 36s **`)
        enragedTimer = setInterval(() => {
          switch (enragedTime) {
            case 20:
              sendChatMessage(`** 20s left on enrage **`)
              break
            case 10:
              sendChatMessage(`** 10s left on enrage **`)
              break
            case 0:
              nextEnragePercent = Math.floor(boss.curHp / (boss.maxHp * 0.01) - 10)
	messageString = (nextEnragePercent > 0) ? `** Unenraged ** Next enrage at ${nextEnragePercent}%.` : `** Unenraged **`;
              sendChatMessage(messageString)
              clearInterval(enragedTimer)
              enragedTime = 36
              enraged = false
              break
          }
		  totalEnragedTime += 1
          enragedTime -= 1
        }, 1000)
      }
    }
  })
  
 const slash = new Slash(dispatch)
	slash.on('et', (args) => {
		Commands(args)
	})
	
   function Commands (args){
    if (args[1] == 'party') {
		enabled = true
		SEND_TO_PARTY = true 
        message(` !!! PARTY NOTICE ENABLED !!!`);
    }  
	else if (args[1] == 'off') {
		if (enabled) {
        	enabled = false
		SEND_TO_PARTY = false
		channelNumber = 0
		if (totalTimer) clearInterval(totalTimer)
        	if (enragedTimer) clearInterval(enragedTimer)
		totalTime = 0
		totalEnragedTime = 0
          	enragedTime = 36
		engaged = false
          	enraged = false
          	boss = null
        
        message(` Enrage Notice DISABLED`);
      } 
    }
	else if (args[1] == 'p' || args[1] == 'private') {
		if (args[2] > 0 && args[2] < 9){
		n = parseInt(args[2]);
		channelNumber = n +10;
		}
		else{
		channelNumber = 11;
		}
		SEND_TO_PARTY = false
		enabled = true
		message(` Private Chat:[${channelNumber - 10}] Notice ENABLED`)
	}
	else if(args[1] == 'n' || args[1] == 'notice'){
		channelNumber = 21
		SEND_TO_PARTY = false
		enabled = true
		message(` Private Notice ENABLED`)
		}
	else if (args[1] == 'state'){
		message(`[ENABLED: ${enabled}][PARTY: ${SEND_TO_PARTY}][CHANNEL: ${channelNumber}][NAME: ${MESSAGE_SENDER}]`);
	}
	else if (args[1] == 'name'){
		 if (args[2] == null){
			return false}
		else
			MESSAGE_SENDER = args[2]
			message(` Message sender is now: ${args[2]}`)
	}
	return false
  }


  function sendChatMessage(message) {
      if (SEND_TO_PARTY) {
        dispatch.toServer('C_CHAT', 1, {
          channel: 21,
          message: `<FONT>${message}</FONT>`
        })
      } else {
        dispatch.toClient('S_CHAT', 1, {
          channel: channelNumber,
          authorID: { high: 0, low: 0 },
          unk1: 0,
          gm: 0,
          unk2: 0,
          authorName: MESSAGE_SENDER,
          message: `<FONT>${message}</FONT>`
        })
      }
  }

  function message(msg) {
	dispatch.toClient('S_CHAT', 1, {
		channel: 24,
		authorID: 0,
		unk1: 0,
		gm: 0,
		unk2: 0,
		authorName: '',
		message: '[Enrage-timer]' +msg
	});
	}
}
