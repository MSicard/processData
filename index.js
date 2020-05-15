const dynamo = require(`./lib/dynamo.js`);
const type = require(`./lib/types.js`);    
const response = require(`./lib/response.js`);
const bioreactor = require(`./lib/bioreactor.js`);

exports.handler = async (event) => {
    try {
        let responseBody = await bioreactor.putData(event)
        return response.buildSuccessResponse(`default`, responseBody);

    } catch(e) {
        console.log(e);
        return response.buildErrorResponse(e.code, e.message);
    }
};





