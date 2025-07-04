/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var bcrypt = require("bcryptjs");  // pastikan bcryptjs terinstall (npm install bcryptjs)
var pgutil = require('./pgutil');

process.env.NODE_RED_HOME = __dirname;
pgutil.initPG();
pgutil.createTable();

var USERNAME = process.env.NODE_RED_USERNAME || "Iyanhafizh";
var PASSWORD = process.env.NODE_RED_PASSWORD || "Btg040603";
var HASHED_PASS = bcrypt.hashSync(PASSWORD, 8);

var settings = module.exports = {
    uiPort: process.env.PORT || 1880,
    httpAdminRoot: '/',
    httpNodeRoot: '/',
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 10000000,

    // Disable/blacklist nodes not friendly on hosting
    nodesExcludes:[ '66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js' ],

    autoInstallModules: true,

    // Admin UI login
    adminAuth: {
        type: "credentials",
        users: [{
            username: USERNAME,
            password: HASHED_PASS,
            permissions: "*"
        }]
    },

    // Dashboard login
    httpNodeAuth: {
        user: USERNAME,
        pass: HASHED_PASS
    },

    // CORS agar dashboard bisa diakses frontend lain (opsional)
    httpNodeCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    },

    // Disables credential encryption if you want
    credentialSecret: false,

    functionGlobalContext: { },

    // Postgres storage (custom)
    storageModule: require("./pgstorage")
};

// Untuk jika pakai ENV dari platform hosting
if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
    settings.adminAuth.users = [{
        username: process.env.NODE_RED_USERNAME,
        password: bcrypt.hashSync(process.env.NODE_RED_PASSWORD, 8),
        permissions: "*"
    }];
    settings.httpNodeAuth = {
        user: process.env.NODE_RED_USERNAME,
        pass: bcrypt.hashSync(process.env.NODE_RED_PASSWORD, 8)
    };
}

// Custom untuk pgstorage
settings.pgAppname = 'nodered';
