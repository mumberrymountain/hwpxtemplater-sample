package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.CommonUtils;
import com.mumberrymountain.util.RequestUtils;
import com.mumberrymountain.util.ResponseUtils;
import io.github.mumberrymountain.HWPXTemplater;
import io.github.mumberrymountain.model.Image;

import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class ImageHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) return ResponseUtils.preflight();


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

            return ResponseUtils.success(fileName, baos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.error();
        }
    }
}

