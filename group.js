
console.log("loading group content script");
function buildLinkb(param) {
	//https://stackoverflow.com/questions/11773190/chrome-extension-get-parameter-from-url
    var val = document.URL;
    var url = val.substr(val.indexOf(param)) 
    var n=url.replace(param+"=","");
	return n
}
    
document.addEventListener('DOMContentLoaded', function() {
	console.log("DOMContentLoaded");
	topic = buildLinkb("q");
	chrome.extension.sendMessage({message: "GETEXPANDITEMS",to:topic},
		function (response) {
			//{name:userGroupName,regDate:d.getTime(),mark:'green',items:[]};
			var group = {name:topic,items:response.status}
			var jsonexport = JSON.stringify(group);
			var jeta = document.createElement("TEXTAREA");
			jeta.value = jsonexport;
			jeta.cols = "100";
			jeta.rows = "8";
			document.getElementById('export-json').appendChild(jeta);
			for (var i=0, l=response.status.length; i<l; i++) {
				var itemBlock = document.createElement('div');
				itemBlock.id = 'item'+i;
				itemBlock.style.display ="block";	
				itemBlock.style.width ="100%";	
				itemBlock.style.height ="20px";
				itemBlock.style.marginTop = "2px";
				var bg = '';
				if(response.status[i].mType == 'link'){
					var aa = document.createElement('a');
					aa.href = response.status[i].linkUrl;
					aa.target = '_newtab';
					aa.text = response.status[i].linkUrl;
					itemBlock.appendChild(aa);
					itemBlock.title = response.status[i].linkUrl;
					bg = '#d6f6ff';
				}
				else if(response.status[i].mType == 'selection'){
					itemBlock.innerHTML = response.status[i].selectionText;
					bg = '#d6d7ff';
				}
				else if(response.status[i].mType == 'image'){
					itemBlock.innerHTML = response.status[i].srcUrl;
					bg = '#f2d6ff';
				}
				else{
					itemBlock.innerHTML = 'No_Item_mType Err'
					bg = 'red';
				}
				itemBlock.style.background = bg;
				
				document.getElementById('item-list').appendChild(itemBlock);
			}					
		});
});
					
    
