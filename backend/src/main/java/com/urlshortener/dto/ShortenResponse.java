package com.urlshortener.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ShortenResponse {

    private Long id;
    private String originalUrl;
    private String shortUrl;
    private String customSlug;
    private int riskScore;
    private boolean safe;
    private String safetyStatus; // SAFE, WARNING, BLOCKED
    private String qrCodeBase64;
    private long clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime expiryDate;
}
