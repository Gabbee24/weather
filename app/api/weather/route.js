import { NextResponse,NextRequest } from "next/server";


export const GET = async (request) => {
    const url = new URL(request.url)
    const address = url.searchParams.get("address");
    const latitude = url.searchParams.get("lat");
    const longitude = url.searchParams.get("lon");

    let urll = "";

    const apikey = process.env.WEATHER_API;

    try {
        if(address){
            // urll =`https://api.openweathermap.org/data/2.5/weather?q=${address}&APPID=${apikey}`;
            // urll="https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=87d06811494fb6dd80dc2ddaba63fdbe";
            urll =`https://api.openweathermap.org/data/2.5/weather?q=${address}&APPID=${apikey}`;
        } else{
            urll =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${apikey}`;
        }
    
        const res = await fetch(urll);
        const data = await res.json();
        // return NextResponse.json({data});

        return new NextResponse(JSON.stringify({data}), { status: 200 });
    } catch (err) {
        return new NextResponse('Api weather error', { status: 500 });
    }
};