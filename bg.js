
var THE_NAME = 'Muchachow';
var DEFAULT_ACTIVE_GROUP_NAME = 'default-group';
var DEFAULT_USER_GROUP_NAME = 'default-group';
//var EMPTY_GROUP = {links:[],selections:[],images:[]};
var activeGroup = 'default-group';
var userGroups;
var groupItems;
var contextsSupported = ["link","selection","image"];
var opts = {'decayMode':{'enabled':true,'decay':120}}; //H
var timeFactor = 1000*60*60;

function frameStatusLog(){
	console.log("log");
	console.log(activeGroup);
	console.log(userGroups);
	console.log(groupItems);
}

function initScheme(){
	activeGroup = '';
	userGroups = [];
	groupItems = {};
	activeGroup = DEFAULT_ACTIVE_GROUP_NAME;
	updateContextMenu();
	userGroups.push(DEFAULT_USER_GROUP_NAME);
	groupItems[DEFAULT_USER_GROUP_NAME] = {name:DEFAULT_USER_GROUP_NAME,items:[]};
	
}

//generate model
initScheme();

function onClickHandler(info, tab) {
	var clickSource = info.menuItemId;
	delete info['frameId'];
	delete info['menuItemId'];
	delete info['parentMenuItemId'];
	var d = new Date();
	if(clickSource == "linkToGroup"){
		info['mType'] = 'link';
	} 
	else if(clickSource == "selectionToGroup"){
		info['mType'] = 'selection';
	}
	else if(clickSource == "imageToGroup"){
		info['mType'] = 'image';
	}
	else{
		info['mType'] = 'NOT SUPPORTED';
	}	
	groupItems[activeGroup].items.push(info);
	groupItems[activeGroup].regDate = d.getTime();
};
chrome.contextMenus.onClicked.addListener(onClickHandler);

//rightclick context menu
chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({"title": THE_NAME, "contexts": contextsSupported,"id": "rootcon"});
		for (var i=0, l=contextsSupported.length; i<l; i++) {
			chrome.contextMenus.create(
			{"title": contextsSupported[i].toUpperCase()+' -> '+activeGroup, 
				"parentId": "rootcon", "contexts":[contextsSupported[i]], "id": contextsSupported[i]+"ToGroup"});
		}
	});


function updateContextMenu(){
		for (var i=0, l=contextsSupported.length; i<l; i++) {
			chrome.contextMenus.update(contextsSupported[i]+"ToGroup", {
				title: contextsSupported[i].toUpperCase()+' -> '+activeGroup
			});
		}
}

function addUserGroup(userGroupName){
	userGroups.push(userGroupName);
	activeGroup = userGroupName;
	updateContextMenu();
	var d = new Date();
	groupItems[userGroupName] = {name:userGroupName,regDate:d.getTime(),mark:'green',items:[]};
	console.log(groupItems[userGroupName]);
}

function deleteUserGroup(userGroupName){
	for (var i=userGroups.length-1; i>=0; i--) {
		if (userGroups[i] === userGroupName) {
			userGroups.splice(i, 1);
		}
		delete groupItems[userGroupName];
		activeGroup = userGroups[0];
		updateContextMenu();
	}
}

function getActiveItems(){
	return groupItems[activeGroup].items;
}

function getGroupItems(groupName){
	return groupItems[groupName].items;
}

function inUserGroups(group){
	for (var i=0, l=userGroups.length; i<l; i++) {
		if(userGroups[i] == group){
			return true;
		}
	}
	return false;
}
function expandUserGroup(userGroupName){
	chrome.tabs.create({ url: chrome.extension.getURL('group.html')+'?q='+userGroupName});
}

function importUserGroup(jsonGroup){
	userGroups.push(jsonGroup.name);
	activeGroup = jsonGroup.name;
	updateContextMenu();
	var d = new Date();
	jsonGroup.regDate = d.getTime();
	groupItems[jsonGroup.name] = jsonGroup;	
}
 function decayHandler(){
	var now = new Date();
	var status = {};
	for (var i=0, l=userGroups.length; i<l; i++) {
		if(userGroups[i] == DEFAULT_USER_GROUP_NAME){
		}
		else{
			var timeDiff = now.getTime() - groupItems[userGroups[i]].regDate;
			if(timeDiff > (opts['decayMode'].decay*timeFactor)){
				deleteUserGroup(userGroups[i]);
			}
			else if(timeDiff > (opts['decayMode'].decay*timeFactor/10*7)){
				status[userGroups[i]] = 'red';				
			}
			else if(timeDiff > (opts['decayMode'].decay*timeFactor/10*4)){
				status[userGroups[i]] = 'yellow';				
			}
			else{
				status[userGroups[i]] = 'green'	;			
			}
			
		}
	}
	return status;

} 
chrome.extension.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.message === "DROP" )
    {
		console.log('got '+request.message );
		initScheme();
		sendResponse( {status:"storage reinit"} );   
    }
	else if( request.message === "ADDGROUP" )
    {
		console.log('got '+request.message );
		var sendback = {status:'ok',add:''}
		if (request.name == ""){
			sendback.status = 'fail'
			sendback.add = 'group name cannot be empty';
		}
		else if(inUserGroups(request.name)){
			sendback.status = 'fail'
			sendback.add = 'group name must be uniqe';
		}
		else{
			addUserGroup(request.name);
		}
		sendResponse( sendback );   
    }
	else if( request.message === "GETGROUPS" )
    {	
		
		console.log('got '+request.message );
		if(opts['decayMode'].enabled){
			var groupsStatus = decayHandler();
			sendResponse( {status:userGroups, active:activeGroup, gstatus:groupsStatus} ); 
		}
		sendResponse( {status:userGroups, active:activeGroup} );  
    }
	else if( request.message === "GETACTIVEITEMS" )
    {
		console.log('got '+request.message );
		;
		sendResponse( {status:getActiveItems()} );   
    }
	else if( request.message === "CHANGEGROUP" )
    {
		console.log('got '+request.message +' ,to '+request.to);
		activeGroup = request.to;
		console.log(activeGroup);
		sendResponse( {status:'as'} );   
    }
	else if( request.message === "TEST" )
    {
		console.log('got '+request.message);
		sendResponse( {status:'ok'} );   
    }
	else if( request.message === "DELETEGROUP" )
    {
		console.log('got '+request.message+', '+request.to);
		deleteUserGroup(request.to);
		sendResponse( {status:'ok'} );  
    }
	else if( request.message === "EXPANDGROUP" )
    {
		console.log('got '+request.message+', '+request.to);
		expandUserGroup(request.to);
		sendResponse( {status:'ok'} );  
    }
	else if( request.message === "GETEXPANDITEMS" )
    {
		console.log('got '+request.message );
		sendResponse( {status:getGroupItems(request.to),name:request.to} );   
    }
	else if( request.message === "IMPORTGROUP" )
    {
		console.log('got '+request.message );
		var sendback = {status:'ok',add:''}
		if (request.json == ""){
			sendback.status = 'fail'
			sendback.add = 'json input is empty';
		}
		else{
			jsonGroup = JSON.parse(request.json);
			if(inUserGroups(jsonGroup.name)){
				sendback.status = 'fail'
				sendback.add = 'group name must be uniqe';
			}
			else{
				importUserGroup(jsonGroup);
			}
		}
		sendResponse( sendback );   
    }
});

