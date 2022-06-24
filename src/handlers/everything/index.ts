
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from 'axios';

exports.handler = async (event: APIGatewayProxyEventV2, context: APIGatewayProxyResultV2) => {
    const searchString = event.pathParameters?.searchString || 'bitcoin';
    let url = process.env.newsApiBaseUrl + "everything";
    const apiKey = "&apiKey=77291c5dc4314be788ebc3591ea7d40c";
    url += `?q=${searchString}` + apiKey
    console.log(url);
    const everythingData = await getEverything(url);
    console.log(event, context);

    return {
        body: JSON.stringify(everythingData),
        statusCode: 200,
    };
};

const getEverything = async (url: string) => {
    try {
        const { data, status } = await axios.get(url, {
            headers: {
                Accept: 'application/json',
            },
        });
        console.log('response status is: ', status);
        return data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return error.message;
        }
        else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}