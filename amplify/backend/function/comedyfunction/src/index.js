

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const message = "Hello Laugh Central"
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    // enable CORS requests
     headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "*"
     },
        body: message,
    };
};
