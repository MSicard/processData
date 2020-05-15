const dynamo = require(`./dynamo.js`);
const type = require(`./types.js`);    
const Container = require(`./container.js`);
const Restaurant = require(`./restaurant.js`);

async function putData(event) {
    try {
        let container = await Container.getAvailableContainer(event.container);
        let restaurant = await Restaurant.getAvailableRestaurant(event.rfid);
        let lastValue = await dynamo.getItem(process.env.DYNAMO_TABLE_USER_NAME,
            {
                "Type": type.type.lastData,
                "TypeSort": `${type.type.container}#${event.container}`
            }
        );
        
        if (event.isFirst) {
            return putAnonimo(event, container, lastValue);
        } else {
            return putContainer(event, container, restaurant, lastValue);
        }
       
    } catch (e) {
        console.log(`error putting data`, e);
        throw e;
    }
}

async function putAnonimo(event, container, lastValue) {
    try {
        let date = Date.now();
        let diffValue = 0;
        
        if (Object.keys(lastValue).length > 0) {
            diffValue = event.value - lastValue['Item'].weight; 
        }
    
        if (diffValue < 1) {
            return `El valor no es anónimo, la diferencia es ${diffValue}`
        }
    
        let item = {
            type: type.type.data,
            typeSort: date,
            weight: event.value,
            user: 'Anonimo',
            rfid: 'Anonimo',
            container: container.name,
            containerid: container.id,
            diffWeight: diffValue,
            userid: 'Anonimo'
        }
    
        let lastItem = {
            Type: type.type.lastData,
            TypeSort:  `${type.type.container}#${event.container}`,
            weight: event.value,
            time: date
        }

        await dynamo.putItem(process.env.DYNAMO_TABLE_USER_NAME, lastItem);
        await dynamo.putItem(process.env.DYNAMO_TABLE_NAME, item);
    
        return item;
    } catch (e) {
        console.log('Error with first value', e);
        throw e;
    }
}


async function putContainer(event, container, restaurant, lastValue) {
    try {
        let date = Date.now();
        let item = {
            type: type.type.data,
            typeSort: date,
            weight: event.value,
            user: restaurant.name,
            rfid: event.rfid,
            container: container.name,
            containerid: container.id,
            diffWeight: parseInt(event.value),
            userid: event.rfid.split(' ').join('')
        }
        
        if (lastValue !== undefined) {
             if (Object.keys(lastValue).length > 0) {
                let diffValue = event.value - lastValue['Item'].weight;
                if (diffValue > 0) {
                    item.diffWeight = diffValue;
                }
            }
        }
        
        let lastItem = {
            Type: type.type.lastData,
            TypeSort:  `${type.type.container}#${event.container}`,
            weight: event.value,
            time: date
        }

        await dynamo.putItem(process.env.DYNAMO_TABLE_USER_NAME, lastItem);
        await dynamo.putItem(process.env.DYNAMO_TABLE_NAME, item);

        return item;
    } catch (e) {
        console.log("Error with second value", e);
        throw e;
    }
}

module.exports = {
    putData,
}