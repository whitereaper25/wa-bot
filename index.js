const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
    ProxyAgent,
    GroupSettingChange,
    waChatKey,
   mentionedJid,
   processTime
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const ms = require('parse-ms') 
const toMs = require('ms')
const cd = 4.32e+7
const moment = require('moment-timezone')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const request = require('request')
const tiktod = require('tiktok-scraper')
const brainly = require('brainly-scraper')
const imgbb = require('imgbb-uploader')
const ffmpeg = require('fluent-ffmpeg')
const speed = require('performance-now')
const { removeBackgroundFromImageFile } = require('remove.bg')
const setting = JSON.parse(fs.readFileSync('./src/settings.json')) //setting
prefix = setting.prefix
welcome = setting.welcome
leave = setting.leave
cr = setting.cr
blocked = []

const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:MY OWNER\n' 
            + 'ORG: Creator Bot Whatsapp;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=919080896537:+91 9080896537\n' //Set contack owner
            + 'END:VCARD' 

//FILE JSON
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const antilink = JSON.parse(fs.readFileSync('./src/antilink.json'))
        
//FUNCTION
function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}
//starts?
async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./FDL.json') && client.loadAuthInfo('./FDL.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected sukses...')
	})
	await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./FDL.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `${welcome}@${num.split('@')[0]}`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `${leave}@${num.split('@')[0]}`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	client.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})
    
    
	client.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = setting.apiKey 
			const koin = ['http://bit.ly/Koin1','http://bit.ly/Koin5','https://i.ibb.co/q7kdBjm/be27e6f849da.jpg','https://i.ibb.co/BCxNPD5/a42ef753a321.jpg']
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			var Link = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
			const messagesLink = Link.slice(0).trim().split(/ +/).shift().toLowerCase()
			var pes = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
            client.chatRead()
            
			mess = {
				wait: 'Process...',
				success: 'Success...',
				error: {
					stick: '*IT IS ERROR-WE WILL REPAIR IMMEDIATELY*',
					Iv: '*Invalid link*'
				},
				only: {
					group: 'Sorry Command cant be used in digroup',
					ownerG: 'Sorry. This command can only be used by the owner group. ',
					ownerB: 'This command is only for the owner !!',
					admin: 'This command can only be used by group admins !!',
					Badmin: 'Make the bot an admin, to use this command !!'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`]
			const isGroup = from.endsWith('@g.us')
			const totalchat = await client.chats.all()
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : undefined
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const freply = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "*BOT WHATSAPP*", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('src/imagee.jpeg')} } }
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
			client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehhe, teks) => {
			client.sendMessage(hehhe, teks, text)
			}
			const sendImage = (teks) => {
		    client.sendMessage(from, teks, image, {quoted:mek})
		    }
		    const costum = (pesan, tipe, target, target2) => {
			client.sendMessage(from, pesan, tipe, {quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target2}` }}})
			}
		    const sendPtt = (teks) => {
		    client.sendMessage(from, audio, mp3, {quoted:mek})
		    }
		    const costumimg = ( pesan , tipe, target , caption) => {
			client.sendMessage(from, pesan , tipe , {quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: {"imageMessage":{url: 'https://mmg.whatsapp.net/d/f/Ahj0ACnTjSHHm6-HjqAUBYiCu2-85zMZp_-EhiXlsd6A.enc',mimetype: 'image/jpeg',caption: `${caption}`,fileSha256: '0Pk0qJyQFn9FCtslZrydJHRQDKryjYcdP7I3CmRrHRs=',fileLength: '20696',height: 360,width: 382,mediaKey: 'N43d/3GY7GYQpgBymb9qFY5O9iNDXuBirXsNZk+X61I=',fileEncSha256: 'IdFM58vy8URV+IUmOqAY3OZsvCN6Px8gaJlRCElqhd4=',directPath: '/v/t62.7118-24/35174026_475909656741093_8174708112574209693_n.enc?oh=2a690b130cf8f912a9ca35f366558743&oe=6061F0C6',mediaKeyTimestamp: '1614240917',jpegThumbnail: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMASAMBIgACEQEDEQH/xAAwAAADAAMBAAAAAAAAAAAAAAAABAUBAwYCAQADAQEAAAAAAAAAAAAAAAABAgMABP/aAAwDAQACEAMQAAAAoy6kcWS2eH8miq17B553Thh1BgyTY9iULYfndGBmbSwNEV3eWXpjwZElG09WJckXCj8sWBVc1ZKXj2ZYaoWHnc67K3PbKwtZOqzLrzdQAg5fWFRUeCNTQG2pEKJ0wCD/xAAoEAACAgIBAQkAAwEAAAAAAAABAgADBBEScQUQEyEiMTJBYSNRYmP/2gAIAQEAAT8AaZzfEdwWcGMTE1jNv3M1ozDb+SD2jTO+Yigk6A3KqhseIdfkroTYbXQRrkVuJOplKEuOpjtpxF+IjTO+YnZoBvj4pa/msHtMnHZrgymZ6hCnSJsDl+ys7rTpGmevxMwLFS/1fcA7iNzPsDXaH1NccYH+2lJ1SnSNMlmekbY6iYGa9g4OJzXW9zI7SBJrpjqxsA9zMkcMetf2V7NKD/McgAkxsis7EcA2fkxkqSkaYbMGRu3hr0x6q6ckufaUMpsexj0ma4Y0qDKhqlektyntXiQO4qWI0PONVZWNsNTmZwewekEwo1fpYaMZdvWf2DYrXoO/ARWLNL6VuXiYcSsuK9eXGYtHhM/nsTPVQgb7iDkydRCNBYYx1Ozj6nmSStRIgJ8UH/nMJiTZs/c7RPwExhu+vrH+p//EAB4RAAIBBAMBAAAAAAAAAAAAAAABAhAREjIhMDFC/9oACAECAQE/AOpJsxEqIj4TfNqXygIWpLc+ZEdBH//EAB4RAAICAgIDAAAAAAAAAAAAAAABAjEQETJBAxJx/9oACAEDAQE/AHWVeHQtYrDaNkno7GOzxP10xzWipDHZHidx+EuQz//Z',scansSidecar: 'choizTOCOFXo21QcOR/IlCehTFztHGnB3xo4F4d/kwmxSJJIbMmvxg==',scanLengths: [Array],midQualityFileSha256: '68OHK4IyhiKDNgNAZ3SoXsngzYENebQkV4b/RwhhYIY=',midQualityFileEncSha256: '2EYOLCXx+aqg9RyP6xJYChQNbEjXZmc0EcSwHzoyXx0='}}}})
			}
			const mentions = (teks, memberr, id) => {
			(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
			const sendFakeStatus = (from, teks, faketeks) => {
			client.sendMessage(from, teks, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./menu/alfira.jpg`)} } } })
			}
			
	const sotoy = [
		'🍊 : 🍒 : 🍐',
		'🍒 : 🔔 : 🍊',
		'🍇 : 🍇 : 🍇',
		'🍊 : 🍋 : 🔔',
		'🔔 : 🍒 : 🍐',
		'🔔 : 🍒 : 🍊',
        '🍊 : 🍋 : 🔔',		
		'🍐 : 🍒 : 🍋',
		'🍐 : 🍐 : 🍐',
		'🍊 : 🍒 : 🍒',
		'🔔 : 🔔 : 🍇',
		'🍌 : 🍒 : 🔔',
		'🍐 : 🔔 : 🔔',
		'🍊 : 🍋 : 🍒',
		'🍋 : 🍋 : 🍌',
		'🔔 : 🔔 : 🍇',
		'🔔 : 🍐 : 🍇',
		'🔔 : 🔔 : 🔔',
		'🍒 : 🍒 : 🍒',
		'🍌 : 🍌 : 🍌'
		]
		
		   if (messagesLink.includes("://chat.whatsapp.com/")){
		   if (!isGroup) return
		   if (!isAntiLink) return
		   if (isGroupAdmins) return 
		   client.updatePresence(from, Presence.composing)
		   if (messagesLink.includes("#izinmin")) return 
		   if (messagesLink.includes("#iziadmin")) return 
		   if (messagesLink.includes("Izinmin")) return 
		   if (messagesLink.includes("izinmin")) return 
	       var Kick = `${sender.split("@")[0]}@s.whatsapp.net`
	       setTimeout( () => {
		   reply('Byee,good luck on your way to hell....')
	       }, 1100)
		   setTimeout( () => {
		   client.groupRemove(from, [Kick]).catch((e) => {reply(`*ERROR:* ${e}`)}) 
			}, 1000)
		    setTimeout( () => {
		    reply(`「 *Link Group Terdeteksi* 」 *KAMU MENGIRIM LINK GROUP* maaf *${pushname}* anda akan di kick`)
		    }, 0)
		    }

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			let authorname = client.contacts[from] != undefined ? client.contacts[from].vname || client.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }	
			
			function addMetadata(packname, author) {	
				if (!packname) packname = 'RR-018'; if (!author) author = 'FDL';	
				author = author.replace(/[^a-zA-Z0-9]/g, '');	
				let name = `${author}_${packname}`
				if (fs.existsSync(`./src/stickers/${name}.exif`)) return `./src/stickers/${name}.exif`
				const json = {	
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

				let len = JSON.stringify(json).length	
				let last	

				if (len > 256) {	
					len = len - 256	
					bytes.unshift(0x01)	
				} else {	
					bytes.unshift(0x00)	
				}	

				if (len < 16) {	
					last = len.toString(16)	
					last = "0" + len	
				} else {	
					last = len.toString(16)	
				}	

				const buf2 = Buffer.from(last, "hex")	
				const buf3 = Buffer.from(bytes)	
				const buf4 = Buffer.from(JSON.stringify(json))	

				const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

				fs.writeFile(`./src/stickers/${name}.exif`, buffer, (err) => {	
					return `./src/stickers/${name}.exif`	
				})	

			}
			switch(command) {
				case 'help':
				case 'menu':
				   client.sendMessage(from, help(pushname, prefix, time), text, {quoted: freply, contextInfo: { forwardingScore: 508, isForwarded: true }})
				   break
				case 'donasi':
				case 'donate':
				case 'nyumbang':
			       rizkii = `*──「 PAYMENT 」──*\n*Premium : 0k/Bulan*\n*Buat Bot : 10k*\n- Gopay : no need\n- Dana : no need\n- Pulsa : no need\n\n*──「 THANKS YOU 」──* `
			       client.sendMessage(from, rizkii, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "Donasi yah:(", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('./src/imagee.jpeg')} } }, caption: rizkii })
		           break
			   case 'runtime':
		            uptime = process.uptime()
		            run = `「 *RUNTIME* 」\n${kyun(uptime)}`
                    client.sendMessage(from, run, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "video/mp4", "caption": "_Runtime_", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('./src/imagee.jpeg')} } }, caption: run })
			        break
				case 'info':
					me = client.user
					teks = `HAI ${pushname}👋\n\n_INFO BOT_\n-> Name bot : *KURAMA BOT*\n-> Creator : *NARUTO*\n-> Owner : *NARUTO*\n-> Prefix : *${prefix}*\n-> Versi Whatsapp : *${client.user.phone.wa_version}*\n-> Server : *${client.browserDescription}*\nBrowser : *${client.browserDescription[1]}*\nVersi : *${client.browserDescription[2]}*\n\nSPESIAL THANKS TO👑\n|•> SOUL REAPERS`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
				    break
				case 'bug':
                    const pesan = body.slice(5)
                    if (pesan.length > 300) return client.sendMessage(from, 'Maaf Teks Terlalu Panjang, Maksimal 300 Teks', msgType.text, {quoted: mek})
                    var nomor = mek.participant
                    const teks1 = `「 *REPORT* 」\nNomor : @${nomor.split("@s.whatsapp.net")[0]}\nPesan : ${pesan}`
                    var options = {
                    text: teks1,
                    contextInfo: {mentionedJid: [nomor]},
                    }
                   client.sendMessage('919080896537@s.whatsapp.net', options, text, {quoted: mek})
                    reply('Sorry for the inconvenience, we will fix it as soon as possible.')
                    break 
				case 'blocklist':
				     teks = 'This is list of blocked number :\n'
					 for (let block of blocked) {
					 teks += `-> @${block.split('@')[0]}\n`
					  }
				     teks += `Total : ${blocked.length}`
				     client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					 break
				case 'ocr':
					  if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					  const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					  const media = await client.downloadAndSaveMediaMessage(encmedia)
				      reply(mess.wait)
				      await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
				      .then(teks => {
					  reply(teks.trim())
					  fs.unlinkSync(media)
					   })
					  .catch(err => {
					  reply(err.message)
					  fs.unlinkSync(media)
					   })
				       } else {
					   reply('Just a photo, bro')
				       }
				       break
				case 'stiker':
				case 'sticker':
				case 'stickergif':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('FDL','RR-018')} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)	
								})
								/*client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('FDL',' RR-018')} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)
									fs.unlinkSync(ran)
								})
								/*client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'bcAvZyjYAjKkp1cmK8ZgQvWH'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								exec(`webpmux -set exif ${addMetadata('FDL','RR-018')} ${ranw} -o ${ranw}`, async (error) => {
									if (error) return reply(mess.error.stick)
									client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
									fs.unlinkSync(ranw)
								})
								//client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Send the image with the caption ${prefix} sticker or the image tag that has been sent`)
					}
					break
				case 'searchsticker': 
                case 'searchstiker': 
                    ranp = getRandom('.png')
                    rano = getRandom('.webp')
                    anu = await fetchJson(`https://api.zeks.xyz/api/searchsticker?apikey=apivinz&q=${body.slice(14)}`, {method: 'get'})
                    buffer = await getBuffer(anu.thumb)
                    teks = `Judul Sticker : ${anu.title}`
                    dung = (anu.sticker)
                    client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
                    var tes2 =  dung[Math.floor(Math.random() * dung.length)];
                    exec(`wget ${tes2} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
	                if (err) return reply('Terjadi kesalahan')
				    fs.unlinkSync(ranp)
				    buffer2 = fs.readFileSync(rano)
				    client.sendMessage(buffer2, sticker, {quoted: mek})
				    fs.unlinkSync(rano)
				     })
				    break
		       case 'linesticker':
		            ranp = getRandom('.gif')
		            rano = getRandom('.webp')
		            anu = await fetchJson(`https://api.zeks.xyz/api/linesticker?link=${args[0]}&apikey=apivinz`, {method: 'get'})
		            dung = (anu.sticker)
		            var tes2 =  dung[Math.floor(Math.random() * dung.length)];
		            exec(`wget ${tes2} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
			        if (err) return reply('Terjadi kesalahan')
					fs.unlinkSync(ranp)
					buffer = fs.readFileSync(rano)
					client.sendMessage(buffer, sticker, {quoted: mek})
					fs.unlinkSync(rano)
					})
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('Reply Sticker')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Sukses...'})
						fs.unlinkSync(ran)
					})
					break
			   //media
				case 'tiktokstalk':
					try {
					if (args.length < 1) return client.sendMessage(from, 'Usernamenya mana um?', text, {quoted: mek})
					let { user, stats } = await tiktod.getUserProfileInfo(args[0])
					reply(mess.wait)
					teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
					buffer = await getBuffer(user.avatarLarger)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
					console.log(`Error :`, color(e,'red'))
					reply('Kemungkinan username tidak valid')
					}
					break
				case 'igstalk':
			        anu = await fetchJson(`https://api.zeks.xyz/api/igstalk?apikey=apivinz&username=${body.slice(9)}`, {method: 'get'})
			        buffer = await getBuffer(anu.profile_pic)
			        iyaa = `「 *IG STALK* 」\n\nUsername : ${anu.username}\nFullname : ${anu.fullname}\nFollower : ${anu.follower}\nFollowing : ${anu.following}\nVerified : ${anu.is_verified}\nBussiness : ${anu.is_bussiness}\nPrivate : ${anu.is_private}\nLink : https://www.instagram.com/${anu.username}\nBio : ${anu.bio}`
                    client.sendMessage(from, buffer, image, {quoted: mek, caption: iyaa})
                    break
			   case 'igsearch': 
                    anu = await fetchJson(`https://api.zeks.xyz/api/iguser?apikey=apivinz&q=${body.slice(8)}`, {method: 'get'})
                    teks = '--!]---🖕🖕---[!---\n'
					for (let i of anu.result) {
					teks += `Username : ${i.username}\nPrivate : ${i.private_user}\nVerified : ${i.verified_user}\nLink : https://www.instagram.com/${i.username}`
					}
					reply(teks.trim())
					break
				case 'tts': 
				    if (args.length < 1) return reply('Masukan text')
				    hm = body.slice(4)
                    var i2d = hm.split("|")[0];
                    var teks = hm.split("|")[1];
                    anu = await getBuffer(`https://api.zeks.xyz/api/tts?code=${i2d}&text=${teks}`)
                    client.sendMessage(from, anu, audio, { mimetype: 'audio/mp4', quoted : mek, ptt: true })
                    break
				case 'gtts': //sering bug 
					if (args.length < 1) return client.sendMessage(from, 'Kode bahasanya mana om?', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Textnya mana om', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					dtt.length > 600
					? reply('Textnya kebanyakan om')
					: gtts.save(ranm, dtt, function() {
					client.sendMessage(from, fs.readFileSync(ranm), audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
					fs.unlinkSync(ranm)
					})
					break
				case 'apkmod':
					gatauda = body.slice(7)
					anu = await fetchJson(`https://rfilesss109.000webhostapp.com/mod.php?apikey=xptn1`, {method: 'get'})
					reply(anu.result)
					break
				case 'phcomment':
					var gh = body.slice(11)
					var com = gh.split("|")[0];
					var cmnt = gh.split("|")[1];
					buffer = await getBuffer(`https://api.zeks.xyz/api/phub?apikey=apivinz&img=https://1.bp.blogspot.com/-x8KhcOBG-yw/XiU4pi1yWVI/AAAAAAAADBA/gK8tsLyc1lQ808A348IKzDCjf6fUBKONwCLcBGAsYHQ/s1600/cara%2Bbuat%2Bfoto%2Bprofil%2Bdi%2Bwhatsapp%2Bmenjadi%2Bunik.jpg&username=${com}&msg=${cmnt}`)
					client.sendMessage(from, buffer, image, {quoted: mek})
				    break
				case 'mememaker':
				    var gh = body.slice(11)
				    var mem = gh.split("|")[0];
				    var make = gh.split("|")[1];
				    var imgbb = require('imgbb-uploader')
                    ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                    qwgi = await client.downloadAndSaveMediaMessage(ger)
                    anu = await imgbb("2685f71965fa6c56702e9e70644ff0ad", owgi)
                    teks = `${anu.display_url}`
                    reply('reply img')
                    buff = await getBuffer(`https://mnazria.herokuapp.com/api/create-meme?text-atas=${mem}&text-bawah=${make}&background-url=${teks}`, {method: 'get'})
                    client.sendMessage(from, buff, image, {quoted: mek})
                    break
                case 'infonomor':
					if (args.length < 1) return reply(`Masukan Nomor\nContoh : ${prefix}infonomor 085788555068`)
					data = await fetchJson(`https://docs-jojo.herokuapp.com/api/infonomor?no=${body.slice(11)}`)
					if (data.error) return reply(data.error)
					if (data.result) return reply(data.result)
					hasil = `╠➥ internasional : ${data.international}\n╠➥ nomor : ${data.nomor}\n╠➥ operator : ${data.op}`
					reply(hasil)
					break 
				case 'brainly':
					brien = body.slice(9)
					brainly(`${brien}`).then(res => {
					teks = '>l───────────|<\n'
					for (let Y of res.data) {
						teks += `\n*「 _BRAINLY_ 」*\n\n*➸ Pertanyaan:* ${Y.pertanyaan}\n\n*➸ Jawaban:* ${Y.jawaban[0].text}\n❉───────────❉\n`
					}
					client.sendMessage(from, teks, text, {quoted: mek, detectLinks: false})
                        console.log(res)
                    })
					break
				case 'nulis':
				case 'nulis':
					if (args.length < 1) return reply('Yang mau di tulis apaan?')
					teks = body.slice(7)
					anu = await fetchJson(`https://tools.zone-xsec.com/api/nulis.php?q=${teks}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.image)
					client.sendMessage(from, buff, image, {quoted: mek, caption: '*KEEP USING THE BOT EVEN THE TEACHER IS ALWAYS HIS PAPER SHOULD THAT IT WAS BEGINNING !!*'})
					break
             case 'nulis2':
             case 'tulis2':
                    if (args.length < 1) return reply('Mana text nya')
                    reply(mess.wait)
                    teks = body.slice(8)
                    anu = await getBuffer(`https://api.zeks.xyz/api/nulis?text=${teks}&apikey=apivinz`)
                    if (anu.error) return reply(anu.error)
                    client.sendMessage(from, anu, image, {quoted: mek, caption: '*KEEP USING THE BOT EVEN THE TEACHER IS ALWAYS HIS PAPER SHOULD THAT IT WAS BEGINNING !!*'})
                    break
			 case 'nulis3':
			 case 'tulis3':
				    client.updatePresence(from, Presence.composing)
			        if (args.length < 1) return reply(`${name} Harus Nulis Apa Kak??`)
				    tulis = body.slice(8)
				    nama = tulis.split("|")[0];
				    kelas = tulis.split("|")[1];
				    isi = tulis.split("|")[2];
				    nulis = await getBuffer(`https://api.zeks.xyz/api/magernulis?nama=${nama}&kelas=${kelas}&text=${isi}&tinta=4`, {method: 'get'})
				    client.sendMessage(from, nulis, image, {quoted: mek, caption: '*KEEP USING THE BOT EVEN THE TEACHER IS ALWAYS HIS PAPER SHOULD THAT IT WAS BEGINNING !!*'})
				    break			
				case 'quotemaker':
				    var gh = body.slice(12)
				    var quote = gh.split("|")[0];
				    var wm = gh.split("|")[1];
				    var bg = gh.split("|")[2];
				    const pref = `Usage: \n${prefix}quotemaker teks|watermark|theme\n\nEx :\n${prefix}quotemaker ini contoh|bicit|random`
				    if (args.length < 1) return reply(pref)
				    reply(mess.wait)
				    anu = await fetchJson(`https://terhambar.com/aw/qts/?kata=${quote}&author=${wm}&tipe=${bg}`, {method: 'get'})
				    buffer = await getBuffer(anu.result)
			        client.sendMessage(from, buffer, image, {caption: 'Nih anjim', quoted: mek})
				    break
				case 'resepmasakan':
                    anu = await fetchJson(`https://masak-apa.tomorisakura.vercel.app/api/search?q=${body.slice(14)}`, {method: 'get'})
                    masak = '==============================\n'
                    for (let msk of anu.results){
                    masak += `• *Title:* ${msk.title}\n• *• *Durasi Masak Sekitar:* ${msk.times}\n• *Porsi:* ${msk.serving}\n• *Tingkat Kesulitan:* ${msk.difficulty}\n• *Link:* https://www.masakapahariini.com/?s=${msk.key}\n==============================\n`
                     }
                    reply(masak.trim())
                    break
               case 'pinterest':
					client.updatePresence(from, Presence.composing) 
					data = await fetchJson(`https://api.fdci.se/rep.php?gambar=${body.slice(11)}`, {method: 'get'})
					reply(mess.wait)
					n = JSON.parse(JSON.stringify(data));
					nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek, caption: `PINTEREST\n\*Hasil Pencarian* : *${body.slice(11)}*`})
					break
		       case 'apkpure':
				    if (args.length < 1) return reply(`teks nya mana um?`)
				    pk = body.slice(9)
				    teks = '=================\n'
				    apk = await fetchJson(`https://api.zeks.xyz/api/apkpure?q=${pk}&apikey=apivinz`, {method: 'get'})
				    bun = await getBuffer(apk.result.thumbnail)
				    teks = `*Title*:${apk.result.title}\n*Url*'${apk.result.url}\n*Rating*:${apk.result.rating}\n=================\n`
				    client.sendMessage(from, bun, image, {quoted: mek, caption: teks})
				    break
			  case 'foxnews':
				    client.updatePresence(from, Presence.composing) 
				    data = await fetchJson(`https://api.zeks.xyz/api/foxnews?apikey=apivinz`, {method: 'get'})
				    teks = '=================\n'
				    for (let i of data.result) {
				    teks += `*Judul* : ${i.title}\n*Url* : ${i.url}\n*Country* : ${i.country}\n*Content* : ${i.content}\n*Time* : ${i.time}\n=================\n`
				    }
				    reply(teks.trim())
				    break
		      case 'liputan': 
				    data = await fetchJson(`https://api.zeks.xyz/api/liputan6?apikey=apivinz`, {method: 'get'})
				    teks = '=================\n'
				    for (let i of data.result) {
				    teks += `*Title:* : ${i.title}\n*Url* : ${i.url}\n*Keterangan* : ${i.ket}\n*Category* : ${i.category}\n*Time* : ${i.time}\n=================\n`
				    }
				    reply(teks.trim())
				    break
	          case 'tribunnews': 
				    data = await fetchJson(`https://api.zeks.xyz/api/tribunews?apikey=apivinz`, {method: 'get'})
				    teks = '=================\n'
				    for (let i of data.result) {
				    teks += `*Title:* : ${i.title}\n*Time* : ${i.time}\n*Url* : ${i.url}\n*Keterangan* : ${i.ket}\n=================\n`
				    }
				    reply(teks.trim())
				    break
			   case 'blub':  
				    if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=22100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					}) 
				    break
				case 'slow1':
				case 'slowmo1':
				    if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=0.5,asetrate=44000" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					})
				    break
				case 'tupai':
				    if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=0.5,asetrate=65100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					})
				    break
				case 'nightcore':
				    if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.5,asetrate=75100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					})
				    break
                 case 'slow':
                 case 'slowmo':
                    if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=0.7,asetrate=44100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					})
				    break
				case 'gemuk':
				    if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=22100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					})
			        break
				case 'toptt':
				    if (!isQuotedAudio) return reply('Reply the audio, uncle')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
					fs.unlinkSync(media)
					if (err) return reply('Gagal mengkonversi audio ke ptt')
					topt = fs.readFileSync(ran)
					client.sendMessage(from, topt, audio, {mimetype: 'audio/mp4', quoted: mek})
					})
					break
				case 'bass': 
				    if (!isQuotedAudio) return reply('Reply the audio, uncle')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -af equalizer=f=94:width_type=o:width=2:g=30 ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
					fs.unlinkSync(ran)
					})
				    break
				case 'ghost':
	                 if (!isQuotedAudio) return reply('Reply the audio, uncle')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=3486" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', quoted: mek})
                    fs.unlinkSync(ran)
				    })
		            break
			   case 'fast':  
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=22100" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true, quoted: mek})
					fs.unlinkSync(ran)
					 }) 
			        break
				case 'fasttesf':  
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=2.6,asetrate=39699" ${ran}`, (err, stderr, stdout) => {
					fs.unlinkSync(media)
					if (err) return reply('Error!')
					hah = fs.readFileSync(ran)
					client.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true, quoted: mek})
					fs.unlinkSync(ran)
					}) 
				    break
			//marker
			case 'memeindo':
	               memein = await fetchJson(`https://api.zeks.xyz/api/memeindo?apikey=apivinz`)
			       buffer = await getBuffer(memein.result)
		           client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Maaf garing...'})
		           break
		     case 'artijodoh':
                   if (args.length < 1) return reply(`Teksnya mana kak?\nContoh : ${prefix}artijodoh Alfira | Alfira`)
           	    var gh = body.slice(11)
				   var jod = gh.split("|")[0];
				   var oh = gh.split("|")[1];
                   jodoh = await fetchJson(`https://api.zeks.xyz/api/primbonjodoh?apikey=apivinz&nama1=${jod}&nama2=${oh}`)
                   hasilya = '「 ARTI JODOH 」\nNama : '+jodoh.result.nama1+'\nPasangan :'+jodoh.result.nama2+'\n\nPositif : '+jodoh.result.positif+'\nNegatif : '+jodoh.result.negatif
                   arti = await getBuffer(jodoh.result.thumb)
                   client.sendMessage(from, arti, image, {quoted: mek, caption: hasilya})
                   break
              case 'quotes':
				   data = await fetchJson(`https://api.zeks.xyz/api/quote?apikey=apivinz`)
				   cop = `Quotes : _${data.result.quotes}_\n\nAuthor : _${data.result.author}_`
				   reply(cop)
				   break
			  case 'simi':
			       anu = await fetchJson(`https://api.zeks.xyz/api/simi?apikey=apivinz&text=${body.slice(6)}`, {method: 'get'})
			       teks = `${anu.result}`
			       client.sendMessage(from, teks, text, {quoted: mek})
			       break
			   case 'qrcode':
				   buffer = await getBuffer(`https://api.zeks.xyz/api/qrencode?apikey=apivinz&text=${body.slice(8)}`)
			       client.sendMessage(from, buffer, image, {quoted: mek})
			       break
		      case 'barcode': 
			       buffer = await getBuffer(`https://api.zeks.xyz/api/barcode?apikey=apivinz&text=${body.slice(9)}`)
			       client.sendMessage(from, buffer, image, {quoted: mek})
			       break
			   case 'nickff':
				   data = await fetchJson(`https://api.zeks.xyz/api/nickepep?apikey=apivinz`, {method: 'get'})
				   teks = '=================\n'
				   for (let i of data.result) {
				   teks += `*Nick* : ${i}\n=================\n`
				   }
				   reply(teks.trim())
				   break
				case 'film':
				   anu = await fetchJson(`https://api.zeks.xyz/api/film?q=${body.slice(6)}&apikey=apivinz`, {method: 'get'})
				   teks = 'SEARCH FILM\n'
                   for (let i of anu.result) {
				   teks += `Nama Film : ${i.title}\NUrl : ${i.url}=================\n`
				   }
				   reply(teks.trim())
                   break
				case 'wiki': 
				    anu = await fetchJson(`https://api.zeks.xyz/api/wiki?q=${body.slice(6)}&apikey=apivinz`, {method: 'get'})
				    teks = `${anu.result.result}`
				    client.sendMessage(from, teks, text, {quoted: mek})
				    break
				case 'wiki1':
				     wiki = body.slice(7)
				     anu = await fetchJson(`http://docs-jojo.herokuapp.com/api/wiki?q=${wiki}`, {method: 'get'})
                     teks = `Hasil Pencarian ${body.slice(6)}\nText : ${anu.result}`
                     client.sendMessage(from, teks, text, {quoted: mek})
			         break
			   /*case 'wikien':
				    anu = await fetchJson(`http://arugaz.my.id/api/edu/enwiki?query=${body.slice(8)}`)
				    teks = `${anu.result.data}`
				    client.sendMessage(from, teks, text, {quoted: mek})
				    break*/
				case 'lirik':
				    teks = body.slice(7)
					anu = await fetchJson(`http://scrap.terhambar.com/lirik?word=${teks}`, {method: 'get'})
					reply('Lirik dari lagu '+teks+' adalah :\n\n'+anu.result.lirik)
					break
				case 'chord':
				    teks = body.slice(7)
				    anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/chord?q=${teks}`, {method: 'get'})
				    client.sendMessage(from, anu, text, {quoted: mek})
				    break
				case 'pantun':
				    gatauda = body.slice(8)					
				    anu = await fetchJson(`https://api.zeks.xyz/api/pantun?apikey=apivinz`, {method: 'get'})
				    reply(anu.result.pantun)
			        break
			   case 'bpfont':
			        bp = `${body.slice(8)}`
		            anu = await fetchJson(`https://api.terhambar.com/bpk?kata=${bp}`, {method: 'get'})
			        reply (anu.text)
			        break
			  case 'pastebin':
				    paste = `${body.slice(10)}`
                    anu = await fetchJson(`https://api-anoncybfakeplayer.herokuapp.com/pastebin?text=${paste}`, {method: 'get'})
                    client.sendMessage(from, `${anu.result}`, text, {quoted: mek})			
                    break
				case 'bitly':
                    client.updatePresence(from, Presence.composing) 
                    data = await fetchJson(`https://tobz-api.herokuapp.com/api/bitly?url=${args[0]}&apikey=BotWeA`)
                    hasil = `link : ${args[0]}\n\nOutput : ${data.result}`
                    reply(hasil)
                    break
                case 'urlshort':
                    anu = await fetchJson(`https://api.zeks.xyz/api/urlshort?url=${args[0]}&apikey=apivinz`, {method: 'get'})
                    teks = `${anu.result}`
                    client.sendMessage(from, teks, text, {quoted: mek})
                    break
                case 'ssweb':
					if (args.length < 1) return reply('Urlnya mana om')
					teks = body.slice(7)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/screenshotweb?url=${teks}`)
					buff = await getBuffer(anu.gambar)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'jadwaltvnow':
				   teks = body.slice(11)
				   data = await fetchJson(`https://docs-jojo.herokuapp.com/api/jadwaltvnow`)
				   teks = `Jadwaltv : ${data.result.jadwalTV}`
				   client.sendMessage(from, teks, text, {quoted: mek})
				   break
                case 'jam':  
                    if (args.length < 1) return reply(mess.txt)
                    anu = await fetchJson(`https://api.zeks.xyz/api/jamdunia?q=${body.slice(4)}&apikey=apivinz`, {method: 'get'})
                    teks = `_⏱️JAM:${anu.result.waktu}_\n_??TANGGAL:${anu.result.tanggal}_\n_🌄TEMPAT:${anu.result.tempat}_`
                    reply(teks) 
                    break
                case 'artimimpi':
                    if (args.length < 1) return reply(`Masukan mimpi contoh ${prefix}artimimpi dikejar cewe tercantik disekolah`)
                    anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/artimimpi?q=${body.slice(11)}`, {method: 'get'})
                    teks = `Mimpi : ${body.slice(11)}\nArti Mimpi : ${anu.result}`
                    client.sendMessage(from, teks, text, {quoted: mek})
                    break
                case 'happymod':
                    hmm = body.slice(10)
                    anu = await fetchJson(`https://api.zeks.xyz/api/happymod?apikey=apivinz&q=${hmm}`, {method: 'get'})
                    buffer = await getBuffer(anu.result)
                    teks = `Name Apk : ${i.title}\nRating ${i.rating}\nUrl ${i.url}`
                    client.sendMessage(from, buff, image, {quoted: mek, caption: 'teks'})
                    break 
                case 'bacakomik': 
					client.updatePresence(from, Presence.composing)
			        data = await fetchJson(`https://api.zeks.xyz/api/bacakomik?apikey=apivinz&q=${body.slice(9)}`)
			        hepi = data.result[0] 
			        teks = `*Nama*: ${data.result[0].title}\n*url*: ${hepi.url}\n*rating:* ${hepi.rating}`
			        buffer = await getBuffer(hepi.thumb)
			        client.sendMessage(from, buffer, image, {quoted: mek, caption: `${teks}`})
			        break
                case 'attp':
				    if (args.length < 1) return reply(`*Masukan text...*`)
				    attp2 = await getBuffer(`https://api.xteam.xyz/attp?file&text=${body.slice(6)}`)
				    client.sendMessage(from, attp2, sticker, {quoted: mek})
				    break
			  case 'emoji2img': 
				     if (args.length < 1) return reply('emoji nya mana sayang ?')
				     gatauda = body.slice(11)
				     buffer = await getBuffer(`https://api.zeks.xyz/api/emoji-image?apikey=apivinz&emoji=${gatauda}`, {method: 'get'})
				     client.sendMessage(from, buffer, image, {quoted: mek})
				     break
			   case 'img2url':  //Coba coba:/
	                 var imgbb = require('imgbb-uploader')
                     var encmedia  = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                     var media = await  client.downloadAndSaveMediaMessage(encmedia)        
                     imgbb('4b1ba7ed7d3f1171a48266da13d38eec', media)
                     .then(data => {
                     var caps = `「 *IMAGE TO URL* 」\n\n*╠➥  ID :* ${data.id}\n*╠➥  MimeType :* ${data.image.mime}\n*╠➥  Extension :* ${data.image.extension}\n\n*╠➥  URL :* ${data.display_url}`
                     ibb = fs.readFileSync(media)
                     client.sendMessage(from, ibb, image, { quoted: mek, caption: caps }) 	
                     })
                     .catch(err => {
                     throw err
                      }) 
                     break
		       case 'cerpen':
                    anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/cerpen`, {method: 'get'})
                    reply (mess.wait)
                    teks = `Title : ${anu.result.title}\nPengarang : ${anu.result.pengarang}\nKategori : ${anu.result.kategori}\nCerita : ${anu.result.cerpen}`
                    client.sendMessage(from, teks, text, {quoted: mek})
                    break
                 case 'cersex':
                    reply (mess.wait)
                    anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/cersex`, {method: 'get'})
                    apa = await getBuffer(anu.result.img)
                    teks = `Judul : ${anu.result.judul}\n\nCerita : ${anu.result.cersex}`
                    client.sendMessage(from, apa, image, {quoted: mek, caption: teks})
                    break
			//Agama
	     case 'quransurah':
		         surah = `${body.slice(12)}`
			      anu = await fetchJson(`https://api.zeks.xyz/api/quran?no=${surah}&apikey=apivinz`)
			      quran = `Surah Al-Qur\`an Nomer: *${surah}*\nSurah: *${anu.surah}*\nDiturunkan Dikota: *${anu.type}*\nJumlah Ayat: *${anu.jumlah_ayat}*\n\n*${anu.ket}\n=============================\n`
			      for (let surah of anu.ayat) {
		          quran += `${surah.number}\n${surah.text}\n${surah.translation_id}\n=====================\n`
			      }
			      reply(quran.trim())
			      break
			case 'alkitab':
			     if (args.length < 1) return reply('Masukan ayat!!')
				 client.updatePresence(from, Presence.composing) 
				 anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/alkitabsearch?q=${body.slice(7)}`, {method: 'get'})
				 teks = '=================\n'
				 for (let i of anu.result) {
				 teks += `*Ayat :* : ${i.ayat}\n*Isi :* ${i.isi}\n*Link :*\n${i.link}\n=================\n`
				 }
				 reply(teks)
				 break
            case 'kisahnabi':
                  tels = body.slice(11)
                  anu = await fetchJson(`https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/kisahnabi/${tels}.json`, {method: 'get'})
                  if (anu.error) return reply(anu.error)
                  hasil = ` Nabi : ${anu.name}\nTanggal Lahir : ${anu.thn_kelahiran}\nTempat Lahir : ${anu.tmp}\nUsia : ${anu.usia}\nKisah : ${anu.description}`
                  client.sendMessage(from, hasil, text, {quoted: mek})
                  break
            case 'bacaanshalat':
                  bacaan = body.slice(14)
                  anu = await fetchJson(`https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/bacaanshalat/${bacaan}.json`, {method: 'get'})
                  if (anu.error) return reply('Gak Bisa Ngambil Datanya Kak')
                  hasil = ` Bacaan : ${anu.name}\n\n${anu.arabic}\n${anu.latin}\n${anu.terjemahan}`
                  client.sendMessage(from, hasil, text, {quoted: mek})
                  break
            case 'niatshalat':
                  niat = body.slice(12)
                  anu = await fetchJson(`https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/niatshalat/${niat}.json`, {method: 'get'})
                  if (anu.error) return reply('Gak Bisa Ngambil Datanya Kak')
                  hasil = ` Niat : ${anu.name}\n\n${anu.arabic}\n${anu.latin}\n${anu.terjemahan}`
                  client.sendMessage(from, hasil, text, {quoted: mek})
                  break
            case 'wallmuslim':
				  anu = await fetchJson(`https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/Islamic.json`, {method: 'get'})
				  reply('Tunggu Ya Kak')
				  var n = JSON.parse(JSON.stringify(anu));
				  var nimek =  n[Math.floor(Math.random() * n.length)];
				  pok = await getBuffer(nimek)
				  client.sendMessage(from, pok, image, { quoted: mek })
				  break
			 case 'randomquran':
				  anu = await fetchJson(`https://api.banghasan.com/quran/format/json/acak`, {method: 'get'})
				  quran = `${anu.acak.ar.teks}\n\n${anu.acak.id.teks}\nQ.S ${anu.surat.nama} ayat ${anu.acak.id.ayat}`
				  client.sendMessage(from, quran, text, {quoted: mek})
				  break
	         case 'quran':
			     data = await fetchJson(`https://api.zeks.xyz/api/randomquran`)
			     teks = `Nama: ${data.result.nama}\nArti: ${data.result.arti}\nayat: ${data.result.ayat}\nAsma: ${data.result.asma}\nRukuk: ${data.result.rukuk}\nNomor: ${data.result.nomor}\nType: ${data.result.type}\nKeterangan: ${data.result.keterangan}`
			     buffs = await getBuffer(data.result.audio)
		         client.sendMessage(from, `${teks}`, MessageType.text, {quoted: mek})
			     client.sendMessage(from, buffs, audio, {mimetype: 'audio/mp4', filename: `quran.mp3`, quoted: mek})
			     break
	        case 'quran1':
				anu = await fetchJson(`https://api.zeks.xyz/api/randomquran`, {method: 'get'})
				quran = `*->* ${anu.result.arti}\n*->* ${anu.result.asma}\n*->* ${anu.result.ayat}\n*->* ${anu.result.keterangan}\n*->* ${anu.result.nama}\n*->* ${anu.result.nomor}\n*->* ${anu.result.rukuk}\n*->* ${anu.result.type}\n*->* ${anu.result.urut}`
				client.sendMessage(from, quran, text, {quoted: mek})
				break
	        case 'jsholat':
				if (args.length < 1) return reply('Masukan nama daerah!!')
				sholat = body.slice(9)
				anu = await fetchJson(`https://tobz-api.herokuapp.com/api/jadwalshalat?q=${sholat}&apikey=BotWeA`)
				reply(mess.wait)
				if (anu.error) return reply('[\u2757] Maaf, Daerah yang anda masukan salah!')
				jsol = `Jadwal sholat di ${sholat} hari ini adalah\n\n*➸ Imsyak :* ${anu.result.imsak} WIB\n*➸ Subuh :* ${anu.result.subuh} WIB\n*➸ Dzuhur :* ${anu.result.dzuhur} WIB\n*➸ Ashar :* ${anu.result.ashar} WIB\n*➸ Maghrib :* ${anu.result.maghrib} WIB\n*➸ Isya :* ${anu.result.isha} WIB\n*➸ Tengah Malam :* ${anu.result.midnight} WIB`
				client.sendMessage(from, jsol, text, {quoted: mek})
				break
		  case 'renungan':
				anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/renungan`, {method: 'get'})
				teks = `*Jadul :* ${anu.judul}\n*Isi :* ${anu.Isi}\n*Pesan :* ${anu.pesan}`
				client.sendMessage(from, teks, MessageType.text, {quoted:mek})
			    break
	        case 'doawitir':
				client.updatePresence(from, Presence.composing) 
				asu = await fetchJson(`https://manns-api.herokuapp.com/api/muslim/wirid?apikey=MannKey`)
				teks = '=================\n'
				for (let i of asu.result.data) {
					teks += `*ID :* : ${i.id}\n*Times :* ${i.times}\n*Arabic :*\n${i.arabic}\n=================\n`
				}
				reply(teks)
				break
			//downloader
			  case 'ytmp4':
               anu = await fetchJson(`https://api.zeks.xyz/api/ytmp4?url=${args[0]}&apikey=apivinz`, {method: 'get'})
               thumbnail = await getBuffer(anu.result.thumbnail)
               teks = ` 「 *YTMP4* 」\n\n|•> Judul : ${anu.result.title}\n•|> Size : ${anu.result.size}\n|•> Link : ${anu.result.url_video}\n\n _Create By RR_018_`
               client.sendMessage(from, thumbnail, image, {quoted: mek, caption: teks})
               buffer = await getBuffer(anu.result.url_video)
               client.sendMessage(from, buffer, video, {quoted: mek})
               break
               case 'ytmp3':
               reply(mess.wait)
               anu = await fetchJson(`https://api.zeks.xyz/api/ytmp3/2?url=${body.slice(7)}&apikey=apivinz`)
               if (anu.error) return reply(anu.error)
               infoo = `「 *YTMP3* 」\n\n|•> Judul : ${anu.result.title}\n|•> Size : ${anu.result.size}\n•|> link : ${anu.result.url_audio}`
               buffer = await getBuffer(anu.result.thumb)
               lagu = await getBuffer(anu.result.link)
               client.sendMessage(from, buffer, image, {quoted: mek, caption: infoo})
               client.sendMessage(from, lagu, audio, {mimetype: 'audio/mp4', quoted: mek})
               break
               case 'tiktok':
               case 'tiktod': 
               case 'tiktoknowm':
               case 'tiktodnowm':
               anu = await fetchJson(`https://api.zeks.xyz/api/tiktok?url=${args[0]}&apikey=apivinz`, {method: 'get'})
               buffer = await getBuffer(anu.no_watermark)
               teks = `「 *TIKTOK DOWNLOADER* 」\n\n|•> Caption : ${anu.title}\n|•> Author : ${anu.author}`
               client.sendMessage(from, buffer, video, {quoted: mek, caption: teks})
               break
               case 'tiktokmusic':
               case 'tiktokmusik':
               case 'tiktodmusic':
               case 'tiktodmusik':
               anu = await fetchJson(`https://api.zeks.xyz/api/tiktok?url=${args[0]}&apikey=apivinz`, {method: 'get'})
               buffer = await getBuffer(anu.audio)
               teks = `「 *TITOK MUSIC* 」\n\n|•> Music Name : ${anu.music_name}`
               client.sendMessage(from, buffer, image, {quoted: mek, caption, teks})
               client.sendMessage(from, buffer, audio, {quoted: mek})
               break
               case 'igvideo':
               reply(mess.wait)
               anu = await fetchJson(`https://api.zeks.xyz/api/ig?url=${body.slice(9)}&apikey=apivinz`)
               if (anu.error) return reply(anu.error)
               igv = await getBuffer(anu.result[0].url)
               client.sendMessage(from, igv, video, {mimetype: 'video/mp4', quoted: mek})
               break
               case 'igphoto':
               asu = await fetchJson(`https://api.zeks.xyz/api/ig?url=${body.slice(9)}&apikey=apivinz`)
               if (asu.error) return reply(asu.error)
               igp = await getBuffer(asu.result[0].url)
               client.sendMessage(from, igp, image, {quoted: mek})
               break
               case 'igtv':
               anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/igtv?url=${args[0]}`, {method: 'get'})
               buffer = await getBuffer(asu.result[0].url)
               teks = `Username : ${user_name}\nSoucer : ${source_type}\nPost : ${has_posts}\nStory : ${has_story}`
               client.sendMessage(from, buffer, video, {quoted: mek, caption: teks})
               break
               case 'joox':
               anu = await fetchJson(`https://tobz-api.herokuapp.com/api/joox?q=${body.slice(6)}&apikey=BotWea`, {method: 'get'})
               if (anu.error) return reply(anu.error)
               infomp3 = `「 *JOOX* 」\n\n*|•> Judul* : ${anu.result.judul}\n*|•> Album* : ${anu.result.album}\n*|•> Dipublikasi* : ${anu.result.dipublikasi}`
               bufferddd = await getBuffer(anu.result.thumb)
               reply(mess.wait)
               buff = await getBuffer(anu.result.mp3)
               client.sendMessage(from, bufferddd, image, {quoted: mek, caption: infomp3})
               client.sendMessage(from, buff, audio, {mimetype: 'audio/mp4', filename: `${anu.result.title}.mp3`, quoted: mek})
               break  
               case 'play':				
			   play = body.slice(6)
			   anu = await fetchJson(`https://api.zeks.xyz/api/ytplaymp3?q=${play}&apikey=apivinz`)
			   if (anu.error) return reply(anu.error)
			   infomp3 = `「 *PLAY MP3 YT*」\n\n|•> Judul : ${anu.result.title}\n|•> Source : ${anu.result.source}\n|•> Ukuran : ${anu.result.size}`
			   buffer = await getBuffer(anu.result.thumbnail)
			   client.sendMessage(from, buffer, image, {quoted: mek, caption: infomp3})
			   lagu = await getBuffer(anu.result.url_audio)
			   client.sendMessage(from, lagu, audio, {mimetype: 'audio/mp4', filename: `${anu.result.title}.mp3`, quoted: mek})
			   break
               case 'mediafire': 
               anu = await fetchJson(`https://api.zeks.xyz/api/mediafire?apikey=apivinz&url=${args[0]}`, {method: 'get'})
               buffer = await getBuffer(anu.download)
               teks = `「 *MEDIAFIRE* 」\n\n|•> Nama File : ${anu.name_file}\n|•> File Size : ${anu.file_size}\n|•> Tanggal Upload : ${anu.upload_date}\n|•> File Tipe : ${anu.file_type}\n|•> Link : ${anu.download}\n|•> Deskripsi : ${anu.description}`
               client.sendMessage(from, teks, text, {quoted: mek})
               costum(buffer, MessageType.document)
               break
		    //owner
		      case 'author':
               case 'owner':
               case 'creator':
                  client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
                  client.sendMessage(from, '_OWNER BOT_*',MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/AmfWrEOMIdjCaxIAhVMn8x6pZb-E-FdEZ8PUlU4av0p7.enc", "mimetype": "image/jpeg", "caption": "*RR•018*", "fileSha256": "yf6BvjLN51jWoPZxF5+ypJn42xpnMU7C8RrGumLnSE8=", "fileLength": "431817", "height": 512, "width": 512, "mediaKey": "teoqaYfriQxMx5JU0W7xijDmNhfGqeyAS0buPoszf8k=", "fileEnsSha256": "4lHf4IPpzEcPpND4fTVCBAO1s0xLfo3/Qd6CRG4BYks=", "directPath": "/v/t62.7118-24/19456355_751909752126126_7493412960164979818_n.enc?oh=7c927ddcda966066457c8ab722d5c0db&oe=6068B6C9", "mediaKeyTimestamp": "1614784814", "jpegThumbnail": "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" } } } })
                  break
		      case 'return':
			      return client.sendMessage(from, JSON.stringify(eval(args.join(''))), text, {quoted: mek})
			       break
		       case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					setting.prefix = prefix
					fs.writeFileSync('./src/settings.json', JSON.stringify(setting, null, '\t'))
					reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
					break
				case 'setcr':
			        if (args.length < 1) return
			        if (!isOwner) return reply(mess.only.ownerB)
			        cr = args[0]
			        setting.cr = cr
			        fs.writeFileSync('./src/setiings.json', JSON.stringify(setting, null, '\t'))
				    reply(`Sukses merubah cr, menjadi : ${cr}`)
				    break
			   case 'setwelcome':
                    if (!isOwner) return reply(mess.only.ownerB)
                    welcome = args[0]
                    setting.welcome = welcome
                    fs.writeFilesync('./src/settings.json', JSON.stringify(setting, null, '\t'))
                    reply(`Sukses mengubah welcome menjadi : ${welcome}`)
                    break
               case 'setleave':
                    if (!isOwner) return reply(mess.only.ownerB)
                    leave = args[0]
                    setting.leave = leave
                    fs.writeFilesync('./src/settings.json', JSON.stringify(setting, null, '\t'))
                    reply(`Sukses mengubah leave menjadi : ${leave}`)
                    break
			   case 'clearall':
					if (!isOwner) return reply('Kamu siapa?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Sukses delete all chat :)')
					break
				case 'bc':
					if (!isOwner) return reply('Kamu siapa?')
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `[ Ini Broadcast ]\n\n${body.slice(4)}`})
						}
						reply('Suksess broadcast')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ Broadcast ]\n\n${body.slice(4)}`)
						}
						reply('Suksess broadcast')
					}
					break
			//game
			case 'tebakgambar':
				 anu = await fetchJson(`https://api.zeks.xyz/api/tebakgambar?apikey=apivinz`, {method: 'get'})
				 ngebuff = await getBuffer(anu.result.soal)
				 tebak = `➸ Jawaban : *${anu.result.jawaban}*`
			     setTimeout( () => {
				 client.sendMessage(from, tebak, text, {quoted: mek})
				 }, 30000) // 1000 = 1s,
				 setTimeout( () => {
				 client.sendMessage(from, '_10 Another second..._', text) // ur cods
				 }, 20000) // 1000 = 1s,
				 setTimeout( () => {
				 client.sendMessage(from, '_20 Another second..._', text) // ur cods
				 }, 10000) // 1000 = 1s,
				 setTimeout( () => {
				 client.sendMessage(from, '_30 Another second..._', text) // ur cods
				 }, 2500) // 1000 = 1s,
				 setTimeout( () => {
				 client.sendMessage(from, ngebuff, image, { caption: '_Think coldly if you want to be right !!_', quoted: mek }) // ur cods
				 }, 0) // 1000 = 1s,
				 break
			case 'truth':
				 const trut =['Have you ever liked anyone? How long?','Who have you ever talked to','Whose first ex, if the person is on the gc, tag the person','Have you ever turned into an ironman?','bra size?','Who do you like again?','Date of commencement? If single, just send the date of birth wkwkwk','Dear exs name','Alay was made by whom','If you can or if you want, in gc / outside gc who will you make friends with?(may be different / same type)','what is your biggest fear?','Have you ever liked someone and felt that person like you too?','What is the name of your friends ex-girlfriend that you once liked secretly?','Have you ever stolen your mothers or fathers money? The reason?','what makes you happy when you are sad','ever unrequited love? if ever with who? how does it feel brou?','ever been an affair with someone?','the most feared thing','who is the person who has the most influence on your life','what proud thing you got this year','who is the person who can make you feel uncomfortable','who is the person who ever made you uncomfortable','(for those who are Muslim) have you never prayed all day long?','Who is closest to your ideal partner type here','Who do you like to play with?','have you ever refused someone? the reason why?','Mention events that make you hurt that you still remember','What achievements have you got this year?','what was your worst habit at school?']
				 const ttrth = trut[Math.floor(Math.random() * trut.length)]
				 truteh = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
				 client.sendMessage(from, truteh, image, { caption: '*Truth*\n\n'+ ttrth, quoted: mek })
				 break
			case 'dare':
				 const dare =['Send a message to your ex saying "I still like you','phone crush / girlfriend now and ss to the player','send the right photo with your boyfriend','when will you get married?','baperin boys / girls initials R ',' Invite invites Initials R','Owner handsome or not?🤸🏻','Say yes to the person who was the last to chat, then send the photo to your message','pap to a member of the group','Say "YOU ARE SO BEAUTIFUL NOT FRIENDS" to guys','ss recent call whatsapp','drop emot "🦄💨" every typing on gc / pc for 1 day','send voice note says can i call u client?','drop the song / quote quote, then tag the appropriate member for that quote','use sule photos for up to 3 days','type using local language 24 hours','Change the name to "I am a lucinta luna child" for 5 hours','chat to the contact wa the order according to your battery percent , keep telling him "i lucky to hv you','Prank chat on ex and say "i love u, pgn back','voice record read surah al-kautsar','said "i hv crush on you, want to be my boyfriend or not?" to the opposite sex you last chat (hand over on wa / tele), wait for him to reply, if already ss drop here','state your boyfriend type!','snap / post girlfriend / crush photos','shouted gajelas then send using vn here','Pap your face then send it to one of your friends','send your photo with a caption, I am an adopted child','shouted using harsh words while Vn then sent it here','shout "anjimm gabutt anjimmm" in front of your house','Change the name to "BOWO" for 24 hours','Pretend to be possessed, for example: maung possession, locust possession, refrigerator possession, etc.']
				 const der = dare[Math.floor(Math.random() * dare.length)]
				 tod = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
				 client.sendMessage(from, tod, image, { quoted: mek, caption: '*Dare*\n\n'+ der })
				 break
             case 'fitnah':
				  if (args.length < 1) return reply(`Usage :\n${prefix}fitnah [@tag|pesan|balasanbot]]\n\nEx : \n${prefix}fitnah @tagmember|hai|hai juga`)
		         var gh = body.slice(8)
				  mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
				 var replace = gh.split("|")[0];
				 var target = gh.split("|")[1];
				 var bot = gh.split("|")[2];
				 client.sendMessage(from, `${bot}`, text, {quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target}` }}})
				 break
			case 'jadian':
				 if (!isGroup) return reply(mess.only.group)
				 jds = []
				 const jdii = groupMembers
				 const koss = groupMembers
				 const akuu = jdii[Math.floor(Math.random() * jdii.length)]
				 const diaa = koss[Math.floor(Math.random() * koss.length)]
				 teks = `Ciee... Yang Lagi Jadian\n @${akuu.jid.split('@')[0]} && @${diaa.jid.split('@')[0]} Bagi Pjnya dong`
				 jds.push(akuu.jid)
				 jds.push(diaa.jid)
				 mentions(teks, jds, true)
				 break
			case 'wa.me':
			case 'wame':
                 client.updatePresence(from, Presence.composing) 
                 options = {
                 text: `「 *SELF WHATSAPP* 」\n\n_Request by_ : *@${sender.split("@s.whatsapp.net")[0]}\n\nYour link WhatsApp : *https://wa.me/${sender.split("@s.whatsapp.net")[0]}*\n*Or ( / )*\n*https://api.whatsapp.com/send?phone=${sender.split("@")[0]}*`,
                 contextInfo: { mentionedJid: [sender] }
                  }
                 client.sendMessage(from, options, text, { quoted: mek } )
			     break
			case 'koin':
				  ranp = getRandom('.png')
				  rano = getRandom('.webp')
			      random = koin[Math.floor(Math.random() * (koin.length))]
				  exec(`wget ${random} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
				  fs.unlinkSync(ranp)
				  if (err) return reply(mess.error.stick)
				  buffer = fs.readFileSync(rano)
				  client.sendMessage(from, buffer, sticker, {quoted: mek})
				  fs.unlinkSync(rano)
				  })
				  break
			case 'slot':
                  const somtoy = sotoy[Math.floor(Math.random() * sotoy.length)]
                  client.sendMessage(from, `[  🎰 | SLOTS ]\n-----------------\n🍋 : 🍌 : 🍍\n${somtoy}<=====\n🍋 : 🍌 : 🍍\n[  🎰 | SLOTS ]\n\nDescription: If you get 3 pieces of the same, it means you win\n\nExample : 🍌 : 🍌 : 🍌<=====`, text, { quoted: mek })
                  break
            case 'slot1':
				  slots = body.slice(1)
				  slot =['\n│🍒│🍒│🍒│\n\n🎊WINNER','\n│🍎│🍎│🍎│\n\n🎊WINNER','\n│🍉│🍉│🍉│\n\n🎊WINNER\n','\n│⭐│⭐│⭐│\n\n🎊WINNER\n','\n│🍒│🍒│??│\n\n📍NEARLY\n','\n│🍒│🍎│🍎│\n\n📍NEARLY\n','\n│🍒│🍒│🍉│\n\n📍NEARLY\n','\n│🍒│🍉│🍉│\n\n📍NEARLY\n','\n│🍒│⭐│⭐│\n\n📍NEARLY','\n│🍒│🍒│⭐│\n\n📍NEARLY','\n│🍒│🍉│🍒│\n\n❌LOSE\n','\n│🍎│🍒│🍎│\n\n❌LOSE','\n│🍉│🍒│🍉│\n\n❌LOSE','\n│⭐│🍒│⭐│\n\n❌LOSE\n','\n│🍎│🍉│🍉│\n\n📍NEARLY','\n│🍉│🍎│🍒│\n\n❌LOSE','\n│⭐│🍉│🍒│\n\n❌LOSE','\n│⭐│🍎│🍎│\n\n📍NEARLY','\n│🍎│🍉│⭐│\n\n❌LOSE','\n│⭐│🍎│⭐│\n\n❌LOSE','\n│🍉│🍒│🍉│\n\n❌LOSE','\n│🍎│🍒│🍎│\n\n❌LOSE','\n│🍉│⭐│🍉│\n\n❌LOSE','\n│🍒│⭐│🍒│\n\n❌LOSE','\n│🍒│🍒│🍉│\n\n📍NEARLY','\n│⭐│🍉│🍎│\n\n❌LOSE','\n│🍉│🍒│⭐│\n\n❌LOSE','\n│⭐│🍒│🍎│\n\n❌LOSE','\n│🍒│⭐│🍎│\n\n❌LOSE','\n│🍎│🍒│⭐│\n\n❌LOSE\n']
				  put = slot[Math.floor(Math.random() * slot.length)]
				  client.sendMessage(from, put, text, { quoted: mek })
				  break
			case 'readmore':
				   if (args.length < 1) return reply('teks nya mana om?')
				   var kls = body.slice(9)
				   var has = kls.split("|")[0];
				   var kas = kls.split("|")[1];
				    if (args.length < 1) return reply(mess.blank)
			        client.sendMessage(from, `${has}‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎${kas}` , text, { quoted: mek })
				    break
			//group
			   case 'delete':
               case 'hapus':
					if (!isGroup)return reply(mess.only.group)
					if (isGroupAdmins || isOwner) {
                    client.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
                    } else {
                    reply(mess.only.admin)
                    }
					break
               case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Order Received\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`It works Promote @${mentioned[0].split('@')[0]} As Admin Group!`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break
				case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Order Received\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`It works Demote @${mentioned[0].split('@')[0]} Becomes Member Group!`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Do you want to add a genie?')
					if (args[0].startsWith('08')) return reply('Use the country code mas')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Failed to add target, maybe because its private')
					}
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('The target tag you want to kick!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Orders received, issued :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Orders received, issued : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmins':
					if (!isGroup) return reply(mess.only.group)
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
                case 'linkgroup':
                    if (!isGroup) return reply(mess.only.group)
                    if (!isGroupAdmins) return reply(mess.only.admin)
                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    linkgc = await client.groupInviteCode(from)
                    reply('https://chat.whatsapp.com/'+linkgc)
                    break
                case 'listonline':
            		let ido = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : from
			        let online = [...Object.keys(client.chats.get(ido).presences), client.user.jid]
			        client.sendMessage(from, 'List Online:\n' + online.map(v => '- @' + v.replace(/@.+/, '')).join`\n`, MessageType.text, { quoted: mek,
  		    	  contextInfo: { mentionedJid: online }
			        })
				   break
              case 'tagall':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `|•> https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					client.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					break
				case 'mentionall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `-> @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
                case 'leave':
                    if (!isGroup) return reply(mess.only.group)
                    if (isGroupAdmins || isOwner) {
                    	client.groupLeave(from)
                    } else {
                        reply(mess.only.admin)
                    }
                    break
                 case 'ownergroup':
                    client.updatePresence(from, Presence.composing) 
                    options = {
                    text: `This Owner Group is: @${from.split("-")[0]}`,
                    contextInfo: { mentionedJid: [from] }
                    }
                    client.sendMessage(from, options, text, { quoted: mek } )
				    break
			case 'groupinfo':
                    if (!isGroup) return reply(mess.only.group)
                    ppUrl = await client.getProfilePicture(from)
			        buffergbl = await getBuffer(ppUrl)
		            client.sendMessage(from, buffergbl, image, {quoted: mek, caption: `*NAME* : ${groupName}\n*MEMBER* : ${groupMembers.length}\n*ADMIN* : ${groupAdmins.length}\n*DESK* : ${groupDesc}`})
                    break
            case 'grup':
			case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'open') {
					    reply(`Sucess....`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'close') {
						reply(`Sukses...`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
				case 'closetime': //By Lord Resta
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    client.updatePresence(from, Presence.composing) 
                    if (args[1]=="detik") {var timer = args[0]+"000"
				    } else if (args[1]=="menit") {var timer = args[0]+"0000"
				    } else if (args[1]=="jam") {var timer = args[0]+"00000"
				    } else {return reply("*select:*\nseconds\nminute\nhour\n\n*example*\n10 seconds")}
				    setTimeout( () => {
					var nomor = mek.participant
					const close = {
					text: `*ON TIME* GROUP CLOSED BY ADMIN @${nomor.split("@s.whatsapp.net")[0]}\nꜱᴇᴋᴀʀᴀɴɢ *ONLY ADMIN* who can send messages`,
					contextInfo: { mentionedJid: [nomor] }
					}
					client.groupSettingChange (from, GroupSettingChange.messageSend, true);
					reply(close)
				    }, timer)
				    break
				case 'opentime': //By Lord Resta
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    if (args[1]=="detik") {var timer = args[0]+"000"
				    } else if (args[1]=="menit") {var timer = args[0]+"0000"
				    } else if (args[1]=="jam") {var timer = args[0]+"00000"
				    } else {return reply("*select:*\nseconds\nminute\nhour\n\n*example*\n10 seconds")}
				    setTimeout( () => {
					var nomor = mek.participant
					const open = {
					text: `*ON TIME* GROUP OPENED BY ADMIN @${nomor.split("@s.whatsapp.net")[0]}\nꜱᴇᴋᴀʀᴀɴɢ *ᴍᴇᴍʙᴇʀ* can send messages`,
					contextInfo: { mentionedJid: [nomor] }
					}
					client.groupSettingChange (from, GroupSettingChange.messageSend, false);
					reply(open)
				    }, timer)
				    break
				case 'tutup':
					var gh = body.slice(10)
					var yu = gh.split("|")[0];
					var ui = gh.split("|")[1];
					jm = `${anu}000`
					client.sendMessage(from, `*「 REMINDER 」*\n\nReminder diaktifkan!\n\n╠➥  *Pesan*: ${ui}\n╠➥  *Durasi*: ${yu} detik\n╠➥  *Untuk*: @${sender.split("@s.whatsapp.net")[0]}`, text, {contextInfo: {mentionedJid: [sender]}})
					setTimeout( () => {
					client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					client.sendMessage(from, `*「 REMINDER 」*\n\nFinally on time~@${sender.split("@s.whatsapp.net")[0]}\n\n╠➥  *Message*: ${ui}`, text, {contextInfo: {mentionedJid: [sender]}}) // ur cods
					}, jm) // 1000 = 1s,
					break    
				case 'kickall': //entr diban nangis
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply('Kamu siapa?')
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*😘* ${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					client.groupRemove(from, members_id)
					break
                case 'hidetag':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					var value = body.slice(9)
					var group = await client.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
					}
					client.sendMessage(from, options, text)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('Mode simi sudah aktif')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Successfully activate simi mode in this group ✔️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Successfully deactivating simi mode in this group ✔️')
					} else {
						reply('1 to activate, 0 to deactivate')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Type enable/disable')
					if ((args[0]) === 'enable') {
						if (isWelkom) return reply('Welcome already active before')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('「 *WElCOME* 」 Sucess...')
					} else if ((args[0]) === 'disable') {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('「 *WELCOME* 」 Successfully turned off....')
					} else {
						reply('select enable/disable')
					}
                    break
                case 'antilink':
				    if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('type ${prefix}antilink enable to activate')
					if ((args[0]) === 'enable') {
						if (isAntiLink) return reply('Anti link has been active before')
						antilink.push(from)
						fs.writeFileSync('./database/json/antilink.json', JSON.stringify(antilink))
						reply(`「 *ANTILINK* 」 Success`)
					} else if ((args[0]) === 'disable') {
						if (!isAntiLink) return reply('Antilink Already off before')
						antilink.splice(from, 1)
						fs.writeFileSync('./database/json/antilink.json', JSON.stringify(antilink))
						reply(`「 *ANTILINK* 」Successfully turned off...`)
					} else {
						reply('PILIH enable/disable')
					}
					break
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag the target you want to clone')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Profile photo successfully updated using a photo profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Failed')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('PHOTO SUPPORT ONLY')
					}
					break
				//random img
			   case 'randompubg':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=pubg`, {method: 'get'})
					naru = JSON.parse(JSON.stringify(anu));
					to =  naru[Math.floor(Math.random() * naru.length)];
					nye = await getBuffer(to)
					client.sendMessage(from, nye, image, { caption: 'ep ep!!', quoted: mek })
					break 
				case 'randomwaifu':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=waifu`, {method: 'get'})
					min = JSON.parse(JSON.stringify(anu));
					ato =  min[Math.floor(Math.random() * min.length)];
					nye = await getBuffer(ato)
					client.sendMessage(from, nye, image, { caption: 'waifu!!', quoted: mek })
					break 
               case 'randomshota':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=Shota`, {method: 'get'})
					min = JSON.parse(JSON.stringify(anu));
					ato =  min[Math.floor(Math.random() * min.length)];
					nye = await getBuffer(ato)
					client.sendMessage(from, nye, image, { caption: 'shota!!', quoted: mek })
					break 
               case 'randombts':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=bts`, {method: 'get'})
					naru = JSON.parse(JSON.stringify(anu));
					to =  naru[Math.floor(Math.random() * naru.length)];
					nye = await getBuffer(to)
					client.sendMessage(from, nye, image, { caption: '*BTS* !!', quoted: mek })
					break 
				case 'randomhentai':
                    gatauda = body.slice(1)
                    reply(mess.wait)
                    anu = await fetchJson(`https://tobz-api.herokuapp.com/api/hentai?apikey=BotWeA`, {method: 'get'})
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, image, {quoted: mek, caption: '*Hentai nya*' })
                    break
			//logo
			case 'fakeserti':
            if (args.length < 1) return reply(`Masukan text`)
            rr = body.slice(11)
            buffer = await getBuffer(`https://onlydevcity.xyz/FFSerti6/img.php?nama=${rr}`)
            client.sendMessage(from, buffer, image, {quoted: mek, caption: 'FAKE CERTIFICATE...'})
            break
			case 'water':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(7)
			buffer = await getBuffer(`https://videfikri.com/api/textmaker/underwater/?text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'water1':
			teks = body.slice(8)
			buffer = await getBuffer(`https://docs-jojo.herokuapp.com/api/watercolor?text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'tahta':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(7)
			buffer = await getBuffer(`https://api.zeks.xyz/api/hartatahta?text=${teks}&apikey=apivinz`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'neon':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(6)
			buffer = await getBuffer(`https://api.zeks.xyz/api/bneon?apikey=apivinz&text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
		    break
		    case 'neonlight':
		    if (args.length < 1) return reply(`Masukan text`)
		    teks = body.slice(11)
		    buf = await getBuffer(`https://docs-jojo.herokuapp.com/api/neon_light?text=${teks}`)
		    client.sendMessage(from, buffer, image, {quoted: mek})
		    break
			case '3d':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(4)
			buffer = await getBuffer(`https://api.zeks.xyz/api/text3d?text=${teks}&apikey=apivinz`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'logoff':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(8)
			buffer = await getBuffer(`https://api.zeks.xyz/api/epep?text=${teks}&apikey=apivinz`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'coffe1':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(8)
			buffer = await getBuffer(`https://videfikri.com/api/textmaker/coffeecup/?text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'coffe2':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(8)
			buffer = await getBuffer(`https://videfikri.com/api/textmaker/coffeecup2/?text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'romance':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(9)
			buffer = await getBuffer(`https://videfikri.com/api/textmaker/romancetext/?text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'leaves':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(8)
			buffer = await getBuffer(`https://api.zeks.xyz/api/leavest?text=${teks}&apikey=apivinz`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'matrix':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(8)
			buffer = await getBuffer(`https://api.zeks.xyz/api/matrix?apikey=apivinz&text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'thunder':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(9)
			buffer = await getBuffer(`https://api.zeks.xyz/api/thundertext?text=${teks}&apikey=apivinz`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'breakwall':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(11)
			buffer = await getBuffer(`https://api.zeks.xyz/api/breakwall?apikey=apivinz&text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'darkneon':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(10)
			buffer = await getBuffer(`https://videfikri.com/api/textmaker/darkneon/?text=${teks}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'firework':
			if (args.length < 1) return reply('Masukan text')
			teks = body.slice(10)
			buffer = await getBuffer(`https://api.zeks.xyz/api/tfire?text=${teks}&apikey=apivinz`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'goldbutton':
            if (args.length < 1) return reply('Input text')
            anu = await fetchJson(`https://api.zeks.xyz/api/gplaybutton?text=${body.slice(11)}&apikey=apivinz`, { method : 'get' })
            buf = await getBuffer(anu.result)
            client.sendMessage(from, buf, image, { quoted : mek, caption : 'Congratulation...' }) 
            break 
            case 'silverbutton': 
            if (args.length < 1) return reply('Input text')
            anu = await fetchJson(`https://api.zeks.xyz/api/splaybutton?text=${body.slice(11)}&apikey=apivinz`, { method : 'get' })
            buf = await getBuffer(anu.result)
            client.sendMessage(from, buf, image, { quoted : mek, caption : 'Congratulation...' }) 
            break
			case 'anakharam':
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(11)
			buffer = await getBuffer(`http://rzky.net/docs/api/AnakHaramSerti/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
			//sertifikat game
		    case 'ffserti':
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(5)
			buffer = await getBuffer(`https://onlydevcity.xyz/FFSerti/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'ffserti1':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(6)
			buffer = await getBuffer(`https://onlydevcity.xyz/FFSerti2/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'ffserti2':
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(6)
			buffer = await getBuffer(`https://onlydevcity.xyz/FFSerti3/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'ffserti3':
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(6)
			buffer = await getBuffer(`https://onlydevcity.xyz/FFSerti4/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'ffserti4':
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(6)
			buffer = await getBuffer(`https://onlydevcity.xyz/FFSerti5/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'pubgserti':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(8)
			buffer = await getBuffer(`https://onlydevcity.xyz/PubgTourSerti/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'pubgserti1':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(8)
			buffer = await getBuffer(`https://onlydevcity.xyz/PubgTourSerti2/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'pubgserti2':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(8)
			buffer = await getBuffer(`https://onlydevcity.xyz/PubgTourSerti3/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'pubgserti4':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(8)
			buffer = await getBuffer(`https://onlydevcity.xyz/PubgTourSerti4/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'pubgserti5':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(8)
			buffer = await getBuffer(`https://onlydevcity.xyz/PubgTourSerti5/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'mltserti':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(12)
			buffer = await getBuffer(`https://onlydevcity.xyz/MLTourSerti1/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'mltserti2':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(10)
			buffer = await getBuffer(`https://onlydevcity.xyz/MLTourSerti2/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'mltserti3':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(10)
			buffer = await getBuffer(`https://onlydevcity.xyz/MLTourSerti3/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'mltserti4':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(10)
			buffer = await getBuffer(`https://onlydevcity.xyz/MLTourSerti4/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'mltserti5':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(10)
			buffer = await getBuffer(`https://onlydevcity.xyz/MLTourSerti5/img.php?nama=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
		    case 'tweetfake':		
			if (args.length < 1) return reply('Input text')	
			rr = body.slice(10)
			buffer = await getBuffer(`https://onlydevcity.xyz/Tweet/?text=${rr}`)
			client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih'})
			break
			case 'wolflogo':   
            if (args.length < 1) return reply('Input text')
            reply(mess.wait)
            budy = body.slice(9)
            var hh = budy.split("|")[0];
            var tt = budy.split("|")[1];
            anu = await getBuffer(`https://api.zeks.xyz/api/wolflogo?apikey=apivinz&text1=apivinz&text2=${tt}`, {method: 'get'})
            if (anu.error) return reply(`*EROR*`)
            client.sendMessage(from, anu, image, { caption: 'Wolflogo ${budy}' }) 
            break  
            case 'glitchtext':
			var gh = body.slice(12)
			var gli = gh.split("|")[0];
			var tch = gh.split("|")[1];
			if (args.length < 1) return reply('Input text')
			buffer = await getBuffer(`https://api.zeks.xyz/api/gtext?text1=${gli}&text2=${tch}&apikey=apivinz`)
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'sparkling':
			if (args.length < 1) return reply(`Input text`)
			var gh = body.slice(11)
			var ri = gh.split("|")[0];
			var zki = gh.split("|")[1];
			buffer = await getBuffer(`https://docs-jojo.herokuapp.com/api/sparkling?text1=${ri}&text2=${zki}`, {method: 'get'})
			client.sendMessage(from, buffer, image, {quoted: mek})
			break
			case 'phlogo':
			if (args.length < 1) return reply(`Input text`)
			var gh = body.slice(8)
			var ph = gh.split("|")[0];
		    var phh = gh.split("|")[1];
		    buffer = await getBuffer(`https://docs-jojo.herokuapp.com/api/phblogo?text1=${ph}&text2=${phh}`, {method: 'get'})
		    client.sendMessage(from, buffer, image, {quoted: mek})
	        break
			case 'offcgroup':
		    client.sendMessage(from, '*RR-018 GROUP*\n\nLink : https://chat.whatsapp.com/soulreapers\n\n\n*FDL BOT GROUP*\n\nLink : https://chat.whatsapp.com/soulreapers',MessageType.text, { quoted: mek })
		    break
			default:
			if (body.startsWith(`${prefix}${command}`)) {
            reply(`Command *${prefix}${command}* Tidak Terdaftar Di Dalam *${prefix}menu*!`)
            }
			if (budy.includes('cekprefix')
            || budy.includes('Cek prefix')
            || budy.includes('Cekprefix')
            || budy.includes('cek prefix')) {
            reply(`*BOT USING PREFIX 「 ${prefix} 」*`)
            }
            if (budy.includes('case')
            || budy.includes('Esce')
            || budy.includes('Case')
            || budy.includes('Bagi esce')) {
            const bang = fs.readFileSync('./src/Bagi esce.webp')
            costum(bang, sticker, tescuk, `2,3 quail hi Mastah give your essayv:`)
            }
				if (isGroup && isSimi && budy != undefined) {
					console.log(budy)
					muehe = await simih(budy)
					console.log(muehe)
					reply(muehe)
				} else {
					return console.log(color('MAAF','red'), 'COMMAND NOT AVAILABLE!!', color(sender.split('@')[0]))
				}
                          }
	} catch (e) {
		console.log('Stess : %s', color(e, 'red'))
		}
	})
}
starts()
