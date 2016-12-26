'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testEmail = function(value) {
    return /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$)/.test(value);
};
var emailValidator = [testEmail, '{VALUE} is not a valid email address'];

var UserSchema = new Schema({
    oldid: {
        type: Number,
        required: true
    },
    firstName: { type: String, required: true, maxlength: [50, 'first name maximum 50 character acceptable'] },
    middleName: { type: String, required: false, maxlength: [50, 'first name maximum 50 character acceptable'] },
    lastName: { type: String, required: false, maxlength: [50, 'last name maximum 50 character acceptable'] },
    nickName: {
        type: String,
        required: false,
        maxlength: [50, 'maximum character length (50) exceeded for nick name']
    },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    birthDay: {
        day: { type: String, required: false },
        month: { type: String, required: false },
        year: { type: String, required: false },
    },
    contactDetails: {
        email: { type: String, required: false, lowercase: true },
        altEmail: { type: String, required: false, lowercase: true },
        mobilePhone: { type: String, required: false },
        homePhone: { type: String, required: false },
        workPhone: { type: String, required: false },
        fax: { type: String, required: false },
        messengerId: { type: String, required: false },
    },
    addressDetails: {
        aptNo: { type: String, required: false },
        street: { type: String, required: false },
        city: { type: String, required: false },
        county: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zip: { type: String, required: false }
    },
    profession: { type: String, required: false },
    reference: { type: String, required: false },
    parentId: { type: Schema.ObjectId, ref: 'User.userSchema' },
    relationship: { type: String, required: false },
    userType: { type: String, enum: ['superadmin','admin', 'write', 'read'], required: true, default: 'read' },
    muktType: [{ type: String, enum: ['ambrish', 'american', 'angat', 'cricket', 'general', 'karyakarta', 'kid', 'married', 'nisthawaan', 'sahishnu',
                'sahradayi', 'samanvay', 'sampark', 'sat. sabha', 'single', 'sundaysabha','vip', 'vvip', 'youth'], required: false, default: 'general' }],
    userGroups: {
        type: [{ type: String, ref: 'userGroup' }],
        default: []
    },
    userRoles: {
        type: [{ type: String, ref: 'Role' }],
        default: []
    },
    myZone: { type: String, ref: 'Zones' },
    userZones: {
        type: [{ type: String, ref: 'Zones' }],
        default: []
    },
    userRating: { type: Number, required: false },
    mailSubscription: { type: Boolean, enum: [ true, false], required: true, default: false },
    loginId: { type: String, required: false },
    salt: { type: String, required: false },
    password: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
    isRegistered: { type: Boolean, required: true, default: false },
    authToken: {
        token: { type: String },
        expiresAt: { type: Date }
    },
    registerToken: {
        token: { type: String, required: false },
        expiresAt: { type: Date }
    },
    notificationsPreference: {
        sms: { type: Boolean, required: true, default: true },
        email: { type: Boolean, required: true, default: true },
        call: { type: Boolean, required: true, default: true },
        whatsapp: { type: Boolean, required: true, default: true }
    },
    primaryManager: { type: Schema.ObjectId, ref: 'User.userSchema' },
    secondryManager:[{ type: Schema.ObjectId, ref: 'User.userSchema' }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, default: null }
});

UserSchema.index({ 'oldid': 1 }, { unique: true });
//UserSchema.index({ 'email': 1 }, { unique: true });
UserSchema.set('validateBeforeSave', true);
var Users = mongoose.model('User', UserSchema);

/* ---------------------------------------------------*/

var groupSchema = new Schema({
    //_id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true},
    desc: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var userGroups = mongoose.model('userGroups', groupSchema);

/* ---------------------------------------------------*/

var roleSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String },
    appAccess: { type: [{ type: String }] },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var Roles = mongoose.model('Roles', roleSchema);

/* ---------------------------------------------------*/

var zoneSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var Zones = mongoose.model('Zones', zoneSchema);

/* ---------------------------------------------------*/

var countrySchema = new Schema({
    countryCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var Country = mongoose.model('Country', countrySchema);

/* ---------------------------------------------------*/
var stateSchema = new Schema({
    name: { type: String, required: true },
    stateCode: { type: String, required: true, unique: false },
    zoneObjID: { type: Schema.ObjectId, required: true, ref: 'Zones' },
    countryObjID: { type: Schema.ObjectId, required: false, ref: 'Country' },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var State = mongoose.model('State', stateSchema);

/* ---------------------------------------------------*/

var publicationSchema = new Schema({
    publicationTitle: { type: String, required: true, unique: false },
    description: { type: String, required: true },
    publicationType: { type: String, enum: ['AUDIO', 'Email', 'OUTREACH', 'PATRIKA', 'YOGIBAAL'], required: true},
    user: { type: String, required: true, ref: 'User' },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var Publication = mongoose.model('Publication', publicationSchema);

/* ---------------------------------------------------*/

var businessSchema = new Schema({
    businessType: { type: String, required: true, unique: false },
    businessName: { type: String, required: true },
    businessOwner: { type: String, required: true, ref: 'User' },
    contactDetails: {
        email: { type: String, required: false, lowercase: true },
        mobilePhone: { type: String, required: false },
        businessPhone: { type: String, required: false },
        fax: { type: String, required: false }
    },
    addressDetails: {
        buildingNo: { type: String, required: false },
        street: { type: String, required: false },
        city: { type: String, required: true },
        county: { type: String, required: false },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: false }
    },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});

var Business = mongoose.model('Business', businessSchema);

/* ---------------------------------------------------*/

var DonationTypeSchema = new Schema({
    donationName: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, unique: false },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users' },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users' }
});
var DonationType = mongoose.model('DonationType', DonationTypeSchema);

module.exports = {
 Users: Users,
 userGroups: userGroups,
 Zones: Zones,
 Roles: Roles,
 Country: Country,
 State: State,
 Publication: Publication,
 Business: Business,
 DonationType: DonationType
};
