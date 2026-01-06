package com.mumberrymountain.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Base64Utils {

    /**
     * Base64로 인코딩된 문자열을 디코딩하여 JSON 문자열로 반환
     *
     * @param encodedString Base64로 인코딩된 문자열
     * @return 디코딩된 JSON 문자열
     * @throws IllegalArgumentException 잘못된 Base64 문자열인 경우
     */
    public static String decodeBase64ToJson(String encodedString) {
        if (encodedString == null || encodedString.isEmpty()) {
            throw new IllegalArgumentException("Encoded string cannot be null or empty");
        }

        try {
            byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Base64 encoded string: " + encodedString, e);
        }
    }

    /**
     * 문자열을 Base64로 인코딩 (역방향 유틸)
     *
     * @param plainString 인코딩할 문자열
     * @return Base64로 인코딩된 문자열
     */
    public static String encodeToBase64(String plainString) {
        if (plainString == null || plainString.isEmpty()) {
            throw new IllegalArgumentException("Plain string cannot be null or empty");
        }

        byte[] encodedBytes = Base64.getEncoder().encode(plainString.getBytes(StandardCharsets.UTF_8));
        return new String(encodedBytes, StandardCharsets.UTF_8);
    }
}
