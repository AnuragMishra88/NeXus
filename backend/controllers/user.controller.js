import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;
         
        // Check only basic required fields
        if (!fullName || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "Full name, email, phone number and password are required",
                success: false
            });
        };

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email',
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with ALL required fields
        const user = await User.create({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber: phoneNumber.toString().trim(),
            password: hashedPassword,
            
            // Account fields
            role: 'student',
            
            // Education fields (required in model)
            collegeUniversity: "Not provided yet",  // NON-EMPTY STRING
            degreeProgram: "Other",
            graduationYear: 2026,
            tenthPercentage: 0,
            twelfthPercentage: 0,
            
            // Career fields
            resumeUrl: "",
            
            // Optional fields with defaults
            linkedInProfile: "",
            specialization: "",
            currentSemester: "",
            currentCGPA: null,
            activeBacklogs: "",
            skills: [],
            preferredRole: "",
            preferredLocation: "",
            experienceLevel: "",
            jobType: "",
            profilePhoto: "",
            bio: "",
            isVerified: false,
            isProfileComplete: false,
            accountStatus: "active"
        });

        // Create JWT token
        const tokenData = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Prepare user response (without sensitive data)
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            collegeUniversity: user.collegeUniversity
        };

        return res.status(201).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict' 
        }).json({
            message: "Account created successfully",
            user: userResponse,
            success: true
        });
    } catch (error) {
        console.log("🔥 REGISTER ERROR:", error.message);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Validation failed",
                errors: errors,
                success: false
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
                success: false
            });
        }
        
        return res.status(500).json({
            message: "Registration failed: " + error.message,
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        };

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const tokenData = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Prepare user response
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profilePhoto: user.profilePhoto,
            collegeUniversity: user.collegeUniversity,
            degreeProgram: user.degreeProgram,
            graduationYear: user.graduationYear,
            resumeUrl: user.resumeUrl
        };

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict' 
        }).json({
            message: `Welcome back ${user.fullName}`,
            user: userResponse,
            success: true
        });
    } catch (error) {
        console.log("🔥 LOGIN ERROR:", error.message);
        return res.status(500).json({
            message: "Login failed: " + error.message,
            success: false
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log("🔥 LOGOUT ERROR:", error.message);
        return res.status(500).json({
            message: "Logout failed: " + error.message,
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            linkedInProfile,
            collegeUniversity,
            degreeProgram,
            specialization,
            graduationYear,
            currentSemester,
            currentCGPA,
            tenthPercentage,
            twelfthPercentage,
            activeBacklogs,
            skills,
            preferredRole,
            preferredLocation,
            experienceLevel,
            jobType,
            bio
        } = req.body;
        
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Update only if value is provided (not undefined)
        if (fullName !== undefined) user.fullName = fullName.trim();
        if (email !== undefined) user.email = email.toLowerCase().trim();
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.toString().trim();
        if (linkedInProfile !== undefined) user.linkedInProfile = linkedInProfile;
        if (collegeUniversity !== undefined) user.collegeUniversity = collegeUniversity;
        if (degreeProgram !== undefined) user.degreeProgram = degreeProgram;
        if (specialization !== undefined) user.specialization = specialization;
        if (graduationYear !== undefined) user.graduationYear = graduationYear;
        if (currentSemester !== undefined) user.currentSemester = currentSemester;
        if (currentCGPA !== undefined) user.currentCGPA = currentCGPA;
        if (tenthPercentage !== undefined) user.tenthPercentage = tenthPercentage;
        if (twelfthPercentage !== undefined) user.twelfthPercentage = twelfthPercentage;
        if (activeBacklogs !== undefined) user.activeBacklogs = activeBacklogs;
        if (bio !== undefined) user.bio = bio;
        if (preferredRole !== undefined) user.preferredRole = preferredRole;
        if (preferredLocation !== undefined) user.preferredLocation = preferredLocation;
        if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
        if (jobType !== undefined) user.jobType = jobType;
        
        // Handle skills array
        if (skills !== undefined) {
            user.skills = skills.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0);
        }

        // Handle resume file upload
        const file = req.file;
        if (file) {
            console.log("File received for resume:", {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });

            // Validate PDF
            if (file.mimetype !== 'application/pdf') {
                return res.status(400).json({
                    message: "Only PDF files are allowed for resumes",
                    success: false
                });
            }

            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: 'raw',
                    public_id: `resumes/${Date.now()}_${file.originalname.replace('.pdf', '')}`,
                    type: 'upload',
                    access_mode: 'public'
                });
                
                console.log("PDF uploaded to Cloudinary:", cloudResponse.secure_url);
                
                // Ensure URL ends with .pdf
                let pdfUrl = cloudResponse.secure_url;
                if (!pdfUrl.endsWith('.pdf')) {
                    pdfUrl += '.pdf';
                }
                user.resumeUrl = pdfUrl;
                user.resumeOriginalName = file.originalname;
                
            } catch (uploadError) {
                console.log("🔥 CLOUDINARY UPLOAD ERROR:", uploadError.message);
                return res.status(400).json({
                    message: "Resume upload failed: " + uploadError.message,
                    success: false
                });
            }
        }

        await user.save();

        // Prepare response
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            collegeUniversity: user.collegeUniversity,
            degreeProgram: user.degreeProgram,
            graduationYear: user.graduationYear,
            currentCGPA: user.currentCGPA,
            skills: user.skills,
            preferredRole: user.preferredRole,
            resumeUrl: user.resumeUrl,
            profilePhoto: user.profilePhoto
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: userResponse,
            success: true
        });
        
    } catch (error) {
        console.log("🔥 UPDATE PROFILE ERROR:", error.message);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Update validation failed",
                error: error.message,
                success: false
            });
        }
        
        return res.status(500).json({
            message: "Update failed: " + error.message,
            success: false
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user,
            success: true
        });
        
    } catch (error) {
        console.log("🔥 GET PROFILE ERROR:", error.message);
        return res.status(500).json({
            message: "Failed to fetch profile: " + error.message,
            success: false
        });
    }
}

export const uploadProfilePhoto = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Profile photo is required",
                success: false
            });
        }

        // Validate image file
        if (!file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                message: "Only image files are allowed for profile photo",
                success: false
            });
        }

        const userId = req.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        
        user.profilePhoto = cloudResponse.secure_url;
        await user.save();

        return res.status(200).json({
            message: "Profile photo updated successfully",
            profilePhoto: cloudResponse.secure_url,
            success: true
        });
        
    } catch (error) {
        console.log("🔥 UPLOAD PROFILE PHOTO ERROR:", error.message);
        return res.status(500).json({
            message: "Upload failed: " + error.message,
            success: false
        });
    }
}