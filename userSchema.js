'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testEmail = function(value) {
    return /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$)/.test(value);
};
var emailValidator = [testEmail,'{VALUE} is not a valid email address'];

var UserSchema = new Schema({
    _id: { type: String, required: true, lowercase: true, validate: emailValidator, maxlength: [50, 'maximum character length (50) exceeded for email address'] },
    firstName: { type: String, required: true, maxlength: [50, 'first name maximum 50 character acceptable'] },
    middleName: { type: String, required: false, maxlength: [50, 'first name maximum 50 character acceptable'] },
    lastName: { type: String, required: false, maxlength: [50, 'last name maximum 50 character acceptable'] },
    nickName: { type: String, required: false,
    maxlength: [50, 'maximum character length (50) exceeded for nick name']},
    gender: {type: String, enum:['male','female'], required: true},
    birthDay:{
        day: { type: String, required: true},
        month: { type: String, required: true},
        year: { type: String, required: false},
    },
    contactDetails :{
        email: { type: String, required: true, lowercase: true},
        altEmail: { type: String, required: false, lowercase: true},
        mobilePhone: { type: String, required: true},
        homePhone: { type: String, required: false},
        workPhone: { type: String, required: false},
        fax: { type: String, required: false},
        messengerId: { type: String, required: false},
    },
    addressDetails: {
        aptNo: { type: String, required: false},
        street: { type: String, required: false},
        city: { type: String, required: true},
        county: { type: String, required: false},
        state: { type: String, required: true},
        country: { type: String, required: true},
        zip: { type: String, required: false}
    },
    profession: { type: String, required: true},
    reference: { type: String, required: false},
    parentId: { type: Schema.ObjectId, ref: 'User.userSchema'},
    relationship: { type: String, required: false },
    userType: { type: String, enum: ['user', 'manager', 'admin'], required: true },
    muktType: { type: String, enum: ['grihasta', 'amrish', 'snyashi', 'devotee'], required: true },
    userGroups: {
        type: [{type: String, ref: 'userGroup'}], default: []
    },
    userRoles: {
        type: [{type: String, ref: 'Role'}], default: []
    },
    userZones: {
        type: [{type: String, ref: 'Zones'}], default: []
    },
    userRating: { type: Number, required: false},
    followUp: { type: Number, required: false},
    salt: { type: String, required: true },
    password: { type: String, required: true },
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
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, default: null }
});

UserSchema.index({ 'userID': 1 }, { unique: true });
UserSchema.index({ 'email': 1 }, { unique: true });
UserSchema.set('validateBeforeSave', true);
var User = mongoose.model('User', UserSchema);

/* ---------------------------------------------------*/

var groupSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var userGroups = mongoose.model('userGroups', groupSchema);

/* ---------------------------------------------------*/

var roleSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String },
    appAccess : { type: [{ type: String }]},
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var Roles = mongoose.model('Roles', roleSchema);

/* ---------------------------------------------------*/

var zoneSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var Zones = mongoose.model('Zones', zoneSchema);

/* ---------------------------------------------------*/

var countrySchema = new Schema({
    countryCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var Country = mongoose.model('Country', countrySchema);

/* ---------------------------------------------------*/
var stateSchema = new Schema({
    stateCode: { type: String, required: true, unique: false },
    name: { type: String, required: true },
    countryObjID: { type: Schema.ObjectId,  required: true, ref: 'Country'},
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var State = mongoose.model('State', stateSchema);

/* ---------------------------------------------------*/

var publicationSchema = new Schema({
    publicationTitle: { type: String, required: true, unique: false },
    description: { type: String, required: true },
    user: { type: String,  required: true, ref: 'User'},
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var Publication = mongoose.model('Publication', publicationSchema);

/* ---------------------------------------------------*/

var businessSchema = new Schema({
    businessType: { type: String, required: true, unique: false },
    businessName: { type: String, required: true },
    businessOwner: { type: String,  required: true, ref: 'User'},
    contactDetails :{
        email: { type: String, required: true, lowercase: true},
        mobilePhone: { type: String, required: true},
        businessPhone: { type: String, required: false},
        fax: { type: String, required: false}
    },
    addressDetails: {
        buildingNo: { type: String, required: false},
        street: { type: String, required: false},
        city: { type: String, required: true},
        county: { type: String, required: false},
        state: { type: String, required: true},
        country: { type: String, required: true},
        zip: { type: String, required: false}
    },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

var Business = mongoose.model('Business', businessSchema);

/* ---------------------------------------------------*/

var donationType = new Schema({
    donationName: { type: String, required: true },
    displayName: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, ref: 'Users'},
    updatedAt: { type: Date, default: null },
    updatedBy: { type: String, ref: 'Users'}
});

module.exports = User;
module.exports = userGroups;
module.exports = Zones;
module.exports = Roles;
module.exports = Country;
module.exports = State;
module.exports = Publication;
module.exports = Business;
module.exports = donationType;