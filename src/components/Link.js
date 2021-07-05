// @flow
import React, { type AbstractComponent, type Node } from 'react';

function isLeftClickEvent(event: SyntheticMouseEvent<HTMLElement>) {
  return event.button === 0;
}

function isModifiedEvent(event: SyntheticMouseEvent<HTMLElement>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

type HistoryInterface = {
  push: (string) => void,
};

export type WithLinkOptions = {|
  prefix?: string,
  to?: string,
  history?: ?HistoryInterface,
|};

type ExtendedProps<Props> = {|
  ...Props,
  ...WithLinkOptions,
  children?: Node,
  href?: string,
  onClick?: (event: SyntheticMouseEvent<HTMLElement>) => void,
|};

type WithLink = (
  opts?: WithLinkOptions,
) => <Props>(toWrap: AbstractComponent<Props>) => AbstractComponent<ExtendedProps<Props>>;

export const withLink: WithLink =
  ({
    prefix: defaultPrefix = '',
    to: defaultTo = '/',
    history: defaultHistory = null,
  }: WithLinkOptions = {}) =>
  <Props>(WrappedComponent: AbstractComponent<Props>): AbstractComponent<ExtendedProps<Props>> =>
  ({
    onClick,
    to = defaultTo,
    prefix = defaultPrefix,
    history = defaultHistory,
    ...props
  }: ExtendedProps<Props>): Node =>
    (
      <WrappedComponent
        href={prefix + to}
        {...props}
        onClick={(event: SyntheticMouseEvent<HTMLElement>) => {
          if (onClick) {
            onClick(event);
          }

          if (
            isModifiedEvent(event) ||
            !isLeftClickEvent(event) ||
            event.defaultPrevented === true
          ) {
            return;
          }

          if (history && to != null) {
            event.preventDefault();
            history.push(prefix + to);
          }
        }}
      />
    );

type LinkProps = {| external?: boolean, target?: string, rel?: string |};

export const Link: AbstractComponent<ExtendedProps<LinkProps>> = withLink()(
  ({ children, external, target, rel, ...props }: ExtendedProps<LinkProps>) => (
    <a
      href
      {...props}
      target={target ?? (external ? '_blank' : null)}
      rel={rel ?? (external ? 'noopener noreferrer' : null)}
    >
      {children}
    </a>
  ),
);

export default Link;
