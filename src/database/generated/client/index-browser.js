
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 3.8.1
 * Query Engine version: 34df67547cf5598f5a6cd3eb45f14ee70c3fb86f
 */
Prisma.prismaVersion = {
  client: "3.8.1",
  engine: "34df67547cf5598f5a6cd3eb45f14ee70c3fb86f"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = 'DbNull'
Prisma.JsonNull = 'JsonNull'
Prisma.AnyNull = 'AnyNull'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.VerificationScalarFieldEnum = makeEnum({
  id: 'id',
  type: 'type',
  otpCode: 'otpCode',
  email: 'email',
  tel: 'tel',
  context: 'context',
  pwdRecoverKey: 'pwdRecoverKey',
  hasBeenVerified: 'hasBeenVerified',
  expireAt: 'expireAt'
});

exports.Prisma.CategoryScalarFieldEnum = makeEnum({
  id: 'id',
  title: 'title',
  slug: 'slug',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  parentId: 'parentId',
  iconImageId: 'iconImageId',
  bannerImageId: 'bannerImageId'
});

exports.Prisma.MarqueScalarFieldEnum = makeEnum({
  id: 'id',
  imageId: 'imageId',
  name: 'name',
  categoryId: 'categoryId'
});

exports.Prisma.DiscountScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  bannerImageId: 'bannerImageId',
  discountType: 'discountType',
  discountNature: 'discountNature',
  discountCode: 'discountCode',
  discount: 'discount',
  startAt: 'startAt',
  endAt: 'endAt',
  inCartProductMin: 'inCartProductMin',
  inCartProductMax: 'inCartProductMax',
  commandAmountMin: 'commandAmountMin',
  commandAmountMax: 'commandAmountMax',
  description: 'description'
});

exports.Prisma.PriceRuleScalarFieldEnum = makeEnum({
  id: 'id',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  amountPercent: 'amountPercent'
});

exports.Prisma.PubScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  bannerImageId: 'bannerImageId',
  link: 'link',
  description: 'description',
  startAt: 'startAt',
  endAt: 'endAt',
  forDiscountId: 'forDiscountId'
});

exports.Prisma.ShippingZoneScalarFieldEnum = makeEnum({
  id: 'id',
  townName: 'townName',
  townCode: 'townCode',
  baseShippingPrice: 'baseShippingPrice'
});

exports.Prisma.ShippingRuleScalarFieldEnum = makeEnum({
  id: 'id',
  ruleName: 'ruleName',
  rule: 'rule',
  description: 'description'
});

exports.Prisma.GeneralMetaScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  key: 'key',
  value: 'value'
});

exports.Prisma.ProductAttributeMetaScalarFieldEnum = makeEnum({
  id: 'id',
  attributeId: 'attributeId',
  name: 'name',
  value: 'value'
});

exports.Prisma.ProductAttributeScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  type: 'type',
  description: 'description',
  global: 'global',
  categoryId: 'categoryId',
  onlyForProductId: 'onlyForProductId'
});

exports.Prisma.TagScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  slug: 'slug'
});

exports.Prisma.CommandUnitScalarFieldEnum = makeEnum({
  id: 'id',
  title: 'title',
  shortCode: 'shortCode'
});

exports.Prisma.CommandUnitProductScalarFieldEnum = makeEnum({
  id: 'id',
  commandUnitId: 'commandUnitId',
  productId: 'productId',
  isDefault: 'isDefault',
  unitPrice: 'unitPrice',
  priceRuleId: 'priceRuleId'
});

exports.Prisma.MediaScalarFieldEnum = makeEnum({
  id: 'id',
  filename: 'filename',
  fileType: 'fileType',
  path: 'path',
  fileDuration: 'fileDuration',
  source: 'source',
  userId: 'userId'
});

exports.Prisma.ProductScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  shortDescription: 'shortDescription',
  type: 'type',
  productWeight: 'productWeight',
  isPublished: 'isPublished',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  sku: 'sku',
  marqueId: 'marqueId',
  variantParentId: 'variantParentId',
  showProduct: 'showProduct',
  hasUserDeleted: 'hasUserDeleted'
});

exports.Prisma.NotificationScalarFieldEnum = makeEnum({
  id: 'id',
  content: 'content',
  title: 'title',
  createdAt: 'createdAt',
  context: 'context',
  priority: 'priority',
  canLockScreen: 'canLockScreen',
  theme: 'theme',
  commandId: 'commandId',
  hasUserRead: 'hasUserRead',
  userId: 'userId'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  passwordHash: 'passwordHash',
  email: 'email',
  phone: 'phone',
  accoundActivated: 'accoundActivated',
  role: 'role',
  currentRole: 'currentRole'
});

exports.Prisma.UserShippingAdressScalarFieldEnum = makeEnum({
  id: 'id',
  shippingZoneId: 'shippingZoneId',
  fullName: 'fullName',
  phone: 'phone',
  alternatePhone: 'alternatePhone',
  adressType: 'adressType',
  quatier: 'quatier',
  hasUserDeleted: 'hasUserDeleted',
  additionalDetails: 'additionalDetails',
  audioFileId: 'audioFileId',
  forUserId: 'forUserId'
});

exports.Prisma.CommandScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  totalPrice: 'totalPrice',
  orderId: 'orderId',
  archived: 'archived',
  delivered: 'delivered',
  status: 'status',
  orderedById: 'orderedById',
  hasUserCanceled: 'hasUserCanceled',
  hasUserDeleted: 'hasUserDeleted',
  shippingAdressId: 'shippingAdressId',
  receiptId: 'receiptId',
  appliedDiscountId: 'appliedDiscountId'
});

exports.Prisma.CommandProductScalarFieldEnum = makeEnum({
  id: 'id',
  productId: 'productId',
  hasUserDeleted: 'hasUserDeleted',
  commandUnitProductId: 'commandUnitProductId',
  quantite: 'quantite',
  commandId: 'commandId',
  hasCustomerConfirmShipping: 'hasCustomerConfirmShipping',
  hasAgentConfirmShipping: 'hasAgentConfirmShipping'
});

exports.Prisma.ReceiptScalarFieldEnum = makeEnum({
  id: 'id',
  amount: 'amount',
  createdAt: 'createdAt',
  hasUserDeleted: 'hasUserDeleted',
  paidAt: 'paidAt',
  isPaid: 'isPaid',
  outPaymentId: 'outPaymentId',
  outPaymentDetails: 'outPaymentDetails',
  receiptMetas: 'receiptMetas',
  receiptMediaId: 'receiptMediaId'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.JsonNullValueInput = makeEnum({
  JsonNull: 'JsonNull'
});

exports.Prisma.NullableJsonNullValueInput = makeEnum({
  DbNull: 'DbNull',
  JsonNull: 'JsonNull'
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: 'DbNull',
  JsonNull: 'JsonNull',
  AnyNull: 'AnyNull'
});


exports.Prisma.ModelName = makeEnum({
  Verification: 'Verification',
  Category: 'Category',
  Marque: 'Marque',
  Discount: 'Discount',
  PriceRule: 'PriceRule',
  Pub: 'Pub',
  ShippingZone: 'ShippingZone',
  ShippingRule: 'ShippingRule',
  GeneralMeta: 'GeneralMeta',
  ProductAttributeMeta: 'ProductAttributeMeta',
  ProductAttribute: 'ProductAttribute',
  Tag: 'Tag',
  CommandUnit: 'CommandUnit',
  CommandUnitProduct: 'CommandUnitProduct',
  Media: 'Media',
  Product: 'Product',
  Notification: 'Notification',
  User: 'User',
  UserShippingAdress: 'UserShippingAdress',
  Command: 'Command',
  CommandProduct: 'CommandProduct',
  Receipt: 'Receipt'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
