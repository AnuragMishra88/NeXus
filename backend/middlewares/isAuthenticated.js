import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Check for manual login token (from cookies)
        const token = req.cookies.token;
        
        // 2. Check for Clerk session (Google Login)
        // req.auth is populated by the ClerkExpressWithAuth middleware in index.js
        const clerkAuth = req.auth;

        // If neither exists, user is not logged in
        if (!token && (!clerkAuth || !clerkAuth.userId)) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Logic for Manual JWT Login
        if (token) {
            const decode = await jwt.verify(token, process.env.SECRET_KEY);
            if (!decode) {
                return res.status(401).json({
                    message: "Invalid token",
                    success: false
                });
            }
            // Set req.id so your existing controllers (Profile, Notes, etc.) still work
            req.id = decode.userId; 
            return next();
        }

        // Logic for Google Clerk Login
        if (clerkAuth && clerkAuth.userId) {
            // Bridge: Set req.id to the Clerk User ID
            // Note: If you want to link this to a MongoDB _id, you can find the user by clerkId here
            req.id = clerkAuth.userId;
            return next();
        }

    } catch (error) {
        console.log("Authentication Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export default isAuthenticated;