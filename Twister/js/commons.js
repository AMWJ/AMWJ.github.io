var License = function(uri, image) {
	var that = {};
	that.getUri = function(){
		return uri;
	}
	that.getImage = function(){
		return image;
	}
	return that;
}

License.ANY_DERIVATIVES = 0;
License.SHARE_ALIKE = 1;
License.NO_DERIVATIVES = 2;

License.CC_BY = License("https://creativecommons.org/licenses/by/4.0",
				"https://licensebuttons.net/l/by/4.0/88x31.png");
License.CC_BY_SA = License("https://creativecommons.org/licenses/by-sa/4.0",
				"https://licensebuttons.net/l/by-sa/4.0/88x31.png");
License.CC_BY_ND = License("https://creativecommons.org/licenses/by-nd/4.0",
				"https://licensebuttons.net/l/by-nd/4.0/88x31.png");
License.CC_BY_NC = License("https://creativecommons.org/licenses/by-nc/4.0",
				"https://licensebuttons.net/l/by-nc/4.0/88x31.png");
License.CC_BY_NC_SA = License("https://creativecommons.org/licenses/by-nc-sa/4.0",
				"https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png");
License.CC_BY_NC_ND = License("https://creativecommons.org/licenses/by-nc-nd/4.0",
				"https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png");
License.CC0 = License("https://creativecommons.org/publicdomain/zero/1.0/",
				"https://licensebuttons.net/l/publicdomain/88x31.png");

License.getCCLicense = function(license){
	return License[license];
}

License.fromUri = function(uri){
	var licensesByUri = {
		"https://creativecommons.org/licenses/by/4.0": License.CC_BY,
		"https://creativecommons.org/licenses/by-sa/4.0": License.CC_BY_SA,
		"https://creativecommons.org/licenses/by-nd/4.0":License.CC_BY_ND,
		"https://creativecommons.org/licenses/by-nc/4.0":License.CC_BY_NC,
		"https://creativecommons.org/licenses/by-nc-sa/4.0":License.CC_BY_NC_SA,
		"https://creativecommons.org/licenses/by-nc-nd/4.0":License.CC_BY_NC_ND,
		"https://creativecommons.org/publicdomain/zero/1.0/":License.CC0
	}
	return licensesByUri[uri];
}

var canRedistribute = function(twist, isCommercial) {
	return twist.author()==user || !isCommercial || [License.CC0, License.CC_BY, License.CC_BY_ND, License.CC_BY_SA].includes(twist.license());
}
var mustAttribute = function(twist) {
	return twist.author()!=user && twist.license()!=License.CC0;
}
var mayMakeDerivative = function(twist) {
	return twist.author()==user || [License.CC0, License.CC_BY, License.CC_BY_SA, License.CC_BY_NC, License.CC_BY_NC_SA].includes(twist.license());
}
var mustShareAlike = function(twist) {
	return twist.author()!=user && [License.CC_BY_SA, License.CC_BY_ND, License.CC_BY_NC_SA, License.CC_BY_NC_ND].includes(twist.license());
}