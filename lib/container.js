const dynamo = require(`./dynamo.js`);
const type = require(`./types.js`);    

async function getAvailableContainer(containerName) {
    try {
        let result = await dynamo.getItem(process.env.DYNAMO_TABLE_USER_NAME, 
            {
                "Type": type.type.container,
                "TypeSort": `${type.type.container}#${containerName}`
            }
        );

        if (Object.keys(result).length === 0) {
            const error = new Error(`Item not found`);
            error.errorType = `resource_not_found`;
            throw error;
        }

        if (result['Item'].hasOwnProperty('isVirtual') && result['Item'].isVirtual) {
            const error = new Error(`Item not authorized`);
            error.errorType = `Unauthorized`;
            throw error;
        }

        if (result['Item'].hasOwnProperty('isActive') && !result['Item'].isActive) {
            const error = new Error(`Container not authorized`);
            error.errorType = `Unauthorized`;
            throw error;
        }
        
        return result['Item'];
    } catch (e) {
        console.log(`Error getting an available container`, e);
        throw e;
    }

}

module.exports = {
    getAvailableContainer,
}