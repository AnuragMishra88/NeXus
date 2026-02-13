import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, unique: true, sparse: true },
    // MANDATORY SECTION
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    // OPTIONAL SECTION (Removed 'required: true' to prevent crashes)
    linkedInProfile: { type: String, default: "" },
    collegeUniversity: { type: String, default: "Not provided" },
    degreeProgram: { type: String, default: "Other" },
    specialization: { type: String, default: "" },
    graduationYear: { type: Number, default: 2026 },
    currentSemester: { type: String, default: "" },
    currentCGPA: { type: Number, default: 0 },
    tenthPercentage: { type: Number, default: 0 },
    twelfthPercentage: { type: Number, default: 0 },
    activeBacklogs: { type: String, default: "0" },
    
    // CAREER & SEARCH
    skills: { type: [String], default: [] },
    preferredRole: { type: String, default: "" },
    preferredLocation: { type: String, default: "" },
    experienceLevel: { type: String, default: "Fresher" },
    jobType: { type: String, default: "Full-time" },
    resumeUrl: { type: String, default: "" },
    resumeOriginalName: { type: String, default: "" },

    // ACCOUNT MANAGEMENT
    role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
    profilePhoto: { type: String, default: "" },
    accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);