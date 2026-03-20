package com.urlshortener.controller;

import com.urlshortener.service.UrlShortenerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final UrlShortenerService urlShortenerService;

    /**
     * GET /{slug} — Redirect to original URL and increment click count.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<Void> redirect(@PathVariable String slug) {
        String originalUrl = urlShortenerService.getOriginalUrl(slug);
        urlShortenerService.incrementClickCount(slug);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, originalUrl);

        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
