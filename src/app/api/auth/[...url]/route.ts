import Axios, { AxiosRequestConfig } from "axios";
import { parse } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const urlParts: string = request.url;
  let endpointUrl = urlParts.split("/api/")[1]; // Split and get the part after 'api/'
  endpointUrl = "api/" + endpointUrl;

  // Get the User-Agent from the client request headers
  const userAgent = request.headers.get("user-agent");

  const axioClient = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": userAgent || "",
    },
    withCredentials: true,
  });

  const cookieHeader: string = request.headers?.get("cookie") || "";
  const authCookieData = parse(cookieHeader);

  if (authCookieData) {
    let cookies = "";
    const token = authCookieData[`${process.env.INTERSECTION_COOKIE}`];
    const deviceId = authCookieData["deviceId"];
    const sessionId = authCookieData["connect.sid"];

    if (deviceId) {
      cookies += `deviceId=${deviceId}; `;
    }

    if (token) {
      cookies += `${process.env.INTERSECTION_COOKIE}=${token}; `;
    }

    if (sessionId) {
      cookies += `connect.sid=${sessionId}`;
    }

    axioClient.defaults.headers["Cookie"] = cookies;
  }

  try {
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

    const cookiesInstance = await cookies(); // Await the cookies instance

    if (responseResult.status === 401) {
      // Clear the authentication cookie
      cookiesInstance.set(process.env.INTERSECTION_COOKIE as string, "", {
        maxAge: 0,
      });

      // Redirect to login page
      return NextResponse.redirect(new URL("/login", request.url), {
        status: 401,
      });
    } else if (responseResult.status === 200 || responseResult.status === 422) {
      const response = NextResponse.json(responseResult.data, {
        status: responseResult.status,
      });

      // Add cookies from the backend response to the Next.js response
      const setCookieHeader = responseResult.headers["set-cookie"];

      if (setCookieHeader) {
        setCookieHeader.forEach((cookie: string) => {
          // Parse each cookie string to extract the name and value
          const [cookieNameValue, ...attributes] = cookie.split(";");
          const [cookieName, cookieValue] = cookieNameValue.split("=");

          const name = cookieName.trim();
          const value = cookieValue.trim();

          const cookieSettings: any = {
            httpOnly: true, // Adjust based on your requirements
            secure: false, // Ensures the cookie is sent over HTTPS only
            sameSite: "strict",
          };

          const expiryData = attributes.find((item) =>
            item.trim().startsWith("Expires=")
          );

          if (name === process.env.INTERSECTION_COOKIE && expiryData) {
            cookieSettings.maxAge = 60 * 60 * 24 * 7; // Cookie expiration in milliseconds (7 days)
          }

          if (name === "deviceId") {
            // Get the current date
            const expiryDate = new Date();

            // Add 3 months to the current date
            expiryDate.setMonth(expiryDate.getMonth() + 3);

            cookieSettings.expires = expiryDate;
          }

          // Set cookie using Next.js cookies API
          cookiesInstance.set(name, value, cookieSettings);
        });
      }

      return response;
    } else {
      return NextResponse.json(
        { error: "Unexpected response from server" },
        { status: responseResult ? responseResult.status : 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        error: {
          type: "TBC", // TBC: Trusted Backend Client
          code: error.code,
          message: error.message,
        },
        message: "Unknown request failure",
      },
      { status: 500 }
    );
  }
}
