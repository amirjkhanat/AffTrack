import { Prisma } from '@prisma/client';

export function buildRevenueAggregation(groupBy: string[]) {
  return Prisma.sql`
    SELECT 
      ${Prisma.join(groupBy.map(field => Prisma.raw(`"${field}"`)))},
      SUM("value") as revenue,
      COUNT(*) as conversions,
      COUNT(DISTINCT "leadId") as unique_leads,
      COUNT(DISTINCT "visitId") as unique_visitors
    FROM "Conversion"
    WHERE "status" = 'COMPLETED'
    GROUP BY ${Prisma.join(groupBy.map(field => Prisma.raw(`"${field}"`)))}
  `;
}

export function buildConversionPathAggregation() {
  return Prisma.sql`
    WITH ConversionPath AS (
      SELECT 
        "visitId",
        array_agg(DISTINCT "currentPage" ORDER BY "timestamp") as pages,
        COUNT(*) as page_views,
        MAX("timeOnSite") as time_on_site,
        CASE WHEN "Conversion"."id" IS NOT NULL THEN 1 ELSE 0 END as converted
      FROM "PageView"
      LEFT JOIN "Conversion" ON "PageView"."visitId" = "Conversion"."visitId"
      GROUP BY 
        "visitId",
        CASE WHEN "Conversion"."id" IS NOT NULL THEN 1 ELSE 0 END
    )
    SELECT 
      pages[1] as entry_page,
      pages[array_length(pages, 1)] as exit_page,
      COUNT(*) as visitors,
      SUM(converted) as conversions,
      AVG(page_views) as avg_page_views,
      AVG(time_on_site) as avg_time_on_site,
      SUM(converted)::float / COUNT(*) as conversion_rate
    FROM ConversionPath
    GROUP BY entry_page, exit_page
    ORDER BY visitors DESC
  `;
}

export function buildSplitTestAggregation() {
  return Prisma.sql`
    WITH VariantStats AS (
      SELECT 
        "splitTestId",
        "variantId",
        COUNT(DISTINCT "Click"."id") as clicks,
        COUNT(DISTINCT "Conversion"."id") as conversions,
        SUM("Conversion"."value") as revenue
      FROM "Click"
      LEFT JOIN "Conversion" ON "Click"."id" = "Conversion"."clickId"
      WHERE "Conversion"."status" = 'COMPLETED'
      GROUP BY "splitTestId", "variantId"
    )
    SELECT 
      "SplitTest"."id",
      "SplitTest"."name",
      "SplitTestVariant"."id" as variant_id,
      "SplitTestVariant"."name" as variant_name,
      "VariantStats"."clicks",
      "VariantStats"."conversions",
      "VariantStats"."revenue",
      "VariantStats"."conversions"::float / NULLIF("VariantStats"."clicks", 0) as conversion_rate
    FROM "SplitTest"
    JOIN "SplitTestVariant" ON "SplitTest"."id" = "SplitTestVariant"."splitTestId"
    LEFT JOIN "VariantStats" ON "SplitTestVariant"."id" = "VariantStats"."variantId"
    WHERE "SplitTest"."status" = 'ACTIVE'
  `;
}