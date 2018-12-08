import React, { PureComponent } from 'react';
import { Manager, Popper, Arrow, Target } from 'react-popper';

interface IwithTooltipProps {
  placement?: string;
  content: string | ((props: any) => JSX.Element);
  className?: string;
}

export function withTooltip(WrappedComponent) {
  return class extends React.Component<IwithTooltipProps, any> {
    constructor(props) {
      super(props);

      this.setState = this.setState.bind(this);
      this.state = {
        placement: this.props.placement || 'auto',
        show: false,
      };
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.placement && nextProps.placement !== this.state.placement) {
        this.setState(prevState => {
          return {
            ...prevState,
            placement: nextProps.placement,
          };
        });
      }
    }

    renderContent(content) {
      if (typeof content === 'function') {
        // If it's a function we assume it's a React component
        const ReactComponent = content;
        return <ReactComponent />;
      }
      return content;
    }

    render() {
      const { content, className } = this.props;

      return (
        <Manager className={`popper__manager ${className || ''}`}>
          <WrappedComponent {...this.props} tooltipSetState={this.setState} />
          {this.state.show ? (
            <Popper placement={this.state.placement} className="popper zbx-tooltip">
              {this.renderContent(content)}
              <Arrow className="popper__arrow" />
            </Popper>
          ) : null}
        </Manager>
      );
    }
  };
}

interface Props {
  tooltipSetState: (prevState: object) => void;
}

class Tooltip extends PureComponent<Props> {
  showTooltip = () => {
    const { tooltipSetState } = this.props;

    tooltipSetState(prevState => ({
      ...prevState,
      show: true,
    }));
  };

  hideTooltip = () => {
    const { tooltipSetState } = this.props;
    tooltipSetState(prevState => ({
      ...prevState,
      show: false,
    }));
  };

  render() {
    return (
      <Target className="popper__target" onMouseOver={this.showTooltip} onMouseOut={this.hideTooltip}>
        {this.props.children}
      </Target>
    );
  }
}

export default withTooltip(Tooltip);