package com.darmisolutions.darmihire.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError handleNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        return error(
                404,
                "RESOURCE_NOT_FOUND",
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError handleConflict(
            ConflictException exception,
            HttpServletRequest request
    ) {
        return error(
                409,
                "CONFLICT",
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiError handleForbidden(
            ForbiddenException exception,
            HttpServletRequest request
    ) {
        return error(
                403,
                "FORBIDDEN",
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiError handleUnauthorized(
            UnauthorizedException exception,
            HttpServletRequest request
    ) {
        return error(
                401,
                "UNAUTHORIZED",
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleIllegalState(
            IllegalStateException exception,
            HttpServletRequest request
    ) {
        return error(
                400,
                "INVALID_STATE",
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, String> errors =
                new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(fieldError ->
                        errors.put(
                                fieldError.getField(),
                                fieldError.getDefaultMessage()
                        )
                );

        return error(
                400,
                "VALIDATION_ERROR",
                "Request validation failed",
                request.getRequestURI(),
                errors
        );
    }

    private ApiError error(
            int status,
            String code,
            String message,
            String path,
            Map<String, String> errors
    ) {
        return new ApiError(
                status,
                code,
                message,
                path,
                Instant.now(),
                errors
        );
    }
}