import React from "react";

const Link = props => {
  const {
    link: { description, url }
  } = props;

  return (
    <div>
      <div>
        {description} ({url})
      </div>
    </div>
  );
};

export default Link;
