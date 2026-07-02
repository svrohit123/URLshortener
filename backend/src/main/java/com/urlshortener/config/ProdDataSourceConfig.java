package com.urlshortener.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@Profile("prod")
public class ProdDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(ProdDataSourceConfig.class);

    @Bean
    public DataSource dataSource(
            @Value("${DATABASE_URL:}") String databaseUrl,
            @Value("${spring.datasource.url:}") String configuredUrl,
            @Value("${spring.datasource.username:}") String username,
            @Value("${spring.datasource.password:}") String password,
            @Value("${spring.datasource.hikari.maximum-pool-size:5}") int maxPoolSize,
            @Value("${spring.datasource.hikari.connection-timeout:30000}") long connectionTimeout) {

        String rawUrl = resolveRawUrl(configuredUrl, databaseUrl);
        if (rawUrl.isBlank()) {
            throw new IllegalStateException(
                    "DATABASE_URL is not set. Add your Supabase JDBC or postgres:// connection string in Render.");
        }

        String jdbcUrl = toJdbcUrl(rawUrl);
        Map<String, String> queryParams = parseQueryParams(jdbcUrl);
        String cleanJdbcUrl = stripCredentialsFromUrl(jdbcUrl);

        String resolvedUsername = firstNonBlank(username, queryParams.get("user"));
        String resolvedPassword = firstNonBlank(password, queryParams.get("password"));

        if (resolvedUsername.isBlank()) {
            throw new IllegalStateException(
                    "Database username is missing. Set DATABASE_USERNAME to your Supabase pooler user "
                            + "(e.g. postgres.xxxxx), not plain 'postgres'.");
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(cleanJdbcUrl);
        config.setUsername(resolvedUsername);
        config.setPassword(resolvedPassword);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(maxPoolSize);
        config.setConnectionTimeout(connectionTimeout);

        log.info("Production database target: {} (user={})", maskHost(cleanJdbcUrl), resolvedUsername);

        if (cleanJdbcUrl.contains("pooler.supabase.com") && "postgres".equals(resolvedUsername)) {
            log.warn("Supabase pooler requires username like postgres.xxxxx — plain 'postgres' will fail auth.");
        }

        return new HikariDataSource(config);
    }

    private static String resolveRawUrl(String configuredUrl, String databaseUrl) {
        if (configuredUrl != null && !configuredUrl.isBlank() && !configuredUrl.contains("${")) {
            return configuredUrl.trim();
        }
        return databaseUrl == null ? "" : databaseUrl.trim();
    }

    static String toJdbcUrl(String url) {
        String jdbcUrl = url.trim();
        if (jdbcUrl.startsWith("postgres://") || jdbcUrl.startsWith("postgresql://")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
        }
        return ensureSslMode(jdbcUrl);
    }

    private static String ensureSslMode(String jdbcUrl) {
        if (!jdbcUrl.contains("sslmode=")) {
            jdbcUrl += jdbcUrl.contains("?") ? "&sslmode=require" : "?sslmode=require";
        }
        return jdbcUrl;
    }

    private static String stripCredentialsFromUrl(String jdbcUrl) {
        int queryStart = jdbcUrl.indexOf('?');
        if (queryStart < 0) {
            return jdbcUrl;
        }

        String base = jdbcUrl.substring(0, queryStart);
        Map<String, String> params = parseQueryParams(jdbcUrl);
        params.remove("user");
        params.remove("password");

        if (params.isEmpty()) {
            return base;
        }

        String query = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
        return base + "?" + query;
    }

    private static Map<String, String> parseQueryParams(String jdbcUrl) {
        Map<String, String> params = new LinkedHashMap<>();
        int queryStart = jdbcUrl.indexOf('?');
        if (queryStart < 0 || queryStart == jdbcUrl.length() - 1) {
            return params;
        }

        for (String part : jdbcUrl.substring(queryStart + 1).split("&")) {
            int eq = part.indexOf('=');
            if (eq <= 0) {
                continue;
            }
            String key = URLDecoder.decode(part.substring(0, eq), StandardCharsets.UTF_8);
            String value = URLDecoder.decode(part.substring(eq + 1), StandardCharsets.UTF_8);
            params.put(key, value);
        }
        return params;
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return "";
    }

    private static String maskHost(String jdbcUrl) {
        try {
            String withoutPrefix = jdbcUrl.substring("jdbc:".length());
            URI uri = URI.create(withoutPrefix);
            return "jdbc:postgresql://" + uri.getHost()
                    + (uri.getPort() > 0 ? ":" + uri.getPort() : "")
                    + (uri.getPath() != null ? uri.getPath() : "");
        } catch (Exception ex) {
            return "jdbc:postgresql://***";
        }
    }
}
