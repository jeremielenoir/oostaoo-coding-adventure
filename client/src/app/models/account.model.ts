import { Offer } from './offer.model';

/**
 *
 */
export const enum AccountType {
  PROFESIONAL = 'profesional',
  PERSONAL = 'personal'
}
/**
 *
 */
export interface Address {
  id: number;
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
  phone: string;
  customeraccount?: CustomerAccount;
}
/**
 *
 */
export interface Entreprise {

}
/**
 *
 */
export interface CustomerAccount {
  id: number;
  type: AccountType;
  tests_stock: number;
  offer?: Offer;
  entreprise?: Entreprise;
  stripe_customer_id?: string;
  billing_address?: Address;
}
