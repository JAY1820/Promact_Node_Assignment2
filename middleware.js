// middleware.js
exports.notFoundHandler = (req, res) => {
    res.status(404).send('Page not found');
};
