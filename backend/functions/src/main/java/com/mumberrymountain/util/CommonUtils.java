package com.mumberrymountain.util;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import io.github.mumberrymountain.model.table.Align;
import io.github.mumberrymountain.model.table.Col;
import io.github.mumberrymountain.model.table.Table;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class CommonUtils {

    private static final String S3_BUCKET_NAME = "hwpxtemplater-sample-template";
    private static final S3Client s3Client = S3Client.builder()
            .region(Region.AP_NORTHEAST_1)
            .build();

    private CommonUtils() {}


    public static String encodeFileName(String fileName) throws IOException {
        return URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString())
                .replaceAll("\\+", "%20");
    }

    public static ResponseBytes<GetObjectResponse> getTemplateBytes(String fileName) throws NoSuchKeyException {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(S3_BUCKET_NAME)
                .key(fileName)
                .build();

        return s3Client.getObject(
                getObjectRequest,
                ResponseTransformer.toBytes()
        );
    }

    public static Path getTmpResourcePath(String fileName) throws IOException, NoSuchKeyException {
        Path base = Paths.get("/tmp");
        Path target = base.resolve(fileName).normalize();

        if (!target.startsWith(base)) throw new IllegalArgumentException("Invalid fileName");
        if (target.getParent() != null) Files.createDirectories(target.getParent());


        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(S3_BUCKET_NAME)
                .key(fileName)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObject(
                getObjectRequest,
                ResponseTransformer.toBytes()
        );

        Files.write(target, objectBytes.asByteArray(),
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

        return target;
    }

    public static Table createTableFromParam(Map<String, Object> tableData) {
        // columns와 rows 추출
        Map<String, String> columns = (Map<String, String>) tableData.get("columns");
        List<Map<String, Object>> rows = (List<Map<String, Object>>) tableData.get("rows");

        // 컬럼 키 순서 (순서 유지를 위해)
        List<String> columnKeys = new ArrayList<>(columns.keySet());

        // Table Builder 시작
        Table.builder builder = Table.builder();

        // 컬럼 정의
        List<Col> cols = columnKeys.stream()
                .map(key -> new Col(key).width(140).align(Align.Center))
                .collect(Collectors.toList());
        builder.cols(cols);

        // 헤더 행 추가
        HashMap<String, Object> headerRow = new HashMap<>();
        columnKeys.forEach(key -> headerRow.put(key, columns.get(key)));
        builder.rowWithStyle(headerRow)
                .height(40)
                .backgroundColor("#f5f5f5")
                .apply();

        // 데이터 행 추가
        for (Map<String, Object> row : rows) {
            HashMap<String, Object> rowData = new HashMap<>();
            columnKeys.forEach(key -> rowData.put(key, row.get(key)));
            builder.rowWithStyle(rowData)
                    .height(55)
                    .apply();
        }

        return builder.create();
    }
}
