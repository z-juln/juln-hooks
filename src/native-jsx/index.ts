import changeCase from '@juln/change-case';

type Props<T extends HTMLElement = HTMLElement> = React.HTMLAttributes<T> & React.InputHTMLAttributes<HTMLInputElement>;
type PropKeys = keyof Props;

const propMap: Partial<Record<PropKeys, (el: HTMLElement , { className }: Props) => void>> = {
  className: (el, { className }) => className && el.setAttribute('class', className),
  style: (el, { style }) => style && Object.entries(style).forEach(([k, v]) => el.style[k as any] = v),
  children: () => {},
  defaultChecked: (el, { defaultChecked, checked }) => {
    if (typeof checked === 'undefined' && typeof defaultChecked == 'undefined') return;
    (el as HTMLInputElement).checked = (checked ?? defaultChecked)!;
  },
  defaultValue: (el, { defaultValue, value }) => {
    if (typeof defaultValue === 'undefined' && typeof value == 'undefined') return;
    (el as any).value = (value ?? defaultValue)!;
  },
  suppressContentEditableWarning: () => {},
  suppressHydrationWarning: () => {},
  dangerouslySetInnerHTML: (el, { dangerouslySetInnerHTML }) =>
    dangerouslySetInnerHTML?.__html && ((el.innerHTML as any) = dangerouslySetInnerHTML.__html),
};

export const createElement = <T extends HTMLElement = HTMLElement>(
  tag: string | ((props: Props & { children?: HTMLElement[] }) => T),
  props: Props,
  ...children: HTMLElement[]
): T => {
  if (typeof tag === 'function') return tag({ ...props, children });

  const el = document.createElement(tag) as T;

  // props
  for (const _propKey in props) {
    const propKey = _propKey as PropKeys;
    const propValue = props[propKey];

    if (Object.prototype.hasOwnProperty.call(propMap, propKey)) {
      propMap[propKey]!(el, props);
    }

    if (propKey.startsWith('on')) {
      const attrKey = changeCase(propKey, 'lower-camel-case');
      el.setAttribute(attrKey, attrKey);
    } else {
      el.setAttribute(propKey, propValue);
    }
  }

  // children
  el.append(...children);

  return el;
};

export const Fragment = () => document.createDocumentFragment();
