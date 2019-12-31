// @flow
/* eslint-disable react/no-danger, jsx-a11y/control-has-associated-label */
import * as React from 'react';
import serialize from 'serialize-javascript';

import fontAwesome from '@fortawesome/fontawesome-free/css/all.css';
// $FlowFixMe
import bs from '../bs-theme.less'; // eslint-disable-line

type Props = {
  title: string,
  description: string,
  scripts?: ?(string[]),
  app?: ?Object,
  children: React.Node,
  styleTags: any,
};

const styles = {
  bs: bs.toString(),
  fontAwesome: fontAwesome.toString(),
};

const Html = ({ title, description, scripts, app, children, styleTags }: Props) => (
  <html className="no-js" lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {scripts &&
        scripts.map(script => <link key={script} rel="preload" href={script} as="script" />)}
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="apple-touch-icon" href="/icon.png" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
        rel="stylesheet"
      />
      {Object.entries(styles).map(([id, css]) => (
        <style key={id} id={id} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      {styleTags}
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
      {app ? <script dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }} /> : null}
      {scripts && scripts.map(script => <script key={script} src={script} />)}
    </body>
  </html>
);
Html.defaultProps = {
  app: null,
  scripts: null,
};

export default Html;
