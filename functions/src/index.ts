import * as admin from 'firebase-admin';
admin.initializeApp();

exports.collections = require('./collections');
exports.forms = require('./forms');
