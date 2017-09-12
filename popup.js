
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
			//load popup
			//get all groups + active for marking
			chrome.extension.sendMessage({message: "GETGROUPS"},
					function (response) {
						for (var i=0, l=response.status.length; i<l; i++) {
							var groupBlock = document.createElement('div');
							groupBlock.style.display = 'inline-block';
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
								var linkBlock = document.createElement('div');
								console.log("loading links");
								for (var i=0, l=response.status.links.length; i<l; i++) {
									var li = document.createElement('li');
									var aa = document.createElement('a');
									aa.id = "link"+i;
									aa.href = response.status.links[i].linkUrl;
									//aa.text = response.status.links[i].linkUrl.substr(0, 30);
									var urll = response.status.links[i].linkUrl.replace('http://','');
									aa.text = urll.replace('https://','').substr(0, 24)+'...';
									aa.width = "100px";
									aa.target = '_newtab';
									aa.padding = "5px";
									li.appendChild(aa);
									linkBlock.appendChild(li);								
								}
								document.getElementById('item-list').appendChild(linkBlock);
								
								console.log("loading selections");
								var selectionBlock = document.createElement('div');
								selectionBlock.id = 'selection-items';
								selectionBlock.style.display = 'inline-block';
								selectionBlock.style.cssText = 'margin-top:12px';
								for (var i=0, l=response.status.selections.length; i<l; i++) {
									var selectionItem = document.createElement('div');
									selectionItem.style.cssText = 'float:left;width:14px;height:14px;background:grey;display:block;margin:5px';
									selectionItem.title = response.status.selections[i].selectionText;
									selectionItem.id = "selection"+i;
									selectionBlock.appendChild(selectionItem);
								}
								document.getElementById('item-list').appendChild(selectionBlock);
								
								console.log("loading images");
								var imageBlock = document.createElement('div');
								imageBlock.id = 'image-items';
								imageBlock.style.display = 'inline-block';
								imageBlock.style.cssText = 'margin-top:12px';
								for (var i=0, l=response.status.images.length; i<l; i++) {
									var imageItem = document.createElement('img');
									imageItem.src = response.status.images[i].srcUrl;
									imageItem.style.cssText = 'float:left;height:36px;background:grey;display:block;margin:5px';
									imageItem.id = "image"+i;
									imageBlock.appendChild(imageItem);
								}
								document.getElementById('item-list').appendChild(imageBlock);
						});
					});								
  });
    
