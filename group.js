
console.log("loading group content script");

document.addEventListener('DOMContentLoaded', function() {
			console.log("DOMContentLoaded")
						chrome.extension.sendMessage({message: "GETACTIVEITEMS"},
							function (response) {
								var jsonexport = JSON.stringify(response.status);
								document.getElementById('export-json').innerHTML = jsonexport;
								console.log('rendering item block');
								console.log(response.status.links);
								var linkBlock = document.createElement('div');
								console.log("loading links");
								for (var i=0, l=response.status.links.length; i<l; i++) {
									var li = document.createElement('li');
									var aa = document.createElement('a');
									aa.id = "link"+i;
									aa.href = response.status.links[i].linkUrl;
									aa.text = response.status.links[i].linkUrl.substr(0, 30);
									aa.width = "100px";
									aa.target = '_newtab';
									aa.padding = "5px";
									li.appendChild(aa);
									linkBlock.appendChild(li);								
								}
								document.getElementById('item-list').appendChild(linkBlock);
								
								var selectionBlock = document.createElement('div');
								for (var i=0, l=response.status.selections.length; i<l; i++) {
								var selectionItem = document.createElement('div');
								selectionItem.innerHTML = response.status.selections[i].selectionText;
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
									imageItem.style.cssText = 'float:left;height:120px;background:grey;display:block;margin:5px';
									imageItem.id = "image"+i;
									imageBlock.appendChild(imageItem);
								}
								document.getElementById('item-list').appendChild(imageBlock);
					
						});
					});
					
    
