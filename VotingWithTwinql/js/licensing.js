Licensing = function(auth, license,  orig) {
	var that = {};
	that.author = function(){
		return auth;
	}
	that.license = function (){
		return license;
	}
	that.original = function (){
		return orig;
	}
	return Object.freeze(that);
}
