import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      collegeName,
      degree,
      specialization,
      graduationYear,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      skills,
      linkedinProfile,
      location,
      experienceLevel,
      jobType,
      preferredRole,
    } = req.body;

    // 1. Check Mandatory Fields
    if (!fullName || !email || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "Mandatory fields missing", success: false });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exists", success: false });

    // 3. Handle Resume File Upload (If provided during registration)
    const file = req.file;
    let resumeUrl = "";
    let resumeOriginalName = "";

    if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: 'auto', // Changed from 'raw' to 'auto'
        public_id: `resumes/${Date.now()}_${file.originalname.replace(".pdf", "")}`,
        flags: 'attachment:false', // Add this
        transformation: [
            { flags: 'attachment:false' }
        ]
    });
    resumeUrl = cloudResponse.secure_url;
    resumeOriginalName = file.originalname;
}
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User with all fields + resumeUrl
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      collegeUniversity: collegeName || "Not provided",
      degreeProgram: degree || "Other",
      specialization: specialization || "",
      graduationYear: Number(graduationYear) || 2026,
      currentCGPA: Number(cgpa) || 0,
      tenthPercentage: Number(tenthPercentage) || 0,
      twelfthPercentage: Number(twelfthPercentage) || 0,
      linkedInProfile: linkedinProfile || "",
      preferredLocation: location || "",
      experienceLevel: experienceLevel || "Fresher",
      jobType: jobType || "Full-time",
      preferredRole: preferredRole || "",
      skills: skills ? skills.split(",") : [],
      resumeUrl: resumeUrl, // SAVING THE CLOUDINARY URL HERE
      resumeOriginalName: resumeOriginalName,
    });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Account created successfully",
        user: { _id: user._id, fullName: user.fullName },
        success: true,
      });
  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    return res
      .status(500)
      .json({ message: "Server Error: " + error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

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
    }

    const tokenData = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

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
      resumeUrl: user.resumeUrl,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user: userResponse,
        success: true,
      });
  } catch (error) {
    console.log("🔥 LOGIN ERROR:", error.message);
    return res.status(500).json({
      message: "Login failed: " + error.message,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("🔥 LOGOUT ERROR:", error.message);
    return res.status(500).json({
      message: "Logout failed: " + error.message,
      success: false,
    });
  }
};

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
      bio,
    } = req.body;

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update only if value is provided (not undefined)
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (phoneNumber !== undefined)
      user.phoneNumber = phoneNumber.toString().trim();
    if (linkedInProfile !== undefined) user.linkedInProfile = linkedInProfile;
    if (collegeUniversity !== undefined)
      user.collegeUniversity = collegeUniversity;
    if (degreeProgram !== undefined) user.degreeProgram = degreeProgram;
    if (specialization !== undefined) user.specialization = specialization;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (currentSemester !== undefined) user.currentSemester = currentSemester;
    if (currentCGPA !== undefined) user.currentCGPA = currentCGPA;
    if (tenthPercentage !== undefined) user.tenthPercentage = tenthPercentage;
    if (twelfthPercentage !== undefined)
      user.twelfthPercentage = twelfthPercentage;
    if (activeBacklogs !== undefined) user.activeBacklogs = activeBacklogs;
    if (bio !== undefined) user.bio = bio;
    if (preferredRole !== undefined) user.preferredRole = preferredRole;
    if (preferredLocation !== undefined)
      user.preferredLocation = preferredLocation;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (jobType !== undefined) user.jobType = jobType;

    // Handle skills array
    if (skills !== undefined) {
      user.skills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    }

    // Handle resume file upload
    const file = req.file;
    if (file) {
      console.log("File received for resume:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      // Validate PDF
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed for resumes",
          success: false,
        });
      }

      try {
    const fileUri = getDataUri(file);
    
    // UPLOAD AS AUTO (Cloudinary will detect it's a PDF)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: 'auto', // Changed from 'raw' to 'auto'
        public_id: `resumes/${Date.now()}_${file.originalname.replace(".pdf", "")}`,
        type: 'upload',
        access_mode: 'public',
        flags: 'attachment:false', // Keep this flag
        // Also try with content disposition
        transformation: [
            { flags: 'attachment:false' }
        ]
    });

    console.log("PDF uploaded to Cloudinary:", cloudResponse.secure_url);

    // Use the URL as-is
    user.resumeUrl = cloudResponse.secure_url;
    user.resumeOriginalName = file.originalname;
} catch (uploadError) {
    console.log("🔥 CLOUDINARY UPLOAD ERROR:", uploadError.message);
        return res.status(400).json({
          message: "Resume upload failed: " + uploadError.message,
          success: false,
        });
    // ... error handling
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
      profilePhoto: user.profilePhoto,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.log("🔥 UPDATE PROFILE ERROR:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Update validation failed",
        error: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Update failed: " + error.message,
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log("🔥 GET PROFILE ERROR:", error.message);
    return res.status(500).json({
      message: "Failed to fetch profile: " + error.message,
      success: false,
    });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile photo is required",
        success: false,
      });
    }

    // Validate image file
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        message: "Only image files are allowed for profile photo",
        success: false,
      });
    }

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    user.profilePhoto = cloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Profile photo updated successfully",
      profilePhoto: cloudResponse.secure_url,
      success: true,
    });
  } catch (error) {
    console.log("🔥 UPLOAD PROFILE PHOTO ERROR:", error.message);
    return res.status(500).json({
      message: "Upload failed: " + error.message,
      success: false,
    });
  }
};
