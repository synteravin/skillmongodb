<?php

namespace App\Enums;

enum CourseStatus: string
{
    case LOCKED = 'locked';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
}