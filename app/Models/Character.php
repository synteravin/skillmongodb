<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Character extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'characters';

    protected $fillable = [
        'name',
        'avatar',
        'backstory',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'character_id', '_id');
    }

    public function isUsed(): bool
    {
        return User::where('character_id', $this->_id)->exists();
    }
}
