package com.mumberrymountain.util;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

public class ResponseUtils {
    private static final String ALLOW_ORIGIN = "https://www.hwpxtemplater.link";
    private static final String ACCEPT = "*/*";

    public static APIGatewayProxyResponseEvent preflight() {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(200)
                .withHeaders(Map.of(
                        "Access-Control-Allow-Origin", ALLOW_ORIGIN,
                        "Access-Control-Allow-Methods", "GET,POST,OPTIONS",
                        "Access-Control-Allow-Headers", "Content-Type,Authorization"
                ));
    }

    public static APIGatewayProxyResponseEvent success(String fileName, byte[] file) throws IOException {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(200)
                .withHeaders(Map.of(
                        "Access-Control-Allow-Origin", ALLOW_ORIGIN,
                        "Content-Type", "application/octet-stream",
                        "Content-Disposition", "attachment; filename*=UTF-8''" + CommonUtils.encodeFileName(fileName),
                        "Accept", ACCEPT  // 추가
                ))
                .withIsBase64Encoded(true)
                .withBody(Base64.getEncoder().encodeToString(file));
    }

    public static APIGatewayProxyResponseEvent error() {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(500)
                .withHeaders(Map.of("Access-Control-Allow-Origin", ALLOW_ORIGIN))
                .withBody("{\"message\":\"HWPX generation failed\"}");
    }
}
