const pgutil = require("./pgutil");

// Konfigurasi default: pakai local filesystem
let usePG = false;
let storageModule = require("node-red/lib/storage/localfilesystem");

try {
  const pool = pgutil.initPg();
  if (pool) {
    usePG = true;
    pgutil.createTable()
      .then(() => console.log("[pgutil] Table creation completed."))
      .catch(err => console.warn("[pgutil] Table creation failed:", err.message));
  } else {
    console.warn("[pgutil] PG init returned null. Using local filesystem storage.");
  }
} catch (err) {
  console.warn("[pgutil] PG init error:", err.message);
}

// Ganti ke pgstorage jika DB tersedia
if (usePG) {
  try {
    storageModule = require("./pgstorage");
    console.log("[pgutil] Using PostgreSQL storage module.");
  } catch (err) {
    console.warn("[pgutil] Failed to load pgstorage. Falling back to localfilesystem.");
    storageModule = require("node-red/lib/storage/localfilesystem");
  }
}

// Admin credentials
const USERNAME = "Iyanhafizh";
const HASHED_PASS = "$2a$08$PtGa6Cpm64SzGiO/sKcpkeAQZ6l8cD9tPG14ZAV4mEyDiTLeEJSMu";

module.exports = {
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

  storageModule: storageModule,

  pgAppname: 'nodered'
};
