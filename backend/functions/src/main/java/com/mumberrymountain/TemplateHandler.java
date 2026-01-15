package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.Base64Utils;
import com.mumberrymountain.util.JacksonUtils;
import com.mumberrymountain.util.ResponseUtils;

import java.io.InputStream;
import java.util.Map;

public class TemplateHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) return ResponseUtils.preflight();

        try {
            Map<String, String> requestData = JacksonUtils.toObject(Base64Utils.decodeBase64ToJson(input.getBody()), Map.class);
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("hwpx/" + requestData.get("fileName"));
            if (inputStream == null) throw  new Exception("File not found");

            return ResponseUtils.success("output.hwpx", inputStream.readAllBytes());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.error();
        }
    }
}
