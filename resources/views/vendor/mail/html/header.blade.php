@props(['url'])
<tr>
<td class="header" style="padding: 0; background-color: #f8fafc; text-align: center; border-radius: 12px 12px 0 0; overflow: hidden;">
<a href="{{ $url }}" style="display: block; text-decoration: none;">
@php
    $coverSrc = url('images/email-cover.png');
    if (isset($message) && method_exists($message, 'embed') && file_exists(public_path('images/email-cover.png'))) {
        $coverSrc = $message->embed(public_path('images/email-cover.png'));
    }
@endphp
<img src="{{ $coverSrc }}" class="logo" alt="{{ config('app.name') }}" style="display: block; width: 100%; max-width: 570px; height: auto; border: 0; margin: 0 auto;">
</a>
</td>
</tr>
