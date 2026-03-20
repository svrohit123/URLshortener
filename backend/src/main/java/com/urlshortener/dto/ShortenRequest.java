package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ShortenRequest {

    @NotBlank(message = "URL is required")
    @org.hibernate.validator.constraints.URL(message = "Invalid URL format")
    private String originalUrl;

    @NotBlank(message = "Custom slug is required")
    @Size(min = 3, max = 30, message = "Slug must be between 3 and 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9-]+$", message = "Slug can only contain letters, numbers, and hyphens")
    private String customSlug;
}
