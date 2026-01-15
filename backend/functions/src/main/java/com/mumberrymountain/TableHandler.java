package com.mumberrymountain;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.mumberrymountain.util.CommonUtils;
import com.mumberrymountain.util.RequestUtils;
import com.mumberrymountain.util.ResponseUtils;
import io.github.mumberrymountain.HWPXTemplater;
import io.github.mumberrymountain.model.table.Table;

import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class TableHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) return ResponseUtils.preflight();

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

            return ResponseUtils.success(fileName, baos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.error();
        }
    }
}
