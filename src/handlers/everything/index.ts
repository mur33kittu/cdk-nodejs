
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getEverything } from "../fetch";

exports.handler = async (event: APIGatewayProxyEventV2, context: APIGatewayProxyResultV2) => {
    const searchString = event.pathParameters?.searchString;
    const everythingData = await getEverything(searchString);

    return {
        body: JSON.stringify(everythingData),
        statusCode: 200,
    };
};
