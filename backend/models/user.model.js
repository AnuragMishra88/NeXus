import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // ACCOUNT SECTION
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    linkedInProfile: {
        type: String,
        default: ""
    },

    // EDUCATION SECTION - FIXED WITH DEFAULTS
    collegeUniversity: {
        type: String,
        required: true,
        default: "Not provided yet"  // ✅ DEFAULT
    },
    degreeProgram: {
        type: String,
        required: true,
        enum: ['B.Tech', 'B.Sc', 'B.Com', 'BBA', 'B.A.', 'M.Tech', 'MBA', 'MCA', 'Other'],
        default: 'Other'  // ✅ DEFAULT
    },
    specialization: {
        type: String,
        default: ""
    },
    graduationYear: {
        type: Number,
        required: true,
        default: 2026  // ✅ DEFAULT
    },
    currentSemester: {
        type: String,
        default: ""
    },
    currentCGPA: {
        type: Number,
        default: null
    },
    tenthPercentage: {
        type: Number,
        required: true,
        default: 0  // ✅ DEFAULT
    },
    twelfthPercentage: {
        type: Number,
        required: true,
        default: 0  // ✅ DEFAULT
    },
    activeBacklogs: {
        type: String,
        default: ""
    },

    // CAREER SECTION
    resumeUrl: {
        type: String,
        default: ""  // ✅ ALREADY FIXED
    },
    resumeOriginalName: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    preferredRole: {
        type: String,
        default: ""
    },
    preferredLocation: {
        type: String,
        default: ""
    },
    experienceLevel: {
        type: String,
        default: ""
    },
    jobType: {
        type: String,
        default: ""
    },

    // ACCOUNT MANAGEMENT
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        default: 'student'
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },

    // SOCIAL/PROFILE
    bio: {
        type: String,
        default: ""
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },

    // ACCOUNT STATUS
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'deactivated'],
        default: 'active'
    },
    lastLogin: {
        type: Date,
        default: null
    }

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);