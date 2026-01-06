package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.CommonUtils;
import com.mumberrymountain.util.RequestUtils;
import io.github.mumberrymountain.HWPXTemplater;
import io.github.mumberrymountain.model.Image;

import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ImageHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        try {
            String fileName = RequestUtils.getParameter(input, "fileName");
            Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");

            Path templatePath = CommonUtils.getTmpResourcePath("hwpx/image.hwpx");
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            HWPXTemplater.builder()
                    .parse(templatePath.toString())
                    .render(new HashMap<String, Object>() {{
                        put("proBook", new Image(CommonUtils.getTmpResourcePath((String) templateParam.get("proBook")).toString()).width(130).height(130));
                        put("smartBook", new Image(CommonUtils.getTmpResourcePath((String) templateParam.get("smartBook")).toString()).width(130).height(130));
                        put("ecoBook", new Image(CommonUtils.getTmpResourcePath((String) templateParam.get("ecoBook")).toString()).width(130).height(130));
                    }})
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

