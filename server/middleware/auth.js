exports.isAdmin = (req, res, next) => {
    const { role } = req.headers; // Temporary way: login ke waqt header mein role bhejenge
    if (role !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    next();
};

exports.protect = (req, res, next) => {
    const { userid } = req.headers; // Frontend se userId bhejenge headers mein
    if (!userid) return res.status(401).json({ message: "Not authorized" });
    next();
};