const fs = require('fs-extra')
const path = require('path')
const axios = require('axios')

// resolve relative path, usage r`../data`
function r(strings, ...args) {
	return path.resolve(__dirname, strings.reduce((result, s, i) => result + s + (args[i] ? args[i] : ''), ''))
}

var lorem = fs.readFileSync(r`../data/lorem.txt`).toString().split(/\n\n|\s\n\s\n/g)
var lorem_kv = {}
for (var i = 0; i < lorem.length; i++){
	var k = lorem[i].replace(/。/g,'').slice(0,7)
	lorem_kv[k] = lorem[i]
}
var charset = fs.readFileSync(r`../data/labels_all.txt`).toString().split("\n").filter(x=>x.length).map(x=>x.split("\t")[1].trim())
lorem_kv["CHARSET"] = charset.concat().sort().join("")

var charvar = fs.readFileSync(r`../data/variant_map.txt`).toString().replace(/\n/g,'\t').split("\t")
charset = Array.from(new Set(charset.concat(charvar)))

var charsmp = Object.entries(JSON.parse(fs.readFileSync(r`../data/TC2SC.json`).toString())).filter(x=>charset.includes(x[0])).map(x=>x[1])
charset = Array.from(new Set(charset.concat(charsmp)))

charset.push("。","、")

async function downloadFont(filename) {
	if (!fs.existsSync(r`../site/${filename}`)) {
		console.log(`Downloading font ${filename} from release...`)
		const res = await axios.get(`https://github.com/LingDong-/qiji-font/releases/latest/download/${filename}`, {
			responseType: 'arraybuffer',
		})
		fs.writeFileSync(r`../site/${filename}`, res.data)
	}
	else {
		console.log(`Font ${filename} already exists, skipped.`)
	}
}

function main(){
	let fontready = false

	WebFont.load({
    custom: {
      families: ['QIJI']
		},
		timeout: 1000 * 60 * 5, // 5min 
		loading (){
			console.log('FONT LOADING')
		},
		active() {
			fontready = true
			update_r()
			console.log('FONT ACTIVE')
		},
		inactive() {
			fontready = false
			console.log('FONT INACTIVE')
			alert('Failed to load font')
		}
	});
	
	var isStupidSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	if (isStupidSafari){
		var st = document.getElementById("style").innerHTML
		st = st.replace(/\/\*X\*\/letter-spacing: ?(.*?)px;/g,function(_,x){return "letter-spacing:"+(0)+"px;" });
		document.getElementById("style").innerHTML = st;
		document.getElementById("render").style.left="-50px";
	}
	var isFF = navigator.userAgent.indexOf("Firefox") > 0;
	var isChrome = /Chrome/.test(navigator.userAgent);
	if (!(isStupidSafari||isFF||isChrome)){
		alert("Not tested on your browser! Things might look messed up.")
	}

	function update_ta(){
		document.getElementById("ta").innerHTML = lorem[document.getElementById("sel-txt").value];
		update_r();
	}
	function update_fs(){
		update_r();
	}
	function update_r(){
		if (!fontready)
			return

		var t = document.getElementById("ta").value;
		var tc = "";
		for (var k of t){
			if (charset.includes(k)){
				tc += k;
			}else if (k == "\n"){
				tc += "<br>"
			}
		}
		var ts = document.getElementById("sel-fs").value;
		document.getElementById("render").className = "text-"+ts;
		var tr = tc.replace(/。/g,`<span class="punc-${ts}">。</span>`).replace(/、/g,`<span class="punc-${ts}">、</span>`)
		document.getElementById("render").innerHTML = tr;
	}

	function loader(){
		var t = new Date().getTime()-window.loadingLoaded;

		var loading = document.getElementById("loading")
		if (fontready && t > 6000){
			
			loading.style.opacity=parseFloat(loading.style.opacity)*0.95
		}
		if (loading.style.opacity <= 0.01){
			document.body.removeChild(loading);
			return;
		}
		setTimeout(loader,1)
	}
	loader();
	
	document.getElementById("sel-txt").value = Object.keys(lorem)[3]
	document.getElementById("sel-fs").value = "small"
	update_ta()
	update_fs()
	
	document.getElementById("sel-txt").onchange = update_ta;
	document.getElementById("sel-fs").onchange = update_fs;
	document.getElementById("sel-bg").onchange = function(){document.getElementById("render").style.background=document.getElementById("sel-bg").value}
	document.getElementById("ta").onkeypress=document.getElementById("ta").onchange=update_r
	document.getElementById("btn-render").onclick = update_r;

	document.getElementById("render").addEventListener('wheel', (e)=> {
		//https://stackoverflow.com/questions/10744645/detect-touchpad-vs-mouse-in-javascript
		var isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
		if (!isTouchPad){
			document.getElementById("render").scrollLeft -= e.deltaY;
			e.preventDefault();
		}
	})
}

var html = `
<!-- GENERATED FILE DO NOT EDIT -->
<!-- CHANGE THIS LINE TO TRIGGER REBUILD # -->
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js"></script>
</head>
<style id="style">
	@font-face {
		font-family: QIJI;
		font-display: swap;
	  src: url('qiji.woff2') format('woff2'), url('qiji.ttf') format('truetype');
	}
	.text-huge{
		color: rgba(0,0,0,0.8);
		font-family: QIJI;
		writing-mode: vertical-rl;
		font-size: 200;
		line-height: 200px;
		/*X*/letter-spacing: -50px;
		font-weight: normal;
		font-display: block;
	}
	.text-big{
		color: rgba(0,0,0,0.8);
		font-family: QIJI;
		writing-mode: vertical-rl;
		font-size: 64;
		line-height: 80px;
		/*X*/letter-spacing: -14px;
		font-weight: normal;
		font-display: block;
	}
	.text-medium{
		color: rgba(0,0,0,0.8);
		font-family: QIJI;
		writing-mode: vertical-rl;
		font-size: 48;
		line-height: 64px;
		/*X*/letter-spacing: -12px;
		font-weight: normal;
		font-display: block;
	}
	.text-small{
		color: rgba(0,0,0,0.8);
		font-family: QIJI;
		writing-mode: vertical-rl;
		font-size: 28;
		line-height: 32px;
		/*X*/letter-spacing: -5px;
		font-weight: normal;
		font-display: block;
	}
	.punc-huge{
		display: inline-block;
		transform: translate(100px,-100px);
		letter-spacing: -212px;
		color:#BB705AEE;
		overflow: visible;
		z-index: 2;
	}
	.punc-big{
		display: inline-block;
		transform: translate(30px,-30px);
		letter-spacing: -67.99px;
		color:#BB705AEE;
		overflow: visible;
		z-index: 2;
	}
	.punc-medium{
		display: inline-block;
		transform: translate(20px,-24px);
		letter-spacing: -50.99px;
		color:#BB705AEE;
		z-index: 2;
	}
	.punc-small{
		display: inline-block;
		transform: translate(12px,-15px);
		letter-spacing: -29.99px;
		color:#BB705AEE;
		overflow: visible;
		z-index: 2;
	}
	#render{
		background: antiquewhite;
		box-shadow:
        inset 0px 11px 8px -10px rgba(0,0,0,0.1),
        inset 0px -11px 8px -10px rgba(0,0,0,0.1);
				font-display: block;
		overflow-x: auto;
	}
</style>

<body>
<img style="position:absolute; left:20px; top:22px" src="./seal.svg" width="60"/>
<div id="loading" style="position:absolute; left:0px; top:0px; width: 100%; height: 100%; background:rgba(255,255,255,0.95); z-index:2000; opacity: 1;">
	<div style="position:absolute; left:calc(50% - 50px); top:calc(50% - 80px);">
		<img style="border: 1px solid black;" src="./loading.gif" onload="window.loadingLoaded=new Date().getTime();"/>
		<div style="font-family:monospace">Loading...</div>
	</div>
</div>
<div style="position:absolute; left:100px; top:30px; min-width: 620px; width: calc(100% - 130px); height: 120px;  border:1px solid black; font-family:monospace">
&nbsp;<b>QIJI-FONT(齊伋體) TESTBED</b>
&nbsp;/&nbsp;TEXT=<select id="sel-txt">${Object.keys(lorem_kv).map(x=>'<option value="'+x+'"">'+x+"</option>")}</select>
&nbsp;/&nbsp;SIZE=<select id="sel-fs">${["huge","big","medium","small"].map(x=>'<option value="'+x+'"">'+x.toUpperCase()+"</option>")}</select>
&nbsp;/&nbsp;BG=<select id="sel-bg">${["antiquewhite","cornsilk","floralwhite","ghostwhite","ivory","linen","oldlace","seashell","white","whitesmoke"].map(x=>'<option value="'+x+'"">'+x.toUpperCase()+"</option>")}</select>
&nbsp;/&nbsp;<button id="btn-render">RENDER</button>
<textarea id="ta" style="position:absolute; left:0px; top:20px; width: 100%; height: 100px; resize: none; border: none; border-top: 1px solid black">
</textarea>
</div>
<div id="render" style="position:absolute; top: 180px; left: 0px; width: calc(100% - 50px); height: 665px; padding: 25px;">
</div>
<div style="position:absolute;top:910px; right:30px; font-family: monospace">
Open source font by Lingdong Huang 2020, <a href="https://github.com/LingDong-/qiji-font">Download on GitHub</a>.
</div>
<script>
var charset = ${JSON.stringify(charset.join(''))}
var lorem = ${JSON.stringify(lorem_kv)};
var main = ${main.toString()}
main()
</script>
</body>
`;

(async () => {
	fs.ensureDir(r`../site`)
	fs.writeFileSync(r`../site/index.html`, html)
	fs.copyFileSync(r`../screenshots/qiji-seal.svg`, r`../site/seal.svg`)
	fs.copyFileSync(r`../screenshots/loading.gif`, r`../site/loading.gif`)

	await downloadFont('qiji.ttf')
	await downloadFont('qiji.woff2')

	console.log('Build finished')
})()