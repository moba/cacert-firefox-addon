const {Cc, Ci, Cu} = require("chrome");
var {XPCOMUtils} = Cu.import("resource://gre/modules/XPCOMUtils.jsm");
var self = require("sdk/self");

function installCert(CertName, CertTrust) {
	var gIOService = Cc["@mozilla.org/network/io-service;1"]
                        .getService(Ci.nsIIOService);
	var certDB = Cc["@mozilla.org/security/x509certdb;1"]
                        .getService(Ci.nsIX509CertDB2);
	var scriptableStream = Cc["@mozilla.org/scriptableinputstream;1"]
                        .getService(Ci.nsIScriptableInputStream);

	var scriptableStream = Cc["@mozilla.org/scriptableinputstream;1"]
                                .getService(Ci.nsIScriptableInputStream);
	var channel = gIOService.newChannel(self.data.url(CertName), null, null);

	var input = channel.open();
	scriptableStream.init(input);

	var certfile = scriptableStream.read(input.available());
	scriptableStream.close();
	input.close();

	var beginCert = "-----BEGIN CERTIFICATE-----";
	var endCert = "-----END CERTIFICATE-----";

	certfile = certfile.replace(/[\r\n]/g, "");
	var begin = certfile.indexOf(beginCert);
	var end = certfile.indexOf(endCert);
	var cert = certfile.substring(begin + beginCert.length, end);

	certDB.addCertFromBase64(cert, CertTrust, "");
}

exports.main = function() {
    installCert("cacert-root.crt", "C,c,c");
}
