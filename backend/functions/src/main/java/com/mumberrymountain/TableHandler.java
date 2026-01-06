package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.CommonUtils;
import com.mumberrymountain.util.RequestUtils;
import io.github.mumberrymountain.HWPXTemplater;
import io.github.mumberrymountain.model.table.Align;
import io.github.mumberrymountain.model.table.Col;
import io.github.mumberrymountain.model.table.Table;

import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class TableHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        // OPTIONS 요청 처리 (CORS Preflight)
        if ("OPTIONS".equals(input.getHttpMethod())) {
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(Map.of(
                            "Access-Control-Allow-Origin", "*",
                            "Access-Control-Allow-Methods", "GET,POST,OPTIONS",
                            "Access-Control-Allow-Headers", "Content-Type,Authorization"
                    ));
        }

        try {
            String fileName = RequestUtils.getParameter(input, "fileName");
            Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");

            Path templatePath = CommonUtils.getTmpResourcePath("hwpx/table.hwpx");
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            // workshopGrantBudget 테이블 생성
            Table workshopGrantBudget = CommonUtils.createTableFromParam(
                    (Map<String, Object>) templateParam.get("workshopGrantBudget")
            );

            // selfFundedBudget 테이블 생성
            Table selfFundedBudget = CommonUtils.createTableFromParam(
                    (Map<String, Object>) templateParam.get("selfFundedBudget")
            );

            HWPXTemplater hwpxTemplater = HWPXTemplater.builder()
                    .parse(templatePath.toString())
                    .render(new HashMap < String, Object > () {
                        {
                            put("workshopGrantBudget", workshopGrantBudget);
                            put("selfFundedBudget", selfFundedBudget);
                        }
                    })
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
