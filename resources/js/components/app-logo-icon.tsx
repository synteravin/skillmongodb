import { cn } from '@/lib/utils';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo-fast.png"
            alt="Logo"
            className={cn('h-10 w-20', className)}
            {...props}
        />
    );
}
