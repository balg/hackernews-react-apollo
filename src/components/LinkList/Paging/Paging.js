import React from "react";

const Paging = props => {
  return (
    <div className="flex ml4 mv3 gray">
      <div className="pointer mr2" onClick={props.previousPage}>
        Previous
      </div>
      <div className="pointer" onClick={props.nextPage}>
        Next
      </div>
    </div>
  );
};

export default Paging;
