<?php

namespace App\Constants;

class HttpStatus
{
    // Validation Status
    public const OK = 200;

    public const CREATED = 201;

    public const NO_CONTENT = 204;

    public const BAD_REQUEST = 400;

    public const UNAUTHORIZED = 401;

    public const FORBIDDEN = 403;

    public const NOT_FOUND = 404;

    public const VALIDATION_ERROR = 422;

    public const SERVER_ERROR = 500;
}