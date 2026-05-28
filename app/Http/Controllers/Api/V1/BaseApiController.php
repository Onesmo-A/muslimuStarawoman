<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;

abstract class BaseApiController extends Controller
{
    use ApiResponse;
}
