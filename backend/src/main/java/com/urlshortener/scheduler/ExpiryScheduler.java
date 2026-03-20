package com.urlshortener.scheduler;

import com.urlshortener.service.UrlShortenerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ExpiryScheduler {

    private final UrlShortenerService urlShortenerService;

    /**
     * Runs daily at midnight to remove expired URLs (older than 2 days).
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupExpiredUrls() {
        log.info("Running scheduled cleanup for expired URLs...");
        int deleted = urlShortenerService.deleteExpiredUrls();
        log.info("Scheduled cleanup complete. Removed {} expired URLs.", deleted);
    }
}
