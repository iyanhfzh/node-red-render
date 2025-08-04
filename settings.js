/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var pgutil = require('./pgutil');

process.env.NODE_RED_HOME = __dirname;

const pool = pgutil.initPG();
if (pool) {
  pgutil.createTable().catch(err => {
    console.error("Failed to create DB tables:", err.message);
  });
} else {
  console.warn("PostgreSQL not initialized. Running Node-RED without DB.");
}

// Hardcoded username & bcrypt hash
var USERNAME = "Iyanhafizh";
var HASHED_PASS = "$2a$08$PtGa6Cpm64SzGiO/sKcpkeAQZ6l8cD9tPG14ZAV4mEyDiTLeEJSMu";

var settings = module.exports = {
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

    // Gunakan pgstorage hanya jika ingin tetap pakai DB
    // Ganti ke localfilesystem jika ingin Node-RED berjalan tanpa DB sama sekali
    // storageModule: require("node-red/lib/storage/localfilesystem")
    storageModule: require("./pgstorage")
};

settings.pgAppname = 'nodered';
