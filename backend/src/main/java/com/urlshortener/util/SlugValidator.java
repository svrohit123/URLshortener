package com.urlshortener.util;

import java.util.regex.Pattern;

public final class SlugValidator {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-zA-Z0-9-]+$");
    private static final int MIN_LENGTH = 3;
    private static final int MAX_LENGTH = 30;

    private SlugValidator() {
        // Utility class — no instantiation
    }

    public static boolean isValid(String slug) {
        if (slug == null || slug.isBlank())
            return false;
        if (slug.length() < MIN_LENGTH || slug.length() > MAX_LENGTH)
            return false;
        return SLUG_PATTERN.matcher(slug).matches();
    }

    /**
     * Reserved slugs that conflict with API routes.
     */
    private static final String[] RESERVED = { "api", "admin", "dashboard", "health", "actuator" };

    public static boolean isReserved(String slug) {
        for (String reserved : RESERVED) {
            if (reserved.equalsIgnoreCase(slug))
                return true;
        }
        return false;
    }
}
