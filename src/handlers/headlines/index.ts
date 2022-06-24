
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from 'axios';

exports.handler = async (event: APIGatewayProxyEventV2, context: APIGatewayProxyResultV2) => {
    const country = 'US';
    const url = process.env.newsApiBaseUrl + `?country=${country}&apiKey=77291c5dc4314be788ebc3591ea7d40c`;
    const headLines = getHeadLines(url);
    console.log(event, context);

    return {
        body: JSON.stringify(headLines),
        statusCode: 200,
    };
};

const getHeadLines = async (url: string) => {
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