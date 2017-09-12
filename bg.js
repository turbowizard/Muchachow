
var THE_NAME = 'Muchachow';
var DEFAULT_ACTIVE_GROUP_NAME = 'default-group';
var DEFAULT_USER_GROUP_NAME = 'default-group';
var EMPTY_GROUP = {links:[],selections:[],images:[]};
var activeGroup = 'default-group';
var userGroups;
var groupItems;
var contextsSupported = ["link","selection","image"];

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
	groupItems[DEFAULT_USER_GROUP_NAME] = {links:[],selections:[],images:[]};
	
}

//generate scheme
initScheme();

function onClickHandler(info, tab) {
	if(info.menuItemId == "linkToGroup"){
		groupItems[activeGroup].links.push(info);
	} 
	else if(info.menuItemId == "selectionToGroup"){
		groupItems[activeGroup].selections.push(info);
	}
	else if(info.menuItemId == "imageToGroup"){
		groupItems[activeGroup].images.push(info);
	} 
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
	groupItems[userGroupName] = {links:[],selections:[],images:[]};	
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
	return groupItems[activeGroup];
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
		frameStatusLog();
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
});

