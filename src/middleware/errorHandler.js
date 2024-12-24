module.exports = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: 'Multer error', error: err.message });
    }
    if (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
    next();
};
