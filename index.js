module.exports = function Actioner(dispatch) {
	
    const command = dispatch.require.command || dispatch.command;
	let name;
	let gameId = 0n;
	let job;
	
		command.add('as', {
			$default() { 
				dispatch.settings.enabled = !dispatch.settings.enabled;
				let txt = (dispatch.settings.enabled) ? 'ENABLED' : 'DISABLED';
				message('Action Stater is now: ' + txt, true);
			}
		});
	
	dispatch.hook(`S_LOGIN`, 14, (event) => {
		gameId = event.gameId;
		name = (dispatch.settings.name=="")?event.name:dispatch.settings.name;
		job = (event.templateId - 10101) % 100;
	})
	
	dispatch.hook(`S_ACTION_STAGE`, 9, {order : Infinity, filter : { fake: null } }, (event) => {
	 if(!dispatch.settings.enabled) return;
	 if(event.gameId != gameId) return;
		if(dispatch.settings[job][Math.floor(event.skill.id/10000)]["cast"][event.skill.id%10]["stage"][event.stage] != ""){
			dispatch.send('S_CHAT', 3, {
				name,
				message : dispatch.settings[job][Math.floor(event.skill.id/10000)]["cast"][event.skill.id%10]["stage"][event.stage],
				channel : dispatch.settings.channel,
				gameId,
				isWorldEventTarget : false,
				gm : false,
				founder : false
			})
		}
	});
	
    function message(msg, chat = false) {
        if (chat == true) {
            command.message('(Actioner) ' + msg);
        } else {
            console.log('(Actioner) ' + msg);
        }
    }
}
//thanks Pinkie for help with gathering data