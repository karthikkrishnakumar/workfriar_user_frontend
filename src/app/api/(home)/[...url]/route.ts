import Axios, { AxiosRequestConfig } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const urlParts: string = request.url;
    let endpointUrl = urlParts.split("/api/")[1]; // Split and get the part after 'api/'
    endpointUrl = "api/" + endpointUrl;

    // Create axios client with or without auth token based on URL
    const axioClient = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      withCredentials: true,
    });

    // Only add authorization header if the route is not public
    if (!endpointUrl.includes("common")) {
      const cookieHeader: string = request.headers?.get("cookie") || "";
      const authCookieData = parse(cookieHeader);

      if (authCookieData) {
        let cookies = ""
        const token = authCookieData[`${process.env.INTERSECTION_COOKIE}`];
        const deviceId = authCookieData["deviceId"];
        const sessionId = authCookieData["connect.sid"];

        if(deviceId){
          cookies += `deviceId=${deviceId}; `
        }

        if(token){
          cookies += `${process.env.INTERSECTION_COOKIE}=${token}; `
        }

        if (sessionId) {
          cookies += `connect.sid=${sessionId}`;
        }

        axioClient.defaults.headers["Cookie"] = cookies;
      }
    }

    const contentType = request.headers.get("content-type") || "";
    let requestConfig: AxiosRequestConfig;

    if (contentType.includes("application/json")) {
      // Handle JSON request body
      const jsonData = await request.json();
      requestConfig = {
        method: "post",
        url: endpointUrl,
        data: jsonData,
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else if (contentType.includes("multipart/form-data")) {
      // Handle multipart/form-data request body
      const formData = await request.formData();
      requestConfig = {
        method: "post",
        url: endpointUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    } else {
      // Handle other content types if necessary
      throw new Error("Unsupported content type");
    }

    const responseResult = await axioClient(requestConfig).catch((error) => {
      if (error.response && error.response.status === 422) {
        error.response.data.status = false;
        return error.response;
      }
      return error;
    });

    if (responseResult.status === 401) {
      const response = NextResponse.redirect(new URL("/login", request.url), {
        status: 401,
      });

      // Clear the authentication cookie
      response.cookies.set(process.env.INTERSECTION_COOKIE as string, "", {
        maxAge: 0,
      });

      return response;
    }
    
    else if (responseResult.status === 200 || responseResult.status === 422) {
      const response = NextResponse.json(responseResult.data, {
        status: responseResult.status,
      });

      // Add cookies from the backend response to the Next.js response
      const setCookieHeader = responseResult.headers["set-cookie"];

      if (setCookieHeader) {
        setCookieHeader.forEach((cookie: string) => {
          const [cookieNameValue, ...attributes] = cookie.split(";");
          const [cookieName, cookieValue] = cookieNameValue.split("=");
      
          const name = cookieName.trim();
          const value = cookieValue.trim();
      
          const cookieSettings: any = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",
            path: "/", // Accessible across the entire site
          };
      
          const expiryData = attributes.find((item) =>
            item.trim().startsWith("Expires=")
          );
      
          if (name === process.env.INTERSECTION_COOKIE && expiryData) {
            cookieSettings.maxAge = 60 * 60 * 24 * 7; // Cookie expiration in seconds (7 days)
          }
      
          // Use NextResponse's cookie API to set the cookie
          response.cookies.set(name, value, cookieSettings);
        });
      }
      return response;
    } else {
      return NextResponse.json(
        { error: "Unexpected response from server" },
        { status: responseResult ? responseResult.status : 500 },
      );
    }
  } catch (error) {
    // Check if error is an AxiosError type or has the expected properties
    let errorCode = "";
    let errorMessage = "Unknown request failure";

    if (error instanceof Axios.AxiosError && error.response) {
      errorCode = error.response.status.toString();
      errorMessage = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      errorCode = error.name;
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        status: false,
        error: {
          type: "TBC", // TBC: Trusted Backend Client
          code: errorCode,
          message: errorMessage,
        },
        message: "Unknown request failure",
      },
      { status: 500 },
    );
  }
}