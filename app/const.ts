export enum AppRouteEnum {
  Root = '/',
  About = '/about',
  Delivery = '/delivery',
  Profile = '/profile',
  Admin = '/admin',
  Signin = '',
}

export enum NavLinksEnum {
  Root = 'головна',
  Delivery = 'оплата та доставка',
  About = 'про нас',
  Profile = 'профіль',
  Admin = 'адмін',
  Signin = 'вхід',
}

export const NavLinks = [
  { link: AppRouteEnum.Root, name: NavLinksEnum.Root },
  { link: AppRouteEnum.About, name: NavLinksEnum.About },
  { link: AppRouteEnum.Delivery, name: NavLinksEnum.Delivery },
  { link: AppRouteEnum.Signin, name: NavLinksEnum.Signin },
  { link: AppRouteEnum.Profile, name: NavLinksEnum.Profile },
  { link: AppRouteEnum.Admin, name: NavLinksEnum.Admin },
];

export enum ApiCollectionEnum {
  Users = 'users',
  Cards = 'cards',
  Carts = 'carts',
  ActiveOrders = 'activeOrders',
  ClosedOrders = 'closedOrders',
}

export enum StorageFolderEnum {
  CardImages = 'card-images',
  UserImages = 'user-images',
}

export enum UserRoleEnum {
  User = 'user',
  Editor = 'editor',
  Admin = 'admin',
}

export enum CategoryEnum {
  Clothes = 'одяг',
  Footwear = 'взуття',
  Accessories = 'аксесуари',
  Other = 'інше',
}

export enum AgeCategoryEnum {
  Adult = 'дорослі',
  Children = 'діти',
  None = 'відсутня',
}

export enum GenderEnum {
  Male = 'чоловіча',
  Female = 'жіноча',
  Unisex = 'унісекс',
  None = 'відсутня',
}

export enum CardEnum {
  ItemId = 'артикул',
  Price = 'ціна',
  Description = 'опис',
  Weight = 'вага',
  Category = 'категорія',
  AgeCategory = 'вікова категорія',
  Gender = 'стать',
  Sizes = 'розміри',
  ImagePath = 'путь завантаженного файла',
}

export enum SizesEnum {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

export enum ConvertedTimestampFormat {
  MessageFormat = 'meassage',
  UserFormat = 'user',
}

export enum SidebarUserTabs {
  Info = 'info',
  Update = 'update',
  Orders = 'orders',
  Feedback = 'feedback',
  DeleteAccount = 'deleteAccount',
}

export enum SidebarAdminTabs {
  AddCard = 'addCard',
  DeleteCard = 'deleteCard',
  OpenOrders = 'activeOrders',
  ClosedOrders = 'closedOrders',
  Users = 'users',
}

export enum CardsRenderType {
  FormAddUpdateCardCards = 'formAddUpdateCardCards',
  FormRemoveCardCards = 'formRemoveCardCards',
  MainPageCards = 'mainPageCards',
}

export const VERIFY_EMAIL_EXPIRED_TIME = 60 * 60 * 1000; // 1 hour

export const CARDS_PER_PAGE = 5;

export const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
];
