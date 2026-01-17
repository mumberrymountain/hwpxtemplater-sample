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
import io.github.mumberrymountain.model.table.Table;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class UnifiedHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) {
            return ResponseUtils.preflight();
        }

        String path = input.getPath();
        
        try {
            return switch (path) {
                case "/basic" -> handleBasic(input);
                case "/condition" -> handleCondition(input);
                case "/loop" -> handleLoop(input);
                case "/image" -> handleImage(input);
                case "/table" -> handleTable(input);
                case "/template" -> handleTemplate(input);
                default -> ResponseUtils.notFound();
            };
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseUtils.error();
        }
    }

    private APIGatewayProxyResponseEvent handleBasic(APIGatewayProxyRequestEvent input) throws Exception {
        String fileName = RequestUtils.getParameter(input, "fileName");
        Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");
        Path templatePath = CommonUtils.getTmpResourcePath("hwpx/basic.hwpx");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        HWPXTemplater.builder()
                .parse(templatePath.toString())
                .render(templateParam)
                .write(baos);

        return ResponseUtils.success(fileName, baos.toByteArray());
    }

    private APIGatewayProxyResponseEvent handleCondition(APIGatewayProxyRequestEvent input) throws Exception {
        String fileName = RequestUtils.getParameter(input, "fileName");
        Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");
        Path templatePath = CommonUtils.getTmpResourcePath("hwpx/condition.hwpx");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        HWPXTemplater.builder()
                .parse(templatePath.toString())
                .render(templateParam)
                .write(baos);

        return ResponseUtils.success(fileName, baos.toByteArray());
    }

    private APIGatewayProxyResponseEvent handleLoop(APIGatewayProxyRequestEvent input) throws Exception {
        String fileName = RequestUtils.getParameter(input, "fileName");
        Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");
        Path templatePath = CommonUtils.getTmpResourcePath("hwpx/loop.hwpx");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        HWPXTemplater.builder()
                .parse(templatePath.toString())
                .render(templateParam)
                .write(baos);

        return ResponseUtils.success(fileName, baos.toByteArray());
    }

    private APIGatewayProxyResponseEvent handleImage(APIGatewayProxyRequestEvent input) throws Exception {
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
    }

    @SuppressWarnings("unchecked")
    private APIGatewayProxyResponseEvent handleTable(APIGatewayProxyRequestEvent input) throws Exception {
        String fileName = RequestUtils.getParameter(input, "fileName");
        Map<String, Object> templateParam = RequestUtils.getParameter(input, "templateParam");
        Path templatePath = CommonUtils.getTmpResourcePath("hwpx/table.hwpx");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Table workshopGrantBudget = CommonUtils.createTableFromParam(
                (Map<String, Object>) templateParam.get("workshopGrantBudget")
        );

        Table selfFundedBudget = CommonUtils.createTableFromParam(
                (Map<String, Object>) templateParam.get("selfFundedBudget")
        );

        HWPXTemplater.builder()
                .parse(templatePath.toString())
                .render(new HashMap<String, Object>() {{
                    put("workshopGrantBudget", workshopGrantBudget);
                    put("selfFundedBudget", selfFundedBudget);
                }})
                .write(baos);

        return ResponseUtils.success(fileName, baos.toByteArray());
    }

    private APIGatewayProxyResponseEvent handleTemplate(APIGatewayProxyRequestEvent input) throws Exception {
        String fileName = RequestUtils.getParameter(input, "fileName");
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("hwpx/" + fileName);
        if (inputStream == null) {
            throw new Exception("File not found");
        }

        return ResponseUtils.success("output.hwpx", inputStream.readAllBytes());
    }
}

