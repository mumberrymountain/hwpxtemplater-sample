package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.type.TypeReference;
import com.mumberrymountain.util.*;
import io.github.mumberrymountain.HWPXTemplater;

import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.Base64;
import java.util.Map;

public class LoopHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        // OPTIONS 요청 처리 (CORS Preflight)
        if ("OPTIONS".equals(input.getHttpMethod())) {
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(Map.of("Access-Control-Allow-Origin", "*"));
        }

        try {
            String fileName = RequestUtils.getParameter(input, "fileName");
            Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");

            Path templatePath = CommonUtils.getTmpResourcePath("hwpx/loop.hwpx");
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            HWPXTemplater.builder()
                    .parse(templatePath.toString())
                    .render(templateParam)
                    .write(baos);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(Map.of(
                            "Access-Control-Allow-Origin", "*",
                            "Content-Type", "application/octet-stream",
                            "Content-Disposition", "attachment; filename*=UTF-8''" + CommonUtils.encodeFileName(fileName),
                            "Accept", "*/*"  // 추가
                    ))
                    .withIsBase64Encoded(true)
                    .withBody(Base64.getEncoder().encodeToString(baos.toByteArray()));

        } catch (Exception e) {
            e.printStackTrace();

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(500)
                    .withHeaders(Map.of("Access-Control-Allow-Origin", "*"))
                    .withBody("{\"message\":\"HWPX generation failed\"}");
        }
    }
}
