export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Proceed if the user is an admin
    } else {
        res.status(403).json({ message: "Access Denied. Admins only." });
    }
};
