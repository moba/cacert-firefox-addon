// borrowed from CCK

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
function addCertificate (CertName, CertTrust) {
	var gIOService = Components.classes["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	var certDB = Components.classes["@mozilla.org/security/x509certdb;1"].getService(Ci.nsIX509CertDB2);
	var scriptableStream=Components.classes["@mozilla.org/scriptableinputstream;1"].getService(Ci.nsIScriptableInputStream);
	var channel = gIOService.newChannel("chrome://trustedCAInstaller/content/" + CertName, null, null);
	var input=channel.open();
	scriptableStream.init(input);
	var certfile=scriptableStream.read(input.available());
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

addCertificate ( "cacert-root.crt", "C,c,c" );
