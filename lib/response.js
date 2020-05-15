const ERROR_TYPE_MAP = {
    default: {
        errorCode: 500,
        message: `Internal Server Error`,
    },
    unauthorized: {
        errorCode: 401,
        message: `Unauthorized`
    },
    forbidden: {
        errorCode: 403,
        message: `You don't have access to this resource`
    },
    resource_not_found: {
        errorCode: 400,
        message: `Resource not found`
    },
    bad_request_invalid_content_type_param: {
        errorCode: 400,
        message: `Invalid content type param`
    },
    precondition_failed: {
        errorCode: 412,
        message: `Invalid precondition`
    }
};

const SUCCESS_TYPE_MAP = {
    default: {
        code: 200,
        message: `ok`,
    },
    ok: {
        code: 200,
        message: `ok`
    },
    fetched: {
        code: 200,
        message: `ok`
    }
};

function getSuccessObject(SuccessType) {
    return SUCCESS_TYPE_MAP[SuccessType] || SUCCESS_TYPE_MAP.default;
}

function buildSuccessResponse(SuccessType, data, headers) {
    const successObject = getSuccessObject(SuccessType);
    const aHeaders = {
        "Access-Control-Allow-Origin": `*`, // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    };

    if (headers) {
        Object.assign(aHeaders, headers);
    }

    return {
        statusCode: successObject.code,
        body: JSON.stringify(data),
        headers: aHeaders
    };
}

function getErrorObject(ErrType) {
    return ERROR_TYPE_MAP[ErrType] || ERROR_TYPE_MAP.default;
}

function buildErrorResponse(ErrType, ErrMsg, headers) {
    const errorObject = getErrorObject(ErrType);
    const aHeaders = {
        "Access-Control-Allow-Origin": `*`, // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    };

    if (headers) {
        Object.assign(aHeaders, headers);
    }

    return {
        statusCode: errorObject.errorCode,
        body: JSON.stringify({
            errorType: ErrType || `INTERNAL_SERVER_ERROR`,
            message: ErrMsg || errorObject.message,
        }),
        headers: aHeaders
    };
}
module.exports = {
    buildErrorResponse,
    buildSuccessResponse,
};