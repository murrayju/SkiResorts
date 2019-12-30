import React from 'react';
import PropTypes from 'prop-types';
import history from '../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export const withLink = (defaultPrefix = '', defaultTo = '/') => WrappedComponent =>
  class extends React.PureComponent {
    static propTypes = {
      prefix: PropTypes.string,
      to: PropTypes.string,
      onClick: PropTypes.func,
    };

    static defaultProps = {
      prefix: defaultPrefix,
      to: defaultTo,
      onClick: null,
    };

    handleClick = event => {
      const { onClick, to, prefix } = this.props;

      if (onClick) {
        onClick(event);
      }

      if (isModifiedEvent(event) || !isLeftClickEvent(event) || event.defaultPrevented === true) {
        return;
      }

      event.preventDefault();
      if (to != null) {
        history.push(prefix + to);
      }
    };

    render() {
      const { to, prefix, onClick, ...props } = this.props;
      return <WrappedComponent href={prefix + to} {...props} onClick={this.handleClick} />;
    }
  };

export default withLink()(({ children, ...props }) => (
  <a href {...props}>
    {children}
  </a>
));
