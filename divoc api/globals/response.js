module.exports = class Response {
    constructor(response, status, message, data) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.status(status).json({
            message: message,
            prototype: data
        });
    }
};