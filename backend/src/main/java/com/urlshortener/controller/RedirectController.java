package com.urlshortener.controller;

import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.model.UrlMapping;
import com.urlshortener.service.UrlShortenerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequiredArgsConstructor
public class RedirectController {

    private final UrlShortenerService urlShortenerService;

    /**
     * GET /{slug} — Redirect to the original URL or show password page if protected.
     * This handles direct access to shortened URLs.
     */
    @GetMapping("/{slug}")
    public RedirectView redirect(@PathVariable String slug) {
        try {
            UrlMapping mapping = urlShortenerService.getUrlMappingBySlug(slug);
            
            // If the URL has a password, redirect to the React app's redirect handler
            // which will show the password prompt
            if (mapping.getPassword() != null && !mapping.getPassword().trim().isEmpty()) {
                RedirectView redirectView = new RedirectView();
                redirectView.setUrl("/" + slug);
                return redirectView;
            }
            
            // If no password, increment click count and redirect directly
            urlShortenerService.incrementClickCount(slug);
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl(mapping.getOriginalUrl());
            redirectView.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
            return redirectView;
        } catch (UrlNotFoundException e) {
            // Redirect back to React app's redirect handler, which will show the error
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl("/" + slug);
            redirectView.setStatusCode(HttpStatus.TEMPORARY_REDIRECT);
            return redirectView;
        }
    }
}
