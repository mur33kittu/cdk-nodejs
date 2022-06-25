import NewsAPI from 'ts-newsapi'
const newsapi = new NewsAPI('77291c5dc4314be788ebc3591ea7d40c');


export const getEverything = async (searchString: string = 'bitcoin') => {
    try {
        const data = await newsapi.getEverything({
            q: searchString,
            qInTitle: 'stock',
            language: 'en',
            sortBy: 'relevancy'
        })
        return data;
    }
    catch (error) {
        return error?.message;
    }
}


export const getHeadLines = async (country: any) => {
    try {
        const data = await newsapi.getTopHeadlines({
            country: country
        })
        return data;
    }
    catch (error) {
        return error?.message;
    }
}