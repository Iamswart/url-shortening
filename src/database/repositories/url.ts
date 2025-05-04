import { Op, Sequelize, Transaction } from "sequelize";

import Url, { UrlAttributes } from "../models/url";

export const createUrl = (
  url: Partial<UrlAttributes>,
  transaction?: Transaction
): Promise<UrlAttributes> =>
  Url.create(url, {
    ...(transaction ? { transaction } : {}),
  });

export const updateUrl = (
  id: number,
  url: Partial<UrlAttributes>,
  transaction?: Transaction
) =>
  Url.update(url, {
    where: {
      id,
    },
    ...(transaction ? { transaction } : {}),
  });

export const findUrl = (
  data: Partial<UrlAttributes>,
  attributes?: string[],
  transaction?: Transaction,
  include?: any
): Promise<UrlAttributes | null> =>
  Url.findOne({
    where: data,
    raw: true,
    transaction,
    ...(attributes ? { attributes } : {}),
    ...(include ? { include } : {}),
  });

export const fetchUrls = (
  data?: Partial<UrlAttributes>,
  attributes?: string[],
  transaction?: Transaction,
  options?: {
    limit?: number;
    offset?: number;
    order?: [string, string][];
  }
): Promise<UrlAttributes[]> =>
  Url.findAll({
    where: data,
    raw: true,
    transaction,
    ...(attributes ? { attributes } : {}),
    ...(options?.limit && { limit: options.limit }),
    ...(options?.offset && { offset: options.offset }),
    ...(options?.order && { order: options.order }),
  });

export const fetchUrlCount = (
  data?: Partial<UrlAttributes>,
  transaction?: Transaction
): Promise<number> =>
  Url.count({
    where: data,
    transaction,
  });

export const fetchAndCountUrls = (
  {
    searchTerm,
    filters,
  }: {
    searchTerm?: string;
    filters?: Partial<UrlAttributes>;
  },
  queryOptions?: {
    limit?: number;
    offset?: number;
  }
): Promise<{
  rows: Url[];
  count: number;
}> =>
  Url.findAndCountAll({
    where: {
      ...(searchTerm && {
        [Op.or]: [
          { original_url: { [Op.like]: `%${searchTerm}%` } },
          { short_path: { [Op.like]: `%${searchTerm}%` } },
        ],
      }),
      ...filters,
    },
    attributes: [
      "id",
      "original_url",
      "short_path",
      "visit_count",
      "created_at",
    ],
    order: [["created_at", "DESC"]],
    ...queryOptions,
  });
