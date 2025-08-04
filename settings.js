const pgutil = require("./pgutil");

let usePG = false;
let storageModule = require("node-red/lib/storage/localfilesystem");

try {
  const pool = pgutil.initPG();
  if (pool) {
    usePG = true;
    pgutil.createTable()
      .then(() => console.log("[pgutil] Table creation completed."))
      .catch(err => console.warn("[pgutil] Table creation failed:", err.message));
  } else {
    console.warn("[pgutil] PG init returned null. Using local storage.");
  }
} catch (err) {
  console.warn("[pgutil] PG init error:", err.message);
}

// Gunakan storage yang sesuai
if (usePG) {
  storageModule = require("./pgstorage");
}

module.exports = {
  // ...
  storageModule: storageModule,
  // ...
}

// Login Admin
const USERNAME = "Iyanhafizh";
const HASHED_PASS = "$2a$08$PtGa6Cpm64SzGiO/sKcpkeAQZ6l8cD9tPG14ZAV4mEyDiTLeEJSMu";

const settings = module.exports = {
  uiPort: process.env.PORT || 1880,
  httpAdminRoot: '/',
  httpNodeRoot: '/',
  mqttReconnectTime: 15000,
  serialReconnectTime: 15000,
  debugMaxLength: 10000000,

  nodesExcludes: [
    '66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js',
    '25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js'
  ],

  autoInstallModules: true,

  adminAuth: {
    type: "credentials",
    users: [{
      username: USERNAME,
      password: HASHED_PASS,
      permissions: "*"
    }]
  },

  httpNodeAuth: {
    user: USERNAME,
    pass: HASHED_PASS
  },

  httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
  },

  credentialSecret: false,

  functionGlobalContext: {},

  // OPTIONAL: ganti storageModule ke local jika ingin lepas dari PostgreSQL
  // storageModule: require("node-red/lib/storage/localfilesystem")

  storageModule: require("./pgstorage") // biarkan ini jika ingin tetap pakai pgstorage saat DB aktif
};

settings.pgAppname = 'nodered';
