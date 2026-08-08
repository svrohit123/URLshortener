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

@Configuration
@Profile("prod")
public class ProdDataSourceConfig {

    private static final Logger log =
            LoggerFactory.getLogger(ProdDataSourceConfig.class);

    @Bean
    public DataSource dataSource(
            @Value("${DATABASE_URL}") String databaseUrl,
            @Value("${DATABASE_USERNAME}") String username,
            @Value("${DATABASE_PASSWORD}") String password,
            @Value("${spring.datasource.hikari.maximum-pool-size:5}") int maxPoolSize,
            @Value("${spring.datasource.hikari.connection-timeout:30000}") long connectionTimeout) {

        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException(
                    "DATABASE_URL is not configured");
        }

        if (username == null || username.isBlank()) {
            throw new IllegalStateException(
                    "DATABASE_USERNAME is not configured");
        }

        if (password == null || password.isBlank()) {
            throw new IllegalStateException(
                    "DATABASE_PASSWORD is not configured");
        }

        String jdbcUrl = toJdbcUrl(databaseUrl);

        HikariConfig config = new HikariConfig();

        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");

        config.setMaximumPoolSize(maxPoolSize);
        config.setConnectionTimeout(connectionTimeout);

        log.info(
                "Production database target: {} (user={})",
                maskHost(jdbcUrl),
                username
        );

        return new HikariDataSource(config);
    }

    private static String toJdbcUrl(String url) {

        String jdbcUrl = url.trim();

        if (jdbcUrl.startsWith("postgres://")) {
            jdbcUrl = "jdbc:" + jdbcUrl.substring("postgres://".length());
        }

        if (jdbcUrl.startsWith("postgresql://")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
        }

        if (!jdbcUrl.startsWith("jdbc:postgresql://")) {
            throw new IllegalArgumentException(
                    "DATABASE_URL must be a PostgreSQL JDBC URL"
            );
        }

        if (!jdbcUrl.contains("sslmode=")) {
            jdbcUrl += jdbcUrl.contains("?")
                    ? "&sslmode=require"
                    : "?sslmode=require";
        }

        return jdbcUrl;
    }

    private static String maskHost(String jdbcUrl) {

        try {
            String withoutPrefix =
                    jdbcUrl.substring("jdbc:".length());

            URI uri = URI.create(withoutPrefix);

            return "jdbc:postgresql://"
                    + uri.getHost()
                    + (uri.getPort() > 0
                    ? ":" + uri.getPort()
                    : "")
                    + (uri.getPath() != null
                    ? uri.getPath()
                    : "");

        } catch (Exception ex) {

            return "jdbc:postgresql://***";
        }
    }
}