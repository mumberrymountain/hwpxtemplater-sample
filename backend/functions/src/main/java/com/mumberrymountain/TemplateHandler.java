package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.RequestUtils;
import com.mumberrymountain.util.ResponseUtils;

import java.io.InputStream;

public class TemplateHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) return ResponseUtils.preflight();

        try {
            String fileName = RequestUtils.getParameter(input, "fileName");
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("hwpx/" + fileName);
            if (inputStream == null) throw new Exception("File not found");

            return ResponseUtils.success("output.hwpx", inputStream.readAllBytes());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.error();
        }
    }
}
