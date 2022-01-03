import * as React from 'react';

const ProgressBar = ({ title, current, max, color = "" }) => {

  return (
    <div className="container">
      <h5>{title}</h5>
      <div className="progress">
        <div
          className={`progress-bar progress-bar-striped ${color}`}
          role="progressbar"
          style={{ width: `${Math.floor((current / max) * 100)}%` }}
          aria-valuenow={current}
          aria-valuemin="0"
          aria-valuemax={max}>{`${Math.floor((current / max) * 100)}%` }</div>
      </div>
    </div>
  );

};

export default ProgressBar;