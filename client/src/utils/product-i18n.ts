import type { Language, Product } from '@shared/api.interface';

/**
 * Get localized product title with fallback chain:
 * current language → English → Chinese
 */
export function getProductTitle(product: Product, lang: Language): string {
  switch (lang) {
    case 'zh':
      return product.titleZh || product.titleEn || '';
    case 'en':
      return product.titleEn || product.titleZh || '';
    case 'es':
      return product.titleEs || product.titleEn || product.titleZh || '';
    case 'pt':
      return product.titlePt || product.titleEn || product.titleZh || '';
    default:
      return product.titleEn || product.titleZh || '';
  }
}

/**
 * Get localized product short description with fallback chain.
 */
export function getProductDesc(product: Product, lang: Language): string {
  switch (lang) {
    case 'zh':
      return product.descZh || product.descEn || '';
    case 'en':
      return product.descEn || product.descZh || '';
    case 'es':
      return product.descEs || product.descEn || product.descZh || '';
    case 'pt':
      return product.descPt || product.descEn || product.descZh || '';
    default:
      return product.descEn || product.descZh || '';
  }
}

/**
 * Get localized product long description with fallback chain.
 */
export function getProductLongDesc(product: Product, lang: Language): string {
  switch (lang) {
    case 'zh':
      return product.longDescZh || product.longDescEn || '';
    case 'en':
      return product.longDescEn || product.longDescZh || '';
    case 'es':
      return product.longDescEs || product.longDescEn || product.longDescZh || '';
    case 'pt':
      return product.longDescPt || product.longDescEn || product.longDescZh || '';
    default:
      return product.longDescEn || product.longDescZh || '';
  }
}

/**
 * Get localized product bullet points with fallback chain.
 */
export function getProductBulletPoints(
  product: Product,
  lang: Language,
): string[] {
  switch (lang) {
    case 'zh':
      return product.bulletPointsZh?.length
        ? product.bulletPointsZh
        : product.bulletPointsEn ?? [];
    case 'en':
      return product.bulletPointsEn?.length
        ? product.bulletPointsEn
        : product.bulletPointsZh ?? [];
    case 'es':
      return product.bulletPointsEs?.length
        ? product.bulletPointsEs
        : product.bulletPointsEn?.length
          ? product.bulletPointsEn
          : product.bulletPointsZh ?? [];
    case 'pt':
      return product.bulletPointsPt?.length
        ? product.bulletPointsPt
        : product.bulletPointsEn?.length
          ? product.bulletPointsEn
          : product.bulletPointsZh ?? [];
    default:
      return product.bulletPointsEn ?? [];
  }
}
