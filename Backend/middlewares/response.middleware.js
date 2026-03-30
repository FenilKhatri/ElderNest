const sendResponse = ({
    res,
    statusCode = 200,
    success = true,
    message = "Success",
    data = null,
    meta = null,
}) => {
    res.status(statusCode).json({
        success,
        message,
        data,
        ...(meta && { meta }),
    });
};

export default sendResponse;