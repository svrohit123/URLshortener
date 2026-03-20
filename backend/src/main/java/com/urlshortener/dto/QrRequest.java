package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QrRequest {

    @NotBlank(message = "URL is required for QR code generation")
    private String url;
}
