const dynamo = require(`./dynamo.js`);
const type = require(`./types.js`);   

async function getAvailableRestaurant(rfid) {
    try {
        console.log("TypeSort:", `${type.type.restaurant}#${rfid}` );
        let result = await dynamo.getItem(process.env.DYNAMO_TABLE_USER_NAME, 
            {
                "Type": type.type.restaurant,
                "TypeSort": `${type.type.restaurant}#${rfid}`
            }
        );
    
        if (Object.keys(result).length === 0) {
            const error = new Error(`Item not found`);
            error.errorType = `resource_not_found`;
            throw error;
        } 

        if (result['Item'].hasOwnProperty('isActive') && !result['Item'].isActive) {
            const error = new Error(`Restaurant not authorized`);
            error.errorType = `Unauthorized`;
            throw error;
        }
        
        return result['Item'];
    } catch(e) {
        console.log(`Restaurant not exists ${rfid}`);
        throw e;
    }
}

module.exports = {
    getAvailableRestaurant,
}