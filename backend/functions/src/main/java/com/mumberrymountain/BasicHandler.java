package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.*;
import io.github.mumberrymountain.HWPXTemplater;

import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.Map;

public class BasicHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) return ResponseUtils.preflight();


        try {
            String fileName = RequestUtils.getParameter(input, "fileName");
            Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");
            Path templatePath = CommonUtils.getTmpResourcePath("hwpx/basic.hwpx");
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            HWPXTemplater.builder()
                    .parse(templatePath.toString())
                    .render(templateParam)
                    .write(baos);

            return ResponseUtils.success(fileName, baos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.error();
        }
    }
}
