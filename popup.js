
console.log("loading content script");
document.addEventListener('DOMContentLoaded', function() {
	console.log("DOMContentLoaded")
	var activeGroup = "default-group";
	//user interaction
	document.getElementById("clear-all-button").addEventListener("click", function(){
		chrome.extension.sendMessage({message: "DROP"},
			function (response) {
				console.log(response.status);
			});
		location.reload();
	});
	
	document.getElementById("add-new-group-button").addEventListener("click", function(){
		chrome.extension.sendMessage({message: "ADDGROUP",name:document.getElementById('group-name-input').value},
			function (response) {
				if(response.status == 'fail'){
					alert(response.add);
				}
				else{
					location.reload();
				}
			});
	});
	
	document.getElementById("import-group-button").addEventListener("click", function(){
		chrome.extension.sendMessage({message: "IMPORTGROUP",json:document.getElementById('group-json-input').value},
			function (response) {
				if(response.status == 'fail'){
					alert(response.add);
				}
				else{
					location.reload();
				}
			});
	});
	//load popup
	//get all groups + active for marking
	chrome.extension.sendMessage({message: "GETGROUPS"},
		function (response) {
			for (var i=0, l=response.status.length; i<l; i++) {
				var groupBlock = document.createElement('div');
				groupBlock.style.display = 'inline-block';
				if(response.gstatus){
					var groupStatus = document.createElement('div');
					groupStatus.style.width="8px";
					groupStatus.style.height="14px";
					groupStatus.style.display="block";
					groupStatus.style.float="left";
					groupStatus.style.background=response.gstatus[response.status[i]];
					groupBlock.appendChild(groupStatus);
				}
				var groupName = document.createElement('div');
				groupBlock.id = response.status[i];
				groupName.innerHTML = response.status[i];
				groupName.style.width="80px";	
				groupName.style.float="left";							
				groupName.addEventListener('click',function(e){
					chrome.extension.sendMessage({message: "CHANGEGROUP",to:e.path[1].id},
						function (response) {
							console.log(response.status);
						});
					location.reload();								
				});							
				if(response.status[i] == response.active){
					groupName.style.background="#d6ffd9";
				}
				//group menu
				var groupMenu = document.createElement('div');
				groupMenu.style.float="right";
				var groupRemoveButoon = document.createElement('button');
				groupRemoveButoon.innerHTML = 'Del';
				if(response.status[i] == 'default-group'){
					groupRemoveButoon.disabled = true;
					groupRemoveButoon.title = 'Undeletable';
				}
				else{
					groupRemoveButoon.addEventListener("click", function(e){
						chrome.extension.sendMessage({message: "DELETEGROUP",to:e.path[2].id},
							function (response) {
								console.log(response.status);
							});
						location.reload();
					});
				}
					
				var groupExpandButoon = document.createElement('button');
				groupExpandButoon.innerHTML = 'Exp';
				groupExpandButoon.addEventListener("click", function(e){
					chrome.extension.sendMessage({message: "EXPANDGROUP",to:e.path[2].id},
						function (response) {
							console.log(response.status);
						});
				});
				groupMenu.appendChild(groupRemoveButoon);
				groupMenu.appendChild(groupExpandButoon);
				groupBlock.appendChild(groupName);
				groupBlock.appendChild(groupMenu);
				document.getElementById('group-list').appendChild(groupBlock);	
				
			}
			chrome.extension.sendMessage({message: "GETACTIVEITEMS"},
				function (response) {
					console.log(response.status)
					//{name:userGroupName,regDate:d.getTime(),mark:'green',items:[]};
					for (var i=0, l=response.status.length; i<l; i++) {
						var itemBlock = document.createElement('div');
						itemBlock.id = 'item'+i;
						itemBlock.style.display ="block";	
						itemBlock.style.width ="140px";	
						itemBlock.style.height ="20px";
						itemBlock.style.marginTop = "2px";
						var bg = '';
						if(response.status[i].mType == 'link'){
							var aa = document.createElement('a');
							aa.href = response.status[i].linkUrl;
							aa.target = '_newtab';
							var urll = response.status[i].linkUrl.replace('http://','');
							aa.text = urll.replace('https://','').substr(0, 22)+'..';
							itemBlock.appendChild(aa);
							itemBlock.title = response.status[i].linkUrl;
							bg = '#d6f6ff';
						}
						else if(response.status[i].mType == 'selection'){
							itemBlock.innerHTML = response.status[i].selectionText.substr(0, 22)+'..';
							itemBlock.title = response.status[i].selectionText;
							bg = '#d6d7ff';
						}
						else if(response.status[i].mType == 'image'){
							itemBlock.innerHTML = response.status[i].srcUrl.substr(0, 22)+'..';
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
});
    
