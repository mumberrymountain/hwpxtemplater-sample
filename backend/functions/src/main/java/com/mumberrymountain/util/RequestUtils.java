package com.mumberrymountain.util;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.Map;
import java.util.WeakHashMap;

public class RequestUtils {

    private static final Map<APIGatewayProxyRequestEvent, Map<String, Object>> cache = new WeakHashMap<>();

    /**
     * API Gateway 요청에서 특정 파라미터 추출 (자동 캐싱)
     */
    @SuppressWarnings("unchecked")
    public static <T> T getParameter(APIGatewayProxyRequestEvent input, String key) {
        Map<String, Object> requestBody = getOrParseRequestBody(input);
        return (T) requestBody.get(key);
    }

    /**
     * 캐시 확인 후 파싱 (내부용)
     */
    private static Map<String, Object> getOrParseRequestBody(APIGatewayProxyRequestEvent input) {
        return cache.computeIfAbsent(input, k -> {
            String jsonBody = input.getIsBase64Encoded() != null && input.getIsBase64Encoded()
                    ? Base64Utils.decodeBase64ToJson(input.getBody())
                    : input.getBody();

            return JacksonUtils.toComplexObject(
                    jsonBody,
                    new TypeReference<Map<String, Object>>() {}
            );
        });
    }
}
