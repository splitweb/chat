/**
 *	This file is a part of the sophwork project
 *	@Tested version : Sophwork.0.2.2
 *	@author : Syu93
 *	--
 *	Split Object PHP Framework - Sophwork
 */

// Global variable
var Sophwork;
var Swk;

function Sophwork(tags){
 	var byClass = /(\.)/g; 
 	var byId = /(\#)/g; 
 	if(byClass.exec(tags) !== null)
		return document.getElementsByClassName(tags.replace('.', ''));
 	else if(byId.exec(tags))
 		return document.getElementById(tags.replace('#', ''));
 	else
 		return document.getElementsByClassName(tags.replace('.', ''));
 }
sophwork 	= Sophwork.prototype;
Swk 		= Sophwork.constructor;

// Not support for IE8 and older
Sophwork.ready = function(callback){
	document.addEventListener("DOMContentLoaded", function() {
	  callback();
	});
};
/**
 *	As Sophwork.php getUrl method
 */
Sophwork.getUrl = function(parameters) {
	// default value for the parameter argument
	parameters = (typeof parameters === "undefined") ? '' : parameters;
	var url = window.location.href;
	var splitUrl = url.split('/');
	
	// url composent
	var protocol = window.location.protocol;
	var hostname = window.location.hostname;
	var pathname = window.location.pathname;
	var uri = pathname.split('/');
	var c = uri.length;

	if(c < 3)
		return protocol + '//' + hostname + '/' + parameters;
	else
		return protocol + '//' + hostname + '/' + uri[1] + '/' + parameters;
};
/**
 *	As Sophwork.php redirect method
 */
Sophwork.redirect = function(parameters){
	// default value for the parameter argument
	parameters = (typeof parameters === "undefined") ? '' : parameters;
	var url = window.location.href;
	var splitUrl = url.split('/');
	
	// url composent
	var protocol = window.location.protocol;
	var hostname = window.location.hostname;
	var pathname = window.location.pathname;
	var uri = pathname.split('/');
	var c = uri.length;

	if(c < 3)
		var localUrl = protocol + '//' + hostname + '/' + parameters;
	else
		var localUrl = protocol + '//' + hostname + '/' + uri[1] + '/' + parameters;
	window.location = localUrl;
};

Sophwork.AJAX = function(data, callback, URL, type){
	callback = (typeof callback === "undefined") ? function(){} : callback;
	URL = (typeof URL === "undefined") ? window.location.href : URL;
	type = (typeof type === "undefined") ? "json" : type;
	$.ajax({
		type: "POST",
		url: URL,
		data: data,
		success: function(data){callback(data)}, 
		dataType: type
	});
}