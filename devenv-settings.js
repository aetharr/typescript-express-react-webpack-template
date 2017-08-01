const   clientDevHost       = "http://localhost", // Change this to your machine's IP to enable external access
        clientDevPort       = "3001",
        clientDevAddr       = clientDevHost + ":" + clientDevPort,
        clientDevScriptPath = clientDevAddr + "/build",
        isDevelopment       = process.env.NODE_ENV !== 'production';

module.exports.clientDevHost         = clientDevHost;
module.exports.clientDevPort         = clientDevPort;
module.exports.clientDevAddr         = clientDevAddr;
module.exports.clientDevScriptPath   = clientDevScriptPath;
module.exports.isDevelopment         = isDevelopment;
