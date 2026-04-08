export interface ElementoMenuPadre {
  nombre: string;
  icono?: string;
  subelementos: ElementoMenu[];
  regla?: string;
  color?: string;
  variant?: string;
}

export interface ElementoMenuHijo {
  nombre: string;
  icono?: string;
  url: string;
  regla?: string;
  color?: string;
  variant?: string;
}

export type ElementoMenu = ElementoMenuPadre | ElementoMenuHijo;