package com.urlshortener.exception;

import com.urlshortener.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

        @ExceptionHandler(SlugAlreadyExistsException.class)
        public ResponseEntity<ErrorResponse> handleSlugExists(SlugAlreadyExistsException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                ErrorResponse.builder()
                                                .status(409)
                                                .error("Slug Already Exists")
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(UrlNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleUrlNotFound(UrlNotFoundException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                ErrorResponse.builder()
                                                .status(404)
                                                .error("Not Found")
                                                .message(ex.getMessage())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ErrorResponse> handleBadPathVariable(MethodArgumentTypeMismatchException ex) {
                log.warn("Invalid path variable: {}", ex.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                ErrorResponse.builder()
                                                .status(400)
                                                .error("Bad Request")
                                                .message("Invalid id in URL path.")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(EmptyResultDataAccessException.class)
        public ResponseEntity<ErrorResponse> handleEmptyResult(EmptyResultDataAccessException ex) {
                log.warn("Empty result: {}", ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                ErrorResponse.builder()
                                                .status(404)
                                                .error("Not Found")
                                                .message("No record found to delete.")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
                String errors = ex.getBindingResult().getFieldErrors().stream()
                                .map(FieldError::getDefaultMessage)
                                .collect(Collectors.joining(", "));

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                ErrorResponse.builder()
                                                .status(400)
                                                .error("Validation Error")
                                                .message(errors)
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
                log.error("Unhandled exception", ex);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                                ErrorResponse.builder()
                                                .status(500)
                                                .error("Internal Server Error")
                                                .message("An unexpected error occurred. Please try again later.")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }
}
