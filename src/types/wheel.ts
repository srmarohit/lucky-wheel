export interface Prize {
  /** Stable unique id, used as React key and for removal. */
  id: string;
  /** Display text shown on the wheel segment and in the prize list. */
  label: string;
}
