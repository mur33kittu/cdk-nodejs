
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getHeadLines } from "../fetch";;


exports.handler = async (event: APIGatewayProxyEventV2, context: APIGatewayProxyResultV2) => {
    const country = event.pathParameters?.country || 'us';
    // const url = process.env.newsApiBaseUrl + `top-headlines?country=${country}&apiKey=77291c5dc4314be788ebc3591ea7d40c`;
    // console.log(url);
    const headLines = await getHeadLines(country);
    // console.log(event, context);

    return {
        body: JSON.stringify(headLines),
        statusCode: 200,
    };
};
