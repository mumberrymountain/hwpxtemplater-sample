package com.mumberrymountain.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Jackson JSON Processing Utility Class
 * Provides object-JSON conversion, date formatting, field filtering, etc.
 */
public class JacksonUtils {
    private static final ObjectMapper mapper;
    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    static {
        // Initialize ObjectMapper
        mapper = new ObjectMapper();

        // Configure serialization options
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // Ignore null fields
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); // Ignore unknown fields

        // Configure Java 8 Date/Time module
        JavaTimeModule timeModule = new JavaTimeModule();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT);

        timeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));
        timeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(formatter));

        mapper.registerModule(timeModule);
    }

    /**
     * Object to JSON string
     */
    public static String toJson(Object obj) {
        try {
            return mapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON serialization failed", e);
        }
    }

    /**
     * JSON string to object
     */
    public static <T> T toObject(String json, Class<T> clazz) {
        try {
            return mapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON deserialization failed", e);
        }
    }

    /**
     * JSON string to List
     */
    public static <T> List<T> toList(String json, Class<T> elementClass) {
        try {
            return mapper.readValue(json,
                    mapper.getTypeFactory().constructCollectionType(List.class, elementClass));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to List", e);
        }
    }

    /**
     * JSON string to complex object (e.g., nested Map)
     */
    public static <T> T toComplexObject(String json, TypeReference<T> typeReference) {
        try {
            return mapper.readValue(json, typeReference);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to complex object", e);
        }
    }

    /**
     * Filter specified fields
     */
    public static String toJsonWithFilter(Object obj, String filterName, String... fieldsToExclude) {
        try {
            FilterProvider filters = new SimpleFilterProvider()
                    .addFilter(filterName, SimpleBeanPropertyFilter.serializeAllExcept(fieldsToExclude));

            return mapper.writer(filters).writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON serialization with filter failed", e);
        }
    }

    /**
     * Parse JSON string to JsonNode
     */
    public static JsonNode toJsonNode(String json) {
        try {
            return mapper.readTree(json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse JSON to JsonNode", e);
        }
    }

    /**
     * Extract a specific field from a JsonNode
     */
    public static String getNodeValue(JsonNode node, String fieldName) {
        JsonNode valueNode = node.get(fieldName);
        return valueNode != null ? valueNode.asText() : null;
    }

    /**
     * Modify a JsonNode and convert it to a JSON string
     */
    public static String modifyNode(String json, String fieldName, Object newValue) {
        try {
            ObjectNode node = (ObjectNode) mapper.readTree(json);

            if (newValue instanceof String) {
                node.put(fieldName, (String) newValue);
            } else if (newValue instanceof Integer) {
                node.put(fieldName, (Integer) newValue);
            } else if (newValue instanceof Boolean) {
                node.put(fieldName, (Boolean) newValue);
            } else if (newValue instanceof Double) {
                node.put(fieldName, (Double) newValue);
            } else {
                node.putPOJO(fieldName, newValue);
            }

            return node.toString();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to modify JSON node", e);
        }
    }
}
