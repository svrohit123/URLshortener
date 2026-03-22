package com.urlshortener.controller;

import com.urlshortener.dto.QrRequest;
import com.urlshortener.dto.ShortenRequest;
import com.urlshortener.dto.ShortenResponse;
import com.urlshortener.service.QrCodeService;
import com.urlshortener.service.UrlShortenerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlShortenerService urlShortenerService;
    private final QrCodeService qrCodeService;

    /**
     * POST /api/shorten — Create a shortened URL with safety checks.
     */
    @PostMapping("/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(@Valid @RequestBody ShortenRequest request) {
        ShortenResponse response = urlShortenerService.shortenUrl(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/qr — Generate a QR code for a given URL.
     */
    @PostMapping("/qr")
    public ResponseEntity<Map<String, String>> generateQrCode(@Valid @RequestBody QrRequest request) {
        String qrBase64 = qrCodeService.generateQrCode(request.getUrl());
        return ResponseEntity.ok(Map.of("qrCode", qrBase64));
    }

    /**
     * GET /api/urls — Get all shortened URLs for dashboard.
     */
    @GetMapping("/urls")
    public ResponseEntity<List<ShortenResponse>> getAllUrls() {
        return ResponseEntity.ok(urlShortenerService.getAllUrls());
    }

    /**
     * DELETE /api/urls/{id} — Delete a specific URL.
     */
    @DeleteMapping("/urls/{id}")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
        urlShortenerService.deleteUrl(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/urls/{slug}/status — Check if a URL has a password, or just grab the
     * link directly.
     */
    @GetMapping("/urls/{slug}/status")
    public ResponseEntity<Map<String, Object>> getUrlStatus(@PathVariable String slug) {
        com.urlshortener.model.UrlMapping mapping = urlShortenerService.getUrlMappingBySlug(slug);
        boolean hasPassword = mapping.getPassword() != null && !mapping.getPassword().trim().isEmpty();

        if (hasPassword) {
            return ResponseEntity.ok(Map.of("hasPassword", true));
        } else {
            urlShortenerService.incrementClickCount(slug);
            return ResponseEntity.ok(Map.of("hasPassword", false, "originalUrl", mapping.getOriginalUrl()));
        }
    }

    /**
     * POST /api/urls/{slug}/unlock — Unlock a password protected URL.
     */
    @PostMapping("/urls/{slug}/unlock")
    public ResponseEntity<Map<String, String>> unlockUrl(@PathVariable String slug,
            @RequestBody Map<String, String> body) {
        com.urlshortener.model.UrlMapping mapping = urlShortenerService.getUrlMappingBySlug(slug);
        String providedPassword = body.get("password");

        if (mapping.getPassword() != null && mapping.getPassword().equals(providedPassword)) {
            urlShortenerService.incrementClickCount(slug);
            return ResponseEntity.ok(Map.of("originalUrl", mapping.getOriginalUrl()));
        } else {
            return ResponseEntity.status(403).body(Map.of("error", "Incorrect password"));
        }
    }
}
