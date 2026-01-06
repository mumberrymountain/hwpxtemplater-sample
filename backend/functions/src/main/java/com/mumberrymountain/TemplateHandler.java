package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.Base64Utils;
import com.mumberrymountain.util.JacksonUtils;

import java.io.InputStream;
import java.util.Base64;
import java.util.Map;

public class TemplateHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {

        try {
            Map<String, String> requestData = JacksonUtils.toObject(Base64Utils.decodeBase64ToJson(input.getBody()), Map.class);

            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("hwpx/" + requestData.get("fileName"));

            if (inputStream == null) {
                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(404)
                        .withHeaders(Map.of("Access-Control-Allow-Origin", "*"))
                        .withBody("{\"error\": \"File not found\"}");
            }

            // 파일 내용 읽기
            byte[] fileContent = inputStream.readAllBytes();

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(Map.of(
                            "Access-Control-Allow-Origin", "*",
                            "Content-Type", "application/octet-stream",
                            "Content-Disposition", "attachment; filename=output.hwpx",
                            "Accept", "*/*"
                    ))
                    .withIsBase64Encoded(true)
                    .withBody(Base64.getEncoder().encodeToString(fileContent));

        } catch (Exception e) {
            e.printStackTrace();

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(500)
                    .withHeaders(Map.of("Access-Control-Allow-Origin", "*"))
                    .withBody("{\"message\":\"HWPX generation failed\"}");
        }
    }
}
