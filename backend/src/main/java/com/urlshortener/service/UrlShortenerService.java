package com.urlshortener.service;

import com.urlshortener.dto.ShortenRequest;
import com.urlshortener.dto.ShortenResponse;
import com.urlshortener.exception.SlugAlreadyExistsException;
import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.model.UrlMapping;
import com.urlshortener.repository.UrlMappingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UrlShortenerService {

    private final UrlMappingRepository urlMappingRepository;
    private final QrCodeService qrCodeService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Create a shortened URL with safety checks.
     */
    @Transactional
    public ShortenResponse shortenUrl(ShortenRequest request) {
        String slug = request.getCustomSlug().toLowerCase().trim();

        // Check if slug already exists
        if (urlMappingRepository.existsByCustomSlug(slug)) {
            throw new SlugAlreadyExistsException(
                    "The slug '" + slug + "' is already taken. Please choose another one.");
        }

        // Create the URL mapping
        UrlMapping urlMapping = UrlMapping.builder()
                .originalUrl(request.getOriginalUrl())
                .customSlug(slug)
                .password(request.getPassword())
                .riskScore(0)
                .isSafe(true)
                .build();

        urlMapping = urlMappingRepository.save(urlMapping);

        // Generate QR code
        String shortUrl = baseUrl + "/" + slug;
        String qrCodeBase64 = qrCodeService.generateQrCode(shortUrl);

        return buildResponse(urlMapping, shortUrl, "SAFE", qrCodeBase64);
    }

    /**
     * Get the original URL by slug (cached for redirect performance).
     */
    @Cacheable(value = "urls", key = "#slug")
    @Transactional(readOnly = true)
    public String getOriginalUrl(String slug) {
        return getUrlMappingBySlug(slug).getOriginalUrl();
    }

    @Transactional(readOnly = true)
    public UrlMapping getUrlMappingBySlug(String slug) {
        return urlMappingRepository.findByCustomSlug(slug)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found: " + slug));
    }

    /**
     * Increment click count for a slug.
     */
    @Transactional
    public void incrementClickCount(String slug) {
        urlMappingRepository.incrementClickCount(slug);
    }

    /**
     * Get all URL mappings for the dashboard.
     */
    @Transactional(readOnly = true)
    public List<ShortenResponse> getAllUrls() {
        return urlMappingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(mapping -> {
                    String shortUrl = baseUrl + "/" + mapping.getCustomSlug();
                    return buildResponse(mapping, shortUrl, "SAFE", null);
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete expired URLs and evict cache.
     */
    @CacheEvict(value = "urls", allEntries = true)
    @Transactional
    public int deleteExpiredUrls() {
        int deleted = urlMappingRepository.deleteExpiredUrls(java.time.LocalDateTime.now());
        log.info("Deleted {} expired URLs", deleted);
        return deleted;
    }

    /**
     * Delete a URL mapping by its ID.
     */
    @CacheEvict(value = "urls", allEntries = true)
    @Transactional
    public void deleteUrl(Long id) {
        urlMappingRepository.deleteById(id);
        log.info("Deleted URL mapping with ID {}", id);
    }

    private ShortenResponse buildResponse(UrlMapping mapping, String shortUrl, String safetyStatus,
            String qrCodeBase64) {
        return ShortenResponse.builder()
                .id(mapping.getId())
                .originalUrl(mapping.getOriginalUrl())
                .shortUrl(shortUrl)
                .customSlug(mapping.getCustomSlug())
                .riskScore(mapping.getRiskScore())
                .safe(mapping.isSafe())
                .safetyStatus(safetyStatus)
                .qrCodeBase64(qrCodeBase64)
                .clickCount(mapping.getClickCount())
                .createdAt(mapping.getCreatedAt())
                .expiryDate(mapping.getExpiryDate())
                .hasPassword(mapping.getPassword() != null && !mapping.getPassword().trim().isEmpty())
                .build();
    }
}
