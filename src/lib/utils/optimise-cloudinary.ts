type ImageType = 'card' | 'spotlight' | 'hero';  // Added hero type

interface TransformOptions {
    width?: number;
    height?: number;
    type?: ImageType;
    dpr?: number;    // Added DPR support
}

const TRANSFORM_PRESETS: Record<ImageType, string> = {
    card: 'w_464,h_464,c_fill,ar_1:1,g_center,q_auto,f_auto',
    spotlight: 'w_640,h_475,c_fill,f_auto,q_auto',
    // New hero preset with enhanced quality and progressive loading
    hero: 'c_limit,fl_progressive,q_90,f_auto'
};

export function optimizeCloudinaryUrl(url: string, options: TransformOptions = {}): string {
    if (!url || !url.includes('cloudinary.com')) return url;

    let baseUrl: string;
    let path: string;

    const uploadIndex = url.lastIndexOf('/upload/');
    const coverImageIndex = url.lastIndexOf('/coverImage/');

    if (uploadIndex !== -1) {
        baseUrl = url.substring(0, uploadIndex + '/upload'.length);
        path = url.substring(uploadIndex + '/upload/'.length);
    } else if (coverImageIndex !== -1) {
        baseUrl = url.substring(0, coverImageIndex);
        path = url.substring(coverImageIndex + '/coverImage/'.length);
    } else {
        return url;
    }

    if (!path) return url;

    let transformParams: string[] = [];

    if (options.type && options.type in TRANSFORM_PRESETS) {
        transformParams.push(TRANSFORM_PRESETS[options.type]);
    } else if (options.width && options.height) {
        transformParams.push(`w_${options.width},h_${options.height},c_fill,g_center`);
    } else {
        transformParams.push(TRANSFORM_PRESETS.card);
    }

    // Add DPR handling if specified
    if (options.dpr) {
        transformParams.push(`dpr_${options.dpr}.0`);
    }

    const pathPrefix = url.includes('/upload/') ? '' : 'coverImage/';
    return `${baseUrl}/${transformParams.join(',')}/${pathPrefix}${path}`;
}

export const optimizeSpotlightImage = (url: string) =>
    optimizeCloudinaryUrl(url, { type: 'spotlight' });

export const optimizeHeroImage = (url: string, dpr = 1) =>
    optimizeCloudinaryUrl(url, {
        type: 'hero',
        width: 720,
        height: 542,
        dpr
    });