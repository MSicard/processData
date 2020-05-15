const AWS = require(`aws-sdk`);

let dynamoClient;

function initDynamoClient() {
    if (typeof dynamoClient !== `undefined`) {
        return;
    }

    if (typeof process.env.DYNAMO_DB_REGION === `undefined`) {
        throw new Error(`error initializing dynamo client, missing configuration`);
    }
    dynamoClient = new AWS.DynamoDB.DocumentClient({
        region: process.env.DYNAMO_DB_REGION,
        apiVersion: `2012-08-10`
    });
}

async function putItem(aTableName, anItem) {
    try {
        initDynamoClient();
        return await dynamoClient.put({
            TableName: aTableName,
            Item: anItem
        }).promise();
    } catch (e) {
        console.log(`Error putting dynamo item ${JSON.stringify(anItem)}`, e);
        throw e;
    }
}

async function getItem(aTableName, aKey, aExpressionAttributeNames) {
 try {
     initDynamoClient();
     const result = await dynamoClient.get({
         TableName: aTableName,
         Key: aKey,
         ExpressionAttributeNames: aExpressionAttributeNames
     }).promise();

     console.log(result);
     return result;
 } catch (e) {
     console.log(`Error getting item with key: ${JSON.stringify(aKey)}`);
     throw e;
 }
}

async function queryItem(aTableName,
    aKeyConditionExpression,
    aExpressionAttributeNames,
    aExpressionAttributeValues) {
    try {
        initDynamoClient();
        const result = await dynamoClient.query({
            TableName: aTableName,
            KeyConditionExpression: aKeyConditionExpression,
            ExpressionAttributeNames: aExpressionAttributeNames,
            ExpressionAttributeValues: aExpressionAttributeValues,
        }).promise();

        if (Object.keys(result).length === 0) {
            const error = new Error(`Item not found`);
            error.errorType = `resource_not_found`;
            throw error;
        }

        return result.Items;
    } catch (e) {
        console.log(`Error getting dynamo item ${JSON.stringify(aKeyConditionExpression)}`, e);
        throw e;
    }
}

module.exports = {
    putItem,
    getItem,
    queryItem
}