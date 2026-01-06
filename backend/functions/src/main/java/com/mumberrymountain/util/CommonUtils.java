package com.mumberrymountain.util;

import io.github.mumberrymountain.model.table.Align;
import io.github.mumberrymountain.model.table.Col;
import io.github.mumberrymountain.model.table.Table;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class CommonUtils {

    private CommonUtils() {}


    public static String encodeFileName(String fileName) throws IOException {
        return URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString())
                .replaceAll("\\+", "%20");
    }

    public static Path getTmpResourcePath(String classpathLocation) throws IOException {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(classpathLocation);

        if (inputStream == null) {
            throw new FileNotFoundException(classpathLocation + " not found in resources");
        }

        String fileName = Paths.get(classpathLocation).getFileName().toString();
        Path target = Paths.get("/tmp", fileName);

        try (inputStream) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        }

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
